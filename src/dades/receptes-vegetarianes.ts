import type { Recepta } from '../domini';
import { c, l, p } from './ajudants';

// Plats vegetarians (amb ous o làctics), recopilatori d'octubre de 2026. Quantitats per a 4 racions normals.

/** Beixamel casolana: la mantega, la farina i la llet són ingredients de la recepta. */
const beixamel = (llet = '{llet}', mantega = '{mantega}', farina = '{farina}') =>
  `Beixamel: en un cassó a foc mitjà-baix, fon la mantega (${mantega}), afegeix-hi la farina (${farina}) i remena un minut sense que es dauri. ` +
  `Aboca-hi la llet (${llet}) freda de cop i remena sense parar amb una vareta, arribant a les vores, fins que bulli i espesseixi com unes natilles. ` +
  'Afegeix-hi la nou moscada i un pessic de sal.';

export const receptesVegetarianes: Recepta[] = [
  {
    id: 'truita-carbasso',
    nom: 'Truita de carbassó i ceba',
    racions: 4,
    tempsMinuts: 35,
    etiquetes: ['ou', 'verdura', 'vegetaria'],
    ambAcompanyament: true,
    acompanyaments: ['amanida', 'pa-amb-tomaquet'],
    ingredients: [
      l('ou', 7),
      l('carbasso', 2, 'u'),
      l('ceba', 1, 'u'),
      l('oli-oliva', 60),
      l('sal', 6),
    ],
    passos: [
      p('Renta els carbassons ({carbasso}) i talla’ls a daus petits, amb pell. Pela la ceba ({ceba}) i talla-la a tires fines.'),
      c(
        'En una paella antiadherent de 24 cm a foc mitjà amb tres quarts de l’oli ({oli-oliva:3/4}), cou la ceba i el carbassó amb la meitat de la sal ({sal:1/2}), ' +
          'remenant de tant en tant, fins que siguin tous i el carbassó hagi perdut l’aigua.',
        15,
        'Coure el carbassó',
      ),
      p('Bat els ous ({ou}) en un bol gran amb la resta de la sal ({sal:1/2}). Escorre les verdures i barreja-les amb l’ou.'),
      c(
        'Torna a posar la paella a foc mitjà amb la resta de l’oli ({oli-oliva:1/4}). Aboca-hi la barreja i remena les vores cap al centre durant uns segons; ' +
          'després deixa-la quallar fins que les vores siguin fermes.',
        4,
        'Truita: un costat',
      ),
      c(
        'Gira-la amb un plat pla més gran que la paella (amb decisió, d’un sol cop) i fes-la per l’altre costat fins que sigui quallada però sucosa al centre.',
        3,
        'Truita: segon costat',
      ),
    ],
  },
  {
    id: 'lasanya-verdures',
    nom: 'Lasanya de verdures',
    racions: 4,
    tempsMinuts: 75,
    etiquetes: ['pasta', 'verdura', 'vegetaria'],
    ingredients: [
      l('plaques-lasanya', 12),
      l('carbasso', 1, 'u'),
      l('alberginia', 1, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('ceba', 1, 'u'),
      l('xampinyons', 250),
      l('tomaquet-triturat', 400),
      l('llet', 700),
      l('mantega', 50),
      l('farina', 50),
      l('nou-moscada', 1),
      l('mozzarella', 200),
      l('oli-oliva', 40),
      l('sal', 8),
    ],
    passos: [
      p(
        'Talla el carbassó ({carbasso}), l’albergínia ({alberginia}), el pebrot ({pebrot-vermell}) i la ceba ({ceba}) a daus petits, i els xampinyons ({xampinyons}) a làmines.',
      ),
      c(
        'En una cassola ampla a foc mitjà amb l’oli ({oli-oliva}), cou la ceba i el pebrot fins que siguin tous. Afegeix-hi l’albergínia, el carbassó, els xampinyons ' +
          'i la sal ({sal}), i cou-ho fins que les verdures perdin l’aigua.',
        15,
        'Coure les verdures',
      ),
      c('Afegeix-hi el tomàquet ({tomaquet-triturat}) i cou-ho fins que espesseixi.', 8, 'Salsa'),
      c(beixamel().replace('la nou moscada', 'la nou moscada ({nou-moscada})'), 8, 'Beixamel'),
      p(
        'Encén el forn a 190 °C. Si les plaques ({plaques-lasanya}) no són precuites, remulla-les en aigua calenta segons el paquet. En una safata, posa una capa ' +
          'fina de beixamel, una de plaques, una de verdures i una de beixamel; repeteix-ho dues vegades més i acaba amb plaques, beixamel i la mozzarella ({mozzarella}).',
      ),
      c('Enforna-la fins que el formatge sigui daurat i la pasta tova en punxar-la amb un ganivet. Deixa-la reposar 5 minuts.', 30, 'Lasanya al forn'),
    ],
  },
  {
    id: 'canelons-espinacs',
    nom: 'Canelons d’espinacs amb panses i pinyons',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['pasta', 'verdura', 'vegetaria'],
    ingredients: [
      l('plaques-canelons', 16),
      l('espinacs', 600),
      l('ceba', 1, 'u'),
      l('panses', 40),
      l('pinyons', 30),
      l('llet', 800),
      l('mantega', 60),
      l('farina', 60),
      l('nou-moscada', 1),
      l('formatge-ratllat', 80),
      l('oli-oliva', 30),
      l('sal', 15),
    ],
    passos: [
      c(
        'Cou els espinacs ({espinacs}) congelats en una olla amb un dit d’aigua, tapats, fins que es desfacin. Escorre’ls i prem-los perquè deixin anar l’aigua. ' +
          'Posa les panses ({panses}) en aigua tèbia.',
        8,
        'Coure els espinacs',
      ),
      c(
        'Pica la ceba ({ceba}) i cou-la en una paella a foc mitjà amb l’oli ({oli-oliva}) fins que sigui daurada. Afegeix-hi els pinyons ({pinyons}) un minut, ' +
          'després els espinacs picats i les panses escorregudes.',
        10,
        'Farciment',
      ),
      c(beixamel().replace('la nou moscada', 'la nou moscada ({nou-moscada})'), 8, 'Beixamel'),
      p(
        'Barreja el farciment amb un terç de la beixamel. Cou les plaques ({plaques-canelons}) segons el paquet en aigua amb la sal ({sal}) i estén-les sobre un drap. ' +
          'Posa una cullerada de farciment a cada placa i enrotlla-la.',
      ),
      p('Encén el forn a 200 °C. Posa els canelons en una safata, cobreix-los amb la resta de la beixamel i escampa-hi el formatge ({formatge-ratllat}).'),
      c('Enforna’ls a la part de dalt fins que siguin daurats.', 15, 'Gratinar'),
    ],
  },
  {
    id: 'quiche-porros',
    nom: 'Quiche de porros i formatge',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['ou', 'verdura', 'vegetaria'],
    ambAcompanyament: true,
    acompanyaments: ['amanida'],
    ingredients: [
      l('massa-quebrada', 1),
      l('porro', 3, 'u'),
      l('ou', 4),
      l('nata', 200),
      l('llet', 100),
      l('formatge-ratllat', 120),
      l('mantega', 20),
      l('nou-moscada', 1),
      l('sal', 4),
      l('pebre-negre', 1),
    ],
    passos: [
      p(
        'Encén el forn a 190 °C. Estén la massa ({massa-quebrada}) en un motlle de 24-26 cm amb el seu paper, ajusta-la a les vores i punxa la base amb una forquilla.',
      ),
      c(
        'Cobreix la massa amb paper de forn i posa-hi a sobre cigrons o mongetes secs (perquè no s’infli). Enforna-la fins que les vores comencin a daurar-se; ' +
          'treu el pes i el paper.',
        12,
        'Precoure la massa',
      ),
      c(
        'Mentrestant, neteja els porros ({porro}) (obre’ls de llarg i renta’ls entre les capes) i talla’ls a rodanxes fines. Cou-los en una paella a foc mitjà-baix ' +
          'amb la mantega ({mantega}) i la meitat de la sal ({sal:1/2}), fins que siguin tous i dolços.',
        12,
        'Ofegar els porros',
      ),
      p(
        'Bat els ous ({ou}) amb la nata ({nata}), la llet ({llet}), la resta de la sal ({sal:1/2}), el pebre ({pebre-negre}) i la nou moscada ({nou-moscada}). ' +
          'Escampa els porros i el formatge ({formatge-ratllat}) sobre la massa i aboca-hi la barreja d’ous.',
      ),
      c(
        'Enforna-la a mitja altura fins que el farciment sigui quallat (en moure el motlle, el centre gairebé no tremola) i daurat per sobre. ' +
          'Deixa-la reposar 10 minuts abans de tallar-la.',
        30,
        'Quiche al forn',
      ),
    ],
  },
  {
    id: 'pizza-verdures',
    nom: 'Pizza de verdures',
    racions: 4,
    tempsMinuts: 120,
    etiquetes: ['verdura', 'vegetaria'],
    ingredients: [
      l('farina-forca', 500),
      l('llevat', 7),
      l('tomaquet-triturat', 250),
      l('mozzarella', 300),
      l('pebrot-vermell', 1, 'u'),
      l('ceba', 1, 'u'),
      l('xampinyons', 250),
      l('olives-negres', 60),
      l('orenga', 2),
      l('oli-oliva', 40),
      l('sal', 12),
    ],
    passos: [
      p(
        'Massa: en un bol, barreja la farina ({farina-forca}), el llevat ({llevat}) i la sal ({sal}). Afegeix-hi 320 ml d’aigua tèbia i la meitat de l’oli ' +
          '({oli-oliva:1/2}) i pasta-ho fins que la massa sigui llisa i elàstica (uns 8 minuts al marbre enfarinat).',
      ),
      c('Fes-ne una bola, tapa-la amb un drap i deixa-la en un lloc tebi fins que dobli el volum.', 60, 'Llevar la massa'),
      p(
        'Talla el pebrot ({pebrot-vermell}) i la ceba ({ceba}) a tires fines i els xampinyons ({xampinyons}) a làmines. Encén el forn al màxim (250 °C) amb la safata a dins.',
      ),
      p(
        'Divideix la massa en dues i estira cada part sobre paper de forn fins que faci mig centímetre. Unta-la amb el tomàquet ({tomaquet-triturat}), escampa-hi ' +
          'la mozzarella ({mozzarella}), les verdures, les olives ({olives-negres}) i l’orenga ({orenga}), i rega-ho amb la resta de l’oli ({oli-oliva:1/2}).',
      ),
      c(
        'Fes lliscar la pizza amb el paper sobre la safata calenta i cou-la a la part de baix fins que la vora sigui daurada i el formatge faci bombolles. ' +
          'Repeteix-ho amb l’altra.',
        12,
        'Pizza al forn',
      ),
    ],
  },
  {
    id: 'coliflor-gratinada',
    nom: 'Coliflor gratinada amb beixamel',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['verdura', 'vegetaria'],
    ingredients: [
      l('coliflor', 1, 'u'),
      l('patata', 2, 'u'),
      l('llet', 600),
      l('mantega', 45),
      l('farina', 45),
      l('nou-moscada', 1),
      l('formatge-ratllat', 120),
      l('sal', 12),
    ],
    passos: [
      p('Separa la coliflor ({coliflor}) a ramets i renta-la. Pela les patates ({patata}) i talla-les a daus de 2 cm. Encén el forn a 200 °C.'),
      c(
        'Bull la coliflor i les patates en aigua amb la sal ({sal}) fins que siguin tendres però sense desfer-se. Escorre-ho molt bé (si queda aigua, la beixamel s’aigualeix).',
        12,
        'Bullir la coliflor',
      ),
      c(beixamel().replace('la nou moscada', 'la nou moscada ({nou-moscada})'), 8, 'Beixamel'),
      p('Posa la coliflor i la patata en una safata de forn, cobreix-ho amb la beixamel i escampa-hi el formatge ({formatge-ratllat}).'),
      c('Gratina-ho a la part de dalt del forn fins que sigui ben daurat.', 15, 'Gratinar'),
    ],
  },
  {
    id: 'espaguetis-cacio-pepe',
    nom: 'Espaguetis cacio e pepe',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['pasta', 'vegetaria'],
    ingredients: [l('espaguetis', 400), l('parmesa', 120), l('pebre-negre', 6), l('mantega', 20), l('sal', 20)],
    passos: [
      p(
        'Posa una olla a foc fort amb aigua: aquí en fa servir menys de l’habitual, uns 2,5 litres, perquè quedi ben carregada de midó (és el que lligarà la salsa). ' +
          'Quan bulli, afegeix-hi la sal ({sal}).',
      ),
      c('Cou-hi els espaguetis ({espaguetis}) un minut menys del que diu el paquet. Guarda dues tasses de l’aigua de cocció abans d’escórrer-los.', 9, 'Bullir la pasta'),
      p(
        'Mentrestant, torra el pebre ({pebre-negre}) (millor acabat de moldre, gruixut) en una paella ampla a foc mitjà 1 minut, fins que faci olor. Afegeix-hi la mantega ' +
          '({mantega}) i mig got de l’aigua de cocció. En un bol, barreja el parmesà ({parmesa}) amb uns quants rajos d’aigua de cocció tèbia fins que sigui una crema.',
      ),
      p(
        'Posa els espaguetis a la paella, remena un minut a foc mitjà, aparta-la del foc i afegeix-hi la crema de formatge, remenant sense parar. Si queda espès, ' +
          'afegeix-hi més aigua de cocció; si el formatge fa grumolls, la paella era massa calenta. Serveix-los de seguida.',
      ),
    ],
  },
  {
    id: 'risotto-carbassa',
    nom: 'Risotto de carbassa',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['arros', 'verdura', 'vegetaria'],
    ingredients: [
      l('arros', 320),
      l('carbassa', 500),
      l('ceba', 1, 'u'),
      l('vi-blanc', 100),
      l('brou-verdures', 1200),
      l('parmesa', 70),
      l('mantega', 40),
      l('oli-oliva', 20),
      l('sal', 4),
    ],
    passos: [
      p('Pela la carbassa ({carbassa}) si en té i talla-la a daus d’1 cm. Pica la ceba ({ceba}). Escalfa el brou ({brou-verdures}) en un cassó i mantén-lo calent.'),
      c(
        'En una cassola ampla a foc mitjà amb l’oli ({oli-oliva}) i la meitat de la mantega ({mantega:1/2}), cou la ceba fins que sigui transparent. Afegeix-hi la carbassa ' +
          'i cou-la fins que comenci a estovar-se.',
        8,
        'Ceba i carbassa',
      ),
      c(
        'Afegeix-hi l’arròs ({arros}) i remena-ho 2 minuts perquè els grans es torrin i es tornin translúcids a les vores. Aboca-hi el vi ({vi-blanc}) i remena fins que s’evapori.',
        3,
        'Torrar l’arròs',
      ),
      c(
        'Afegeix-hi un cullerot de brou calent i remena fins que l’arròs se l’hagi begut; aleshores un altre, i així fins que l’arròs sigui tou per fora però una mica ferm ' +
          'al centre. La carbassa es desfarà i el tornarà cremós i taronja.',
        18,
        'Coure el risotto',
      ),
      p(
        'Aparta-ho del foc, afegeix-hi la resta de la mantega ({mantega:1/2}), el parmesà ({parmesa}) i la sal ({sal}) i remena amb energia fins que quedi cremós i fluid. ' +
          'Deixa’l reposar tapat 2 minuts i serveix-lo.',
      ),
    ],
  },
  {
    id: 'creps-espinacs-formatge',
    nom: 'Creps d’espinacs i formatge',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['verdura', 'ou', 'vegetaria'],
    ingredients: [
      l('farina', 200),
      l('llet', 450),
      l('ou', 3),
      l('mantega', 40),
      l('espinacs', 450),
      l('formatge-ratllat', 150),
      l('all', 1),
      l('nata', 100),
      l('oli-oliva', 15),
      l('sal', 5),
    ],
    passos: [
      p(
        'Massa: en un bol, posa la farina ({farina}) i la meitat de la sal ({sal:1/2}) i fes-hi un clot. Trenca-hi els ous ({ou}) i, batent amb una vareta, aboca-hi la llet ' +
          '({llet}) a poc a poc, fins que sigui llisa. Fon la mantega ({mantega}) i afegeix-ne la meitat ({mantega:1/2}) a la massa.',
      ),
      c(
        'Farciment: cou els espinacs ({espinacs}) congelats en una paella amb l’oli ({oli-oliva}) i l’all ({all}) picat, remenant, fins que no quedi aigua. ' +
          'Afegeix-hi la nata ({nata}) i la resta de la sal ({sal:1/2}) i cou-ho fins que espesseixi.',
        10,
        'Espinacs',
      ),
      c(
        'Escalfa una paella antiadherent de 20-24 cm a foc mitjà i unta-la amb la resta de la mantega ({mantega:1/2}) amb paper de cuina. Aboca-hi un cullerot de massa ' +
          'i gira la paella perquè cobreixi el fons en una capa fina. Quan les vores es desenganxin, gira-la. El cronòmetre és per al primer costat.',
        1,
        'Crep: primer costat',
      ),
      p(
        'Amb la crep a la paella, posa-hi espinacs i formatge ({formatge-ratllat}), plega-la en quatre i deixa-la un minut perquè el formatge es fongui. Fes les altres igual.',
      ),
    ],
  },
  {
    id: 'macarrons-formatge',
    nom: 'Macarrons gratinats amb formatge',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['pasta', 'vegetaria'],
    ingredients: [
      l('macarrons', 400),
      l('llet', 600),
      l('mantega', 40),
      l('farina', 40),
      l('nou-moscada', 1),
      l('formatge-ratllat', 200),
      l('mostassa', 5),
      l('pa-ratllat', 30),
      l('sal', 32),
    ],
    passos: [
      p('Encén el forn a 200 °C. Posa una olla gran a foc fort amb aigua: 1 litre per cada 100 g de pasta. Quan bulli amb força, afegeix-hi la sal ({sal}).'),
      c('Cou-hi els macarrons ({macarrons}) dos minuts menys del que diu el paquet (s’acaben de fer al forn). Escorre’ls.', 9, 'Bullir la pasta'),
      c(beixamel().replace('la nou moscada', 'la nou moscada ({nou-moscada})'), 8, 'Beixamel'),
      p(
        'Fora del foc, afegeix a la beixamel la mostassa ({mostassa}) i tres quarts del formatge ({formatge-ratllat:3/4}) i remena fins que es fongui. Barreja-hi els macarrons ' +
          'i posa-ho en una safata de forn.',
      ),
      c(
        'Escampa-hi la resta del formatge ({formatge-ratllat:1/4}) barrejat amb el pa ratllat ({pa-ratllat}) i gratina-ho a la part de dalt del forn fins que sigui daurat i cruixent.',
        12,
        'Gratinar',
      ),
    ],
  },
];
