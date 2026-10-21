import { ingredient, type Cataleg } from './cataleg';
import type { Persona, Recepta, Unitat } from './tipus';
import { factorConversio, liniaAMilesimes, milesimesAMostrar } from './unitats';

/** Racions efectives de la família en centèsimes: suma dels factors de gana. */
export function racionsEfectives(persones: Persona[]): number {
  return persones.reduce((suma, p) => suma + p.ganaCentesimes, 0);
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
