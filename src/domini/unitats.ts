import type { Ingredient, LiniaRecepta, Unitat } from './tipus';

/**
 * Els càlculs intermedis es fan en mil·lèsimes de la unitat base (enters),
 * per poder sumar mitja ceba de dues receptes sense errors d'arrodoniment.
 * Només s'arrodoneix a la unitat base al final.
 */
export const MILESIMES = 1000;

export class ErrorUnitat extends Error {
  constructor(
    public readonly ingredientId: string,
    public readonly de: Unitat,
    public readonly a: Unitat,
  ) {
    super(`L'ingredient «${ingredientId}» no declara cap conversió de ${de} a ${a}`);
    this.name = 'ErrorUnitat';
  }
}

/** Unitats base que equivalen a 1 de `unitat`, o `null` si no es pot convertir. */
export function factorConversio(ingredient: Ingredient, unitat: Unitat): number | null {
  if (unitat === ingredient.unitat) return 1;
  const factor = ingredient.conversions?.[unitat];
  return factor !== undefined && factor > 0 ? factor : null;
}

/** Quantitat d'una línia de recepta en mil·lèsimes de la unitat base de l'ingredient. */
export function liniaAMilesimes(linia: LiniaRecepta, ingredient: Ingredient): number {
  const unitat = linia.unitat ?? ingredient.unitat;
  const factor = factorConversio(ingredient, unitat);
  if (factor === null) throw new ErrorUnitat(ingredient.id, unitat, ingredient.unitat);
  return Math.round(linia.quantitat * factor * MILESIMES);
}

/** Arrodoneix cap amunt a la unitat base (per comprar no pot faltar res). */
export function milesimesACompra(milesimes: number): number {
  return Math.ceil(milesimes / MILESIMES);
}

/**
 * Quantitat per mostrar dins d'una recepta:
 * grams i mil·lilitres a l'enter més proper (mínim 1);
 * unitats arrodonides cap amunt al mig (½), o a l'enter si són indivisibles.
 */
export function milesimesAMostrar(milesimes: number, unitat: Unitat, indivisible = false): number {
  if (milesimes <= 0) return 0;
  if (unitat === 'u' && indivisible) return Math.ceil(milesimes / MILESIMES - 1e-9);
  if (unitat === 'u') return Math.ceil(milesimes / (MILESIMES / 2) - 1e-9) / 2;
  return Math.max(1, Math.round(milesimes / MILESIMES));
}
