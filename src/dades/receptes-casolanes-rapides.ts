import type { Pas, Recepta } from '../domini';
import { c, l, p } from './ajudants';

// Cuina ràpida i bàsica de casa: plats senzills de cada dia, amb productes de pot o congelats quan toca
// (petició de Roger, octubre de 2026). Quantitats per a 4 racions normals.

/** Bullir pasta seca: 1 litre d'aigua per cada 100 g, amb la sal de la recepta. */
const bullirPasta = (pasta: string, minuts: number): Pas[] => [
  p(
    `Posa una olla gran a foc fort amb aigua: 1 litre per cada 100 g de pasta. Quan bulli amb força, afegeix-hi la sal ({sal}) i la pasta ({${pasta}}). ` +
      'Remena-la el primer minut perquè no s’enganxi.',
  ),
  c(
    'Cou la pasta, sense tapar i remenant de tant en tant, el temps que diu el paquet (normalment uns 10 minuts). Ha de quedar al dent: tova però amb una mica de resistència al mig.',
    minuts,
    'Coure la pasta',
  ),
];

/** Patates fregides de bastó, a la paella (dues fregides perquè quedin toves per dins i cruixents per fora). */
const fregirPatates = (): Pas[] => [
  p('Pela les patates ({patata}) i talla-les a bastons d’1 cm de gruix, tots iguals perquè es fregeixin igual.'),
  c(
    'Posa-les en un bol amb aigua freda perquè deixin anar el midó (així queden més cruixents). Després escorre-les i asseca-les molt bé amb un drap net: ' +
      'l’aigua fa esquitxar l’oli.',
    10,
    'Remull de les patates',
  ),
  p(
    'Posa oli de gira-sol en una paella fonda: ha de fer uns 3 cm de fondària (la recepta compta {oli-girasol}, que és el que absorbeixen les patates i els ous; ' +
      'la resta d’oli es pot colar i reaprofitar). Escalfa’l a foc mitjà: si hi poses un bastó de patata, ha de bombollejar suaument.',
  ),
  c(
    'Primera fregida: fregeix les patates en tandes (que no se n’amunteguin) fins que siguin toves però sense agafar color. Treu-les amb una escumadora. ' +
      'El cronòmetre és per a cada tanda.',
    6,
    'Primera fregida',
  ),
  c(
    'Segona fregida: puja el foc a fort (un bastó ha de bombollejar amb força de seguida) i torna a fregir-les en tandes fins que siguin daurades i cruixents. ' +
      'Deixa-les sobre paper de cuina i sala-les de seguida. El cronòmetre és per a cada tanda.',
    3,
    'Segona fregida',
  ),
];

/** Ous ferrats d'un en un, a l'oli de la paella (calent però sense fumejar). */
const fregirOus = (ous: string, oli: string): Pas =>
  p(
    `Ous ferrats: deixa uns 2 dits d’oli a la paella ({${oli}} compta el que absorbeixen) a foc mitjà-fort. Trenca cada ou ({${ous}}) primer en un bol ` +
      '(així no cau cap tros de closca a l’oli) i deixa’l lliscar a la paella. Amb una cullera, tira oli calent per sobre de la clara fins que sigui blanca ' +
      'i amb puntes daurades, i el rovell encara sigui tou: uns 2 minuts. Treu-lo amb l’escumadora, sala’l amb un pessic de sal i fes el següent.',
  );

