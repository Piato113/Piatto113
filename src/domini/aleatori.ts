/**
 * Generador pseudoaleatori reproduïble (mulberry32):
 * la mateixa llavor dona sempre la mateixa seqüència, i per tant el mateix menú.
 */
export function generadorAleatori(llavor: number): () => number {
  let estat = llavor >>> 0;
  return () => {
    estat = (estat + 0x6d2b79f5) >>> 0;
    let t = estat;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Llavor nova per a una planificació (es desa amb el menú per poder-lo reproduir). */
export function novaLlavor(): number {
  return Math.floor(Math.random() * 4294967296) >>> 0;
}
