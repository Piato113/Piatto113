import { MESOS_HIVERN, type Recepta } from '../domini';

// Mesos de temporada de les receptes que no surten igual tot l'any. En temporada surten més sovint;
// fora de temporada, molt menys (vegeu `factorTemporada` al planificador).
// Un test comprova que tots els identificadors existeixen.

/** Calçots: de gener a abril. */
const MESOS_CALCOTS = [1, 2, 3, 4];

/** Plats d'hivern (cremes, plats de cullera i guisats): de novembre a març. */
const HIVERN = [
  'crema-xampinyons',
  'crema-broquil-alvocat',
  'crema-coliflor-rostida',
  'crema-remolatxa-poma',
  'crema-esparrecs-porro',
  'crema-moniato-llenties',
  'crema-pebrot-rostit',
  'sopa-juliana-gall-dindi',
  'sopa-peix-safra',
  'mongetes-cloisses',
  'potatge-vigilia',
  'sipia-pesols',
  'sopa-col-cigrons',
  'galtes-vi-negre',
  'gall-dindi-estofat',
  'xai-txilindron',
  'guatlles-escabetx',
];

export const temporadesReceptes: Record<string, number[]> = {
  calcotada: MESOS_CALCOTS,
  ...Object.fromEntries(HIVERN.map((id) => [id, [...MESOS_HIVERN]])),
};

export function ambTemporada(r: Recepta): Recepta {
  const mesos = temporadesReceptes[r.id];
  return mesos ? { ...r, mesos } : r;
}
