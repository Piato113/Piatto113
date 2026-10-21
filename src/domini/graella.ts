import type { Apat, Dia, Graella } from './tipus';

export const DIES: readonly Dia[] = ['dl', 'dt', 'dc', 'dj', 'dv', 'ds', 'dg'];
export const APATS: readonly Apat[] = ['dinar', 'sopar'];

const CAP_DE_SETMANA: ReadonlySet<Dia> = new Set(['ds', 'dg']);

/** Per defecte: només sopar de dilluns a divendres; dinar i sopar dissabte i diumenge. */
export function graellaPerDefecte(): Graella {
  const graella = {} as Graella;
  for (const dia of DIES) {
    graella[dia] = { dinar: CAP_DE_SETMANA.has(dia), sopar: true };
  }
  return graella;
}

/** Retorna una graella nova amb un àpat marcat o desmarcat. */
export function canviarApat(graella: Graella, dia: Dia, apat: Apat, marcat: boolean): Graella {
  return { ...graella, [dia]: { ...graella[dia], [apat]: marcat } };
}

/** Àpats marcats, en ordre de la setmana (dilluns dinar, dilluns sopar, dimarts…). */
export function apatsMarcats(graella: Graella): { dia: Dia; apat: Apat }[] {
  const resultat: { dia: Dia; apat: Apat }[] = [];
  for (const dia of DIES) {
    for (const apat of APATS) {
      if (graella[dia][apat]) resultat.push({ dia, apat });
    }
  }
  return resultat;
}
