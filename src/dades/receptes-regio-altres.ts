import type { Recepta } from '../domini';
import { c, l, p } from './ajudants';

// Cuina tradicional d'Astúries, Madrid, Castella i València (recopilatori d'octubre de 2026).
// Quantitats per a 4 racions normals.

export const receptesAltresRegions: Recepta[] = [
  {
    id: 'fabada',
    nom: 'Fabada asturiana',
    racions: 4,
    tempsMinuts: 170,
    etiquetes: ['llegums', 'carn'],
    ingredients: [
      l('mongetes-seques', 400),
      l('compango', 250),
      l('cansalada-fresca', 100),
      l('colorant', 1),
      l('sal', 3),
    ],
    passos: [
      p(
        'La nit abans, posa les mongetes ({mongetes-seques}) en remull amb el triple d’aigua freda (si trobes fabes asturianes, millor). ' +
          'Si el compango ({compango}) és molt salat, posa’l també en remull, en un bol a part.',
      ),
      c(
        'Escorre les mongetes i posa-les en una olla ampla amb el compango (xoriço, morcilla i cansalada) i la cansalada fresca ({cansalada-fresca}). ' +
          'Cobreix-ho amb aigua freda just dos dits per sobre i porta-ho a bullir a foc mitjà. Treu l’escuma que surti.',
        15,
        'Arrencar el bull',
      ),
      c(
        'Afegeix-hi el colorant ({colorant}), abaixa el foc perquè bulli molt suaument i cou-ho destapat. No remenis amb cullera (les fabes es trenquen): ' +
          'mou l’olla pels nanses de tant en tant. Cada 20-30 minuts, «espanta-les» amb un raig d’aigua freda perquè la pell no s’arrugui. ' +
          'Són fetes quan són mantegoses i es desfan a la boca.',
        140,
        'Coure la fabada',
      ),
      p(
        'Tasta’n el brou i afegeix-hi la sal ({sal}) només si cal. Treu les carns, talla-les a trossos i torna-les a l’olla, o serveix-les en una plata a part. ' +
          'Deixa-la reposar 15 minuts abans de servir: el brou espesseix.',
      ),
    ],
  },
  {
    id: 'cocido-madrileny',
    nom: 'Cocido madrileny',
    racions: 4,
    tempsMinuts: 200,
    etiquetes: ['llegums', 'carn', 'sopa'],
    ingredients: [
      l('cigrons-secs', 320),
      l('vedella-estofar', 300),
      l('pollastre-trossos', 400),
      l('cansalada-fresca', 100),
      l('os-blanc-salat', 350),
      l('xorico', 150),
      l('botifarra-negra', 280),
      l('patata', 4, 'u'),
      l('pastanaga', 2, 'u'),
      l('col', 600),
      l('all', 2),
      l('fideus-fins', 120),
      l('oli-oliva', 30),
      l('sal', 15),
    ],
    passos: [
      p(
        'La nit abans, posa els cigrons ({cigrons-secs}) en remull amb el triple d’aigua i la meitat de la sal ({sal:1/2}). Posa l’os blanc ({os-blanc-salat}) ' +
          'en un altre bol amb aigua freda.',
      ),
      c(
        'En una olla gran, posa la vedella ({vedella-estofar}), el pollastre ({pollastre-trossos}), la cansalada ({cansalada-fresca}) i l’os amb 3,5 litres d’aigua, ' +
          'i porta-ho a bullir. Treu l’escuma fins que el brou quedi net.',
        15,
        'Escumar el brou',
      ),
      c(
        'Afegeix-hi els cigrons escorreguts amb l’aigua bullint (si es refreda, s’endureixen), abaixa el foc perquè bulli suau i cou-ho tapat amb una escletxa.',
        120,
        'Coure els cigrons',
      ),
      c(
        'Afegeix-hi les patates ({patata}) pelades i senceres i les pastanagues ({pastanaga}) pelades.',
        25,
        'Patata i pastanaga',
      ),
      c(
        'Mentrestant, en una altra olla, cou el xoriço ({xorico}), la botifarra negra ({botifarra-negra}) i la col ({col}) tallada a tires amb aigua i un pessic de sal ' +
          '(a part perquè el brou no quedi vermell). Escorre la col; daura l’all ({all}) laminat a l’oli ({oli-oliva}) i salteja-hi la col.',
        25,
        'Col i embotits',
      ),
      c(
        'Cola el brou de l’olla gran en un cassó i tasta’l amb la resta de la sal ({sal:1/2}). Porta’l a bullir i cou-hi els fideus ({fideus-fins}).',
        5,
        'Sopa de fideus',
      ),
      p(
        'Es menja en tres «vuelcos»: primer la sopa de fideus; després els cigrons amb les patates, la pastanaga i la col; i al final les carns i els embotits, a trossos.',
      ),
    ],
  },
  {
    id: 'pisto-ou',
    nom: 'Pisto manxec amb ou',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['verdura', 'ou', 'vegetaria'],
    ingredients: [
      l('carbasso', 2, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('pebrot-verd', 2, 'u'),
      l('ceba', 2, 'u'),
      l('tomaquet', 1000),
      l('all', 2),
      l('ou', 4),
      l('sucre', 5),
      l('oli-oliva', 60),
      l('sal', 8),
      l('pa-pages', 300),
    ],
    passos: [
      p(
        'Talla les verdures a daus d’1 cm, cada una en un bol: la ceba ({ceba}), els pebrots ({pebrot-vermell}, {pebrot-verd}) i el carbassó ({carbasso}). ' +
          'Pela i pica els alls ({all}). Ratlla els tomàquets ({tomaquet}) i llença la pell.',
      ),
      c(
        'En una cassola ampla a foc mitjà amb l’oli ({oli-oliva}), cou la ceba i l’all fins que siguin tous. Afegeix-hi els pebrots i cou-los fins que s’estovin.',
        15,
        'Ceba i pebrots',
      ),
      c('Afegeix-hi el carbassó i la sal ({sal}) i cou-ho fins que sigui tendre.', 10, 'Carbassó'),
      c(
        'Afegeix-hi el tomàquet i el sucre ({sucre}) i cou-ho a foc suau, remenant de tant en tant, fins que el tomàquet sigui una salsa espessa i ' +
          'totes les verdures siguin toves.',
        20,
        'Tomàquet',
      ),
      c(
        'Fes 4 clots al pisto i trenca-hi els ous ({ou}). Tapa la cassola i cou-ho a foc baix fins que les clares siguin quallades i els rovells encara líquids.',
        5,
        'Quallar els ous',
      ),
      p('Serveix-lo amb el pa ({pa-pages}) per sucar.'),
    ],
  },
  {
    id: 'ous-trencats-pernil',
    nom: 'Ous trencats amb pernil (huevos rotos)',
    racions: 4,
    tempsMinuts: 35,
    etiquetes: ['ou', 'carn'],
    ingredients: [
      l('patata', 1000),
      l('ou', 8),
      l('pernil-serra', 160),
      l('oli-girasol', 500),
      l('oli-oliva', 30),
      l('sal', 6),
    ],
    passos: [
      p('Pela les patates ({patata}) i talla-les a bastons gruixuts, d’1 cm. Renta-les amb aigua freda i eixuga-les molt bé amb un drap.'),
      c(
        'Escalfa l’oli de gira-sol ({oli-girasol}) en una paella fonda a foc mitjà i fregeix-hi les patates en dues tandes, sense que es daurin, fins que siguin toves.',
        8,
        'Primera fregida',
      ),
      c(
        'Treu-les, puja el foc a fort i, quan l’oli sigui molt calent, torna-les a fregir fins que siguin daurades i cruixents. Treu-les a paper de cuina i sala-les ' +
          '({sal}). Reparteix-les en una plata.',
        4,
        'Segona fregida',
      ),
      c(
        'En una paella petita amb l’oli d’oliva ({oli-oliva}) a foc mitjà-fort, fregeix els ous ({ou}) d’un en un fins que la clara sigui quallada i el rovell ' +
          'líquid. Posa’ls sobre les patates.',
        1,
        'Ou ferrat',
      ),
      p(
        'Posa el pernil ({pernil-serra}) per sobre i, a taula, trenca els ous amb una forquilla i remena-ho tot perquè el rovell faci de salsa.',
      ),
    ],
  },
  {
    id: 'sopa-castellana',
    nom: 'Sopa castellana d’all',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['sopa', 'ou', 'carn'],
    ingredients: [
      l('pa-barra', 200),
      l('all', 6),
      l('taquets-pernil', 100),
      l('pebre-vermell', 3),
      l('brou-pollastre', 1500),
      l('ou', 4),
      l('oli-oliva', 60),
      l('sal', 2),
    ],
    passos: [
      p('Talla el pa ({pa-barra}) (millor si és del dia abans) a llesques fines. Pela els alls ({all}) i talla’ls a làmines.'),
      c(
        'En una cassola a foc baix amb l’oli ({oli-oliva}), cou els alls fins que siguin rossos. Afegeix-hi el pernil ({taquets-pernil}) i el pa i remena ' +
          'fins que el pa sigui torrat.',
        6,
        'Daurar all i pa',
      ),
      p('Treu la cassola del foc, afegeix-hi el pebre vermell ({pebre-vermell}) i remena 10 segons (es crema de seguida). Aboca-hi el brou ({brou-pollastre}).'),
      c(
        'Porta-ho a bullir i cou-ho a foc suau, remenant de tant en tant, fins que el pa es desfaci i la sopa espesseixi. Tasta-la de sal ({sal}).',
        12,
        'Coure la sopa',
      ),
      c(
        'Trenca els ous ({ou}) dins la sopa, separats, i deixa’ls coure a foc suau sense remenar fins que la clara sigui blanca. Serveix-la ben calenta, amb un ou per plat.',
        4,
        'Escalfar els ous',
      ),
    ],
  },
  {
    id: 'croquetes-pernil',
    nom: 'Croquetes de pernil',
    racions: 4,
    tempsMinuts: 210,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['amanida'],
    ingredients: [
      l('llet', 750),
      l('farina', 100),
      l('mantega', 80),
      l('taquets-pernil', 150),
      l('ceba', 75),
      l('nou-moscada', 1),
      l('ou', 2),
      l('pa-ratllat', 150),
      l('oli-girasol', 500),
    ],
    passos: [
      p('Pica el pernil ({taquets-pernil}) a trossets molt petits i la ceba ({ceba}) ben fina. Escalfa la llet ({llet}) sense que bulli.'),
      c(
        'En una cassola a foc mitjà-baix, fon la mantega ({mantega}) i cou-hi la ceba fins que sigui transparent. Afegeix-hi el pernil i remena un minut. ' +
          'Afegeix-hi la farina ({farina}) i remena sense parar perquè es torri i perdi el gust de cru, sense que es dauri.',
        4,
        'Torrar la farina',
      ),
      c(
        'Aboca-hi la llet calenta a poc a poc, un cullerot cada vegada, remenant amb una vareta fins que s’integri abans d’afegir-ne més. ' +
          'Afegeix-hi la nou moscada ({nou-moscada}). Quan hi sigui tota, canvia a una cullera de fusta i cou-ho a foc baix, sense parar de remenar, ' +
          'fins que la massa es desenganxi de les parets de la cassola.',
        15,
        'Fer la beixamel',
      ),
      c(
        'Estén la massa en una plata, tapa-la amb paper film tocant la superfície (si no, fa crosta) i deixa-la refredar; després a la nevera fins que sigui ferma.',
        150,
        'Refredar la massa',
      ),
      p(
        'Amb dues culleres, fes porcions com una nou i dona’ls forma allargada amb les mans. Passa-les per l’ou ({ou}) batut i després pel pa ratllat ' +
          '({pa-ratllat}). Es poden congelar ara, separades en una safata.',
      ),
      c(
        'Escalfa l’oli ({oli-girasol}) en un cassó a foc fort: ha de cobrir les croquetes. Fregeix-les en tandes de 5 o 6 fins que siguin daurades. ' +
          'Si l’oli no és prou calent, es rebenten. Treu-les a paper de cuina.',
        2,
        'Fregir una tanda',
      ),
    ],
  },
  {
    id: 'ensaladilla-russa',
    nom: 'Ensaladilla russa',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['peix', 'ou', 'verdura'],
    ingredients: [
      l('patata', 800),
      l('pastanaga', 2, 'u'),
      l('pesols', 150),
      l('ou', 4),
      l('tonyina', 240),
      l('olives-negres', 60),
      l('oli-girasol', 250),
      l('llimona', 1, 'u'),
      l('sal', 10),
    ],
    passos: [
      c(
        'Renta les patates ({patata}) i posa-les senceres i amb pell en una olla amb aigua freda, la pastanaga ({pastanaga}) pelada i la sal ({sal}). ' +
          'Porta-ho a bullir i cou-ho fins que un ganivet entri a les patates sense resistència.',
        25,
        'Bullir les patates',
      ),
      c(
        'Els últims 10 minuts, afegeix a l’olla tres dels ous ({ou:3/4}) i els pèsols ({pesols}) en un colador petit, o cou-los a part.',
        10,
        'Ous i pèsols',
      ),
      p('Escorre-ho i deixa-ho refredar. Pela les patates i els ous. Talla les patates i la pastanaga a daus petits i pica els ous.'),
      p(
        'Maionesa: posa al got de la batedora l’ou que queda ({ou:1/4}), el suc de mitja llimona ({llimona:1/2}), un pessic de sal i l’oli ({oli-girasol}). ' +
          'Posa la batedora al fons, engega-la sense moure-la fins que s’emulsioni i després puja-la a poc a poc. Tasta-la i afegeix-hi més suc de llimona ' +
          '({llimona:1/2}) si cal.',
      ),
      p(
        'Barreja les patates, la pastanaga, els pèsols, l’ou, la tonyina ({tonyina}) escorreguda i dos terços de la maionesa. Posa-ho en una plata, ' +
          'cobreix-ho amb la resta de la maionesa i decora-ho amb les olives ({olives-negres}).',
      ),
      c('Guarda-la a la nevera perquè es refredi i es posi ferma.', 15, 'Refredar'),
    ],
  },
  {
    id: 'pollastre-pepitoria',
    nom: 'Pollastre en pepitòria',
    racions: 4,
    tempsMinuts: 70,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    acompanyaments: ['arros-blanc', 'patates-fregides', 'pure-patata'],
    ingredients: [
      l('pollastre-trossos', 1200),
      l('ceba', 1, 'u'),
      l('all', 3),
      l('ametlles', 40),
      l('ou', 2),
      l('vi-blanc', 150),
      l('brou-pollastre', 400),
      l('farina', 20),
      l('colorant', 1),
      l('llorer', 1),
      l('oli-oliva', 60),
      l('sal', 10),
    ],
    passos: [
      c(
        'Posa els ous ({ou}) en un cassó amb aigua freda, porta’ls a bullir i compta 10 minuts. Refreda’ls i pela’ls. Mentrestant, sala el pollastre ' +
          '({pollastre-trossos}) amb la sal ({sal}) i passa’l per la farina ({farina}).',
        10,
        'Ous durs',
      ),
      c(
        'En una cassola a foc mitjà-fort amb l’oli ({oli-oliva}), daura els alls ({all}) pelats sencers i les ametlles ({ametlles}) un minut, i treu-los. ' +
          'Daura-hi el pollastre en tandes. Treu-lo.',
        12,
        'Daurar',
      ),
      c('Abaixa el foc i cou-hi la ceba ({ceba}) pelada i picada fins que sigui tova i daurada.', 10, 'Ofegar la ceba'),
      c(
        'Torna-hi el pollastre, aboca-hi el vi ({vi-blanc}) i deixa’l bullir 2 minuts. Afegeix-hi el brou ({brou-pollastre}), el colorant ({colorant}) ' +
          'i el llorer ({llorer}), tapa i cou-ho a foc suau fins que el pollastre sigui tendre.',
        30,
        'Coure el pollastre',
      ),
      p(
        'Al morter o amb la batedora, tritura els alls, les ametlles i els rovells dels ous amb un cullerot del suc de la cassola fins que sigui una pasta. ' +
          'Afegeix-la a la cassola, remena i cou-ho 5 minuts perquè la salsa espesseixi.',
      ),
      p('Serveix-lo amb les clares d’ou picades per sobre i l’acompanyament.'),
    ],
  },
  {
    id: 'arros-forn',
    nom: 'Arròs al forn',
    racions: 4,
    tempsMinuts: 80,
    etiquetes: ['arros', 'carn', 'llegums'],
    ingredients: [
      l('arros', 320),
      l('costella-porc', 400),
      l('botifarra-negra', 280),
      l('cansalada-fresca', 100),
      l('cigrons', 400),
      l('patata', 1, 'u'),
      l('tomaquet', 2, 'u'),
      l('all', 12),
      l('brou-pollastre', 800),
      l('pebre-vermell', 2),
      l('colorant', 1),
      l('oli-oliva', 60),
      l('sal', 8),
    ],
    passos: [
      p(
        'Encén el forn a 220 °C. Talla la costella ({costella-porc}) a trossos petits, la cansalada ({cansalada-fresca}) a daus i la botifarra negra ' +
          '({botifarra-negra}) a trossos de 3 cm. Pela la patata ({patata}) i talla-la a rodanxes d’1 cm. Talla un dels tomàquets ({tomaquet:1/2}) a rodanxes ' +
          'i ratlla l’altre ({tomaquet:1/2}). Fes servir els alls ({all}) com un cap d’all sencer, sense pelar.',
      ),
      c(
        'En una cassola de fang (o una cassola que pugui anar al forn) a foc mitjà amb l’oli ({oli-oliva}), fregeix les patates fins que siguin daurades i treu-les. ' +
          'Daura-hi el cap d’all i les rodanxes de tomàquet i treu-los.',
        10,
        'Patates i all',
      ),
      c(
        'A la mateixa cassola, daura la costella i la cansalada. Afegeix-hi la botifarra un minut, i treu-la perquè no es desfaci.',
        10,
        'Daurar la carn',
      ),
      p(
        'Afegeix-hi el tomàquet ratllat i cou-lo 3 minuts. Afegeix-hi el pebre vermell ({pebre-vermell}), remena 10 segons i afegeix-hi l’arròs ({arros}) ' +
          'i els cigrons ({cigrons}) escorreguts. Remena un minut perquè l’arròs es torri. Escalfa el brou ({brou-pollastre}) amb el colorant ({colorant}) i la sal ({sal}).',
      ),
      p(
        'Escampa bé l’arròs per la cassola i, a sobre, col·loca les patates, la botifarra, les rodanxes de tomàquet i el cap d’all al mig. ' +
          'Aboca-hi el brou bullent per un costat.',
      ),
      c(
        'Enforna-ho a mitja altura fins que l’arròs hagi xuclat tot el brou i sigui al punt. No ho remenis. Deixa’l reposar 5 minuts fora del forn.',
        20,
        'Arròs al forn',
      ),
    ],
  },
];
