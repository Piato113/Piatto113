import type { Pas, Recepta } from '../domini';
import { c, l, p } from './ajudants';

// Cuina italiana. Quantitats per a 4 racions normals.

/** Bullir pasta seca: l'aigua i la sal ja expliquen la proporció. */
function bullirPasta(pasta: string, nom: string, minuts: number, sal = '{sal}'): Pas[] {
  return [
    p(`Posa una olla gran a foc fort amb aigua: 1 litre per cada 100 g de pasta. Quan bulli amb força, afegeix-hi la sal (${sal}).`),
    c(
      `Tira-hi ${nom} ({${pasta}}) i remena de seguida perquè no s’enganxin. Quan l’aigua torni a bullir, compta el temps que diu el paquet ` +
        `(normalment uns ${minuts} minuts), remenant un parell de vegades. Ha de quedar al dente: tou però amb un punt de fermesa al centre. ` +
        'Abans d’escórrer, guarda una tassa de l’aigua de cocció.',
      minuts,
      'Bullir la pasta',
    ),
  ];
}

/** Massa de pizza (també per a calzone): farina, llevat, oli i sal. */
function massaPizza(): Pas[] {
  return [
    p(
      'En un bol gran, barreja la farina de força ({farina-forca}), el llevat ({llevat}) i la sal de la massa ({sal:4/5}). Fes un clot al mig i aboca-hi aigua tèbia ' +
        '(60 ml per cada 100 g de farina; ha d’estar tèbia, com la temperatura del dit: si crema, mata el llevat) i la meitat de l’oli ({oli-oliva:1/2}).',
    ),
    c(
      'Barreja-ho amb una cullera fins que no quedi farina seca. Passa-ho al taulell enfarinat i amassa-ho: estira la massa amb el palmell, ' +
        'plega-la sobre si mateixa, gira-la un quart i repeteix. Al principi s’enganxa; no hi afegeixis gaire farina. És a punt quan és llisa i elàstica ' +
        'i torna lentament a lloc si la pressiones amb el dit.',
      10,
      'Pastar la massa',
    ),
    c(
      'Fes-ne una bola, posa-la en un bol untat amb una mica d’oli, tapa-la amb un drap i deixa-la en un lloc càlid, lluny de corrents d’aire, ' +
        'fins que dobli el volum.',
      60,
      'Llevar la massa',
    ),
  ];
}

