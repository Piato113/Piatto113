import type { Recepta } from '../domini';
import { c, l, p } from './ajudants';

// Cuina tradicional andalusa (recopilatori d'octubre de 2026). Quantitats per a 4 racions normals.

export const receptesAndaluses: Recepta[] = [
  {
    id: 'salmorejo',
    nom: 'Salmorejo cordovès amb ou i pernil',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['sopa', 'verdura', 'carn'],
    ingredients: [
      l('tomaquet', 1000),
      l('pa-barra', 200),
      l('all', 1),
      l('oli-oliva', 150),
      l('vinagre', 10),
      l('sal', 6),
      l('ou', 2),
      l('taquets-pernil', 80),
    ],
    passos: [
      c(
        'Posa els ous ({ou}) en un cassó amb aigua freda, porta’ls a bullir i compta 10 minuts. Refreda’ls en aigua freda.',
        10,
        'Ous durs',
      ),
      p(
        'Mentrestant, renta els tomàquets ({tomaquet}) (millor si són ben madurs), treu-los el pedúncul i talla’ls a quarts. Tritura’ls amb la batedora ' +
          'fins que siguin líquids i passa’ls per un colador per treure pells i llavors.',
      ),
      p(
        'Talla el pa ({pa-barra}) a trossos, sense la crosta si és molt dura, i posa’l en remull en el tomàquet triturat 5 minuts. Afegeix-hi l’all ({all}) pelat ' +
          'i sense el germen, el vinagre ({vinagre}) i la sal ({sal}).',
      ),
      p(
        'Tritura-ho mentre hi aboques l’oli ({oli-oliva}) en un fil, a poc a poc: el salmorejo s’emulsiona i es torna espès i d’un color taronja. ' +
          'Ha de ser més espès que un gaspatxo, com una crema. Tasta’l de sal.',
      ),
      c('Guarda’l a la nevera fins que sigui ben fred.', 10, 'Refredar'),
      p('Pela els ous i pica’ls. Serveix el salmorejo en bols amb l’ou i el pernil ({taquets-pernil}) per sobre i un fil d’oli.'),
    ],
  },
  {
    id: 'flamenquins',
    nom: 'Flamenquins cordovesos',
    racions: 4,
    tempsMinuts: 35,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['patates-fregides', 'amanida'],
    ingredients: [
      l('llom', 600),
      l('pernil-serra', 160),
      l('ou', 2),
      l('farina', 50),
      l('pa-ratllat', 150),
      l('oli-girasol', 400),
      l('sal', 3),
    ],
    passos: [
      p(
        'Necessites 8 filets de llom ({llom}) prims. Posa’ls entre dos fulls de paper de forn i aixafa’ls amb un corró fins que facin 2-3 mm de gruix. ' +
          'Sala’ls una mica amb la sal ({sal}) (el pernil ja és salat).',
      ),
      p(
        'Cobreix cada filet amb llesques de pernil serrà ({pernil-serra}) i enrotlla’l ben estret, des de la part curta, com un canut. ' +
          'Si s’obren, punxa’ls amb un escuradents.',
      ),
      p(
        'Prepara tres plats: un amb la farina ({farina}), un amb els ous ({ou}) batuts i un amb el pa ratllat ({pa-ratllat}). Passa cada rotlle per farina, ' +
          'ou i pa ratllat, prement perquè quedi ben cobert.',
      ),
      c(
        'Escalfa l’oli ({oli-girasol}) en una paella fonda o un cassó a foc mitjà-fort: ha de cobrir els flamenquins fins a la meitat. És a punt quan ' +
          'un tros de pa hi bombolleja de seguida.',
        4,
        'Escalfar l’oli',
      ),
      c(
        'Fregeix-los en tandes, girant-los perquè es daurin per tot arreu. Abaixa el foc a mitjà perquè la carn es faci per dins. Treu-los a paper de cuina ' +
          'i talla’n un per comprovar que la carn és blanca per dins.',
        6,
        'Fregir els flamenquins',
      ),
    ],
  },
  {
    id: 'calamars-andalusa',
    nom: 'Calamars a l’andalusa',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['peix'],
    ambAcompanyament: true,
    acompanyaments: ['amanida'],
    ingredients: [l('calamar', 800), l('farina', 150), l('oli-girasol', 500), l('llimona', 1, 'u'), l('sal', 5)],
    passos: [
      p(
        'Descongela els calamars ({calamar}) a la nevera la nit abans. Eixuga’ls molt bé amb paper de cuina (si són molls, l’oli esquitxa i l’arrebossat no s’enganxa) ' +
          'i talla’ls a anelles d’1 cm. Sala’ls amb la sal ({sal}).',
      ),
      c(
        'Escalfa l’oli ({oli-girasol}) en un cassó o una paella fonda a foc fort: ha de fer 3 cm de fondària. És a punt quan una anella hi bombolleja amb força.',
        5,
        'Escalfar l’oli',
      ),
      p(
        'Posa la farina ({farina}) en una bossa, afegeix-hi una tanda de calamars, tanca-la i sacseja-la. Treu-los i espolsa’ls en un colador perquè només ' +
          'quedi una capa fina de farina.',
      ),
      c(
        'Fregeix-los en tandes petites (si n’hi poses molts, l’oli es refreda i queden tous) fins que siguin daurats. Treu-los a paper de cuina.',
        2,
        'Fregir una tanda',
      ),
      p('Serveix-los acabats de fer amb la llimona ({llimona}) a gallons.'),
    ],
  },
  {
    id: 'carn-tomaquet',
    nom: 'Carn amb tomàquet a l’andalusa',
    racions: 4,
    tempsMinuts: 90,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['patates-fregides', 'arros-blanc', 'pa-amb-tomaquet'],
    ingredients: [
      l('vedella-estofar', 800),
      l('tomaquet-triturat', 800),
      l('ceba', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('all', 3),
      l('vi-blanc', 100),
      l('pebre-vermell', 2),
      l('llorer', 1),
      l('sucre', 5),
      l('oli-oliva', 50),
      l('sal', 10),
    ],
    passos: [
      p('Sala la carn ({vedella-estofar}) amb la sal ({sal}). Pela i pica la ceba ({ceba}), el pebrot ({pebrot-verd}) i els alls ({all}).'),
      c('En una cassola a foc fort amb l’oli ({oli-oliva}), daura la carn en tandes, sense amuntegar-la. Treu-la.', 10, 'Daurar la carn'),
      c('Abaixa el foc i cou la ceba, el pebrot i l’all fins que siguin tous.', 10, 'Sofregit'),
      p(
        'Afegeix-hi el pebre vermell ({pebre-vermell}), remena 10 segons i aboca-hi el vi ({vi-blanc}). Deixa’l bullir un minut. Afegeix-hi el tomàquet ' +
          '({tomaquet-triturat}), el sucre ({sucre}) (corregeix l’acidesa) i el llorer ({llorer}).',
      ),
      c(
        'Torna-hi la carn, tapa-ho i cou-ho a foc molt suau, remenant de tant en tant, fins que la carn es desfaci en prémer-la amb una forquilla. ' +
          'Si la salsa s’espesseix massa, afegeix-hi un raig d’aigua.',
        60,
        'Coure la carn',
      ),
    ],
  },
  {
    id: 'pollastre-ajillo',
    nom: 'Pollastre a l’ajillo',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['patates-fregides', 'amanida', 'arros-blanc'],
    ingredients: [
      l('pollastre-trossos', 1200),
      l('all', 12),
      l('vi-blanc', 150),
      l('llorer', 2),
      l('farigola', 1),
      l('julivert', 10),
      l('oli-oliva', 80),
      l('sal', 10),
      l('pebre-negre', 1),
    ],
    passos: [
      p(
        'Talla el pollastre ({pollastre-trossos}) a trossos petits, d’una mossegada (demana-ho a la carnisseria). Salpebra’l amb la sal ({sal}) i el pebre ' +
          '({pebre-negre}). Esclafa els alls ({all}) amb el palmell, amb la pell.',
      ),
      c(
        'En una cassola ampla a foc mitjà amb l’oli ({oli-oliva}), cou els alls fins que siguin daurats, i treu-los perquè no es cremin.',
        4,
        'Daurar els alls',
      ),
      c(
        'Puja el foc i daura el pollastre en tandes fins que sigui ben rossit per totes bandes: com més daurat, més gust.',
        15,
        'Daurar el pollastre',
      ),
      c(
        'Torna-hi tot el pollastre i els alls, aboca-hi el vi ({vi-blanc}), afegeix-hi el llorer ({llorer}) i la farigola ({farigola}), tapa i cou-ho a foc mitjà ' +
          'fins que el vi es redueixi i el pollastre sigui fet per dins.',
        15,
        'Coure amb el vi',
      ),
      p('Escampa-hi el julivert ({julivert}) picat i serveix-lo amb l’acompanyament.'),
    ],
  },
  {
    id: 'patates-pobre-ou',
    nom: 'Patates a lo pobre amb ou ferrat',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['ou', 'verdura', 'vegetaria'],
    ingredients: [
      l('patata', 1200),
      l('ceba', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('all', 2),
      l('ou', 4),
      l('oli-oliva', 200),
      l('vinagre', 10),
      l('sal', 8),
    ],
    passos: [
      p(
        'Pela les patates ({patata}) i talla-les a rodanxes de 3-4 mm. Pela la ceba ({ceba}) i talla-la a tires. Treu les llavors als pebrots ({pebrot-verd}, ' +
          '{pebrot-vermell}) i talla’ls a tires. Pela els alls ({all}) i talla’ls a làmines.',
      ),
      c(
        'En una paella gran, posa tres quarts de l’oli ({oli-oliva:3/4}) a foc mitjà i afegeix-hi les patates, la ceba, els pebrots i l’all amb la sal ({sal}). ' +
          'Les patates s’han de confitar a poc a poc, no fregir: remena de tant en tant amb compte. Són fetes quan són toves i algunes es trenquen.',
        25,
        'Confitar les patates',
      ),
      p(
        'Escorre-les en un colador sobre un bol (l’oli es pot fer servir per a una altra recepta) i torna-les a la paella amb el vinagre ({vinagre}). ' +
          'Remena i reparteix-les als plats.',
      ),
      c(
        'En una paella petita, escalfa la resta de l’oli ({oli-oliva:1/4}) a foc mitjà-fort i fregeix els ous ({ou}) d’un en un, tirant-los oli per sobre ' +
          'amb una cullera, fins que la clara sigui quallada i amb puntilla i el rovell líquid.',
        1,
        'Ou ferrat',
      ),
      p('Posa un ou sobre cada plat de patates i serveix-ho de seguida.'),
    ],
  },
  {
    id: 'seitons-fregits',
    nom: 'Seitons fregits',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['peix'],
    ambAcompanyament: true,
    acompanyaments: ['amanida'],
    ingredients: [l('seitons', 800), l('farina', 150), l('oli-girasol', 500), l('llimona', 1, 'u'), l('sal', 6)],
    passos: [
      p(
        'Si els seitons ({seitons}) tenen cap o budells, treu-los estirant el cap cap avall. Renta’ls en aigua freda, escorre’ls i eixuga’ls molt bé ' +
          'amb paper de cuina. Sala’ls amb la sal ({sal}).',
      ),
      c(
        'Escalfa l’oli ({oli-girasol}) en una paella fonda a foc fort: ha de fer 2-3 cm de fondària. És a punt quan un seitó enfarinat hi bombolleja amb força.',
        5,
        'Escalfar l’oli',
      ),
      p(
        'Enfarina els seitons ({farina}) de 5 en 5, agafant-los per la cua i ajuntant-los pel cap en forma de ventall (així es fregeixen junts i no es trenquen). ' +
          'Espolsa’n la farina sobrant.',
      ),
      c('Fregeix-los en tandes fins que siguin daurats i cruixents. Treu-los a paper de cuina.', 2, 'Fregir una tanda'),
      p('Serveix-los calents amb la llimona ({llimona}) a gallons.'),
    ],
  },
  {
    id: 'pipirrana',
    nom: 'Pipirrana amb tonyina i ou',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['verdura', 'peix', 'ou'],
    ingredients: [
      l('tomaquet', 5, 'u'),
      l('pebrot-verd', 2, 'u'),
      l('cogombre', 1, 'u'),
      l('ceba', 1, 'u'),
      l('tonyina', 240),
      l('ou', 4),
      l('oli-oliva', 70),
      l('vinagre', 20),
      l('sal', 4),
      l('pa-pages', 300),
    ],
    passos: [
      c(
        'Posa els ous ({ou}) en un cassó amb aigua freda, porta’ls a bullir i compta 10 minuts. Refreda’ls en aigua freda.',
        10,
        'Ous durs',
      ),
      p(
        'Mentrestant, talla els tomàquets ({tomaquet}), els pebrots ({pebrot-verd}), el cogombre ({cogombre}) pelat i la ceba ({ceba}) a daus molt petits, ' +
          'tots de la mateixa mida. Posa-ho en una enciamera.',
      ),
      p(
        'Amaneix-ho amb l’oli ({oli-oliva}), el vinagre ({vinagre}) i la sal ({sal}), remena i deixa-ho reposar a la nevera mentre acaben els ous: ' +
          'el tomàquet deixa anar suc i fa la salsa.',
      ),
      p('Pela els ous i talla’ls a daus. Afegeix-los a la pipirrana amb la tonyina ({tonyina}) escorreguda i remena amb compte. Serveix-la freda amb el pa ({pa-pages}).'),
    ],
  },
  {
    id: 'sopa-picadillo',
    nom: 'Sopa de picadillo',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['sopa', 'carn', 'ou'],
    ingredients: [
      l('brou-pollastre', 1500),
      l('fideus-fins', 100),
      l('taquets-pernil', 100),
      l('ou', 3),
      l('julivert', 5),
      l('sal', 2),
    ],
    passos: [
      c(
        'Posa els ous ({ou}) en un cassó amb aigua freda, porta’ls a bullir i compta 10 minuts. Refreda’ls en aigua freda, pela’ls i pica’ls.',
        10,
        'Ous durs',
      ),
      c(
        'Mentrestant, porta el brou ({brou-pollastre}) a bullir en una olla. Afegeix-hi els fideus ({fideus-fins}) i cou-los el temps del paquet.',
        5,
        'Coure els fideus',
      ),
      p(
        'Afegeix-hi el pernil ({taquets-pernil}) i deixa-ho bullir un minut. Tasta-ho de sal ({sal}): el pernil i el brou ja en porten.',
      ),
      p('Serveix la sopa als plats i reparteix-hi l’ou dur picat i el julivert ({julivert}) per sobre.'),
    ],
  },
  {
    id: 'patates-sipia',
    nom: 'Patates amb sípia (papas con choco)',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['peix'],
    ingredients: [
      l('sipia', 600),
      l('patata', 1000),
      l('ceba', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('tomaquet', 2, 'u'),
      l('all', 3),
      l('pebre-vermell', 2),
      l('vi-blanc', 100),
      l('llorer', 1),
      l('oli-oliva', 50),
      l('sal', 8),
    ],
    passos: [
      p(
        'Talla la sípia ({sipia}) a daus de 3 cm. Pela i pica la ceba ({ceba}), el pebrot ({pebrot-verd}) i els alls ({all}). Ratlla els tomàquets ({tomaquet}).',
      ),
      c(
        'En una cassola a foc mitjà amb l’oli ({oli-oliva}), cou la ceba, el pebrot i l’all fins que siguin tous. Afegeix-hi el tomàquet i cou-ho fins que perdi l’aigua.',
        15,
        'Sofregit',
      ),
      c(
        'Afegeix-hi la sípia, remena, i aboca-hi el vi ({vi-blanc}). Afegeix-hi el pebre vermell ({pebre-vermell}), el llorer ({llorer}) i un got d’aigua, ' +
          'tapa-ho i cou-ho a foc suau: la sípia ha de començar a estovar-se abans de posar-hi les patates.',
        20,
        'Coure la sípia',
      ),
      p('Pela les patates ({patata}) i trenca-les a trossos (fent un tall i partint-les fent palanca).'),
      c(
        'Afegeix-les a la cassola amb la sal ({sal}) i aigua just fins a cobrir-les. Cou-ho a foc mitjà fins que les patates siguin tendres i el suc espès.',
        20,
        'Coure les patates',
      ),
    ],
  },
  {
    id: 'gazpachuelo',
    nom: 'Gazpachuelo malagueny',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['sopa', 'peix'],
    ingredients: [
      l('lluc', 400),
      l('gamba', 200),
      l('patata', 600),
      l('fumet', 1300),
      l('ou', 1),
      l('oli-girasol', 200),
      l('llimona', 1, 'u'),
      l('vinagre', 10),
      l('sal', 6),
    ],
    passos: [
      p('Pela les patates ({patata}) i talla-les a rodanxes d’1 cm. Talla el lluç ({lluc}) a trossos de 3 cm. Pela les gambes ({gamba}).'),
      c(
        'Porta el fumet ({fumet}) a bullir en una olla amb la sal ({sal}). Afegeix-hi les patates i cou-les fins que siguin tendres.',
        15,
        'Coure les patates',
      ),
      p(
        'Mentrestant, maionesa: posa al got de la batedora l’ou ({ou}), el suc de la llimona ({llimona}), el vinagre ({vinagre}) i l’oli ({oli-girasol}). ' +
          'Posa la batedora al fons i engega-la sense moure-la fins que s’emulsioni; després puja-la a poc a poc. Passa la maionesa a un bol gran.',
      ),
      c('Afegeix el lluç i les gambes a l’olla i cou-ho fins que el peix sigui blanc. Apaga el foc.', 4, 'Coure el peix'),
      p(
        'Ara cal anar amb compte perquè la maionesa no es talli: afegeix-hi un cullerot del brou calent, remenant amb una vareta; després un altre, ' +
          'i un altre, fins que la maionesa sigui com una crema líquida. Aboca aquesta barreja a l’olla a poc a poc, remenant. No ho tornis a bullir.',
      ),
      p('Serveix-lo calent de seguida, amb les patates, el lluç i les gambes.'),
    ],
  },
  {
    id: 'gaspatxo',
    nom: 'Gaspatxo andalús',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['sopa', 'verdura', 'vegetaria'],
    tipus: 'acompanyament',
    ingredients: [
      l('tomaquet', 1000),
      l('cogombre', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('all', 1),
      l('pa-barra', 50),
      l('oli-oliva', 80),
      l('vinagre', 25),
      l('sal', 6),
    ],
    passos: [
      p(
        'Renta els tomàquets ({tomaquet}) i talla’ls a trossos. Pela el cogombre ({cogombre}) i talla’l a trossos. Treu les llavors al pebrot ({pebrot-verd}) ' +
          'i talla’l. Pela l’all ({all}) i treu-li el germen (és el que repeteix).',
      ),
      p(
        'Posa-ho tot en un bol gran amb el pa ({pa-barra}) a trossos, el vinagre ({vinagre}) i la sal ({sal}), i tritura-ho amb la batedora fins que sigui fi. ' +
          'Continua triturant mentre hi aboques l’oli ({oli-oliva}) en un fil.',
      ),
      p('Passa’l per un colador si el vols ben fi. Si és massa espès, afegeix-hi aigua freda. Tasta’l de sal i vinagre.'),
      c('Guarda’l a la nevera fins que sigui ben fred. Serveix-lo en gots.', 10, 'Refredar'),
    ],
  },
];
