import { ingredient, type Cataleg } from './cataleg';
import { escalarRecepta } from './escalat';
import type { Preu, Recepta } from './tipus';

export interface CostIngredient {
  /** paquets = ⌈necessari ÷ mida del paquet⌉ */
  paquets: number;
  midaPaquet: number;
  /** cost de compra = paquets × preu del paquet */
  costCompraCentims: number;
  /** cost consumit = necessari × preu del paquet ÷ mida del paquet */
  costConsumitCentims: number;
}

/** Cost d'una quantitat (en unitat base, entera) segons el preu del paquet. */
export function costIngredient(quantitat: number, preu: Preu): CostIngredient {
  const paquets = quantitat > 0 ? Math.ceil(quantitat / preu.midaPaquet) : 0;
  return {
    paquets,
    midaPaquet: preu.midaPaquet,
    costCompraCentims: paquets * preu.preuCentims,
    costConsumitCentims: Math.round((quantitat * preu.preuCentims) / preu.midaPaquet),
  };
}

/**
 * Cost consumit d'una recepta a unes racions (cèntims), sense el rebost.
 * Serveix per comparar receptes entre si: no depèn dels paquets que comparteixen.
 * Els ingredients sense preu no sumen.
 */
export function costRecepta(cataleg: Cataleg, recepta: Recepta, racionsCentesimes: number): number {
  let total = 0;
  for (const linia of escalarRecepta(cataleg, recepta, racionsCentesimes)) {
    if (ingredient(cataleg, linia.ingredientId).rebost) continue;
    const preu = cataleg.preus.get(linia.ingredientId);
    if (!preu) continue;
    total += (linia.milesimes * preu.preuCentims) / (preu.midaPaquet * 1000);
  }
  return Math.round(total);
}
