import type { Recepta } from '../domini';
import { c, l, p } from './ajudants';

// Receptari de salses per combinar amb les carns, el peix i les verdures (sobretot de la brasa).
// No surten soles al menú: es consulten al receptari i cada plat proposa les que hi van bé (`salses`).
// Quantitats per a 4 racions normals.

const salsa = (r: Omit<Recepta, 'racions' | 'etiquetes' | 'tipus'>): Recepta => ({ racions: 4, etiquetes: [], tipus: 'salsa', ...r });

export const receptesSalses: Recepta[] = [
  salsa({
    id: 'allioli',
    nom: 'Allioli',
    tempsMinuts: 10,
    aparells: ['batedora'],
    ingredients: [l('all', 2), l('ou', 1), l('llimona', 20), l('sal', 2), l('oli-oliva', 200)],
    passos: [
      p(
        'Pela els alls ({all}) i treu-los el grill del mig (si no, l’allioli repeteix). Posa’ls al got de la batedora amb l’ou sencer ({ou}), ' +
          'el suc de la llimona ({llimona}) i la sal ({sal}).',
      ),
      p(
        'Aboca-hi l’oli ({oli-oliva}). Posa la batedora al fons del got, engega-la i no la moguis fins que vegis que a baix es forma una crema blanca. ' +
          'Llavors puja-la a poc a poc fins que tot l’oli s’hagi lligat.',
      ),
      p('Si es talla (queda líquid), posa un altre ou en un got net i hi afegeixes l’allioli tallat a poc a poc batent. Guarda’l a la nevera i menja’l en dos dies.'),
    ],
  }),
  salsa({
    id: 'romesco',
    nom: 'Romesco',
    tempsMinuts: 35,
    aparells: ['batedora'],
    ingredients: [
      l('tomaquet', 2, 'u'),
      l('all', 4),
      l('ametlles', 40),
      l('pa-pages', 30),
      l('pebrot-xoricer', 30),
      l('vinagre', 15),
      l('pebre-vermell', 2),
      l('sal', 3),
      l('oli-oliva', 100),
    ],
    passos: [
      c(
        'Escalivar: posa els tomàquets ({tomaquet}) i els alls ({all}) sencers, amb pell, a la brasa, a la planxa o en una paella a foc mitjà, girant-los, ' +
          'fins que la pell sigui negra a trossos i siguin tous.',
        20,
        'Escalivar tomàquet i alls',
      ),
      p('Torra el pa ({pa-pages}) a la mateixa paella amb una mica de l’oli fins que sigui daurat.'),
      p('Pela els tomàquets i els alls i posa’ls al got de la batedora amb el pa, les ametlles ({ametlles}), la carn de pebrot xoricer ({pebrot-xoricer}), ' +
        'el vinagre ({vinagre}), el pebre vermell ({pebre-vermell}) i la sal ({sal}).'),
      p('Tritura-ho mentre hi tires l’oli ({oli-oliva}) a poc a poc, fins que sigui una salsa espessa però no del tot fina. Tasta-la i corregeix de sal i vinagre.'),
    ],
  }),
  salsa({
    id: 'chimichurri',
    nom: 'Chimichurri',
    tempsMinuts: 10,
    ingredients: [
      l('julivert', 20),
      l('all', 2),
      l('orenga', 3),
      l('bitxo', 1),
      l('pebre-negre', 1),
      l('sal', 3),
      l('vinagre', 30),
      l('oli-oliva', 100),
    ],
    passos: [
      p('Pica molt fi el julivert ({julivert}) i els alls ({all}), i esmicola el bitxo ({bitxo}) amb els dits (sense les llavors, si no el vols picant).'),
      p(
        'Posa-ho en un pot amb l’orenga ({orenga}), el pebre ({pebre-negre}), la sal ({sal}) i el vinagre ({vinagre}). Remena perquè la sal es desfaci ' +
          'i afegeix-hi l’oli ({oli-oliva}).',
      ),
      p('Deixa-ho reposar com a mínim mitja hora abans de servir-ho (com més estona, més gust). A la nevera, tapat, aguanta una setmana.'),
    ],
  }),
  salsa({
    id: 'mojo-pico',
    nom: 'Mojo picón (vermell)',
    tempsMinuts: 10,
    ingredients: [
      l('all', 4),
      l('bitxo', 1),
      l('comi', 2),
      l('pebre-vermell', 10),
      l('sal', 3),
      l('vinagre', 30),
      l('oli-oliva', 100),
    ],
    passos: [
      p(
        'Al morter, pica els alls ({all}) pelats amb la sal ({sal}), el bitxo ({bitxo}) i el comí ({comi}) fins que sigui una pasta. ' +
          'Sense morter, tritura-ho amb la batedora.',
      ),
      p('Afegeix-hi el pebre vermell ({pebre-vermell}) i el vinagre ({vinagre}) i barreja-ho. Ves-hi tirant l’oli ({oli-oliva}) a poc a poc, remenant, fins que lligui.'),
      p('És per sucar-hi carn, patates o peix a la brasa. A la nevera aguanta una setmana.'),
    ],
  }),
  salsa({
    id: 'mojo-verd',
    nom: 'Mojo verd',
    tempsMinuts: 10,
    ingredients: [
      l('coriandre', 20),
      l('pebrot-verd', 75),
      l('all', 3),
      l('comi', 2),
      l('sal', 3),
      l('vinagre', 20),
      l('oli-oliva', 100),
    ],
    passos: [
      p('Renta el coriandre ({coriandre}) i trosseja’l amb les tiges tendres. Treu les llavors al pebrot verd ({pebrot-verd}) i talla’l a trossos. Pela els alls ({all}).'),
      p(
        'Al morter o amb la batedora, pica els alls amb la sal ({sal}) i el comí ({comi}), afegeix-hi el coriandre i el pebrot i tritura-ho. ' +
          'Afegeix-hi el vinagre ({vinagre}) i l’oli ({oli-oliva}) a poc a poc fins que sigui una salsa verda espessa.',
      ),
      p('Va molt bé amb peix, pollastre i patates. Millor del dia.'),
    ],
  }),
  salsa({
    id: 'salsa-barbacoa',
    nom: 'Salsa barbacoa casolana',
    tempsMinuts: 15,
    ingredients: [
      l('ceba', 75),
      l('all', 1),
      l('oli-oliva', 10),
      l('ketchup', 200),
      l('mel', 40),
      l('salsa-soja', 30),
      l('vinagre', 30),
      l('sucre', 15),
      l('pebre-vermell', 5),
    ],
    passos: [
      p('Ratlla o pica molt fina la ceba ({ceba}) i l’all ({all}) i cou-los en un cassó a foc baix amb l’oli ({oli-oliva}) fins que siguin tous, sense que es daurin.'),
      c(
        'Afegeix-hi el ketchup ({ketchup}), la mel ({mel}), la salsa de soja ({salsa-soja}), el vinagre ({vinagre}), el sucre ({sucre}) i el pebre vermell ' +
          '({pebre-vermell}). Cou-ho a foc baix, remenant, fins que espesseixi i faci xup-xup.',
        10,
        'Reduir la salsa',
      ),
      p('Deixa-la refredar: espesseix més. Serveix per pintar costelles, ales i hamburgueses els últims minuts a la brasa, o per sucar.'),
    ],
  }),
  salsa({
    id: 'guacamole',
    nom: 'Guacamole',
    tempsMinuts: 10,
    ingredients: [l('alvocat', 400), l('llima', 1, 'u'), l('ceba-vermella', 40), l('tomaquet', 1, 'u'), l('coriandre', 10), l('sal', 3)],
    passos: [
      p('Pica molt fina la ceba vermella ({ceba-vermella}) i el coriandre ({coriandre}). Treu les llavors al tomàquet ({tomaquet}) i talla’l a daus petits.'),
      p(
        'Obre els alvocats ({alvocat}), treu-ne el pinyol i buida la polpa en un bol amb una cullera. Aixafa-la amb una forquilla, deixant-hi trossets. ' +
          'Afegeix-hi de seguida el suc de la llima ({llima}) perquè no es torni negra.',
      ),
      p('Barreja-hi la ceba, el tomàquet, el coriandre i la sal ({sal}). Tasta’l i serveix-lo de seguida.'),
    ],
  }),
  salsa({
    id: 'pico-de-gallo',
    nom: 'Pico de gallo',
    tempsMinuts: 10,
    ingredients: [l('tomaquet', 3, 'u'), l('ceba-vermella', 75), l('coriandre', 10), l('llima', 1, 'u'), l('oli-oliva', 10), l('sal', 3)],
    passos: [
      p('Talla els tomàquets ({tomaquet}) a daus petits, sense les llavors. Pica molt fina la ceba vermella ({ceba-vermella}) i el coriandre ({coriandre}).'),
      p('Barreja-ho en un bol amb el suc de la llima ({llima}), l’oli ({oli-oliva}) i la sal ({sal}). Deixa-ho reposar 10 minuts a la nevera abans de servir-ho.'),
    ],
  }),
  salsa({
    id: 'salsa-mostassa-mel',
    nom: 'Salsa de mostassa i mel',
    tempsMinuts: 5,
    ingredients: [l('mostassa', 60), l('mel', 40), l('llimona', 30), l('oli-oliva', 30), l('sal', 1)],
    passos: [
      p(
        'En un bol, barreja la mostassa ({mostassa}) i la mel ({mel}) amb una forquilla. Afegeix-hi el suc de la llimona ({llimona}), la sal ({sal}) ' +
          'i, a poc a poc, l’oli ({oli-oliva}), batent fins que quedi una salsa llisa.',
      ),
      p('Va bé amb pollastre, filet de porc, salmó i amanides.'),
    ],
  }),
  salsa({
    id: 'salsa-formatge-blau',
    nom: 'Salsa de formatge blau',
    tempsMinuts: 10,
    ingredients: [l('formatge-blau', 100), l('nata', 200), l('pebre-negre', 1)],
    passos: [
      c(
        'Posa la nata ({nata}) en un cassó a foc baix i, quan sigui calenta, afegeix-hi el formatge blau ({formatge-blau}) a trossos. Remena fins que es fongui ' +
          'i la salsa espesseixi una mica. No la deixis bullir fort.',
        6,
        'Fondre el formatge',
      ),
      p('Posa-hi el pebre ({pebre-negre}) i serveix-la calenta sobre la carn (entrecot, xurrasco, filet de porc).'),
    ],
  }),
  salsa({
    id: 'salsa-pebre',
    nom: 'Salsa de pebre',
    tempsMinuts: 15,
    ingredients: [l('mantega', 20), l('ceba', 40), l('pebre-negre', 4), l('nata', 200), l('sal', 2)],
    passos: [
      p('Pica molt fina la ceba ({ceba}) i cou-la en un cassó a foc baix amb la mantega ({mantega}) fins que sigui transparent.'),
      p('Aixafa el pebre en gra ({pebre-negre}) amb el cul d’un got o al morter (que quedi a trossets, no en pols) i afegeix-lo a la ceba un minut.'),
      c('Afegeix-hi la nata ({nata}) i la sal ({sal}) i deixa-ho fer a foc baix, remenant, fins que napi la cullera.', 6, 'Espessir la salsa'),
    ],
  }),
  salsa({
    id: 'salsa-bolets',
    nom: 'Salsa de bolets',
    tempsMinuts: 20,
    ingredients: [l('bolets', 200), l('all', 1), l('oli-oliva', 15), l('nata', 200), l('julivert', 3), l('sal', 2)],
    passos: [
      p('Neteja els bolets ({bolets}) amb un drap humit (sense remullar-los) i talla’ls a trossos. Pica l’all ({all}) i el julivert ({julivert}).'),
      c('En una paella a foc fort amb l’oli ({oli-oliva}), salta els bolets fins que deixin anar l’aigua i aquesta s’evapori. Afegeix-hi l’all un minut.', 6, 'Saltar els bolets'),
      c('Afegeix-hi la nata ({nata}) i la sal ({sal}) i cou-ho a foc baix fins que espesseixi. Acaba-ho amb el julivert.', 5, 'Espessir la salsa'),
    ],
  }),
  salsa({
    id: 'all-i-julivert',
    nom: 'Oli d’all i julivert',
    tempsMinuts: 5,
    ingredients: [l('all', 4), l('julivert', 15), l('llimona', 30), l('sal', 2), l('oli-oliva', 100)],
    passos: [
      p('Pica molt fins els alls ({all}) i el julivert ({julivert}).'),
      p('Barreja-ho en un pot amb el suc de la llimona ({llimona}), la sal ({sal}) i l’oli ({oli-oliva}).'),
      p('Pinta’n el peix, el marisc o la sípia acabats de treure de la brasa, o fes-hi servir de marinada abans.'),
    ],
  }),
  salsa({
    id: 'salsa-teriyaki',
    nom: 'Salsa teriyaki',
    tempsMinuts: 10,
    ingredients: [l('salsa-soja', 80), l('mel', 40), l('sucre', 15), l('gingebre', 10), l('all', 1)],
    passos: [
      p('Pela i ratlla el gingebre ({gingebre}) i l’all ({all}).'),
      c(
        'Posa-ho en un cassó amb la salsa de soja ({salsa-soja}), la mel ({mel}), el sucre ({sucre}) i un raig d’aigua (3 cullerades). ' +
          'Cou-ho a foc baix, remenant, fins que espesseixi i s’enganxi a la cullera.',
        6,
        'Reduir la salsa',
      ),
      p('Deixa-la refredar. Serveix per pintar pollastre, salmó o tonyina a la brasa, i per sucar.'),
    ],
  }),
];
