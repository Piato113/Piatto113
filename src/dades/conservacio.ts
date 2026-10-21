// Com es conserven els ingredients quan es fa la compra per a tot el mes (orientatiu).

/** Carn i peix frescos: al congelador en arribar a casa, i a descongelar la nit abans de cuinar-los. */
export const carnIPeixPerCongelar: ReadonlySet<string> = new Set([
  'carn-picada',
  'llom',
  'entrecot',
  'bistec',
  'pit-pollastre',
  'pollastre-trossos',
  'costella-porc',
  'botifarra',
  'botifarra-negra',
  'vedella-estofar',
  'vedella-llata',
  'salsitxes',
  'hamburguesa',
  'cansalada-fresca',
  'espinada-porc',
  'conill',
  'costelles-xai',
  'sipia',
  'gamba',
  'bacalla',
  'lluc',
  'salmo',
  'calamar',
  'seitons',
]);

/** Pa i masses que també es poden congelar (es descongelen en poca estona). */
const paPerCongelar: ReadonlySet<string> = new Set(['pa-pages', 'pa-barra', 'pa-hamburguesa', 'tortilla-blat', 'piadina']);

/** Ingredients que en una compra mensual convé congelar en arribar a casa. */
export const esPerCongelar = (ingredientId: string): boolean =>
  carnIPeixPerCongelar.has(ingredientId) || paPerCongelar.has(ingredientId);
