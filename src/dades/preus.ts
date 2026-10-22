import type { Preu } from '../domini';
import { DATA_PREUS_MERCADONA, preusMercadona } from './preus-mercadona';

// Preus de compra. Primer manen els del llistat del Mercadona (src/dades/preus-mercadona.ts, generat);
// els estimats d'aquí sota només s'usen per als ingredients que no hi són (o no s'han trobat al llistat).
// El rebost no suma al cost de compra; si té preu és només informatiu.

/** Data del llistat de preus (AAAA-MM-DD). */
export const DATA_PREUS = DATA_PREUS_MERCADONA;

/** Estimacions inicials (octubre de 2026), en format de paquet habitual. */
const preusEstimats: Preu[] = [
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
  { ingredientId: 'pebrot-verd', midaPaquet: 1000, preuCentims: 249 },
  { ingredientId: 'tomaquet', midaPaquet: 1000, preuCentims: 229 },
  { ingredientId: 'enciam', midaPaquet: 1, preuCentims: 95 },
  { ingredientId: 'cogombre', midaPaquet: 1000, preuCentims: 159 },
  { ingredientId: 'llimona', midaPaquet: 1000, preuCentims: 199 },
  { ingredientId: 'julivert', midaPaquet: 40, preuCentims: 99 },
  { ingredientId: 'espinacs', midaPaquet: 1000, preuCentims: 179 },
  { ingredientId: 'pesols', midaPaquet: 1000, preuCentims: 185 },

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
  { ingredientId: 'vedella-estofar', midaPaquet: 500, preuCentims: 599 },
  { ingredientId: 'vedella-llata', midaPaquet: 500, preuCentims: 749 },
  { ingredientId: 'salsitxes', midaPaquet: 400, preuCentims: 280 },
  { ingredientId: 'botifarra-ou', midaPaquet: 300, preuCentims: 349 },
  { ingredientId: 'pernil-dolc', midaPaquet: 200, preuCentims: 199 },
  { ingredientId: 'taquets-pernil', midaPaquet: 130, preuCentims: 199 },

  // Peix i marisc
  { ingredientId: 'sipia', midaPaquet: 400, preuCentims: 389 },
  { ingredientId: 'gamba', midaPaquet: 400, preuCentims: 450 },
  { ingredientId: 'bacalla', midaPaquet: 400, preuCentims: 599 },
  { ingredientId: 'lluc', midaPaquet: 400, preuCentims: 450 },
  { ingredientId: 'tinta-sipia', midaPaquet: 8, preuCentims: 150 },

  // Ous i làctics
  { ingredientId: 'ou', midaPaquet: 12, preuCentims: 230 },
  { ingredientId: 'llet', midaPaquet: 1000, preuCentims: 95 },
  { ingredientId: 'nata', midaPaquet: 200, preuCentims: 70 },
  { ingredientId: 'mantega', midaPaquet: 250, preuCentims: 245 },
  { ingredientId: 'formatge-ratllat', midaPaquet: 200, preuCentims: 199 },
  { ingredientId: 'parmesa', midaPaquet: 100, preuCentims: 225 },
  { ingredientId: 'mozzarella', midaPaquet: 200, preuCentims: 185 },
  { ingredientId: 'formatge-llesques', midaPaquet: 250, preuCentims: 229 },
  { ingredientId: 'formatge-blau', midaPaquet: 150, preuCentims: 249 },
  { ingredientId: 'formatgets', midaPaquet: 8, preuCentims: 110 },
  { ingredientId: 'gnocchi', midaPaquet: 500, preuCentims: 199 },
  { ingredientId: 'raviolis', midaPaquet: 500, preuCentims: 299 },
  { ingredientId: 'tortellini', midaPaquet: 500, preuCentims: 299 },

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
  { ingredientId: 'penne', midaPaquet: 500, preuCentims: 95 },
  { ingredientId: 'rigatoni', midaPaquet: 500, preuCentims: 115 },
  { ingredientId: 'espaguetis', midaPaquet: 500, preuCentims: 95 },
  { ingredientId: 'plaques-lasanya', midaPaquet: 18, preuCentims: 130 },
  { ingredientId: 'galets', midaPaquet: 500, preuCentims: 129 },
  { ingredientId: 'cigrons', midaPaquet: 400, preuCentims: 79 },
  { ingredientId: 'mongetes-cuites', midaPaquet: 400, preuCentims: 85 },
  { ingredientId: 'prunes', midaPaquet: 250, preuCentims: 189 },
  { ingredientId: 'pinyons', midaPaquet: 70, preuCentims: 349 },
  { ingredientId: 'farina-forca', midaPaquet: 1000, preuCentims: 109 },
  { ingredientId: 'llevat', midaPaquet: 55, preuCentims: 105 },

  // Conserves i brous
  { ingredientId: 'tomaquet-triturat', midaPaquet: 400, preuCentims: 69 },
  { ingredientId: 'tomaquet-fregit', midaPaquet: 400, preuCentims: 95 },
  { ingredientId: 'brou-verdures', midaPaquet: 1000, preuCentims: 109 },
  { ingredientId: 'brou-pollastre', midaPaquet: 1000, preuCentims: 105 },
  { ingredientId: 'fumet', midaPaquet: 1000, preuCentims: 165 },
  { ingredientId: 'tonyina', midaPaquet: 240, preuCentims: 360 },
  { ingredientId: 'anxoves', midaPaquet: 50, preuCentims: 165 },
  { ingredientId: 'olives-negres', midaPaquet: 150, preuCentims: 79 },
  { ingredientId: 'taperes', midaPaquet: 100, preuCentims: 115 },
  { ingredientId: 'pesto', midaPaquet: 190, preuCentims: 225 },
  { ingredientId: 'vi-blanc', midaPaquet: 1000, preuCentims: 150 },

  // Verdura de temporada que no és al llistat del Mercadona
  { ingredientId: 'calcots', midaPaquet: 25, preuCentims: 450 },

  // Talls argentins de carnisseria: es compren al pes, preu orientatiu per 100 g
  // (vacío 14 €/kg, entranya 22 €/kg, tira d’asado 13 €/kg, matambre 13 €/kg, picanya 18 €/kg).
  { ingredientId: 'vacio', midaPaquet: 100, preuCentims: 140 },
  { ingredientId: 'entranya', midaPaquet: 100, preuCentims: 220 },
  { ingredientId: 'tira-asado', midaPaquet: 100, preuCentims: 130 },
  { ingredientId: 'matambre', midaPaquet: 100, preuCentims: 130 },
  { ingredientId: 'picanya', midaPaquet: 100, preuCentims: 180 },
  // Galtes de porc de carnisseria (unes 11 €/kg).
  { ingredientId: 'galtes-porc', midaPaquet: 100, preuCentims: 110 },

  // Forn
  { ingredientId: 'pa-ratllat', midaPaquet: 750, preuCentims: 120 },
  { ingredientId: 'pa-pages', midaPaquet: 500, preuCentims: 189 },
  { ingredientId: 'pa-hamburguesa', midaPaquet: 4, preuCentims: 115 },
  { ingredientId: 'nachos', midaPaquet: 200, preuCentims: 129 },

  // Rebost (informatiu)
  { ingredientId: 'oli-oliva', midaPaquet: 1000, preuCentims: 595 },
  { ingredientId: 'oli-girasol', midaPaquet: 1000, preuCentims: 179 },
  { ingredientId: 'farina', midaPaquet: 1000, preuCentims: 79 },
];

const delMercadona = new Set(preusMercadona.map((p) => p.ingredientId));

/** Preus que fa servir l'app: els del Mercadona i, per a la resta, els estimats. */
export const preus: Preu[] = [
  ...preusMercadona.map(({ unitat: _unitat, ...preu }) => preu),
  ...preusEstimats.filter((p) => !delMercadona.has(p.ingredientId)),
];

/** Ingredients amb preu estimat (no surten al llistat del Mercadona). */
export const ingredientsAmbPreuEstimat = preusEstimats.filter((p) => !delMercadona.has(p.ingredientId)).map((p) => p.ingredientId);
