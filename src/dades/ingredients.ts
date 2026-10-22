import type { Alergen, Ingredient, OrigenAnimal } from '../domini';

// Catàleg inicial d'ingredients. Les conversions `u` diuen quants grams fa una peça
// (valors mitjans orientatius: es poden ajustar).

const FRUITA = 'fruita i verdura';
const CARN = 'carn';
const PEIX = 'peix i marisc';
const FRESCOS = 'ous i làctics';
const SECS = 'pasta, arròs i llegums';
const CONSERVES = 'conserves i brous';
const FORN = 'forn';

const ingredientsBase: Ingredient[] = [
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
  { id: 'pebrot-verd', nom: 'Pebrot verd', unitat: 'g', seccio: FRUITA, conversions: { u: 150 } },
  { id: 'tomaquet', nom: 'Tomàquets', unitat: 'g', seccio: FRUITA, conversions: { u: 150 } },
  { id: 'enciam', nom: 'Enciam romà', unitat: 'u', seccio: FRUITA, indivisible: true },
  { id: 'cogombre', nom: 'Cogombre', unitat: 'g', seccio: FRUITA, conversions: { u: 300 } },
  { id: 'llimona', nom: 'Llimones', unitat: 'g', seccio: FRUITA, conversions: { u: 120 } },
  { id: 'julivert', nom: 'Julivert fresc', unitat: 'g', seccio: FRUITA },
  { id: 'espinacs', nom: 'Espinacs congelats', unitat: 'g', seccio: FRUITA },
  { id: 'pesols', nom: 'Pèsols congelats', unitat: 'g', seccio: FRUITA },
  { id: 'xampinyons', nom: 'Xampinyons laminats', unitat: 'g', seccio: FRUITA },
  { id: 'alvocat', nom: 'Alvocats', unitat: 'g', seccio: FRUITA, conversions: { u: 200 } },
  { id: 'ruca', nom: 'Ruca', unitat: 'g', seccio: FRUITA },
  { id: 'panotxa', nom: 'Panotxes de blat de moro', unitat: 'u', seccio: FRUITA, indivisible: true },
  { id: 'esparrecs', nom: 'Espàrrecs verds', unitat: 'g', seccio: FRUITA },
  { id: 'moniato', nom: 'Moniatos', unitat: 'g', seccio: FRUITA, conversions: { u: 300 } },
  { id: 'pinya', nom: 'Pinya', unitat: 'g', seccio: FRUITA },
  { id: 'calcots', nom: 'Calçots (en temporada)', unitat: 'u', seccio: FRUITA, indivisible: true },
  { id: 'xampinyons-sencers', nom: 'Xampinyons sencers', unitat: 'g', seccio: FRUITA },
  { id: 'portobello', nom: 'Xampinyons portobello', unitat: 'u', seccio: FRUITA, indivisible: true },
  { id: 'ceba-vermella', nom: 'Ceba vermella', unitat: 'g', seccio: FRUITA, conversions: { u: 150 } },
  { id: 'coriandre', nom: 'Coriandre fresc', unitat: 'g', seccio: FRUITA },
  { id: 'llima', nom: 'Llimes', unitat: 'g', seccio: FRUITA, conversions: { u: 60 } },
  { id: 'gingebre', nom: 'Gingebre fresc', unitat: 'g', seccio: FRUITA },
  { id: 'carbassa', nom: 'Carbassa a trossos', unitat: 'g', seccio: FRUITA },
  { id: 'faves', nom: 'Faves congelades', unitat: 'g', seccio: FRUITA },
  { id: 'carxofes', nom: 'Carxofes a trossos congelades', unitat: 'g', seccio: FRUITA },
  { id: 'coliflor', nom: 'Coliflor', unitat: 'g', seccio: FRUITA, conversions: { u: 1000 } },
  { id: 'bledes', nom: 'Bledes tallades', unitat: 'g', seccio: FRUITA },

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
  { id: 'vedella-estofar', nom: 'Vedella a daus per estofar', unitat: 'g', seccio: CARN },
  { id: 'vedella-llata', nom: 'Vedella a filets prims (llata)', unitat: 'g', seccio: CARN },
  { id: 'salsitxes', nom: 'Salsitxes fresques de porc', unitat: 'g', seccio: CARN },
  { id: 'botifarra-ou', nom: 'Botifarra d’ou', unitat: 'g', seccio: CARN },
  { id: 'pernil-dolc', nom: 'Pernil dolç a llesques', unitat: 'g', seccio: CARN },
  { id: 'taquets-pernil', nom: 'Pernil serrà a daus', unitat: 'g', seccio: CARN },
  { id: 'hamburguesa', nom: 'Hamburgueses de vedella i porc', unitat: 'g', seccio: CARN, conversions: { u: 90 } },
  { id: 'cansalada-fresca', nom: 'Cansalada fresca (tocino)', unitat: 'g', seccio: CARN },
  { id: 'os-blanc-salat', nom: 'Os blanc de porc salat', unitat: 'g', seccio: CARN },
  { id: 'espinada-porc', nom: 'Espinada de porc', unitat: 'g', seccio: CARN },
  { id: 'conill', nom: 'Conill a trossos', unitat: 'g', seccio: CARN },
  { id: 'cuixes-pollastre', nom: 'Contracuixes de pollastre sense pell', unitat: 'g', seccio: CARN },
  { id: 'ales-pollastre', nom: 'Ales de pollastre', unitat: 'g', seccio: CARN },
  { id: 'costelles-coll', nom: 'Costelles de coll de porc', unitat: 'g', seccio: CARN },
  { id: 'secret-porc', nom: 'Secret de porc', unitat: 'g', seccio: CARN },
  { id: 'presa-iberica', nom: 'Presa de porc ibèric', unitat: 'g', seccio: CARN },
  { id: 'ploma-porc', nom: 'Ploma de porc', unitat: 'g', seccio: CARN },
  { id: 'xistorra', nom: 'Xistorra', unitat: 'g', seccio: CARN },
  { id: 'panceta', nom: 'Panceta de porc a llesques', unitat: 'g', seccio: CARN },
  { id: 'costella-tires', nom: 'Costella de porc a tires (churrasco)', unitat: 'g', seccio: CARN },
  { id: 'filet-porc', nom: 'Filet de porc (solomillo)', unitat: 'g', seccio: CARN },
  { id: 'pinxos-porc', nom: 'Pinxos de porc adobats', unitat: 'g', seccio: CARN },
  { id: 'quarts-pollastre', nom: 'Quarts del darrere de pollastre', unitat: 'g', seccio: CARN },
  { id: 'xurrasco-vedella', nom: 'Xurrasco de vedella', unitat: 'g', seccio: CARN },
  { id: 'croquetes-congelades', nom: 'Croquetes de cocido congelades', unitat: 'g', seccio: CARN, conversions: { u: 30 } },
  { id: 'frankfurts', nom: 'Salsitxes de Frankfurt de pollastre', unitat: 'g', seccio: CARN },
  { id: 'costelles-xai', nom: 'Costelles de xai', unitat: 'g', seccio: CARN },
  { id: 'botifarra-negra', nom: 'Botifarra negra (morcilla de ceba)', unitat: 'g', seccio: CARN },
  { id: 'pernil-serra', nom: 'Pernil serrà a llesques', unitat: 'g', seccio: CARN },
  { id: 'compango', nom: 'Compango (xoriço, morcilla i cansalada per a fabada)', unitat: 'g', seccio: CARN },

  // Peix i marisc
  { id: 'sipia', nom: 'Sípia neta', unitat: 'g', seccio: PEIX },
  { id: 'gamba', nom: 'Gambes', unitat: 'g', seccio: PEIX },
  { id: 'bacalla', nom: 'Bacallà dessalat (lloms)', unitat: 'g', seccio: PEIX },
  { id: 'lluc', nom: 'Lluç (lloms)', unitat: 'g', seccio: PEIX },
  { id: 'tinta-sipia', nom: 'Tinta de sípia (sobres)', unitat: 'g', seccio: PEIX },
  { id: 'salmo', nom: 'Salmó a rodanxes', unitat: 'g', seccio: PEIX },
  { id: 'musclos', nom: 'Musclos frescos', unitat: 'g', seccio: PEIX },
  { id: 'cloisses', nom: 'Cloïsses (xirles)', unitat: 'g', seccio: PEIX },
  { id: 'calamar', nom: 'Calamar net a trossos (congelat)', unitat: 'g', seccio: PEIX },
  { id: 'pop', nom: 'Potes de pop cuit', unitat: 'g', seccio: PEIX },
  { id: 'orada', nom: 'Orades obertes a l’espatlla', unitat: 'u', seccio: PEIX, indivisible: true },
  { id: 'llobarro', nom: 'Llobarros oberts a l’espatlla', unitat: 'u', seccio: PEIX, indivisible: true },
  { id: 'llagostins', nom: 'Llagostins crus (congelats)', unitat: 'g', seccio: PEIX },
  { id: 'calamarsons', nom: 'Calamars petits nets', unitat: 'g', seccio: PEIX },
  { id: 'tonyina-fresca', nom: 'Tonyina fresca a rodanxes', unitat: 'g', seccio: PEIX },
  { id: 'seitons', nom: 'Seitons nets', unitat: 'g', seccio: PEIX },
  { id: 'sardines', nom: 'Sardines netes', unitat: 'g', seccio: PEIX },
  { id: 'pescadilla', nom: 'Pescadilla de lluç (congelada)', unitat: 'g', seccio: PEIX },

  // Ous i làctics
  { id: 'ou', nom: 'Ous', unitat: 'u', seccio: FRESCOS, indivisible: true },
  { id: 'llet', nom: 'Llet', unitat: 'ml', seccio: FRESCOS },
  { id: 'nata', nom: 'Nata per cuinar', unitat: 'ml', seccio: FRESCOS },
  { id: 'mantega', nom: 'Mantega', unitat: 'g', seccio: FRESCOS },
  { id: 'formatge-ratllat', nom: 'Formatge ratllat', unitat: 'g', seccio: FRESCOS },
  { id: 'parmesa', nom: 'Formatge parmesà ratllat', unitat: 'g', seccio: FRESCOS },
  { id: 'mozzarella', nom: 'Mozzarella ratllada', unitat: 'g', seccio: FRESCOS },
  { id: 'formatge-llesques', nom: 'Formatge a llesques', unitat: 'g', seccio: FRESCOS },
  { id: 'formatge-blau', nom: 'Formatge blau (gorgonzola)', unitat: 'g', seccio: FRESCOS },
  { id: 'formatgets', nom: 'Formatgets en porcions', unitat: 'u', seccio: FRESCOS, indivisible: true },
  { id: 'gnocchi', nom: 'Gnocchi frescos', unitat: 'g', seccio: FRESCOS },
  { id: 'provolone', nom: 'Formatge provolone', unitat: 'g', seccio: FRESCOS },
  { id: 'raviolis', nom: 'Raviolis frescos de ricotta i espinacs', unitat: 'g', seccio: FRESCOS },
  { id: 'tortellini', nom: 'Tortellini frescos', unitat: 'g', seccio: FRESCOS },

  // Pasta, arròs i llegums
  { id: 'macarrons', nom: 'Macarrons', unitat: 'g', seccio: SECS },
  { id: 'tallarins', nom: 'Tallarins', unitat: 'g', seccio: SECS },
  { id: 'plaques-canelons', nom: 'Plaques de canelons', unitat: 'u', seccio: SECS, indivisible: true },
  { id: 'fideus-fins', nom: 'Fideus fins (per a sopa)', unitat: 'g', seccio: SECS },
  { id: 'fideus-gruixuts', nom: 'Fideus gruixuts (per a cassola)', unitat: 'g', seccio: SECS },
  { id: 'fideus-fideua', nom: 'Fideus per a fideuà', unitat: 'g', seccio: SECS },
  { id: 'arros', nom: 'Arròs rodó', unitat: 'g', seccio: SECS },
  { id: 'arros-llarg', nom: 'Arròs llarg', unitat: 'g', seccio: SECS },
  { id: 'cuscus', nom: 'Cuscús', unitat: 'g', seccio: SECS },
  { id: 'llenties', nom: 'Llenties pardines', unitat: 'g', seccio: SECS },
  { id: 'penne', nom: 'Penne', unitat: 'g', seccio: SECS },
  { id: 'rigatoni', nom: 'Rigatoni', unitat: 'g', seccio: SECS },
  { id: 'espaguetis', nom: 'Espaguetis', unitat: 'g', seccio: SECS },
  { id: 'plaques-lasanya', nom: 'Plaques de lasanya', unitat: 'u', seccio: SECS, indivisible: true },
  { id: 'galets', nom: 'Galets', unitat: 'g', seccio: SECS },
  { id: 'cigrons', nom: 'Cigrons cuits (pot)', unitat: 'g', seccio: SECS },
  { id: 'cigrons-secs', nom: 'Cigrons secs (llet andalusos)', unitat: 'g', seccio: SECS },
  { id: 'mongetes-seques', nom: 'Mongetes blanques seques', unitat: 'g', seccio: SECS },
  { id: 'mongetes-vermelles', nom: 'Mongetes vermelles seques', unitat: 'g', seccio: SECS },
  { id: 'ametlles', nom: 'Ametlles torrades pelades', unitat: 'g', seccio: SECS },
  { id: 'panses', nom: 'Panses sense llavors', unitat: 'g', seccio: SECS },
  { id: 'xocolata-negra', nom: 'Xocolata negra per fondre', unitat: 'g', seccio: SECS },
  { id: 'llenties-cuites', nom: 'Llenties cuites (pot)', unitat: 'g', seccio: SECS },
  { id: 'mongetes-vermelles-cuites', nom: 'Mongetes vermelles cuites (pot)', unitat: 'g', seccio: SECS },
  { id: 'soja-texturitzada', nom: 'Soja texturitzada fina', unitat: 'g', seccio: SECS },
  { id: 'quinoa', nom: 'Quinoa cuita', unitat: 'g', seccio: SECS },
  { id: 'arros-basmati', nom: 'Arròs basmati', unitat: 'g', seccio: SECS },
  { id: 'anacards', nom: 'Anacards naturals', unitat: 'g', seccio: SECS },
  { id: 'mongetes-cuites', nom: 'Mongetes blanques cuites (pot)', unitat: 'g', seccio: SECS },
  { id: 'prunes', nom: 'Prunes seques sense pinyol', unitat: 'g', seccio: SECS },
  { id: 'pinyons', nom: 'Pinyons', unitat: 'g', seccio: SECS },
  { id: 'farina-forca', nom: 'Farina de força', unitat: 'g', seccio: SECS },
  { id: 'llevat', nom: 'Llevat sec de forner', unitat: 'g', seccio: SECS },
  { id: 'noodles', nom: 'Noodles de blat', unitat: 'g', seccio: SECS },

  // Conserves i brous
  { id: 'tomaquet-triturat', nom: 'Tomàquet triturat', unitat: 'g', seccio: CONSERVES },
  { id: 'tomaquet-fregit', nom: 'Tomàquet fregit', unitat: 'g', seccio: CONSERVES },
  { id: 'brou-verdures', nom: 'Brou de verdures', unitat: 'ml', seccio: CONSERVES },
  { id: 'brou-pollastre', nom: 'Brou de pollastre', unitat: 'ml', seccio: CONSERVES },
  { id: 'fumet', nom: 'Fumet de peix', unitat: 'ml', seccio: CONSERVES },
  { id: 'tonyina', nom: 'Tonyina en oli (llaunes)', unitat: 'g', seccio: CONSERVES },
  { id: 'anxoves', nom: 'Anxoves en oli', unitat: 'g', seccio: CONSERVES },
  { id: 'olives-negres', nom: 'Olives negres sense pinyol', unitat: 'g', seccio: CONSERVES },
  { id: 'taperes', nom: 'Tàperes', unitat: 'g', seccio: CONSERVES },
  { id: 'pesto', nom: 'Pesto (pot)', unitat: 'g', seccio: CONSERVES },
  { id: 'blat-de-moro', nom: 'Blat de moro dolç (llauna)', unitat: 'g', seccio: CONSERVES },
  { id: 'salsa-soja', nom: 'Salsa de soja', unitat: 'ml', seccio: CONSERVES },
  { id: 'salsa-iogurt', nom: 'Salsa de iogurt', unitat: 'ml', seccio: CONSERVES },
  { id: 'pebrot-xoricer', nom: 'Carn de pebrot xoricer (pot)', unitat: 'g', seccio: CONSERVES },
  { id: 'llet-coco', nom: 'Llet de coco per cuinar', unitat: 'ml', seccio: CONSERVES },
  { id: 'tahini', nom: 'Tahini (pasta de sèsam)', unitat: 'g', seccio: CONSERVES },
  { id: 'tomaquet-sec', nom: 'Tomàquet sec en oli', unitat: 'g', seccio: CONSERVES },
  { id: 'maionesa', nom: 'Maionesa', unitat: 'ml', seccio: CONSERVES },
  { id: 'ketchup', nom: 'Ketchup', unitat: 'g', seccio: CONSERVES },
  { id: 'vi-blanc', nom: 'Vi blanc per cuinar', unitat: 'ml', seccio: CONSERVES },

  // Forn
  { id: 'pa-torrat', nom: 'Pa torrat (llesques de paquet)', unitat: 'g', seccio: FORN },
  { id: 'pa-ratllat', nom: 'Pa ratllat', unitat: 'g', seccio: FORN },
  { id: 'pa-pages', nom: 'Pa de pagès', unitat: 'g', seccio: FORN },
  { id: 'pa-hamburguesa', nom: 'Panets d’hamburguesa', unitat: 'u', seccio: FORN, indivisible: true },
  { id: 'pa-barra', nom: 'Barra de pa', unitat: 'g', seccio: FORN },
  { id: 'tortilla-blat', nom: 'Tortilles de blat (wraps)', unitat: 'u', seccio: FORN, indivisible: true },
  { id: 'piadina', nom: 'Piadines', unitat: 'u', seccio: FORN, indivisible: true },
  { id: 'nachos', nom: 'Nachos (totopos de blat de moro)', unitat: 'g', seccio: FORN },
  { id: 'massa-empanada', nom: 'Massa fresca d’empanada (làmines)', unitat: 'u', seccio: FORN, indivisible: true },
  { id: 'massa-quebrada', nom: 'Massa fresca quebrada (làmina)', unitat: 'u', seccio: FORN, indivisible: true },

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
  { id: 'farigola', nom: 'Farigola', unitat: 'g', rebost: true, seccio: 'rebost' },
  { id: 'romani', nom: 'Romaní', unitat: 'g', rebost: true, seccio: 'rebost' },
  { id: 'llorer', nom: 'Llorer (fulles)', unitat: 'u', rebost: true, seccio: 'rebost', indivisible: true },
  { id: 'comi', nom: 'Comí mòlt', unitat: 'g', rebost: true, seccio: 'rebost' },
  { id: 'curri', nom: 'Curri en pols', unitat: 'g', rebost: true, seccio: 'rebost' },
  { id: 'bitxo', nom: 'Bitxo sec', unitat: 'u', rebost: true, seccio: 'rebost', indivisible: true },
  { id: 'sucre', nom: 'Sucre', unitat: 'g', rebost: true, seccio: 'rebost' },
  { id: 'mel', nom: 'Mel', unitat: 'g', rebost: true, seccio: 'rebost' },
  { id: 'vinagre', nom: 'Vinagre de vi', unitat: 'ml', rebost: true, seccio: 'rebost' },
  { id: 'mostassa', nom: 'Mostassa', unitat: 'g', rebost: true, seccio: 'rebost' },
];

