import type { Preu } from '../domini';

// Preus ORIENTATIUS de referència Mercadona (format habitual de paquet i preu en cèntims).
// Són estimacions per començar: s'han de revisar amb el tiquet i es podran editar a l'app.
// Productes a granel (fruita i verdura, alguna carn): paquet = 1 kg i preu del kg.
// El rebost no suma al cost de compra; si té preu és només informatiu.

export const DATA_PREUS = '2026-10';

export const preus: Preu[] = [
  // Fruita i verdura
  { ingredientId: 'ceba', midaPaquet: 2000, preuCentims: 230 },
  { ingredientId: 'pastanaga', midaPaquet: 1000, preuCentims: 110 },
  { ingredientId: 'patata', midaPaquet: 3000, preuCentims: 399 },
  { ingredientId: 'mongeta-tendra', midaPaquet: 500, preuCentims: 225 },
  { ingredientId: 'carbasso', midaPaquet: 1000, preuCentims: 199 },
  { ingredientId: 'alberginia', midaPaquet: 1000, preuCentims: 229 },
  { ingredientId: 'pebrot-vermell', midaPaquet: 1000, preuCentims: 299 },
  { ingredientId: 'porro', midaPaquet: 500, preuCentims: 169 },
  { ingredientId: 'col', midaPaquet: 1000, preuCentims: 149 },
  { ingredientId: 'all', midaPaquet: 30, preuCentims: 160 },
  { ingredientId: 'bolets', midaPaquet: 250, preuCentims: 260 },
  { ingredientId: 'platan', midaPaquet: 1000, preuCentims: 230 },

  // Carn
  { ingredientId: 'carn-picada', midaPaquet: 500, preuCentims: 410 },
  { ingredientId: 'baco', midaPaquet: 250, preuCentims: 220 },
  { ingredientId: 'llom', midaPaquet: 500, preuCentims: 375 },
  { ingredientId: 'entrecot', midaPaquet: 450, preuCentims: 945 },
  { ingredientId: 'bistec', midaPaquet: 500, preuCentims: 695 },
  { ingredientId: 'pit-pollastre', midaPaquet: 500, preuCentims: 398 },
  { ingredientId: 'pollastre-trossos', midaPaquet: 1000, preuCentims: 450 },
  { ingredientId: 'costella-porc', midaPaquet: 500, preuCentims: 325 },
  { ingredientId: 'botifarra', midaPaquet: 400, preuCentims: 300 },
  { ingredientId: 'cansalada', midaPaquet: 250, preuCentims: 199 },
  { ingredientId: 'xorico', midaPaquet: 250, preuCentims: 225 },

  // Peix i marisc
  { ingredientId: 'sipia', midaPaquet: 400, preuCentims: 389 },
  { ingredientId: 'gamba', midaPaquet: 400, preuCentims: 450 },

  // Ous i làctics
  { ingredientId: 'ou', midaPaquet: 12, preuCentims: 230 },
  { ingredientId: 'llet', midaPaquet: 1000, preuCentims: 95 },
  { ingredientId: 'nata', midaPaquet: 200, preuCentims: 70 },
  { ingredientId: 'mantega', midaPaquet: 250, preuCentims: 245 },
  { ingredientId: 'formatge-ratllat', midaPaquet: 200, preuCentims: 199 },

  // Pasta, arròs i llegums
  { ingredientId: 'macarrons', midaPaquet: 1000, preuCentims: 125 },
  { ingredientId: 'tallarins', midaPaquet: 500, preuCentims: 115 },
  { ingredientId: 'plaques-canelons', midaPaquet: 20, preuCentims: 129 },
  { ingredientId: 'fideus-fins', midaPaquet: 500, preuCentims: 99 },
  { ingredientId: 'fideus-gruixuts', midaPaquet: 500, preuCentims: 99 },
  { ingredientId: 'fideus-fideua', midaPaquet: 500, preuCentims: 105 },
  { ingredientId: 'arros', midaPaquet: 1000, preuCentims: 145 },
  { ingredientId: 'cuscus', midaPaquet: 500, preuCentims: 115 },
  { ingredientId: 'llenties', midaPaquet: 1000, preuCentims: 219 },

  // Conserves i brous
  { ingredientId: 'tomaquet-triturat', midaPaquet: 400, preuCentims: 69 },
  { ingredientId: 'tomaquet-fregit', midaPaquet: 400, preuCentims: 95 },
  { ingredientId: 'brou-verdures', midaPaquet: 1000, preuCentims: 109 },
  { ingredientId: 'brou-pollastre', midaPaquet: 1000, preuCentims: 105 },
  { ingredientId: 'fumet', midaPaquet: 1000, preuCentims: 165 },

  // Forn
  { ingredientId: 'pa-ratllat', midaPaquet: 750, preuCentims: 120 },

  // Rebost (informatiu)
  { ingredientId: 'oli-oliva', midaPaquet: 1000, preuCentims: 595 },
  { ingredientId: 'oli-girasol', midaPaquet: 1000, preuCentims: 179 },
  { ingredientId: 'farina', midaPaquet: 1000, preuCentims: 79 },
];
