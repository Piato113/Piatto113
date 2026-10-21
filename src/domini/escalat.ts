import { ingredient, type Cataleg } from './cataleg';
import type { ApatPlanificat, Assistencia, Persona, Recepta, Unitat } from './tipus';
import { factorConversio, liniaAMilesimes, milesimesAMostrar } from './unitats';

/** Racions efectives de la família en centèsimes: suma dels factors de gana. */
export function racionsEfectives(persones: Persona[]): number {
  return persones.reduce((suma, p) => suma + p.ganaCentesimes, 0);
}

/** Màxim de convidats en un àpat. */
export const MAX_CONVIDATS = 20;

/**
 * Assistència vàlida per a aquesta família, o `undefined` si hi és tothom i no hi ha convidats.
 * Treu índexs que ja no existeixen i repetits; si no quedaria ningú a taula, ignora les absències.
 */
export function normalitzarAssistencia(persones: readonly Persona[], assistencia: Assistencia | undefined): Assistencia | undefined {
  if (!assistencia) return undefined;
  const convidats = Math.min(MAX_CONVIDATS, Math.max(0, Math.trunc(assistencia.convidats) || 0));
  let absents = [...new Set(assistencia.absents)].filter((i) => Number.isInteger(i) && i >= 0 && i < persones.length).sort((a, b) => a - b);
  if (absents.length === persones.length && convidats === 0) absents = [];
  return absents.length === 0 && convidats === 0 ? undefined : { absents, convidats };
}

/** Persones que seuen a taula en un àpat (família present + convidats). */
export function comensals(persones: readonly Persona[], assistencia: Assistencia | undefined): number {
  const a = normalitzarAssistencia(persones, assistencia);
  return a ? persones.length - a.absents.length + a.convidats : persones.length;
}

/** Racions d'un àpat en centèsimes: la gana de qui hi és, més una ració normal per convidat. */
export function racionsApat(persones: Persona[], apat: Pick<ApatPlanificat, 'assistencia'>): number {
  const a = normalitzarAssistencia(persones, apat.assistencia);
  if (!a) return racionsEfectives(persones);
  return racionsEfectives(persones.filter((_, i) => !a.absents.includes(i))) + a.convidats * 100;
}

/**
 * Copia l'assistència d'un menú anterior als àpats nous del mateix dia i àpat
 * (quan es torna a fer el menú, la gent que ve a sopar no canvia).
 */
export function conservarAssistencia(
  persones: readonly Persona[],
  nous: readonly ApatPlanificat[],
  anteriors: readonly ApatPlanificat[],
): ApatPlanificat[] {
  return nous.map((a) => {
    const vell = anteriors.find((x) => x.dia === a.dia && x.apat === a.apat);
    const assistencia = normalitzarAssistencia(persones, vell?.assistencia);
    const { assistencia: _treta, ...sense } = a;
    return assistencia ? { ...sense, assistencia } : sense;
  });
}

export interface LiniaEscalada {
  ingredientId: string;
  unitat: Unitat;
  /** Quantitat exacta en mil·lèsimes de la unitat base (per sumar a la llista). */
  milesimes: number;
  /** Quantitat arrodonida en unitat base. */
  quantitat: number;
  /** Unitat en què l'escriu la recepta (p. ex. 'u' per a «1 ceba»). */
  unitatRecepta: Unitat;
  /** Quantitat arrodonida en la unitat de la recepta, per mostrar-la. */
  quantitatRecepta: number;
  /** Unitats base que fa 1 de la unitat de la recepta. */
  factorRecepta: number;
  /** Peces senceres (ous, grans d'all…). */
  indivisible: boolean;
}

/**
 * Escala una recepta a les racions efectives (en centèsimes).
 * quantitat escalada = quantitat × racions efectives ÷ racions de la recepta
 */
export function escalarRecepta(cataleg: Cataleg, recepta: Recepta, racionsCentesimes: number): LiniaEscalada[] {
  return recepta.ingredients.map((linia) => {
    const ing = ingredient(cataleg, linia.ingredientId);
    const base = liniaAMilesimes(linia, ing);
    const milesimes = Math.round((base * racionsCentesimes) / (recepta.racions * 100));
    const unitatRecepta = linia.unitat ?? ing.unitat;
    const factorRecepta = factorConversio(ing, unitatRecepta) ?? 1;
    const indivisible = ing.indivisible === true;
    return {
      ingredientId: ing.id,
      unitat: ing.unitat,
      milesimes,
      quantitat: milesimesAMostrar(milesimes, ing.unitat, indivisible),
      unitatRecepta,
      quantitatRecepta: milesimesAMostrar(milesimes / factorRecepta, unitatRecepta, indivisible),
      factorRecepta,
      indivisible,
    };
  });
}
