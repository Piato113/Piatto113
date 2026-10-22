import type { Recepta } from '../domini';
import { c, l, p } from './ajudants';

// Receptes d'hivern (octubre de 2026), a partir d'un recull de plats d'hivern que va passar Roger,
// reescrites amb el detall de l'app i amb productes del Mercadona. Quantitats per a 4 racions normals.
// La temporada (de novembre a març) és a `temporades.ts`; la cuina, a `cuines.ts`.
//
// Les cremes no es fan soles: sempre van amb un acompanyament que les completa (truita, torrades,
// hummus, croquetes). Aquests acompanyaments són només per a les cremes (`nomesAmbLlista`).

/** Acompanyaments que completen una crema. */
export const ACOMPANYAMENTS_CREMA = ['truita-francesa', 'torrades-pernil-formatge', 'hummus-torrades', 'croquetes-fregides', 'truita-patates'];

/** Una crema: principal que sempre porta un dels acompanyaments de crema. */
const crema = (r: Omit<Recepta, 'racions' | 'ambAcompanyament' | 'acompanyaments'>): Recepta => ({
  ...r,
  racions: 4,
  ambAcompanyament: true,
  acompanyaments: ACOMPANYAMENTS_CREMA,
});

/** Triturar amb la batedora fins que quedi fina, i rectificar el gruix i la sal. */
const triturar = (abans = '') =>
  p(
    `${abans}Tritura-ho amb la batedora fins que no quedi cap tros: com més estona, més fina. Si és massa espessa, afegeix-hi aigua calenta a poc a poc; ` +
      'si és massa clara, deixa-la bullir uns minuts destapada. Tasta-la i, si cal, afegeix-hi una mica més de sal.',
  );

