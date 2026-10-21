import { formatEuros, formatNombre } from '../domini';

/** Imports sense que l'euro quedi sol a la línia següent: «6,52 €» amb espai no separable. */
export const euros = (centims: number): string => formatEuros(centims).replace(/ €$/, ' €');

/** Durada d'un cronòmetre: «18 min», «1 h 30 min», «45 s». */
export function durada(segons: number): string {
  if (segons < 60) return `${segons} s`;
  const minuts = segons / 60;
  if (minuts < 60) return `${formatNombre(minuts, 1)} min`;
  const hores = Math.floor(minuts / 60);
  const resta = Math.round(minuts - hores * 60);
  return resta > 0 ? `${hores} h ${resta} min` : `${hores} h`;
}
