import type { LiniaRecepta, Recepta, Unitat } from '../domini';
import { preparacio } from './preparacio';
import { receptesAcompanyaments } from './receptes-acompanyaments';
import { receptesCatalanes } from './receptes-catalanes';
import { receptesCullera } from './receptes-cullera';
import { receptesForn } from './receptes-forn';
import { receptesItalianes } from './receptes-italianes';
import { receptesRapides } from './receptes-rapides';

// Catàleg inicial de receptes. Quantitats orientatives per a 4 racions normals:
// la gana de cada persona ja s'aplica amb el factor de la família.
// Els passos de preparació són a `preparacio.ts`.
//
// Etiquetes provisionals: carn, peix, vegetaria, pasta, arros, llegums, verdura, sopa, aprofitament.

const l = (ingredientId: string, quantitat: number, unitat?: Unitat): LiniaRecepta =>
  unitat ? { ingredientId, quantitat, unitat } : { ingredientId, quantitat };

/** Carn arrebossada: es planifica amb un acompanyament. */
const arrebossat = (id: string, nom: string, carn: string): Recepta => ({
  id,
  nom,
  racions: 4,
  tempsMinuts: 30,
  etiquetes: ['carn'],
  ambAcompanyament: true,
  ingredients: [
    l(carn, 600),
    l('ou', 2),
    l('pa-ratllat', 150),
    l('farina', 50),
    l('oli-girasol', 150),
    l('sal', 4),
  ],
});

