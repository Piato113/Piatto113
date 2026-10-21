import type { Recepta } from '../domini';
import { c, l, p } from './ajudants';

// Plats de cullera, sopes, cremes i plats senzills de casa. Quantitats per a 4 racions normals.

export const receptesCullera: Recepta[] = [
  {
    // Recepta tradicional cordovesa: cigrons llet, avío de carns i salats, mongeta tendra, carbassa i patata.
    id: 'cocido-cordoves',
    nom: 'Cocido cordovès',
    racions: 4,
    tempsMinuts: 180,
    etiquetes: ['llegums', 'carn'],
    ingredients: [
      l('cigrons-secs', 320),
      l('vedella-estofar', 250),
      l('pollastre-trossos', 400),
      l('cansalada-fresca', 100),
      l('os-blanc-salat', 350),
      l('espinada-porc', 300),
      l('patata', 2, 'u'),
      l('pastanaga', 2, 'u'),
      l('mongeta-tendra', 250),
      l('carbassa', 300),
      l('sal', 15),
    ],
    passos: [
      p(
        'La nit abans (unes 12 hores): posa els cigrons ({cigrons-secs}) en un bol gran amb el triple d’aigua i la sal ({sal}): s’inflen fins a doblar ' +
          'la mida. A part, posa l’os blanc ({os-blanc-salat}) en un altre bol amb aigua freda perquè perdi sal; si l’has de deixar més de 2 hores, ' +
          'guarda’l a la nevera.',
      ),
      c(
        'Renta la vedella ({vedella-estofar}), el pollastre ({pollastre-trossos}), la cansalada ({cansalada-fresca}) i l’espinada ({espinada-porc}) ' +
          'sota l’aixeta. Posa-ho en una olla gran amb l’os blanc escorregut i 3 litres d’aigua, i porta-ho a bullir a foc fort. Quan bulli, sortirà ' +
          'una escuma grisa: treu-la amb una escumadora fins que el brou quedi net.',
        15,
        'Escumar el brou',
      ),
      c(
        'Escorre els cigrons i esbandeix-los. Tira’ls a l’olla quan el brou bulli amb força: si entren a l’aigua freda o l’olla deixa de bullir, ' +
          'els cigrons es queden durs. Abaixa el foc perquè bulli suau però sense parar, tapa l’olla deixant-hi una escletxa i cou-ho. ' +
          'Si cal afegir aigua, que sigui bullent. A mitja cocció, treu amb una cullera el greix que suri.',
        110,
        'Coure els cigrons',
      ),
      c(
        'Pela les patates ({patata}) i trenca-les a trossos grossos (fes un tall i acaba de partir-les fent palanca: així deixen anar fècula i espesseixen ' +
          'el brou). Pela les pastanagues ({pastanaga}) i talla-les a trossos de 3 cm. Afegeix-les a l’olla.',
        15,
        'Patata i pastanaga',
      ),
      c(
        'Neteja les mongetes tendres ({mongeta-tendra}), treu-ne les puntes i talla-les a trossos de 4 cm. Pela la carbassa ({carbassa}) si en té ' +
          'i talla-la a daus de 3 cm. Afegeix-les a l’olla i cou-ho fins que els cigrons siguin tendres i mantegosos per dins, i la patata es desfaci ' +
          'en prémer-la amb una forquilla.',
        15,
        'Mongeta i carbassa',
      ),
      p(
        'Tasta el brou: els ossos salats ja n’han donat, així que afegeix-hi sal només si en falta. Deixa reposar l’olla 5 minuts fora del foc ' +
          'i treu el greix que hagi pujat.',
      ),
      p(
        'Treu les carns i els ossos (l’avío) a una plata. Desossa el pollastre i l’espinada, talla la vedella i la cansalada a trossos i llença els ossos. ' +
          'Serveix els cigrons amb les verdures i el brou en plats fondos, i l’avío al mig perquè cadascú se’n posi. ' +
          'Amb olla a pressió: després d’escumar i afegir-hi els cigrons, afegeix també les verdures, tanca-la i compta 30 minuts des que xiuli.',
      ),
    ],
  },
  {
    id: 'estofat-vedella',
    nom: 'Estofat de vedella amb patates',
    racions: 4,
    tempsMinuts: 150,
    etiquetes: ['carn'],
    ingredients: [
      l('vedella-estofar', 800),
      l('patata', 4, 'u'),
      l('pastanaga', 3, 'u'),
      l('ceba', 2, 'u'),
      l('tomaquet', 2, 'u'),
      l('all', 3),
      l('vi-blanc', 200),
      l('brou-pollastre', 500),
      l('farina', 30),
      l('llorer', 2),
      l('oli-oliva', 60),
      l('sal', 8),
      l('pebre-negre', 1),
    ],
    passos: [
      p(
        'Si els daus de vedella ({vedella-estofar}) són molt grossos, talla’ls a trossos d’uns 4 cm. Sala’ls amb la meitat de la sal ({sal:1/2}) ' +
          'i el pebre ({pebre-negre}), i passa’ls per la farina ({farina}). Espolsa’ls.',
      ),
      c(
        'Posa una olla o cassola gruixuda a foc mitjà-fort amb l’oli ({oli-oliva}). Daura-hi la carn en tandes, sense amuntegar-la (si n’hi ha massa, ' +
          'deixa anar aigua i es bull en lloc de daurar-se). Gira-la fins que sigui daurada per tots els costats i reserva-la.',
        8,
        'Daurar la carn',
      ),
      p(
        'Pica les cebes ({ceba}). Pela les pastanagues ({pastanaga}) i talla-les a rodanxes d’1 cm. Pela i pica els grans d’all ({all}). ' +
          'Ratlla els tomàquets ({tomaquet}) i llença’n la pell.',
      ),
      c(
        'Abaixa el foc a mitjà-baix i posa la ceba a la mateixa olla amb un pessic de sal. Cou-la remenant i rascant el fons fins que sigui tova i daurada.',
        15,
        'Sofregir la ceba',
      ),
      c(
        'Afegeix la pastanaga i l’all, remena 2 minuts i afegeix el tomàquet. Cou-ho fins que el tomàquet hagi perdut l’aigua.',
        8,
        'Sofregir el tomàquet',
      ),
      c('Torna la carn a l’olla, puja el foc i aboca-hi el vi ({vi-blanc}). Deixa’l bullir perquè s’evapori l’alcohol.', 3, 'Evaporar el vi'),
      c(
        'Afegeix-hi el brou ({brou-pollastre}) i el llorer ({llorer}). Quan bulli, abaixa el foc al mínim, tapa l’olla i cou fins que la carn sigui ' +
          'tendra (s’ha de poder partir amb una cullera). Remena de tant en tant i, si es queda sec, afegeix-hi aigua calenta.',
        75,
        'Estofar la carn',
      ),
      c(
        'Pela les patates ({patata}) i talla-les a trossos d’uns 4 cm trencant-les: fes un tall petit i trenca el tros fent palanca amb el ganivet. ' +
          'Afegeix-les a l’olla amb la resta de la sal ({sal:1/2}) i cou-ho tapat fins que siguin toves.',
        25,
        'Coure les patates',
      ),
      c('Aparta l’olla del foc, treu el llorer i deixa-la reposar tapada.', 5, 'Reposar'),
    ],
  },
  {
    id: 'estofat-patates-xorico',
    nom: 'Estofat de patates amb xoriço',
    racions: 4,
    tempsMinuts: 55,
    etiquetes: ['carn'],
    ingredients: [
      l('patata', 1200),
      l('xorico', 250),
      l('ceba', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('all', 2),
      l('pebre-vermell', 5),
      l('llorer', 1),
      l('oli-oliva', 40),
      l('sal', 6),
    ],
    passos: [
      p(
        'Pica la ceba ({ceba}) i el pebrot ({pebrot-verd}) sense llavors. Pela i pica els grans d’all ({all}). Talla el xoriço ({xorico}) a rodanxes d’1 cm.',
      ),
      c(
        'Posa una olla a foc mitjà-baix amb l’oli ({oli-oliva}) i cou-hi la ceba i el pebrot amb un pessic de sal fins que siguin tous.',
        10,
        'Sofregir ceba i pebrot',
      ),
      c('Afegeix l’all i el xoriço i remena fins que el xoriço deixi anar el greix vermell.', 3, 'Coure el xoriço'),
      p(
        'Pela les patates ({patata}) i talla-les a trossos d’uns 4 cm trencant-les (tall petit i palanca amb el ganivet): així deixen anar el midó ' +
          'que espesseix el brou. Aparta l’olla del foc, afegeix-hi el pebre vermell ({pebre-vermell}), remena 10 segons i afegeix-hi les patates.',
      ),
      c(
        'Torna l’olla al foc, cobreix les patates just amb aigua i afegeix-hi el llorer ({llorer}) i la sal ({sal}). Quan bulli, abaixa el foc ' +
          'perquè bulli suaument i cou-ho fins que les patates siguin toves i el brou s’hagi espessit. Sacseja l’olla de tant en tant en lloc de remenar.',
        25,
        'Coure les patates',
      ),
      c('Aparta l’olla del foc i deixa-la reposar tapada.', 5, 'Reposar'),
    ],
  },
  {
    id: 'cigrons-espinacs',
    nom: 'Cigrons amb espinacs',
    racions: 4,
    tempsMinuts: 35,
    etiquetes: ['llegums', 'verdura', 'vegetaria'],
    ingredients: [
      l('cigrons', 800),
      l('espinacs', 400),
      l('all', 4),
      l('pa-pages', 60),
      l('pebre-vermell', 3),
      l('comi', 1),
      l('oli-oliva', 50),
      l('sal', 3),
    ],
    passos: [
      p('Escorre els cigrons ({cigrons}) en un colador i renta’ls amb aigua freda.'),
      c(
        'Posa els espinacs ({espinacs}) congelats en una cassola ampla a foc mitjà amb mig got d’aigua i cou-los remenant fins que estiguin descongelats ' +
          'i calents. Escorre’ls i reserva’ls.',
        6,
        'Descongelar espinacs',
      ),
      c(
        'Picada: talla el pa ({pa-pages}) a llesques d’1 cm i pela els grans d’all ({all}). Posa la mateixa cassola a foc mitjà amb l’oli ({oli-oliva}) ' +
          'i fregeix-hi el pa i els alls fins que siguin daurats, girant-los. Treu-los i deixa l’oli a la cassola.',
        3,
        'Fregir pa i all',
      ),
      p(
        'Posa el pa i els alls al morter (o al got de la batedora) amb el comí ({comi}), el pebre vermell ({pebre-vermell}) i la sal ({sal}). ' +
          'Pica-ho fins que sigui una pasta i afegeix-hi mig got d’aigua per desfer-la.',
      ),
      c(
        'Torna la cassola a foc mitjà i afegeix-hi els espinacs, els cigrons i la picada. Afegeix-hi aigua fins que els cigrons quedin gairebé coberts ' +
          'i cou-ho remenant de tant en tant fins que la salsa sigui espessa.',
        10,
        'Coure els cigrons',
      ),
    ],
  },
  {
    id: 'mongetes-verdures-pernil',
    nom: 'Mongetes blanques amb verdures i pernil',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['llegums', 'carn'],
    ingredients: [
      l('mongetes-cuites', 800),
      l('taquets-pernil', 130),
      l('pastanaga', 2, 'u'),
      l('porro', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('tomaquet', 1, 'u'),
      l('all', 2),
      l('brou-verdures', 500),
      l('oli-oliva', 40),
      l('sal', 2),
    ],
    passos: [
      p('Escorre les mongetes ({mongetes-cuites}) en un colador i renta-les amb aigua freda.'),
      p(
        'Pela les pastanagues ({pastanaga}) i talla-les a daus petits. Neteja el porro ({porro}) obrint-lo de llarg i rentant-lo entre les capes, ' +
          'i talla’l a mitges llunes. Treu les llavors al pebrot ({pebrot-verd}) i pica’l. Pela i pica els grans d’all ({all}). Ratlla el tomàquet ({tomaquet}) ' +
          'i llença’n la pell.',
      ),
      c(
        'Posa una cassola a foc mitjà-baix amb l’oli ({oli-oliva}) i cou-hi el porro, la pastanaga i el pebrot amb un pessic de sal fins que siguin tous.',
        12,
        'Sofregir les verdures',
      ),
      c(
        'Afegeix l’all i els daus de pernil ({taquets-pernil}), remena 2 minuts i afegeix el tomàquet. Cou-ho fins que el tomàquet perdi l’aigua.',
        6,
        'Sofregir pernil i tomàquet',
      ),
      c(
        'Afegeix-hi les mongetes, el brou ({brou-verdures}) i la sal ({sal}) (tasta abans: el pernil ja sala). Cou-ho a foc baix, remenant amb compte, ' +
          'fins que el brou s’espesseixi. Si vols més espès, aixafa unes quantes mongetes contra la paret de la cassola.',
        12,
        'Coure les mongetes',
      ),
    ],
  },
  {
    id: 'cigrons-xorico',
    nom: 'Cigrons amb xoriço',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['llegums', 'carn'],
    ingredients: [
      l('cigrons', 800),
      l('xorico', 200),
      l('patata', 2, 'u'),
      l('ceba', 1, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('tomaquet-triturat', 200),
      l('all', 2),
      l('pebre-vermell', 3),
      l('brou-pollastre', 600),
      l('llorer', 1),
      l('oli-oliva', 40),
      l('sal', 3),
    ],
    passos: [
      p(
        'Escorre i renta els cigrons ({cigrons}). Pica la ceba ({ceba}) i el pebrot ({pebrot-vermell}) sense llavors. Pela i pica els grans d’all ({all}). ' +
          'Talla el xoriço ({xorico}) a rodanxes d’1 cm.',
      ),
      c(
        'Posa una cassola a foc mitjà-baix amb l’oli ({oli-oliva}) i cou-hi la ceba i el pebrot amb un pessic de sal fins que siguin tous i daurats.',
        10,
        'Sofregir ceba i pebrot',
      ),
      c(
        'Afegeix l’all i el xoriço i remena fins que el xoriço deixi anar el greix. Afegeix el tomàquet triturat ({tomaquet-triturat}) i cou-ho ' +
          'fins que sigui espès i fosc.',
        8,
        'Sofregir el tomàquet',
      ),
      p(
        'Pela les patates ({patata}) i talla-les a daus de 2 cm trencant-les. Aparta la cassola del foc, afegeix-hi el pebre vermell ({pebre-vermell}) ' +
          'i remena 10 segons.',
      ),
      c(
        'Torna-la al foc i afegeix-hi les patates, els cigrons, el brou ({brou-pollastre}), el llorer ({llorer}) i la sal ({sal}). Quan bulli, ' +
          'abaixa el foc i cou-ho fins que les patates siguin toves i el brou s’hagi espessit.',
        20,
        'Coure els cigrons',
      ),
    ],
  },
  {
    id: 'sopa-pollastre',
    nom: 'Sopa de pollastre amb fideus',
    racions: 4,
    tempsMinuts: 80,
    etiquetes: ['sopa', 'carn'],
    ingredients: [
      l('pollastre-trossos', 800),
      l('pastanaga', 2, 'u'),
      l('porro', 1, 'u'),
      l('ceba', 1, 'u'),
      l('fideus-fins', 160),
      l('llorer', 1),
      l('sal', 10),
    ],
    passos: [
      c(
        'Posa el pollastre ({pollastre-trossos}) en una olla amb aigua freda: mig litre per persona. Posa-la a foc fort i, quan comenci a bullir, ' +
          'treu l’escuma grisa de la superfície amb una escumadora fins que deixi de sortir.',
        10,
        'Escumar el brou',
      ),
      c(
        'Pela les pastanagues ({pastanaga}) i la ceba ({ceba}) i neteja el porro ({porro}). Afegeix-los sencers a l’olla amb el llorer ({llorer}) ' +
          'i la sal ({sal}). Abaixa el foc perquè bulli suaument i cou-ho tapat a mitges.',
        45,
        'Fer el brou',
      ),
      p(
        'Treu el pollastre i les verdures. Cola el brou i torna’l a l’olla. Quan el pollastre es pugui tocar, desfila la carn amb els dits i llença la pell i els ossos. ' +
          'Talla la pastanaga a daus petits.',
      ),
      c(
        'Porta el brou a ebullició i afegeix-hi els fideus ({fideus-fins}), la carn desfilada i la pastanaga. Cou-ho el temps que diu el paquet dels fideus. ' +
          'Tasta-la de sal i serveix-la de seguida.',
        5,
        'Coure els fideus',
      ),
    ],
  },
  {
    id: 'crema-carbasso',
    nom: 'Crema de carbassó amb crostons i formatge',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['verdura', 'vegetaria'],
    ingredients: [
      l('carbasso', 4, 'u'),
      l('porro', 1, 'u'),
      l('patata', 1, 'u'),
      l('formatgets', 4),
      l('brou-verdures', 600),
      l('pa-pages', 120),
      l('formatge-ratllat', 40),
      l('oli-oliva', 40),
      l('sal', 4),
      l('pebre-negre', 1),
    ],
    passos: [
      p(
        'Renta els carbassons ({carbasso}) i talla’ls a trossos (amb pell, però treu-ne les puntes). Neteja el porro ({porro}) i talla’l a rodanxes. ' +
          'Pela la patata ({patata}) i talla-la a daus petits (espesseix la crema).',
      ),
      c(
        'Posa una olla a foc mitjà-baix amb la meitat de l’oli ({oli-oliva:1/2}) i cou-hi el porro amb un pessic de sal fins que sigui tou, sense daurar-se.',
        6,
        'Ofegar el porro',
      ),
      c(
        'Afegeix-hi el carbassó i la patata, remena 2 minuts i aboca-hi el brou ({brou-verdures}) (no ha de cobrir del tot la verdura: el carbassó deixa anar aigua). ' +
          'Afegeix-hi la sal ({sal}). Quan bulli, abaixa el foc, tapa i cou fins que la patata sigui tova.',
        15,
        'Coure la verdura',
      ),
      p(
        'Aparta l’olla del foc, afegeix-hi els formatgets ({formatgets}) i el pebre ({pebre-negre}) i tritura-ho amb la batedora fins que quedi una crema fina. ' +
          'Si és massa espessa, afegeix-hi aigua calenta; si és massa líquida, cou-la uns minuts destapada.',
      ),
      c(
        'Crostons: talla el pa ({pa-pages}) a daus d’1 cm. Posa una paella a foc mitjà amb la resta de l’oli ({oli-oliva:1/2}) i fregeix-hi el pa remenant ' +
          'fins que sigui daurat i cruixent. Treu-lo a paper de cuina.',
        4,
        'Fer els crostons',
      ),
      p('Serveix la crema amb els crostons i el formatge ratllat ({formatge-ratllat}) per sobre.'),
    ],
  },
  {
    id: 'pure-salsitxes',
    nom: 'Puré de patata amb salsitxes',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['carn'],
    ingredients: [
      l('patata', 1200),
      l('llet', 250),
      l('mantega', 50),
      l('nou-moscada', 1),
      l('salsitxes', 600),
      l('oli-oliva', 15),
      l('sal', 8),
    ],
    passos: [
      c(
        'Pela les patates ({patata}) i talla-les a trossos iguals d’uns 4 cm. Posa-les en una olla amb aigua freda que les cobreixi i la meitat de la sal ' +
          '({sal:1/2}). Quan bulli, cou-les fins que es desfacin en punxar-les.',
        20,
        'Bullir les patates',
      ),
      p('Mentrestant, escalfa la llet ({llet}) en un cassó o al microones, sense que bulli.'),
      p(
        'Escorre bé les patates i torna-les a l’olla calenta, fora del foc. Aixafa-les amb un passapurés o una forquilla (no amb la batedora: ' +
          'el puré quedaria enganxós). Afegeix-hi la mantega ({mantega}) i, a poc a poc, la llet calenta, remenant amb una cullera de fusta fins que quedi ' +
          'un puré fi. Posa-hi la resta de la sal ({sal:1/2}) i la nou moscada ({nou-moscada}).',
      ),
      c(
        'Punxa les salsitxes ({salsitxes}) amb una forquilla. Posa una paella a foc mitjà amb l’oli ({oli-oliva}) i cou-les girant-les sovint fins que siguin ' +
          'daurades per tot arreu i cuites per dins (sense cap part rosada).',
        12,
        'Coure les salsitxes',
      ),
      p('Serveix el puré calent amb les salsitxes al costat.'),
    ],
  },
  {
    id: 'bacalla-tomaquet',
    nom: 'Bacallà amb tomàquet',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['peix'],
    ingredients: [
      l('bacalla', 700),
      l('tomaquet-triturat', 800),
      l('ceba', 2, 'u'),
      l('all', 2),
      l('farina', 40),
      l('sucre', 5),
      l('llorer', 1),
      l('oli-oliva', 80),
      l('sal', 3),
    ],
    passos: [
      p(
        'Si el bacallà ({bacalla}) és congelat, descongela’l a la nevera la nit abans. Asseca’l amb paper de cuina. No el salis: ja és prou salat.',
      ),
      c(
        'Salsa: pica les cebes ({ceba}) i els grans d’all ({all}). Posa una cassola ampla a foc mitjà-baix amb la meitat de l’oli ({oli-oliva:1/2}) ' +
          'i cou-hi la ceba amb la sal ({sal}) fins que sigui tova i daurada. Afegeix l’all l’últim minut.',
        12,
        'Ofegar la ceba',
      ),
      c(
        'Afegeix-hi el tomàquet triturat ({tomaquet-triturat}), el sucre ({sucre}) i el llorer ({llorer}). Cou-ho a foc baix, remenant de tant en tant, ' +
          'fins que la salsa sigui espessa i fosca.',
        20,
        'Coure la salsa',
      ),
      c(
        'Mentrestant, passa el bacallà per la farina ({farina}) i espolsa’l. Escalfa la resta de l’oli ({oli-oliva:1/2}) en una paella a foc mitjà ' +
          'i fregeix-lo, primer per la banda de la pell, fins que sigui daurat. El cronòmetre és per a cada costat.',
        2,
        'Bacallà: un costat',
      ),
      c(
        'Posa el bacallà dins la salsa, tapa la cassola i cou-ho a foc baix fins que el peix es separi en làmines en pressionar-lo. Treu el llorer.',
        6,
        'Acabar el bacallà',
      ),
    ],
  },
  {
    id: 'ous-plat',
    nom: 'Ous al plat amb tomàquet, pèsols i pernil',
    racions: 4,
    tempsMinuts: 35,
    etiquetes: ['ou', 'carn'],
    ingredients: [
      l('ou', 8),
      l('tomaquet-fregit', 400),
      l('pesols', 250),
      l('taquets-pernil', 130),
      l('ceba', 1, 'u'),
      l('pa-pages', 200),
      l('oli-oliva', 30),
      l('sal', 2),
    ],
    passos: [
      p('Encén el forn a 200 °C, amb escalfor a dalt i a baix.'),
      c(
        'Pica la ceba ({ceba}). Posa una paella a foc mitjà-baix amb l’oli ({oli-oliva}) i cou-hi la ceba fins que sigui tova.',
        8,
        'Ofegar la ceba',
      ),
      c(
        'Afegeix-hi els daus de pernil ({taquets-pernil}) i els pèsols ({pesols}) congelats i cou-ho remenant fins que els pèsols siguin tendres. ' +
          'Afegeix-hi el tomàquet fregit ({tomaquet-fregit}) i escalfa-ho.',
        6,
        'Coure pèsols i pernil',
      ),
      p(
        'Reparteix la barreja en 4 cassoletes de fang o en una safata de forn. Fes-hi un clot per a cada ou i trenca-hi els ous ({ou}) amb compte ' +
          'perquè el rovell no es trenqui. Reparteix la sal ({sal}) per sobre dels ous.',
      ),
      c(
        'Enforna-ho a mitja altura fins que la clara sigui blanca i quallada però el rovell encara líquid (mira-ho a partir dels 8 minuts).',
        10,
        'Ous al forn',
      ),
      p('Serveix-los de seguida, amb el pa ({pa-pages}) a llesques per sucar.'),
    ],
  },
];
