import type { Recepta } from '../domini';
import { c, l, p } from './ajudants';

// Plats econòmics de carn i peix (recull d'octubre de 2026): talls barats (contracuixes i ales de pollastre,
// costelles de coll, salsitxes, botifarra), peix blau, pescadilla i musclos. Quantitats per a 4 racions normals.

export const receptesEconomiquesCarnPeix: Recepta[] = [
  // Pollastre
  {
    id: 'cuixes-pollastre-forn',
    nom: 'Contracuixes de pollastre al forn amb patates i ceba',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['carn'],
    ingredients: [
      l('cuixes-pollastre', 900),
      l('patata', 900),
      l('ceba', 2, 'u'),
      l('all', 4),
      l('llimona', 1, 'u'),
      l('farigola', 2),
      l('pebre-vermell', 2),
      l('oli-oliva', 50),
      l('sal', 10),
    ],
    passos: [
      p(
        'Encén el forn a 200 °C. Pela les patates ({patata}) i talla-les a rodanxes de mig centímetre. Pela les cebes ({ceba}) i talla-les a gallons. ' +
          'Esclafa els alls ({all}) amb la pell.',
      ),
      p(
        'Posa les patates, la ceba i els alls a la safata amb la meitat de l’oli ({oli-oliva:1/2}) i la meitat de la sal ({sal:1/2}), i remena-ho amb les mans. ' +
          'Unta les contracuixes ({cuixes-pollastre}) amb la resta de l’oli ({oli-oliva:1/2}), la sal ({sal:1/2}), el pebre vermell ({pebre-vermell}) i la farigola ({farigola}), ' +
          'i posa-les a sobre. Rega-ho amb el suc de la llimona ({llimona}).',
      ),
      c(
        'Enforna-ho a mitja altura. A la meitat, gira el pollastre i remena les patates. És fet quan el pollastre és daurat i, en punxar-lo, el suc surt transparent; ' +
          'les patates han de ser toves.',
        45,
        'Pollastre al forn',
      ),
    ],
  },
  {
    id: 'pollastre-jardinera',
    nom: 'Pollastre a la jardinera',
    racions: 4,
    tempsMinuts: 55,
    etiquetes: ['carn', 'verdura'],
    ingredients: [
      l('cuixes-pollastre', 900),
      l('patata', 3, 'u'),
      l('pastanaga', 3, 'u'),
      l('pesols', 250),
      l('ceba', 1, 'u'),
      l('all', 2),
      l('tomaquet-triturat', 200),
      l('vi-blanc', 100),
      l('llorer', 1),
      l('oli-oliva', 40),
      l('sal', 10),
    ],
    passos: [
      p(
        'Talla les contracuixes ({cuixes-pollastre}) per la meitat i sala-les amb la sal ({sal}). Pela i pica la ceba ({ceba}) i els alls ({all}). ' +
          'Pela les pastanagues ({pastanaga}) i talla-les a rodanxes; pela les patates ({patata}) i trenca-les a daus.',
      ),
      c('En una cassola a foc mitjà-fort amb l’oli ({oli-oliva}), daura el pollastre per totes bandes. Treu-lo.', 10, 'Daurar el pollastre'),
      c('A la mateixa cassola, a foc mitjà, cou la ceba i l’all fins que siguin tous. Afegeix-hi el tomàquet ({tomaquet-triturat}) i cou-lo fins que espesseixi.', 10, 'Sofregit'),
      c(
        'Torna-hi el pollastre, aboca-hi el vi ({vi-blanc}) i deixa’l bullir un minut. Afegeix-hi la pastanaga, la patata, el llorer ({llorer}) i aigua just fins a cobrir. ' +
          'Tapa-ho i cou-ho a foc suau fins que la patata sigui tendra.',
        25,
        'Guisar',
      ),
      c('Afegeix-hi els pèsols ({pesols}) congelats, cou-ho destapat perquè la salsa es redueixi i tasta-ho de sal.', 5, 'Pèsols'),
    ],
  },
  {
    id: 'ales-pollastre-forn',
    nom: 'Ales de pollastre al forn amb all i llimona',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['arros-blanc', 'patates-fregides', 'patates-adobades', 'amanida'],
    ingredients: [
      l('ales-pollastre', 1200),
      l('all', 4),
      l('llimona', 1, 'u'),
      l('pebre-vermell', 3),
      l('orenga', 1),
      l('oli-oliva', 30),
      l('sal', 10),
    ],
    passos: [
      p(
        'Encén el forn a 220 °C. Si les ales ({ales-pollastre}) són senceres, talla-les per l’articulació en dos trossos i llença la punta (o guarda-la per a un brou). ' +
          'Si són congelades, descongela-les a la nevera la nit abans i eixuga-les bé: si són molles, no queden cruixents.',
      ),
      p(
        'En un bol gran, barreja els alls ({all}) ratllats, el suc de la llimona ({llimona}), el pebre vermell ({pebre-vermell}), l’orenga ({orenga}), l’oli ({oli-oliva}) ' +
          'i la sal ({sal}). Remena-hi les ales fins que quedin ben untades.',
      ),
      c(
        'Posa-les a la safata en una sola capa, amb la pell cap amunt, i enforna-les a la part de dalt. Gira-les a la meitat. Són fetes quan la pell és daurada i cruixent.',
        35,
        'Ales al forn',
      ),
      p('Serveix-les amb l’acompanyament.'),
    ],
  },
  {
    id: 'arros-pollastre',
    nom: 'Arròs amb pollastre i verdures',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['arros', 'carn'],
    ingredients: [
      l('arros', 320),
      l('pollastre-trossos', 800),
      l('pebrot-vermell', 1, 'u'),
      l('mongeta-tendra', 200),
      l('tomaquet', 2, 'u'),
      l('all', 3),
      l('pebre-vermell', 2),
      l('colorant', 1),
      l('oli-oliva', 50),
      l('sal', 10),
    ],
    passos: [
      p(
        'Demana el pollastre ({pollastre-trossos}) tallat a trossos petits i sala’l amb la meitat de la sal ({sal:1/2}). Talla el pebrot ({pebrot-vermell}) a tires i la mongeta ' +
          '({mongeta-tendra}) a trossos. Ratlla els tomàquets ({tomaquet}) i pica els alls ({all}).',
      ),
      c('En una paella ampla o una cassola a foc mitjà-fort amb l’oli ({oli-oliva}), daura el pollastre fins que sigui ben rossit per totes bandes.', 12, 'Daurar el pollastre'),
      c('Afegeix-hi el pebrot i la mongeta i salteja-ho 3 minuts. Afegeix-hi l’all i el tomàquet i cou-ho fins que sigui una pasta fosca.', 8, 'Sofregit'),
      p(
        'Afegeix-hi el pebre vermell ({pebre-vermell}) i remena 10 segons. Aboca-hi 1,1 litres d’aigua calenta, el colorant ({colorant}) i la resta de la sal ({sal:1/2}), ' +
          'i porta-ho a bullir 5 minuts perquè l’aigua agafi el gust del pollastre.',
      ),
      c('Escampa-hi l’arròs ({arros}) i, a partir d’ara, no el remenis. Cou-ho a foc fort 8 minuts i a foc mitjà la resta.', 17, 'Coure l’arròs'),
      c('Apaga el foc i deixa’l reposar tapat amb un drap.', 4, 'Reposar'),
    ],
  },
  {
    id: 'pollastre-encebat',
    nom: 'Pollastre encebat',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['arros-blanc', 'patates-fregides', 'pure-patata'],
    ingredients: [
      l('cuixes-pollastre', 900),
      l('ceba', 4, 'u'),
      l('all', 2),
      l('vi-blanc', 150),
      l('llorer', 2),
      l('oli-oliva', 50),
      l('sal', 10),
      l('pebre-negre', 1),
    ],
    passos: [
      p('Salpebra les contracuixes ({cuixes-pollastre}) amb la sal ({sal}) i el pebre ({pebre-negre}). Pela les cebes ({ceba}) i talla-les a tires fines. Pica els alls ({all}).'),
      c('En una cassola a foc mitjà-fort amb l’oli ({oli-oliva}), daura el pollastre per totes bandes. Treu-lo.', 10, 'Daurar el pollastre'),
      c(
        'Abaixa el foc, afegeix-hi la ceba, l’all i el llorer ({llorer}) i cou-ho tapat, remenant de tant en tant i rascant el fons, fins que la ceba sigui molt tova i daurada: ' +
          'la salsa és la ceba, no tinguis pressa.',
        25,
        'Ofegar la ceba',
      ),
      c(
        'Torna-hi el pollastre, aboca-hi el vi ({vi-blanc}) i mig got d’aigua, tapa-ho i cou-ho a foc suau fins que la carn es desenganxi amb facilitat.',
        20,
        'Coure el pollastre',
      ),
    ],
  },

  // Porc i embotits
  {
    id: 'patates-guisades-costella',
    nom: 'Patates guisades amb costella',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['carn'],
    ingredients: [
      l('costella-porc', 500),
      l('patata', 1000),
      l('ceba', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('tomaquet', 1, 'u'),
      l('all', 2),
      l('pebre-vermell', 3),
      l('llorer', 1),
      l('oli-oliva', 40),
      l('sal', 10),
    ],
    passos: [
      p('Sala la costella ({costella-porc}) amb una part de la sal. Pela i pica la ceba ({ceba}), el pebrot ({pebrot-verd}) i els alls ({all}). Ratlla el tomàquet ({tomaquet}).'),
      c('En una cassola a foc mitjà-fort amb l’oli ({oli-oliva}), daura la costella. Afegeix-hi la ceba, el pebrot i l’all i cou-ho fins que sigui tou.', 15, 'Daurar i sofregir'),
      p('Afegeix-hi el tomàquet i cou-lo 3 minuts. Treu la cassola del foc, afegeix-hi el pebre vermell ({pebre-vermell}) i remena.'),
      c(
        'Afegeix-hi aigua fins a cobrir la costella i el llorer ({llorer}), tapa-ho i cou-ho a foc suau perquè la carn s’estovi.',
        15,
        'Coure la costella',
      ),
      c(
        'Pela les patates ({patata}) i trenca-les a trossos (fent un tall i partint-les amb el ganivet: així espesseixen el suc). Afegeix-les amb la resta de la sal ({sal}), ' +
          'i aigua just fins a cobrir. Cou-ho fins que les patates siguin tendres.',
        20,
        'Coure les patates',
      ),
    ],
  },
  {
    id: 'farcellets-col',
    nom: 'Farcellets de col',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['carn', 'verdura'],
    ingredients: [
      l('col', 1, 'u'),
      l('carn-picada', 400),
      l('arros', 60),
      l('ou', 1),
      l('ceba', 1, 'u'),
      l('all', 2),
      l('tomaquet-triturat', 400),
      l('oli-oliva', 40),
      l('sal', 15),
      l('pebre-negre', 1),
    ],
    passos: [
      c(
        'Separa 12 fulles grans de la col ({col}) sense trencar-les. Bull-les en aigua amb sal fins que siguin flexibles. Escorre-les i retalla la part gruixuda del nervi central. ' +
          'La resta de la col es pot fer servir per a un altre plat.',
        5,
        'Escaldar les fulles',
      ),
      p(
        'Barreja la carn ({carn-picada}) amb l’arròs ({arros}) cru, l’ou ({ou}), la meitat de la ceba ({ceba:1/2}) i la meitat dels alls ({all:1/2}) picats, la sal ({sal}) i el pebre ({pebre-negre}). ' +
          'Posa una cullerada a cada fulla, plega els costats cap a dins i enrotlla-la ben tancada.',
      ),
      c(
        'En una cassola ampla amb l’oli ({oli-oliva}), cou la resta de la ceba ({ceba:1/2}) i dels alls ({all:1/2}) picats fins que siguin tous. Afegeix-hi el tomàquet ({tomaquet-triturat}) ' +
          'i un got d’aigua.',
        8,
        'Salsa',
      ),
      c(
        'Col·loca els farcellets a la salsa amb la juntura cap avall, ben junts perquè no s’obrin. Tapa-ho i cou-ho a foc suau fins que l’arròs del farciment sigui tou ' +
          '(talla’n un per comprovar-ho). Si s’asseca, afegeix-hi aigua.',
        35,
        'Coure els farcellets',
      ),
    ],
  },
  {
    id: 'salsitxes-encebades',
    nom: 'Salsitxes encebades amb vi',
    racions: 4,
    tempsMinuts: 35,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['pure-patata', 'patates-fregides', 'arros-blanc'],
    ingredients: [l('salsitxes', 600), l('ceba', 3, 'u'), l('vi-blanc', 150), l('llorer', 1), l('oli-oliva', 30), l('sal', 2)],
    passos: [
      p('Punxa les salsitxes ({salsitxes}) amb una forquilla. Pela les cebes ({ceba}) i talla-les a tires.'),
      c('En una cassola a foc mitjà amb l’oli ({oli-oliva}), daura les salsitxes per totes bandes. Treu-les.', 8, 'Daurar salsitxes'),
      c('A la mateixa cassola, cou la ceba amb el llorer ({llorer}) i la sal ({sal}), remenant, fins que sigui tova i daurada.', 15, 'Ofegar la ceba'),
      c('Torna-hi les salsitxes, aboca-hi el vi ({vi-blanc}) i cou-ho destapat fins que el vi es redueixi i quedi una salsa curta.', 8, 'Reduir el vi'),
    ],
  },
  {
    id: 'botifarra-ceba-patates',
    nom: 'Botifarra amb ceba confitada i patates al caliu',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['carn'],
    ingredients: [
      l('botifarra', 600),
      l('patata', 1000),
      l('ceba', 3, 'u'),
      l('all', 2),
      l('oli-oliva', 50),
      l('sal', 8),
    ],
    passos: [
      p('Renta les patates ({patata}) i talla-les a quarts amb pell. Pela les cebes ({ceba}) i talla-les a tires fines. Pica els alls ({all}).'),
      c(
        'Posa les patates en una paella amb tapa amb la meitat de l’oli ({oli-oliva:1/2}), la sal ({sal}) i un got d’aigua. Tapa-ho i cou-ho a foc mitjà: l’aigua les cou i, ' +
          'quan s’evapora, es dauren a l’oli. Gira-les de tant en tant.',
        25,
        'Patates',
      ),
      c(
        'Mentrestant, en una altra paella a foc baix amb la resta de l’oli ({oli-oliva:1/2}), cou la ceba i l’all remenant de tant en tant, fins que siguin ben tous i daurats.',
        20,
        'Confitar la ceba',
      ),
      c(
        'Aparta la ceba a un costat de la paella, punxa la botifarra ({botifarra}) i cou-la girant-la sovint fins que sigui daurada i ferma. Serveix-la amb la ceba i les patates.',
        12,
        'Botifarra',
      ),
    ],
  },
  {
    id: 'costelles-coll-planxa',
    nom: 'Costelles de coll de porc a la planxa',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['patates-fregides', 'amanida', 'pure-patata', 'verdures-saltejades'],
    ingredients: [l('costelles-coll', 750), l('all', 2), l('julivert', 10), l('oli-oliva', 30), l('sal', 6)],
    passos: [
      p('Treu les costelles ({costelles-coll}) de la nevera 10 minuts abans i sala-les amb la sal ({sal}). Pica els alls ({all}) i el julivert ({julivert}) i barreja’ls amb l’oli ({oli-oliva}).'),
      c(
        'Escalfa una planxa o una paella a foc fort, sense oli. Cou les costelles en tandes, sense amuntegar-les, fins que siguin ben daurades. El coll és un tall amb greix: ' +
          'aguanta més cocció que el llom sense assecar-se. El cronòmetre és per a cada costat.',
        4,
        'Costelles: un costat',
      ),
      p('Serveix-les amb l’oli d’all i julivert per sobre i l’acompanyament.'),
    ],
  },
  {
    id: 'arros-frankfurts',
    nom: 'Arròs amb frankfurts i pèsols',
    racions: 4,
    tempsMinuts: 35,
    etiquetes: ['arros', 'carn'],
    ingredients: [
      l('arros', 300),
      l('frankfurts', 400),
      l('pesols', 200),
      l('ceba', 1, 'u'),
      l('tomaquet-fregit', 200),
      l('oli-oliva', 30),
      l('sal', 8),
    ],
    passos: [
      c('Bull l’arròs ({arros}) en aigua abundant amb la sal ({sal}). Els últims 4 minuts, afegeix-hi els pèsols ({pesols}). Escorre-ho.', 16, 'Bullir l’arròs'),
      c(
        'Mentrestant, talla els frankfurts ({frankfurts}) a rodanxes i pica la ceba ({ceba}). En una paella ampla amb l’oli ({oli-oliva}), cou la ceba fins que sigui tova; ' +
          'afegeix-hi els frankfurts i daura’ls una mica.',
        8,
        'Frankfurts',
      ),
      p('Afegeix-hi el tomàquet fregit ({tomaquet-fregit}), l’arròs i els pèsols, i remena-ho a foc mitjà un parell de minuts perquè quedi tot barrejat i calent.'),
    ],
  },
  {
    id: 'patates-carn-picada',
    nom: 'Patates guisades amb carn picada',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['carn'],
    ingredients: [
      l('patata', 1000),
      l('carn-picada', 300),
      l('ceba', 1, 'u'),
      l('pastanaga', 1, 'u'),
      l('all', 2),
      l('tomaquet-triturat', 300),
      l('pebre-vermell', 2),
      l('oli-oliva', 40),
      l('sal', 10),
    ],
    passos: [
      p('Pela i pica la ceba ({ceba}), la pastanaga ({pastanaga}) i els alls ({all}). Pela les patates ({patata}) i trenca-les a trossos.'),
      c('En una cassola a foc mitjà amb l’oli ({oli-oliva}), cou la ceba, la pastanaga i l’all fins que siguin tous.', 8, 'Sofregit'),
      c(
        'Puja el foc, afegeix-hi la carn ({carn-picada}) i desfés-la amb una cullera fins que no quedi rosada. Afegeix-hi el pebre vermell ({pebre-vermell}) i el tomàquet ' +
          '({tomaquet-triturat}) i cou-ho fins que espesseixi.',
        8,
        'Carn picada',
      ),
      c('Afegeix-hi les patates, la sal ({sal}) i aigua just fins a cobrir. Tapa-ho i cou-ho a foc mitjà fins que les patates siguin tendres i el suc espès.', 25, 'Coure les patates'),
    ],
  },
  {
    id: 'migas',
    nom: 'Migas de pastor',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['carn'],
    ingredients: [
      l('pa-barra', 500),
      l('cansalada', 150),
      l('xorico', 150),
      l('all', 6),
      l('pebrot-verd', 2, 'u'),
      l('pebre-vermell', 2),
      l('oli-oliva', 80),
      l('sal', 4),
    ],
    passos: [
      p(
        'La nit abans o al matí, talla el pa ({pa-barra}) del dia anterior a daus petits (o esmicola’l), ruixa’l amb aigua i la sal ({sal}) dissolta, sense amarar-lo, ' +
          'i tapa’l amb un drap humit.',
      ),
      p('Talla la cansalada ({cansalada}) i el xoriço ({xorico}) a daus i els pebrots ({pebrot-verd}) a tires. Esclafa els alls ({all}) amb la pell.'),
      c(
        'En una paella gran a foc mitjà amb l’oli ({oli-oliva}), daura els alls, els pebrots, la cansalada i el xoriço. Treu-los a un plat, deixant el greix a la paella.',
        10,
        'Daurar la cansalada',
      ),
      c(
        'Afegeix-hi el pa i el pebre vermell ({pebre-vermell}) i remena sense parar a foc mitjà, tallant les migas amb l’espàtula, fins que siguin soltes, daurades i cruixents.',
        20,
        'Torrar les migas',
      ),
      p('Torna-hi la carn i els pebrots i remena-ho. Es mengen amb raïm, si en tens, o amb un ou ferrat.'),
    ],
  },

  // Peix i marisc
  {
    id: 'pastis-patata-tonyina',
    nom: 'Pastís de patata i tonyina',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['peix', 'ou'],
    ingredients: [
      l('patata', 1000),
      l('tonyina', 240),
      l('ou', 3),
      l('tomaquet-fregit', 200),
      l('formatge-ratllat', 80),
      l('llet', 100),
      l('mantega', 20),
      l('sal', 10),
    ],
    passos: [
      c(
        'Pela les patates ({patata}), trenca-les a trossos i bull-les en aigua amb la sal ({sal}) fins que es desfacin. Alhora, cou dos dels ous ({ou:2/3}) en un cassó: 10 minuts ' +
          'des que bulli l’aigua.',
        20,
        'Bullir patates i ous',
      ),
      p(
        'Encén el forn a 200 °C. Escorre les patates i aixafa-les amb la llet ({llet}) calenta, la mantega ({mantega}) i l’ou que queda ({ou:1/3}). Pela els ous durs i pica’ls. ' +
          'Barreja la tonyina ({tonyina}) escorreguda amb el tomàquet fregit ({tomaquet-fregit}) i l’ou dur.',
      ),
      p('En una safata, estén la meitat del puré, després la tonyina i, a sobre, la resta del puré. Escampa-hi el formatge ({formatge-ratllat}).'),
      c('Gratina-ho a la part de dalt del forn fins que sigui daurat.', 15, 'Gratinar'),
    ],
  },
  {
    id: 'sardines-forn-patates',
    nom: 'Sardines al forn amb patates',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['peix'],
    ingredients: [
      l('sardines', 800),
      l('patata', 800),
      l('ceba', 1, 'u'),
      l('all', 3),
      l('julivert', 10),
      l('llimona', 1, 'u'),
      l('oli-oliva', 60),
      l('sal', 10),
    ],
    passos: [
      p('Encén el forn a 200 °C. Pela les patates ({patata}) i talla-les a rodanxes fines. Pela la ceba ({ceba}) i talla-la a tires.'),
      c(
        'Posa les patates i la ceba a la safata amb la meitat de l’oli ({oli-oliva:1/2}), la meitat de la sal ({sal:1/2}) i un raig d’aigua, remena-ho i enforna-ho fins que les patates ' +
          'siguin gairebé toves.',
        25,
        'Patates al forn',
      ),
      p(
        'Mentrestant, renta les sardines ({sardines}) per dins i eixuga-les. Pica els alls ({all}) i el julivert ({julivert}) i barreja’ls amb la resta de l’oli ({oli-oliva:1/2}).',
      ),
      c(
        'Posa les sardines sobre les patates, sala-les ({sal:1/2}) i rega-les amb l’oli d’all i julivert. Enforna-ho fins que les sardines siguin opaques i es desenganxin de l’espina.',
        10,
        'Sardines al forn',
      ),
      p('Serveix-les amb la llimona ({llimona}) a gallons.'),
    ],
  },
  {
    id: 'pescadilla-romana',
    nom: 'Pescadilla a la romana',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['peix', 'ou'],
    ambAcompanyament: true,
    acompanyaments: ['amanida', 'pure-patata', 'patates-fregides'],
    ingredients: [
      l('pescadilla', 900),
      l('ou', 2),
      l('farina', 80),
      l('oli-girasol', 300),
      l('llimona', 1, 'u'),
      l('sal', 6),
    ],
    passos: [
      p(
        'Descongela la pescadilla ({pescadilla}) a la nevera la nit abans. Talla-la a rodanxes de 2 cm (l’espina central surt fàcilment un cop cuita) i eixuga-la molt bé. ' +
          'Sala-la amb la sal ({sal}).',
      ),
      c(
        'Escalfa l’oli ({oli-girasol}) en una paella fonda a foc mitjà-fort: ha de fer un dit de fondària. Passa cada rodanxa per la farina ({farina}), espolsa-la, i després ' +
          'pels ous ({ou}) batuts.',
        4,
        'Escalfar l’oli',
      ),
      c('Fregeix-les en tandes, girant-les una vegada, fins que l’arrebossat sigui daurat i el peix blanc per dins. Treu-les a paper de cuina.', 4, 'Fregir una tanda'),
      p('Serveix-les amb la llimona ({llimona}) a gallons i l’acompanyament.'),
    ],
  },
  {
    id: 'arros-musclos',
    nom: 'Arròs amb musclos',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['arros', 'peix'],
    ingredients: [
      l('arros', 320),
      l('musclos', 1500),
      l('ceba', 1, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('tomaquet', 2, 'u'),
      l('all', 3),
      l('pebre-vermell', 2),
      l('colorant', 1),
      l('oli-oliva', 50),
      l('sal', 4),
    ],
    passos: [
      p('Renta els musclos ({musclos}), rasca’ls i estira’ls la barba. Llença els trencats o oberts que no es tanquin en tocar-los.'),
      c(
        'Posa’ls en una olla amb un got d’aigua, tapa-la i cou-los a foc fort fins que s’obrin. Cola el suc i guarda’l. Treu la carn de la meitat dels musclos; ' +
          'la resta deixa’ls amb closca. Llença els que no s’hagin obert.',
        5,
        'Obrir els musclos',
      ),
      c(
        'Pica la ceba ({ceba}), el pebrot ({pebrot-vermell}) i els alls ({all}) i ratlla els tomàquets ({tomaquet}). En una cassola amb l’oli ({oli-oliva}), cou la ceba i el pebrot ' +
          'fins que siguin tous; afegeix-hi l’all i el tomàquet i cou-ho fins que sigui una pasta.',
        15,
        'Sofregit',
      ),
      p(
        'Afegeix-hi el pebre vermell ({pebre-vermell}) i l’arròs ({arros}) i remena un minut. Completa el suc dels musclos amb aigua fins a 1 litre i aboca-ho calent amb el colorant ' +
          '({colorant}). Tasta’l i posa-hi la sal ({sal}) que calgui: el suc dels musclos ja és salat.',
      ),
      c('Cou-ho a foc mitjà, sense remenar gaire, fins que l’arròs sigui al punt. Els últims 2 minuts, posa-hi els musclos.', 17, 'Coure l’arròs'),
    ],
  },
  {
    id: 'seitons-forn',
    nom: 'Seitons al forn amb all i julivert',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['peix'],
    ambAcompanyament: true,
    acompanyaments: ['amanida', 'patates-adobades', 'pa-amb-tomaquet'],
    ingredients: [
      l('seitons', 800),
      l('all', 4),
      l('julivert', 15),
      l('pa-ratllat', 40),
      l('llimona', 1, 'u'),
      l('oli-oliva', 50),
      l('sal', 6),
    ],
    passos: [
      p(
        'Encén el forn a 200 °C. Neteja els seitons ({seitons}): treu-los el cap i la tripa i, si vols, obre’ls en llibret traient l’espina amb els dits. Renta’ls i eixuga’ls.',
      ),
      p(
        'Posa’ls en una safata, ben junts, amb la pell cap avall. Sala’ls ({sal}). Pica els alls ({all}) i el julivert ({julivert}), barreja’ls amb el pa ratllat ({pa-ratllat}) ' +
          'i escampa-ho per sobre. Rega-ho amb l’oli ({oli-oliva}) i el suc de mitja llimona ({llimona:1/2}).',
      ),
      c('Enforna-ho a la part de dalt fins que el pa ratllat sigui daurat i els seitons blancs.', 10, 'Seitons al forn'),
      p('Serveix-los amb la resta de la llimona ({llimona:1/2}) i l’acompanyament.'),
    ],
  },
  {
    id: 'tonyina-tomaquet-patates',
    nom: 'Tonyina amb tomàquet i patates',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['peix'],
    ingredients: [
      l('tonyina', 240),
      l('patata', 1000),
      l('tomaquet-triturat', 400),
      l('ceba', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('all', 2),
      l('sucre', 5),
      l('oli-oliva', 40),
      l('sal', 10),
    ],
    passos: [
      c(
        'Pela les patates ({patata}), talla-les a daus de 2 cm i bull-les en aigua amb la sal ({sal}) fins que siguin tendres però senceres. Escorre-les.',
        15,
        'Bullir les patates',
      ),
      c(
        'Mentrestant, pica la ceba ({ceba}), el pebrot ({pebrot-verd}) i els alls ({all}) i cou-ho en una cassola a foc mitjà amb l’oli ({oli-oliva}) fins que sigui tou. ' +
          'Afegeix-hi el tomàquet ({tomaquet-triturat}) i el sucre ({sucre}) i cou-ho fins que espesseixi.',
        20,
        'Salsa de tomàquet',
      ),
      p('Afegeix-hi les patates i la tonyina ({tonyina}) escorreguda, a trossos, i remena amb compte un minut perquè s’escalfi tot.'),
    ],
  },
  {
    id: 'pizza-tonyina-ceba',
    nom: 'Pizza de tonyina i ceba',
    racions: 4,
    tempsMinuts: 120,
    etiquetes: ['peix'],
    ingredients: [
      l('farina-forca', 500),
      l('llevat', 7),
      l('tomaquet-triturat', 250),
      l('tonyina', 160),
      l('ceba', 2, 'u'),
      l('formatge-ratllat', 200),
      l('olives-negres', 50),
      l('orenga', 2),
      l('oli-oliva', 40),
      l('sal', 12),
    ],
    passos: [
      p(
        'Massa: barreja la farina ({farina-forca}), el llevat ({llevat}) i la sal ({sal}). Afegeix-hi 320 ml d’aigua tèbia i la meitat de l’oli ({oli-oliva:1/2}) i pasta-ho ' +
          'uns 8 minuts, fins que la massa sigui llisa i elàstica.',
      ),
      c('Fes-ne una bola, tapa-la i deixa-la en un lloc tebi fins que dobli el volum.', 60, 'Llevar la massa'),
      c(
        'Mentrestant, talla les cebes ({ceba}) a tires fines i cou-les en una paella a foc baix amb la resta de l’oli ({oli-oliva:1/2}) fins que siguin toves i dolces.',
        15,
        'Ofegar la ceba',
      ),
      p(
        'Encén el forn al màxim amb la safata a dins. Divideix la massa en dues i estira-les sobre paper de forn. Unta-les amb el tomàquet ({tomaquet-triturat}) i reparteix-hi ' +
          'la ceba, la tonyina ({tonyina}) escorreguda, el formatge ({formatge-ratllat}), les olives ({olives-negres}) i l’orenga ({orenga}).',
      ),
      c('Fes lliscar cada pizza sobre la safata calenta i cou-la a la part de baix fins que la vora sigui daurada.', 12, 'Pizza al forn'),
    ],
  },
  {
    id: 'carbasso-farcit',
    nom: 'Carbassons farcits de carn',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['carn', 'verdura'],
    ingredients: [
      l('carbasso', 4, 'u'),
      l('carn-picada', 350),
      l('ceba', 1, 'u'),
      l('all', 1),
      l('tomaquet-fregit', 200),
      l('formatge-ratllat', 80),
      l('oli-oliva', 30),
      l('sal', 6),
    ],
    passos: [
      p(
        'Encén el forn a 200 °C. Talla els carbassons ({carbasso}) per la meitat de llarg i buida’ls amb una cullereta, deixant mig centímetre de polpa enganxada a la pell. ' +
          'Pica la polpa, la ceba ({ceba}) i l’all ({all}).',
      ),
      c(
        'En una paella a foc mitjà amb l’oli ({oli-oliva}), cou la ceba, l’all i la polpa fins que perdin l’aigua. Afegeix-hi la carn ({carn-picada}) i la sal ({sal}), ' +
          'desfés-la i cou-la fins que no sigui rosada. Afegeix-hi el tomàquet fregit ({tomaquet-fregit}).',
        12,
        'Farciment',
      ),
      p('Omple les barques de carbassó, posa-les en una safata i escampa-hi el formatge ({formatge-ratllat}).'),
      c('Enforna-les fins que el carbassó sigui tendre (un ganivet hi entra fàcilment) i el formatge daurat.', 25, 'Carbassons al forn'),
    ],
  },
];
