import type { Recepta } from '../domini';
import { c, l, p } from './ajudants';

// Carns i peixos al forn o a la paella. Quantitats per a 4 racions normals.

export const receptesForn: Recepta[] = [
  {
    id: 'pollastre-forn-patates',
    nom: 'Pollastre al forn amb patates',
    racions: 4,
    tempsMinuts: 85,
    etiquetes: ['carn'],
    ingredients: [
      l('pollastre-trossos', 1400),
      l('patata', 1000),
      l('ceba', 2, 'u'),
      l('all', 4),
      l('vi-blanc', 150),
      l('farigola', 2),
      l('romani', 2),
      l('oli-oliva', 60),
      l('sal', 10),
      l('pebre-negre', 1),
    ],
    passos: [
      p('Encén el forn a 200 °C, amb escalfor a dalt i a baix.'),
      p(
        'Pela les patates ({patata}) i talla-les a rodanxes d’uns 5 mm. Pela les cebes ({ceba}) i talla-les a tires. Esclafa els grans d’all ({all}) ' +
          'amb el palmell, sense pelar-los.',
      ),
      p(
        'Escampa les patates i la ceba en una safata de forn gran, amb la meitat de la sal ({sal:1/2}) i la meitat de l’oli ({oli-oliva:1/2}). ' +
          'Remena-ho amb les mans perquè quedi tot untat.',
      ),
      p(
        'Sala els trossos de pollastre ({pollastre-trossos}) amb la resta de la sal ({sal:1/2}) i el pebre ({pebre-negre}), i posa’ls sobre les patates ' +
          'amb la pell cap amunt. Escampa-hi els alls, la farigola ({farigola}) i el romaní ({romani}), i rega-ho amb la resta de l’oli ({oli-oliva:1/2}) ' +
          'i el vi ({vi-blanc}).',
      ),
      c(
        'Enforna-ho a mitja altura. A la meitat del temps, rega el pollastre amb el suc de la safata amb una cullera.',
        40,
        'Pollastre al forn',
      ),
      c(
        'Puja el forn a 220 °C i deixa-ho fins que la pell del pollastre sigui daurada i cruixent i les patates toves. El pollastre és fet quan, ' +
          'en punxar la part més gruixuda de la cuixa, el suc que surt és transparent, no rosat.',
        20,
        'Daurar la pell',
      ),
      c('Treu la safata i deixa-la reposar abans de servir.', 5, 'Reposar'),
    ],
  },
  {
    id: 'llibrets-llom',
    nom: 'Llibrets de llom farcits de pernil i formatge',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    ingredients: [
      l('llom', 600),
      l('pernil-dolc', 120),
      l('formatge-llesques', 120),
      l('ou', 2),
      l('farina', 50),
      l('pa-ratllat', 150),
      l('oli-girasol', 150),
      l('sal', 4),
    ],
    passos: [
      p(
        'Necessites filets de llom ({llom}) prims, d’uns 3-4 mm (2 per persona). Si són gruixuts, posa’ls entre dos fulls de paper de forn i aixafa’ls ' +
          'amb un corró. Sala’ls amb la sal ({sal}).',
      ),
      p(
        'Posa la meitat dels filets en un taulell. Cobreix cadascun amb una llesca de pernil ({pernil-dolc}) i una de formatge ({formatge-llesques}), ' +
          'deixant 1 cm de vora lliure, i tapa’ls amb un altre filet. Pressiona les vores amb els dits perquè quedin enganxades.',
      ),
      p(
        'Prepara tres plats: un amb la farina ({farina}), un amb els ous ({ou}) batuts i un amb el pa ratllat ({pa-ratllat}). Passa cada llibret per farina, ' +
          'ou i pa ratllat, pressionant bé les vores perquè el formatge no s’escapi en fregir-lo.',
      ),
      c(
        'Escalfa l’oli de gira-sol ({oli-girasol}) en una paella ampla a foc mitjà-fort: ha de cobrir el fons uns 5 mm. És a punt quan una mica de pa ratllat ' +
          'hi bombolleja de seguida.',
        4,
        'Escalfar l’oli',
      ),
      c(
        'Fregeix els llibrets en tandes, sense amuntegar-los. Abaixa el foc a mitjà perquè es facin per dins sense cremar-se per fora: ' +
          'han de quedar daurats. El cronòmetre és per a cada costat.',
        3,
        'Fregir un costat',
      ),
      p(
        'Treu-los a paper de cuina. Talla’n un per comprovar que la carn és blanca per dins i el formatge fos; si no, torna’ls a la paella 1 minut per costat. ' +
          'Serveix-los amb l’acompanyament.',
      ),
    ],
  },
  {
    id: 'llom-pebre',
    nom: 'Llom amb salsa de pebre',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    ingredients: [
      l('llom', 800),
      l('nata', 200),
      l('brou-pollastre', 100),
      l('pebre-negre', 4),
      l('mantega', 20),
      l('oli-oliva', 20),
      l('sal', 4),
    ],
    passos: [
      p(
        'Si el pebre ({pebre-negre}) és en gra, posa’l en una bossa i trenca’l amb el cul d’un cassó: han de quedar trossets, no pols. ' +
          'Sala els filets de llom ({llom}) amb la sal ({sal}).',
      ),
      c(
        'Posa una paella gran a foc fort amb l’oli ({oli-oliva}). Quan sigui molt calent, cou-hi els filets en tandes, sense moure’ls, fins que siguin daurats. ' +
          'Han de quedar sucosos per dins, amb un punt lleugerament rosat. El cronòmetre és per a cada costat. Reserva’ls en un plat tapats amb alumini.',
        2,
        'Llom: un costat',
      ),
      c(
        'Abaixa el foc a mitjà, posa la mantega ({mantega}) a la mateixa paella i, quan es fongui, el pebre. Remena 30 segons. Aboca-hi el brou ({brou-pollastre}) ' +
          'i rasca el fons amb una cullera de fusta per desenganxar el que ha deixat la carn. Deixa-ho bullir fins que es redueixi a la meitat.',
        2,
        'Reduir el brou',
      ),
      c(
        'Afegeix-hi la nata ({nata}) i cou-ho a foc suau, remenant, fins que la salsa espesseixi i cobreixi el dors d’una cullera.',
        4,
        'Espessir la salsa',
      ),
      c(
        'Torna-hi el llom amb el suc que hagi deixat anar al plat i escalfa-ho tot junt, girant els filets perquè quedin coberts de salsa.',
        1,
        'Escalfar el llom',
      ),
    ],
  },
  {
    id: 'costelles-mel-mostassa',
    nom: 'Costelles de porc al forn amb mel i mostassa',
    racions: 4,
    tempsMinuts: 100,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    ingredients: [
      l('costella-porc', 1200),
      l('mel', 60),
      l('mostassa', 60),
      l('all', 2),
      l('llimona', 1, 'u'),
      l('oli-oliva', 30),
      l('sal', 8),
      l('pebre-negre', 1),
    ],
    passos: [
      p('Encén el forn a 180 °C, amb escalfor a dalt i a baix.'),
      p(
        'Sala la costella ({costella-porc}) per les dues bandes amb la sal ({sal}) i el pebre ({pebre-negre}). Posa-la en una safata de forn amb els ossos ' +
          'cap amunt, rega-la amb l’oli ({oli-oliva}) i tapa la safata amb paper d’alumini, ben ajustat.',
      ),
      c(
        'Enforna-la tapada a mitja altura: el vapor fa que la carn s’estovi.',
        60,
        'Costella tapada',
      ),
      p(
        'Mentrestant, fes la salsa: pela i ratlla o pica ben fins els alls ({all}) i barreja’ls en un bol amb la mel ({mel}), la mostassa ({mostassa}) ' +
          'i el suc de la llimona ({llimona}).',
      ),
      p(
        'Treu la safata, destapa-la (compte amb el vapor) i puja el forn a 200 °C. Gira la costella amb la carn cap amunt i pinta-la amb la meitat de la salsa.',
      ),
      c(
        'Torna-la al forn destapada. A la meitat del temps, pinta-la amb la resta de la salsa. És a punt quan és ben daurada i caramel·litzada i la carn ' +
          'se separa de l’os en estirar-la. Vigila els últims minuts: la mel es crema de pressa.',
        20,
        'Caramel·litzar',
      ),
      c('Deixa-la reposar 5 minuts i talla-la entre os i os.', 5, 'Reposar'),
    ],
  },
  {
    id: 'pollastre-llimona',
    nom: 'Pollastre amb llimona i herbes',
    racions: 4,
    tempsMinuts: 90,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    ingredients: [
      l('pollastre-trossos', 1200),
      l('llimona', 2, 'u'),
      l('all', 4),
      l('farigola', 2),
      l('romani', 2),
      l('oli-oliva', 50),
      l('sal', 8),
      l('pebre-negre', 1),
    ],
    passos: [
      p(
        'Renta les llimones ({llimona}). Ratlla la pell d’una (només la part groga: la blanca amarga) i esprem-ne el suc. L’altra, talla-la a rodanxes. ' +
          'Pela i pica els grans d’all ({all}).',
      ),
      c(
        'En un bol gran, barreja el suc i la pell ratllada de la llimona, l’all, la farigola ({farigola}), el romaní ({romani}), l’oli ({oli-oliva}), ' +
          'la sal ({sal}) i el pebre ({pebre-negre}). Afegeix-hi el pollastre ({pollastre-trossos}), remena perquè quedi ben untat i deixa’l marinar ' +
          'a la nevera, tapat.',
        30,
        'Marinar el pollastre',
      ),
      p('Encén el forn a 200 °C, amb escalfor a dalt i a baix.'),
      c(
        'Posa el pollastre en una safata de forn amb la pell cap amunt, aboca-hi la marinada i reparteix les rodanxes de llimona entre els trossos. ' +
          'Enforna-ho a mitja altura i, a la meitat del temps, rega’l amb el suc de la safata. És fet quan la pell és daurada i el suc de la cuixa surt transparent.',
        45,
        'Pollastre al forn',
      ),
      c('Deixa’l reposar abans de servir, amb el suc de la safata per sobre.', 5, 'Reposar'),
    ],
  },
  {
    id: 'lluc-forn',
    nom: 'Lluç al forn amb patates',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['peix'],
    ingredients: [
      l('lluc', 800),
      l('patata', 800),
      l('ceba', 1, 'u'),
      l('all', 2),
      l('julivert', 10),
      l('vi-blanc', 100),
      l('oli-oliva', 60),
      l('sal', 6),
    ],
    passos: [
      p('Encén el forn a 200 °C, amb escalfor a dalt i a baix. Si el lluç ({lluc}) és congelat, descongela’l a la nevera la nit abans.'),
      p(
        'Pela les patates ({patata}) i talla-les a rodanxes de 3-4 mm. Pela la ceba ({ceba}) i talla-la a tires fines. Escampa-ho en una safata de forn ' +
          'amb la meitat de l’oli ({oli-oliva:1/2}) i la meitat de la sal ({sal:1/2}), i remena-ho.',
      ),
      c(
        'Enforna-ho a mitja altura fins que les patates siguin gairebé toves (punxa’n una amb un ganivet).',
        25,
        'Patates al forn',
      ),
      p(
        'Mentrestant, asseca el lluç amb paper de cuina i sala’l amb la resta de la sal ({sal:1/2}). Pela i lamina els grans d’all ({all}) i pica el julivert ({julivert}).',
      ),
      c(
        'Treu la safata, posa el lluç sobre les patates amb la pell cap avall, escampa-hi l’all i el julivert, rega-ho amb el vi ({vi-blanc}) i la resta de l’oli ' +
          '({oli-oliva:1/2}) i torna-ho al forn. El lluç és fet quan és blanc i opac per dins i se separa en làmines (no el deixis més: s’asseca).',
        12,
        'Lluç al forn',
      ),
    ],
  },
  {
    id: 'hamburgueses',
    nom: 'Hamburgueses casolanes amb patates al forn',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['carn'],
    ingredients: [
      l('carn-picada', 700),
      l('ou', 1),
      l('pa-ratllat', 40),
      l('all', 1),
      l('pa-hamburguesa', 4),
      l('formatge-llesques', 100),
      l('tomaquet', 1, 'u'),
      l('patata', 1000),
      l('romani', 1),
      l('oli-oliva', 50),
      l('sal', 8),
      l('pebre-negre', 1),
    ],
    passos: [
      p('Encén el forn a 220 °C, amb escalfor a dalt i a baix.'),
      p(
        'Patates: renta les patates ({patata}) i talla-les, amb pell, a gallons. Escampa-les en una safata amb paper de forn, en una sola capa, ' +
          'amb la meitat de l’oli ({oli-oliva:1/2}), la meitat de la sal ({sal:1/2}) i el romaní ({romani}). Remena-les perquè quedin untades.',
      ),
      c(
        'Enforna-les a mitja altura. A la meitat del temps, gira-les. Han de quedar daurades per fora i toves per dins.',
        35,
        'Patates al forn',
      ),
      p(
        'Hamburgueses: pela i pica ben fi l’all ({all}). En un bol, barreja la carn picada ({carn-picada}), l’ou ({ou}), el pa ratllat ({pa-ratllat}), ' +
          'l’all, la resta de la sal ({sal:1/2}) i el pebre ({pebre-negre}). No la treballis gaire: si l’amasses massa, queda dura.',
      ),
      p(
        'Divideix la carn en tantes parts com panets ({pa-hamburguesa}) i fes-ne boles. Aixafa-les entre les mans fins que facin 1,5 cm de gruix i siguin ' +
          'una mica més amples que el panet (s’encongeixen). Fes un clotet amb el dit al centre perquè no s’inflin.',
      ),
      c(
        'Posa una paella o planxa a foc mitjà-fort amb la resta de l’oli ({oli-oliva:1/2}). Cou-hi les hamburgueses sense moure-les fins que siguin daurades ' +
          'per sota. El cronòmetre és per a cada costat.',
        4,
        'Hamburguesa: un costat',
      ),
      p(
        'Gira-les i, a la segona cara, posa-hi una llesca de formatge ({formatge-llesques}) a sobre perquè es fongui. Han de quedar cuites per dins, sense rosat.',
      ),
      p(
        'Obre els panets i torra’ls a la mateixa paella 1 minut per la part tallada. Talla el tomàquet ({tomaquet}) a rodanxes. Munta les hamburgueses ' +
          'i serveix-les amb les patates.',
      ),
    ],
  },
  {
    id: 'pastis-carn',
    nom: 'Pastís de carn amb puré de patata',
    racions: 4,
    tempsMinuts: 80,
    etiquetes: ['carn'],
    ingredients: [
      l('carn-picada', 600),
      l('ceba', 1, 'u'),
      l('pastanaga', 2, 'u'),
      l('tomaquet-triturat', 300),
      l('patata', 1000),
      l('llet', 150),
      l('mantega', 50),
      l('formatge-ratllat', 80),
      l('nou-moscada', 1),
      l('oli-oliva', 30),
      l('sal', 8),
      l('pebre-negre', 1),
    ],
    passos: [
      c(
        'Pela les patates ({patata}) i talla-les a trossos iguals. Posa-les en una olla amb aigua freda que les cobreixi i la meitat de la sal ({sal:1/2}). ' +
          'Quan bulli, cou-les fins que es desfacin en punxar-les.',
        20,
        'Bullir les patates',
      ),
      p('Mentrestant, pica la ceba ({ceba}) i pela i talla les pastanagues ({pastanaga}) a daus petits.'),
      c(
        'Posa una paella fonda a foc mitjà-baix amb l’oli ({oli-oliva}) i cou-hi la ceba i la pastanaga amb un pessic de sal fins que siguin toves.',
        10,
        'Ofegar les verdures',
      ),
      c(
        'Puja el foc a mitjà-fort, afegeix la carn picada ({carn-picada}) i esmicola-la amb la cullera fins que sigui daurada i sense líquid.',
        8,
        'Daurar la carn',
      ),
      c(
        'Afegeix-hi el tomàquet triturat ({tomaquet-triturat}), la resta de la sal ({sal:1/2}) i el pebre ({pebre-negre}), i cou-ho a foc baix ' +
          'fins que la salsa sigui espessa i no quedi líquid.',
        10,
        'Coure la carn',
      ),
      p('Encén el forn a 200 °C, amb escalfor a dalt i a baix.'),
      p(
        'Escorre les patates i aixafa-les amb un passapurés. Afegeix-hi la mantega ({mantega}), la llet ({llet}) calenta i la nou moscada ({nou-moscada}) ' +
          'i remena fins que quedi un puré fi.',
      ),
      p(
        'Escampa la carn al fons d’una safata de forn i cobreix-la amb el puré, allisant-lo amb una espàtula. Dibuixa-hi ratlles amb una forquilla ' +
          '(es dauraran) i escampa-hi el formatge ratllat ({formatge-ratllat}).',
      ),
      c('Enforna-ho a mitja altura fins que el formatge sigui fos i daurat.', 20, 'Gratinar el pastís'),
    ],
  },
];