const receptesBase: Recepta[] = [
  // Pasta
  {
    id: 'macarrons-bolonyesa',
    nom: 'Macarrons a la bolonyesa',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['pasta', 'carn'],
    ingredients: [
      l('macarrons', 400),
      l('carn-picada', 400),
      l('ceba', 1, 'u'),
      l('pastanaga', 1, 'u'),
      l('all', 1),
      l('tomaquet-triturat', 400),
      l('formatge-ratllat', 80),
      l('oli-oliva', 30),
      l('sal', 30),
      l('orenga', 1),
    ],
  },
  {
    id: 'tallarins-carbonara',
    nom: 'Tallarins a la carbonara',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['pasta', 'carn'],
    ingredients: [
      l('tallarins', 400),
      l('baco', 200),
      l('ou', 3),
      l('nata', 200),
      l('formatge-ratllat', 80),
      l('pebre-negre', 2),
      l('sal', 30),
    ],
  },
  {
    id: 'canelons',
    nom: 'Canelons',
    racions: 4,
    tempsMinuts: 90,
    etiquetes: ['pasta', 'carn'],
    ingredients: [
      l('plaques-canelons', 16),
      l('carn-picada', 500),
      l('ceba', 1, 'u'),
      l('tomaquet-triturat', 100),
      l('llet', 750),
      l('mantega', 60),
      l('farina', 60),
      l('formatge-ratllat', 100),
      l('nou-moscada', 1),
      l('oli-oliva', 30),
      l('sal', 20),
    ],
  },
  {
    id: 'fideus-cassola',
    nom: 'Fideus a la cassola',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['pasta', 'carn'],
    ingredients: [
      l('fideus-gruixuts', 400),
      l('costella-porc', 400),
      l('botifarra', 300),
      l('ceba', 1, 'u'),
      l('tomaquet-triturat', 200),
      l('all', 2),
      l('brou-pollastre', 1200),
      l('pebre-vermell', 3),
      l('oli-oliva', 40),
      l('sal', 4),
    ],
  },
  {
    id: 'fideua',
    nom: 'Fideuà',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['pasta', 'peix'],
    ingredients: [
      l('fideus-fideua', 400),
      l('sipia', 300),
      l('gamba', 400),
      l('tomaquet-triturat', 200),
      l('all', 3),
      l('fumet', 1200),
      l('colorant', 1),
      l('oli-oliva', 60),
      l('sal', 4),
    ],
  },

  // Arròs
  {
    id: 'arros-cubana',
    nom: 'Arròs a la cubana',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['arros', 'vegetaria'],
    ingredients: [
      l('arros', 320),
      l('tomaquet-fregit', 400),
      l('ou', 4),
      l('platan', 4, 'u'),
      l('all', 1),
      l('oli-oliva', 60),
      l('sal', 4),
    ],
  },
  {
    id: 'risotto-bolets',
    nom: 'Risotto de bolets de temporada',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['arros', 'vegetaria'],
    ingredients: [
      l('arros', 320),
      l('bolets', 400),
      l('ceba', 1, 'u'),
      l('brou-verdures', 1200),
      l('mantega', 40),
      l('formatge-ratllat', 60),
      l('oli-oliva', 30),
      l('sal', 4),
    ],
  },
  {
    id: 'paella',
    nom: 'Paella',
    racions: 4,
    tempsMinuts: 75,
    etiquetes: ['arros', 'carn', 'peix'],
    ingredients: [
      l('arros', 400),
      l('pollastre-trossos', 500),
      l('sipia', 300),
      l('gamba', 400),
      l('pebrot-vermell', 1, 'u'),
      l('tomaquet-triturat', 200),
      l('all', 3),
      l('fumet', 1200),
      l('colorant', 1),
      l('oli-oliva', 60),
      l('sal', 5),
    ],
  },

  // Llegums
  {
    id: 'llenties-estofades',
    nom: 'Llenties estofades amb xoriço',
    racions: 4,
    tempsMinuts: 75,
    etiquetes: ['llegums', 'carn'],
    ingredients: [
      l('llenties', 400),
      l('xorico', 200),
      l('ceba', 1, 'u'),
      l('pastanaga', 2, 'u'),
      l('patata', 2, 'u'),
      l('tomaquet-triturat', 200),
      l('all', 2),
      l('pebre-vermell', 3),
      l('oli-oliva', 30),
      l('sal', 5),
    ],
  },

  // Verdura
  {
    id: 'verdura-bullida',
    nom: 'Verdura bullida',
    racions: 4,
    tempsMinuts: 35,
    etiquetes: ['verdura', 'vegetaria'],
    ingredients: [l('mongeta-tendra', 600), l('patata', 4, 'u'), l('oli-oliva', 40), l('sal', 15)],
  },
  {
    id: 'verdura-forn',
    nom: 'Verdura al forn',
    racions: 4,
    tempsMinuts: 65,
    etiquetes: ['verdura', 'vegetaria'],
    ingredients: [
      l('carbasso', 1, 'u'),
      l('alberginia', 1, 'u'),
      l('pebrot-vermell', 2, 'u'),
      l('ceba', 2, 'u'),
      l('patata', 3, 'u'),
      l('oli-oliva', 50),
      l('sal', 5),
    ],
  },
  {
    id: 'trinxat',
    nom: 'Trinxat',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['verdura', 'carn'],
    ingredients: [l('col', 1, 'u'), l('patata', 5, 'u'), l('cansalada', 200), l('all', 3), l('oli-oliva', 50), l('sal', 15)],
  },
  {
    id: 'sopa-verdures',
    nom: 'Sopa de verdures',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['sopa', 'vegetaria', 'aprofitament'],
    ingredients: [
      l('brou-verdures', 1500),
      l('fideus-fins', 150),
      l('pastanaga', 1, 'u'),
      l('porro', 1, 'u'),
      l('patata', 1, 'u'),
      l('sal', 3),
    ],
  },

  // Carn amb acompanyament
  arrebossat('llom-arrebossat', 'Llom arrebossat', 'llom'),
  arrebossat('bistec-arrebossat', 'Bistec arrebossat', 'bistec'),
  arrebossat('pollastre-arrebossat', 'Pit de pollastre arrebossat', 'pit-pollastre'),
  {
    id: 'entrecot',
    nom: 'Entrecot a la planxa o a la brasa',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    ingredients: [l('entrecot', 800), l('oli-oliva', 20), l('sal', 4)],
  },

  // Acompanyaments
  {
    id: 'arros-blanc',
    nom: 'Arròs blanc',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: [],
    tipus: 'acompanyament',
    ingredients: [l('arros', 280), l('all', 1), l('oli-oliva', 20), l('sal', 3)],
  },
  {
    id: 'patates-fregides',
    nom: 'Patates fregides',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: [],
    tipus: 'acompanyament',
    ingredients: [l('patata', 1000), l('oli-girasol', 150), l('sal', 4)],
  },
  {
    id: 'patates-adobades',
    nom: 'Patates adobades al forn',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: [],
    tipus: 'acompanyament',
    ingredients: [
      l('patata', 1000),
      l('all', 2),
      l('oli-oliva', 40),
      l('pebre-vermell', 5),
      l('orenga', 2),
      l('sal', 4),
    ],
  },
  {
    id: 'cuscus',
    nom: 'Cuscús',
    racions: 4,
    tempsMinuts: 10,
    etiquetes: [],
    tipus: 'acompanyament',
    ingredients: [l('cuscus', 280), l('oli-oliva', 20), l('sal', 3)],
  },
  {
    id: 'verdures-saltejades',
    nom: 'Verdures saltejades',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: [],
    tipus: 'acompanyament',
    ingredients: [
      l('carbasso', 1, 'u'),
      l('pastanaga', 2, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('ceba', 1, 'u'),
      l('oli-oliva', 30),
      l('sal', 3),
    ],
  },
];

/** Receptes amb la preparació pas a pas (vegeu `preparacio.ts`). */
export const receptes: Recepta[] = [
  ...receptesBase.map((r) => {
    const passos = preparacio[r.id];
    return passos ? { ...r, passos } : r;
  }),
  ...receptesCatalanes,
  ...receptesCullera,
  ...receptesForn,
  ...receptesItalianes,
  ...receptesRapides,
  ...receptesAcompanyaments,
];
