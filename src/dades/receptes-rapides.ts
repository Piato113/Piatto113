import type { Recepta } from '../domini';
import { c, l, p } from './ajudants';

// Plats bàsics i ràpids (pack de Roger, octubre de 2026). Quantitats per a 4 racions normals.
// Tortilles de blat: es poden escalfar en una paella seca o al microones; s'explica a cada recepta.

const escalfarTortilles =
  'Escalfa les tortilles ({tortilla-blat}) just abans de servir: en una paella seca a foc mitjà, uns 20 segons per costat, o al microones, ' +
  'apilades i tapades amb un drap de cuina humit, 30 segons. Han de quedar toves i flexibles; si s’assequen, es trenquen en enrotllar-les. ' +
  'Guarda-les tapades amb el drap perquè no es refredin.';

export const receptesRapides: Recepta[] = [
  {
    id: 'wraps-pollastre',
    nom: 'Wraps de pollastre',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['carn'],
    ingredients: [
      l('tortilla-blat', 8),
      l('pit-pollastre', 600),
      l('enciam', 1),
      l('tomaquet', 2, 'u'),
      l('formatge-ratllat', 120),
      l('salsa-iogurt', 150),
      l('pebre-vermell', 2),
      l('oli-oliva', 20),
      l('sal', 4),
    ],
    passos: [
      p(
        'Talla el pit de pollastre ({pit-pollastre}) a tires d’1 cm de gruix. Posa-les en un bol amb la sal ({sal}), el pebre vermell ({pebre-vermell}) ' +
          'i la meitat de l’oli ({oli-oliva:1/2}), i remena-ho amb les mans perquè totes les tires quedin untades.',
      ),
      p(
        'Separa les fulles de l’enciam ({enciam}), renta-les amb aigua freda, eixuga-les bé i talla-les a tires fines. Renta els tomàquets ({tomaquet}) ' +
          'i talla’ls a daus petits. Posa-ho en bols per portar a taula, amb el formatge ({formatge-ratllat}) i la salsa de iogurt ({salsa-iogurt}).',
      ),
      c(
        'Escalfa una paella gran a foc fort amb la resta de l’oli ({oli-oliva:1/2}). Quan sigui ben calenta, posa-hi les tires sense amuntegar-les ' +
          '(si no hi caben, fes-ho en dues tandes) i deixa-les un minut sense tocar perquè es daurin. Després remena de tant en tant. ' +
          'Són fetes quan són daurades per fora i, en tallar-ne la més gruixuda, és blanca per dins, sense res de rosat.',
        7,
        'Pollastre a tires',
      ),
      p(escalfarTortilles),
      p(
        'A taula, cadascú es munta el seu: una cullerada de salsa al centre de la tortilla, enciam, tomàquet, pollastre i formatge. ' +
          'Plega cap amunt la part de baix i enrotlla-la des d’un costat; la part plegada fa de tap perquè no regalimi.',
      ),
    ],
  },
  {
    id: 'quesadilles-pollastre',
    nom: 'Quesadilles de pollastre i formatge',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['carn'],
    ingredients: [
      l('tortilla-blat', 8),
      l('pit-pollastre', 400),
      l('mozzarella', 250),
      l('blat-de-moro', 140),
      l('comi', 1),
      l('oli-oliva', 20),
      l('sal', 3),
    ],
    passos: [
      p(
        'Talla el pit de pollastre ({pit-pollastre}) a daus d’1 cm, com més petits millor perquè la quesadilla quedi plana. ' +
          'Posa’ls en un bol amb la sal ({sal}) i el comí ({comi}) i remena.',
      ),
      c(
        'Escalfa una paella a foc mitjà-fort amb la meitat de l’oli ({oli-oliva:1/2}) i cou-hi el pollastre, remenant, fins que sigui daurat per fora ' +
          'i blanc per dins. Treu-lo a un plat i eixuga la paella amb paper de cuina: la faràs servir per a les quesadilles.',
        6,
        'Pollastre a daus',
      ),
      p(
        'Escorre el blat de moro ({blat-de-moro}). Posa 4 tortilles ({tortilla-blat}) sobre el marbre i reparteix-hi la meitat del formatge ' +
          '({mozzarella:1/2}), després el pollastre i el blat de moro, i a sobre la resta del formatge ({mozzarella:1/2}). El formatge de sota i el de ' +
          'sobre fan de cola: si no n’hi ha a les dues bandes, la quesadilla es desmunta. Tapa cadascuna amb una altra tortilla i prem-la amb la mà.',
      ),
      c(
        'Unta la paella amb una mica de la resta de l’oli ({oli-oliva:1/2}) i posa-la a foc mitjà. Cou-hi una quesadilla, aixafant-la de tant en tant ' +
          'amb una espàtula, fins que per sota sigui daurada i cruixent. Gira-la ajudant-te d’un plat, com una truita, i cou l’altre costat igual. ' +
          'És feta quan el formatge comença a sortir fos per les vores. El cronòmetre és per a cada costat. Si tens dues paelles, en pots fer dues alhora.',
        2.5,
        'Quesadilla: un costat',
      ),
      p(
        'Talla cada quesadilla en 4 triangles amb un ganivet gran o un tallapizzes i serveix-la calenta mentre fas les altres: ' +
          'quan es refreda, el formatge s’endureix.',
      ),
    ],
  },
  {
    id: 'arros-saltejat-ou',
    nom: 'Arròs saltejat amb ou i verdures',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['arros', 'ou', 'verdura', 'vegetaria', 'aprofitament'],
    ingredients: [
      l('arros-llarg', 300),
      l('ou', 4),
      l('pastanaga', 2, 'u'),
      l('ceba', 1, 'u'),
      l('pesols', 200),
      l('all', 2),
      l('salsa-soja', 50),
      l('oli-girasol', 45),
      l('sal', 10),
    ],
    passos: [
      c(
        'Posa a bullir aigua abundant en una olla (unes 8 vegades el pes de l’arròs) amb la sal ({sal}). Quan bulli, tira-hi l’arròs ({arros-llarg}), ' +
          'remena un cop i deixa’l coure fins que sigui tou però amb el centre encara una mica ferm: acabarà de fer-se a la paella.',
        11,
        'Bullir l’arròs',
      ),
      p(
        'Escorre l’arròs, passa’l per aigua freda i escampa’l en una safata perquè s’eixugui mentre prepares la resta: l’arròs moll s’enganxa i queda ' +
          'empastifat. Si tens arròs cuit d’un dia o dos abans, guardat tapat a la nevera, és encara millor: salta’t aquest pas i l’anterior.',
      ),
      p(
        'Pela les pastanagues ({pastanaga}) i talla-les a daus de 5 mm. Pela la ceba ({ceba}) i talla-la a daus petits. Pela els alls ({all}) ' +
          'i talla’ls a làmines fines. Bat els ous ({ou}) en un bol amb un pessic de sal.',
      ),
      c(
        'Escalfa una paella gran o un wok a foc fort amb un terç de l’oli ({oli-girasol:1/3}). Quan sigui calent, aboca-hi els ous i remena’ls com ' +
          'si fessis ous remenats, fins que siguin quallats però encara tendres. Treu-los a un plat.',
        1,
        'Ous remenats',
      ),
      c(
        'A la mateixa paella, amb un altre terç de l’oli ({oli-girasol:1/3}), salteja la pastanaga i la ceba remenant sovint, fins que la ceba sigui ' +
          'transparent i la pastanaga comenci a estovar-se. Afegeix-hi l’all i els pèsols ({pesols}), congelats mateix, i cou fins que siguin calents.',
        5,
        'Saltejar les verdures',
      ),
      c(
        'Afegeix-hi la resta de l’oli ({oli-girasol:1/3}) i l’arròs. Escampa’l per tota la paella i deixa’l un minut sense remenar perquè es torri ' +
          'una mica per sota; després remena i torna a deixar-lo quiet. Repeteix-ho fins que s’acabi el temps: l’arròs ha de quedar solt i calent.',
        4,
        'Saltejar l’arròs',
      ),
      p(
        'Aboca la salsa de soja ({salsa-soja}) pels costats de la paella, torna-hi els ous trencant-los a trossos amb l’espàtula i remena 30 segons. ' +
          'Tasta’l: la soja ja és salada, així que afegeix-ne més només si cal. Serveix-lo calent.',
      ),
    ],
  },
  {
    id: 'truita-francesa-farcida',
    nom: 'Truita francesa farcida de formatge i pernil',
    racions: 4,
    tempsMinuts: 15,
    etiquetes: ['ou', 'carn'],
    ambAcompanyament: true,
    acompanyaments: ['amanida', 'pa-amb-tomaquet'],
    ingredients: [
      l('ou', 8),
      l('pernil-dolc', 160),
      l('formatge-llesques', 120),
      l('oli-oliva', 20),
      l('sal', 3),
    ],
    passos: [
      p(
        'Les truites es fan d’una en una, de 2 ous per persona. Talla el pernil ({pernil-dolc}) i el formatge ({formatge-llesques}) a tires ' +
          'i fes-ne tants munts com truites hagis de fer.',
      ),
      p(
        'Dels ous ({ou}), trenca’n 2 en un bol amb un pessic de la sal ({sal}) i bat-los amb una forquilla fins que la clara i el rovell ' +
          'siguin ben barrejats, sense fils de clara.',
      ),
      c(
        'Escalfa una paella petita antiadherent (d’uns 20 cm) a foc mitjà amb una mica de l’oli ({oli-oliva}). Aboca-hi l’ou i, amb una espàtula, ' +
          'porta les vores cap al centre perquè l’ou cru ocupi el buit. Quan el centre encara sigui una mica cremós, posa un munt de pernil i formatge ' +
          'en una meitat.',
        1.5,
        'Quallar la truita',
      ),
      c(
        'Plega la truita per la meitat perquè tapi el farciment, abaixa el foc i deixa-la fins que el formatge es fongui. Ha de quedar groga i tendra, ' +
          'no daurada.',
        1,
        'Fondre el formatge',
      ),
      p('Passa-la al plat i fes les altres de la mateixa manera, batent cada vegada 2 ous. Serveix-les amb l’acompanyament.'),
    ],
  },
  {
    id: 'ous-remenats-xampinyons',
    nom: 'Ous remenats amb xampinyons i torrades',
    racions: 4,
    tempsMinuts: 15,
    etiquetes: ['ou', 'verdura', 'vegetaria'],
    ingredients: [
      l('ou', 8),
      l('xampinyons', 320),
      l('all', 2),
      l('julivert', 10),
      l('mantega', 20),
      l('oli-oliva', 20),
      l('pa-pages', 300),
      l('sal', 4),
      l('pebre-negre', 1),
    ],
    passos: [
      p(
        'Si els xampinyons ({xampinyons}) no són laminats, neteja’ls amb paper de cuina humit (sota l’aixeta xuclen aigua) i talla’ls a làmines. ' +
          'Pela els alls ({all}) i talla’ls a làmines fines. Pica el julivert ({julivert}).',
      ),
      c(
        'Escalfa una paella gran a foc fort amb l’oli ({oli-oliva}) i posa-hi els xampinyons. Primer deixaran anar aigua: continua remenant de tant en tant ' +
          'fins que s’evapori i comencin a daurar-se. Afegeix-hi l’all l’últim minut, sense deixar que es torri.',
        7,
        'Xampinyons',
      ),
      p(
        'Mentrestant, talla el pa ({pa-pages}) a llesques i torra-les. Bat els ous ({ou}) en un bol amb la sal ({sal}) i el pebre ({pebre-negre}).',
      ),
      c(
        'Abaixa el foc al mínim i afegeix la mantega ({mantega}) a la paella dels xampinyons. Quan es fongui, aboca-hi els ous i remena sense parar ' +
          'amb una espàtula, fent plecs grans i rascant el fons. Treu la paella del foc quan els ous encara brillin una mica: la calor que queda ' +
          'els acaba de fer. Han de quedar cremosos, no secs ni a grumolls petits.',
        3,
        'Remenar els ous',
      ),
      p('Escampa-hi el julivert i serveix-los de seguida amb les torrades.'),
    ],
  },
  {
    id: 'entrepans-llom-formatge',
    nom: 'Entrepans calents de llom i formatge',
    racions: 4,
    tempsMinuts: 15,
    etiquetes: ['carn'],
    ingredients: [
      l('pa-barra', 500),
      l('llom', 500),
      l('formatge-llesques', 150),
      l('tomaquet', 2, 'u'),
      l('oli-oliva', 30),
      l('sal', 4),
    ],
    passos: [
      p(
        'Encén el gratinador del forn. Talla el pa ({pa-barra}) en 4 trossos iguals i obre’ls per la meitat de llarg. Talla els tomàquets ({tomaquet}) ' +
          'per la meitat i frega’ls per la cara de dins del pa; rega-ho amb la meitat de l’oli ({oli-oliva:1/2}).',
      ),
      p('Sala els filets de llom ({llom}) amb la sal ({sal}). Si són gruixuts, aixafa’ls entre dos fulls de paper de forn amb un corró fins que facin uns 4 mm.'),
      c(
        'Escalfa una paella a foc fort amb la resta de l’oli ({oli-oliva:1/2}) i cou-hi els filets en tandes, sense amuntegar-los. ' +
          'Han de quedar daurats per fora i blancs i sucosos per dins. El cronòmetre és per a cada costat.',
        1.5,
        'Llom: un costat',
      ),
      p('Posa el llom dins el pa i el formatge ({formatge-llesques}) a sobre de la carn.'),
      c(
        'Posa els entrepans oberts a la safata del forn, a la part de dalt, fins que el formatge sigui fos i el pa cruixent. Vigila: el gratinador crema ' +
          'en pocs segons. Sense forn, tanca’ls i passa’ls per la paella amb un plat a sobre, un minut per costat.',
        3,
        'Gratinar',
      ),
    ],
  },
  {
    id: 'hamburgueses-formatge',
    nom: 'Hamburgueses amb formatge',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['amanida'],
    ingredients: [
      l('hamburguesa', 4, 'u'),
      l('pa-hamburguesa', 4),
      l('formatge-llesques', 80),
      l('tomaquet', 1, 'u'),
      l('ceba', 75),
      l('oli-oliva', 10),
    ],
    passos: [
      p(
        'Treu les hamburgueses ({hamburguesa}) de la nevera 10 minuts abans perquè no entrin glaçades a la paella. Talla el tomàquet ({tomaquet}) ' +
          'a rodanxes i la ceba ({ceba}) a rodanxes fines.',
      ),
      c(
        'Escalfa una paella o una planxa a foc fort amb l’oli ({oli-oliva}). Quan sigui ben calenta, posa-hi les hamburgueses i no les aixafis: ' +
          'perdrien el suc. Gira-les un sol cop. El cronòmetre és per a cada costat.',
        4,
        'Hamburguesa: un costat',
      ),
      p(
        'Just després de girar-les, posa una llesca de formatge ({formatge-llesques}) sobre cada una perquè es fongui amb la calor. ' +
          'Són fetes quan, en prémer-les pel centre, són fermes i el suc que surt és transparent: la carn picada s’ha de fer del tot.',
      ),
      c(
        'Mentrestant, obre els panets ({pa-hamburguesa}) i torra’ls per la cara tallada en una paella o a la torradora.',
        1,
        'Torrar el pa',
      ),
      p('Munta-les: pa, hamburguesa amb el formatge, tomàquet, ceba i l’altra meitat del pa. Serveix-les amb l’amanida.'),
    ],
  },
  {
    id: 'salsitxes-pure-rapid',
    nom: 'Salsitxes a la planxa amb puré ràpid',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['carn'],
    ingredients: [
      l('salsitxes', 600),
      l('patata', 1000),
      l('llet', 200),
      l('mantega', 40),
      l('oli-oliva', 10),
      l('sal', 10),
    ],
    passos: [
      p('Pela les patates ({patata}) i talla-les a daus de 2 cm: com més petits, abans es couen.'),
      c(
        'Posa les patates en una olla, cobreix-les d’aigua freda, afegeix-hi la meitat de la sal ({sal:1/2}) i porta-ho a bullir. ' +
          'Són fetes quan una forquilla hi entra sense fer força.',
        15,
        'Bullir les patates',
      ),
      c(
        'Mentrestant, punxa les salsitxes ({salsitxes}) 3 o 4 vegades amb una forquilla perquè no rebentin. Escalfa una paella a foc mitjà amb l’oli ' +
          '({oli-oliva}) i cou-les girant-les sovint, fins que siguin daurades per tots els costats i fermes. En tallar-ne una, no ha de ser rosada per dins.',
        12,
        'Salsitxes',
      ),
      p('Escalfa la llet ({llet}) en un cassó o al microones, sense que bulli.'),
      p(
        'Escorre bé les patates, torna-les a l’olla i deixa-les un minut al foc perquè perdin l’aigua. Afegeix-hi la mantega ({mantega}) i, a poc a poc, ' +
          'la llet calenta, mentre les aixafes amb un aixafapatates o una forquilla (amb la batedora elèctrica el puré queda enganxós). ' +
          'Afegeix-hi la resta de la sal ({sal:1/2}), tasta’l i serveix-lo amb les salsitxes.',
      ),
    ],
  },
  {
    id: 'pollastre-planxa',
    nom: 'Pit de pollastre a la planxa',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['arros-blanc'],
    ingredients: [
      l('pit-pollastre', 700),
      l('llimona', 1, 'u'),
      l('all', 1),
      l('orenga', 1),
      l('oli-oliva', 30),
      l('sal', 4),
      l('pebre-negre', 1),
    ],
    passos: [
      p(
        'Si els filets de pollastre ({pit-pollastre}) fan més d’1 cm de gruix, posa’ls entre dos fulls de paper de forn i aixafa’ls amb un corró ' +
          'fins que tots facin el mateix gruix: així es fan per igual i no s’assequen.',
      ),
      c(
        'En un plat fondo, ratlla l’all ({all}) i afegeix-hi el suc de mitja llimona ({llimona:1/2}), la meitat de l’oli ({oli-oliva:1/2}), l’orenga ' +
          '({orenga}), la sal ({sal}) i el pebre ({pebre-negre}). Passa-hi els filets per les dues bandes i deixa’ls reposar.',
        10,
        'Adobar el pollastre',
      ),
      c(
        'Escalfa una planxa o una paella a foc fort amb la resta de l’oli ({oli-oliva:1/2}). Quan sigui molt calenta, posa-hi els filets sense amuntegar-los ' +
          'i no els moguis fins que es desenganxin sols. Són fets quan, en tallar el més gruixut, és blanc per dins i el suc surt transparent. ' +
          'El cronòmetre és per a cada costat.',
        3,
        'Pollastre: un costat',
      ),
      p('Serveix-los amb l’altra meitat de la llimona ({llimona:1/2}) tallada a gallons i amb l’arròs.'),
    ],
  },
  {
    id: 'tires-pollastre-forn',
    nom: 'Tires de pollastre cruixents al forn',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    ingredients: [
      l('pit-pollastre', 700),
      l('ou', 2),
      l('pa-ratllat', 120),
      l('parmesa', 30),
      l('pebre-vermell', 2),
      l('oli-oliva', 30),
      l('sal', 5),
    ],
    passos: [
      p('Encén el forn a 220 °C amb ventilador (o la fregidora d’aire a 200 °C). Folra una safata amb paper de forn.'),
      p('Talla el pit de pollastre ({pit-pollastre}) a tires de 2 cm d’ample i sala-les amb la sal ({sal}).'),
      p(
        'Prepara dos plats: un amb els ous ({ou}) batuts i un altre amb el pa ratllat ({pa-ratllat}), el parmesà ({parmesa}) i el pebre vermell ' +
          '({pebre-vermell}). Aboca l’oli ({oli-oliva}) sobre el pa ratllat i barreja-ho amb els dits fins que sembli sorra humida: l’oli és el que ' +
          'farà que es daurin al forn.',
      ),
      p(
        'Passa cada tira per l’ou, deixa-la escórrer, i després pel pa ratllat, prement perquè s’hi enganxi bé. Posa-les a la safata separades, ' +
          'sense que es toquin.',
      ),
      c(
        'Enforna-les a mitja altura i gira-les a la meitat del temps. Són fetes quan són daurades i cruixents i, en tallar-ne la més gruixuda, ' +
          'és blanca per dins. A la fregidora d’aire, en una sola capa, en tenen prou amb uns 12 minuts.',
        14,
        'Tires al forn',
      ),
    ],
  },
  {
    id: 'salmo-planxa',
    nom: 'Salmó a la planxa',
    racions: 4,
    tempsMinuts: 15,
    etiquetes: ['peix'],
    ambAcompanyament: true,
    acompanyaments: ['cuscus'],
    ingredients: [l('salmo', 700), l('llimona', 1, 'u'), l('oli-oliva', 15), l('sal', 4), l('pebre-negre', 1)],
    passos: [
      p(
        'Si el salmó ({salmo}) és congelat, descongela’l a la nevera la nit abans. Eixuga’l bé amb paper de cuina (si és humit, no es daura) ' +
          'i salpebra’l amb la sal ({sal}) i el pebre ({pebre-negre}).',
      ),
      c(
        'Escalfa una paella antiadherent a foc mitjà-fort amb l’oli ({oli-oliva}). Posa-hi el salmó, amb la pell cap avall si en té, i no el moguis: ' +
          'el veuràs canviar de color, de rosa fosc a rosa pàl·lid, des de baix cap amunt. Gira’l quan el canvi arribi a la meitat del gruix.',
        4,
        'Salmó: primer costat',
      ),
      c(
        'Cou l’altre costat. És fet quan s’esmicola en làmines en prémer-lo amb una forquilla; si el centre encara és una mica translúcid, quedarà més sucós.',
        2.5,
        'Salmó: segon costat',
      ),
      p('Serveix-lo amb la llimona ({llimona}) tallada a gallons i amb el cuscús.'),
    ],
  },
  {
    id: 'cuscus-pollastre-verdures',
    nom: 'Cuscús amb pollastre i verdures',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['carn', 'verdura'],
    ingredients: [
      l('cuscus', 300),
      l('pit-pollastre', 500),
      l('carbasso', 1, 'u'),
      l('pastanaga', 1, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('ceba', 1, 'u'),
      l('brou-pollastre', 330),
      l('comi', 2),
      l('oli-oliva', 40),
      l('sal', 5),
    ],
    passos: [
      p(
        'Talla el pollastre ({pit-pollastre}) a daus de 2 cm i posa’l en un bol amb la sal ({sal}) i el comí ({comi}). Talla el carbassó ({carbasso}), ' +
          'el pebrot ({pebrot-vermell}) i la ceba ({ceba}) a daus d’1 cm, i la pastanaga ({pastanaga}), pelada, a daus més petits, de 5 mm, perquè és més dura.',
      ),
      c(
        'Escalfa una cassola ampla a foc fort amb la meitat de l’oli ({oli-oliva:1/2}) i dora-hi el pollastre, remenant de tant en tant. ' +
          'No cal que sigui fet per dins: s’acabarà de fer amb les verdures. Treu-lo a un plat.',
        5,
        'Daurar el pollastre',
      ),
      c(
        'A la mateixa cassola, a foc mitjà, posa la resta de l’oli ({oli-oliva:1/2}), la ceba, la pastanaga i el pebrot, i cou-ho remenant ' +
          'fins que la ceba sigui tova i transparent.',
        6,
        'Sofregir les verdures',
      ),
      c(
        'Afegeix-hi el carbassó i el pollastre i cou-ho fins que el carbassó sigui tendre i el pollastre blanc per dins.',
        4,
        'Acabar el saltejat',
      ),
      p('Mentrestant, escalfa el brou ({brou-pollastre}) fins que bulli, en un cassó o al microones.'),
      c(
        'Posa el cuscús ({cuscus}) en un bol ample, aboca-hi el brou bullent, remena un moment i tapa el bol amb un plat. No el toquis fins que acabi el temps.',
        5,
        'Inflar el cuscús',
      ),
      p(
        'Destapa’l i separa’n els grans amb una forquilla, rascant des de dalt. Barreja’l amb el pollastre i les verdures i tasta’l: ' +
          'el brou ja porta sal, potser no cal afegir-n’hi.',
      ),
    ],
  },
  {
    id: 'amanida-pasta-tonyina',
    nom: 'Amanida completa de pasta amb tonyina',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['pasta', 'peix'],
    ingredients: [
      l('penne', 320),
      l('tonyina', 240),
      l('tomaquet', 3, 'u'),
      l('blat-de-moro', 140),
      l('olives-negres', 80),
      l('oli-oliva', 40),
      l('vinagre', 15),
      l('sal', 25),
    ],
    passos: [
      p('Posa una olla gran a foc fort amb aigua: 1 litre per cada 100 g de pasta. Quan bulli amb força, afegeix-hi la sal ({sal}).'),
      c(
        'Tira-hi la pasta ({penne}) i remena perquè no s’enganxi. Cou-la un minut menys del que diu el paquet: freda, la pasta massa cuita es desfà.',
        10,
        'Bullir la pasta',
      ),
      p(
        'Escorre-la i passa-la per aigua freda, remenant, fins que sigui freda del tot. Escorre-la molt bé: si queda aigua, l’amanida queda aigualida.',
      ),
      p(
        'Mentrestant, renta els tomàquets ({tomaquet}) i talla’ls a daus. Escorre la tonyina ({tonyina}) i el blat de moro ({blat-de-moro}), ' +
          'i talla les olives ({olives-negres}) a rodanxes.',
      ),
      p(
        'Barreja-ho tot amb la pasta en una enciamera. Amaneix-ho amb l’oli ({oli-oliva}) i el vinagre ({vinagre}), remena de baix a dalt i tasta-ho. ' +
          'Es pot fer abans i guardar-la tapada a la nevera fins a l’endemà; en aquest cas, amaneix-la just abans de menjar.',
      ),
    ],
  },
  {
    id: 'amanida-arros-tonyina',
    nom: 'Amanida d’arròs amb ou, blat de moro i tonyina',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['arros', 'peix', 'ou'],
    ingredients: [
      l('arros-llarg', 280),
      l('ou', 4),
      l('blat-de-moro', 140),
      l('tonyina', 160),
      l('tomaquet', 2, 'u'),
      l('oli-oliva', 40),
      l('vinagre', 15),
      l('sal', 15),
    ],
    passos: [
      c(
        'Posa a bullir aigua abundant (unes 8 vegades el pes de l’arròs) amb la sal ({sal}). Quan bulli, tira-hi l’arròs ({arros-llarg}), remena un cop ' +
          'i deixa’l coure fins que sigui tou però sencer, no esclafat.',
        12,
        'Bullir l’arròs',
      ),
      c(
        'Alhora, posa els ous ({ou}) en un cassó amb aigua freda que els cobreixi i porta’ls a bullir. Engega el cronòmetre quan l’aigua arrenqui el bull. ' +
          'En acabar, passa’ls a un bol amb aigua freda: es pelen millor i el rovell no es torna verdós.',
        10,
        'Ous durs',
      ),
      p('Escorre l’arròs i passa’l per aigua freda fins que sigui fred del tot. Escorre’l molt bé.'),
      p(
        'Pela els ous i talla’ls a quarts. Renta els tomàquets ({tomaquet}) i talla’ls a daus. Escorre la tonyina ({tonyina}) i el blat de moro ' +
          '({blat-de-moro}).',
      ),
      p(
        'Barreja l’arròs amb el tomàquet, la tonyina i el blat de moro, amaneix-ho amb l’oli ({oli-oliva}) i el vinagre ({vinagre}), tasta-ho ' +
          'i posa-hi els ous a sobre.',
      ),
    ],
  },
  {
    id: 'patates-microones',
    nom: 'Patates al microones amb formatge i pernil',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['carn'],
    ingredients: [
      l('patata', 1200),
      l('pernil-dolc', 150),
      l('formatge-ratllat', 150),
      l('mantega', 30),
      l('sal', 4),
      l('pebre-negre', 1),
    ],
    passos: [
      p(
        'Tria patates ({patata}) d’una mida semblant, d’uns 200 g, perquè es facin alhora. Renta-les bé (es mengen amb pell) i punxa-les per tot arreu ' +
          'amb una forquilla: si no, poden rebentar.',
      ),
      c(
        'Posa-les al plat del microones, separades, i cou-les a la potència màxima; gira-les a la meitat del temps. Són fetes quan un ganivet entra ' +
          'fins al centre sense resistència. Si no ho són, afegeix-hi minuts d’un en un.',
        12,
        'Patates al microones',
      ),
      p('Mentrestant, talla el pernil ({pernil-dolc}) a tires.'),
      p(
        'Fes a cada patata un tall en creu per dalt i prem-ne els extrems perquè s’obri. Posa-hi un tros de mantega ({mantega}), la sal ({sal}) ' +
          'i el pebre ({pebre-negre}), i esclafa una mica la polpa amb una forquilla perquè s’hi barregi.',
      ),
      c(
        'Reparteix-hi el pernil i el formatge ({formatge-ratllat}) per sobre i torna-les al microones fins que el formatge es fongui. ' +
          'Si les vols gratinades, posa-les 5 minuts sota el gratinador del forn.',
        1.5,
        'Fondre el formatge',
      ),
    ],
  },
  {
    id: 'fajitas-pollastre',
    nom: 'Fajitas de pollastre i pebrots',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['carn', 'verdura'],
    ingredients: [
      l('tortilla-blat', 8),
      l('pit-pollastre', 600),
      l('pebrot-vermell', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('ceba', 1, 'u'),
      l('llimona', 1, 'u'),
      l('all', 1),
      l('comi', 2),
      l('pebre-vermell', 3),
      l('orenga', 1),
      l('oli-oliva', 30),
      l('sal', 5),
    ],
    passos: [
      p(
        'Talla el pollastre ({pit-pollastre}) a tires d’1 cm. Posa-les en un bol amb l’all ({all}) ratllat, el comí ({comi}), el pebre vermell ' +
          '({pebre-vermell}), l’orenga ({orenga}), la sal ({sal}), el suc de mitja llimona ({llimona:1/2}) i la meitat de l’oli ({oli-oliva:1/2}). ' +
          'Remena i deixa-ho reposar mentre talles les verdures.',
      ),
      p(
        'Treu les llavors i els filaments blancs dels pebrots ({pebrot-vermell}, {pebrot-verd}) i talla’ls a tires d’1 cm. Pela la ceba ({ceba}) ' +
          'i talla-la a tires.',
      ),
      c(
        'Escalfa una paella gran a foc fort amb la resta de l’oli ({oli-oliva:1/2}). Salteja-hi els pebrots i la ceba, remenant de tant en tant, ' +
          'fins que tinguin taques torrades però encara siguin una mica cruixents. Treu-los a un plat.',
        6,
        'Pebrots i ceba',
      ),
      c(
        'A la mateixa paella, sempre a foc fort, posa el pollastre en una sola capa i deixa’l un minut sense tocar; després remena fins que sigui ' +
          'daurat per fora i blanc per dins.',
        6,
        'Pollastre',
      ),
      p('Torna-hi els pebrots i la ceba i remena-ho un minut perquè s’escalfi tot.'),
      p(escalfarTortilles),
      p(
        'Porta-ho a taula: cadascú omple la seva tortilla i la plega. Talla l’altra meitat de la llimona ({llimona:1/2}) a gallons per qui en vulgui.',
      ),
    ],
  },
  {
    id: 'tacos-carn-picada',
    nom: 'Tacos de carn picada',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['carn'],
    ingredients: [
      l('tortilla-blat', 8),
      l('carn-picada', 500),
      l('ceba', 1, 'u'),
      l('all', 1),
      l('tomaquet-fregit', 150),
      l('comi', 2),
      l('pebre-vermell', 2),
      l('orenga', 1),
      l('enciam', 1),
      l('tomaquet', 2, 'u'),
      l('formatge-ratllat', 100),
      l('oli-oliva', 15),
      l('sal', 5),
    ],
    passos: [
      p('Pela la ceba ({ceba}) i l’all ({all}) i pica’ls ben petits.'),
      c(
        'Escalfa una paella a foc mitjà amb l’oli ({oli-oliva}) i cou-hi la ceba, remenant, fins que sigui tova i transparent.',
        5,
        'Ofegar la ceba',
      ),
      c(
        'Puja el foc a fort, afegeix-hi la carn ({carn-picada}) i desfés-la amb una cullera de fusta fins que quedi a trossets. Cou-la fins que ' +
          'no quedi res de rosat i comenci a daurar-se.',
        6,
        'Carn picada',
      ),
      c(
        'Afegeix-hi l’all, el comí ({comi}), el pebre vermell ({pebre-vermell}), l’orenga ({orenga}) i la sal ({sal}), remena 30 segons i afegeix-hi ' +
          'el tomàquet fregit ({tomaquet-fregit}). Cou-ho fins que la salsa s’espesseixi i no quedi líquid al fons de la paella.',
        3,
        'Espessir la carn',
      ),
      p(
        'Mentrestant, renta l’enciam ({enciam}) i talla’l a tires fines, i talla els tomàquets ({tomaquet}) a daus. Posa-ho en bols, amb el formatge ' +
          '({formatge-ratllat}).',
      ),
      p(escalfarTortilles),
      p('A taula, cadascú posa a la tortilla carn, enciam, tomàquet i formatge, i la plega per la meitat.'),
    ],
  },
  {
    id: 'nachos-forn',
    nom: 'Nachos al forn amb carn, formatge i guacamole',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['carn'],
    ingredients: [
      l('nachos', 300),
      l('carn-picada', 400),
      l('ceba', 1, 'u'),
      l('tomaquet-fregit', 150),
      l('comi', 2),
      l('pebre-vermell', 2),
      l('mozzarella', 200),
      l('alvocat', 2, 'u'),
      l('tomaquet', 1, 'u'),
      l('llimona', 1, 'u'),
      l('oli-oliva', 10),
      l('sal', 5),
    ],
    passos: [
      p(
        'Encén el forn a 200 °C. Pela la ceba ({ceba}) i pica-la ben petita. Separa’n un quart ({ceba:1/4}) per al guacamole; la resta ' +
          '({ceba:3/4}) és per a la carn.',
      ),
      c('Escalfa una paella a foc mitjà amb l’oli ({oli-oliva}) i cou-hi la ceba de la carn fins que sigui transparent.', 4, 'Ofegar la ceba'),
      c(
        'Puja el foc a fort, afegeix-hi la carn ({carn-picada}) i desfés-la amb una cullera de fusta. Cou-la fins que no quedi res de rosat.',
        6,
        'Carn picada',
      ),
      p(
        'Afegeix-hi el comí ({comi}), el pebre vermell ({pebre-vermell}), la meitat de la sal ({sal:1/2}) i el tomàquet fregit ({tomaquet-fregit}), ' +
          'i cou-ho un parell de minuts, remenant, fins que no quedi líquid.',
      ),
      p(
        'Escampa els nachos ({nachos}) en una safata de forn, en una capa (es poden trepitjar una mica). Reparteix-hi la carn per sobre ' +
          'i, al damunt, el formatge ({mozzarella}).',
      ),
      c(
        'Enforna-ho a la part de dalt fins que el formatge sigui fos i faci bombolles. Vigila: les puntes dels nachos es cremen de pressa.',
        5,
        'Nachos al forn',
      ),
      p(
        'Guacamole, mentre és al forn (fes-lo a l’últim moment, que s’enfosqueix): obre els alvocats ({alvocat}), treu-ne el pinyol i posa’n la polpa ' +
          'en un bol. Aixafa-la amb una forquilla i afegeix-hi la ceba reservada, el tomàquet ({tomaquet}) a daus petits sense llavors, el suc de la ' +
          'llimona ({llimona}) a poc a poc i la resta de la sal ({sal:1/2}). Tasta’l.',
      ),
      p('Porta la safata a taula amb el guacamole al mig perquè cadascú en prengui.'),
    ],
  },
  {
    id: 'piadines-pernil',
    nom: 'Piadines de pernil, formatge i ruca',
    racions: 4,
    tempsMinuts: 15,
    etiquetes: ['carn'],
    ingredients: [l('piadina', 4), l('pernil-dolc', 200), l('mozzarella', 200), l('ruca', 50), l('oli-oliva', 10)],
    passos: [
      p(
        'Posa les piadines ({piadina}) sobre el marbre. A la meitat de cada una, reparteix-hi el formatge ({mozzarella}) i el pernil ({pernil-dolc}).',
      ),
      c(
        'Escalfa una paella ampla a foc mitjà, sense oli. Posa-hi una piadina oberta, amb el farciment cap amunt, fins que el formatge comenci a fondre’s ' +
          'i la base es torri una mica.',
        2,
        'Piadina: fondre',
      ),
      p(
        'Rega la ruca ({ruca}) amb l’oli ({oli-oliva}). Posa’n un grapat sobre el formatge, plega la piadina per la meitat i prem-la amb l’espàtula.',
      ),
      c(
        'Gira-la i deixa-la fins que l’altre costat també sigui torrat. Treu-la, talla-la en triangles i fes les altres. Amb dues paelles, en fas dues alhora.',
        1,
        'Piadina: segon costat',
      ),
    ],
  },
  {
    id: 'torrades-alvocat-ou',
    nom: 'Torrades amb alvocat i ou',
    racions: 4,
    tempsMinuts: 15,
    etiquetes: ['ou', 'vegetaria'],
    ingredients: [
      l('pa-pages', 400),
      l('alvocat', 3, 'u'),
      l('ou', 8),
      l('llimona', 1, 'u'),
      l('oli-oliva', 50),
      l('sal', 4),
      l('pebre-negre', 1),
    ],
    passos: [
      c(
        'Talla el pa ({pa-pages}) en 8 llesques d’1,5 cm i torra-les a la torradora o sota el gratinador del forn, fins que siguin daurades i cruixents ' +
          'per fora.',
        3,
        'Torrar el pa',
      ),
      p(
        'Obre els alvocats ({alvocat}), treu-ne el pinyol i posa’n la polpa en un bol. Afegeix-hi el suc de la llimona ({llimona}), la meitat de la sal ' +
          '({sal:1/2}) i el pebre ({pebre-negre}), i aixafa-ho amb una forquilla deixant-hi trossets.',
      ),
      c(
        'Ous ferrats, de 4 en 4: escalfa una paella antiadherent a foc mitjà amb la meitat de l’oli ({oli-oliva:1/2}). Trenca 4 ous ({ou}) en un bol ' +
          'i aboca’ls a la paella amb compte. Amb una cullera, tira oli calent per sobre de les clares. Són fets quan la clara és blanca i quallada ' +
          'del tot i el rovell encara és líquid. Repeteix-ho amb la resta de l’oli ({oli-oliva:1/2}) i els altres ous.',
        3,
        'Ous ferrats',
      ),
      p('Unta cada torrada amb l’alvocat, posa-hi un ou a sobre i un pessic de la resta de la sal ({sal:1/2}). Serveix-les de seguida.'),
    ],
  },
  {
    id: 'amanida-cigrons-tonyina',
    nom: 'Amanida de cigrons amb tonyina i ou dur',
    racions: 4,
    tempsMinuts: 15,
    etiquetes: ['llegums', 'peix', 'ou'],
    ingredients: [
      l('cigrons', 800),
      l('tonyina', 160),
      l('ou', 4),
      l('tomaquet', 2, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('ceba', 75),
      l('julivert', 10),
      l('oli-oliva', 50),
      l('vinagre', 20),
      l('sal', 3),
    ],
    passos: [
      c(
        'Posa els ous ({ou}) en un cassó amb aigua freda que els cobreixi i porta’ls a bullir. Engega el cronòmetre quan l’aigua arrenqui el bull. ' +
          'En acabar, passa’ls a un bol amb aigua freda.',
        10,
        'Ous durs',
      ),
      p(
        'Mentrestant, escorre els cigrons ({cigrons}) i esbandeix-los amb aigua freda en un colador fins que no facin escuma: el líquid del pot ' +
          'té gust de conserva.',
      ),
      p(
        'Renta els tomàquets ({tomaquet}) i el pebrot ({pebrot-verd}) i talla’ls a daus petits. Pela la ceba ({ceba}) i pica-la fina. ' +
          'Pica el julivert ({julivert}). Escorre la tonyina ({tonyina}).',
      ),
      p(
        'Amaniment: en un got, desfés la sal ({sal}) amb el vinagre ({vinagre}) i bat-hi l’oli ({oli-oliva}) amb una forquilla.',
      ),
      p(
        'Barreja els cigrons amb les verdures, la tonyina i l’amaniment. Pela els ous, talla’ls a quarts i posa’ls a sobre. ' +
          'Si tens temps, deixa-la reposar uns minuts perquè els cigrons agafin gust.',
      ),
    ],
  },
  {
    id: 'saltejat-porc-soja',
    nom: 'Saltejat de porc amb verdures i salsa de soja',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['carn', 'verdura'],
    ingredients: [
      l('llom', 500),
      l('pastanaga', 2, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('carbasso', 1, 'u'),
      l('ceba', 1, 'u'),
      l('all', 2),
      l('salsa-soja', 60),
      l('farina', 10),
      l('sucre', 5),
      l('oli-girasol', 30),
    ],
    passos: [
      p(
        'Talla el llom ({llom}) a tires fines, d’uns 5 mm. Posa-les en un bol amb la meitat de la soja ({salsa-soja:1/2}) i la farina ({farina}) ' +
          'i remena: la farina farà que la salsa s’hi enganxi.',
      ),
      p(
        'Pela les pastanagues ({pastanaga}) i talla-les a bastonets prims (són les que triguen més a fer-se). Talla el pebrot ({pebrot-vermell}) i el ' +
          'carbassó ({carbasso}) a bastonets semblants, i la ceba ({ceba}) a tires. Pela els alls ({all}) i talla’ls a làmines.',
      ),
      c(
        'Escalfa una paella gran o un wok a foc màxim amb la meitat de l’oli ({oli-girasol:1/2}). Posa-hi la carn en una sola capa, deixa-la un minut ' +
          'sense tocar i després remena fins que sigui daurada. Treu-la a un plat.',
        3,
        'Saltejar la carn',
      ),
      c(
        'Posa-hi la resta de l’oli ({oli-girasol:1/2}), la pastanaga i la ceba, i salteja-ho 2 minuts; afegeix-hi el pebrot i el carbassó i ' +
          'continua remenant. Les verdures han de quedar fetes però encara cruixents.',
        5,
        'Saltejar les verdures',
      ),
      p(
        'Afegeix-hi l’all i remena 30 segons. Torna-hi la carn, la resta de la soja ({salsa-soja:1/2}) i el sucre ({sucre}), i remena un minut ' +
          'fins que la salsa ho embolcalli tot. Serveix-ho calent.',
      ),
    ],
  },
  {
    id: 'noodles-pollastre',
    nom: 'Noodles amb pollastre i verdures',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['pasta', 'carn'],
    ingredients: [
      l('noodles', 400),
      l('pit-pollastre', 400),
      l('pastanaga', 1, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('ceba', 1, 'u'),
      l('all', 2),
      l('salsa-soja', 60),
      l('oli-girasol', 30),
    ],
    passos: [
      c(
        'Posa a bullir aigua en una olla. Quan bulli, cou-hi els noodles ({noodles}) el temps del paquet (si porten sobres de condiment, no els facis servir). ' +
          'Escorre’ls, passa’ls per aigua freda i barreja’ls amb un raig de l’oli ({oli-girasol:1/3}) perquè no s’enganxin.',
        4,
        'Bullir els noodles',
      ),
      p(
        'Talla el pollastre ({pit-pollastre}) a tires fines. Pela la pastanaga ({pastanaga}) i talla-la a bastonets prims, el pebrot ({pebrot-vermell}) ' +
          'a tires i la ceba ({ceba}) a tires. Pela els alls ({all}) i talla’ls a làmines.',
      ),
      c(
        'Escalfa un wok o una paella gran a foc fort amb un altre terç de l’oli ({oli-girasol:1/3}) i salteja-hi el pollastre fins que sigui daurat ' +
          'i blanc per dins. Treu-lo a un plat.',
        5,
        'Pollastre',
      ),
      c(
        'Posa-hi la resta de l’oli ({oli-girasol:1/3}) i salteja la pastanaga, el pebrot, la ceba i l’all, remenant, fins que siguin tendres però cruixents.',
        4,
        'Verdures',
      ),
      p(
        'Torna-hi el pollastre i els noodles, aboca-hi la salsa de soja ({salsa-soja}) i remena amb dues pinces o dues forquilles un parell de minuts, ' +
          'fins que tot sigui calent i ben barrejat.',
      ),
    ],
  },
  {
    id: 'pesols-pernil-ou',
    nom: 'Pèsols saltejats amb pernil i ou',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['verdura', 'carn', 'ou'],
    ingredients: [
      l('pesols', 800),
      l('taquets-pernil', 130),
      l('ceba', 1, 'u'),
      l('all', 1),
      l('ou', 4),
      l('oli-oliva', 30),
      l('sal', 10),
    ],
    passos: [
      c(
        'Posa a bullir aigua en una olla amb la sal ({sal}). Quan bulli, tira-hi els pèsols ({pesols}) congelats mateix i cou-los fins que siguin tendres. ' +
          'Escorre’ls.',
        4,
        'Bullir els pèsols',
      ),
      c(
        'Mentrestant, pela la ceba ({ceba}) i l’all ({all}) i pica’ls petits. Cou-los en una paella ampla a foc mitjà amb l’oli ({oli-oliva}) fins que ' +
          'la ceba sigui tova i transparent. Afegeix-hi el pernil ({taquets-pernil}) i remena un minut.',
        6,
        'Ofegar la ceba',
      ),
      p('Afegeix-hi els pèsols i salteja-ho tot un parell de minuts.'),
      c(
        'Fes 4 clots entre els pèsols i trenca un ou ({ou}) a cada un. Tapa la paella i deixa-ho a foc baix fins que la clara sigui blanca ' +
          'i quallada i el rovell encara líquid.',
        4,
        'Quallar els ous',
      ),
    ],
  },
  {
    id: 'creps-salades',
    nom: 'Creps salades de pernil, formatge i xampinyons',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['carn', 'ou'],
    ingredients: [
      l('farina', 200),
      l('llet', 450),
      l('ou', 3),
      l('mantega', 40),
      l('sal', 3),
      l('pernil-dolc', 200),
      l('formatge-ratllat', 150),
      l('xampinyons', 250),
      l('oli-oliva', 15),
    ],
    passos: [
      p(
        'Massa: en un bol, posa la farina ({farina}) i la sal ({sal}) i fes-hi un clot al centre. Trenca-hi els ous ({ou}) i, batent amb una vareta, ' +
          'aboca-hi la llet ({llet}) a poc a poc, de manera que sempre sigui una pasta llisa i sense grumolls. Fon la mantega ({mantega}) i afegeix-ne la ' +
          'meitat ({mantega:1/2}) a la massa. Ha de quedar líquida com la nata.',
      ),
      c(
        'Farciment: escalfa una paella a foc fort amb l’oli ({oli-oliva}) i salteja-hi els xampinyons ({xampinyons}) fins que s’evapori l’aigua que deixen ' +
          'anar i es daurin. Treu-los a un plat. Talla el pernil ({pernil-dolc}) a tires.',
        7,
        'Xampinyons',
      ),
      c(
        'Escalfa una paella antiadherent de 20-24 cm a foc mitjà i unta-la amb una mica de la resta de la mantega ({mantega:1/2}) amb paper de cuina. ' +
          'Aboca-hi un cullerot de massa i gira la paella de seguida perquè cobreixi tot el fons en una capa fina. Quan les vores es desenganxin i per sota ' +
          'sigui daurada, gira-la amb una espàtula. El cronòmetre és per al primer costat; la primera crep sol sortir malament, és normal.',
        1,
        'Crep: primer costat',
      ),
      p(
        'Amb la crep encara a la paella, posa-hi a sobre una mica del formatge ({formatge-ratllat}), el pernil i els xampinyons, plega-la en quatre ' +
          'i deixa-la un minut, fins que el formatge es fongui. Passa-la al plat i fes les altres, untant la paella cada dues creps.',
      ),
    ],
  },
];
