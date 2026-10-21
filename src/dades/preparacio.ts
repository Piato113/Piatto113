import type { Pas } from '../domini';

// Preparació pas a pas de cada recepta.
//
// - `{ingredient}` es mostra com la quantitat escalada a les racions de la família (p. ex. «450 g»).
// - `{ingredient:1/2}` és una part d'aquesta quantitat, quan l'ingredient es fa servir en dos moments.
// - `c(...)` afegeix un cronòmetre al pas: durada en minuts i nom curt.
// - Les quantitats d'aigua no són ingredients: s'expliquen en proporció perquè també escalin.

const p = (text: string): Pas => ({ text });
const c = (text: string, minuts: number, nom: string): Pas => ({
  text,
  cronometre: { segons: Math.round(minuts * 60), nom },
});

/** Passos comuns de la carn arrebossada. */
function arrebossat(carn: string, aixafar: string, minutsCostat: number, comprovacio: string): Pas[] {
  return [
    p(`${aixafar} Sala els filets ({${carn}}) per les dues bandes amb la sal ({sal}).`),
    p(
      'Prepara tres plats fondos en fila: el primer amb la farina ({farina}); el segon amb els ous ({ou}) ' +
        'batuts amb una forquilla fins que la clara i el rovell estiguin ben barrejats; el tercer amb el pa ratllat ({pa-ratllat}).',
    ),
    p(
      'Passa cada filet per la farina i espolsa’l perquè només en quedi una capa fina. Després passa’l per l’ou, ' +
        'per les dues bandes, i deixa’l escórrer uns segons. Finalment passa’l pel pa ratllat i pressiona’l amb el palmell ' +
        'perquè s’enganxi per tot arreu, també a les vores. Deixa’ls en una safata sense amuntegar-los.',
    ),
    c(
      'Posa l’oli de gira-sol ({oli-girasol}) en una paella ampla a foc mitjà-fort: ha de cobrir el fons uns 5 mm. ' +
        'És a punt quan hi tires una mica de pa ratllat i bombolleja de seguida i es daura en uns 10 segons (uns 170-180 °C). ' +
        'Si l’oli fumeja, és massa calent: aparta la paella del foc un moment.',
      4,
      'Escalfar l’oli',
    ),
    c(
      `Fregeix els filets en tandes, sense omplir la paella (si en poses massa, l’oli es refreda i queden xops d’oli). ` +
        `Cou-los ${minutsCostat === 1.5 ? '1 minut i mig' : `${String(minutsCostat).replace('.', ',')} minuts`} per cada costat, ` +
        'fins que l’arrebossat sigui daurat. Gira’ls amb unes pinces o una espàtula, no amb una forquilla (punxar-los fa que perdin el suc). ' +
        'El cronòmetre és per a cada costat.',
      minutsCostat,
      'Fregir un costat',
    ),
    p(`Treu-los amb una escumadora i deixa’ls sobre paper de cuina perquè absorbeixi l’oli sobrant. ${comprovacio}`),
    p('Serveix-los de seguida, amb l’acompanyament, perquè l’arrebossat no perdi el cruixent.'),
  ];
}

