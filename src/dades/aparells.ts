import type { Aparell, Recepta } from '../domini';

// Aparells imprescindibles de cada recepta (els fogons es donen per suposats).
// Només hi surten quan la recepta no es pot fer sense: si els passos donen una alternativa
// («al microones o en un cassó», «sense forn, a la paella…»), no compta.
// Un test comprova que les receptes que diuen «Encén el forn» hi són.

const FORN: Aparell[] = ['forn'];

export const aparellsReceptes: Record<string, (Aparell | Aparell[])[]> = {
  canelons: FORN,
  'verdura-forn': FORN,
  'patates-adobades': FORN,
  'escalivada-tonyina': FORN,
  'ous-plat': FORN,
  'pollastre-forn-patates': FORN,
  'costelles-mel-mostassa': FORN,
  'pollastre-llimona': FORN,
  'lluc-forn': FORN,
  hamburgueses: FORN, // patates a gallons al forn
  'pastis-carn': FORN,
  lasanya: FORN,
  pizza: FORN,
  parmigiana: FORN,
  'pollastre-parmesana': FORN,
  focaccia: FORN,
  'pasta-forn': FORN,
  calzone: FORN,
  'nachos-forn': FORN,
  'tires-pollastre-forn': [['forn', 'fregidora-aire']],
  'patates-microones': ['microones'],
  'crema-carbasso': ['batedora'],
  'arros-negre': ['batedora'], // allioli
  // Receptes regionals (octubre de 2026)
  'coca-recapte': FORN,
  'empanada-tonyina': FORN,
  'bacalla-llauna': FORN,
  'pebrots-farcits': FORN,
  'arros-forn': FORN,
  'costelles-xai-allioli': ['forn', 'batedora'], // patates al forn i allioli
  salmorejo: ['batedora'],
  gaspatxo: ['batedora'],
  gazpachuelo: ['batedora'], // maionesa
  'ensaladilla-russa': ['batedora'], // maionesa
  'calamars-tinta': ['batedora'],
  'bacalla-biscaina': ['batedora'],
  // Vegetarianes i veganes (octubre de 2026)
  falafel: ['batedora'],
  'crema-carbassa': ['batedora'],
  'coliflor-rostida-cigrons': FORN,
  'alberginies-farcides-llenties': FORN,
  'pebrots-farcits-arros': FORN,
  'bol-quinoa': FORN,
  'lasanya-verdures': FORN,
  'canelons-espinacs': FORN,
  'quiche-porros': FORN,
  'pizza-verdures': FORN,
  'coliflor-gratinada': FORN,
  'macarrons-formatge': FORN,
};

/** Afegeix a cada recepta els aparells que necessita. */
export const ambAparells = (r: Recepta): Recepta => {
  const aparells = aparellsReceptes[r.id];
  return aparells ? { ...r, aparells } : r;
};