export const receptesCasolanesRapides: Recepta[] = [
  {
    id: 'arros-croquetes-maionesa',
    nom: 'Arròs blanc amb croquetes i maionesa',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['arros', 'carn'],
    ingredients: [
      l('arros', 320),
      l('all', 1),
      l('oli-oliva', 15),
      l('sal', 5),
      l('croquetes-congelades', 600),
      l('oli-girasol', 60),
      l('maionesa', 120),
    ],
    passos: [
      p(
        'Posa un cassó a foc fort amb el doble d’aigua que d’arròs i la sal ({sal}). En una altra olla, daura l’all ({all}) xafat amb l’oli d’oliva ({oli-oliva}) ' +
          'a foc mitjà i afegeix-hi l’arròs ({arros}). Remena’l un minut perquè es nacri.',
      ),
      c(
        'Quan l’aigua bulli, aboca-la sobre l’arròs, remena una vegada i deixa-ho coure a foc mitjà-baix, sense remenar, fins que l’arròs s’hagi begut l’aigua. ' +
          'Tapa’l, aparta’l del foc i deixa’l reposar 5 minuts.',
        15,
        'Coure l’arròs',
      ),
      p(
        'Mentrestant, posa oli de gira-sol en una paella fonda: que cobreixi les croquetes fins a la meitat (la recepta compta {oli-girasol}, que és el que absorbeixen). ' +
          'Escalfa’l a foc mitjà-fort: un tros de pa hi ha de bombollejar amb força de seguida.',
      ),
      c(
        'Fregeix les croquetes ({croquetes-congelades}) directament congelades, en tandes de 5 o 6 perquè l’oli no es refredi i no es trenquin. Gira-les a mitja cocció ' +
          'fins que siguin ben daurades per tots els costats i deixa-les sobre paper de cuina. El cronòmetre és per a cada tanda. ' +
          'Amb fregidora d’aire: 12 minuts a 200 °C, ruixades amb una mica d’oli i girant-les a la meitat.',
        4,
        'Fregir les croquetes',
      ),
      p('Serveix l’arròs amb les croquetes al costat i una bona cullerada de maionesa ({maionesa}) a cada plat.'),
    ],
  },
  {
    id: 'espaguetis-tomaquet-ou',
    nom: 'Espaguetis amb tomàquet fregit i ou ferrat',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['pasta', 'ou', 'vegetaria'],
    ingredients: [l('espaguetis', 400), l('sal', 20), l('tomaquet-fregit', 400), l('formatge-ratllat', 40), l('ou', 4), l('oli-oliva', 50)],
    passos: [
      ...bullirPasta('espaguetis', 10),
      p(
        'Mentre es cou la pasta, escalfa el tomàquet fregit de pot ({tomaquet-fregit}), tipus Solís, en un cassó a foc baix, remenant de tant en tant perquè no s’enganxi.',
      ),
      p('Escorre els espaguetis, torna’ls a l’olla, aboca-hi el tomàquet calent i barreja-ho bé. Reparteix-los als plats.'),
      fregirOus('ou', 'oli-oliva'),
      p('Posa un ou ferrat sobre cada plat d’espaguetis i el formatge ratllat ({formatge-ratllat}) per sobre. Trencar el rovell i barrejar-lo amb la pasta és la gràcia.'),
    ],
  },
  {
    id: 'amanida-ceba-tomaquet',
    nom: 'Amanida de tomàquet i ceba amb parmesà',
    racions: 4,
    tempsMinuts: 10,
    etiquetes: [],
    tipus: 'acompanyament',
    ingredients: [l('tomaquet', 4, 'u'), l('ceba', 75), l('parmesa', 40), l('oli-oliva', 40), l('vinagre', 10), l('orenga', 1), l('sal', 3)],
    passos: [
      p(
        'Renta els tomàquets ({tomaquet}) i talla’ls a rodanxes o a gallons. Talla la ceba ({ceba}) a làmines ben fines; si pica molt, deixa-la 5 minuts en aigua freda ' +
          'i escorre-la.',
      ),
      p(
        'Posa el tomàquet en una plata, la ceba per sobre i amaneix-ho amb la sal ({sal}), l’orenga ({orenga}), el vinagre ({vinagre}) i l’oli ({oli-oliva}). ' +
          'Acaba-ho amb el parmesà ({parmesa}) per sobre just abans de servir.',
      ),
    ],
  },
  {
    id: 'macarrons-tonyina-maionesa',
    nom: 'Macarrons amb tonyina i maionesa',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['pasta', 'peix'],
    ingredients: [l('macarrons', 400), l('sal', 20), l('tonyina', 240), l('maionesa', 150), l('tomaquet-fregit', 100)],
    passos: [
      ...bullirPasta('macarrons', 11),
      p('Escorre els macarrons i passa’ls per aigua freda perquè es refredin i no s’enganxin. Escorre’ls molt bé.'),
      p(
        'En un bol gran, barreja la tonyina ({tonyina}) escorreguda i esmicolada, la maionesa ({maionesa}) i el tomàquet fregit ({tomaquet-fregit}). ' +
          'Afegeix-hi els macarrons i remena fins que quedin ben amarats.',
      ),
      p('Es pot menjar tebi o fred: a la nevera aguanta fins a l’endemà, tapat.'),
    ],
  },
  {
    id: 'patates-fregides-ou',
    nom: 'Patates fregides amb ou ferrat',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['ou', 'vegetaria'],
    ingredients: [l('patata', 1000), l('oli-girasol', 200), l('ou', 8), l('sal', 5)],
    passos: [
      ...fregirPatates(),
      p('Reparteix les patates als plats (o deixa-les a la boca del forn apagat perquè no es refredin) i sala-les amb la sal ({sal}).'),
      fregirOus('ou', 'oli-girasol'),
      p('Posa dos ous a cada plat sobre les patates. Es mengen sucant les patates al rovell.'),
    ],
  },
  {
    id: 'hamburguesa-plat-ou',
    nom: 'Hamburguesa al plat amb ou ferrat i patates',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['carn'],
    ingredients: [l('patata', 800), l('oli-girasol', 180), l('hamburguesa', 4, 'u'), l('sal', 5), l('ou', 4), l('ketchup', 60)],
    passos: [
      ...fregirPatates(),
      c(
        'Escalfa una paella o planxa a foc fort, sense oli. Sala les hamburgueses ({hamburguesa}) i cou-les fins que siguin ben daurades per fora i fetes per dins ' +
          '(si en punxes una, el suc ha de sortir clar). El cronòmetre és per a cada costat.',
        4,
        'Coure les hamburgueses',
      ),
      fregirOus('ou', 'oli-girasol'),
      p('Serveix a cada plat una hamburguesa amb un ou ferrat a sobre, les patates al costat amb la sal ({sal}) i el ketchup ({ketchup}).'),
    ],
  },
  {
    id: 'hamburgueses-roger',
    nom: 'Hamburgueses d’en Roger',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['patates-fregides', 'patates-adobades', 'arros-blanc', 'pure-patata', 'amanida', 'amanida-ceba-tomaquet'],
    ingredients: [
      l('carn-picada', 500),
      l('all', 1),
      l('julivert', 5),
      l('pebre-negre', 1),
      l('sal', 5),
      l('ou', 1),
      l('pa-torrat', 30),
      l('formatge-llesques', 80),
    ],
    passos: [
      p('Pela l’all ({all}) i tritura’l (amb un trinxador, ratllat o xafat al morter fins que sigui una pasta). Pica el julivert ({julivert}) ben fi.'),
      p(
        'Posa la carn picada ({carn-picada}) en un bol gran amb l’all, el julivert, la sal ({sal}) i el pebre molt ({pebre-negre}). Amassa-ho amb les mans ' +
          'fins que estigui tot ben repartit.',
      ),
      p('Bat l’ou ({ou}) en un plat, afegeix-lo a la carn i torna-la a amassar fins que l’ou quedi ben barrejat.'),
      p(
        'Esmicola el pa torrat ({pa-torrat}) amb les mans o amb un corró, dins d’una bossa, i afegeix-lo a poc a poc a la carn mentre l’amasses: ' +
          'en tens prou quan la massa deixa d’enganxar-se a les mans i aguanta la forma.',
      ),
      p(
        'Divideix la carn en 4 boles iguals i aixafa-les entre les mans fins a fer hamburgueses d’uns 2 cm de gruix. Fes-hi un petit clot al mig amb el polze: ' +
          'així no s’inflen en coure’s.',
      ),
      p(
        'Escalfa la planxa, la paella o la barbacoa amb un fil d’oli. A foc baix si les vols ben fetes (es couen per dins sense cremar-se per fora) ' +
          'o a foc mitjà si les vols més crues per dins. Com més gruixudes, més temps necessiten.',
      ),
      c(
        'Posa-hi les hamburgueses i no les toquis fins que siguin daurades per sota; llavors gira-les una sola vegada amb la paleta. Són uns 6-8 minuts per banda: ' +
          'el cronòmetre és per a cada banda.',
        7,
        'Coure cada banda',
      ),
      p(
        'Si vols, l’últim minut posa una llesca de formatge ({formatge-llesques}) sobre cada hamburguesa i tapa-la (amb una tapa o un bol) perquè es fongui. ' +
          'Serveix-les amb l’acompanyament: patates fregides, adobades, arròs, puré o amanida.',
      ),
    ],
  },
  {
    id: 'macarrons-xorico',
    nom: 'Macarrons amb xoriço i tomàquet',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['pasta', 'carn'],
    ingredients: [
      l('macarrons', 400),
      l('sal', 20),
      l('ceba', 1, 'u'),
      l('oli-oliva', 20),
      l('xorico', 150),
      l('tomaquet-fregit', 400),
      l('formatge-ratllat', 80),
    ],
    passos: [
      c(
        'Pica la ceba ({ceba}) petita i cou-la en una paella ampla a foc mitjà amb l’oli ({oli-oliva}), remenant de tant en tant, fins que sigui tova i transparent.',
        8,
        'Ofegar la ceba',
      ),
      ...bullirPasta('macarrons', 11),
      c(
        'Mentre es cou la pasta, treu la pell al xoriço ({xorico}), talla’l a daus petits i afegeix-lo a la ceba. Cou-lo fins que deixi anar el greix vermell. ' +
          'Afegeix-hi el tomàquet fregit ({tomaquet-fregit}) i deixa-ho fer a foc baix.',
        5,
        'Xoriço i tomàquet',
      ),
      p(
        'Escorre els macarrons i barreja’ls amb la salsa a la paella. Serveix-los amb el formatge ratllat ({formatge-ratllat}) per sobre ' +
          '(si tens forn, 5 minuts de gratinar els deixa encara millor).',
      ),
    ],
  },
  {
    id: 'arros-tonyina-tomaquet',
    nom: 'Arròs amb tonyina i tomàquet',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['arros', 'peix'],
    ingredients: [l('arros', 320), l('all', 1), l('oli-oliva', 15), l('sal', 5), l('tomaquet-fregit', 300), l('tonyina', 240)],
    passos: [
      p(
        'Posa un cassó a foc fort amb el doble d’aigua que d’arròs i la sal ({sal}). En una altra olla, daura l’all ({all}) xafat amb l’oli ({oli-oliva}) a foc mitjà ' +
          'i afegeix-hi l’arròs ({arros}). Remena’l un minut.',
      ),
      c(
        'Quan l’aigua bulli, aboca-la sobre l’arròs, remena una vegada i deixa-ho coure a foc mitjà-baix, sense remenar, fins que l’arròs s’hagi begut l’aigua.',
        15,
        'Coure l’arròs',
      ),
      p(
        'Mentrestant, escalfa el tomàquet fregit ({tomaquet-fregit}) en un cassó i afegeix-hi la tonyina ({tonyina}) escorreguda i esmicolada. ' +
          'Barreja-la amb l’arròs (o posa-la per sobre a cada plat) i serveix-ho calent.',
      ),
    ],
  },
  {
    id: 'truita-francesa-tomaquet',
    nom: 'Truita a la francesa amb tomàquet amanit',
    racions: 4,
    tempsMinuts: 15,
    etiquetes: ['ou', 'vegetaria'],
    ingredients: [l('tomaquet', 4, 'u'), l('orenga', 1), l('oli-oliva', 40), l('sal', 4), l('ou', 8), l('pa-pages', 300)],
    passos: [
      p(
        'Talla els tomàquets ({tomaquet}) a rodanxes, posa’ls en una plata i amaneix-los amb un pessic de sal, l’orenga ({orenga}) i la meitat de l’oli ({oli-oliva:1/2}).',
      ),
      p('Bat els ous ({ou}) de dos en dos en un plat fondo amb un pessic de sal (la sal de la recepta, {sal}, és per a tot): cada truita és de dos ous.'),
      c(
        'Escalfa una paella petita a foc mitjà amb una mica de la resta de l’oli. Aboca-hi els ous batuts, deixa’ls quallar un moment i, quan la base sigui feta ' +
          'però a sobre encara siguin tendres, plega la truita en tres amb la paleta. Passa-la al plat i fes la següent. El cronòmetre és per a cada truita.',
        1.5,
        'Fer la truita',
      ),
      p('Serveix cada truita amb el tomàquet i el pa ({pa-pages}).'),
    ],
  },
  {
    id: 'lluc-arrebossat',
    nom: 'Lluç arrebossat',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['peix'],
    ambAcompanyament: true,
    acompanyaments: ['amanida', 'amanida-ceba-tomaquet', 'patates-fregides', 'pure-patata', 'arros-blanc'],
    ingredients: [l('lluc', 600), l('sal', 4), l('farina', 60), l('ou', 2), l('oli-girasol', 100), l('llimona', 1, 'u')],
    passos: [
      p(
        'Si el lluç ({lluc}) és congelat, deixa’l descongelar a la nevera des de la nit abans. Asseca’l bé amb paper de cuina, treu-ne les espines que trobis ' +
          'i talla’l a trossos d’una mida semblant. Sala’l amb la sal ({sal}).',
      ),
      p('Posa la farina ({farina}) en un plat i bat els ous ({ou}) en un altre. Passa cada tros de lluç per farina (espolsa la que sobri) i després per l’ou.'),
      c(
        'Escalfa un dit d’oli de gira-sol en una paella a foc mitjà-fort (la recepta compta {oli-girasol}, el que s’absorbeix). Fregeix el lluç en tandes, ' +
          'girant-lo una vegada, fins que l’arrebossat sigui daurat. Deixa’l sobre paper de cuina. El cronòmetre és per a cada tanda.',
        4,
        'Fregir el lluç',
      ),
      p('Serveix-lo calent amb la llimona ({llimona}) tallada a gallons per sucar-hi.'),
    ],
  },
  {
    id: 'pa-tomaquet-pernil-formatge',
    nom: 'Pa amb tomàquet amb pernil i formatge',
    racions: 4,
    tempsMinuts: 10,
    etiquetes: ['carn'],
    ingredients: [l('pa-pages', 400), l('tomaquet', 3, 'u'), l('oli-oliva', 30), l('sal', 2), l('pernil-serra', 200), l('formatge-llesques', 150)],
    passos: [
      p('Talla el pa ({pa-pages}) a llesques i, si vols, torra-les una mica a la torradora o a la paella.'),
      p(
        'Talla els tomàquets ({tomaquet}) per la meitat i refrega’ls sobre el pa fins que només en quedi la pell. Posa-hi la sal ({sal}) i un bon raig d’oli ({oli-oliva}).',
      ),
      p('Serveix-ho amb el pernil ({pernil-serra}) i el formatge ({formatge-llesques}) en una plata perquè cadascú es faci les llesques.'),
    ],
  },
];