export const receptesHivern: Recepta[] = [
  // ——— Acompanyaments de les cremes ———
  {
    id: 'truita-francesa',
    nom: 'Truites a la francesa',
    racions: 4,
    tempsMinuts: 15,
    etiquetes: [],
    tipus: 'acompanyament',
    nomesAmbLlista: true,
    ingredients: [l('ou', 8), l('oli-oliva', 20), l('sal', 2)],
    passos: [
      p('Es fa una truita per persona, amb 2 ous cadascuna ({ou} en total). Prepara-les just quan la crema ja sigui a punt: són millors acabades de fer.'),
      p('Per a cada truita, bat 2 ous en un bol amb un pessic de sal (en total, {sal}) fins que la clara i el rovell quedin ben barrejats.'),
      c(
        'Escalfa una paella antiadherent petita (20 cm) a foc mitjà amb un raig de l’oli ({oli-oliva}). Aboca-hi l’ou i remena’l uns segons amb una espàtula; ' +
          'quan les vores comencin a quallar però a dalt encara estigui melós, plega-la en tres amb l’espàtula i posa-la al plat.',
        1.5,
        'Una truita',
      ),
      p('Repeteix-ho amb la resta d’ous. Si en vols mantenir alguna calenta, deixa-la en un plat tapat amb un altre plat.'),
    ],
  },
  {
    id: 'torrades-pernil-formatge',
    nom: 'Torrades amb tomàquet, pernil dolç i formatge fos',
    racions: 4,
    tempsMinuts: 15,
    etiquetes: [],
    tipus: 'acompanyament',
    nomesAmbLlista: true,
    ingredients: [l('pa-pages', 300), l('tomaquet', 1, 'u'), l('pernil-dolc', 150), l('formatge-llesques', 150), l('oli-oliva', 20)],
    passos: [
      c(
        'Talla el pa ({pa-pages}) a 8 llesques i torra-les a la torradora o en una paella seca, fins que siguin daurades per les dues bandes.',
        3,
        'Torrar el pa',
      ),
      p('Talla el tomàquet ({tomaquet}) per la meitat i frega’l sobre cada llesca. Tira-hi un fil d’oli ({oli-oliva}).'),
      p('Posa a sobre de cada llesca el pernil dolç ({pernil-dolc}) i, al damunt, el formatge ({formatge-llesques}).'),
      c(
        'Posa les torrades en una paella a foc baix i tapa-la (o sota el gratinador del forn, si està encès) fins que el formatge es fongui. ' +
          'Serveix-les calentes al costat de la crema.',
        3,
        'Fondre el formatge',
      ),
    ],
  },
  {
    id: 'hummus-torrades',
    nom: 'Hummus amb torrades',
    racions: 4,
    tempsMinuts: 15,
    etiquetes: [],
    tipus: 'acompanyament',
    nomesAmbLlista: true,
    aparells: ['batedora'],
    ingredients: [
      l('cigrons', 400),
      l('tahini', 40),
      l('llimona', 1, 'u'),
      l('all', 1),
      l('comi', 2),
      l('pebre-vermell', 1),
      l('oli-oliva', 40),
      l('sal', 3),
      l('pa-pages', 300),
    ],
    passos: [
      p(
        'Escorre els cigrons ({cigrons}) en un colador posat sobre un bol per guardar el líquid del pot. Esbandeix-los amb aigua freda: ' +
          'així perden el gust de conserva.',
      ),
      p(
        'Posa al got de la batedora els cigrons, el tahini ({tahini}), el suc de la llimona ({llimona}), l’all ({all}) pelat, el comí ({comi}), la sal ({sal}) ' +
          'i la meitat de l’oli ({oli-oliva:1/2}). Afegeix-hi 4 cullerades del líquid dels cigrons.',
      ),
      p(
        'Tritura-ho fins que sigui una pasta molt fina i cremosa, com una crema d’untar. Si costa de triturar o queda espessa, afegeix-hi més líquid ' +
          'dels cigrons, una cullerada cada vegada. Tasta-ho i, si cal, posa-hi més llimona o sal.',
      ),
      p('Posa l’hummus en un bol, fes-hi un solc amb el dors d’una cullera i omple’l amb la resta de l’oli ({oli-oliva:1/2}). Empolvora-ho amb el pebre vermell ({pebre-vermell}).'),
      c('Talla el pa ({pa-pages}) a llesques i torra-les. Es menja untant les torrades a l’hummus.', 3, 'Torrar el pa'),
    ],
  },
  {
    id: 'croquetes-fregides',
    nom: 'Croquetes fregides',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: [],
    tipus: 'acompanyament',
    nomesAmbLlista: true,
    ingredients: [l('croquetes-congelades', 400), l('oli-girasol', 40)],
    passos: [
      p(
        'Posa oli de gira-sol en una paella fonda o un cassó: que cobreixi les croquetes fins a la meitat (la recepta compta {oli-girasol}, ' +
          'que és el que absorbeixen). Escalfa’l a foc mitjà-alt: és a punt quan, si hi tires un trosset de pa, bombolleja de seguida.',
      ),
      c(
        'Fregeix les croquetes ({croquetes-congelades}) directament congelades, en tandes de 5 o 6 perquè l’oli no es refredi i no es trenquin. ' +
          'Gira-les a mitja cocció. Són a punt quan són ben daurades per fora.',
        4,
        'Fregir una tanda',
      ),
      p('Treu-les amb una escumadora i deixa-les sobre paper de cuina perquè s’escorrin. Serveix-les calentes.'),
    ],
  },

  // ——— Cremes (sempre amb acompanyament) ———
  crema({
    id: 'crema-xampinyons',
    nom: 'Crema de xampinyons i farigola',
    tempsMinuts: 45,
    etiquetes: ['sopa', 'verdura', 'vegetaria'],
    aparells: ['batedora'],
    ingredients: [
      l('xampinyons', 500),
      l('ceba', 1, 'u'),
      l('all', 2),
      l('patata', 1, 'u'),
      l('brou-verdures', 800),
      l('nata', 100),
      l('farigola', 2),
      l('oli-oliva', 40),
      l('pebre-negre', 1),
      l('sal', 5),
    ],
    passos: [
      p('Pica la ceba ({ceba}) i els alls ({all}). Pela la patata ({patata}) i talla-la a daus petits, d’un centímetre: així es cou abans.'),
      c(
        'Posa una olla a foc mitjà amb l’oli ({oli-oliva}) i cou-hi la ceba i l’all, remenant de tant en tant, fins que la ceba sigui tova i transparent, sense que es torri.',
        8,
        'Ofegar la ceba',
      ),
      c(
        'Puja el foc a mitjà-alt i afegeix-hi els xampinyons ({xampinyons}) i la farigola ({farigola}). Al principi deixaran anar molta aigua: ' +
          'remena fins que s’hagi evaporat i els xampinyons comencin a daurar-se. Aquest pas dona el gust a la crema.',
        10,
        'Saltejar els xampinyons',
      ),
      c(
        'Afegeix-hi la patata, el brou ({brou-verdures}), la sal ({sal}) i el pebre ({pebre-negre}). Quan bulli, abaixa el foc, tapa l’olla ' +
          'i deixa-ho coure fins que la patata es desfaci en prémer-la amb una cullera.',
        20,
        'Coure la crema',
      ),
      triturar('Treu l’olla del foc i afegeix-hi la nata ({nata}). '),
    ],
  }),
  crema({
    id: 'crema-broquil-alvocat',
    nom: 'Crema de bròquil i alvocat',
    tempsMinuts: 35,
    etiquetes: ['sopa', 'verdura', 'vegetaria'],
    aparells: ['batedora'],
    ingredients: [
      l('broquil', 900),
      l('patata', 1, 'u'),
      l('ceba', 1, 'u'),
      l('all', 1),
      l('brou-verdures', 800),
      l('alvocat', 1, 'u'),
      l('llimona', 1, 'u'),
      l('oli-oliva', 30),
      l('sal', 5),
    ],
    passos: [
      p(
        'Renta el bròquil ({broquil}) i separa’l en arbrets. La tija també s’aprofita: pela-la amb un pelador i talla-la a rodanxes. ' +
          'Pela la patata ({patata}) i talla-la a daus petits. Pica la ceba ({ceba}) i l’all ({all}).',
      ),
      c('En una olla a foc mitjà amb l’oli ({oli-oliva}), cou la ceba i l’all fins que siguin tous i transparents.', 6, 'Ofegar la ceba'),
      c(
        'Afegeix-hi el bròquil, la patata, el brou ({brou-verdures}) i la sal ({sal}). Quan bulli, abaixa el foc i cou-ho tapat. No el deixis més estona: ' +
          'el bròquil massa cuit es torna grisós i fa un gust fort.',
        12,
        'Coure el bròquil',
      ),
      p(
        'Treu l’olla del foc. Obre l’alvocat ({alvocat}), treu-li el pinyol i buida’n la polpa amb una cullera dins l’olla. Afegeix-hi el suc de la llimona ({llimona}). ' +
          'L’alvocat no ha de bullir: es posa fora del foc.',
      ),
      triturar(),
    ],
  }),
  crema({
    id: 'crema-coliflor-rostida',
    nom: 'Crema de coliflor rostida',
    tempsMinuts: 55,
    etiquetes: ['sopa', 'verdura', 'vegetaria'],
    aparells: ['forn', 'batedora'],
    ingredients: [
      l('coliflor', 1, 'u'),
      l('ceba', 1, 'u'),
      l('all', 3),
      l('comi', 2),
      l('brou-verdures', 800),
      l('llet-coco', 200),
      l('oli-oliva', 50),
      l('sal', 6),
    ],
    passos: [
      p('Encén el forn a 200 °C, amb escalfor a dalt i a baix. Separa la coliflor ({coliflor}) en arbrets i renta’ls. Pela els alls ({all}) i deixa’ls sencers.'),
      c(
        'Posa la coliflor i els alls en una safata de forn, amaneix-ho amb la meitat de l’oli ({oli-oliva:1/2}), el comí ({comi}) i la meitat de la sal ({sal:1/2}) ' +
          'i remena-ho amb les mans perquè quedi tot untat. Rosteix-ho fins que les puntes siguin ben daurades: rostida té molt més gust que bullida.',
        25,
        'Rostir la coliflor',
      ),
      c('Mentrestant, pica la ceba ({ceba}) i cou-la en una olla a foc mitjà amb la resta de l’oli ({oli-oliva:1/2}) fins que sigui tova.', 8, 'Ofegar la ceba'),
      c(
        'Afegeix a l’olla la coliflor i els alls rostits, el brou ({brou-verdures}) i la resta de la sal ({sal:1/2}). Quan bulli, abaixa el foc i cou-ho tapat ' +
          'fins que la coliflor sigui ben tendra.',
        12,
        'Coure la crema',
      ),
      triturar('Afegeix-hi la llet de coco ({llet-coco}). '),
    ],
  }),
  crema({
    id: 'crema-remolatxa-poma',
    nom: 'Crema de remolatxa i poma',
    tempsMinuts: 35,
    etiquetes: ['sopa', 'verdura', 'vegetaria'],
    aparells: ['batedora'],
    ingredients: [
      l('remolatxa', 450),
      l('poma', 1, 'u'),
      l('patata', 1, 'u'),
      l('ceba', 1, 'u'),
      l('gingebre', 10),
      l('brou-verdures', 700),
      l('oli-oliva', 30),
      l('sal', 5),
    ],
    passos: [
      p(
        'Talla la remolatxa ({remolatxa}) a daus (ja ve cuita: posa’t guants o renta’t les mans de seguida, que tenyeix). Pela la poma ({poma}) i la patata ({patata}), ' +
          'treu el cor de la poma i talla-ho tot a daus. Pica la ceba ({ceba}) i ratlla el gingebre ({gingebre}) pelat.',
      ),
      c('En una olla a foc mitjà amb l’oli ({oli-oliva}), cou la ceba fins que sigui tova. Afegeix-hi el gingebre i remena un minut.', 7, 'Ofegar la ceba'),
      c(
        'Afegeix-hi la remolatxa, la poma, la patata, el brou ({brou-verdures}) i la sal ({sal}). Quan bulli, abaixa el foc i cou-ho tapat fins que la patata es desfaci.',
        20,
        'Coure la crema',
      ),
      triturar(),
    ],
  }),
  crema({
    id: 'crema-esparrecs-porro',
    nom: 'Crema d’espàrrecs i porro',
    tempsMinuts: 40,
    etiquetes: ['sopa', 'verdura', 'vegetaria'],
    aparells: ['batedora'],
    ingredients: [
      l('esparrecs', 500),
      l('porro', 2, 'u'),
      l('patata', 2, 'u'),
      l('brou-verdures', 800),
      l('nata', 100),
      l('oli-oliva', 40),
      l('sal', 5),
    ],
    passos: [
      p(
        'Renta els espàrrecs ({esparrecs}) i trenca’ls amb les mans per la part de baix: es trenquen sols on comença la part dura, que es llença. ' +
          'Talla les puntes (uns 4 cm) i guarda-les; la resta, a trossos.',
      ),
      p(
        'Talla els porros ({porro}): només la part blanca i la verd clar. Obre’ls de llarg i renta’ls sota l’aixeta, que entre les capes hi sol haver terra. ' +
          'Talla’ls a rodanxes. Pela les patates ({patata}) i talla-les a daus petits.',
      ),
      c('En una olla a foc mitjà amb tres quarts de l’oli ({oli-oliva:3/4}), cou el porro fins que sigui tou, sense que es torri.', 8, 'Ofegar el porro'),
      c(
        'Afegeix-hi els trossos d’espàrrec (no les puntes), les patates, el brou ({brou-verdures}) i la sal ({sal}). Quan bulli, abaixa el foc i cou-ho tapat ' +
          'fins que la patata es desfaci.',
        20,
        'Coure la crema',
      ),
      c(
        'Mentrestant, salteja les puntes dels espàrrecs en una paella amb la resta de l’oli ({oli-oliva:1/4}) i un pessic de sal, fins que siguin tendres però encara verdes.',
        4,
        'Saltejar les puntes',
      ),
      triturar('Afegeix la nata ({nata}) a l’olla. '),
      p('Serveix la crema amb les puntes d’espàrrec per sobre.'),
    ],
  }),
  crema({
    id: 'crema-moniato-llenties',
    nom: 'Crema de moniato i llenties',
    tempsMinuts: 40,
    etiquetes: ['sopa', 'llegums', 'vegetaria'],
    aparells: ['batedora'],
    ingredients: [
      l('moniato', 600),
      l('llenties-cuites', 400),
      l('ceba', 1, 'u'),
      l('pastanaga', 1, 'u'),
      l('gingebre', 10),
      l('comi', 2),
      l('brou-verdures', 900),
      l('oli-oliva', 30),
      l('sal', 5),
    ],
    passos: [
      p(
        'Pela el moniato ({moniato}) i la pastanaga ({pastanaga}) i talla’ls a daus petits. Pica la ceba ({ceba}) i ratlla el gingebre ({gingebre}) pelat. ' +
          'Escorre les llenties ({llenties-cuites}) i esbandeix-les amb aigua freda.',
      ),
      c(
        'En una olla a foc mitjà amb l’oli ({oli-oliva}), cou la ceba fins que sigui tova. Afegeix-hi el gingebre i el comí ({comi}) i remena un minut, fins que facin olor.',
        7,
        'Ofegar la ceba',
      ),
      c(
        'Afegeix-hi el moniato, la pastanaga, les llenties, el brou ({brou-verdures}) i la sal ({sal}). Quan bulli, abaixa el foc i cou-ho tapat ' +
          'fins que el moniato es desfaci en prémer-lo.',
        20,
        'Coure la crema',
      ),
      triturar(),
    ],
  }),
  crema({
    id: 'crema-pebrot-rostit',
    nom: 'Crema de pebrot vermell rostit',
    tempsMinuts: 65,
    etiquetes: ['sopa', 'verdura', 'vegetaria'],
    aparells: ['forn', 'batedora'],
    ingredients: [
      l('pebrot-vermell', 4, 'u'),
      l('tomaquet', 3, 'u'),
      l('ceba', 1, 'u'),
      l('all', 3),
      l('patata', 1, 'u'),
      l('brou-verdures', 600),
      l('pebre-vermell', 3),
      l('oli-oliva', 50),
      l('sal', 5),
    ],
    passos: [
      p(
        'Encén el forn a 200 °C. Renta els pebrots ({pebrot-vermell}) i els tomàquets ({tomaquet}). Pela la ceba ({ceba}) i talla-la a quarts. ' +
          'Posa-ho tot en una safata amb els alls ({all}) sense pelar, unta-ho amb la meitat de l’oli ({oli-oliva:1/2}).',
      ),
      c(
        'Rosteix-ho, girant els pebrots a la meitat, fins que la pell dels pebrots sigui arrugada i amb taques fosques. ' +
          'Si els tomàquets i la ceba són tous abans, treu-los.',
        40,
        'Rostir els pebrots',
      ),
      p(
        'Posa els pebrots en un bol tapat amb un plat 10 minuts: el vapor fa que la pell surti sola. Pela’ls i treu-los les llavors. ' +
          'Pela els tomàquets i els alls (prement-los, la polpa surt sola).',
      ),
      c(
        'Mentrestant, pela la patata ({patata}), talla-la a daus i cou-la en una olla amb el brou ({brou-verdures}) i la sal ({sal}) fins que sigui tendra.',
        15,
        'Coure la patata',
      ),
      triturar(
        'Afegeix a l’olla els pebrots, els tomàquets, la ceba, els alls, el pebre vermell ({pebre-vermell}) i la resta de l’oli ({oli-oliva:1/2}). ',
      ),
    ],
  }),

  // ——— Plats de cullera ———
  {
    id: 'sopa-juliana-gall-dindi',
    nom: 'Sopa juliana amb gall dindi',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['carn', 'sopa', 'verdura'],
    ingredients: [
      l('gall-dindi-pit', 400),
      l('brou-pollastre', 1500),
      l('pastanaga', 2, 'u'),
      l('porro', 1, 'u'),
      l('col', 300),
      l('ceba', 1, 'u'),
      l('patata', 2, 'u'),
      l('fideus-fins', 80),
      l('oli-oliva', 30),
      l('sal', 4),
    ],
    passos: [
      c(
        'Posa el brou ({brou-pollastre}) en una olla gran amb el gall dindi ({gall-dindi-pit}) sencer. Quan bulli, abaixa el foc i cou-lo tapat. ' +
          'Mentrestant, fes el pas següent.',
        15,
        'Coure el gall dindi',
      ),
      p(
        'Talla a juliana (tires fines d’uns 4 cm) les pastanagues ({pastanaga}) pelades, el porro ({porro}) net, la col ({col}) i la ceba ({ceba}). ' +
          'Pela les patates ({patata}) i talla-les a daus petits.',
      ),
      p('Treu el gall dindi del brou (el brou es guarda) i, quan es pugui tocar, esfila’l amb dues forquilles.'),
      c(
        'En una altra olla a foc mitjà amb l’oli ({oli-oliva}), cou la ceba i el porro fins que siguin tous. Afegeix-hi la pastanaga i la col i remena-ho fins que la col s’estovi.',
        10,
        'Ofegar les verdures',
      ),
      c('Afegeix-hi el brou calent, les patates i la sal ({sal}) i cou-ho a foc mitjà fins que la patata sigui tendra.', 12, 'Coure la sopa'),
      c('Tira-hi els fideus ({fideus-fins}) i el gall dindi esfilat i cou-ho el temps que diu el paquet dels fideus.', 4, 'Fideus'),
    ],
  },
  {
    id: 'sopa-peix-safra',
    nom: 'Sopa de peix al safrà',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['peix', 'sopa'],
    ingredients: [
      l('lluc', 400),
      l('gamba', 250),
      l('ceba', 1, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('all', 2),
      l('tomaquet-triturat', 200),
      l('colorant', 1),
      l('patata', 2, 'u'),
      l('fumet', 1500),
      l('julivert', 10),
      l('oli-oliva', 40),
      l('sal', 4),
    ],
    passos: [
      p(
        'Pela les gambes ({gamba}) i treu-los el budell negre de l’esquena. Talla el lluç ({lluc}) a daus grossos, sense pell ni espines. ' +
          'Pica la ceba ({ceba}), el pebrot ({pebrot-vermell}) i els alls ({all}). Pela les patates ({patata}) i talla-les a daus.',
      ),
      c(
        'En una olla a foc mitjà amb l’oli ({oli-oliva}), cou la ceba i el pebrot fins que siguin tous i comencin a daurar-se. ' +
          'Afegeix-hi l’all i remena un minut.',
        10,
        'Sofregit',
      ),
      c('Afegeix-hi el tomàquet ({tomaquet-triturat}) i cou-ho fins que perdi l’aigua i quedi una salsa espessa.', 6, 'Tomàquet'),
      c(
        'Afegeix-hi el safrà ({colorant}), el fumet ({fumet}), les patates i la sal ({sal}). Quan bulli, abaixa el foc i cou-ho fins que la patata sigui tendra.',
        15,
        'Coure les patates',
      ),
      c(
        'Afegeix-hi el lluç i, al cap de 2 minuts, les gambes. Cou-ho només fins que les gambes siguin rosades: si el peix bull massa estona, s’esmicola i queda sec.',
        4,
        'Coure el peix',
      ),
      p('Pica el julivert ({julivert}) i tira’l a la sopa just abans de servir-la, ben calenta.'),
    ],
  },
  {
    id: 'mongetes-cloisses',
    nom: 'Mongetes amb cloïsses',
    racions: 4,
    tempsMinuts: 55,
    etiquetes: ['llegums', 'peix'],
    ingredients: [
      l('mongetes-cuites', 800),
      l('cloisses', 500),
      l('ceba', 1, 'u'),
      l('all', 3),
      l('pebre-vermell', 3),
      l('vi-blanc', 100),
      l('fumet', 400),
      l('julivert', 10),
      l('oli-oliva', 40),
      l('sal', 3),
    ],
    passos: [
      c(
        'Posa les cloïsses ({cloisses}) en un bol amb aigua freda i una bona cullerada de sal (com l’aigua de mar), perquè treguin la sorra. ' +
          'Mentrestant, fes els passos següents.',
        30,
        'Purgar les cloïsses',
      ),
      p('Escorre les mongetes ({mongetes-cuites}) i esbandeix-les amb aigua freda. Pica la ceba ({ceba}), els alls ({all}) i el julivert ({julivert}).'),
      c('En una cassola ampla a foc mitjà amb l’oli ({oli-oliva}), cou la ceba i l’all fins que siguin tous i transparents.', 8, 'Ofegar la ceba'),
      p(
        'Treu la cassola del foc, afegeix-hi el pebre vermell ({pebre-vermell}) i remena 10 segons (fora del foc perquè no es cremi i amargui). ' +
          'Torna-la al foc, aboca-hi el vi ({vi-blanc}) i deixa’l bullir 2 minuts perquè se’n vagi l’alcohol.',
      ),
      c(
        'Afegeix-hi el fumet ({fumet}), les mongetes i la sal ({sal}) i cou-ho a foc baix, sense remenar gaire perquè les mongetes no es trenquin: ' +
          'mou la cassola agafant-la per les nanses.',
        10,
        'Coure les mongetes',
      ),
      c(
        'Escorre les cloïsses i posa-les a la cassola. Tapa-la i cou-ho fins que s’obrin. Les que quedin tancades, llença-les.',
        4,
        'Obrir les cloïsses',
      ),
      p('Tira-hi el julivert i serveix-ho de seguida.'),
    ],
  },
  {
    id: 'potatge-vigilia',
    nom: 'Potatge de vigília',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['llegums', 'peix'],
    ingredients: [
      l('cigrons', 800),
      l('bacalla', 300),
      l('espinacs', 300),
      l('ou', 2),
      l('ceba', 1, 'u'),
      l('all', 2),
      l('tomaquet-triturat', 150),
      l('pebre-vermell', 3),
      l('llorer', 1),
      l('brou-verdures', 800),
      l('oli-oliva', 40),
      l('sal', 2),
    ],
    passos: [
      c(
        'Posa els ous ({ou}) en un cassó amb aigua freda que els cobreixi, porta’ls a bullir i compta 10 minuts. Refreda’ls en aigua freda, pela’ls i pica’ls.',
        10,
        'Ous durs',
      ),
      p(
        'Escorre els cigrons ({cigrons}) i esbandeix-los. Treu la pell i les espines del bacallà ({bacalla}) i esmicola’l a trossos grossos. ' +
          'Pica la ceba ({ceba}) i els alls ({all}).',
      ),
      c('En una olla a foc mitjà amb l’oli ({oli-oliva}), cou la ceba i l’all fins que siguin tous.', 8, 'Ofegar la ceba'),
      c(
        'Afegeix-hi el tomàquet ({tomaquet-triturat}) i cou-ho fins que sigui una salsa espessa. Treu l’olla del foc, afegeix-hi el pebre vermell ({pebre-vermell}) ' +
          'i remena 10 segons.',
        5,
        'Tomàquet',
      ),
      c(
        'Torna l’olla al foc i afegeix-hi el brou ({brou-verdures}), el llorer ({llorer}), els cigrons, els espinacs ({espinacs}) congelats i la sal ({sal}) ' +
          '(poca: el bacallà ja és salat). Cou-ho a foc mitjà.',
        10,
        'Coure els cigrons',
      ),
      c('Afegeix-hi el bacallà i cou-ho a foc baix, sense remenar gaire, fins que el bacallà es desfaci en làmines.', 5, 'Coure el bacallà'),
      p('Treu el llorer, tasta-ho de sal i serveix-ho amb l’ou dur picat per sobre.'),
    ],
  },
  {
    id: 'sipia-pesols',
    nom: 'Sípia amb pèsols',
    racions: 4,
    tempsMinuts: 70,
    etiquetes: ['peix'],
    ingredients: [
      l('sipia', 600),
      l('pesols', 400),
      l('ceba', 2, 'u'),
      l('tomaquet-triturat', 200),
      l('all', 2),
      l('vi-blanc', 100),
      l('patata', 2, 'u'),
      l('julivert', 10),
      l('oli-oliva', 50),
      l('sal', 4),
    ],
    passos: [
      p('Talla la sípia ({sipia}) a daus de 2 cm. Pica les cebes ({ceba}) ben petites i els alls ({all}). Pela les patates ({patata}) i talla-les a daus.'),
      c(
        'En una cassola a foc mitjà-baix amb l’oli ({oli-oliva}), cou la ceba, remenant de tant en tant, fins que sigui molt tova i daurada. ' +
          'No t’hi encantis: un bon sofregit és la base del plat. Si s’enganxa, afegeix-hi una cullerada d’aigua.',
        15,
        'Sofregit de ceba',
      ),
      c('Afegeix-hi l’all i la sípia i cou-ho a foc mitjà fins que la sípia es torni blanca i deixi anar l’aigua.', 5, 'Sípia'),
      c('Afegeix-hi el tomàquet ({tomaquet-triturat}) i cou-ho fins que s’hagi espessit.', 10, 'Tomàquet'),
      c(
        'Aboca-hi el vi ({vi-blanc}) i deixa’l bullir 2 minuts. Afegeix-hi les patates, la sal ({sal}) i un got d’aigua (uns 400 ml), tapa la cassola ' +
          'i cou-ho a foc baix fins que la sípia sigui tendra en punxar-la.',
        20,
        'Coure la sípia',
      ),
      c('Afegeix-hi els pèsols ({pesols}) congelats i cou-ho fins que siguin tendres.', 8, 'Pèsols'),
      p('Pica el julivert ({julivert}), tira’l per sobre i deixa reposar la cassola 5 minuts fora del foc abans de servir.'),
    ],
  },
  {
    id: 'sopa-col-cigrons',
    nom: 'Sopa de col i cigrons',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['llegums', 'sopa', 'verdura', 'vegetaria'],
    ingredients: [
      l('col', 400),
      l('cigrons', 600),
      l('patata', 2, 'u'),
      l('pastanaga', 2, 'u'),
      l('ceba', 1, 'u'),
      l('all', 2),
      l('tomaquet-triturat', 150),
      l('pebre-vermell', 3),
      l('comi', 1),
      l('brou-verdures', 1200),
      l('oli-oliva', 40),
      l('sal', 4),
    ],
    passos: [
      p(
        'Treu les fulles de fora de la col ({col}) i el tronc dur del mig, i talla-la a tires. Pela les patates ({patata}) i les pastanagues ({pastanaga}) ' +
          'i talla-les a daus. Pica la ceba ({ceba}) i els alls ({all}). Escorre i esbandeix els cigrons ({cigrons}).',
      ),
      c('En una olla a foc mitjà amb l’oli ({oli-oliva}), cou la ceba, l’all i la pastanaga fins que la ceba sigui tova.', 8, 'Ofegar la ceba'),
      c(
        'Afegeix-hi el tomàquet ({tomaquet-triturat}) i cou-lo fins que s’espesseixi. Treu l’olla del foc, afegeix-hi el pebre vermell ({pebre-vermell}) i el comí ({comi}) ' +
          'i remena 10 segons.',
        5,
        'Tomàquet',
      ),
      c(
        'Torna l’olla al foc i afegeix-hi el brou ({brou-verdures}), la col, les patates i la sal ({sal}). Quan bulli, abaixa el foc i cou-ho tapat fins que la patata sigui tendra.',
        20,
        'Coure la sopa',
      ),
      c(
        'Afegeix-hi els cigrons i cou-ho uns minuts més. Si vols un brou més espès, aixafa unes quantes patates contra la paret de l’olla amb la cullera.',
        5,
        'Cigrons',
      ),
    ],
  },

  // ——— Carn ———
  {
    id: 'filet-porc-poma',
    nom: 'Filet de porc amb poma',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['pure-patata', 'patates-adobades', 'arros-blanc', 'patates-fregides'],
    ingredients: [
      l('filet-porc', 800),
      l('poma', 3, 'u'),
      l('ceba', 1, 'u'),
      l('vi-blanc', 150),
      l('brou-pollastre', 200),
      l('farigola', 1),
      l('oli-oliva', 30),
      l('pebre-negre', 1),
      l('sal', 4),
    ],
    passos: [
      p(
        'Treu els filets de porc ({filet-porc}) de la nevera 15 minuts abans. Eixuga’ls amb paper de cuina i salpebra’ls per tot arreu amb la sal ({sal}) ' +
          'i el pebre ({pebre-negre}). Talla la ceba ({ceba}) a juliana. Pela les pomes ({poma}), treu-los el cor i talla-les a gallons.',
      ),
      c(
        'En una cassola ampla a foc fort amb l’oli ({oli-oliva}), daura els filets per tots els costats, sense moure’ls fins que facin crosta. Treu-los i reserva’ls.',
        6,
        'Daurar els filets',
      ),
      c('Abaixa el foc a mitjà i cou la ceba a la mateixa cassola fins que sigui tova i daurada.', 8, 'Ofegar la ceba'),
      c('Afegeix-hi la poma i la farigola ({farigola}) i cou-ho fins que la poma comenci a daurar-se.', 5, 'Poma'),
      c(
        'Aboca-hi el vi ({vi-blanc}) i deixa’l bullir 2 minuts. Afegeix-hi el brou ({brou-pollastre}) i torna-hi els filets amb el suc que hagin deixat anar. ' +
          'Tapa-ho i cou-ho a foc baix. A dins han de quedar lleugerament rosats: si els punxes, el suc ha de sortir transparent, no vermell.',
        12,
        'Coure els filets',
      ),
      p(
        'Deixa reposar els filets 5 minuts fora de la cassola (així no perden el suc en tallar-los) i talla’ls a medallons d’un dit de gruix. ' +
          'Serveix-los amb la poma i la salsa per sobre.',
      ),
    ],
  },
  {
    id: 'galtes-vi-negre',
    nom: 'Galtes de porc al vi negre',
    racions: 4,
    tempsMinuts: 160,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['pure-patata', 'patates-fregides', 'arros-blanc'],
    ingredients: [
      l('galtes-porc', 1000),
      l('vi-negre', 400),
      l('ceba', 2, 'u'),
      l('pastanaga', 2, 'u'),
      l('all', 3),
      l('tomaquet-triturat', 150),
      l('brou-pollastre', 300),
      l('llorer', 2),
      l('farigola', 1),
      l('farina', 15),
      l('oli-oliva', 40),
      l('pebre-negre', 1),
      l('sal', 6),
    ],
    passos: [
      p(
        'Demana a la carnisseria les galtes ({galtes-porc}) netes de greix i de la pell blanca (la membrana). Salpebra-les amb la sal ({sal}) i el pebre ({pebre-negre}) ' +
          'i passa-les per la farina ({farina}), espolsant-les perquè només en quedi una capa fina.',
      ),
      c(
        'En una olla o cassola gruixuda a foc fort amb l’oli ({oli-oliva}), daura les galtes per les dues bandes, en tandes perquè no es toquin. Treu-les i reserva-les.',
        8,
        'Daurar les galtes',
      ),
      c(
        'Pica les cebes ({ceba}), les pastanagues ({pastanaga}) i els alls ({all}) i cou-ho a foc mitjà a la mateixa olla, rascant el fons, fins que la ceba sigui tova i daurada.',
        12,
        'Sofregit',
      ),
      c('Afegeix-hi el tomàquet ({tomaquet-triturat}) i cou-lo fins que s’espesseixi.', 5, 'Tomàquet'),
      c('Aboca-hi el vi ({vi-negre}) i deixa’l bullir a foc fort perquè se’n vagi l’alcohol i es redueixi una mica.', 5, 'Reduir el vi'),
      c(
        'Torna-hi les galtes i afegeix-hi el brou ({brou-pollastre}), el llorer ({llorer}) i la farigola ({farigola}). El líquid les ha de cobrir gairebé: si no, afegeix-hi aigua. ' +
          'Tapa l’olla i cou-ho a foc molt baix, que només faci xup-xup, girant les galtes cada mitja hora. Són a punt quan es desfan amb la forquilla. ' +
          'A l’olla exprés, uns 40 minuts des que surt el vapor.',
        120,
        'Coure les galtes',
      ),
      p(
        'Treu les galtes i el llorer. Tritura la salsa amb la batedora (o passa-la pel colador xinès) perquè quedi fina, i si és clara, deixa-la bullir destapada ' +
          'fins que s’espesseixi. Torna-hi les galtes i escalfa-ho tot junt.',
      ),
    ],
  },
  {
    id: 'gall-dindi-estofat',
    nom: 'Gall dindi estofat amb verdures',
    racions: 4,
    tempsMinuts: 55,
    etiquetes: ['carn'],
    ingredients: [
      l('gall-dindi-daus', 600),
      l('patata', 3, 'u'),
      l('pastanaga', 3, 'u'),
      l('moniato', 1, 'u'),
      l('ceba', 1, 'u'),
      l('all', 2),
      l('vi-blanc', 100),
      l('brou-pollastre', 500),
      l('llorer', 1),
      l('pebre-vermell', 2),
      l('oli-oliva', 40),
      l('sal', 5),
    ],
    passos: [
      p(
        'Salpebra el gall dindi ({gall-dindi-daus}) amb la meitat de la sal ({sal:1/2}). Pica la ceba ({ceba}) i els alls ({all}). ' +
          'Pela les patates ({patata}), les pastanagues ({pastanaga}) i el moniato ({moniato}) i talla-ho tot a daus grossos (el moniato, més grossos, que es cou abans).',
      ),
      c('En una cassola a foc fort amb l’oli ({oli-oliva}), daura el gall dindi per tots els costats. Treu-lo i reserva’l.', 6, 'Daurar el gall dindi'),
      c('Abaixa el foc a mitjà i cou la ceba i l’all a la mateixa cassola fins que siguin tous.', 8, 'Ofegar la ceba'),
      p(
        'Treu la cassola del foc, afegeix-hi el pebre vermell ({pebre-vermell}) i remena 10 segons. Torna-la al foc, aboca-hi el vi ({vi-blanc}) i deixa’l bullir 2 minuts.',
      ),
      c(
        'Afegeix-hi el gall dindi, les verdures, el llorer ({llorer}), el brou ({brou-pollastre}) i la resta de la sal ({sal:1/2}). Tapa-ho i cou-ho a foc baix ' +
          'fins que les patates siguin tendres. Remena-ho poc, movent la cassola, perquè no es trenquin.',
        25,
        'Estofar',
      ),
      p('Treu el llorer i deixa-ho reposar 5 minuts abans de servir: la salsa s’espesseix.'),
    ],
  },
  {
    id: 'magret-fruits-vermells',
    nom: 'Magret d’ànec amb salsa de fruits vermells',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['pure-patata', 'patates-adobades', 'patates-fregides'],
    ingredients: [
      l('magret', 2),
      l('fruits-vermells', 250),
      l('mel', 20),
      l('vinagre', 20),
      l('pebre-negre', 1),
      l('sal', 3),
    ],
    passos: [
      p(
        'Treu els magrets ({magret}) de la nevera 20 minuts abans. Amb un ganivet ben esmolat, fes talls en creu a la pell, separats un dit, ' +
          'sense arribar a la carn. Salpebra’ls per les dues bandes amb la sal ({sal}) i el pebre ({pebre-negre}).',
      ),
      c(
        'Posa’ls amb la pell avall en una paella freda, sense oli, i encén el foc a mitjà. El greix es va fonent: treu-lo amb una cullera de tant en tant ' +
          '(guarda’l, és bo per fer patates). Són a punt quan la pell és ben daurada i cruixent.',
        10,
        'Magret: pell',
      ),
      c('Gira’ls i cou-los per la banda de la carn. Han de quedar rosats per dins.', 4, 'Magret: carn'),
      p('Posa’ls en una post, amb la pell amunt, i deixa’ls reposar 5 minuts tapats amb paper d’alumini.'),
      c(
        'Mentrestant, treu el greix de la paella i deixa’n només una cullerada. Afegeix-hi els fruits vermells ({fruits-vermells}) congelats, la mel ({mel}) ' +
          'i el vinagre ({vinagre}) i cou-ho a foc mitjà, aixafant una mica la fruita, fins que sigui una salsa espessa.',
        6,
        'Salsa',
      ),
      p('Talla els magrets a llesques d’un dit, de través, i serveix-los amb la salsa per sobre.'),
    ],
  },
  {
    id: 'xai-txilindron',
    nom: 'Xai al txilindron',
    racions: 4,
    tempsMinuts: 105,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['patates-fregides', 'arros-blanc', 'pa-amb-tomaquet'],
    ingredients: [
      l('xai-guisar', 1000),
      l('ceba', 2, 'u'),
      l('pebrot-vermell', 2, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('all', 3),
      l('taquets-pernil', 80),
      l('pebrot-xoricer', 30),
      l('tomaquet-triturat', 400),
      l('vi-blanc', 150),
      l('oli-oliva', 50),
      l('sal', 6),
    ],
    passos: [
      p(
        'Salpebra el xai ({xai-guisar}) amb la sal ({sal}). Talla les cebes ({ceba}) i els pebrots ({pebrot-vermell}, {pebrot-verd}) a tires i pica els alls ({all}).',
      ),
      c(
        'En una cassola a foc fort amb l’oli ({oli-oliva}), daura el xai per tots els costats, en tandes perquè no bulli en el seu suc. Treu-lo i reserva’l.',
        10,
        'Daurar el xai',
      ),
      c(
        'Abaixa el foc a mitjà i cou la ceba i els pebrots a la mateixa cassola fins que siguin ben tous. Afegeix-hi l’all i el pernil ({taquets-pernil}) i remena 2 minuts.',
        15,
        'Sofregit',
      ),
      c(
        'Afegeix-hi la carn de pebrot xoricer ({pebrot-xoricer}) i el tomàquet ({tomaquet-triturat}) i cou-ho fins que s’espesseixi. Aboca-hi el vi ({vi-blanc}) i deixa’l bullir 2 minuts.',
        8,
        'Tomàquet i vi',
      ),
      c(
        'Torna-hi el xai i afegeix-hi aigua fins a mig cobrir-lo. Tapa la cassola i cou-ho a foc baix, remenant de tant en tant, fins que la carn sigui tendra ' +
          'i se separi de l’os. Si la salsa s’asseca, afegeix-hi una mica d’aigua.',
        60,
        'Guisar el xai',
      ),
    ],
  },
  {
    id: 'guatlles-escabetx',
    nom: 'Guatlles en escabetx',
    racions: 4,
    tempsMinuts: 70,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['amanida', 'patates-fregides', 'pure-patata'],
    ingredients: [
      l('guatlles', 6),
      l('ceba', 2, 'u'),
      l('pastanaga', 2, 'u'),
      l('all', 6),
      l('llorer', 3),
      l('farigola', 1),
      l('pebre-negre', 2),
      l('vinagre', 120),
      l('vi-blanc', 150),
      l('oli-oliva', 150),
      l('sal', 5),
    ],
    passos: [
      p(
        'Repassa les guatlles ({guatlles}) per si hi queda alguna ploma i eixuga-les. Salpebra-les per dins i per fora amb la sal ({sal}) i el pebre ({pebre-negre}). ' +
          'Talla les cebes ({ceba}) a juliana i les pastanagues ({pastanaga}) a rodanxes. Pela els alls ({all}) i deixa’ls sencers.',
      ),
      c('En una cassola a foc mitjà-alt amb l’oli ({oli-oliva}), daura les guatlles per tots els costats. Treu-les i reserva-les.', 8, 'Daurar les guatlles'),
      c('Abaixa el foc i cou a la mateixa cassola la ceba, la pastanaga i els alls fins que la ceba sigui tova.', 8, 'Verdures'),
      c(
        'Torna-hi les guatlles i afegeix-hi el llorer ({llorer}), la farigola ({farigola}), el vinagre ({vinagre}), el vi ({vi-blanc}) i un got d’aigua (uns 150 ml). ' +
          'Tapa-ho i cou-ho a foc baix, girant les guatlles a la meitat, fins que la carn se separi de l’os.',
        35,
        'Escabetx',
      ),
      p(
        'Deixa-les reposar dins de l’escabetx almenys 15 minuts abans de menjar-les: l’escabetx és millor tebi que bullent, i encara és més bo d’un dia per l’altre ' +
          '(a la nevera aguanta 4 dies). Serveix cada guatlla amb verdures i una mica del suc.',
      ),
    ],
  },

  // ——— Peix ———
  {
    id: 'salmo-pesto-ruca',
    nom: 'Salmó amb pesto de ruca',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['peix'],
    ambAcompanyament: true,
    acompanyaments: ['arros-blanc', 'patates-adobades', 'pure-patata', 'verdures-saltejades'],
    aparells: ['batedora'],
    ingredients: [
      l('salmo', 600),
      l('ruca', 80),
      l('parmesa', 40),
      l('pinyons', 30),
      l('all', 1),
      l('llimona', 1, 'u'),
      l('oli-oliva', 90),
      l('sal', 4),
    ],
    passos: [
      c('Torra els pinyons ({pinyons}) en una paella seca a foc mitjà, remenant, fins que siguin daurats. Vigila que no es cremin: passa de cop.', 2, 'Torrar els pinyons'),
      p(
        'Pesto: posa al got de la batedora la ruca ({ruca}), el parmesà ({parmesa}), els pinyons, l’all ({all}) pelat, el suc de mitja llimona ({llimona:1/2}), ' +
          'tres quarts de l’oli ({oli-oliva:3/4}) i una mica de la sal ({sal:1/4}). Tritura-ho fins que sigui una pasta. Si és massa espessa, un raig més d’oli.',
      ),
      p('Eixuga el salmó ({salmo}) amb paper de cuina i sala’l amb la resta de la sal ({sal:3/4}).'),
      c(
        'Escalfa una paella antiadherent a foc mitjà-alt amb la resta de l’oli ({oli-oliva:1/4}) i posa-hi el salmó amb la pell avall. No el moguis fins que la pell sigui cruixent.',
        4,
        'Salmó: pell',
      ),
      c('Gira’l i cou-lo per l’altra banda. A dins ha de quedar sucós: es veu rosat al centre.', 3, 'Salmó: carn'),
      p('Serveix el salmó amb una cullerada de pesto per sobre i la resta de la llimona a gallons.'),
    ],
  },
  {
    id: 'orada-sal',
    nom: 'Orada a la sal',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['peix'],
    ambAcompanyament: true,
    acompanyaments: ['patates-adobades', 'amanida', 'verdures-saltejades', 'pure-patata'],
    aparells: ['forn'],
    ingredients: [l('orada-sencera', 2), l('sal-gruixuda', 2000), l('llimona', 1, 'u'), l('oli-oliva', 30)],
    passos: [
      p(
        'Encén el forn a 200 °C. Renta les orades ({orada-sencera}) i eixuga-les. Si encara tenen les escates, millor no treure-les: protegeixen la carn de la sal. ' +
          'Posa unes rodanxes de llimona ({llimona}) dins del ventre de cada peix.',
      ),
      p(
        'En un bol, barreja la sal ({sal-gruixuda}) amb mig got d’aigua: ha de quedar com sorra mullada. Fes un llit d’un dit de gruix a la safata del forn, ' +
          'posa-hi les orades i cobreix-les amb la resta de la sal, prement amb les mans, que no es vegi gens de peix.',
      ),
      c(
        'Posa-ho al forn. Per a orades d’uns 450 g, uns 25 minuts; si són més grosses, 5 minuts més per cada 100 g.',
        25,
        'Orada al forn',
      ),
      p(
        'Trenca la crosta de sal amb el mànec d’un ganivet i treu-la. Treu la pell del peix (sortirà amb la sal) i separa els lloms de l’espina amb una cullera i una forquilla. ' +
          'Serveix-los amb un fil d’oli ({oli-oliva}). No cal sal: ja n’ha agafat prou.',
      ),
    ],
  },
  {
    id: 'llobarro-forn-porro',
    nom: 'Llobarro al forn amb patates i porro',
    racions: 4,
    tempsMinuts: 55,
    etiquetes: ['peix'],
    aparells: ['forn'],
    ingredients: [
      l('llobarro', 2),
      l('patata', 4, 'u'),
      l('porro', 2, 'u'),
      l('llimona', 1, 'u'),
      l('vi-blanc', 100),
      l('all', 2),
      l('julivert', 10),
      l('oli-oliva', 60),
      l('sal', 5),
    ],
    passos: [
      p(
        'Encén el forn a 200 °C. Pela les patates ({patata}) i talla-les a rodanxes fines, de mig centímetre. Renta els porros ({porro}) i talla’ls a rodanxes.',
      ),
      c(
        'Posa les patates i el porro en una safata de forn, amaneix-ho amb la meitat de l’oli ({oli-oliva:1/2}) i la meitat de la sal ({sal:1/2}), remena-ho i ' +
          'estén-ho. Enforna-ho fins que les patates siguin gairebé tendres.',
        25,
        'Patates al forn',
      ),
      p(
        'Sala els llobarros ({llobarro}) per dins i per fora amb la resta de la sal ({sal:1/2}). Posa’ls oberts sobre les patates, amb la pell avall, ' +
          'i posa-hi unes rodanxes de llimona ({llimona}). Rega-ho amb el vi ({vi-blanc}).',
      ),
      c('Torna-ho al forn fins que la carn del peix sigui blanca i se separi de l’espina.', 15, 'Llobarro al forn'),
      p(
        'Mentrestant, pica els alls ({all}) i el julivert ({julivert}) i daura’ls un minut en una paella petita amb la resta de l’oli ({oli-oliva:1/2}). ' +
          'Tira aquest oli per sobre del peix en treure’l del forn.',
      ),
    ],
  },
  {
    id: 'tonyina-encebada',
    nom: 'Tonyina encebada',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['peix'],
    ambAcompanyament: true,
    acompanyaments: ['arros-blanc', 'patates-fregides', 'pure-patata'],
    ingredients: [
      l('tonyina-fresca', 500),
      l('ceba', 4, 'u'),
      l('all', 3),
      l('llorer', 2),
      l('vi-blanc', 100),
      l('pebre-vermell', 2),
      l('oli-oliva', 60),
      l('sal', 5),
    ],
    passos: [
      p('Talla les cebes ({ceba}) a juliana fina i lamina els alls ({all}). Talla la tonyina ({tonyina-fresca}) a daus de 3 cm i sala-la amb una quarta part de la sal ({sal:1/4}).'),
      c(
        'En una cassola ampla a foc baix amb l’oli ({oli-oliva}), cou la ceba amb la resta de la sal ({sal:3/4}) i el llorer ({llorer}), remenant de tant en tant, ' +
          'fins que sigui molt tova, melosa i daurada. Ha d’anar a poc a poc: si es torra, amarga.',
        25,
        'Encebat',
      ),
      p(
        'Afegeix-hi l’all i remena 2 minuts. Treu la cassola del foc, afegeix-hi el pebre vermell ({pebre-vermell}), remena 10 segons, torna-la al foc ' +
          'i aboca-hi el vi ({vi-blanc}). Deixa’l bullir 2 minuts.',
      ),
      c(
        'Puja el foc a mitjà, posa-hi la tonyina i cou-la, girant-la, només fins que per fora sigui blanca i per dins encara rosada: ' +
          'la tonyina massa cuita queda seca. Tapa-ho i deixa-ho reposar 2 minuts fora del foc.',
        4,
        'Tonyina',
      ),
    ],
  },
  {
    id: 'calamarsons-planxa',
    nom: 'Calamarsons a la planxa amb all i julivert',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['peix'],
    ambAcompanyament: true,
    acompanyaments: ['amanida', 'patates-fregides', 'arros-blanc', 'pa-amb-tomaquet'],
    ingredients: [l('calamarsons', 600), l('all', 3), l('julivert', 10), l('llimona', 1, 'u'), l('oli-oliva', 60), l('sal', 5)],
    passos: [
      p(
        'Si són congelats, descongela’ls a la nevera la nit abans. Esbandeix els calamarsons ({calamarsons}) i eixuga’ls molt bé amb paper de cuina: ' +
          'si són molls, en lloc de fer-se a la planxa bullen i queden durs.',
      ),
      p('Pica molt fins els alls ({all}) i el julivert ({julivert}) i barreja’ls en un bol amb tres quarts de l’oli ({oli-oliva:3/4}).'),
      c(
        'Escalfa una planxa o una paella a foc fort, ben calenta, amb la resta de l’oli ({oli-oliva:1/4}). Posa-hi els calamarsons en una sola capa, en tandes, ' +
          'tira-hi la sal ({sal}) i no els moguis fins que siguin daurats per sota. Gira’ls i fes l’altra banda.',
        3,
        'Una tanda',
      ),
      p('Posa’ls en una plata, tira-hi l’oli d’all i julivert per sobre i serveix-los amb la llimona ({llimona}) a gallons.'),
    ],
  },
];