export const preparacio: Record<string, Pas[]> = {
  'macarrons-bolonyesa': [
    p(
      'Pela la ceba ({ceba}) i la pastanaga ({pastanaga}) i talla-les a daus molt petits, d’uns 3-4 mm. ' +
        'Pela l’all ({all}), talla cada gra per la meitat, treu-li el brot verd del centre si en té (amarga) i pica’l ben fi.',
    ),
    c(
      'Posa una cassola ampla o una paella fonda a foc mitjà amb l’oli ({oli-oliva}). Quan l’oli sigui calent ' +
        '(si hi tires un trosset de ceba, ha de bombollejar suaument), afegeix la ceba i la pastanaga amb un pessic de sal. ' +
        'Cou-les remenant cada minut o dos fins que la ceba sigui transparent i tova, sense que agafi color. ' +
        'Si es comença a enrossir, abaixa el foc.',
      10,
      'Ofegar ceba i pastanaga',
    ),
    c('Afegeix l’all i remena fins que faci olor, sense deixar que es torri (l’all cremat amarga).', 1, 'Coure l’all'),
    c(
      'Puja el foc a mitjà-fort i afegeix la carn picada ({carn-picada}). Esmicola-la amb una cullera de fusta perquè no quedin grumolls. ' +
        'Cou-la remenant fins que no quedi cap tros rosat, el líquid que deixa anar s’hagi evaporat i comenci a daurar-se.',
      8,
      'Daurar la carn',
    ),
    c(
      'Afegeix el tomàquet triturat ({tomaquet-triturat}), l’orenga ({orenga}) i una part de la sal ({sal:1/10}). Remena, abaixa el foc ' +
        'al mínim perquè bulli molt suaument i tapa la cassola deixant-hi una escletxa. Remena cada 5 minuts. La salsa ha d’espessir ' +
        'i perdre el gust àcid del tomàquet. Si s’enganxa al fons, afegeix-hi un raig d’aigua.',
      20,
      'Salsa bolonyesa',
    ),
    p(
      'Mentre la salsa es cou, posa una olla gran a foc fort amb aigua: 1 litre per cada 100 g de pasta. ' +
        'Quan bulli amb força, afegeix-hi la resta de la sal ({sal:9/10}).',
    ),
    c(
      'Tira-hi els macarrons ({macarrons}) i remena de seguida perquè no s’enganxin. Quan l’aigua torni a bullir, compta el temps ' +
        'que diu el paquet (normalment 10-11 minuts). Remena un parell de vegades durant la cocció. ' +
        'Tasta’n un: ha de ser tou però amb un punt de fermesa al centre.',
      10,
      'Bullir macarrons',
    ),
    p(
      'Abans d’escórrer, guarda una tassa de l’aigua de la pasta. Escorre els macarrons i posa’ls a la cassola de la salsa, a foc baix. ' +
        'Barreja-ho durant 1 minut. Si queda sec, afegeix-hi una mica de l’aigua que has guardat.',
    ),
    p('Serveix-los amb el formatge ratllat ({formatge-ratllat}) per sobre.'),
  ],

  'tallarins-carbonara': [
    p(
      'Posa una olla gran a foc fort amb aigua: 1 litre per cada 100 g de pasta. Quan bulli amb força, afegeix-hi la sal ({sal}).',
    ),
    p('Mentre l’aigua s’escalfa, talla el bacó ({baco}) a tires d’1 cm d’ample.'),
    p(
      'En un bol, bat els ous ({ou}) amb la nata ({nata}), el formatge ratllat ({formatge-ratllat}) i el pebre negre ({pebre-negre}) ' +
        'fins que quedi una crema llisa. Reserva-la.',
    ),
    c(
      'Posa una paella gran, sense oli, a foc mitjà i afegeix-hi el bacó. Cou-lo remenant de tant en tant fins que deixi anar el greix ' +
        'i quedi daurat i cruixent. Aparta la paella del foc; no treguis el greix, donarà gust a la salsa.',
      6,
      'Daurar el bacó',
    ),
    c(
      'Quan l’aigua bulli, tira-hi els tallarins ({tallarins}) i separa’ls amb una forquilla de cuina perquè no s’enganxin. ' +
        'Cou-los el temps que diu el paquet (normalment uns 8 minuts), remenant de tant en tant.',
      8,
      'Bullir tallarins',
    ),
    p('Abans d’escórrer, guarda una tassa de l’aigua de la pasta. Escorre els tallarins.'),
    c(
      'Posa els tallarins a la paella del bacó, a foc molt baix, i barreja’ls 30 segons perquè s’impregnin del greix. ' +
        'Aparta la paella del foc (és important: si l’ou s’escalfa massa, quallarà com una truita) i aboca-hi la crema d’ou. ' +
        'Remena sense parar fins que la salsa quedi cremosa i embolcalli la pasta. Si queda massa espessa, afegeix-hi l’aigua ' +
        'que has guardat, cullerada a cullerada.',
      1,
      'Lligar la carbonara',
    ),
    p('Serveix de seguida: la carbonara s’espesseix en refredar-se.'),
  ],

  canelons: [
    p('Farcit: pela la ceba ({ceba}) i pica-la a daus petits, d’uns 3-4 mm.'),
    c(
      'Posa una paella ampla a foc mitjà-baix amb l’oli ({oli-oliva}) i afegeix-hi la ceba amb un pessic de sal. ' +
        'Cou-la remenant cada pocs minuts fins que sigui ben tova i d’un color daurat clar. Si s’enfosqueix massa de pressa, abaixa el foc.',
      15,
      'Ofegar la ceba',
    ),
    c(
      'Puja el foc a mitjà-fort, afegeix la carn picada ({carn-picada}) i esmicola-la amb una cullera de fusta. ' +
        'Cou-la fins que sigui ben daurada i no quedi gens de líquid a la paella.',
      10,
      'Daurar la carn',
    ),
    c(
      'Afegeix el tomàquet triturat ({tomaquet-triturat}) i cou-ho remenant fins que el farcit quedi sec (si queda suc, ' +
        'els canelons quedaran tous). Tasta’l i posa-hi sal si cal. Aparta’l del foc i deixa’l refredar mentre prepares les plaques.',
      5,
      'Assecar el farcit',
    ),
    c(
      'Posa una olla gran amb 3 litres d’aigua i una part de la sal ({sal:3/4}) a foc fort. Quan bulli, tira-hi les plaques ' +
        '({plaques-canelons}) d’una en una perquè no s’enganxin, i cou-les el temps que diu el paquet (normalment 10-12 minuts). ' +
        'Si són plaques precuites que només s’han de posar en aigua calenta, segueix les instruccions del paquet.',
      12,
      'Bullir plaques',
    ),
    p(
      'Escorre les plaques amb compte, passa-les per aigua freda perquè no es cuinin més i estén-les sobre un drap net, sense que es toquin.',
    ),
    p(
      'Posa una cullerada de farcit a la vora de cada placa, en forma de cilindre, i enrotlla-la. Col·loca els canelons en una safata de forn, ' +
        'l’un al costat de l’altre i amb la juntura cap avall perquè no s’obrin.',
    ),
    p('Encén el forn a 200 °C, amb escalfor a dalt i a baix, perquè s’escalfi mentre fas la beixamel.'),
    c(
      'Beixamel: escalfa la llet ({llet}) en un cassó a foc mitjà o al microones fins que sigui calenta, sense que arribi a bullir.',
      3,
      'Escalfar la llet',
    ),
    c(
      'En un cassó a foc mitjà-baix, fon la mantega ({mantega}). Afegeix-hi la farina ({farina}) de cop i remena amb unes varetes ' +
        'perquè es cogui sense agafar color: ha de quedar una pasta llisa que fa olor de galeta.',
      2,
      'Coure la farina',
    ),
    c(
      'Afegeix-hi la llet calenta en tres vegades, remenant sense parar amb les varetes; no hi afegeixis més llet fins que la ' +
        'barreja torni a ser llisa. Quan hi sigui tota, continua remenant a foc baix fins que espesseixi i cobreixi el dors d’una cullera. ' +
        'Posa-hi la resta de la sal ({sal:1/4}) i la nou moscada ({nou-moscada}).',
      8,
      'Espessir la beixamel',
    ),
    p('Cobreix els canelons amb la beixamel i escampa-hi el formatge ratllat ({formatge-ratllat}) per sobre.'),
    c(
      'Enforna’ls a mitja altura fins que la beixamel bombollegi i comenci a daurar-se. Si vols el gratinat més torrat, ' +
        'posa el gratinador els últims 3 minuts i vigila que no es cremi.',
      15,
      'Gratinar canelons',
    ),
  ],

  'fideus-cassola': [
    p(
      'Talla la costella ({costella-porc}) a trossos d’uns 3 cm (pots demanar al carnisser que te la talli) i sala-la amb una part ' +
        'de la sal ({sal:1/2}). Talla la botifarra ({botifarra}) a rodanxes de 2 cm.',
    ),
    c(
      'Escalfa l’oli ({oli-oliva}) en una cassola ampla (de fang o de ferro) a foc mitjà-fort. Daura-hi la costella, ' +
        'girant-la perquè agafi color per tots els costats.',
      8,
      'Daurar la costella',
    ),
    c(
      'Afegeix la botifarra i daura-la. Després treu tota la carn i reserva-la en un plat; deixa l’oli a la cassola.',
      3,
      'Daurar la botifarra',
    ),
    p('Pela la ceba ({ceba}) i pica-la ben fina. Pela els grans d’all ({all}) i pica’ls.'),
    c(
      'Sofregit: abaixa el foc a mitjà-baix i posa la ceba a la cassola amb un pessic de sal. Cou-la remenant cada pocs minuts, ' +
        'rascant el fons amb la cullera per desenganxar el que ha deixat la carn, fins que sigui molt tova i de color caramel clar.',
      15,
      'Sofregir la ceba',
    ),
    c(
      'Afegeix l’all i remena 1 minut. Després afegeix el tomàquet triturat ({tomaquet-triturat}) i cou-ho remenant sovint ' +
        'fins que el tomàquet hagi perdut l’aigua, s’hagi enfosquit i l’oli se separi per les vores: aquest és el senyal que el sofregit és fet.',
      10,
      'Sofregir el tomàquet',
    ),
    p('Mentrestant, escalfa el brou ({brou-pollastre}) en un cassó fins que bulli.'),
    p(
      'Torna la carn a la cassola. Afegeix-hi el pebre vermell ({pebre-vermell}) i remena només 10 segons (es crema de seguida i amarga). ' +
        'Afegeix-hi de seguida els fideus ({fideus-gruixuts}) i remena 1 minut perquè s’impregnin del sofregit.',
    ),
    c(
      'Aboca-hi el brou calent. Posa el foc fort fins que arrenqui el bull i després abaixa’l a mitjà. Cou-ho sense tapar, ' +
        'remenant de tant en tant amb compte, fins que els fideus siguin tous i quedi un punt de suc (han de quedar melosos, no secs). ' +
        'Tasta’n i afegeix-hi la resta de la sal ({sal:1/2}) si cal.',
      12,
      'Coure els fideus',
    ),
    c('Aparta la cassola del foc i deixa-la reposar abans de servir.', 3, 'Reposar'),
  ],

  fideua: [
    p(
      'Si les gambes ({gamba}) són congelades, descongela-les la nit abans a la nevera. Renta la sípia ({sipia}) amb aigua freda, ' +
        'asseca-la amb paper de cuina i talla-la a daus d’1 cm. Pela els grans d’all ({all}) i pica’ls.',
    ),
    p('Escalfa el fumet ({fumet}) en un cassó fins que bulli i deixa’l a foc mínim perquè es mantingui calent.'),
    c(
      'Posa una paella de paella (d’uns 36-40 cm per a 4 persones) a foc mitjà-fort amb l’oli ({oli-oliva}). ' +
        'Quan sigui calent, posa-hi les gambes 1 minut per cada costat, només perquè agafin color, i treu-les a un plat.',
      2,
      'Marcar les gambes',
    ),
    c(
      'Al mateix oli, posa-hi la sípia i cou-la remenant. Primer deixarà anar aigua; continua fins que s’evapori i la sípia comenci a daurar-se.',
      6,
      'Daurar la sípia',
    ),
    c(
      'Afegeix l’all i remena 1 minut sense que es cremi. Afegeix el tomàquet triturat ({tomaquet-triturat}) i cou-ho remenant ' +
        'fins que sigui fosc i espès i ja no quedi aigua.',
      6,
      'Sofregit',
    ),
    c(
      'Afegeix els fideus ({fideus-fideua}) i remena’ls perquè es torrin una mica i s’impregnin del sofregit.',
      2,
      'Torrar els fideus',
    ),
    c(
      'Aboca-hi el fumet calent i el colorant ({colorant}), reparteix bé els fideus per tota la paella i tasta el brou: ' +
        'ha de ser una mica salat; si cal, afegeix-hi la sal ({sal}). A partir d’ara no remenis més. Cou-ho a foc fort.',
      5,
      'Fideuà a foc fort',
    ),
    c(
      'Abaixa a foc mitjà i col·loca les gambes per sobre. Continua coent fins que els fideus hagin absorbit tot el líquid.',
      4,
      'Fideuà a foc mitjà',
    ),
    c(
      'Aparta la paella del foc, tapa-la amb un drap net i deixa-la reposar. Si t’agraden els fideus aixecats i cruixents, ' +
        'en lloc de reposar posa-la 3 minuts sota el gratinador del forn a 220 °C.',
      3,
      'Reposar la fideuà',
    ),
  ],

  'arros-cubana': [
    p('Pela l’all ({all}) i aixafa’l amb el palmell sobre el taulell, sense picar-lo.'),
    c(
      'Posa una olla a foc mitjà amb una part de l’oli ({oli-oliva:1/6}) i l’all. Quan l’all faci bombolletes i comenci a daurar-se, ' +
        'afegeix l’arròs ({arros}) i remena perquè els grans s’impregnin d’oli.',
      2,
      'Torrar l’arròs',
    ),
    c(
      'Afegeix el doble de pes d’aigua que d’arròs (200 ml per cada 100 g) i la sal ({sal}). Quan bulli, abaixa el foc al mínim, ' +
        'tapa l’olla i cou sense destapar ni remenar.',
      18,
      'Coure l’arròs',
    ),
    c(
      'Aparta l’olla del foc i deixa-la tapada perquè l’arròs acabi d’absorbir l’aigua. Després treu l’all i esponja l’arròs amb una forquilla.',
      5,
      'Reposar l’arròs',
    ),
    c(
      'Mentrestant, escalfa el tomàquet fregit ({tomaquet-fregit}) en un cassó a foc baix, remenant de tant en tant.',
      4,
      'Escalfar el tomàquet',
    ),
    c(
      'Pela els plàtans ({platan}) i talla’ls per la meitat de llarg. Escalfa una part de l’oli ({oli-oliva:1/3}) en una paella a foc mitjà ' +
        'i fregeix-hi els plàtans fins que siguin daurats per les dues bandes, uns 2 minuts per costat.',
      4,
      'Fregir els plàtans',
    ),
    c(
      'Ous ferrats: escalfa la resta de l’oli ({oli-oliva:1/2}) en una paella petita a foc mitjà-fort. Trenca un ou en un bol i deixa’l ' +
        'lliscar dins la paella. Amb una cullera, tira oli calent per sobre de la clara (no del rovell) fins que la clara sigui blanca ' +
        'i quallada i les vores cruixents, però el rovell encara líquid. Treu-lo amb una escumadora i fes la resta d’ous ({ou}) d’un en un. ' +
        'El cronòmetre és per a cada ou.',
      2,
      'Ou ferrat',
    ),
    p(
      'Emplata: omple una tassa d’arròs, pressiona’l una mica i gira-la sobre el plat perquè quedi una cúpula. ' +
        'Posa-hi el tomàquet al costat, l’ou ferrat a sobre i el plàtan al costat. Sala els ous.',
    ),
  ],

  'risotto-bolets': [
    p(
      'Neteja els bolets ({bolets}) amb un drap humit o un pinzell per treure’n la terra; no els posis en remull, xuclen aigua. ' +
        'Talla’ls a làmines d’uns 5 mm. Pela la ceba ({ceba}) i pica-la ben fina.',
    ),
    p('Escalfa el brou ({brou-verdures}) en un cassó fins que bulli i deixa’l a foc mínim tota l’estona: s’ha d’afegir calent.'),
    c(
      'En una paella gran a foc fort, posa la meitat de l’oli ({oli-oliva:1/2}) i salta-hi els bolets amb un pessic de sal, ' +
        'remenant, fins que deixin anar l’aigua, aquesta s’evapori i es daurin. Treu-los i reserva’ls.',
      6,
      'Saltar els bolets',
    ),
    c(
      'En una cassola ampla a foc mitjà-baix, posa la resta de l’oli ({oli-oliva:1/2}) i la meitat de la mantega ({mantega:1/2}). ' +
        'Afegeix-hi la ceba i cou-la fins que sigui transparent i tova, sense que agafi color.',
      7,
      'Ofegar la ceba',
    ),
    c(
      'Afegeix l’arròs ({arros}) i remena fins que els grans siguin translúcids per les vores (es diu «nacrar» l’arròs).',
      2,
      'Nacrar l’arròs',
    ),
    c(
      'Afegeix un cullerot de brou calent i remena suaument fins que l’arròs l’hagi absorbit gairebé tot. Repeteix-ho, cullerot a cullerot, ' +
        'remenant sovint: el moviment fa que l’arròs deixi anar el midó i quedi cremós. Quan portis 10 minuts, afegeix-hi els bolets.',
      18,
      'Coure el risotto',
    ),
    p(
      'Tasta un gra: ha de ser tou per fora amb un punt molt lleuger de fermesa al centre. El risotto ha de quedar cremós, ' +
        'que es mogui com una onada si sacseges la cassola. Si cal, afegeix-hi més brou o aigua calenta i cou-lo un parell de minuts més.',
    ),
    c(
      'Aparta la cassola del foc. Afegeix-hi la resta de la mantega ({mantega:1/2}), freda i a daus, i el formatge ratllat ({formatge-ratllat}). ' +
        'Remena amb energia durant 1 minut. Tasta’l, afegeix-hi la sal ({sal}) si cal, tapa’l i deixa’l reposar abans de servir.',
      2,
      'Reposar el risotto',
    ),
  ],

  paella: [
    p(
      'Sala els trossos de pollastre ({pollastre-trossos}) amb una part de la sal ({sal:2/5}). Renta la sípia ({sipia}), asseca-la i ' +
        'talla-la a daus d’1 cm. Renta el pebrot ({pebrot-vermell}), treu-li les llavors i talla’l a tires d’1 cm. ' +
        'Pela els grans d’all ({all}) i pica’ls. Si les gambes ({gamba}) són congelades, descongela-les la nit abans a la nevera.',
    ),
    p('Escalfa el fumet ({fumet}) en un cassó fins que bulli i deixa’l a foc mínim perquè es mantingui calent.'),
    c(
      'Posa la paella (d’uns 40 cm per a 4 persones) a foc mitjà-fort amb l’oli ({oli-oliva}). Quan sigui calent, posa-hi les gambes ' +
        '1 minut per cada costat, només perquè agafin color, i treu-les a un plat.',
      2,
      'Marcar les gambes',
    ),
    c(
      'Al mateix oli, a foc mitjà, daura el pollastre girant-lo de tant en tant fins que la pell sigui ben daurada per tots els costats. ' +
        'Quan el tinguis, aparta’l a les vores de la paella.',
      12,
      'Daurar el pollastre',
    ),
    c('Al centre de la paella, posa-hi el pebrot i cou-lo fins que sigui tou. Treu-lo i reserva’l per decorar.', 5, 'Coure el pebrot'),
    c(
      'Al centre, posa-hi la sípia i cou-la remenant: primer deixarà anar aigua; continua fins que s’evapori i comenci a daurar-se.',
      5,
      'Daurar la sípia',
    ),
    c(
      'Afegeix l’all, remena 1 minut sense que es cremi, i afegeix el tomàquet triturat ({tomaquet-triturat}). Cou-ho remenant ' +
        'fins que el tomàquet sigui fosc i espès i l’oli se separi per les vores.',
      6,
      'Sofregit',
    ),
    p('Afegeix l’arròs ({arros}) i remena 1 minut perquè s’impregni bé del sofregit.'),
    c(
      'Aboca-hi el fumet calent i el colorant ({colorant}). Remena una sola vegada per repartir l’arròs i el pollastre per tota la paella ' +
        'i tasta el brou: ha de ser una mica salat; si cal, afegeix-hi la resta de la sal ({sal:3/5}). A partir d’ara no remenis més. ' +
        'Cou-ho a foc fort.',
      8,
      'Paella a foc fort',
    ),
    c(
      'Abaixa a foc mitjà, col·loca les gambes i les tires de pebrot per sobre i cou fins que l’arròs hagi absorbit el brou i el gra sigui tou. ' +
        'Si la paella és més gran que el foc, gira-la de tant en tant perquè es faci igual per tot arreu.',
      9,
      'Paella a foc mitjà',
    ),
    p(
      'Si t’agrada el socarrat, puja el foc al màxim 1 o 2 minuts, fins que sentis un lleuger espetec a sota; atura’t si fa olor de cremat.',
    ),
    c('Aparta la paella del foc, tapa-la amb un drap net i deixa-la reposar abans de servir.', 5, 'Reposar la paella'),
  ],

  'llenties-estofades': [
    p(
      'Posa les llenties ({llenties}) en un colador, renta-les amb aigua freda i treu-ne les pedretes o llenties trencades si n’hi ha. ' +
        'Les pardines no cal posar-les en remull.',
    ),
    p(
      'Pela la ceba ({ceba}) i els grans d’all ({all}) i pica’ls ben fins. Pela les pastanagues ({pastanaga}) i talla-les a rodanxes d’1 cm. ' +
        'Talla el xoriço ({xorico}) a rodanxes d’1 cm. Pela les patates ({patata}) i deixa-les en aigua fins que les facis servir.',
    ),
    c(
      'Sofregit: posa una olla a foc mitjà-baix amb l’oli ({oli-oliva}) i afegeix la ceba amb un pessic de sal. ' +
        'Cou-la remenant de tant en tant fins que sigui tova i daurada. Afegeix l’all els últims 2 minuts.',
      10,
      'Sofregir la ceba',
    ),
    c(
      'Afegeix el tomàquet triturat ({tomaquet-triturat}) i cou-ho remenant fins que s’enfosqueixi i perdi l’aigua. ' +
        'Aparta l’olla del foc, afegeix-hi el pebre vermell ({pebre-vermell}) i remena 10 segons (fora del foc no es crema).',
      6,
      'Sofregir el tomàquet',
    ),
    p(
      'Torna l’olla al foc i afegeix-hi les llenties, la pastanaga i el xoriço. Cobreix-ho amb aigua freda: unes 3 vegades i mitja ' +
        'el pes de les llenties (1,4 litres per cada 400 g). Posa el foc fort fins que arrenqui el bull.',
    ),
    c(
      'Quan bulli, abaixa el foc perquè bulli suaument, tapa l’olla deixant-hi una escletxa i cou remenant de tant en tant.',
      25,
      'Coure les llenties',
    ),
    c(
      'Talla les patates a trossos d’uns 3 cm «trencant-les»: fes un tall petit amb el ganivet i trenca el tros fent palanca. ' +
        'Així deixen anar midó i espesseixen el brou. Afegeix-les a l’olla amb la sal ({sal}) i cou fins que les patates i les llenties ' +
        'siguin tendres. Si es queda sec, afegeix-hi un got d’aigua calenta.',
      20,
      'Coure les patates',
    ),
    c('Aparta l’olla del foc i deixa-la reposar tapada abans de servir.', 5, 'Reposar'),
  ],

  'verdura-bullida': [
    p(
      'Renta la mongeta tendra ({mongeta-tendra}), treu-li les dues puntes i, si en té, el fil dels costats (estira’l des de la punta). ' +
        'Talla-la a trossos d’uns 4 cm.',
    ),
    p('Pela les patates ({patata}) i talla-les a trossos d’uns 4 cm, tots de la mateixa mida perquè es coguin igual.'),
    p('Posa una olla a foc fort amb prou aigua per cobrir de sobres les verdures i la sal ({sal}).'),
    c('Quan bulli, posa-hi les patates. Compta el temps des que torni a bullir.', 10, 'Bullir les patates'),
    c(
      'Afegeix la mongeta i cou-ho tot fins que la patata es travessi fàcilment amb la punta d’un ganivet i la mongeta sigui tendra però encara verda.',
      12,
      'Bullir la verdura',
    ),
    p(
      'Escorre-ho bé en un colador. Serveix-ho amb l’oli d’oliva ({oli-oliva}) en cru per sobre. Si t’agrada, aixafa-ho una mica amb una forquilla.',
    ),
  ],

  'verdura-forn': [
    p('Encén el forn a 200 °C, amb escalfor a dalt i a baix.'),
    p(
      'Renta totes les verdures. Pela les patates ({patata}) i talla-les a rodanxes de 5 mm. Pela les cebes ({ceba}) i talla-les en quarts. ' +
        'Talla el carbassó ({carbasso}) i l’albergínia ({alberginia}) a rodanxes d’1 cm. Treu les llavors i la part blanca dels pebrots ' +
        '({pebrot-vermell}) i talla’ls a tires de 3 cm.',
    ),
    c(
      'Posa les patates i la ceba en una safata de forn (són les que triguen més) amb la meitat de l’oli ({oli-oliva:1/2}) i la meitat ' +
        'de la sal ({sal:1/2}). Remena-ho amb les mans perquè tot quedi untat i escampa-ho en una sola capa. Enforna-ho a mitja altura.',
      20,
      'Forn: patates i ceba',
    ),
    c(
      'Treu la safata, posa-hi el carbassó, l’albergínia i el pebrot per sobre, amb la resta de l’oli ({oli-oliva:1/2}) i de la sal ({sal:1/2}), ' +
        'i remena-ho. Torna-ho al forn fins que totes les verdures siguin tendres i daurades per les vores. ' +
        'A mitja cocció (als 15 minuts), remena-ho perquè es facin igual.',
      30,
      'Forn: totes les verdures',
    ),
    p('Serveix-ho calent o temperat.'),
  ],

  trinxat: [
    p(
      'Treu les fulles exteriors malmeses de la col ({col}) i el tronc dur del centre. Talla-la a trossos grossos i renta-la bé. ' +
        'Pela les patates ({patata}) i talla-les a trossos de 4 cm.',
    ),
    c(
      'Posa una olla gran a foc fort amb aigua i la sal ({sal}). Quan bulli, posa-hi la col i les patates. Cou-ho fins que tot sigui ' +
        'molt tou: la patata s’ha de desfer en aixafar-la amb una forquilla.',
      25,
      'Bullir col i patata',
    ),
    c(
      'Escorre-ho molt bé. Pressiona-ho amb una cullera dins el colador per treure tota l’aigua possible i deixa-ho escórrer uns minuts: ' +
        'si queda aigua, el trinxat no es daurarà.',
      5,
      'Escórrer',
    ),
    c(
      'Mentrestant, talla la cansalada ({cansalada}) a tires d’1 cm i pela i lamina els grans d’all ({all}). En una paella de 24-26 cm, ' +
        'posa la meitat de l’oli ({oli-oliva:1/2}) a foc mitjà i fregeix-hi la cansalada fins que sigui cruixent. Afegeix l’all l’últim minut, ' +
        'fins que sigui daurat clar. Treu-ho amb una escumadora i deixa el greix a la paella.',
      5,
      'Fregir la cansalada',
    ),
    p(
      'Posa la col i la patata en un bol i aixafa-ho amb una forquilla: ha de quedar trinxat, no puré. Afegeix-hi la meitat de la cansalada ' +
        'i de l’all i tot el greix de la paella, i barreja-ho.',
    ),
    c(
      'Escalfa la resta de l’oli ({oli-oliva:1/2}) a la mateixa paella a foc mitjà-fort. Posa-hi el trinxat i aixafa’l amb una espàtula ' +
        'per fer una coca uniforme. Deixa’l coure sense tocar-lo fins que la base sigui ben daurada (sacseja la paella: quan es mou sencer, és a punt).',
      6,
      'Daurar la primera cara',
    ),
    c(
      'Gira’l: posa un plat més gran que la paella a sobre, gira-ho tot de cop i fes lliscar el trinxat de nou a la paella. Daura l’altra cara.',
      5,
      'Daurar la segona cara',
    ),
    p('Serveix-lo amb la resta de la cansalada i l’all per sobre.'),
  ],

  'sopa-verdures': [
    p(
      'Pela la pastanaga ({pastanaga}) i la patata ({patata}) i talla-les a daus d’1 cm. Treu les fulles verdes dures i l’arrel del porro ({porro}), ' +
        'talla’l per la meitat de llarg, renta’l bé sota l’aixeta separant les capes (sol tenir terra a dins) i talla’l a mitges llunes fines.',
    ),
    p('Posa el brou ({brou-verdures}) en una olla a foc fort fins que bulli.'),
    c(
      'Afegeix-hi les verdures, abaixa el foc perquè bulli suaument i cou fins que la pastanaga sigui tendra.',
      15,
      'Coure les verdures',
    ),
    p(
      'Aprofitament: si tens verdura que ha sobrat d’un altre dia (verdura bullida, al forn, saltejada…), talla-la a trossets i afegeix-la ara.',
    ),
    c(
      'Afegeix els fideus ({fideus-fins}), remena perquè no s’enganxin i cou-los el temps del paquet (uns 4-5 minuts). Tasta-la i ' +
        'afegeix-hi la sal ({sal}) si cal. Serveix-la de seguida: els fideus continuen xuclant brou.',
      5,
      'Coure els fideus',
    ),
  ],

  'llom-arrebossat': arrebossat(
    'llom',
    'Si els filets de llom són de més d’1 cm de gruix, posa’ls entre dos fulls de paper de forn i aixafa’ls amb un corró o el cul d’un cassó fins que facin uns 5 mm.',
    2.5,
    'El llom ha de quedar blanc per dins, sense parts rosades.',
  ),
  'bistec-arrebossat': arrebossat(
    'bistec',
    'Els bistecs han de ser fins, d’uns 3-5 mm; si són més gruixuts, posa’ls entre dos fulls de paper de forn i aixafa’ls amb un corró.',
    1.5,
    'La vedella fina es fa molt de pressa: no la deixis més estona o quedarà dura.',
  ),
  'pollastre-arrebossat': arrebossat(
    'pit-pollastre',
    'Si els filets de pit són gruixuts, talla’ls per la meitat de gruix o posa’ls entre dos fulls de paper de forn i aixafa’ls amb un corró fins que facin uns 5 mm parells (així es fan igual per tot arreu).',
    3,
    'Talla el filet més gruixut pel mig: ha de ser blanc per dins, sense cap part rosada. Si no, torna’l a la paella 1 minut per costat.',
  ),

  entrecot: [
    c(
      'Treu l’entrecot ({entrecot}) de la nevera abans de cuinar-lo perquè agafi temperatura ambient: així es fa igual per dins.',
      15,
      'Temperar la carn',
    ),
    p(
      'Asseca la carn amb paper de cuina per les dues bandes (si és humida, no es daura) i unta-la amb l’oli ({oli-oliva}).',
    ),
    c(
      'A la planxa: escalfa una paella o planxa de ferro a foc fort fins que sigui molt calenta (unes gotes d’aigua hi han de saltar i evaporar-se a l’instant). ' +
        'A la brasa: encén la llenya o el carbó amb temps i espera que les flames s’apaguin i quedi brasa vermella coberta de cendra blanca; ' +
        'posa-hi la graella a sobre perquè s’escalfi (pots aguantar la mà a 10 cm només 2-3 segons). El cronòmetre és per a la planxa.',
      3,
      'Escalfar la planxa',
    ),
    c(
      'Posa-hi l’entrecot (si no hi cap tot, fes-lo en tandes) i no el moguis. Temps per cada cara per a una peça de 2 cm: ' +
        'poc fet, 2 minuts; al punt, 3 minuts; ben fet, 4 minuts. El cronòmetre és per al punt.',
      3,
      'Entrecot: primera cara',
    ),
    c(
      'Gira’l amb unes pinces (no el punxis) i cou l’altra cara el mateix temps. Si té una tira de greix al costat, aguanta’l dret ' +
        'amb les pinces 1 minut perquè el greix es dauri.',
      3,
      'Entrecot: segona cara',
    ),
    c(
      'Treu-lo a un plat, sala’l amb la sal ({sal}) i deixa’l reposar abans de tallar-lo perquè els sucs es reparteixin i no s’escorrin al plat.',
      3,
      'Reposar la carn',
    ),
    p('Talla’l a tires gruixudes i serveix-lo amb l’acompanyament.'),
  ],

  'arros-blanc': [
    p(
      'Posa l’arròs ({arros}) en un colador i renta’l sota l’aixeta, remenant-lo amb la mà, fins que l’aigua surti gairebé clara: ' +
        'així no queda enganxós. Pela l’all ({all}) i aixafa’l amb el palmell.',
    ),
    c(
      'Posa una olla a foc mitjà amb l’oli ({oli-oliva}) i l’all. Quan l’all comenci a daurar-se, afegeix l’arròs escorregut i remena-ho.',
      1,
      'Torrar l’arròs',
    ),
    c(
      'Afegeix el doble de pes d’aigua que d’arròs (200 ml per cada 100 g) i la sal ({sal}). Quan bulli, abaixa el foc al mínim, ' +
        'tapa l’olla i cou sense destapar ni remenar.',
      18,
      'Coure l’arròs',
    ),
    c(
      'Aparta l’olla del foc i deixa-la tapada. Després treu l’all i esponja l’arròs amb una forquilla.',
      5,
      'Reposar l’arròs',
    ),
  ],

  'patates-fregides': [
    p('Pela les patates ({patata}) i talla-les a bastons d’1 cm de gruix, tots iguals perquè es fregeixin igual.'),
    c(
      'Posa-les en un bol amb aigua freda perquè deixin anar el midó (així queden més cruixents). Després escorre-les i asseca-les ' +
        'molt bé amb un drap net: l’aigua fa esquitxar l’oli.',
      15,
      'Remull de les patates',
    ),
    p(
      'Posa oli de gira-sol en una paella fonda o una fregidora: ha de fer uns 3 cm de fondària (la recepta compta {oli-girasol}, ' +
        'que és el que absorbeixen les patates; la resta d’oli es pot colar i reaprofitar). Escalfa’l a foc mitjà fins a uns 150 °C: ' +
        'si hi poses un bastó de patata, ha de bombollejar suaument, no amb força.',
    ),
    c(
      'Primera fregida: fregeix les patates en tandes (que no se n’amunteguin) fins que siguin toves però sense agafar color. ' +
        'Treu-les amb una escumadora i deixa-les escórrer. El cronòmetre és per a cada tanda.',
      6,
      'Primera fregida',
    ),
    c(
      'Segona fregida: puja el foc a fort, fins a uns 180 °C (un bastó ha de bombollejar amb força de seguida). Torna a fregir-les ' +
        'en tandes fins que siguin daurades i cruixents. El cronòmetre és per a cada tanda.',
      3,
      'Segona fregida',
    ),
    p('Treu-les sobre paper de cuina i sala-les de seguida amb la sal ({sal}), quan encara són calentes.'),
  ],

  'patates-adobades': [
    p('Encén el forn a 200 °C, amb escalfor a dalt i a baix.'),
    p(
      'Renta bé les patates ({patata}) fregant la pell (no cal pelar-les) i talla-les a gallons, com una taronja: cada patata en 6 o 8 trossos.',
    ),
    p(
      'En un bol gran, barreja l’oli ({oli-oliva}), els grans d’all ({all}) pelats i picats ben fins, el pebre vermell ({pebre-vermell}), ' +
        'l’orenga ({orenga}) i la sal ({sal}). Afegeix-hi les patates i remena-les amb les mans fins que quedin ben untades.',
    ),
    c(
      'Escampa-les en una safata amb paper de forn, en una sola capa, amb la pell cap avall i sense que es toquin. ' +
        'Enforna-les a mitja altura.',
      20,
      'Forn: primera meitat',
    ),
    c(
      'Gira-les i torna-les al forn fins que siguin daurades i cruixents per fora i toves per dins (prova’n una amb un ganivet).',
      20,
      'Forn: segona meitat',
    ),
  ],

  cuscus: [
    p('Bull aigua: el mateix volum que el pes del cuscús (100 ml d’aigua per cada 100 g de cuscús).'),
    c(
      'Posa el cuscús ({cuscus}) en un bol amb la sal ({sal}) i l’oli ({oli-oliva}). Aboca-hi l’aigua bullent, remena una vegada ' +
        'i tapa el bol amb un plat. Deixa’l reposar sense tocar-lo.',
      5,
      'Reposar el cuscús',
    ),
    p('Destapa’l i esponja’l amb una forquilla, desfent els grumolls, fins que els grans quedin solts.'),
  ],

  'verdures-saltejades': [
    p(
      'Pela les pastanagues ({pastanaga}) i talla-les a bastonets fins, d’uns 4 cm de llarg i 5 mm de gruix. Talla el carbassó ({carbasso}) ' +
        'a bastonets iguals. Treu les llavors del pebrot ({pebrot-vermell}) i talla’l a tires fines. Pela la ceba ({ceba}) i talla-la a tires fines.',
    ),
    p('Escalfa una paella gran o un wok a foc fort amb l’oli ({oli-oliva}). Ha d’estar molt calent: la verdura ha de petar en tocar l’oli.'),
    c('Afegeix la pastanaga i la ceba (són les més dures) i salta-les remenant sovint.', 3, 'Saltar pastanaga i ceba'),
    c(
      'Afegeix el pebrot i el carbassó i continua saltant fins que tot sigui tendre però encara cruixent, amb alguna vora daurada. ' +
        'Sala-ho amb la sal ({sal}) al final (si sales abans, la verdura deixa anar aigua i es cou en lloc de saltar-se).',
      4,
      'Saltar totes les verdures',
    ),
  ],
};
