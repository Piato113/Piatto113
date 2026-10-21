import type { Recepta } from '../domini';
import { c, l, p } from './ajudants';

// Cuina tradicional gallega i basca (amb un plat navarrès), recopilatori d'octubre de 2026.
// Quantitats per a 4 racions normals.

export const receptesNord: Recepta[] = [
  // Galícia
  {
    id: 'pop-gallega',
    nom: 'Pop a la gallega amb cachelos',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['peix'],
    ingredients: [
      l('pop', 500),
      l('patata', 800),
      l('pebre-vermell', 4),
      l('oli-oliva', 60),
      l('sal', 12),
    ],
    passos: [
      p('Renta les patates ({patata}) i, sense pelar, posa-les en una olla amb aigua freda que les cobreixi i la meitat de la sal ({sal:1/2}).'),
      c(
        'Porta-les a bullir i cou-les fins que un ganivet hi entri sense resistència. Són els «cachelos»: s’han de poder tallar sense desfer-se.',
        20,
        'Bullir les patates',
      ),
      c(
        'El pop ({pop}) ja és cuit: els últims minuts, posa’l a l’olla amb les patates perquè s’escalfi i agafi el gust de l’aigua, sense que bulli gaire ' +
          '(si bull fort, es posa gomós).',
        3,
        'Escalfar el pop',
      ),
      p(
        'Escorre-ho. Pela les patates i talla-les a rodanxes d’1 cm; talla el pop a rodanxes amb unes tisores. Posa les patates en un plat de fusta ' +
          'o una plata i el pop per sobre.',
      ),
      p(
        'Escampa-hi la resta de la sal ({sal:1/2}) (millor si és en escates), el pebre vermell ({pebre-vermell}) amb un colador petit perquè quedi repartit, ' +
          'i un bon raig de l’oli ({oli-oliva}). Serveix-lo calent.',
      ),
    ],
  },
  {
    id: 'caldo-gallec',
    nom: 'Caldo gallec',
    racions: 4,
    tempsMinuts: 90,
    etiquetes: ['sopa', 'llegums', 'carn'],
    ingredients: [
      l('mongetes-cuites', 400),
      l('col', 500),
      l('patata', 3, 'u'),
      l('cansalada', 100),
      l('xorico', 150),
      l('os-blanc-salat', 350),
      l('sal', 4),
    ],
    passos: [
      p('Si tens temps, deixa l’os blanc ({os-blanc-salat}) 1 hora en aigua freda perquè perdi sal.'),
      c(
        'Posa l’os, la cansalada ({cansalada}) sencera i el xoriço ({xorico}) en una olla amb 2,5 litres d’aigua i porta-ho a bullir. Treu l’escuma ' +
          'que surti i cou-ho tapat a foc suau perquè l’aigua es converteixi en brou.',
        45,
        'Fer el brou',
      ),
      p(
        'Mentrestant, renta la col ({col}), treu-ne el tronc dur i les fulles més gruixudes, i talla-la a tires d’1 cm (si trobes grelos o naps, ' +
          'són els de debò). Pela les patates ({patata}) i trenca-les a trossos.',
      ),
      c('Afegeix-hi les patates i cou-les.', 15, 'Coure les patates'),
      c(
        'Afegeix-hi la col i les mongetes escorregudes ({mongetes-cuites}) i cou-ho fins que la col sigui tendra. Aixafa unes quantes patates contra ' +
          'la paret de l’olla perquè el caldo s’espesseixi.',
        15,
        'Coure la col',
      ),
      p(
        'Treu l’os, la cansalada i el xoriço; talla la cansalada i el xoriço a trossos i torna’ls a l’olla (l’os es llença). Tasta-ho de sal ({sal}): ' +
          'potser no en cal. Diuen que és millor l’endemà, escalfat.',
      ),
    ],
  },
  {
    id: 'empanada-tonyina',
    nom: 'Empanada gallega de tonyina',
    racions: 4,
    tempsMinuts: 70,
    etiquetes: ['peix'],
    ingredients: [
      l('massa-empanada', 2),
      l('tonyina', 240),
      l('ceba', 2, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('tomaquet-fregit', 150),
      l('ou', 3),
      l('pebre-vermell', 2),
      l('oli-oliva', 40),
      l('sal', 2),
    ],
    passos: [
      c(
        'Posa dos dels ous ({ou:2/3}) en un cassó amb aigua freda, porta’ls a bullir i compta 10 minuts. Refreda’ls en aigua freda, pela’ls i pica’ls.',
        10,
        'Ous durs',
      ),
      c(
        'Pela les cebes ({ceba}) i talla-les a tires fines; treu les llavors al pebrot ({pebrot-vermell}) i talla’l a tires. Cou-ho en una paella a foc ' +
          'mitjà-baix amb l’oli ({oli-oliva}) i la sal ({sal}), remenant, fins que sigui ben tou i dolç, sense daurar-se gaire.',
        20,
        'Ofegar la ceba',
      ),
      p(
        'Afegeix-hi el pebre vermell ({pebre-vermell}) i el tomàquet fregit ({tomaquet-fregit}) i cou-ho 2 minuts. Treu-ho del foc i barreja-hi la tonyina ' +
          '({tonyina}) escorreguda i l’ou dur. Deixa-ho refredar: si el farciment és calent, la massa s’estova. Encén el forn a 190 °C.',
      ),
      p(
        'Estén una làmina de massa ({massa-empanada}) sobre una safata amb paper de forn. Escampa-hi el farciment deixant 2 cm de vora lliure. ' +
          'Tapa-ho amb l’altra làmina, retalla el que sobri i plega les vores cap amunt, pessigant-les, perquè quedi ben tancada.',
      ),
      p(
        'Fes un forat d’1 cm al centre perquè surti el vapor. Bat l’ou que queda ({ou:1/3}) i pinta tota la superfície amb un pinzell o amb els dits.',
      ),
      c('Enforna-la a mitja altura fins que sigui daurada per sobre i per sota (aixeca-la una mica per comprovar-ho).', 30, 'Empanada al forn'),
      p('Deixa-la reposar 10 minuts abans de tallar-la. Freda també és bona.'),
    ],
  },
  {
    id: 'lluc-gallega',
    nom: 'Lluç a la gallega',
    racions: 4,
    tempsMinuts: 35,
    etiquetes: ['peix'],
    ingredients: [
      l('lluc', 700),
      l('patata', 800),
      l('ceba', 1, 'u'),
      l('all', 4),
      l('llorer', 1),
      l('pebre-vermell', 3),
      l('oli-oliva', 70),
      l('sal', 12),
    ],
    passos: [
      p('Pela les patates ({patata}) i talla-les a rodanxes d’1 cm. Pela la ceba ({ceba}) i talla-la a quarts. Sala el lluç ({lluc}) amb una part de la sal.'),
      c(
        'Posa les patates i la ceba en una cassola ampla amb aigua que les cobreixi, el llorer ({llorer}) i la resta de la sal ({sal}). Bull-ho fins ' +
          'que les patates siguin gairebé tendres.',
        15,
        'Bullir les patates',
      ),
      c(
        'Posa el lluç a sobre de les patates, dins l’aigua, i cou-ho a foc suau fins que el lluç sigui blanc i se separi en làmines.',
        6,
        'Coure el lluç',
      ),
      p('Escorre-ho amb compte (guarda un got de l’aigua) i posa les patates, la ceba i el lluç en una plata.'),
      c(
        'Ajada: pela els alls ({all}) i talla’ls a làmines. Daura’ls en una paella a foc baix amb l’oli ({oli-oliva}). Treu la paella del foc, afegeix-hi el pebre vermell ' +
          '({pebre-vermell}) i 2 cullerades de l’aigua de coure, i remena (esquitxa: aparta’t). Aboca-ho de seguida per sobre del lluç i les patates.',
        3,
        'Ajada',
      ),
    ],
  },
  {
    id: 'raxo-patates',
    nom: 'Raxo amb patates',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['patates-fregides'],
    ingredients: [
      l('llom', 700),
      l('all', 4),
      l('julivert', 10),
      l('pebre-vermell', 2),
      l('vi-blanc', 100),
      l('oli-oliva', 40),
      l('sal', 5),
    ],
    passos: [
      c(
        'Talla el llom ({llom}) a daus de 2 cm. Pela i pica els alls ({all}) i el julivert ({julivert}). Barreja la carn amb l’all, el julivert, el pebre ' +
          'vermell ({pebre-vermell}), la sal ({sal}) i la meitat del vi ({vi-blanc:1/2}), i deixa-ho reposar.',
        10,
        'Adobar',
      ),
      c(
        'Escalfa una paella gran a foc fort amb l’oli ({oli-oliva}). Posa-hi la carn escorreguda de l’adob, en una sola capa (en dues tandes si cal), ' +
          'i deixa-la un minut sense tocar; després remena fins que sigui daurada per fora i blanca per dins.',
        6,
        'Fregir el raxo',
      ),
      p(
        'Aboca-hi l’adob i la resta del vi ({vi-blanc:1/2}) i deixa’l bullir un minut, remenant, perquè quedi una salsa curta. Serveix-lo amb les patates fregides.',
      ),
    ],
  },
  {
    id: 'musclos-marinera',
    nom: 'Musclos a la marinera',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['peix'],
    ingredients: [
      l('musclos', 2000),
      l('ceba', 1, 'u'),
      l('all', 3),
      l('tomaquet-triturat', 200),
      l('vi-blanc', 150),
      l('pebre-vermell', 2),
      l('farina', 10),
      l('julivert', 10),
      l('oli-oliva', 40),
      l('pa-barra', 250),
    ],
    passos: [
      p(
        'Renta els musclos ({musclos}) en aigua freda, rasca les closques amb un ganivet i estira la barba que surt per un costat. Llença els trencats ' +
          'i els oberts que no es tanquin en tocar-los.',
      ),
      c(
        'Posa’ls en una olla gran amb el vi ({vi-blanc}), tapa-la i cou-los a foc fort, sacsejant l’olla, fins que s’obrin. Treu-los i cola el suc. ' +
          'Llença els que no s’hagin obert i treu mitja closca a cada un.',
        5,
        'Obrir els musclos',
      ),
      c(
        'Pela i pica la ceba ({ceba}) i els alls ({all}). Cou-los en una cassola a foc mitjà amb l’oli ({oli-oliva}) fins que siguin tous. Afegeix-hi la farina ' +
          '({farina}) i el pebre vermell ({pebre-vermell}), remena 30 segons i afegeix-hi el tomàquet ({tomaquet-triturat}).',
        10,
        'Sofregit',
      ),
      c(
        'Aboca-hi el suc dels musclos, a poc a poc i remenant, i cou-ho fins que la salsa espesseixi. Torna-hi els musclos i remena perquè es cobreixin de salsa.',
        4,
        'Salsa marinera',
      ),
      p('Escampa-hi el julivert ({julivert}) picat i serveix-los amb el pa ({pa-barra}) per sucar.'),
    ],
  },

  // País Basc i Navarra
  {
    id: 'marmitako',
    nom: 'Marmitako de salmó',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['peix'],
    ingredients: [
      l('salmo', 600),
      l('patata', 1000),
      l('ceba', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('all', 2),
      l('tomaquet-triturat', 200),
      l('pebrot-xoricer', 30),
      l('fumet', 1000),
      l('oli-oliva', 50),
      l('sal', 8),
    ],
    passos: [
      p(
        'El marmitako tradicional és de bonítol; amb salmó surt igual de bo i és més fàcil de trobar. Treu la pell i les espines al salmó ({salmo}) ' +
          'i talla’l a daus de 3 cm. Pela i pica la ceba ({ceba}), els pebrots ({pebrot-verd}, {pebrot-vermell}) i els alls ({all}).',
      ),
      c(
        'En una cassola a foc mitjà amb l’oli ({oli-oliva}), cou la ceba, els pebrots i l’all fins que siguin ben tous.',
        12,
        'Sofregit',
      ),
      p(
        'Afegeix-hi el tomàquet ({tomaquet-triturat}) i la carn de pebrot xoricer ({pebrot-xoricer}) i cou-ho 3 minuts. Pela les patates ({patata}) ' +
          'i trenca-les a trossos (fes un tall i acaba de partir-les fent palanca: així espesseixen el brou).',
      ),
      c(
        'Afegeix-hi les patates, remena-les amb el sofregit, cobreix-ho amb el fumet ({fumet}) calent i la sal ({sal}), i cou-ho a foc mitjà ' +
          'fins que les patates siguin tendres.',
        20,
        'Coure les patates',
      ),
      c(
        'Apaga el foc, afegeix-hi el salmó, remena una vegada i tapa la cassola: amb la calor del brou el peix es fa sense assecar-se.',
        5,
        'Reposar amb el peix',
      ),
    ],
  },
  {
    id: 'bacalla-biscaina',
    nom: 'Bacallà a la biscaïna',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['peix'],
    ambAcompanyament: true,
    acompanyaments: ['arros-blanc', 'pure-patata', 'patates-fregides'],
    ingredients: [
      l('bacalla', 700),
      l('ceba', 3, 'u'),
      l('all', 3),
      l('pebrot-xoricer', 100),
      l('pa-barra', 30),
      l('fumet', 200),
      l('oli-oliva', 70),
    ],
    passos: [
      p('Pela les cebes ({ceba}) i els alls ({all}) i talla-ho a tires fines.'),
      c(
        'En una cassola a foc baix amb la meitat de l’oli ({oli-oliva:1/2}), cou la ceba i l’all tapats, remenant de tant en tant, fins que la ceba sigui ' +
          'molt tova i lleugerament daurada: la salsa és bàsicament aquesta ceba, així que no tinguis pressa.',
        30,
        'Ofegar la ceba',
      ),
      p(
        'Afegeix-hi la carn de pebrot xoricer ({pebrot-xoricer}), el pa ({pa-barra}) a trossets i el fumet ({fumet}), i cou-ho 5 minuts. ' +
          'Tritura-ho amb la batedora i passa-ho per un colador si la vols fina: ha de quedar una salsa vermella i espessa.',
      ),
      c(
        'Eixuga el bacallà dessalat ({bacalla}). En una paella a foc mitjà amb la resta de l’oli ({oli-oliva:1/2}), cou-lo amb la pell cap amunt, ' +
          'girant-lo una vegada, fins que es pugui separar en làmines.',
        6,
        'Coure el bacallà',
      ),
      c('Posa el bacallà a la cassola amb la salsa i escalfa-ho tot junt a foc suau, movent la cassola.', 3, 'Ajuntar'),
    ],
  },
  {
    id: 'lluc-salsa-verda',
    nom: 'Lluç en salsa verda amb cloïsses',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['peix'],
    ingredients: [
      l('lluc', 700),
      l('cloisses', 300),
      l('pesols', 150),
      l('all', 4),
      l('julivert', 20),
      l('farina', 15),
      l('vi-blanc', 100),
      l('fumet', 300),
      l('oli-oliva', 60),
      l('sal', 5),
    ],
    passos: [
      c(
        'Posa les cloïsses ({cloisses}) en un bol amb aigua freda i un bon pessic de sal perquè deixin anar la sorra. Mentrestant, talla el lluç ({lluc}) ' +
          'a rodanxes de 3 cm i sala’l amb la sal ({sal}). Pela i pica els alls ({all}) i el julivert ({julivert}).',
        20,
        'Purgar les cloïsses',
      ),
      c(
        'En una cassola de fang o una cassola ampla a foc baix, cou l’all a l’oli ({oli-oliva}) fins que comenci a rossejar. Afegeix-hi la farina ({farina}) ' +
          'i remena un minut. Aboca-hi el vi ({vi-blanc}) i, a poc a poc i remenant, el fumet ({fumet}), fins que espesseixi.',
        4,
        'Base de la salsa',
      ),
      c(
        'Posa-hi el lluç, les cloïsses escorregudes, els pèsols ({pesols}) i la meitat del julivert. Cou-ho a foc suau, movent la cassola pels nanses ' +
          '(no remenis amb cullera: el lluç es trenca). El moviment fa que el lluç deixi anar gelatina i la salsa lligui. Gira el lluç a la meitat.',
        6,
        'Coure el lluç',
      ),
      p('Quan les cloïsses s’hagin obert (llença les que no ho facin), escampa-hi la resta del julivert i serveix-lo a la mateixa cassola.'),
    ],
  },
  {
    id: 'porrusalda',
    nom: 'Porrusalda',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['sopa', 'verdura', 'vegetaria'],
    ingredients: [
      l('porro', 4, 'u'),
      l('patata', 3, 'u'),
      l('pastanaga', 2, 'u'),
      l('all', 2),
      l('oli-oliva', 50),
      l('sal', 10),
    ],
    passos: [
      p(
        'Talla les arrels i la part verda més dura dels porros ({porro}), obre’ls de llarg i renta’ls sota l’aixeta (entre les capes hi sol haver terra). ' +
          'Talla’ls a trossos de 2 cm. Pela les pastanagues ({pastanaga}) i talla-les a rodanxes. Pela els alls ({all}) i talla’ls a làmines.',
      ),
      c(
        'En una olla a foc mitjà-baix amb l’oli ({oli-oliva}), cou els porros i l’all, remenant de tant en tant, fins que el porro sigui tou, sense daurar-se.',
        8,
        'Ofegar els porros',
      ),
      p('Pela les patates ({patata}) i trenca-les a trossos petits. Afegeix-les a l’olla amb la pastanaga i remena-ho tot.'),
      c(
        'Cobreix-ho amb 1,5 litres d’aigua, afegeix-hi la sal ({sal}) i cou-ho a foc mitjà fins que la patata es desfaci en prémer-la. ' +
          'Aixafa’n unes quantes contra la paret de l’olla perquè el brou espesseixi.',
        25,
        'Coure la porrusalda',
      ),
    ],
  },
  {
    id: 'piperrada-ou',
    nom: 'Piperrada amb ous',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['verdura', 'ou', 'vegetaria'],
    ingredients: [
      l('pebrot-vermell', 2, 'u'),
      l('pebrot-verd', 2, 'u'),
      l('ceba', 2, 'u'),
      l('tomaquet', 3, 'u'),
      l('all', 2),
      l('ou', 8),
      l('oli-oliva', 50),
      l('sal', 6),
      l('pa-pages', 300),
    ],
    passos: [
      p(
        'Treu les llavors als pebrots ({pebrot-vermell}, {pebrot-verd}) i talla’ls a tires. Pela les cebes ({ceba}) i talla-les a tires. Pela i pica els alls ({all}). ' +
          'Pela els tomàquets ({tomaquet}) i talla’ls a daus.',
      ),
      c(
        'En una cassola ampla a foc mitjà-baix amb l’oli ({oli-oliva}), cou la ceba, l’all i els pebrots, remenant de tant en tant, fins que siguin ben tous.',
        20,
        'Coure els pebrots',
      ),
      c('Afegeix-hi el tomàquet i la sal ({sal}) i cou-ho fins que el tomàquet es desfaci i no quedi gaire suc.', 10, 'Tomàquet'),
      c(
        'Fes 8 clots a la piperrada i trenca un ou ({ou}) a cada un. Tapa la cassola i cou-ho a foc baix fins que les clares siguin quallades ' +
          'i els rovells encara líquids.',
        5,
        'Quallar els ous',
      ),
      p('Serveix-la a la cassola amb el pa ({pa-pages}) torrat per sucar.'),
    ],
  },
  {
    id: 'mongetes-tolosa',
    nom: 'Mongetes vermelles de Tolosa',
    racions: 4,
    tempsMinuts: 150,
    etiquetes: ['llegums', 'carn'],
    ingredients: [
      l('mongetes-vermelles', 400),
      l('ceba', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('xorico', 150),
      l('cansalada', 150),
      l('botifarra-negra', 280),
      l('oli-oliva', 40),
      l('sal', 6),
    ],
    passos: [
      p('La nit abans, posa les mongetes ({mongetes-vermelles}) en remull amb el triple d’aigua freda.'),
      c(
        'Escorre-les i posa-les en una olla amb aigua freda que les cobreixi dos dits, la ceba ({ceba}) pelada sencera, el pebrot ({pebrot-verd}) net ' +
          'i l’oli ({oli-oliva}). Porta-ho a bullir i, quan bulli, tira-hi mig got d’aigua freda per «espantar-les» (així la pell no es trenca).',
        10,
        'Arrencar el bull',
      ),
      c(
        'Afegeix-hi el xoriço ({xorico}) i la cansalada ({cansalada}) sencers, tapa l’olla deixant-hi una escletxa i cou-ho a foc molt suau, ' +
          'sense que bulli fort. Si cal aigua, posa-n’hi poca i freda. Són fetes quan són mantegoses i la pell no s’arruga.',
        110,
        'Coure les mongetes',
      ),
      c(
        'Treu la ceba i el pebrot, tritura’ls amb un cullerot de mongetes i torna-ho a l’olla: espesseix el brou. Afegeix-hi la botifarra negra ' +
          '({botifarra-negra}) sencera i la sal ({sal}), i cou-ho fins que s’escalfi.',
        10,
        'Lligar el brou',
      ),
      p('Talla les carns a trossos i serveix-les amb les mongetes. A Tolosa les acompanyen amb guindilles en vinagre.'),
    ],
  },
  {
    id: 'truita-bacalla',
    nom: 'Truita de bacallà (de sidreria)',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['ou', 'peix'],
    ambAcompanyament: true,
    acompanyaments: ['amanida', 'pa-amb-tomaquet'],
    ingredients: [
      l('ou', 8),
      l('bacalla', 300),
      l('ceba', 2, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('julivert', 5),
      l('oli-oliva', 60),
    ],
    passos: [
      p('Esqueixa el bacallà dessalat ({bacalla}) amb els dits, traient la pell i les espines. Pela les cebes ({ceba}) i el pebrot ({pebrot-verd}) i talla’ls a tires fines.'),
      c(
        'En una paella a foc mitjà-baix amb tres quarts de l’oli ({oli-oliva:3/4}), cou la ceba i el pebrot fins que siguin ben tous i dolços.',
        15,
        'Ofegar la ceba',
      ),
      c('Afegeix-hi el bacallà i cou-lo, remenant, fins que perdi la transparència.', 3, 'Bacallà'),
      p('Bat els ous ({ou}) en un bol (sense sal: el bacallà ja en té) amb el julivert ({julivert}) picat. Afegeix-hi el sofregit escorregut i remena.'),
      c(
        'En una paella petita antiadherent a foc mitjà, amb la resta de l’oli ({oli-oliva:1/4}), aboca-hi la barreja i remena les vores cap al centre ' +
          'durant uns segons. A la sidreria la fan molt sucosa: gira-la amb un plat quan per sota sigui daurada i el centre encara tremoli.',
        2,
        'Truita: un costat',
      ),
      c('Cou l’altre costat i serveix-la.', 1, 'Truita: segon costat'),
    ],
  },
  {
    id: 'calamars-tinta',
    nom: 'Calamars en la seva tinta',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['peix'],
    ambAcompanyament: true,
    acompanyaments: ['arros-blanc'],
    ingredients: [
      l('calamar', 800),
      l('ceba', 3, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('all', 2),
      l('tomaquet-triturat', 150),
      l('tinta-sipia', 8),
      l('vi-blanc', 100),
      l('pa-barra', 30),
      l('oli-oliva', 60),
      l('sal', 4),
    ],
    passos: [
      p('Descongela els calamars ({calamar}) a la nevera la nit abans. Eixuga’ls i, si són a trossos grans, talla’ls a anelles o a quadres de 3 cm. Sala’ls amb la sal ({sal}).'),
      c(
        'Pela les cebes ({ceba}) i els alls ({all}), neteja el pebrot ({pebrot-verd}) i pica-ho tot. Cou-ho en una cassola a foc baix amb l’oli ' +
          '({oli-oliva}), remenant de tant en tant, fins que sigui molt tou.',
        20,
        'Sofregit',
      ),
      c(
        'Afegeix-hi el tomàquet ({tomaquet-triturat}), el pa ({pa-barra}) a trossets i el vi ({vi-blanc}), i cou-ho 5 minuts. Dissol la tinta ({tinta-sipia}) ' +
          'en mig got d’aigua, afegeix-la i tritura-ho tot amb la batedora fins que sigui una salsa negra i fina.',
        5,
        'Salsa negra',
      ),
      c(
        'Afegeix-hi els calamars, tapa la cassola i cou-ho a foc suau fins que siguin tendres (punxa’n un: s’ha de poder tallar amb la forquilla). ' +
          'Si la salsa s’espesseix massa, afegeix-hi un raig d’aigua.',
        25,
        'Coure els calamars',
      ),
      p('Serveix-los amb l’arròs blanc.'),
    ],
  },
  {
    id: 'pollastre-txilindron',
    nom: 'Pollastre al txilindron',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['patates-fregides', 'arros-blanc', 'pa-amb-tomaquet'],
    ingredients: [
      l('pollastre-trossos', 1200),
      l('pebrot-vermell', 2, 'u'),
      l('ceba', 1, 'u'),
      l('all', 3),
      l('tomaquet-triturat', 400),
      l('taquets-pernil', 100),
      l('pebrot-xoricer', 20),
      l('vi-blanc', 100),
      l('oli-oliva', 50),
      l('sal', 10),
    ],
    passos: [
      p(
        'Sala el pollastre ({pollastre-trossos}) amb la sal ({sal}). Pela la ceba ({ceba}) i els alls ({all}) i pica’ls. Treu les llavors als pebrots ' +
          '({pebrot-vermell}) i talla’ls a tires.',
      ),
      c(
        'En una cassola a foc mitjà-fort amb l’oli ({oli-oliva}), daura el pollastre per totes bandes, en tandes. Treu-lo.',
        12,
        'Daurar el pollastre',
      ),
      c(
        'Abaixa el foc i, a la mateixa cassola, cou la ceba, l’all i els pebrots fins que siguin tous. Afegeix-hi el pernil ({taquets-pernil}) i remena un minut.',
        12,
        'Sofregit',
      ),
      c(
        'Afegeix-hi la carn de pebrot xoricer ({pebrot-xoricer}), el vi ({vi-blanc}) i el tomàquet ({tomaquet-triturat}). Torna-hi el pollastre, tapa-ho ' +
          'i cou-ho a foc suau, girant-lo a la meitat, fins que el pollastre sigui tendre i la salsa espessa.',
        30,
        'Coure el pollastre',
      ),
      p('Serveix-lo amb l’acompanyament.'),
    ],
  },
];
