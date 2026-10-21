import { ingredient, type Cataleg } from './cataleg';
import type { Persona, Recepta, Unitat } from './tipus';
import { liniaAMilesimes, milesimesAMostrar } from './unitats';

/** Racions efectives de la família en centèsimes: suma dels factors de gana. */
export function racionsEfectives(persones: Persona[]): number {
  return persones.reduce((suma, p) => suma + p.ganaCentesimes, 0);
}

export interface LiniaEscalada {
  ingredientId: string;
  unitat: Unitat;
  /** Quantitat exacta en mil·lèsimes de la unitat base (per sumar a la llista). */
  milesimes: number;
  /** Quantitat arrodonida per mostrar dins la recepta. */
  quantitat: number;
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
    return {
      ingredientId: ing.id,
      unitat: ing.unitat,
      milesimes,
      quantitat: milesimesAMostrar(milesimes, ing.unitat),
    };
  });
}
