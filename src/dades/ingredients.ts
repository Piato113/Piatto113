import type { Ingredient } from '../domini';

// Catàleg inicial d'ingredients. Les conversions `u` diuen quants grams fa una peça
// (valors mitjans orientatius: es poden ajustar).

const FRUITA = 'fruita i verdura';
const CARN = 'carn';
const PEIX = 'peix i marisc';
const FRESCOS = 'ous i làctics';
const SECS = 'pasta, arròs i llegums';
const CONSERVES = 'conserves i brous';
const FORN = 'forn';

export const ingredients: Ingredient[] = [
  // Fruita i verdura
  { id: 'ceba', nom: 'Ceba', unitat: 'g', seccio: FRUITA, conversions: { u: 150 } },
  { id: 'pastanaga', nom: 'Pastanaga', unitat: 'g', seccio: FRUITA, conversions: { u: 100 } },
  { id: 'patata', nom: 'Patates', unitat: 'g', seccio: FRUITA, conversions: { u: 200 } },
  { id: 'mongeta-tendra', nom: 'Mongeta tendra', unitat: 'g', seccio: FRUITA },
  { id: 'carbasso', nom: 'Carbassó', unitat: 'g', seccio: FRUITA, conversions: { u: 300 } },
  { id: 'alberginia', nom: 'Albergínia', unitat: 'g', seccio: FRUITA, conversions: { u: 300 } },
  { id: 'pebrot-vermell', nom: 'Pebrot vermell', unitat: 'g', seccio: FRUITA, conversions: { u: 200 } },
  { id: 'porro', nom: 'Porros', unitat: 'g', seccio: FRUITA, conversions: { u: 150 } },
  { id: 'col', nom: 'Col', unitat: 'g', seccio: FRUITA, conversions: { u: 1200 } },
  { id: 'all', nom: 'All (grans)', unitat: 'u', seccio: FRUITA, indivisible: true },
  { id: 'bolets', nom: 'Bolets de temporada', unitat: 'g', seccio: FRUITA },
  { id: 'platan', nom: 'Plàtans', unitat: 'g', seccio: FRUITA, conversions: { u: 150 } },

  // Carn
  { id: 'carn-picada', nom: 'Carn picada mixta (vedella i porc)', unitat: 'g', seccio: CARN },
  { id: 'baco', nom: 'Bacó a tires', unitat: 'g', seccio: CARN },
  { id: 'llom', nom: 'Llom de porc a filets', unitat: 'g', seccio: CARN },
  { id: 'entrecot', nom: 'Entrecot de vedella', unitat: 'g', seccio: CARN },
  { id: 'bistec', nom: 'Bistecs de vedella', unitat: 'g', seccio: CARN },
  { id: 'pit-pollastre', nom: 'Pit de pollastre a filets', unitat: 'g', seccio: CARN },
  { id: 'pollastre-trossos', nom: 'Pollastre a trossos', unitat: 'g', seccio: CARN },
  { id: 'costella-porc', nom: 'Costella de porc', unitat: 'g', seccio: CARN },
  { id: 'botifarra', nom: 'Botifarra', unitat: 'g', seccio: CARN },
  { id: 'cansalada', nom: 'Cansalada viada', unitat: 'g', seccio: CARN },
  { id: 'xorico', nom: 'Xoriço per cuinar', unitat: 'g', seccio: CARN },

  // Peix i marisc
  { id: 'sipia', nom: 'Sípia neta', unitat: 'g', seccio: PEIX },
  { id: 'gamba', nom: 'Gambes', unitat: 'g', seccio: PEIX },

  // Ous i làctics
  { id: 'ou', nom: 'Ous', unitat: 'u', seccio: FRESCOS, indivisible: true },
  { id: 'llet', nom: 'Llet', unitat: 'ml', seccio: FRESCOS },
  { id: 'nata', nom: 'Nata per cuinar', unitat: 'ml', seccio: FRESCOS },
  { id: 'mantega', nom: 'Mantega', unitat: 'g', seccio: FRESCOS },
  { id: 'formatge-ratllat', nom: 'Formatge ratllat', unitat: 'g', seccio: FRESCOS },

  // Pasta, arròs i llegums
  { id: 'macarrons', nom: 'Macarrons', unitat: 'g', seccio: SECS },
  { id: 'tallarins', nom: 'Tallarins', unitat: 'g', seccio: SECS },
  { id: 'plaques-canelons', nom: 'Plaques de canelons', unitat: 'u', seccio: SECS, indivisible: true },
  { id: 'fideus-fins', nom: 'Fideus fins (per a sopa)', unitat: 'g', seccio: SECS },
  { id: 'fideus-gruixuts', nom: 'Fideus gruixuts (per a cassola)', unitat: 'g', seccio: SECS },
  { id: 'fideus-fideua', nom: 'Fideus per a fideuà', unitat: 'g', seccio: SECS },
  { id: 'arros', nom: 'Arròs rodó', unitat: 'g', seccio: SECS },
  { id: 'cuscus', nom: 'Cuscús', unitat: 'g', seccio: SECS },
  { id: 'llenties', nom: 'Llenties pardines', unitat: 'g', seccio: SECS },

  // Conserves i brous
  { id: 'tomaquet-triturat', nom: 'Tomàquet triturat', unitat: 'g', seccio: CONSERVES },
  { id: 'tomaquet-fregit', nom: 'Tomàquet fregit', unitat: 'g', seccio: CONSERVES },
  { id: 'brou-verdures', nom: 'Brou de verdures', unitat: 'ml', seccio: CONSERVES },
  { id: 'brou-pollastre', nom: 'Brou de pollastre', unitat: 'ml', seccio: CONSERVES },
  { id: 'fumet', nom: 'Fumet de peix', unitat: 'ml', seccio: CONSERVES },

  // Forn
  { id: 'pa-ratllat', nom: 'Pa ratllat', unitat: 'g', seccio: FORN },

  // Rebost: surt a la llista però no suma al cost de compra
  { id: 'oli-oliva', nom: 'Oli d’oliva', unitat: 'ml', rebost: true, seccio: 'rebost' },
  { id: 'oli-girasol', nom: 'Oli de gira-sol', unitat: 'ml', rebost: true, seccio: 'rebost' },
  { id: 'farina', nom: 'Farina', unitat: 'g', rebost: true, seccio: 'rebost' },
  { id: 'sal', nom: 'Sal', unitat: 'g', rebost: true, seccio: 'rebost' },
  { id: 'pebre-negre', nom: 'Pebre negre', unitat: 'g', rebost: true, seccio: 'rebost' },
  { id: 'pebre-vermell', nom: 'Pebre vermell', unitat: 'g', rebost: true, seccio: 'rebost' },
  { id: 'orenga', nom: 'Orenga', unitat: 'g', rebost: true, seccio: 'rebost' },
  { id: 'colorant', nom: 'Colorant o safrà', unitat: 'g', rebost: true, seccio: 'rebost' },
  { id: 'nou-moscada', nom: 'Nou moscada', unitat: 'g', rebost: true, seccio: 'rebost' },
];
