import type { Recepta } from '../domini';
import { c, l, p } from './ajudants';

// Cuina tradicional catalana (recopilatori d'octubre de 2026). Quantitats per a 4 racions normals.

/** Picada d'ametlles, all i julivert al morter (o a la batedora amb una mica de brou). */
const picada = (extra = '') =>
  'Picada: al morter, pica l’all ({all:1/2}) amb un pessic de sal fins que sigui una pasta; afegeix-hi les ametlles ({ametlles})' +
  extra +
  ' i el julivert ({julivert}), i continua picant fins que quedi una pasta granulada. Si no tens morter, tritura-ho amb la batedora i un raig del suc de la cassola.';

export const receptesCatalanes2: Recepta[] = [
  {
    id: 'suquet-peix',
    nom: 'Suquet de peix',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['peix'],
    ingredients: [
      l('lluc', 600),
      l('gamba', 250),
      l('patata', 800),
      l('ceba', 1, 'u'),
      l('tomaquet', 2, 'u'),
      l('all', 4),
      l('ametlles', 30),
      l('julivert', 10),
      l('fumet', 700),
      l('pebre-vermell', 2),
      l('oli-oliva', 50),
      l('sal', 8),
    ],
    passos: [
      p(
        'Talla el lluç ({lluc}) a trossos de 4-5 cm i sala’l amb la meitat de la sal ({sal:1/2}). Pela les patates ({patata}) i trenca-les a rodanxes ' +
          'gruixudes, d’1 cm (fes un tall i acaba de partir-les fent palanca: deixen anar fècula i el suc espesseix). Pela la ceba ({ceba}) i pica-la. ' +
          'Ratlla els tomàquets ({tomaquet}) i llença’n la pell. Pela els alls ({all}).',
      ),
      c(
        'En una cassola ampla, a foc mitjà, posa l’oli ({oli-oliva}) i cou-hi la ceba, remenant de tant en tant, fins que sigui tova i daurada.',
        10,
        'Ofegar la ceba',
      ),
      c(
        'Afegeix-hi el tomàquet ratllat i la meitat dels alls ({all:1/2}) picats, i cou-ho fins que el tomàquet perdi l’aigua i quedi una pasta fosca. ' +
          'Treu la cassola del foc un moment, afegeix-hi el pebre vermell ({pebre-vermell}), remena (es crema en segons) i torna-la al foc.',
        8,
        'Sofregit',
      ),
      c(
        'Afegeix-hi les patates, remena perquè s’impregnin del sofregit i cobreix-les amb el fumet ({fumet}) calent. Sala-ho amb la resta de la sal ' +
          '({sal:1/2}) i cou-ho a foc mitjà, sense tapar, fins que les patates siguin gairebé tendres.',
        15,
        'Coure les patates',
      ),
      p(picada()),
      c(
        'Afegeix la picada a la cassola, posa-hi el lluç i les gambes ({gamba}) per sobre, sense remenar, i mou la cassola pels nanses perquè el suc ' +
          'les cobreixi. Cou-ho fins que el lluç sigui blanc i s’esmicoli i les gambes siguin roses. Deixa reposar 2 minuts i serveix-lo a la cassola.',
        6,
        'Coure el peix',
      ),
    ],
  },
  {
    id: 'mar-i-muntanya',
    nom: 'Mar i muntanya de pollastre i gambes',
    racions: 4,
    tempsMinuts: 70,
    etiquetes: ['carn', 'peix'],
    ambAcompanyament: true,
    acompanyaments: ['arros-blanc', 'patates-fregides'],
    ingredients: [
      l('pollastre-trossos', 1200),
      l('gamba', 300),
      l('ceba', 2, 'u'),
      l('tomaquet', 2, 'u'),
      l('all', 4),
      l('ametlles', 30),
      l('xocolata-negra', 15),
      l('julivert', 10),
      l('vi-blanc', 150),
      l('brou-pollastre', 400),
      l('farina', 20),
      l('oli-oliva', 50),
      l('sal', 10),
      l('pebre-negre', 1),
    ],
    passos: [
      p(
        'Salpebra el pollastre ({pollastre-trossos}) amb la sal ({sal}) i el pebre ({pebre-negre}) i passa’l per la farina ({farina}), espolsant la que sobri. ' +
          'Pela i pica les cebes ({ceba}). Ratlla els tomàquets ({tomaquet}). Pela els alls ({all}).',
      ),
      c(
        'En una cassola ampla a foc mitjà-fort, escalfa l’oli ({oli-oliva}) i daura-hi les gambes ({gamba}) un minut per costat. Treu-les. A la mateixa cassola, ' +
          'daura el pollastre per totes bandes, en tandes: ha de quedar ben rossit, que és el que dona gust a la salsa. Treu-lo.',
        12,
        'Daurar pollastre',
      ),
      c(
        'Abaixa el foc, posa-hi la ceba i cou-la, remenant i rascant el fons, fins que sigui ben daurada i dolça. Afegeix-hi el tomàquet i cou-ho fins que sigui una pasta.',
        15,
        'Sofregit',
      ),
      c(
        'Torna-hi el pollastre, aboca-hi el vi ({vi-blanc}) i deixa’l bullir fins que l’olor d’alcohol desaparegui. Afegeix-hi el brou ({brou-pollastre}), tapa ' +
          'la cassola i cou-ho a foc suau fins que el pollastre sigui tendre.',
        25,
        'Coure el pollastre',
      ),
      p(picada(' i la xocolata ({xocolata-negra}) a trossets')),
      c(
        'Afegeix la picada i les gambes a la cassola, remena amb compte i cou-ho destapat fins que la salsa espesseixi. Tasta-ho de sal i serveix-ho amb l’acompanyament.',
        5,
        'Acabar la salsa',
      ),
    ],
  },
  {
    id: 'esqueixada',
    nom: 'Esqueixada de bacallà',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['peix'],
    ingredients: [
      l('bacalla', 500),
      l('tomaquet', 4, 'u'),
      l('ceba', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('olives-negres', 80),
      l('oli-oliva', 60),
      l('vinagre', 15),
      l('pa-pages', 300),
    ],
    passos: [
      p(
        'El bacallà ({bacalla}) ha de ser dessalat (si el compres salat, deixa’l 36 hores en aigua freda a la nevera, canviant l’aigua 3 vegades). ' +
          'Eixuga’l, treu-li la pell i les espines i esqueixa’l amb els dits a tires fines, seguint les fibres. Prova’n un tros: si és massa salat, ' +
          'deixa’l 10 minuts en aigua freda i escorre’l bé.',
      ),
      p(
        'Renta els tomàquets ({tomaquet}) i talla’ls a daus petits, deixant-los escórrer en un colador. Pela la ceba ({ceba}) i talla-la a daus petits. ' +
          'Treu les llavors als pebrots ({pebrot-verd}, {pebrot-vermell}) i talla’ls a daus petits.',
      ),
      p(
        'En una plata, barreja el tomàquet, la ceba i els pebrots, i posa-hi el bacallà per sobre amb les olives ({olives-negres}). Bat l’oli ({oli-oliva}) ' +
          'amb el vinagre ({vinagre}) i rega-ho tot. No cal sal: el bacallà ja en porta.',
      ),
      c('Deixa-ho reposar a la nevera perquè el bacallà agafi el gust de l’amaniment.', 10, 'Reposar'),
      p('Serveix-la freda amb el pa ({pa-pages}) a llesques, torrat si vols.'),
    ],
  },
  {
    id: 'espinacs-catalana',
    nom: 'Espinacs a la catalana',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['verdura', 'vegetaria'],
    tipus: 'acompanyament',
    ingredients: [
      l('espinacs', 600),
      l('panses', 40),
      l('pinyons', 30),
      l('all', 2),
      l('oli-oliva', 30),
      l('sal', 3),
    ],
    passos: [
      c(
        'Posa les panses ({panses}) en un bol amb aigua tèbia perquè s’estovin. Mentrestant, cou els espinacs ({espinacs}) congelats en una olla amb un dit ' +
          'd’aigua i tapats, remenant de tant en tant, fins que es desfacin.',
        8,
        'Coure els espinacs',
      ),
      p('Escorre’ls en un colador i prem-los amb el dors d’una cullera perquè deixin anar tota l’aigua: si en queden molls, el plat queda aigualit.'),
      c(
        'Pela els alls ({all}) i talla’ls a làmines. En una paella a foc mitjà-baix amb l’oli ({oli-oliva}), cou-hi l’all i els pinyons ({pinyons}), ' +
          'remenant, fins que els pinyons siguin daurats (es cremen de pressa: no te’n vagis).',
        2,
        'Daurar pinyons',
      ),
      p('Afegeix-hi els espinacs i les panses escorregudes i la sal ({sal}). Salteja-ho 2 minuts remenant perquè tot quedi barrejat.'),
    ],
  },
  {
    id: 'conill-cassola',
    nom: 'Conill a la cassola amb all i farigola',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['patates-fregides', 'patates-adobades', 'amanida'],
    ingredients: [
      l('conill', 1200),
      l('all', 8),
      l('ceba', 1, 'u'),
      l('tomaquet', 1, 'u'),
      l('vi-blanc', 200),
      l('farigola', 2),
      l('llorer', 2),
      l('oli-oliva', 50),
      l('sal', 10),
      l('pebre-negre', 1),
    ],
    passos: [
      p(
        'Renta el conill ({conill}), eixuga’l bé i salpebra’l amb la sal ({sal}) i el pebre ({pebre-negre}). Esclafa els alls ({all}) amb el palmell, ' +
          'sense pelar-los. Pela i pica la ceba ({ceba}) i ratlla el tomàquet ({tomaquet}).',
      ),
      c(
        'En una cassola a foc mitjà-fort, escalfa l’oli ({oli-oliva}) i daura-hi el conill amb els alls, en tandes, fins que sigui ben rossit per totes bandes.',
        12,
        'Daurar el conill',
      ),
      c('Abaixa el foc, afegeix-hi la ceba i cou-la fins que sigui daurada. Afegeix-hi el tomàquet i cou-lo fins que perdi l’aigua.', 10, 'Sofregit'),
      c(
        'Aboca-hi el vi ({vi-blanc}), la farigola ({farigola}) i el llorer ({llorer}), i un got d’aigua. Tapa-ho i cou-ho a foc suau, girant el conill a la meitat, ' +
          'fins que la carn es desenganxi de l’os amb facilitat. Si s’asseca, afegeix-hi un raig d’aigua.',
        30,
        'Coure el conill',
      ),
      p('Destapa la cassola els últims minuts perquè la salsa es redueixi i quedi lligada. Serveix-lo amb l’acompanyament.'),
    ],
  },
  {
    id: 'faves-catalana',
    nom: 'Faves a la catalana',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['llegums', 'carn'],
    ingredients: [
      l('faves', 900),
      l('botifarra-negra', 280),
      l('cansalada', 150),
      l('ceba', 2, 'u'),
      l('all', 3),
      l('tomaquet', 1, 'u'),
      l('vi-blanc', 100),
      l('llorer', 2),
      l('oli-oliva', 30),
      l('sal', 4),
    ],
    passos: [
      p(
        'Talla la cansalada ({cansalada}) a daus i la botifarra negra ({botifarra-negra}) a rodanxes gruixudes. Pela i pica les cebes ({ceba}) i els alls ({all}). ' +
          'Ratlla el tomàquet ({tomaquet}).',
      ),
      c(
        'En una cassola a foc mitjà amb l’oli ({oli-oliva}), cou-hi la cansalada fins que deixi anar el greix i quedi daurada.',
        5,
        'Daurar la cansalada',
      ),
      c('Afegeix-hi la ceba i l’all i cou-los, remenant, fins que la ceba sigui tova i transparent. Afegeix-hi el tomàquet i cou-lo fins que perdi l’aigua.', 12, 'Sofregit'),
      c(
        'Afegeix-hi les faves ({faves}) congelades mateix, el vi ({vi-blanc}), el llorer ({llorer}), la sal ({sal}) i un got d’aigua. Tapa-ho i cou-ho a foc suau, ' +
          'remenant de tant en tant, fins que les faves siguin tendres.',
        15,
        'Coure les faves',
      ),
      c(
        'Posa la botifarra a sobre, tapa-ho i cou-ho fins que sigui calenta (no remenis gaire: es desfà). Deixa reposar uns minuts abans de servir.',
        5,
        'Botifarra',
      ),
    ],
  },
  {
    id: 'coca-recapte',
    nom: 'Coca de recapte',
    racions: 4,
    tempsMinuts: 140,
    etiquetes: ['verdura', 'peix'],
    ingredients: [
      l('farina-forca', 400),
      l('llevat', 7),
      l('alberginia', 1, 'u'),
      l('pebrot-vermell', 2, 'u'),
      l('ceba', 2, 'u'),
      l('anxoves', 50),
      l('oli-oliva', 80),
      l('sal', 8),
    ],
    passos: [
      p(
        'Massa: en un bol, barreja la farina ({farina-forca}), el llevat ({llevat}) i la sal ({sal}). Afegeix-hi 240 ml d’aigua tèbia i la meitat de l’oli ' +
          '({oli-oliva:1/2}), i pasta-ho amb les mans fins que la massa sigui llisa i no s’enganxi als dits (uns 8 minuts al marbre enfarinat).',
      ),
      c('Fes-ne una bola, posa-la al bol tapada amb un drap i deixa-la en un lloc tebi fins que dobli el volum.', 60, 'Llevar la massa'),
      c(
        'Mentrestant, escalivada: encén el forn a 200 °C. Posa a la safata l’albergínia ({alberginia}) i els pebrots ({pebrot-vermell}) sencers, ' +
          'i les cebes ({ceba}) amb pell, untats amb una mica de l’oli. Rosteix-los, girant-los a la meitat, fins que siguin tous i la pell enfosquida.',
        45,
        'Escalivar',
      ),
      p(
        'Tanca les verdures en un bol tapat 10 minuts (es pelen millor), pela-les, treu les llavors als pebrots i talla-ho tot a tires. ' +
          'Puja el forn a 220 °C.',
      ),
      p(
        'Estira la massa amb les mans o un corró sobre paper de forn, fins que faci 1 cm de gruix i sigui allargada. Escampa-hi les verdures, ' +
          'posa-hi les anxoves ({anxoves}) per sobre i rega-ho amb la resta de l’oli ({oli-oliva:1/2}).',
      ),
      c(
        'Enforna-la a la part de baix del forn fins que la vora sigui daurada i, en aixecar-la, la base sigui cuita i cruixent.',
        20,
        'Coure la coca',
      ),
    ],
  },
  {
    id: 'arros-caldos-marisc',
    nom: 'Arròs caldós de marisc',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['arros', 'peix'],
    ingredients: [
      l('arros', 320),
      l('gamba', 300),
      l('sipia', 300),
      l('musclos', 500),
      l('ceba', 1, 'u'),
      l('tomaquet', 2, 'u'),
      l('all', 3),
      l('fumet', 1500),
      l('pebre-vermell', 2),
      l('colorant', 1),
      l('oli-oliva', 50),
      l('sal', 6),
    ],
    passos: [
      p(
        'Renta els musclos ({musclos}) en aigua freda, rasca’ls amb un ganivet i estira la barba que surt de la closca. Llença els que estiguin trencats ' +
          'o oberts que no es tanquin en tocar-los. Talla la sípia ({sipia}) a daus. Pela i pica la ceba ({ceba}) i els alls ({all}). Ratlla els tomàquets ({tomaquet}).',
      ),
      c(
        'Posa els musclos en una cassola amb un got d’aigua, tapa-la i porta-ho a bullir fort fins que s’obrin. Treu-los i guarda’n el suc colat; ' +
          'treu la meitat de les closques. Llença els que no s’hagin obert.',
        4,
        'Obrir els musclos',
      ),
      c(
        'En una cassola ampla, escalfa l’oli ({oli-oliva}) a foc fort i daura-hi les gambes ({gamba}) un minut per costat; treu-les. ' +
          'Abaixa el foc a mitjà i cou-hi la sípia fins que perdi l’aigua.',
        6,
        'Gambes i sípia',
      ),
      c(
        'Afegeix-hi la ceba i l’all i cou-ho fins que la ceba sigui daurada. Afegeix-hi el tomàquet i cou-lo fins que quedi una pasta fosca. ' +
          'Afegeix-hi el pebre vermell ({pebre-vermell}) i remena 10 segons.',
        12,
        'Sofregit',
      ),
      p(
        'Escalfa el fumet ({fumet}) amb el suc dels musclos. Afegeix l’arròs ({arros}) a la cassola, remena un minut perquè es torri, i aboca-hi el fumet calent, ' +
          'el colorant ({colorant}) i la sal ({sal}).',
      ),
      c(
        'Cou-ho a foc mitjà, remenant de tant en tant. Ha de quedar sucós, gairebé com una sopa espessa: si el suc s’acaba, afegeix-hi aigua calenta.',
        16,
        'Coure l’arròs',
      ),
      p(
        'Els últims 2 minuts, posa-hi les gambes i els musclos perquè s’escalfin. Serveix-lo de seguida: l’arròs caldós continua xuclant brou i s’espesseix.',
      ),
    ],
  },
  {
    id: 'bacalla-llauna',
    nom: 'Bacallà a la llauna',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['peix'],
    ambAcompanyament: true,
    acompanyaments: ['amanida', 'verdures-saltejades', 'pure-patata'],
    ingredients: [
      l('bacalla', 700),
      l('farina', 40),
      l('all', 5),
      l('pebre-vermell', 3),
      l('vi-blanc', 100),
      l('julivert', 10),
      l('oli-oliva', 80),
    ],
    passos: [
      p('Encén el forn a 200 °C. Eixuga el bacallà dessalat ({bacalla}) amb paper de cuina i passa’l per la farina ({farina}), espolsant la que sobri.'),
      c(
        'En una paella a foc mitjà-fort amb la meitat de l’oli ({oli-oliva:1/2}), fregeix el bacallà amb la pell cap amunt fins que sigui daurat per sota; ' +
          'gira’l i cou un minut més. Posa’l en una safata de forn (la «llauna»), amb la pell cap amunt.',
        3,
        'Fregir el bacallà',
      ),
      c(
        'Pela els alls ({all}) i talla’ls a làmines. A la mateixa paella, amb la resta de l’oli ({oli-oliva:1/2}) a foc baix, cou-los fins que siguin rossos. ' +
          'Treu la paella del foc, afegeix-hi el pebre vermell ({pebre-vermell}), remena 10 segons (es crema de seguida) i aboca-hi el vi ({vi-blanc}).',
        3,
        'Daurar els alls',
      ),
      c(
        'Aboca la salsa per sobre del bacallà i enforna-ho fins que el bacallà es desfaci en làmines en prémer-lo.',
        8,
        'Bacallà al forn',
      ),
      p('Escampa-hi el julivert ({julivert}) picat i serveix-lo amb l’acompanyament.'),
    ],
  },
  {
    id: 'pebrots-farcits',
    nom: 'Pebrots farcits de carn',
    racions: 4,
    tempsMinuts: 75,
    etiquetes: ['carn', 'verdura'],
    ingredients: [
      l('pebrot-vermell', 4, 'u'),
      l('carn-picada', 500),
      l('arros', 100),
      l('ceba', 1, 'u'),
      l('all', 2),
      l('tomaquet-triturat', 400),
      l('ou', 1),
      l('formatge-ratllat', 60),
      l('oli-oliva', 40),
      l('sal', 8),
      l('pebre-negre', 1),
    ],
    passos: [
      c(
        'Bull l’arròs ({arros}) en aigua amb sal fins que sigui a mig fer (encara dur al centre). Escorre’l. Encén el forn a 190 °C.',
        8,
        'Bullir l’arròs',
      ),
      p(
        'Talla la part de dalt dels pebrots ({pebrot-vermell}) com una tapa i guarda-la; buida’ls de llavors. Pela i pica la ceba ({ceba}) i els alls ({all}).',
      ),
      c(
        'En una paella a foc mitjà amb la meitat de l’oli ({oli-oliva:1/2}), cou la ceba i l’all fins que siguin tous. Afegeix-hi la carn ({carn-picada}), ' +
          'desfés-la amb una cullera i cou-la fins que no sigui rosada. Afegeix-hi la meitat del tomàquet ({tomaquet-triturat:1/2}) i cou-ho fins que no quedi líquid.',
        12,
        'Farciment',
      ),
      p(
        'Fora del foc, barreja la carn amb l’arròs, l’ou ({ou}), la sal ({sal}) i el pebre ({pebre-negre}). Omple els pebrots fins a dalt sense prémer gaire ' +
          '(l’arròs s’infla), posa-hi el formatge ({formatge-ratllat}) per sobre i tapa’ls amb les seves tapes.',
      ),
      c(
        'Posa’ls drets en una safata de forn amb la resta del tomàquet ({tomaquet-triturat:1/2}) al fons, un got d’aigua i la resta de l’oli ' +
          '({oli-oliva:1/2}). Enforna’ls fins que els pebrots siguin tous i arrugats. Rega’ls amb la salsa a la meitat del temps.',
        45,
        'Pebrots al forn',
      ),
    ],
  },
  {
    id: 'botifarra-bolets',
    nom: 'Botifarra amb bolets',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['patates-fregides', 'patates-adobades', 'pure-patata', 'pa-amb-tomaquet'],
    ingredients: [
      l('botifarra', 600),
      l('bolets', 400),
      l('all', 3),
      l('julivert', 10),
      l('oli-oliva', 40),
      l('sal', 3),
    ],
    passos: [
      p(
        'Neteja els bolets ({bolets}) amb un drap humit o un pinzell (sota l’aixeta xuclen aigua) i talla els grans a trossos. Pela i pica els alls ({all}) ' +
          'amb el julivert ({julivert}).',
      ),
      c(
        'Punxa la botifarra ({botifarra}) amb una forquilla. Cou-la en una paella a foc mitjà amb la meitat de l’oli ({oli-oliva:1/2}), girant-la sovint, ' +
          'fins que sigui daurada per tot arreu i ferma. Treu-la i guarda-la calenta.',
        15,
        'Botifarra',
      ),
      c(
        'A la mateixa paella, a foc fort amb la resta de l’oli ({oli-oliva:1/2}), salteja els bolets fins que deixin anar l’aigua i es daurin. ' +
          'Afegeix-hi l’all, el julivert i la sal ({sal}) l’últim minut.',
        7,
        'Saltejar bolets',
      ),
      p('Serveix la botifarra amb els bolets per sobre i l’acompanyament.'),
    ],
  },
  {
    id: 'empedrat',
    nom: 'Empedrat de mongetes i bacallà',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['llegums', 'peix'],
    ingredients: [
      l('mongetes-cuites', 800),
      l('bacalla', 250),
      l('tomaquet', 3, 'u'),
      l('ceba', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('olives-negres', 80),
      l('oli-oliva', 60),
      l('vinagre', 20),
      l('sal', 2),
    ],
    passos: [
      p('Escorre les mongetes ({mongetes-cuites}) i esbandeix-les en un colador amb aigua freda, amb compte que no es trenquin. Deixa-les escórrer bé.'),
      p('Esqueixa el bacallà dessalat ({bacalla}) a tires fines amb els dits, traient la pell i les espines.'),
      p(
        'Talla els tomàquets ({tomaquet}), la ceba ({ceba}) i el pebrot ({pebrot-verd}) a daus petits, d’una mida semblant a les mongetes: d’aquí ve el nom, ' +
          'de les pedretes.',
      ),
      p(
        'Barreja-ho tot en una enciamera amb les olives ({olives-negres}). Bat l’oli ({oli-oliva}) amb el vinagre ({vinagre}) i la sal ({sal}) i amaneix-ho. ' +
          'Remena amb compte i deixa-ho reposar 10 minuts a la nevera abans de servir.',
      ),
    ],
  },
  {
    id: 'arros-conill-carxofes',
    nom: 'Arròs a la cassola amb conill i carxofes',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['arros', 'carn', 'verdura'],
    ingredients: [
      l('arros', 320),
      l('conill', 600),
      l('carxofes', 400),
      l('ceba', 1, 'u'),
      l('tomaquet', 2, 'u'),
      l('all', 3),
      l('brou-pollastre', 1100),
      l('pebre-vermell', 2),
      l('colorant', 1),
      l('oli-oliva', 50),
      l('sal', 8),
    ],
    passos: [
      p('Sala el conill ({conill}) amb la meitat de la sal ({sal:1/2}). Pela i pica la ceba ({ceba}) i els alls ({all}). Ratlla els tomàquets ({tomaquet}).'),
      c(
        'En una cassola ampla a foc mitjà-fort amb l’oli ({oli-oliva}), daura el conill per totes bandes fins que sigui ben rossit.',
        10,
        'Daurar el conill',
      ),
      c('Afegeix-hi les carxofes ({carxofes}) congelades i salteja-les fins que es comencin a daurar.', 5, 'Carxofes'),
      c(
        'Afegeix-hi la ceba i l’all i cou-los fins que siguin tous; després el tomàquet, fins que sigui una pasta fosca. Afegeix-hi el pebre vermell ' +
          '({pebre-vermell}) i remena 10 segons.',
        12,
        'Sofregit',
      ),
      c(
        'Aboca-hi el brou ({brou-pollastre}) calent i cou-ho tapat perquè el conill s’estovi. Afegeix-hi l’arròs ({arros}), el colorant ({colorant}) ' +
          'i la resta de la sal ({sal:1/2}), i remena-ho un cop.',
        10,
        'Coure el conill',
      ),
      c(
        'Cou-ho a foc mitjà, sense remenar, fins que l’arròs sigui al punt i quedi una mica de suc. Deixa’l reposar 3 minuts fora del foc abans de servir.',
        17,
        'Coure l’arròs',
      ),
    ],
  },
  {
    id: 'costelles-xai-allioli',
    nom: 'Costelles de xai amb allioli i patates',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['carn'],
    ingredients: [
      l('costelles-xai', 700),
      l('patata', 800),
      l('all', 3),
      l('ou', 1),
      l('llimona', 1, 'u'),
      l('oli-girasol', 200),
      l('oli-oliva', 30),
      l('romani', 1),
      l('sal', 8),
    ],
    passos: [
      p('Encén el forn a 210 °C. Renta les patates ({patata}) i talla-les a gallons, amb pell. Treu les costelles ({costelles-xai}) de la nevera.'),
      c(
        'Posa les patates a la safata amb l’oli d’oliva ({oli-oliva}), el romaní ({romani}) i la meitat de la sal ({sal:1/2}), remena-les i rosteix-les, ' +
          'girant-les a la meitat, fins que siguin daurades i toves.',
        30,
        'Patates al forn',
      ),
      p(
        'Allioli (fàcil, amb ou): posa al got de la batedora els alls ({all}) pelats, l’ou ({ou}), un raig de suc de la llimona ({llimona:1/2}) i un pessic de sal. ' +
          'Aboca-hi l’oli de gira-sol ({oli-girasol}). Posa la batedora al fons, engega-la i no la moguis fins que vegis que s’emulsiona; aleshores puja-la ' +
          'a poc a poc. Ha de quedar espès com una maionesa.',
      ),
      c(
        'Escalfa una planxa o una paella a foc fort, sense oli. Sala les costelles amb la resta de la sal ({sal:1/2}) i cou-les en tandes, sense amuntegar-les, ' +
          'fins que siguin daurades i amb el greix de la vora cruixent. Han de quedar rosades per dins. El cronòmetre és per a cada costat.',
        2.5,
        'Costelles: un costat',
      ),
      p('Serveix les costelles amb les patates, l’allioli i la resta de la llimona ({llimona:1/2}) a gallons.'),
    ],
  },
];
