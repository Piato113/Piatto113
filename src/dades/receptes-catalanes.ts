import type { Recepta } from '../domini';
import { c, l, p } from './ajudants';

// Cuina catalana i de casa. Quantitats per a 4 racions normals.

/** Passos comuns per tallar la samfaina. */
const tallarSamfaina =
  'Talla les verdures: la ceba ({ceba}) a daus d’1 cm; els pebrots ({pebrot-vermell} de vermell i {pebrot-verd} de verd), ' +
  'sense llavors ni la part blanca, a daus d’1,5 cm; l’albergínia ({alberginia}) i el carbassó ({carbasso}), amb pell, a daus d’1,5 cm. ' +
  'Talla els tomàquets ({tomaquet}) per la meitat i ratlla’ls per la part tallada amb un ratllador gruixut, fins que només et quedi la pell a la mà; ' +
  'llença la pell. Pela els grans d’all ({all}) i pica’ls.';

export const receptesCatalanes: Recepta[] = [
  {
    id: 'pollastre-samfaina',
    nom: 'Pollastre amb samfaina',
    racions: 4,
    tempsMinuts: 100,
    etiquetes: ['carn', 'verdura'],
    ingredients: [
      l('pollastre-trossos', 1000),
      l('ceba', 2, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('alberginia', 1, 'u'),
      l('carbasso', 1, 'u'),
      l('tomaquet', 3, 'u'),
      l('all', 3),
      l('vi-blanc', 100),
      l('farigola', 1),
      l('oli-oliva', 60),
      l('sal', 8),
      l('pebre-negre', 1),
    ],
    passos: [
      p('Sala els trossos de pollastre ({pollastre-trossos}) amb la meitat de la sal ({sal:1/2}) i el pebre ({pebre-negre}).'),
      p(tallarSamfaina),
      c(
        'Posa una cassola ampla a foc mitjà-fort amb l’oli ({oli-oliva}). Quan sigui calent, daura-hi el pollastre, primer amb la pell cap avall, ' +
          'i gira’l fins que sigui daurat per tots els costats. Si no hi cap tot sense amuntegar-se, fes-ho en dues tandes. Treu-lo a un plat.',
        12,
        'Daurar el pollastre',
      ),
      c(
        'Abaixa el foc a mitjà-baix i posa la ceba al mateix oli amb un pessic de sal. Cou-la remenant de tant en tant, rascant el fons, ' +
          'fins que sigui tova i daurada.',
        10,
        'Ofegar la ceba',
      ),
      c('Afegeix l’all i els pebrots i cou-ho remenant fins que els pebrots siguin tous.', 8, 'Coure els pebrots'),
      c(
        'Afegeix l’albergínia i el carbassó i cou-ho remenant fins que comencin a estovar-se (l’albergínia xucla oli: si s’enganxa, posa-hi un raig d’aigua, no més oli).',
        8,
        'Coure albergínia i carbassó',
      ),
      c(
        'Afegeix el tomàquet ratllat, la farigola ({farigola}) i la resta de la sal ({sal:1/2}), i cou-ho fins que el tomàquet hagi perdut l’aigua.',
        8,
        'Coure el tomàquet',
      ),
      c(
        'Torna el pollastre a la cassola, aboca-hi el vi ({vi-blanc}) i deixa’l bullir 2 minuts a foc fort perquè s’evapori l’alcohol. ' +
          'Abaixa el foc al mínim, tapa la cassola i cou-ho remenant de tant en tant fins que el pollastre sigui tendre i la carn se separi de l’os. ' +
          'Si es queda sec, afegeix-hi un raig d’aigua.',
        30,
        'Guisar el pollastre',
      ),
      c('Aparta la cassola del foc i deixa-la reposar tapada abans de servir.', 5, 'Reposar'),
    ],
  },
  {
    id: 'botifarra-mongetes',
    nom: 'Botifarra amb mongetes seques',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['carn', 'llegums'],
    ingredients: [
      l('botifarra', 600),
      l('mongetes-cuites', 800),
      l('all', 2),
      l('julivert', 10),
      l('oli-oliva', 40),
      l('sal', 2),
    ],
    passos: [
      p(
        'Escorre les mongetes ({mongetes-cuites}) en un colador i renta-les amb aigua freda per treure’n el líquid espès del pot. Deixa-les escórrer.',
      ),
      p('Punxa les botifarres ({botifarra}) 3 o 4 vegades amb una forquilla perquè no rebentin en coure-les.'),
      c(
        'Posa una paella a foc mitjà amb la meitat de l’oli ({oli-oliva:1/2}) i cou-hi les botifarres, girant-les sovint, fins que siguin daurades ' +
          'per tot arreu i cuites per dins: si en talles una pel mig, no ha de quedar cap part rosada. Treu-les i tapa-les amb paper d’alumini.',
        15,
        'Coure les botifarres',
      ),
      p('Pela els grans d’all ({all}) i talla’ls a làmines fines. Renta el julivert ({julivert}), asseca’l i pica’l.'),
      c(
        'A la mateixa paella, a foc mitjà, posa la resta de l’oli ({oli-oliva:1/2}) i l’all. Quan l’all sigui daurat clar (1 minut), afegeix-hi ' +
          'les mongetes i la sal ({sal}). Salta-les girant-les amb una espàtula (si remenes amb força es trenquen) fins que siguin ben calentes ' +
          'i algunes s’hagin torrat lleugerament.',
        5,
        'Saltar les mongetes',
      ),
      p('Escampa-hi el julivert i serveix les mongetes amb la botifarra.'),
    ],
  },
  {
    id: 'fricando',
    nom: 'Fricandó de vedella amb bolets',
    racions: 4,
    tempsMinuts: 120,
    etiquetes: ['carn'],
    ingredients: [
      l('vedella-llata', 700),
      l('bolets', 300),
      l('ceba', 2, 'u'),
      l('tomaquet', 2, 'u'),
      l('all', 2),
      l('vi-blanc', 150),
      l('brou-pollastre', 400),
      l('farina', 40),
      l('llorer', 2),
      l('farigola', 1),
      l('oli-oliva', 60),
      l('sal', 6),
    ],
    passos: [
      p(
        'Sala els filets de vedella ({vedella-llata}) amb la meitat de la sal ({sal:1/2}). Posa la farina ({farina}) en un plat, passa-hi cada filet ' +
          'per les dues bandes i espolsa’l perquè només en quedi una capa fina.',
      ),
      c(
        'Posa una cassola a foc mitjà-fort amb l’oli ({oli-oliva}). Daura-hi els filets en tandes, sense amuntegar-los, només 1 minut per cada costat: ' +
          'no s’han de fer per dins, només agafar color. Reserva’ls en un plat. El cronòmetre és per a cada costat.',
        1,
        'Daurar un costat',
      ),
      p(
        'Pela la ceba ({ceba}) i pica-la ben fina. Pela els grans d’all ({all}) i pica’ls. Ratlla els tomàquets ({tomaquet}) per la part tallada ' +
          'amb un ratllador gruixut i llença’n la pell.',
      ),
      c(
        'Sofregit: abaixa el foc a baix i posa la ceba a la mateixa cassola (amb l’oli i la farina daurada que hi ha quedat) amb un pessic de sal. ' +
          'Cou-la remenant cada pocs minuts fins que sigui molt tova i de color marró fosc. Si s’enganxa, afegeix-hi una cullerada d’aigua i rasca el fons.',
        20,
        'Sofregir la ceba',
      ),
      c(
        'Afegeix l’all, remena 1 minut i afegeix el tomàquet. Cou-ho fins que el tomàquet hagi perdut tota l’aigua i quedi una pasta fosca.',
        10,
        'Sofregir el tomàquet',
      ),
      c(
        'Puja el foc, aboca-hi el vi ({vi-blanc}) i deixa’l bullir 2 minuts rascant el fons. Afegeix-hi el brou ({brou-pollastre}), el llorer ({llorer}), ' +
          'la farigola ({farigola}) i la carn. Quan bulli, abaixa el foc al mínim, tapa la cassola i cou fins que la carn sigui molt tendra. ' +
          'Remena de tant en tant perquè no s’enganxi.',
        45,
        'Guisar el fricandó',
      ),
      p(
        'Mentrestant, neteja els bolets ({bolets}) amb un drap humit o un pinzell (no els posis en remull). Els grossos, talla’ls per la meitat.',
      ),
      c(
        'Afegeix els bolets i la resta de la sal ({sal:1/2}) i cou-ho destapat fins que els bolets siguin cuits i la salsa s’hagi espessit. ' +
          'Treu les fulles de llorer abans de servir. (El fricandó és encara més bo l’endemà.)',
        15,
        'Coure els bolets',
      ),
    ],
  },
  {
    id: 'escalivada-tonyina',
    nom: 'Escalivada amb tonyina i torrades',
    racions: 4,
    tempsMinuts: 80,
    etiquetes: ['verdura', 'peix'],
    ingredients: [
      l('alberginia', 2, 'u'),
      l('pebrot-vermell', 3, 'u'),
      l('ceba', 2, 'u'),
      l('tonyina', 240),
      l('pa-pages', 400),
      l('all', 2),
      l('oli-oliva', 60),
      l('sal', 4),
    ],
    passos: [
      p('Encén el forn a 200 °C, amb escalfor a dalt i a baix.'),
      p(
        'Renta les albergínies ({alberginia}) i els pebrots ({pebrot-vermell}); les cebes ({ceba}) es couen senceres i amb pell. Punxa les albergínies ' +
          'en 3 o 4 llocs amb una forquilla perquè no rebentin. Posa-ho tot en una safata de forn i unta-ho amb una part de l’oli ({oli-oliva:1/3}).',
      ),
      c(
        'Enforna-ho a mitja altura i gira les verdures a la meitat del temps. Estan fetes quan l’albergínia és arrugada i molt tova en punxar-la, ' +
          'i els pebrots tenen la pell inflada i amb taques negres.',
        50,
        'Escalivar',
      ),
      c(
        'Posa les verdures calentes en un bol i tapa’l amb un plat: el vapor fa que després es pelin molt més fàcilment. Deixa-les refredar.',
        15,
        'Refredar tapat',
      ),
      p(
        'Pela-les amb les mans: treu la pell de les albergínies i dels pebrots, les llavors dels pebrots i la capa exterior de les cebes. ' +
          'Esqueixa-ho tot a tires d’1-2 cm. Guarda el suc que hagi quedat al bol.',
      ),
      p(
        'Posa les tires en una plata, amaneix-les amb la sal ({sal}), la resta de l’oli ({oli-oliva:2/3}) i el suc del bol. ' +
          'Escorre la tonyina ({tonyina}) i reparteix-la per sobre.',
      ),
      p(
        'Torrades: talla el pa ({pa-pages}) a llesques d’1,5 cm i torra-les a la torradora o sota el gratinador del forn fins que siguin daurades. ' +
          'Pela l’all ({all}), talla’l per la meitat i frega’l per sobre de les torrades calentes.',
      ),
    ],
  },
  {
    id: 'bacalla-samfaina',
    nom: 'Bacallà amb samfaina',
    racions: 4,
    tempsMinuts: 85,
    etiquetes: ['peix', 'verdura'],
    ingredients: [
      l('bacalla', 700),
      l('ceba', 2, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('alberginia', 1, 'u'),
      l('carbasso', 1, 'u'),
      l('tomaquet', 3, 'u'),
      l('all', 3),
      l('farina', 40),
      l('oli-oliva', 80),
      l('sal', 3),
    ],
    passos: [
      p(
        'Si el bacallà ({bacalla}) és congelat, descongela’l a la nevera la nit abans. Asseca’l bé amb paper de cuina. No el salis: el bacallà dessalat ' +
          'ja en té prou.',
      ),
      p(tallarSamfaina),
      c(
        'Samfaina: posa una cassola ampla a foc mitjà-baix amb la meitat de l’oli ({oli-oliva:1/2}). Afegeix-hi la ceba i la sal ({sal}) i cou-la ' +
          'remenant de tant en tant fins que sigui tova i daurada.',
        10,
        'Ofegar la ceba',
      ),
      c('Afegeix l’all i els pebrots i cou-ho fins que els pebrots siguin tous.', 8, 'Coure els pebrots'),
      c('Afegeix l’albergínia i el carbassó i cou-ho remenant fins que comencin a estovar-se.', 8, 'Coure albergínia i carbassó'),
      c(
        'Afegeix el tomàquet ratllat, tapa la cassola i cou-ho a foc baix, remenant de tant en tant, fins que totes les verdures siguin molt toves ' +
          'i melooses, gairebé confitades.',
        25,
        'Confitar la samfaina',
      ),
      c(
        'Mentrestant, passa els lloms de bacallà per la farina ({farina}) i espolsa’ls. Escalfa la resta de l’oli ({oli-oliva:1/2}) en una paella a foc mitjà ' +
          'i fregeix-los, primer per la banda de la pell, fins que siguin daurats. El cronòmetre és per a cada costat.',
        2,
        'Bacallà: un costat',
      ),
      c(
        'Posa el bacallà sobre la samfaina, tapa la cassola i cou-ho a foc baix perquè el peix s’acabi de fer i agafi el gust. ' +
          'És a punt quan es separa en làmines en pressionar-lo amb una forquilla.',
        5,
        'Acabar el bacallà',
      ),
    ],
  },
  {
    id: 'mandonguilles-sipia',
    nom: 'Mandonguilles amb sípia',
    racions: 4,
    tempsMinuts: 100,
    etiquetes: ['carn', 'peix'],
    ingredients: [
      l('carn-picada', 500),
      l('sipia', 400),
      l('ou', 1),
      l('pa-ratllat', 40),
      l('all', 3),
      l('julivert', 10),
      l('ceba', 2, 'u'),
      l('tomaquet', 2, 'u'),
      l('pesols', 200),
      l('vi-blanc', 100),
      l('brou-pollastre', 400),
      l('farina', 30),
      l('oli-oliva', 60),
      l('sal', 6),
    ],
    passos: [
      p(
        'Pela els grans d’all ({all}) i pica’ls ben fins. Renta i pica el julivert ({julivert}). En un bol, posa la carn picada ({carn-picada}), l’ou ({ou}), ' +
          'el pa ratllat ({pa-ratllat}), un terç de l’all, la meitat del julivert i la meitat de la sal ({sal:1/2}). Barreja-ho amb les mans fins que quedi homogeni.',
      ),
      p(
        'Amb les mans humides, fes boles d’uns 3-4 cm (com una nou grossa). Passa-les per la farina ({farina}) i espolsa-les.',
      ),
      c(
        'Posa una cassola a foc mitjà-fort amb l’oli ({oli-oliva}) i daura-hi les mandonguilles en tandes, girant-les perquè agafin color per tot arreu. ' +
          'No cal que es facin per dins. Reserva-les en un plat.',
        6,
        'Daurar mandonguilles',
      ),
      p('Renta la sípia ({sipia}), asseca-la i talla-la a daus de 2 cm. Pica la ceba ({ceba}) ben fina. Ratlla els tomàquets ({tomaquet}) i llença’n la pell.'),
      c(
        'Al mateix oli, a foc mitjà, cou-hi la sípia remenant: primer deixarà anar aigua; continua fins que s’evapori i es comenci a daurar.',
        6,
        'Daurar la sípia',
      ),
      c(
        'Afegeix-hi la ceba amb un pessic de sal, abaixa el foc a baix i cou-ho remenant de tant en tant fins que la ceba sigui tova i daurada.',
        15,
        'Sofregir la ceba',
      ),
      c(
        'Afegeix-hi la resta de l’all, remena 1 minut i afegeix el tomàquet. Cou-ho fins que sigui fosc i sense aigua.',
        8,
        'Sofregir el tomàquet',
      ),
      c(
        'Puja el foc, aboca-hi el vi ({vi-blanc}) i deixa’l bullir 2 minuts. Afegeix-hi el brou ({brou-pollastre}), les mandonguilles i la resta de la sal ({sal:1/2}). ' +
          'Quan bulli, abaixa el foc, tapa la cassola i cou-ho suaument fins que la sípia sigui tendra.',
        30,
        'Guisar',
      ),
      c(
        'Afegeix-hi els pèsols ({pesols}) congelats, directament, i cou-ho destapat fins que siguin tendres. Escampa-hi la resta del julivert.',
        8,
        'Coure els pèsols',
      ),
    ],
  },
  {
    id: 'mongetes-botifarra-esparracada',
    nom: 'Mongetes amb botifarra esparracada',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['carn', 'llegums'],
    ingredients: [
      l('mongetes-cuites', 800),
      l('botifarra', 400),
      l('all', 2),
      l('julivert', 10),
      l('oli-oliva', 40),
      l('sal', 2),
    ],
    passos: [
      p('Escorre les mongetes ({mongetes-cuites}) en un colador i renta-les amb aigua freda. Deixa-les escórrer.'),
      p(
        'Treu la pell de la botifarra ({botifarra}): fes-hi un tall de punta a punta i estira-la. Esmicola la carn amb les mans a trossets.',
      ),
      c(
        'Posa una paella gran a foc mitjà-fort amb la meitat de l’oli ({oli-oliva:1/2}). Cou-hi la botifarra, esmicolant-la amb la cullera, ' +
          'fins que sigui daurada i cuita (sense cap part rosada).',
        8,
        'Daurar la botifarra',
      ),
      c(
        'Pela i lamina els grans d’all ({all}). Afegeix-los a la paella amb la resta de l’oli ({oli-oliva:1/2}) i remena fins que siguin daurats clars.',
        1,
        'Daurar l’all',
      ),
      c(
        'Afegeix-hi les mongetes i la sal ({sal}). Salta-les girant-les amb una espàtula, sense remenar fort perquè no es trenquin, fins que siguin ben calentes ' +
          'i algunes s’hagin torrat.',
        6,
        'Saltar les mongetes',
      ),
      p('Renta i pica el julivert ({julivert}) i escampa’l per sobre abans de servir.'),
    ],
  },
  {
    id: 'arros-cassola-costella',
    nom: 'Arròs a la cassola amb costella',
    racions: 4,
    tempsMinuts: 85,
    etiquetes: ['arros', 'carn'],
    ingredients: [
      l('arros', 400),
      l('costella-porc', 600),
      l('ceba', 1, 'u'),
      l('pebrot-vermell', 1, 'u'),
      l('tomaquet', 2, 'u'),
      l('all', 3),
      l('brou-pollastre', 1400),
      l('pebre-vermell', 3),
      l('colorant', 1),
      l('oli-oliva', 60),
      l('sal', 6),
    ],
    passos: [
      p(
        'Talla la costella ({costella-porc}) a trossos d’uns 3 cm (pots demanar al carnisser que te la talli) i sala-la amb la meitat de la sal ({sal:1/2}). ' +
          'Pica la ceba ({ceba}). Treu les llavors del pebrot ({pebrot-vermell}) i talla’l a daus d’1 cm. Pela i pica els grans d’all ({all}). ' +
          'Ratlla els tomàquets ({tomaquet}) i llença’n la pell.',
      ),
      p('Escalfa el brou ({brou-pollastre}) en un cassó fins que bulli i deixa’l a foc mínim.'),
      c(
        'Posa una cassola de fang (o una cassola ampla) a foc mitjà-fort amb l’oli ({oli-oliva}) i daura-hi la costella per tots els costats.',
        10,
        'Daurar la costella',
      ),
      c(
        'Abaixa el foc a mitjà-baix, afegeix-hi la ceba i el pebrot amb un pessic de sal i cou-ho remenant fins que siguin tous i daurats.',
        12,
        'Sofregir ceba i pebrot',
      ),
      c(
        'Afegeix l’all, remena 1 minut i afegeix el tomàquet. Cou-ho fins que sigui fosc, espès i l’oli se separi per les vores.',
        8,
        'Sofregir el tomàquet',
      ),
      p(
        'Afegeix-hi el pebre vermell ({pebre-vermell}), remena 10 segons (es crema de seguida) i afegeix-hi l’arròs ({arros}). Remena 1 minut perquè ' +
          's’impregni del sofregit.',
      ),
      c(
        'Aboca-hi el brou calent i el colorant ({colorant}), remena una vegada per repartir l’arròs i tasta el brou: afegeix-hi la resta de la sal ({sal:1/2}) ' +
          'si cal. Cou-ho a foc fort sense remenar més.',
        10,
        'Arròs a foc fort',
      ),
      c(
        'Abaixa el foc a mitjà i cou-ho fins que el gra sigui tou. Ha de quedar una mica melós, amb un punt de suc (la cassola de fang continua coent fora del foc).',
        8,
        'Arròs a foc mitjà',
      ),
      c('Aparta la cassola del foc i deixa-la reposar abans de servir.', 5, 'Reposar l’arròs'),
    ],
  },
  {
    id: 'arros-negre',
    nom: 'Arròs negre amb allioli',
    racions: 4,
    tempsMinuts: 85,
    etiquetes: ['arros', 'peix'],
    ingredients: [
      l('arros', 400),
      l('sipia', 500),
      l('tinta-sipia', 8),
      l('ceba', 1, 'u'),
      l('pebrot-verd', 1, 'u'),
      l('tomaquet', 2, 'u'),
      l('all', 5),
      l('fumet', 1300),
      l('ou', 1),
      l('llimona', 1, 'u'),
      l('oli-oliva', 50),
      l('oli-girasol', 200),
      l('sal', 6),
    ],
    passos: [
      p(
        'Allioli (fes-lo primer perquè reposi a la nevera): treu l’ou ({ou}) de la nevera una estona abans. Pela una part dels alls ({all:2/5}) i posa’ls ' +
          'al got de la batedora amb l’ou, un pessic de sal i unes gotes de suc de la llimona ({llimona}). Aboca-hi l’oli de gira-sol ({oli-girasol}).',
      ),
      p(
        'Posa la batedora fins al fons del got, tocant-lo, i engega-la a velocitat mínima sense moure-la. Quan vegis que al fons es forma una crema blanca ' +
          'i va pujant, aixeca la batedora molt a poc a poc fins que tot l’oli s’hagi lligat. Si es talla (queda líquid), torna a començar amb un altre ou ' +
          'al got i afegeix-hi l’allioli tallat a poc a poc. Guarda’l a la nevera.',
      ),
      p(
        'Renta la sípia ({sipia}), asseca-la i talla-la a daus d’1 cm. Pica la ceba ({ceba}) i el pebrot ({pebrot-verd}) ben fins. Pela i pica la resta ' +
          'dels alls ({all:3/5}). Ratlla els tomàquets ({tomaquet}) i llença’n la pell.',
      ),
      p('Escalfa el fumet ({fumet}) en un cassó fins que bulli. Dissol-hi la tinta de sípia ({tinta-sipia}) remenant i deixa’l a foc mínim.'),
      c(
        'Posa la paella (d’uns 40 cm) a foc mitjà-fort amb l’oli d’oliva ({oli-oliva}) i cou-hi la sípia remenant, fins que deixi anar l’aigua, s’evapori ' +
          'i es comenci a daurar.',
        8,
        'Daurar la sípia',
      ),
      c(
        'Abaixa el foc a mitjà, afegeix la ceba i el pebrot amb un pessic de sal i cou-ho fins que siguin tous.',
        10,
        'Sofregir ceba i pebrot',
      ),
      c(
        'Afegeix l’all, remena 1 minut i afegeix el tomàquet. Cou-ho fins que sigui fosc i sense aigua.',
        6,
        'Sofregir el tomàquet',
      ),
      p('Afegeix-hi l’arròs ({arros}) i remena 1 minut perquè s’impregni del sofregit.'),
      c(
        'Aboca-hi el fumet negre calent, remena una sola vegada per repartir l’arròs per tota la paella i tasta’l: afegeix-hi la sal ({sal}) si cal. ' +
          'A partir d’ara, no remenis més. Cou-ho a foc fort.',
        8,
        'Arròs negre a foc fort',
      ),
      c('Abaixa a foc mitjà i cou-ho fins que l’arròs hagi absorbit el brou i el gra sigui tou.', 9, 'Arròs negre a foc mitjà'),
      c('Aparta la paella, tapa-la amb un drap net i deixa-la reposar. Serveix-la amb l’allioli a part.', 5, 'Reposar l’arròs'),
    ],
  },
  {
    id: 'pollastre-prunes-pinyons',
    nom: 'Pollastre rostit amb prunes i pinyons',
    racions: 4,
    tempsMinuts: 100,
    etiquetes: ['carn'],
    ingredients: [
      l('pollastre-trossos', 1200),
      l('prunes', 150),
      l('pinyons', 40),
      l('ceba', 2, 'u'),
      l('all', 2),
      l('vi-blanc', 150),
      l('brou-pollastre', 300),
      l('llorer', 1),
      l('farigola', 1),
      l('oli-oliva', 50),
      l('sal', 8),
      l('pebre-negre', 1),
    ],
    passos: [
      c('Posa les prunes ({prunes}) en un bol amb aigua tèbia perquè s’hidratin.', 20, 'Remull de les prunes'),
      p('Sala els trossos de pollastre ({pollastre-trossos}) amb la sal ({sal}) i el pebre ({pebre-negre}).'),
      c(
        'Posa una cassola ampla a foc mitjà-fort amb l’oli ({oli-oliva}) i daura-hi el pollastre, primer amb la pell cap avall, fins que sigui ben daurat ' +
          'per tots els costats. Treu-lo a un plat.',
        12,
        'Daurar el pollastre',
      ),
      p('Pela les cebes ({ceba}) i talla-les a juliana fina (tires primes). Pela els grans d’all ({all}) i lamina’ls.'),
      c(
        'Abaixa el foc a baix i posa la ceba a la cassola amb un pessic de sal. Cou-la remenant de tant en tant, rascant el fons, fins que sigui molt tova ' +
          'i de color caramel. Afegeix l’all els últims 2 minuts.',
        15,
        'Caramel·litzar la ceba',
      ),
      c(
        'Torna el pollastre a la cassola, puja el foc i aboca-hi el vi ({vi-blanc}). Deixa’l bullir 2 minuts. Afegeix-hi el brou ({brou-pollastre}), ' +
          'el llorer ({llorer}) i la farigola ({farigola}). Quan bulli, abaixa el foc al mínim i cou-ho tapat.',
        30,
        'Rostir tapat',
      ),
      c(
        'Mentrestant, torra els pinyons ({pinyons}) en una paella petita sense oli, a foc mitjà-baix, remenant sense parar fins que siguin daurats. ' +
          'Treu-los de seguida a un plat: es cremen en pocs segons.',
        3,
        'Torrar els pinyons',
      ),
      c(
        'Escorre les prunes i afegeix-les a la cassola amb els pinyons. Cou-ho destapat fins que la salsa s’espesseixi i el pollastre sigui ben tendre. ' +
          'Treu el llorer abans de servir.',
        10,
        'Acabar el rostit',
      ),
    ],
  },
  {
    id: 'patates-olot',
    nom: 'Patates d’Olot farcides de carn',
    racions: 4,
    tempsMinuts: 100,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    ingredients: [
      l('patata', 1000),
      l('carn-picada', 400),
      l('ceba', 1, 'u'),
      l('all', 1),
      l('ou', 2),
      l('farina', 150),
      l('oli-oliva', 20),
      l('oli-girasol', 200),
      l('sal', 8),
      l('pebre-negre', 1),
    ],
    passos: [
      c(
        'Renta les patates ({patata}) i posa-les senceres i amb pell en una olla amb aigua freda que les cobreixi i la meitat de la sal ({sal:1/2}). ' +
          'Porta-ho a ebullició i cou-les fins que la punta d’un ganivet les travessi sense resistència.',
        30,
        'Bullir les patates',
      ),
      p('Mentrestant, pela la ceba ({ceba}) i l’all ({all}) i pica’ls ben fins.'),
      c(
        'Farcit: posa una paella a foc mitjà-baix amb l’oli d’oliva ({oli-oliva}) i cou-hi la ceba fins que sigui tova i daurada. Afegeix l’all l’últim minut.',
        10,
        'Ofegar la ceba',
      ),
      c(
        'Puja el foc a mitjà-fort, afegeix la carn picada ({carn-picada}), un pessic de sal i el pebre ({pebre-negre}), i esmicola-la amb la cullera ' +
          'fins que sigui daurada i sense líquid. Deixa-la refredar.',
        8,
        'Daurar el farcit',
      ),
      p(
        'Escorre les patates i, encara calentes, pela-les (agafa-les amb un drap). Aixafa-les amb una forquilla o un passapurés fins que quedi un puré ' +
          'sense grumolls. Afegeix-hi la resta de la sal ({sal:1/2}) i barreja.',
      ),
      c('Deixa temperar el puré: ha de ser prou fred per poder-lo treballar amb les mans.', 10, 'Temperar el puré'),
      p(
        'Agafa una porció de puré de la mida d’una pilota de tennis petita, aplana-la al palmell i posa-hi una cullerada de farcit al centre. ' +
          'Tanca-la pujant les vores i dona-li forma de bola. Repeteix-ho fins que s’acabi el puré.',
      ),
      p(
        'Posa la farina ({farina}) en un plat i els ous ({ou}) batuts en un altre. Passa cada bola per farina, després per ou i un altre cop per farina.',
      ),
      c(
        'Escalfa l’oli de gira-sol ({oli-girasol}) en un cassó o paella fonda (uns 4 cm de fondària) a foc mitjà-fort, fins a uns 180 °C: una mica de farina ' +
          'hi ha de bombollejar de seguida. Fregeix les patates de 2 en 2 o de 3 en 3, girant-les, fins que siguin daurades per tot arreu. ' +
          'El cronòmetre és per a cada tanda.',
        4,
        'Fregir una tanda',
      ),
      p('Deixa-les sobre paper de cuina i serveix-les calentes amb l’acompanyament.'),
    ],
  },
  {
    id: 'escudella',
    nom: 'Escudella i carn d’olla',
    racions: 4,
    tempsMinuts: 180,
    etiquetes: ['sopa', 'carn', 'llegums'],
    ingredients: [
      l('vedella-estofar', 400),
      l('pollastre-trossos', 500),
      l('cansalada', 150),
      l('botifarra', 300),
      l('cigrons', 800),
      l('pastanaga', 3, 'u'),
      l('porro', 1, 'u'),
      l('patata', 3, 'u'),
      l('col', 600),
      l('galets', 250),
      l('carn-picada', 300),
      l('ou', 1),
      l('pa-ratllat', 40),
      l('all', 1),
      l('julivert', 10),
      l('sal', 15),
      l('pebre-negre', 1),
    ],
    passos: [
      c(
        'Posa en una olla gran la vedella ({vedella-estofar}), el pollastre ({pollastre-trossos}) i la cansalada ({cansalada}) amb aigua freda: 1 litre per persona. ' +
          'Posa-ho a foc fort. Quan comenci a bullir, sortirà una escuma grisa a la superfície: treu-la amb una escumadora fins que deixi de sortir.',
        10,
        'Escumar el brou',
      ),
      c('Abaixa el foc perquè bulli molt suaument, tapa l’olla deixant-hi una escletxa i cou-ho.', 60, 'Coure les carns'),
      p(
        'Pilota: pela i pica l’all ({all}) i el julivert ({julivert}). En un bol, barreja la carn picada ({carn-picada}), l’ou ({ou}), el pa ratllat ({pa-ratllat}), ' +
          'l’all, el julivert, un pessic de sal i el pebre ({pebre-negre}). Fes-ne dues pilotes allargades, com un fus.',
      ),
      c(
        'Pela les pastanagues ({pastanaga}) i deixa-les senceres. Neteja el porro ({porro}) i lliga’l amb un fil perquè no es desfaci. Afegeix-los a l’olla ' +
          'amb les pilotes.',
        30,
        'Coure pilotes i verdures',
      ),
      c(
        'Pela les patates ({patata}) i talla-les per la meitat. Talla la col ({col}) a quarts. Escorre i renta els cigrons ({cigrons}). Afegeix-ho tot a l’olla ' +
          'amb la botifarra ({botifarra}) sencera i la sal ({sal}). Cou-ho fins que la patata sigui tendra.',
        25,
        'Coure patata i col',
      ),
      p(
        'Cola el brou en una altra olla. Posa les carns, la pilota i les verdures en una plata i tapa-la amb paper d’alumini perquè no es refredi.',
      ),
      c(
        'Porta el brou a ebullició, afegeix-hi els galets ({galets}) i cou-los el temps que diu el paquet (normalment 12-14 minuts). Tasta’l de sal.',
        13,
        'Coure els galets',
      ),
      p(
        'Serveix primer l’escudella (el brou amb els galets). Després, la carn d’olla: les carns, la botifarra i la pilota a rodanxes, amb les verdures i els cigrons.',
      ),
    ],
  },
  {
    id: 'sopa-galets',
    nom: 'Sopa de galets amb pilota',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['sopa', 'carn'],
    ingredients: [
      l('brou-pollastre', 1500),
      l('galets', 200),
      l('carn-picada', 300),
      l('ou', 1),
      l('pa-ratllat', 30),
      l('all', 1),
      l('julivert', 10),
      l('sal', 3),
      l('pebre-negre', 1),
    ],
    passos: [
      p(
        'Pilota: pela i pica l’all ({all}) i el julivert ({julivert}) ben fins. En un bol, barreja la carn picada ({carn-picada}), l’ou ({ou}), el pa ratllat ' +
          '({pa-ratllat}), l’all, el julivert, la sal ({sal}) i el pebre ({pebre-negre}) amb les mans fins que quedi homogeni.',
      ),
      p('Amb les mans humides, fes boletes d’uns 2 cm.'),
      p('Posa el brou ({brou-pollastre}) en una olla a foc fort fins que bulli.'),
      c(
        'Afegeix-hi les boletes amb compte, abaixa el foc perquè bulli suaument i cou-les (no remenis fort o es desfaran).',
        10,
        'Coure les pilotetes',
      ),
      c(
        'Afegeix-hi els galets ({galets}) i cou-los el temps que diu el paquet (normalment 12-14 minuts), remenant suaument de tant en tant. ' +
          'Tasta el brou i serveix-la de seguida.',
        13,
        'Coure els galets',
      ),
    ],
  },
  {
    id: 'truita-botifarra-ou',
    nom: 'Truita de botifarra d’ou amb pa amb tomàquet',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['carn'],
    ingredients: [
      l('ou', 8),
      l('botifarra-ou', 300),
      l('pa-pages', 400),
      l('tomaquet', 3, 'u'),
      l('oli-oliva', 60),
      l('sal', 4),
    ],
    passos: [
      p('Treu la pell de la botifarra d’ou ({botifarra-ou}) i talla-la a daus d’1 cm.'),
      c(
        'Posa una paella antiadherent de 24-26 cm a foc mitjà amb una part de l’oli ({oli-oliva:1/3}) i salta-hi la botifarra fins que es comenci a daurar.',
        2,
        'Saltar la botifarra',
      ),
      p(
        'En un bol gran, bat els ous ({ou}) amb la meitat de la sal ({sal:1/2}) fins que la clara i el rovell estiguin barrejats. Afegeix-hi la botifarra ' +
          'i remena. Deixa l’oli a la paella.',
      ),
      c(
        'Torna la paella a foc mitjà-fort. Quan l’oli sigui calent, aboca-hi els ous, remena 20 segons amb una espàtula i abaixa el foc a mitjà. ' +
          'Deixa-la quallar sense tocar-la fins que les vores siguin fermes i el centre encara una mica tremolós.',
        3,
        'Quallar la truita',
      ),
      c(
        'Gira-la: posa un plat més gran que la paella a sobre, gira-ho tot de cop i fes lliscar la truita de nou a la paella. Cou l’altra cara.',
        2,
        'Segona cara',
      ),
      p(
        'Pa amb tomàquet: talla el pa ({pa-pages}) a llesques d’1,5 cm i torra-les lleugerament. Talla els tomàquets ({tomaquet}) per la meitat i frega’ls ' +
          'per sobre del pa, prement perquè deixin anar la polpa. Amaneix-lo amb la resta de l’oli ({oli-oliva:2/3}) i de la sal ({sal:1/2}).',
      ),
    ],
  },
  {
    id: 'truita-patates',
    nom: 'Truita de patates amb ceba',
    racions: 4,
    tempsMinuts: 50,
    etiquetes: ['vegetaria'],
    ambAcompanyament: true,
    ingredients: [l('patata', 800), l('ceba', 1, 'u'), l('ou', 6), l('oli-oliva', 100), l('sal', 6)],
    passos: [
      p(
        'Pela les patates ({patata}) i talla-les a làmines fines, d’uns 3 mm (o a daus petits). Pela la ceba ({ceba}) i talla-la a tires fines. ' +
          'Barreja-ho amb la meitat de la sal ({sal:1/2}).',
      ),
      c(
        'Posa una paella fonda a foc mitjà-baix amb prou oli d’oliva perquè gairebé cobreixi les patates (la recepta compta {oli-oliva}, que és el que absorbeixen; ' +
          'la resta es cola i es reaprofita). Afegeix-hi les patates i la ceba: han de bullir suaument en l’oli, no fregir-se. ' +
          'Remena de tant en tant fins que les patates siguin toves i es trenquin amb la cullera, sense daurar-se.',
        20,
        'Confitar les patates',
      ),
      p('Escorre les patates i la ceba en un colador posat sobre un bol, per recuperar l’oli.'),
      c(
        'En un bol gran, bat els ous ({ou}) amb la resta de la sal ({sal:1/2}). Afegeix-hi les patates calentes, barreja-ho i deixa-ho reposar perquè ' +
          'la patata s’amari d’ou.',
        5,
        'Reposar la barreja',
      ),
      c(
        'Posa una paella antiadherent de 24 cm a foc mitjà-fort amb 2 cullerades de l’oli que has recuperat. Quan sigui calent, aboca-hi la barreja, ' +
          'remena 20 segons i abaixa a foc mitjà. Deixa-la quallar sense tocar-la (sacseja la paella perquè no s’enganxi).',
        3,
        'Quallar la truita',
      ),
      c(
        'Gira-la amb un plat més gran que la paella i fes-la lliscar de nou a la paella. Cou l’altra cara: menys temps si t’agrada sucosa, més si la vols quallada.',
        2,
        'Segona cara',
      ),
    ],
  },
  {
    id: 'mandonguilles-tomaquet',
    nom: 'Mandonguilles amb salsa de tomàquet',
    racions: 4,
    tempsMinuts: 75,
    etiquetes: ['carn'],
    ingredients: [
      l('carn-picada', 600),
      l('ou', 1),
      l('pa-ratllat', 50),
      l('llet', 50),
      l('all', 2),
      l('julivert', 10),
      l('farina', 40),
      l('ceba', 1, 'u'),
      l('tomaquet-triturat', 800),
      l('sucre', 5),
      l('oli-oliva', 60),
      l('sal', 7),
      l('pebre-negre', 1),
    ],
    passos: [
      c(
        'En un bol gran, barreja el pa ratllat ({pa-ratllat}) amb la llet ({llet}) i deixa’l que s’estovi (fa les mandonguilles més sucoses).',
        5,
        'Estovar el pa',
      ),
      p(
        'Pela els grans d’all ({all}) i pica’ls ben fins; pica el julivert ({julivert}). Afegeix al bol la carn picada ({carn-picada}), l’ou ({ou}), ' +
          'la meitat de l’all, el julivert, la meitat de la sal ({sal:1/2}) i el pebre ({pebre-negre}). Barreja-ho amb les mans fins que quedi homogeni.',
      ),
      p('Amb les mans humides, fes boles d’uns 3-4 cm. Passa-les per la farina ({farina}) i espolsa-les.'),
      c(
        'Posa una cassola a foc mitjà-fort amb l’oli ({oli-oliva}) i daura-hi les mandonguilles en tandes, girant-les perquè agafin color per tot arreu. ' +
          'No cal que es facin per dins. Reserva-les.',
        6,
        'Daurar mandonguilles',
      ),
      c(
        'Salsa: pica la ceba ({ceba}) ben fina. Abaixa el foc a mitjà-baix i cou-la al mateix oli amb un pessic de sal fins que sigui tova i daurada.',
        10,
        'Ofegar la ceba',
      ),
      c(
        'Afegeix la resta de l’all i remena 1 minut. Afegeix el tomàquet triturat ({tomaquet-triturat}), el sucre ({sucre}) (treu l’acidesa) i la resta ' +
          'de la sal ({sal:1/2}). Cou-ho a foc baix, remenant de tant en tant, fins que la salsa sigui espessa i fosca.',
        15,
        'Coure la salsa',
      ),
      c(
        'Afegeix-hi les mandonguilles, tapa la cassola i cou-ho a foc baix perquè es facin per dins i agafin el gust de la salsa. ' +
          'Si la salsa queda massa espessa, afegeix-hi un raig d’aigua.',
        20,
        'Coure les mandonguilles',
      ),
    ],
  },
];
