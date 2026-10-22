import type { Recepta } from '../domini';
import { c, l, p } from './ajudants';
import { ACOMPANYAMENTS_CREMA } from './receptes-hivern';

// Plats vegans (recopilatori d'octubre de 2026): sense carn, peix, ous ni làctics.
// Quantitats per a 4 racions normals.

export const receptesVeganes: Recepta[] = [
  {
    id: 'curri-cigrons',
    nom: 'Curri de cigrons i espinacs amb arròs basmati',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['llegums', 'verdura', 'vegetaria'],
    ingredients: [
      l('cigrons', 800),
      l('espinacs', 300),
      l('llet-coco', 400),
      l('tomaquet-triturat', 400),
      l('ceba', 1, 'u'),
      l('all', 3),
      l('curri', 8),
      l('comi', 2),
      l('arros-basmati', 280),
      l('oli-oliva', 30),
      l('sal', 10),
    ],
    passos: [
      p('Pela i pica la ceba ({ceba}) i els alls ({all}). Escorre els cigrons ({cigrons}) i esbandeix-los amb aigua freda.'),
      c(
        'En una cassola a foc mitjà amb l’oli ({oli-oliva}), cou la ceba fins que sigui tova i daurada. Afegeix-hi l’all, el curri ({curri}) i el comí ({comi}) ' +
          'i remena 30 segons: les espècies han de fer olor, sense cremar-se.',
        8,
        'Sofregit amb espècies',
      ),
      c(
        'Afegeix-hi el tomàquet ({tomaquet-triturat}) i cou-lo fins que espesseixi. Afegeix-hi els cigrons, la llet de coco ({llet-coco}) i la meitat de la sal ' +
          '({sal:1/2}), i cou-ho a foc suau, remenant de tant en tant.',
        12,
        'Coure el curri',
      ),
      c(
        'Mentrestant, renta l’arròs ({arros-basmati}) en un colador fins que l’aigua surti clara. Bull-lo en aigua abundant amb la resta de la sal ({sal:1/2}) ' +
          'fins que sigui tou però solt, i escorre’l.',
        11,
        'Bullir l’arròs',
      ),
      c('Afegeix els espinacs ({espinacs}) congelats al curri i cou-ho fins que es desfacin i s’escalfin. Tasta-ho de sal.', 5, 'Espinacs'),
      p('Serveix el curri amb l’arròs al costat.'),
    ],
  },
  {
    id: 'llenties-arros-ceba',
    nom: 'Llenties amb arròs i ceba caramel·litzada (mujaddara)',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['llegums', 'arros', 'vegetaria'],
    ingredients: [
      l('llenties', 250),
      l('arros-llarg', 200),
      l('ceba', 3, 'u'),
      l('comi', 3),
      l('oli-oliva', 70),
      l('sal', 8),
      l('enciam', 1),
      l('llimona', 1, 'u'),
    ],
    passos: [
      c(
        'Renta les llenties ({llenties}) i posa-les en una olla amb aigua freda que les cobreixi tres dits. Porta-les a bullir i cou-les fins que siguin ' +
          'gairebé tendres però senceres.',
        18,
        'Coure les llenties',
      ),
      c(
        'Mentrestant, pela les cebes ({ceba}) i talla-les a tires fines. Cou-les en una paella ampla a foc mitjà amb tres quarts de l’oli ({oli-oliva:3/4}), ' +
          'remenant sovint, fins que siguin ben marrons i dolces (si s’enganxen, afegeix-hi una cullerada d’aigua i rasca el fons).',
        25,
        'Caramel·litzar la ceba',
      ),
      p(
        'Escorre les llenties guardant-ne l’aigua. En una cassola amb la resta de l’oli ({oli-oliva:1/4}), torra l’arròs ({arros-llarg}) amb el comí ({comi}) ' +
          'un minut. Afegeix-hi les llenties, la meitat de la ceba i 450 ml de l’aigua de les llenties (completa-la amb aigua si no n’hi ha prou) i la sal ({sal}).',
      ),
      c(
        'Tapa la cassola i cou-ho a foc baix, sense remenar, fins que l’arròs hagi xuclat el líquid. Apaga el foc i deixa-ho reposar tapat 5 minuts.',
        15,
        'Coure l’arròs',
      ),
      p(
        'Serveix-ho amb la resta de la ceba per sobre. Acompanya-ho amb l’enciam ({enciam}) a tires amanit amb el suc de la llimona ({llimona}), un raig d’oli i sal.',
      ),
    ],
  },
  {
    id: 'falafel',
    nom: 'Falafel amb amanida i salsa de tahini',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['llegums', 'vegetaria'],
    ingredients: [
      l('cigrons-secs', 300),
      l('ceba', 1, 'u'),
      l('all', 3),
      l('julivert', 30),
      l('comi', 4),
      l('farina', 30),
      l('oli-girasol', 500),
      l('tahini', 80),
      l('llimona', 1, 'u'),
      l('enciam', 1),
      l('tomaquet', 2, 'u'),
      l('cogombre', 1, 'u'),
      l('sal', 8),
    ],
    passos: [
      p(
        'La nit abans (unes 12 hores), posa els cigrons secs ({cigrons-secs}) en remull amb el triple d’aigua. Han de ser crus: amb cigrons de pot, ' +
          'el falafel es desfà en fregir-lo.',
      ),
      p(
        'Escorre’ls i eixuga’ls bé. Tritura’ls amb la ceba ({ceba}) i els alls ({all}) pelats, el julivert ({julivert}), el comí ({comi}) i la meitat de la sal ({sal:1/2}), ' +
          'fins que quedi una pasta granulada, com sorra humida (no una crema). Afegeix-hi la farina ({farina}) i barreja.',
      ),
      c('Guarda la pasta a la nevera perquè agafi consistència.', 15, 'Reposar la pasta'),
      p(
        'Salsa: barreja el tahini ({tahini}) amb el suc de mitja llimona ({llimona:1/2}), un pessic de sal i aigua freda, a cullerades, fins que sigui ' +
          'com un iogurt líquid. Talla l’enciam ({enciam}), els tomàquets ({tomaquet}) i el cogombre ({cogombre}) i amaneix-ho amb la resta de la llimona ({llimona:1/2}) ' +
          'i la resta de la sal ({sal:1/2}).',
      ),
      c(
        'Escalfa l’oli ({oli-girasol}) en un cassó a foc mitjà-fort (ha de fer 4 cm de fondària). Amb les mans molles, fes boletes com una nou i aixafa-les una mica. ' +
          'Fregeix-les en tandes fins que siguin ben marrons i cruixents. Treu-les a paper de cuina.',
        4,
        'Fregir una tanda',
      ),
      p('Serveix el falafel amb l’amanida i la salsa de tahini per sobre.'),
    ],
  },
  {
    id: 'bolonyesa-soja',
    nom: 'Espaguetis a la bolonyesa de soja',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['pasta', 'llegums', 'vegetaria'],
    ingredients: [
      l('espaguetis', 400),
      l('soja-texturitzada', 120),
      l('ceba', 1, 'u'),
      l('pastanaga', 1, 'u'),
      l('all', 2),
      l('tomaquet-triturat', 800),
      l('salsa-soja', 20),
      l('orenga', 2),
      l('oli-oliva', 40),
      l('sal', 30),
    ],
    passos: [
      c(
        'Posa la soja texturitzada ({soja-texturitzada}) en un bol i cobreix-la amb aigua calenta. Deixa-la hidratar fins que s’infli. Escorre-la ' +
          'i prem-la amb les mans perquè deixi anar l’aigua.',
        10,
        'Hidratar la soja',
      ),
      c(
        'Mentrestant, pela i pica la ceba ({ceba}), la pastanaga ({pastanaga}) i els alls ({all}). Cou-ho en una cassola a foc mitjà amb l’oli ({oli-oliva}) ' +
          'fins que sigui tou.',
        8,
        'Sofregit',
      ),
      c(
        'Afegeix-hi la soja i cou-la a foc fort, remenant, fins que es dauri una mica (així agafa textura de carn). Afegeix-hi la salsa de soja ({salsa-soja}), ' +
          'el tomàquet ({tomaquet-triturat}), l’orenga ({orenga}) i un pessic de la sal, i cou-ho a foc suau fins que la salsa espesseixi.',
        15,
        'Coure la salsa',
      ),
      p('Posa una olla gran a foc fort amb aigua: 1 litre per cada 100 g de pasta. Quan bulli amb força, afegeix-hi la resta de la sal ({sal}).'),
      c('Cou-hi els espaguetis ({espaguetis}) el temps del paquet, remenant al principi. Escorre’ls i barreja’ls amb la salsa.', 10, 'Bullir la pasta'),
    ],
  },
  {
    id: 'chili-sense-carn',
    nom: 'Chili sense carn',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['llegums', 'vegetaria'],
    ingredients: [
      l('mongetes-vermelles-cuites', 800),
      l('soja-texturitzada', 80),
      l('ceba', 1, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('all', 2),
      l('tomaquet-triturat', 400),
      l('blat-de-moro', 140),
      l('comi', 3),
      l('pebre-vermell', 4),
      l('bitxo', 1),
      l('oli-oliva', 30),
      l('sal', 6),
      l('arros-llarg', 280),
    ],
    passos: [
      c('Hidrata la soja ({soja-texturitzada}) en aigua calenta. Escorre-la i prem-la.', 10, 'Hidratar la soja'),
      p('Pela i pica la ceba ({ceba}) i els alls ({all}). Treu les llavors al pebrot ({pebrot-vermell}) i talla’l a daus.'),
      c(
        'En una cassola a foc mitjà amb l’oli ({oli-oliva}), cou la ceba, l’all i el pebrot fins que siguin tous. Afegeix-hi la soja i daura-la una mica.',
        10,
        'Sofregit',
      ),
      p(
        'Afegeix-hi el comí ({comi}), el pebre vermell ({pebre-vermell}) i el bitxo ({bitxo}) esmicolat (menys si no us agrada picant) i remena 30 segons. ' +
          'Afegeix-hi el tomàquet ({tomaquet-triturat}), les mongetes ({mongetes-vermelles-cuites}) escorregudes, el blat de moro ({blat-de-moro}) escorregut i la sal ({sal}).',
      ),
      c('Cou-ho a foc suau, remenant de tant en tant, fins que sigui espès.', 15, 'Coure el chili'),
      c('Mentrestant, bull l’arròs ({arros-llarg}) en aigua abundant amb sal fins que sigui tou, i escorre’l. Serveix el chili amb l’arròs.', 12, 'Bullir l’arròs'),
    ],
  },
  {
    id: 'llenties-verdures',
    nom: 'Llenties estofades amb verdures',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['llegums', 'verdura', 'vegetaria'],
    ingredients: [
      l('llenties', 320),
      l('ceba', 1, 'u'),
      l('pastanaga', 2, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('patata', 2, 'u'),
      l('tomaquet', 1, 'u'),
      l('all', 2),
      l('pebre-vermell', 3),
      l('llorer', 1),
      l('oli-oliva', 40),
      l('sal', 8),
    ],
    passos: [
      p(
        'Renta les llenties ({llenties}). Pela i pica la ceba ({ceba}), el pebrot ({pebrot-verd}) i els alls ({all}). Pela les pastanagues ({pastanaga}) i talla-les ' +
          'a rodanxes. Ratlla el tomàquet ({tomaquet}).',
      ),
      c(
        'En una olla a foc mitjà amb l’oli ({oli-oliva}), cou la ceba, el pebrot i l’all fins que siguin tous. Afegeix-hi el tomàquet i cou-lo fins que perdi l’aigua. ' +
          'Treu l’olla del foc, afegeix-hi el pebre vermell ({pebre-vermell}) i remena 10 segons.',
        12,
        'Sofregit',
      ),
      c(
        'Afegeix-hi les llenties, la pastanaga, el llorer ({llorer}) i 1,5 litres d’aigua. Porta-ho a bullir i cou-ho a foc suau, tapat.',
        15,
        'Coure les llenties',
      ),
      c(
        'Pela les patates ({patata}), trenca-les a trossos petits i afegeix-les amb la sal ({sal}). Cou-ho fins que les llenties i la patata siguin tendres i el brou espès. ' +
          'Si s’assequen, afegeix-hi aigua calenta.',
        20,
        'Patates',
      ),
    ],
  },
  {
    id: 'potatge-cigrons-carbassa',
    nom: 'Potatge de cigrons i carbassa',
    racions: 4,
    tempsMinuts: 35,
    etiquetes: ['llegums', 'verdura', 'sopa', 'vegetaria'],
    ingredients: [
      l('cigrons', 800),
      l('carbassa', 500),
      l('patata', 2, 'u'),
      l('ceba', 1, 'u'),
      l('all', 2),
      l('tomaquet', 1, 'u'),
      l('espinacs', 200),
      l('pebre-vermell', 3),
      l('comi', 1),
      l('brou-verdures', 1000),
      l('oli-oliva', 40),
      l('sal', 5),
    ],
    passos: [
      p(
        'Pela i pica la ceba ({ceba}) i els alls ({all}). Ratlla el tomàquet ({tomaquet}). Pela la carbassa ({carbassa}) si en té i les patates ({patata}) ' +
          'i talla-ho a daus de 2 cm. Escorre els cigrons ({cigrons}).',
      ),
      c(
        'En una olla a foc mitjà amb l’oli ({oli-oliva}), cou la ceba i l’all fins que siguin tous. Afegeix-hi el tomàquet i cou-lo fins que perdi l’aigua. ' +
          'Treu l’olla del foc, afegeix-hi el pebre vermell ({pebre-vermell}) i el comí ({comi}) i remena.',
        10,
        'Sofregit',
      ),
      c(
        'Afegeix-hi la carbassa, la patata, el brou ({brou-verdures}) i la sal ({sal}), i cou-ho a foc mitjà fins que la patata sigui tendra (la carbassa es desfarà una mica ' +
          'i espesseix el brou).',
        15,
        'Coure les verdures',
      ),
      c('Afegeix-hi els cigrons i els espinacs ({espinacs}) congelats i cou-ho fins que tot sigui calent.', 5, 'Cigrons i espinacs'),
    ],
  },
  {
    id: 'paella-verdures',
    nom: 'Paella de verdures',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['arros', 'verdura', 'vegetaria'],
    ingredients: [
      l('arros', 320),
      l('carxofes', 300),
      l('mongeta-tendra', 200),
      l('pebrot-vermell', 1, 'u'),
      l('carbasso', 1, 'u'),
      l('tomaquet', 2, 'u'),
      l('all', 3),
      l('brou-verdures', 1000),
      l('pebre-vermell', 2),
      l('colorant', 1),
      l('oli-oliva', 60),
      l('sal', 8),
    ],
    passos: [
      p(
        'Treu les llavors al pebrot ({pebrot-vermell}) i talla’l a tires. Talla el carbassó ({carbasso}) a daus i la mongeta tendra ({mongeta-tendra}) a trossos de 3 cm. ' +
          'Ratlla els tomàquets ({tomaquet}) i pica els alls ({all}).',
      ),
      c(
        'En una paella de paella a foc mitjà-fort amb l’oli ({oli-oliva}), salteja el pebrot, la mongeta i les carxofes ({carxofes}) fins que es comencin a daurar. ' +
          'Afegeix-hi el carbassó i salteja’l 2 minuts.',
        10,
        'Saltejar les verdures',
      ),
      c(
        'Fes un forat al mig, posa-hi l’all i el tomàquet i cou-ho fins que sigui una pasta fosca. Afegeix-hi el pebre vermell ({pebre-vermell}), remena 10 segons ' +
          'i aboca-hi el brou ({brou-verdures}) calent amb el colorant ({colorant}) i la sal ({sal}).',
        6,
        'Sofregit',
      ),
      p('Quan bulli, escampa l’arròs ({arros}) en forma de creu i reparteix-lo per tota la paella amb la cullera. A partir d’ara, no el remenis més.'),
      c('Cou-ho a foc fort els primers 8 minuts i a foc mitjà la resta, fins que l’arròs hagi xuclat el brou.', 17, 'Coure l’arròs'),
      c('Apaga el foc, tapa la paella amb un drap net i deixa-la reposar abans de servir.', 5, 'Reposar'),
    ],
  },
  {
    id: 'fideua-verdures',
    nom: 'Fideuà de verdures i bolets',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['pasta', 'verdura', 'vegetaria'],
    ingredients: [
      l('fideus-fideua', 350),
      l('bolets', 300),
      l('carbasso', 1, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('ceba', 1, 'u'),
      l('tomaquet', 2, 'u'),
      l('all', 3),
      l('brou-verdures', 900),
      l('pebre-vermell', 2),
      l('colorant', 1),
      l('oli-oliva', 60),
      l('sal', 6),
    ],
    passos: [
      p(
        'Neteja els bolets ({bolets}) amb un drap humit i talla’ls. Talla el carbassó ({carbasso}) i el pebrot ({pebrot-vermell}) a daus. Pica la ceba ({ceba}) i els alls ({all}). ' +
          'Ratlla els tomàquets ({tomaquet}).',
      ),
      c(
        'En una paella ampla a foc mitjà amb la meitat de l’oli ({oli-oliva:1/2}), torra els fideus ({fideus-fideua}), remenant sense parar, fins que siguin daurats. ' +
          'Treu-los a un plat.',
        4,
        'Torrar els fideus',
      ),
      c(
        'Amb la resta de l’oli ({oli-oliva:1/2}), salteja els bolets a foc fort fins que es daurin. Afegeix-hi la ceba, el pebrot i el carbassó i cou-ho fins que siguin tous.',
        8,
        'Verdures',
      ),
      c(
        'Afegeix-hi l’all i el tomàquet i cou-ho fins que sigui una pasta. Afegeix-hi el pebre vermell ({pebre-vermell}) i remena 10 segons.',
        5,
        'Sofregit',
      ),
      c(
        'Afegeix-hi els fideus, el brou ({brou-verdures}) calent, el colorant ({colorant}) i la sal ({sal}). Cou-ho a foc mitjà, sense remenar, fins que els fideus ' +
          'hagin xuclat el brou i les puntes s’aixequin.',
        10,
        'Coure els fideus',
      ),
      p('Deixa-la reposar 3 minuts. Si vols, serveix-la amb allioli.'),
    ],
  },
  {
    id: 'coliflor-rostida-cigrons',
    nom: 'Coliflor rostida amb cigrons i curri',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['verdura', 'llegums', 'vegetaria'],
    ingredients: [
      l('coliflor', 1, 'u'),
      l('cigrons', 800),
      l('ceba', 1, 'u'),
      l('curri', 6),
      l('comi', 2),
      l('oli-oliva', 60),
      l('tahini', 60),
      l('llimona', 1, 'u'),
      l('julivert', 10),
      l('sal', 8),
    ],
    passos: [
      p(
        'Encén el forn a 220 °C. Separa la coliflor ({coliflor}) a ramets d’una mossegada i renta-la. Escorre els cigrons ({cigrons}) i eixuga’ls amb paper de cuina. ' +
          'Pela la ceba ({ceba}) i talla-la a gallons.',
      ),
      p(
        'Posa-ho tot en una safata de forn gran amb l’oli ({oli-oliva}), el curri ({curri}), el comí ({comi}) i la sal ({sal}). Remena-ho amb les mans perquè quedi ' +
          'tot untat i escampa-ho en una sola capa (si s’amuntega, es cou al vapor i no es daura).',
      ),
      c(
        'Rosteix-ho a mitja altura, remenant a la meitat, fins que la coliflor tingui puntes torrades i sigui tendra i els cigrons cruixents.',
        30,
        'Rostir',
      ),
      p(
        'Mentrestant, barreja el tahini ({tahini}) amb el suc de la llimona ({llimona}) i aigua freda a cullerades fins que sigui una salsa líquida. ' +
          'Serveix la coliflor amb la salsa per sobre i el julivert ({julivert}) picat.',
      ),
    ],
  },
  {
    id: 'alberginies-farcides-llenties',
    nom: 'Albergínies farcides de llenties',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['verdura', 'llegums', 'vegetaria'],
    ingredients: [
      l('alberginia', 2, 'u'),
      l('llenties-cuites', 400),
      l('ceba', 1, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('all', 2),
      l('tomaquet-triturat', 300),
      l('pa-ratllat', 30),
      l('orenga', 1),
      l('oli-oliva', 50),
      l('sal', 6),
    ],
    passos: [
      p(
        'Encén el forn a 200 °C. Talla les albergínies ({alberginia}) per la meitat de llarg, fes-los talls en creu a la polpa sense arribar a la pell, ' +
          'sala-les amb una part de la sal i unta-les amb un terç de l’oli ({oli-oliva:1/3}).',
      ),
      c('Enforna-les a la safata, amb la cara tallada cap amunt, fins que la polpa sigui tova.', 25, 'Albergínies al forn'),
      c(
        'Mentrestant, pica la ceba ({ceba}), el pebrot ({pebrot-vermell}) i els alls ({all}) i cou-ho en una paella a foc mitjà amb un altre terç de l’oli ' +
          '({oli-oliva:1/3}) fins que sigui tou.',
        10,
        'Sofregit',
      ),
      p(
        'Buida les albergínies amb una cullera, deixant 1 cm de polpa enganxada a la pell. Pica la polpa i afegeix-la a la paella amb el tomàquet ({tomaquet-triturat}), ' +
          'les llenties ({llenties-cuites}) escorregudes, l’orenga ({orenga}) i la resta de la sal ({sal}). Cou-ho fins que espesseixi.',
      ),
      c(
        'Omple les pells d’albergínia amb el farciment, escampa-hi el pa ratllat ({pa-ratllat}) i rega-ho amb la resta de l’oli ({oli-oliva:1/3}). ' +
          'Gratina-les a la part de dalt del forn fins que el pa sigui daurat.',
        10,
        'Gratinar',
      ),
    ],
  },
  {
    id: 'crema-carbassa',
    nom: 'Crema de carbassa amb crostons',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['sopa', 'verdura', 'vegetaria'],
    ambAcompanyament: true,
    acompanyaments: ACOMPANYAMENTS_CREMA,
    ingredients: [
      l('carbassa', 1000),
      l('patata', 1, 'u'),
      l('ceba', 1, 'u'),
      l('pastanaga', 1, 'u'),
      l('brou-verdures', 800),
      l('llet-coco', 200),
      l('pa-pages', 150),
      l('nou-moscada', 1),
      l('oli-oliva', 50),
      l('sal', 6),
    ],
    passos: [
      p('Pela la carbassa ({carbassa}) si en té, la patata ({patata}), la ceba ({ceba}) i la pastanaga ({pastanaga}), i talla-ho tot a trossos.'),
      c(
        'En una olla a foc mitjà amb la meitat de l’oli ({oli-oliva:1/2}), cou la ceba fins que sigui transparent. Afegeix-hi la resta de les verdures i remena 2 minuts.',
        6,
        'Ofegar',
      ),
      c(
        'Cobreix-ho amb el brou ({brou-verdures}), afegeix-hi la sal ({sal}) i cou-ho fins que la carbassa i la patata es desfacin en prémer-les.',
        20,
        'Coure les verdures',
      ),
      c(
        'Mentrestant, talla el pa ({pa-pages}) a daus i daura’ls en una paella amb la resta de l’oli ({oli-oliva:1/2}), remenant, fins que siguin cruixents.',
        5,
        'Crostons',
      ),
      p(
        'Afegeix la llet de coco ({llet-coco}) i la nou moscada ({nou-moscada}) a l’olla i tritura-ho amb la batedora fins que sigui una crema fina. ' +
          'Si és massa espessa, afegeix-hi aigua calenta. Serveix-la amb els crostons.',
      ),
    ],
  },
  {
    id: 'pebrots-farcits-arros',
    nom: 'Pebrots farcits d’arròs i verdures',
    racions: 4,
    tempsMinuts: 70,
    etiquetes: ['verdura', 'arros', 'vegetaria'],
    ingredients: [
      l('pebrot-vermell', 4, 'u'),
      l('arros', 200),
      l('xampinyons', 250),
      l('carbasso', 1, 'u'),
      l('ceba', 1, 'u'),
      l('all', 2),
      l('tomaquet-triturat', 400),
      l('pinyons', 30),
      l('oli-oliva', 50),
      l('sal', 8),
    ],
    passos: [
      c('Bull l’arròs ({arros}) en aigua amb sal fins que sigui a mig fer i escorre’l. Encén el forn a 190 °C.', 8, 'Bullir l’arròs'),
      p(
        'Talla la part de dalt dels pebrots ({pebrot-vermell}) com una tapa i buida’ls de llavors. Pica la ceba ({ceba}), els alls ({all}), el carbassó ({carbasso}) ' +
          'i els xampinyons ({xampinyons}).',
      ),
      c(
        'En una paella a foc mitjà amb la meitat de l’oli ({oli-oliva:1/2}), cou la ceba i l’all fins que siguin tous; afegeix-hi els xampinyons i el carbassó i cou-ho ' +
          'fins que perdin l’aigua. Afegeix-hi els pinyons ({pinyons}), la meitat del tomàquet ({tomaquet-triturat:1/2}) i la sal ({sal}), i cou-ho fins que espesseixi.',
        12,
        'Farciment',
      ),
      p('Barreja el farciment amb l’arròs i omple els pebrots sense prémer. Tapa’ls amb les seves tapes.'),
      c(
        'Posa’ls drets en una safata amb la resta del tomàquet ({tomaquet-triturat:1/2}), un got d’aigua i la resta de l’oli ({oli-oliva:1/2}). Enforna’ls fins que ' +
          'siguin tous i arrugats, regant-los amb la salsa a la meitat del temps.',
        45,
        'Pebrots al forn',
      ),
    ],
  },
  {
    id: 'wok-noodles-anacards',
    nom: 'Wok de noodles amb verdures i anacards',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['pasta', 'verdura', 'vegetaria'],
    ingredients: [
      l('noodles', 400),
      l('anacards', 80),
      l('pastanaga', 2, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('carbasso', 1, 'u'),
      l('xampinyons', 200),
      l('all', 2),
      l('salsa-soja', 60),
      l('sucre', 5),
      l('oli-girasol', 40),
    ],
    passos: [
      c(
        'Bull els noodles ({noodles}) el temps del paquet (sense els sobres de condiment), escorre’ls, passa’ls per aigua freda i barreja’ls amb un raig de l’oli ' +
          '({oli-girasol:1/4}).',
        4,
        'Bullir els noodles',
      ),
      p(
        'Pela les pastanagues ({pastanaga}) i talla-les a bastonets prims. Talla el pebrot ({pebrot-vermell}) i el carbassó ({carbasso}) a bastonets i els xampinyons ' +
          '({xampinyons}) a làmines. Pela els alls ({all}) i talla’ls a làmines.',
      ),
      c(
        'En un wok o una paella gran a foc mitjà, torra els anacards ({anacards}) sense oli, remenant, fins que siguin daurats. Treu-los.',
        3,
        'Torrar els anacards',
      ),
      c(
        'Puja el foc al màxim, posa-hi la resta de l’oli ({oli-girasol:3/4}) i salteja la pastanaga i els xampinyons 2 minuts; afegeix-hi el pebrot, el carbassó i l’all ' +
          'i continua remenant. Les verdures han de quedar cruixents.',
        5,
        'Saltejar les verdures',
      ),
      p(
        'Afegeix-hi els noodles, la salsa de soja ({salsa-soja}) i el sucre ({sucre}) i remena amb dues pinces fins que tot sigui calent. Serveix-ho amb els anacards per sobre.',
      ),
    ],
  },
  {
    id: 'bol-quinoa',
    nom: 'Bol de quinoa amb verdures rostides i tahini',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['verdura', 'llegums', 'vegetaria'],
    ingredients: [
      l('quinoa', 500),
      l('carbassa', 500),
      l('pebrot-vermell', 1, 'u'),
      l('ceba', 1, 'u'),
      l('cigrons', 400),
      l('alvocat', 2, 'u'),
      l('ruca', 50),
      l('tahini', 60),
      l('llimona', 1, 'u'),
      l('comi', 2),
      l('oli-oliva', 50),
      l('sal', 6),
    ],
    passos: [
      p(
        'Encén el forn a 220 °C. Pela la carbassa ({carbassa}) si en té i talla-la a daus de 2 cm. Talla el pebrot ({pebrot-vermell}) a tires i la ceba ({ceba}) a gallons. ' +
          'Escorre els cigrons ({cigrons}) i eixuga’ls.',
      ),
      c(
        'Posa-ho tot a la safata amb l’oli ({oli-oliva}), el comí ({comi}) i la sal ({sal}), remena i rosteix-ho, girant-ho a la meitat, fins que la carbassa sigui tova ' +
          'i torrada a les vores.',
        25,
        'Rostir les verdures',
      ),
      p(
        'Mentrestant, escalfa la quinoa ({quinoa}) en una paella amb un raig d’aigua, o al microones 2 minuts. Barreja el tahini ({tahini}) amb el suc de la llimona ' +
          '({llimona}) i aigua freda fins que sigui una salsa líquida. Talla els alvocats ({alvocat}) a làmines.',
      ),
      p('Munta els bols: quinoa a la base, la ruca ({ruca}), les verdures i els cigrons rostits, l’alvocat, i la salsa de tahini per sobre.'),
    ],
  },
  {
    id: 'amanida-llenties',
    nom: 'Amanida de llenties',
    racions: 4,
    tempsMinuts: 15,
    etiquetes: ['llegums', 'verdura', 'vegetaria'],
    ingredients: [
      l('llenties-cuites', 800),
      l('tomaquet', 3, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('ceba', 1, 'u'),
      l('olives-negres', 80),
      l('julivert', 10),
      l('oli-oliva', 60),
      l('vinagre', 20),
      l('sal', 4),
      l('pa-pages', 300),
    ],
    passos: [
      p('Escorre les llenties ({llenties-cuites}) i esbandeix-les amb aigua freda en un colador. Deixa-les escórrer bé.'),
      p(
        'Talla els tomàquets ({tomaquet}), els pebrots ({pebrot-vermell}, {pebrot-verd}) i la ceba ({ceba}) a daus petits. Talla les olives ({olives-negres}) a rodanxes ' +
          'i pica el julivert ({julivert}).',
      ),
      p(
        'En un got, desfés la sal ({sal}) amb el vinagre ({vinagre}) i bat-hi l’oli ({oli-oliva}). Barreja-ho tot amb les llenties i deixa-ho reposar 5 minuts perquè ' +
          'agafin gust. Serveix-la amb el pa ({pa-pages}).',
      ),
    ],
  },
  {
    id: 'fajitas-verdures',
    nom: 'Fajitas de verdures i mongetes',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['verdura', 'llegums', 'vegetaria'],
    ingredients: [
      l('tortilla-blat', 8),
      l('mongetes-vermelles-cuites', 400),
      l('pebrot-vermell', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('ceba', 1, 'u'),
      l('xampinyons', 250),
      l('alvocat', 2, 'u'),
      l('llimona', 1, 'u'),
      l('comi', 2),
      l('pebre-vermell', 3),
      l('oli-oliva', 30),
      l('sal', 5),
    ],
    passos: [
      p(
        'Treu les llavors als pebrots ({pebrot-vermell}, {pebrot-verd}) i talla’ls a tires. Pela la ceba ({ceba}) i talla-la a tires. Talla els xampinyons ({xampinyons}) a làmines.',
      ),
      c(
        'Escalfa una paella gran a foc fort amb l’oli ({oli-oliva}) i salteja els pebrots, la ceba i els xampinyons, remenant de tant en tant, fins que tinguin taques torrades.',
        8,
        'Saltejar les verdures',
      ),
      c(
        'Afegeix-hi les mongetes ({mongetes-vermelles-cuites}) escorregudes, el comí ({comi}), el pebre vermell ({pebre-vermell}) i la meitat de la sal ({sal:1/2}), ' +
          'i cou-ho fins que les mongetes siguin calentes.',
        3,
        'Mongetes',
      ),
      p(
        'Guacamole ràpid: aixafa la polpa dels alvocats ({alvocat}) amb el suc de la llimona ({llimona}) i la resta de la sal ({sal:1/2}).',
      ),
      p(
        'Escalfa les tortilles ({tortilla-blat}) en una paella seca, uns 20 segons per costat, i guarda-les tapades amb un drap. A taula, cadascú omple la seva ' +
          'amb les verdures i el guacamole.',
      ),
    ],
  },
  {
    id: 'mandonguilles-llenties',
    nom: 'Mandonguilles de llenties amb salsa de tomàquet',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['llegums', 'vegetaria'],
    ambAcompanyament: true,
    acompanyaments: ['arros-blanc', 'cuscus', 'pure-patata'],
    ingredients: [
      l('llenties-cuites', 800),
      l('ceba', 2, 'u'),
      l('all', 3),
      l('pa-ratllat', 80),
      l('farina', 40),
      l('julivert', 10),
      l('comi', 2),
      l('tomaquet-triturat', 600),
      l('oli-oliva', 80),
      l('sal', 6),
    ],
    passos: [
      p('Escorre molt bé les llenties ({llenties-cuites}) i eixuga-les amb paper de cuina: si són molles, les mandonguilles es desfan. Pica les cebes ({ceba}) i els alls ({all}).'),
      c(
        'Cou la meitat de la ceba ({ceba:1/2}) i un all en una paella amb una mica de l’oli fins que siguin tous. Aixafa les llenties amb una forquilla (que quedin trossets) ' +
          'i barreja-les amb aquest sofregit, el pa ratllat ({pa-ratllat}), el julivert ({julivert}) picat, el comí ({comi}) i la meitat de la sal ({sal:1/2}).',
        6,
        'Sofregit',
      ),
      p('Amb les mans molles, fes boles com una nou i passa-les per la farina ({farina}).'),
      c(
        'En una paella a foc mitjà-fort amb la meitat de l’oli ({oli-oliva:1/2}), daura les mandonguilles en tandes, girant-les amb compte. Treu-les.',
        6,
        'Daurar mandonguilles',
      ),
      c(
        'En una cassola amb la resta de l’oli ({oli-oliva:1/2}), cou la resta de la ceba ({ceba:1/2}) i l’all fins que siguin tous. Afegeix-hi el tomàquet ' +
          '({tomaquet-triturat}) i la resta de la sal ({sal:1/2}) i cou-ho fins que espesseixi.',
        12,
        'Salsa de tomàquet',
      ),
      c('Posa-hi les mandonguilles i cou-ho a foc suau, movent la cassola, perquè agafin el gust de la salsa.', 5, 'Ajuntar'),
    ],
  },
  {
    id: 'espaguetis-all-tomaquet-sec',
    nom: 'Espaguetis amb all, bitxo i tomàquet sec',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['pasta', 'vegetaria'],
    ingredients: [
      l('espaguetis', 400),
      l('tomaquet-sec', 100),
      l('all', 5),
      l('bitxo', 1),
      l('julivert', 15),
      l('ruca', 50),
      l('oli-oliva', 80),
      l('sal', 30),
    ],
    passos: [
      p('Posa una olla gran a foc fort amb aigua: 1 litre per cada 100 g de pasta. Quan bulli amb força, afegeix-hi la sal ({sal}).'),
      c(
        'Cou-hi els espaguetis ({espaguetis}) el temps del paquet, remenant al principi. Abans d’escórrer-los, guarda una tassa de l’aigua de cocció.',
        10,
        'Bullir la pasta',
      ),
      c(
        'Mentrestant, pela els alls ({all}) i talla’ls a làmines fines. Talla el tomàquet sec ({tomaquet-sec}) a tires. En una paella ampla a foc baix amb l’oli ' +
          '({oli-oliva}), cou l’all i el bitxo ({bitxo}) esmicolat fins que l’all sigui ros (si es torra massa, amarga).',
        4,
        'Daurar l’all',
      ),
      p(
        'Afegeix-hi el tomàquet sec, els espaguetis escorreguts i mig got de l’aigua de cocció, i remena a foc fort un minut: l’aigua i l’oli fan una salsa que s’enganxa a la pasta. ' +
          'Serveix-los amb el julivert ({julivert}) picat i la ruca ({ruca}) per sobre.',
      ),
    ],
  },
  {
    id: 'penne-arrabbiata',
    nom: 'Penne all’arrabbiata',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['pasta', 'vegetaria'],
    ingredients: [
      l('penne', 400),
      l('tomaquet-triturat', 800),
      l('all', 4),
      l('bitxo', 2),
      l('julivert', 10),
      l('oli-oliva', 50),
      l('sal', 32),
    ],
    passos: [
      c(
        'Pela els alls ({all}) i talla’ls a làmines. En una cassola a foc baix amb l’oli ({oli-oliva}), cou-los amb els bitxos ({bitxo}) esmicolats fins que l’all sigui ros. ' +
          'Afegeix-hi el tomàquet ({tomaquet-triturat}) i un pessic de la sal, i cou-ho a foc suau fins que la salsa espesseixi.',
        15,
        'Salsa picant',
      ),
      p('Mentrestant, posa una olla gran a foc fort amb aigua: 1 litre per cada 100 g de pasta. Quan bulli amb força, afegeix-hi la resta de la sal ({sal}).'),
      c('Cou-hi els penne ({penne}) un minut menys del que diu el paquet. Escorre’ls.', 10, 'Bullir la pasta'),
      p('Afegeix la pasta a la salsa i remena-ho a foc fort un minut perquè s’acabi de fer dins la salsa. Serveix-la amb el julivert ({julivert}) picat.'),
    ],
  },
];