export const receptesItalianes: Recepta[] = [
  {
    id: 'lasanya',
    nom: 'Lasanya a la bolonyesa',
    racions: 4,
    tempsMinuts: 110,
    etiquetes: ['pasta', 'carn'],
    ingredients: [
      l('plaques-lasanya', 12),
      l('carn-picada', 500),
      l('ceba', 1, 'u'),
      l('pastanaga', 1, 'u'),
      l('all', 1),
      l('tomaquet-triturat', 600),
      l('orenga', 1),
      l('llet', 800),
      l('mantega', 60),
      l('farina', 60),
      l('nou-moscada', 1),
      l('mozzarella', 150),
      l('parmesa', 40),
      l('oli-oliva', 30),
      l('sal', 8),
    ],
    passos: [
      p('Pica la ceba ({ceba}), la pastanaga ({pastanaga}) pelada i l’all ({all}) ben fins.'),
      c(
        'Bolonyesa: posa una cassola a foc mitjà-baix amb l’oli ({oli-oliva}) i cou-hi la ceba i la pastanaga amb un pessic de sal fins que siguin toves, ' +
          'sense daurar-se. Afegeix l’all l’últim minut.',
        10,
        'Ofegar les verdures',
      ),
      c(
        'Puja el foc a mitjà-fort, afegeix la carn picada ({carn-picada}) i esmicola-la fins que sigui daurada i sense líquid.',
        8,
        'Daurar la carn',
      ),
      c(
        'Afegeix el tomàquet triturat ({tomaquet-triturat}), l’orenga ({orenga}) i la meitat de la sal ({sal:1/2}). Cou-ho a foc baix, tapat a mitges, ' +
          'remenant de tant en tant, fins que la salsa sigui espessa.',
        25,
        'Salsa bolonyesa',
      ),
      p(
        'Plaques: si el paquet diu que s’han d’hidratar, posa-les ({plaques-lasanya}) en una safata amb aigua calenta el temps que indiqui. ' +
          'Si són de les que van directes al forn, no cal fer res.',
      ),
      c(
        'Beixamel: escalfa la llet ({llet}) sense que bulli. En un cassó a foc mitjà-baix, fon la mantega ({mantega}), afegeix-hi la farina ({farina}) ' +
          'i remena amb unes varetes 2 minuts, sense que agafi color.',
        2,
        'Coure la farina',
      ),
      c(
        'Afegeix-hi la llet calenta en tres vegades, remenant sense parar amb les varetes perquè no es facin grumolls. Continua remenant a foc baix fins que ' +
          'espesseixi i cobreixi el dors d’una cullera. Posa-hi la resta de la sal ({sal:1/2}) i la nou moscada ({nou-moscada}). Ha de quedar una mica més ' +
          'líquida que la dels canelons: les plaques en xuclen.',
        8,
        'Espessir la beixamel',
      ),
      p('Encén el forn a 190 °C, amb escalfor a dalt i a baix.'),
      p(
        'Munta la lasanya en una safata de forn: una capa fina de beixamel al fons, una capa de plaques, bolonyesa, una mica de beixamel; ' +
          'i així fins a fer 3 o 4 pisos. Acaba amb plaques cobertes del tot de beixamel (si queda alguna vora seca, es farà dura). ' +
          'Escampa-hi la mozzarella ({mozzarella}) i el parmesà ({parmesa}).',
      ),
      c(
        'Enforna-la a mitja altura, tapada amb paper d’alumini, perquè les plaques es cuinin.',
        25,
        'Lasanya tapada',
      ),
      c('Destapa-la i deixa-la fins que el formatge sigui daurat i bombollegi.', 10, 'Gratinar la lasanya'),
      c('Deixa-la reposar abans de tallar-la: així les capes no es desmunten.', 10, 'Reposar la lasanya'),
    ],
  },
  {
    id: 'pizza',
    nom: 'Pizza casolana',
    racions: 4,
    tempsMinuts: 110,
    etiquetes: ['carn'],
    ingredients: [
      l('farina-forca', 500),
      l('llevat', 7),
      l('oli-oliva', 30),
      l('sal', 12),
      l('tomaquet-triturat', 250),
      l('mozzarella', 300),
      l('pernil-dolc', 150),
      l('orenga', 2),
    ],
    passos: [
      ...massaPizza(),
      p(
        'Encén el forn a la temperatura màxima (250 °C o més), amb escalfor a dalt i a baix, i posa-hi la safata a dins perquè s’escalfi molt.',
      ),
      p(
        'Salsa: barreja el tomàquet triturat ({tomaquet-triturat}) amb la resta de la sal ({sal:1/5}), l’orenga ({orenga}) i la resta de l’oli ({oli-oliva:1/2}). ' +
          'No cal coure-la.',
      ),
      p(
        'Divideix la massa en dues boles. Sobre un full de paper de forn enfarinat, estira-les amb les mans, des del centre cap enfora, fins que facin uns 3-4 mm ' +
          'de gruix, deixant la vora una mica més gruixuda.',
      ),
      p(
        'Escampa-hi la salsa deixant 1 cm de vora lliure (si poses massa salsa, la massa queda crua), i després la mozzarella ({mozzarella}) ' +
          'i el pernil ({pernil-dolc}) a trossos.',
      ),
      c(
        'Fes lliscar la pizza, amb el paper, sobre la safata calenta i enforna-la a la part de baix del forn fins que la vora sigui daurada i el formatge bombollegi. ' +
          'Fes la segona pizza igual. El cronòmetre és per a cada pizza.',
        12,
        'Pizza al forn',
      ),
    ],
  },
  {
    id: 'penne-pesto-pollastre',
    nom: 'Penne amb pesto i pollastre',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['pasta', 'carn'],
    ingredients: [
      l('penne', 400),
      l('pit-pollastre', 400),
      l('pesto', 190),
      l('parmesa', 40),
      l('oli-oliva', 20),
      l('sal', 34),
    ],
    passos: [
      ...bullirPasta('penne', 'els penne', 11, '{sal:9/10}'),
      p('Mentrestant, talla el pit de pollastre ({pit-pollastre}) a daus de 2 cm i sala’l amb la resta de la sal ({sal:1/10}).'),
      c(
        'Posa una paella gran a foc mitjà-fort amb l’oli ({oli-oliva}) i daura-hi el pollastre, remenant, fins que sigui daurat per fora i blanc per dins.',
        6,
        'Daurar el pollastre',
      ),
      p(
        'Escorre la pasta i posa-la a la paella del pollastre, fora del foc. Afegeix-hi el pesto ({pesto}) i 3 o 4 cullerades de l’aigua de cocció, ' +
          'i remena fins que la salsa quedi cremosa (no escalfis el pesto al foc: perd el color i el gust). Serveix amb el parmesà ({parmesa}) per sobre.',
      ),
    ],
  },
  {
    id: 'macarrons-tonyina',
    nom: 'Macarrons amb tonyina i tomàquet',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['pasta', 'peix'],
    ingredients: [
      l('macarrons', 400),
      l('tonyina', 240),
      l('tomaquet-fregit', 400),
      l('ceba', 1, 'u'),
      l('formatge-ratllat', 80),
      l('oli-oliva', 30),
      l('sal', 32),
    ],
    passos: [
      c(
        'Pica la ceba ({ceba}) ben fina. Posa una paella fonda a foc mitjà-baix amb l’oli ({oli-oliva}) i cou-la amb un pessic de la sal ({sal:1/16}) ' +
          'fins que sigui tova i daurada.',
        10,
        'Ofegar la ceba',
      ),
      c(
        'Afegeix-hi el tomàquet fregit ({tomaquet-fregit}) i la tonyina ({tonyina}) escorreguda i esmicolada, i escalfa-ho a foc baix remenant.',
        3,
        'Escalfar la salsa',
      ),
      ...bullirPasta('macarrons', 'els macarrons', 10, '{sal:15/16}'),
      p(
        'Escorre els macarrons i barreja’ls amb la salsa a foc baix 1 minut. Si queda sec, afegeix-hi una mica de l’aigua de cocció. ' +
          'Serveix-los amb el formatge ratllat ({formatge-ratllat}) per sobre.',
      ),
    ],
  },
  {
    id: 'rigatoni-salsitxes',
    nom: 'Rigatoni amb salsitxes i tomàquet',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['pasta', 'carn'],
    ingredients: [
      l('rigatoni', 400),
      l('salsitxes', 400),
      l('tomaquet-triturat', 400),
      l('ceba', 1, 'u'),
      l('all', 2),
      l('orenga', 1),
      l('sucre', 3),
      l('parmesa', 40),
      l('oli-oliva', 30),
      l('sal', 34),
    ],
    passos: [
      p(
        'Treu la pell de les salsitxes ({salsitxes}): fes-hi un tall de punta a punta i estira-la. Pica la ceba ({ceba}) i els grans d’all ({all}).',
      ),
      c(
        'Posa una paella fonda a foc mitjà-fort amb l’oli ({oli-oliva}) i daura-hi la carn de les salsitxes esmicolant-la amb una cullera.',
        6,
        'Daurar les salsitxes',
      ),
      c('Abaixa el foc a mitjà-baix, afegeix-hi la ceba i cou-la fins que sigui tova. Afegeix l’all l’últim minut.', 8, 'Ofegar la ceba'),
      c(
        'Afegeix-hi el tomàquet triturat ({tomaquet-triturat}), l’orenga ({orenga}), el sucre ({sucre}) i una part de la sal ({sal:1/17}). ' +
          'Cou-ho a foc baix remenant de tant en tant fins que la salsa sigui espessa.',
        15,
        'Coure la salsa',
      ),
      ...bullirPasta('rigatoni', 'els rigatoni', 12, '{sal:16/17}'),
      p(
        'Escorre la pasta i barreja-la amb la salsa a foc baix 1 minut, amb un raig de l’aigua de cocció si cal. Serveix amb el parmesà ({parmesa}) per sobre.',
      ),
    ],
  },
  {
    id: 'risotto-pollastre',
    nom: 'Risotto de pollastre i parmesà',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['arros', 'carn'],
    ingredients: [
      l('arros', 320),
      l('pit-pollastre', 400),
      l('ceba', 1, 'u'),
      l('vi-blanc', 100),
      l('brou-pollastre', 1300),
      l('mantega', 40),
      l('parmesa', 60),
      l('oli-oliva', 30),
      l('sal', 5),
    ],
    passos: [
      p('Escalfa el brou ({brou-pollastre}) en un cassó fins que bulli i deixa’l a foc mínim tota l’estona.'),
      p('Talla el pit de pollastre ({pit-pollastre}) a daus d’1,5 cm i sala’l amb la meitat de la sal ({sal:1/2}). Pica la ceba ({ceba}) ben fina.'),
      c(
        'En una cassola ampla a foc mitjà-fort, posa la meitat de l’oli ({oli-oliva:1/2}) i daura-hi el pollastre. Treu-lo i reserva’l.',
        5,
        'Daurar el pollastre',
      ),
      c(
        'Abaixa el foc a mitjà-baix, posa la resta de l’oli ({oli-oliva:1/2}) i la meitat de la mantega ({mantega:1/2}), i cou-hi la ceba fins que sigui ' +
          'transparent, sense que agafi color.',
        7,
        'Ofegar la ceba',
      ),
      c(
        'Afegeix l’arròs ({arros}) i remena fins que els grans siguin translúcids per les vores. Aboca-hi el vi ({vi-blanc}) i remena fins que s’evapori.',
        3,
        'Nacrar l’arròs',
      ),
      c(
        'Afegeix un cullerot de brou calent i remena suaument fins que l’arròs l’hagi absorbit gairebé tot. Repeteix-ho, cullerot a cullerot, remenant sovint. ' +
          'Als 10 minuts, torna-hi el pollastre.',
        18,
        'Coure el risotto',
      ),
      c(
        'Quan el gra sigui tou amb un punt de fermesa i el risotto quedi cremós (que es mogui com una onada), aparta’l del foc. Afegeix-hi la resta de la mantega ' +
          '({mantega:1/2}) freda a daus, el parmesà ({parmesa}) i la resta de la sal ({sal:1/2}) si cal, i remena amb energia. Tapa’l i deixa’l reposar.',
        2,
        'Reposar el risotto',
      ),
    ],
  },
  {
    id: 'gnocchi-formatges',
    nom: 'Gnocchi amb salsa de quatre formatges',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['pasta', 'vegetaria'],
    ingredients: [
      l('gnocchi', 800),
      l('nata', 300),
      l('formatge-blau', 100),
      l('parmesa', 50),
      l('mozzarella', 80),
      l('formatge-ratllat', 40),
      l('nou-moscada', 1),
      l('pebre-negre', 1),
      l('sal', 30),
    ],
    passos: [
      p('Posa una olla gran a foc fort amb aigua (uns 3 litres) i la sal ({sal}).'),
      c(
        'Salsa: en una paella fonda a foc baix, escalfa la nata ({nata}). Afegeix-hi el formatge blau ({formatge-blau}) a trossos, la mozzarella ({mozzarella}), ' +
          'el formatge ratllat ({formatge-ratllat}) i la meitat del parmesà ({parmesa:1/2}). Remena sense parar fins que tot es fongui i la salsa sigui llisa ' +
          '(no la deixis bullir fort o el formatge es farà grumolls). Afegeix-hi la nou moscada ({nou-moscada}) i el pebre ({pebre-negre}).',
        5,
        'Fondre els formatges',
      ),
      c(
        'Quan l’aigua bulli, tira-hi els gnocchi ({gnocchi}). Són fets quan pugen a la superfície (normalment 2-3 minuts): treu-los de seguida amb una escumadora.',
        3,
        'Bullir els gnocchi',
      ),
      p(
        'Posa’ls directament a la salsa, remena amb compte i serveix-los amb la resta del parmesà ({parmesa:1/2}) per sobre.',
      ),
    ],
  },
  {
    id: 'raviolis-tomaquet',
    nom: 'Raviolis amb salsa de tomàquet',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['pasta'],
    ingredients: [
      l('raviolis', 600),
      l('tomaquet-triturat', 400),
      l('all', 2),
      l('orenga', 1),
      l('sucre', 3),
      l('parmesa', 40),
      l('oli-oliva', 30),
      l('sal', 30),
    ],
    passos: [
      c(
        'Salsa: pela els grans d’all ({all}) i lamina’ls. Posa un cassó a foc mitjà-baix amb l’oli ({oli-oliva}) i l’all; quan l’all sigui daurat clar, ' +
          'afegeix-hi el tomàquet triturat ({tomaquet-triturat}), l’orenga ({orenga}), el sucre ({sucre}) i una part de la sal ({sal:1/10}). ' +
          'Cou-ho a foc baix, remenant de tant en tant, fins que sigui espès.',
        15,
        'Coure la salsa',
      ),
      p('Posa una olla gran a foc fort amb aigua (uns 3 litres) i la resta de la sal ({sal:9/10}).'),
      c(
        'Quan bulli, tira-hi els raviolis ({raviolis}) i cou-los a foc mitjà (si bull molt fort es poden obrir) el temps que diu el paquet.',
        4,
        'Bullir els raviolis',
      ),
      p('Escorre’ls amb compte, barreja’ls amb la salsa i serveix-los amb el parmesà ({parmesa}) per sobre.'),
    ],
  },
  {
    id: 'tortellini-nata',
    nom: 'Tortellini amb nata i pernil',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['pasta', 'carn'],
    ingredients: [
      l('tortellini', 600),
      l('nata', 300),
      l('pernil-dolc', 150),
      l('formatge-ratllat', 60),
      l('mantega', 20),
      l('nou-moscada', 1),
      l('pebre-negre', 1),
      l('sal', 30),
    ],
    passos: [
      p('Posa una olla gran a foc fort amb aigua (uns 3 litres) i la sal ({sal}).'),
      p('Talla el pernil dolç ({pernil-dolc}) a tires d’1 cm.'),
      c(
        'Posa una paella fonda a foc mitjà amb la mantega ({mantega}) i salta-hi el pernil. Aboca-hi la nata ({nata}), la nou moscada ({nou-moscada}) ' +
          'i el pebre ({pebre-negre}), i cou-ho a foc suau fins que la salsa s’espesseixi una mica.',
        4,
        'Fer la salsa',
      ),
      c(
        'Quan l’aigua bulli, tira-hi els tortellini ({tortellini}) i cou-los el temps que diu el paquet.',
        3,
        'Bullir els tortellini',
      ),
      p(
        'Escorre’ls i barreja’ls amb la salsa a foc baix 1 minut. Serveix-los amb el formatge ratllat ({formatge-ratllat}) per sobre.',
      ),
    ],
  },
  {
    id: 'parmigiana',
    nom: 'Parmigiana d’albergínia',
    racions: 4,
    tempsMinuts: 100,
    etiquetes: ['verdura', 'vegetaria'],
    ingredients: [
      l('alberginia', 3, 'u'),
      l('tomaquet-triturat', 800),
      l('all', 2),
      l('orenga', 2),
      l('sucre', 3),
      l('mozzarella', 250),
      l('parmesa', 60),
      l('oli-oliva', 80),
      l('sal', 8),
    ],
    passos: [
      c(
        'Renta les albergínies ({alberginia}) i talla-les a llesques d’1 cm a lo llarg. Posa-les en un colador, sala-les amb la meitat de la sal ({sal:1/2}) ' +
          'i deixa-les que deixin anar l’aigua amarga.',
        20,
        'Dessuar l’albergínia',
      ),
      c(
        'Salsa: pela i lamina els grans d’all ({all}). Posa un cassó a foc mitjà-baix amb una part de l’oli ({oli-oliva:1/4}) i l’all; quan sigui daurat clar, ' +
          'afegeix-hi el tomàquet triturat ({tomaquet-triturat}), l’orenga ({orenga}), el sucre ({sucre}) i la resta de la sal ({sal:1/2}). ' +
          'Cou-ho a foc baix fins que sigui espès.',
        20,
        'Coure la salsa',
      ),
      p('Encén el forn a 200 °C, amb escalfor a dalt i a baix.'),
      c(
        'Asseca les llesques d’albergínia amb paper de cuina. Posa-les en una o dues safates amb paper de forn, pinta-les amb la resta de l’oli ({oli-oliva:3/4}) ' +
          'per les dues bandes i enforna-les fins que siguin toves i daurades.',
        20,
        'Albergínia al forn',
      ),
      p(
        'Munta-la en una safata de forn: una capa de salsa, una d’albergínia, salsa, mozzarella ({mozzarella}) i parmesà ({parmesa}); repeteix-ho ' +
          'fins a acabar, i acaba amb salsa, mozzarella i parmesà.',
      ),
      c('Enforna-la a mitja altura fins que bombollegi i el formatge sigui daurat.', 25, 'Gratinar la parmigiana'),
      c('Deixa-la reposar abans de tallar-la.', 10, 'Reposar'),
    ],
  },
  {
    id: 'pollastre-parmesana',
    nom: 'Pollastre a la parmesana',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    ingredients: [
      l('pit-pollastre', 700),
      l('ou', 2),
      l('pa-ratllat', 120),
      l('parmesa', 60),
      l('farina', 40),
      l('tomaquet-triturat', 400),
      l('all', 1),
      l('orenga', 1),
      l('mozzarella', 200),
      l('oli-girasol', 150),
      l('oli-oliva', 20),
      l('sal', 6),
    ],
    passos: [
      c(
        'Salsa: pela i lamina l’all ({all}). Posa un cassó a foc mitjà-baix amb l’oli d’oliva ({oli-oliva}) i l’all; quan sigui daurat clar, afegeix-hi ' +
          'el tomàquet triturat ({tomaquet-triturat}), l’orenga ({orenga}) i la meitat de la sal ({sal:1/2}), i cou-ho a foc baix fins que sigui espès.',
        15,
        'Coure la salsa',
      ),
      p(
        'Si els filets de pit ({pit-pollastre}) són gruixuts, talla’ls per la meitat de gruix o aixafa’ls entre dos papers de forn fins a 1 cm. ' +
          'Sala’ls amb la resta de la sal ({sal:1/2}).',
      ),
      p(
        'Prepara tres plats: farina ({farina}); ous ({ou}) batuts; i el pa ratllat ({pa-ratllat}) barrejat amb la meitat del parmesà ({parmesa:1/2}). ' +
          'Passa cada filet per farina, ou i pa ratllat, pressionant perquè s’enganxi.',
      ),
      p('Encén el forn a 220 °C, amb escalfor a dalt i a baix.'),
      c(
        'Escalfa l’oli de gira-sol ({oli-girasol}) en una paella ampla a foc mitjà-fort (uns 5 mm de fondària) i fregeix-hi els filets en tandes fins que ' +
          'siguin daurats. El cronòmetre és per a cada costat. Deixa’ls sobre paper de cuina.',
        3,
        'Fregir un costat',
      ),
      p(
        'Posa els filets en una safata de forn, cobreix cadascun amb una cullerada de salsa, la mozzarella ({mozzarella}) i la resta del parmesà ({parmesa:1/2}).',
      ),
      c(
        'Gratina-ho a la part alta del forn fins que el formatge sigui fos i daurat, i el pollastre blanc per dins.',
        8,
        'Gratinar el pollastre',
      ),
    ],
  },
  {
    id: 'focaccia',
    nom: 'Focaccia amb romaní i oli d’oliva',
    racions: 4,
    tempsMinuts: 150,
    etiquetes: ['vegetaria'],
    ingredients: [l('farina-forca', 500), l('llevat', 7), l('oli-oliva', 80), l('romani', 4), l('sal', 12)],
    passos: [
      p(
        'En un bol gran, barreja la farina de força ({farina-forca}), el llevat ({llevat}) i la sal de la massa ({sal:5/6}). Aboca-hi aigua tèbia (80 ml per cada 100 g ' +
          'de farina: és una massa molt humida) i una part de l’oli ({oli-oliva:1/4}). Barreja-ho amb una cullera fins que no quedi farina seca. ' +
          'Quedarà enganxosa: és normal.',
      ),
      c(
        'Tapa el bol amb un drap i deixa-ho reposar. Després, amb la mà mullada, agafa una vora de la massa, estira-la cap amunt i plega-la sobre el centre; ' +
          'gira el bol un quart i repeteix-ho 4 vegades. Torna a tapar.',
        30,
        'Primer reposar i plegar',
      ),
      c(
        'Deixa-la reposar tapada en un lloc càlid fins que dobli el volum i tingui bombolles.',
        60,
        'Llevar la massa',
      ),
      p(
        'Unta una safata de forn d’uns 30 × 20 cm amb una part de l’oli ({oli-oliva:1/4}). Posa-hi la massa i, amb els dits untats d’oli, estira-la cap ' +
          'a les cantonades sense aixafar-la.',
      ),
      c('Deixa-la reposar a la safata, tapada. Mentrestant, encén el forn a 220 °C.', 30, 'Segon llevat'),
      p(
        'Rega-la amb la resta de l’oli ({oli-oliva:1/2}). Amb els dits ben estirats, enfonsa’ls fins al fons de la massa per tota la superfície, ' +
          'fent forats. Escampa-hi les fulles de romaní ({romani}) i la sal en escates o gruixuda ({sal:1/6}).',
      ),
      c('Enforna-la a mitja altura fins que sigui ben daurada per sobre i per sota.', 22, 'Focaccia al forn'),
      p('Deixa-la refredar 10 minuts sobre una reixeta abans de tallar-la.'),
    ],
  },
  {
    id: 'pasta-forn',
    nom: 'Pasta al forn amb mozzarella',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['pasta', 'vegetaria'],
    ingredients: [
      l('penne', 400),
      l('tomaquet-triturat', 600),
      l('ceba', 1, 'u'),
      l('all', 1),
      l('orenga', 1),
      l('sucre', 3),
      l('mozzarella', 250),
      l('parmesa', 40),
      l('oli-oliva', 30),
      l('sal', 34),
    ],
    passos: [
      c(
        'Salsa: pica la ceba ({ceba}) i l’all ({all}). Posa una cassola a foc mitjà-baix amb l’oli ({oli-oliva}) i cou-hi la ceba fins que sigui tova; ' +
          'afegeix l’all l’últim minut.',
        8,
        'Ofegar la ceba',
      ),
      c(
        'Afegeix-hi el tomàquet triturat ({tomaquet-triturat}), l’orenga ({orenga}), el sucre ({sucre}) i una part de la sal ({sal:1/17}). ' +
          'Cou-ho a foc baix fins que sigui espès.',
        15,
        'Coure la salsa',
      ),
      p('Encén el forn a 210 °C, amb escalfor a dalt i a baix.'),
      ...bullirPasta('penne', 'els penne', 8, '{sal:16/17}').map((pas, i) =>
        i === 1
          ? c(
              'Tira-hi els penne ({penne}) i remena. Cou-los 2 minuts menys del que diu el paquet: s’acabaran de fer al forn. ' +
                'Abans d’escórrer, guarda una tassa de l’aigua de cocció.',
              8,
              'Bullir la pasta',
            )
          : pas,
      ),
      p(
        'Escorre la pasta i barreja-la amb la salsa i un raig de l’aigua de cocció. Posa-la en una safata de forn i cobreix-la amb la mozzarella ({mozzarella}) ' +
          'i el parmesà ({parmesa}).',
      ),
      c('Enforna-la a la part alta del forn fins que el formatge sigui fos i daurat.', 12, 'Gratinar la pasta'),
    ],
  },
  {
    id: 'puttanesca',
    nom: 'Pasta alla puttanesca',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['pasta', 'peix'],
    ingredients: [
      l('espaguetis', 400),
      l('tomaquet-triturat', 400),
      l('olives-negres', 100),
      l('taperes', 30),
      l('anxoves', 50),
      l('all', 3),
      l('bitxo', 1),
      l('julivert', 10),
      l('oli-oliva', 40),
      l('sal', 30),
    ],
    passos: [
      p(
        'Pela i lamina els grans d’all ({all}). Talla les olives ({olives-negres}) a rodanxes. Escorre les tàperes ({taperes}). Pica les anxoves ({anxoves}). ' +
          'Pica el julivert ({julivert}).',
      ),
      c(
        'Posa una paella fonda a foc mitjà-baix amb l’oli ({oli-oliva}), l’all i el bitxo ({bitxo}) esmicolat (treu-lo si hi ha nens). Quan l’all sigui ' +
          'daurat clar, afegeix-hi les anxoves i remena fins que es desfacin.',
        3,
        'Desfer les anxoves',
      ),
      c(
        'Afegeix-hi el tomàquet triturat ({tomaquet-triturat}), les olives i les tàperes, i cou-ho a foc baix fins que la salsa sigui espessa. ' +
          'No hi posis sal: les anxoves, les olives i les tàperes ja en tenen.',
        12,
        'Coure la salsa',
      ),
      ...bullirPasta('espaguetis', 'els espaguetis', 9),
      p(
        'Escorre els espaguetis i posa’ls a la paella de la salsa. Barreja-ho a foc mitjà 1 minut, amb un raig de l’aigua de cocció si cal. ' +
          'Escampa-hi el julivert i serveix.',
      ),
    ],
  },
  {
    id: 'calzone',
    nom: 'Calzone de pernil i formatge',
    racions: 4,
    tempsMinuts: 120,
    etiquetes: ['carn'],
    ingredients: [
      l('farina-forca', 500),
      l('llevat', 7),
      l('oli-oliva', 30),
      l('sal', 12),
      l('tomaquet-triturat', 150),
      l('pernil-dolc', 200),
      l('mozzarella', 250),
      l('orenga', 1),
      l('ou', 1),
    ],
    passos: [
      ...massaPizza(),
      p('Encén el forn a 230 °C, amb escalfor a dalt i a baix.'),
      p(
        'Barreja el tomàquet triturat ({tomaquet-triturat}) amb l’orenga ({orenga}), la resta de la sal ({sal:1/5}) i la resta de l’oli ({oli-oliva:1/2}).',
      ),
      p(
        'Divideix la massa en 4 boles. Estira cada bola sobre el taulell enfarinat fins a fer un cercle d’uns 3 mm de gruix. Posa el farcit només en una ' +
          'meitat del cercle, deixant 2 cm de vora: una cullerada de tomàquet, pernil ({pernil-dolc}) i mozzarella ({mozzarella}). No hi posis massa: ' +
          'si en sobresurt, s’obrirà.',
      ),
      p(
        'Plega la meitat buida per sobre, fent una mitja lluna, i tanca la vora pressionant amb una forquilla. Fes un tall petit a sobre perquè surti el vapor. ' +
          'Pinta’ls amb l’ou ({ou}) batut perquè quedin daurats.',
      ),
      c('Posa’ls en una safata amb paper de forn i enforna’ls a mitja altura fins que siguin ben daurats.', 15, 'Calzone al forn'),
      p('Deixa’ls reposar 5 minuts abans de menjar-los: el farcit crema molt.'),
    ],
  },
];