/**
 * Al·lèrgens de cada ingredient (orientatiu). Criteri prudent: si el producte habitual del súper
 * en sol portar, hi consta. Embotits, brous i salses envasades poden variar segons la marca:
 * l'app avisa que cal llegir l'etiqueta.
 */
const ALERGENS_INGREDIENT: Record<string, Alergen[]> = {
  // Cereals amb gluten
  farina: ['gluten'],
  'farina-forca': ['gluten'],
  'pa-ratllat': ['gluten'],
  'pa-torrat': ['gluten'],
  'pa-pages': ['gluten'],
  'pa-hamburguesa': ['gluten', 'sesam', 'llet'],
  macarrons: ['gluten'],
  tallarins: ['gluten', 'ou'],
  'plaques-canelons': ['gluten'],
  'plaques-lasanya': ['gluten'],
  'fideus-fins': ['gluten'],
  'fideus-gruixuts': ['gluten'],
  'fideus-fideua': ['gluten'],
  penne: ['gluten'],
  rigatoni: ['gluten'],
  espaguetis: ['gluten'],
  galets: ['gluten'],
  cuscus: ['gluten'],
  gnocchi: ['gluten'],
  raviolis: ['gluten', 'ou', 'llet'],
  tortellini: ['gluten', 'ou', 'llet'],
  'pa-barra': ['gluten'],
  // Croquetes envasades: beixamel (llet), arrebossat (gluten, ou) i brou (api), criteri prudent.
  'croquetes-congelades': ['gluten', 'llet', 'ou', 'api'],
  'tortilla-blat': ['gluten'],
  piadina: ['gluten'],
  noodles: ['gluten'],
  'massa-empanada': ['gluten'],
  'massa-quebrada': ['gluten', 'llet'],
  anacards: ['fruits-secs'],
  tahini: ['sesam'],
  'soja-texturitzada': ['soja'],
  ametlles: ['fruits-secs'],
  'xocolata-negra': ['llet', 'soja'],
  // Ous
  ou: ['ou'],
  maionesa: ['ou'],
  'botifarra-ou': ['ou'],
  // Llet i derivats
  llet: ['llet'],
  nata: ['llet'],
  mantega: ['llet'],
  'formatge-ratllat': ['llet'],
  parmesa: ['llet'],
  provolone: ['llet'],
  mozzarella: ['llet'],
  'formatge-llesques': ['llet'],
  'formatge-blau': ['llet'],
  formatgets: ['llet'],
  pesto: ['llet', 'fruits-secs'],
  // Peix, crustacis i mol·luscs
  bacalla: ['peix'],
  lluc: ['peix'],
  tonyina: ['peix'],
  anxoves: ['peix'],
  fumet: ['peix', 'crustacis', 'molluscs'],
  gamba: ['crustacis'],
  sipia: ['molluscs'],
  'tinta-sipia': ['molluscs'],
  salmo: ['peix'],
  orada: ['peix'],
  llobarro: ['peix'],
  'tonyina-fresca': ['peix'],
  llagostins: ['crustacis'],
  calamarsons: ['molluscs'],
  seitons: ['peix'],
  sardines: ['peix'],
  pescadilla: ['peix'],
  musclos: ['molluscs'],
  cloisses: ['molluscs'],
  calamar: ['molluscs'],
  pop: ['molluscs'],
  // Altres
  pinyons: ['fruits-secs'],
  'brou-pollastre': ['api'],
  'brou-verdures': ['api'],
  mostassa: ['mostassa'],
  'salsa-soja': ['soja', 'gluten'],
  'salsa-iogurt': ['llet', 'ou'],
  'vi-blanc': ['sulfits'],
  vinagre: ['sulfits'],
};

