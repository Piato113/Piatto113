import type { Cataleg } from './cataleg';
import { escalarRecepta, type LiniaEscalada } from './escalat';
import { formatQuantitat } from './format';
import type { Cronometre, Recepta } from './tipus';
import { milesimesAMostrar } from './unitats';

/** `{ingredientId}` o `{ingredientId:numerador/denominador}`. */
const REFERENCIA = /\{([a-z0-9-]+)(?::(\d+)\/(\d+))?\}/g;

export interface Referencia {
  ingredientId: string;
  numerador: number;
  denominador: number;
}

/** Referències a ingredients que hi ha dins del text d'un pas. */
export function referenciesPas(text: string): Referencia[] {
  return [...text.matchAll(REFERENCIA)].map((m) => ({
    ingredientId: m[1]!,
    numerador: m[2] ? Number(m[2]) : 1,
    denominador: m[3] ? Number(m[3]) : 1,
  }));
}

/** Text d'una quantitat escalada (o una fracció) en la unitat de la recepta: «450 g», «1½ u». */
export function textQuantitat(linia: LiniaEscalada, numerador = 1, denominador = 1): string {
  const milesimes = (linia.milesimes * numerador) / denominador;
  const quantitat = milesimesAMostrar(milesimes / linia.factorRecepta, linia.unitatRecepta, linia.indivisible);
  return formatQuantitat(quantitat, linia.unitatRecepta);
}

export interface PasPreparat {
  numero: number;
  text: string;
  cronometre?: Cronometre;
}

export interface ReceptaPreparada {
  recepta: Recepta;
  ingredients: LiniaEscalada[];
  passos: PasPreparat[];
}

/** Recepta amb les quantitats i els passos escalats a les racions de la família. */
export function prepararRecepta(cataleg: Cataleg, recepta: Recepta, racionsCentesimes: number): ReceptaPreparada {
  const ingredients = escalarRecepta(cataleg, recepta, racionsCentesimes);
  const perId = new Map(ingredients.map((l) => [l.ingredientId, l]));

  const passos = (recepta.passos ?? []).map((pas, i): PasPreparat => {
    const text = pas.text.replace(REFERENCIA, (original, id: string, num?: string, den?: string) => {
      const linia = perId.get(id);
      return linia ? textQuantitat(linia, num ? Number(num) : 1, den ? Number(den) : 1) : original;
    });
    return pas.cronometre ? { numero: i + 1, text, cronometre: pas.cronometre } : { numero: i + 1, text };
  });

  return { recepta, ingredients, passos };
}

/** Errors dels passos d'una recepta (buit si són correctes). */
export function validarPassos(recepta: Recepta): string[] {
  const passos = recepta.passos;
  if (!passos) return [];
  if (passos.length === 0) return [`Recepta «${recepta.id}»: sense passos`];
  const errors: string[] = [];
  const propis = new Set(recepta.ingredients.map((l) => l.ingredientId));
  const esmentats = new Set<string>();

  passos.forEach((pas, i) => {
    const on = `Recepta «${recepta.id}», pas ${i + 1}`;
    if (pas.text.trim() === '') errors.push(`${on}: text buit`);
    for (const ref of referenciesPas(pas.text)) {
      esmentats.add(ref.ingredientId);
      if (!propis.has(ref.ingredientId)) errors.push(`${on}: «${ref.ingredientId}» no és un ingredient de la recepta`);
      if (ref.numerador <= 0 || ref.denominador <= 0 || ref.numerador > ref.denominador) {
        errors.push(`${on}: fracció no vàlida de «${ref.ingredientId}»`);
      }
    }
    if (pas.cronometre) {
      if (!Number.isInteger(pas.cronometre.segons) || pas.cronometre.segons <= 0) errors.push(`${on}: cronòmetre no vàlid`);
      if (pas.cronometre.nom.trim() === '') errors.push(`${on}: cronòmetre sense nom`);
    }
  });

  for (const id of propis) {
    if (!esmentats.has(id)) errors.push(`Recepta «${recepta.id}»: l'ingredient «${id}» no surt a cap pas`);
  }
  return errors;
}
