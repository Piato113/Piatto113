import { ingredient, recepta, type Cataleg } from './cataleg';
import { costIngredient, type CostIngredient } from './cost';
import { escalarRecepta } from './escalat';
import type { Unitat } from './tipus';
import { milesimesACompra } from './unitats';

export interface ElementLlista {
  ingredientId: string;
  nom: string;
  unitat: Unitat;
  /** Quantitat total a comprar, en unitat base, arrodonida cap amunt. */
  quantitat: number;
  rebost: boolean;
  seccio: string;
  /** Receptes de la setmana que fan servir l'ingredient (sense repetir). */
  receptes: string[];
  /** `null` si l'ingredient no té preu al catàleg. */
  cost: CostIngredient | null;
}

export interface LlistaCompra {
  elements: ElementLlista[];
  /** Suma del cost de compra, sense rebost. És el que es compara amb el pressupost. */
  totalCompraCentims: number;
  /** Suma del cost consumit, sense rebost. */
  totalConsumitCentims: number;
  /** Ingredients que no són de rebost i no tenen preu: el total està incomplet. */
  senseCost: string[];
}

const SENSE_SECCIO = 'altres';

/** Recepta de la llista amb les seves racions, quan no són les de tota la família (convidats, algú que no hi és). */
export interface ReceptaAmbRacions {
  receptaId: string;
  racionsCentesimes: number;
}

/**
 * Llista de compra unificada: suma cada ingredient de tots els àpats
 * (en mil·lèsimes exactes) i només arrodoneix al final.
 * Cada recepta s'escala a `racionsCentesimes`, o a les seves pròpies si se n'indiquen.
 */
export function generarLlista(
  cataleg: Cataleg,
  receptes: readonly (string | ReceptaAmbRacions)[],
  racionsCentesimes: number,
): LlistaCompra {
  const acumulat = new Map<string, { milesimes: number; receptes: Set<string> }>();

  for (const r of receptes) {
    const id = typeof r === 'string' ? r : r.receptaId;
    const racions = typeof r === 'string' ? racionsCentesimes : r.racionsCentesimes;
    for (const linia of escalarRecepta(cataleg, recepta(cataleg, id), racions)) {
      const actual = acumulat.get(linia.ingredientId) ?? { milesimes: 0, receptes: new Set<string>() };
      actual.milesimes += linia.milesimes;
      actual.receptes.add(id);
      acumulat.set(linia.ingredientId, actual);
    }
  }

  const elements: ElementLlista[] = [];
  const senseCost: string[] = [];
  let totalCompraCentims = 0;
  let totalConsumitCentims = 0;

  for (const [ingredientId, { milesimes, receptes }] of acumulat) {
    const ing = ingredient(cataleg, ingredientId);
    const quantitat = milesimesACompra(milesimes);
    const rebost = ing.rebost === true;
    const preu = cataleg.preus.get(ingredientId);
    const cost = preu ? costIngredient(quantitat, preu) : null;

    if (!rebost) {
      if (cost) {
        totalCompraCentims += cost.costCompraCentims;
        totalConsumitCentims += cost.costConsumitCentims;
      } else {
        senseCost.push(ingredientId);
      }
    }

    elements.push({
      ingredientId,
      nom: ing.nom,
      unitat: ing.unitat,
      quantitat,
      rebost,
      seccio: ing.seccio ?? SENSE_SECCIO,
      receptes: [...receptes],
      cost,
    });
  }

  // Ordre: primer el que s'ha de comprar, per secció i nom; el rebost al final.
  elements.sort(
    (a, b) =>
      Number(a.rebost) - Number(b.rebost) ||
      a.seccio.localeCompare(b.seccio, 'ca') ||
      a.nom.localeCompare(b.nom, 'ca'),
  );

  return { elements, totalCompraCentims, totalConsumitCentims, senseCost };
}

export interface SeccioLlista {
  seccio: string;
  rebost: boolean;
  elements: ElementLlista[];
}

/**
 * Agrupa la llista per seccions del súper, en l'ordre de la llista
 * (primer el que s'ha de comprar; el rebost, al final i en una sola secció).
 */
export function agruparPerSeccio(elements: readonly ElementLlista[]): SeccioLlista[] {
  const seccions: SeccioLlista[] = [];
  for (const e of elements) {
    const clau = e.rebost ? 'rebost' : e.seccio;
    const actual = seccions.find((s) => s.seccio === clau && s.rebost === e.rebost);
    if (actual) actual.elements.push(e);
    else seccions.push({ seccio: clau, rebost: e.rebost, elements: [e] });
  }
  return seccions;
}