/**
 * Origen animal que no es dedueix de la secció ni dels al·lèrgens.
 * Criteri prudent: els farcits que poden portar carn compten com a carn.
 */
const ORIGEN_EXPLICIT: Record<string, OrigenAnimal> = {
  'brou-pollastre': 'carn',
  tortellini: 'carn',
  mel: 'derivat',
};

/** Origen animal: explícit, o per la secció (carn, peix), o pels al·lèrgens (peix i marisc; ou i llet). */
function origenDe(i: Ingredient, alergens: readonly Alergen[]): OrigenAnimal | undefined {
  if (ORIGEN_EXPLICIT[i.id]) return ORIGEN_EXPLICIT[i.id];
  if (i.seccio === CARN) return 'carn';
  if (i.seccio === PEIX || alergens.some((a) => a === 'peix' || a === 'crustacis' || a === 'molluscs')) return 'peix';
  if (alergens.some((a) => a === 'ou' || a === 'llet')) return 'derivat';
  return undefined;
}

export const ingredients: Ingredient[] = ingredientsBase.map((i) => {
  const alergens = ALERGENS_INGREDIENT[i.id];
  const origen = origenDe(i, alergens ?? []);
  return { ...i, ...(alergens ? { alergens } : {}), ...(origen ? { origen } : {}) };
});

/** Identificadors amb al·lèrgens assignats (per comprovar als tests que existeixen). */
export const ingredientsAmbAlergens = Object.keys(ALERGENS_INGREDIENT);
