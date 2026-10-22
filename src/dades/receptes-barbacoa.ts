import type { Pas, Recepta } from '../domini';
import { c, l, p } from './ajudants';

// Receptes per fer a la barbacoa (petició de Roger, octubre de 2026). Totes necessiten la barbacoa
// i el planificador només les posa en cap de setmana: fer les brases ja és una bona estona,
// i el temps de cada recepta l'inclou. Quantitats per a 4 racions normals.

/** Minuts per fer les brases (comptats al temps de cada recepta). */
const FOC = 40;

/** Primer pas de totes: fer les brases. */
const ferBrases = (com = 'mitjà-fort'): Pas =>
  c(
    'Encén la barbacoa amb carbó vegetal o llenya i deixa que es facin les brases: són a punt quan ja no fan flama i el carbó és cobert de cendra blanca. ' +
      `Estén-les i posa-hi la graella neta perquè s’escalfi. Per a aquesta recepta cal foc ${com}: posa la mà a un pam de la graella ` +
      (com === 'fort' ? 'i només l’has d’aguantar 2-3 segons.' : com === 'suau' ? 'i l’has de poder aguantar 7-8 segons.' : 'i l’has d’aguantar uns 4-5 segons.'),
    FOC,
    'Fer les brases',
  );

/** Untar la graella perquè no s'hi enganxi el peix. */
const untarGraella = p('Unta la graella calenta amb un paper de cuina amb oli (agafat amb unes pinces) perquè no s’hi enganxi.');

interface Brasa {
  id: string;
  nom: string;
  /** Minuts de feina i de brasa, sense fer el foc. */
  minuts: number;
  etiquetes: string[];
  ingredients: Recepta['ingredients'];
  passos: Pas[];
  foc?: 'suau' | 'mitjà-fort' | 'fort';
  acompanyaments?: string[];
  salses?: string[];
  aparells?: Recepta['aparells'];
  tipus?: Recepta['tipus'];
  /** Sense acompanyament (el plat ja és complet). */
  sol?: boolean;
  peix?: boolean;
}

/** Acompanyaments per a la carn a la brasa. */
const AMB_CARN = ['patates-caliu', 'escalivada-brasa', 'verdures-brasa', 'panotxes-brasa', 'amanida', 'amanida-ceba-tomaquet', 'pa-amb-tomaquet', 'patates-fregides'];
/** Acompanyaments per a l’asado argentí. */
const AMB_ARGENTINA = ['papes-provencal', 'amanida', 'amanida-ceba-tomaquet', 'patates-caliu', 'verdures-brasa', 'escalivada-brasa'];
/** Acompanyaments per al peix i el marisc a la brasa. */
const AMB_PEIX = ['patates-caliu', 'escalivada-brasa', 'verdures-brasa', 'esparrecs-brasa', 'amanida', 'amanida-ceba-tomaquet'];

function brasa(b: Brasa): Recepta {
  const r: Recepta = {
    id: b.id,
    nom: b.nom,
    racions: 4,
    tempsMinuts: FOC + b.minuts,
    etiquetes: b.etiquetes,
    ingredients: b.ingredients,
    passos: [ferBrases(b.foc), ...(b.peix ? [untarGraella] : []), ...b.passos],
    aparells: b.aparells ?? ['barbacoa'],
  };
  if (b.tipus) r.tipus = b.tipus;
  if (!b.sol && b.tipus !== 'acompanyament') {
    r.ambAcompanyament = true;
    r.acompanyaments = b.acompanyaments ?? (b.peix ? AMB_PEIX : AMB_CARN);
  }
  if (b.salses) r.salses = b.salses;
  return r;
}

/** Deixar reposar la carn abans de tallar-la perquè no perdi el suc. */
const reposar = (minuts = 5): Pas =>
  c('Treu la carn de la graella i deixa-la reposar sobre una post, tapada amb paper d’alumini, perquè el suc es reparteixi i no es perdi en tallar-la.', minuts, 'Reposar la carn');

export const receptesBarbacoa: Recepta[] = [
  // ——— Porc ———
  brasa({
    id: 'botifarra-brasa-mongetes',
    nom: 'Botifarra a la brasa amb mongetes',
    minuts: 25,
    etiquetes: ['carn'],
    foc: 'suau',
    sol: true,
    salses: ['allioli'],
    ingredients: [l('botifarra', 640), l('mongetes-cuites', 800), l('all', 2), l('julivert', 5), l('oli-oliva', 30), l('sal', 2)],
    passos: [
      c(
        'Posa les botifarres ({botifarra}) senceres a la graella, sense punxar-les (perdrien el suc). Cou-les a foc suau girant-les de tant en tant ' +
          'fins que siguin daurades per tots els costats i fetes per dins: si en talles una, no ha de ser rosada.',
        20,
        'Coure les botifarres',
      ),
      p('Mentrestant, a la cuina, esbandeix i escorre les mongetes ({mongetes-cuites}). Lamina els alls ({all}) i pica el julivert ({julivert}).'),
      c(
        'En una paella a foc mitjà amb l’oli ({oli-oliva}), daura una mica els alls, afegeix-hi les mongetes i la sal ({sal}) i salta-les fins que siguin calentes ' +
          'i algunes es rosseixin. Acaba-les amb el julivert.',
        6,
        'Saltar les mongetes',
      ),
      p('Serveix cada botifarra amb les mongetes al costat.'),
    ],
  }),
  brasa({
    id: 'graellada-embotits',
    nom: 'Graellada d’embotits amb pa amb tomàquet',
    minuts: 25,
    etiquetes: ['carn'],
    foc: 'suau',
    sol: true,
    salses: ['allioli', 'mojo-pico'],
    ingredients: [
      l('botifarra', 400),
      l('botifarra-negra', 280),
      l('xistorra', 220),
      l('pa-pages', 400),
      l('tomaquet', 3, 'u'),
      l('oli-oliva', 30),
      l('sal', 2),
    ],
    passos: [
      c(
        'Posa la botifarra ({botifarra}) a la graella, sense punxar-la, i cou-la a foc suau girant-la de tant en tant fins que sigui feta per dins.',
        18,
        'Coure la botifarra',
      ),
      c(
        'Els últims minuts, afegeix-hi la botifarra negra ({botifarra-negra}) i la xistorra ({xistorra}), que es fan de pressa: només cal que s’escalfin i es daurin.',
        6,
        'Botifarra negra i xistorra',
      ),
      p(
        'Torra les llesques de pa ({pa-pages}) a la graella. Refrega-hi els tomàquets ({tomaquet}) tallats per la meitat i posa-hi la sal ({sal}) i l’oli ({oli-oliva}).',
      ),
      p('Talla els embotits a trossos i serveix-ho tot al mig de la taula.'),
    ],
  }),
  brasa({
    id: 'costella-porc-barbacoa',
    nom: 'Costella de porc a la brasa amb salsa barbacoa',
    minuts: 50,
    etiquetes: ['carn'],
    foc: 'suau',
    ingredients: [
      l('costella-porc', 1200),
      l('all', 2),
      l('pebre-vermell', 5),
      l('pebre-negre', 1),
      l('sal', 6),
      l('ketchup', 100),
      l('mel', 30),
      l('vinagre', 10),
    ],
    passos: [
      p(
        'Pica els alls ({all}) i barreja’ls amb el pebre vermell ({pebre-vermell}), el pebre negre ({pebre-negre}) i la sal ({sal}). ' +
          'Frega’n bé la costella ({costella-porc}) per tots els costats.',
      ),
      c(
        'Posa la costella a la graella, a la banda on hi ha menys brasa (la costella vol foc suau i llarg perquè es faci per dins sense cremar-se). ' +
          'Gira-la cada 10 minuts.',
        35,
        'Coure la costella',
      ),
      p('Mentrestant, barreja el ketchup ({ketchup}), la mel ({mel}) i el vinagre ({vinagre}): és la salsa barbacoa per pintar.'),
      c(
        'Pinta la costella amb la salsa per tots els costats i deixa-la a la graella, girant-la i tornant-la a pintar, fins que la salsa quedi enganxosa i rossa. ' +
          'Vigila que no es cremi: el sucre de la salsa es crema de pressa.',
        8,
        'Glasejar la costella',
      ),
    ],
  }),
  brasa({
    id: 'costella-tires-brasa',
    nom: 'Costella de porc a tires a la brasa',
    minuts: 20,
    etiquetes: ['carn'],
    salses: ['chimichurri', 'allioli'],
    ingredients: [l('costella-tires', 1000), l('sal', 6), l('all', 2), l('julivert', 5), l('oli-oliva', 30)],
    passos: [
      p('Pica els alls ({all}) i el julivert ({julivert}) i barreja’ls amb l’oli ({oli-oliva}).'),
      c('Sala les tires de costella ({costella-tires}) amb la sal ({sal}) i posa-les a la graella. Cou-les fins que siguin ben daurades. El cronòmetre és per a cada banda.', 5, 'Coure cada banda'),
      p('Posa-les en una plata i pinta-les de seguida amb l’oli d’all i julivert.'),
    ],
  }),
  brasa({
    id: 'secret-porc-brasa',
    nom: 'Secret de porc a la brasa',
    minuts: 20,
    etiquetes: ['carn'],
    foc: 'fort',
    salses: ['chimichurri', 'mojo-pico'],
    ingredients: [l('secret-porc', 800), l('sal', 6), l('pebre-negre', 1)],
    passos: [
      p('Treu el secret ({secret-porc}) de la nevera mitja hora abans perquè no sigui fred del tot. Asseca’l amb paper de cuina.'),
      c(
        'Posa’l a la graella a foc fort, sense sal, i no el toquis fins que sigui ben daurat i el greix cruixent. Gira’l una vegada. El cronòmetre és per a cada banda.',
        5,
        'Coure cada banda',
      ),
      reposar(3),
      p('Talla’l a tires, en diagonal, i posa-hi la sal ({sal}) i el pebre ({pebre-negre}) just abans de servir-lo.'),
    ],
  }),
  brasa({
    id: 'presa-iberica-brasa',
    nom: 'Presa ibèrica a la brasa',
    minuts: 20,
    etiquetes: ['carn'],
    foc: 'fort',
    salses: ['chimichurri', 'romesco'],
    ingredients: [l('presa-iberica', 660), l('oli-oliva', 10), l('sal', 5)],
    passos: [
      p('Treu la presa ({presa-iberica}) de la nevera mitja hora abans i unta-la amb l’oli ({oli-oliva}).'),
      c(
        'Cou-la a la graella a foc fort fins que sigui ben marcada per fora i encara rosada al mig (la presa ibèrica es menja al punt). El cronòmetre és per a cada banda.',
        5,
        'Coure cada banda',
      ),
      reposar(5),
      p('Talla-la a llesques gruixudes i posa-hi la sal ({sal}) per sobre.'),
    ],
  }),
  brasa({
    id: 'ploma-porc-brasa',
    nom: 'Ploma de porc a la brasa amb romaní',
    minuts: 20,
    etiquetes: ['carn'],
    foc: 'fort',
    salses: ['mojo-verd', 'salsa-mostassa-mel'],
    ingredients: [l('ploma-porc', 600), l('romani', 1), l('sal', 5), l('pebre-negre', 1)],
    passos: [
      p('Frega la ploma ({ploma-porc}) amb el romaní ({romani}) esmicolat i deixa-la a temperatura ambient mentre es fan les brases.'),
      c('Cou-la a la graella a foc fort fins que sigui ben daurada per fora i sucosa per dins. El cronòmetre és per a cada banda.', 4, 'Coure cada banda'),
      reposar(4),
      p('Talla-la a llesques i posa-hi la sal ({sal}) i el pebre ({pebre-negre}).'),
    ],
  }),
  brasa({
    id: 'llom-adobat-brasa',
    nom: 'Llom de porc adobat a la brasa',
    minuts: 45,
    etiquetes: ['carn'],
    salses: ['allioli'],
    ingredients: [
      l('llom', 700),
      l('all', 3),
      l('pebre-vermell', 6),
      l('orenga', 2),
      l('vinagre', 15),
      l('oli-oliva', 30),
      l('sal', 5),
    ],
    passos: [
      p(
        'Adob: pica els alls ({all}) i barreja’ls en un plat fondo amb el pebre vermell ({pebre-vermell}), l’orenga ({orenga}), el vinagre ({vinagre}), ' +
          'l’oli ({oli-oliva}) i la sal ({sal}).',
      ),
      c('Passa els filets de llom ({llom}) per l’adob, que quedin ben coberts, i deixa’ls marinar mentre es fan les brases.', 30, 'Marinar el llom'),
      c('Cou els filets a la graella fins que siguin daurats: com que són prims, es fan de pressa i s’assequen si es passen. El cronòmetre és per a cada banda.', 2, 'Coure cada banda'),
    ],
  }),
  brasa({
    id: 'pinxos-morunos',
    nom: 'Pinxos morunos amb pebrot i ceba',
    minuts: 30,
    etiquetes: ['carn'],
    salses: ['mojo-pico', 'allioli'],
    ingredients: [l('pinxos-porc', 800), l('pebrot-verd', 150), l('ceba', 1, 'u'), l('oli-oliva', 15), l('sal', 2)],
    passos: [
      p('Si les broquetes són de fusta, posa-les en remull amb aigua 20 minuts perquè no es cremin.'),
      p(
        'Talla el pebrot ({pebrot-verd}) i la ceba ({ceba}) a quadrats d’uns 3 cm. Clava a les broquetes els daus de carn adobada ({pinxos-porc}) ' +
          'alternats amb pebrot i ceba. Pinta les verdures amb l’oli ({oli-oliva}) i la sal ({sal}).',
      ),
      c('Cou les broquetes a la graella, girant-les cada pocs minuts, fins que la carn sigui ben daurada i feta per dins.', 12, 'Coure les broquetes'),
    ],
  }),
  brasa({
    id: 'panceta-brasa',
    nom: 'Panceta a la brasa amb pa amb tomàquet',
    minuts: 20,
    etiquetes: ['carn'],
    sol: true,
    salses: ['mojo-pico'],
    ingredients: [l('panceta', 800), l('sal', 6), l('pa-pages', 400), l('tomaquet', 3, 'u'), l('oli-oliva', 20)],
    passos: [
      c(
        'Posa les llesques de panceta ({panceta}) a la graella i cou-les fins que el greix sigui daurat i cruixent. Si el greix fa flama, aparta-les un moment. ' +
          'El cronòmetre és per a cada banda.',
        5,
        'Coure cada banda',
      ),
      p('Posa-hi la sal ({sal}) en treure-les.'),
      p('Torra el pa ({pa-pages}) a la graella, refrega-hi els tomàquets ({tomaquet}) tallats per la meitat i posa-hi un raig d’oli ({oli-oliva}).'),
    ],
  }),
  brasa({
    id: 'filet-porc-mostassa',
    nom: 'Filet de porc a la brasa amb mostassa i mel',
    minuts: 35,
    etiquetes: ['carn'],
    salses: ['salsa-mostassa-mel', 'salsa-bolets'],
    ingredients: [l('filet-porc', 1100), l('mostassa', 40), l('mel', 30), l('oli-oliva', 20), l('romani', 1), l('sal', 5)],
    passos: [
      p('Barreja la mostassa ({mostassa}), la mel ({mel}), l’oli ({oli-oliva}), el romaní ({romani}) esmicolat i la sal ({sal}). Unta’n els filets de porc ({filet-porc}).'),
      c(
        'Cou els filets sencers a la graella, girant-los cada 4 o 5 minuts perquè es facin per tots els costats, fins que per dins siguin només una mica rosats ' +
          '(si en punxes un, el suc ha de sortir clar).',
        20,
        'Coure els filets',
      ),
      reposar(5),
      p('Talla’ls a medallons de 2 dits de gruix.'),
    ],
  }),
  brasa({
    id: 'costelles-coll-brasa',
    nom: 'Costelles de coll a la brasa amb herbes',
    minuts: 25,
    etiquetes: ['carn'],
    salses: ['allioli', 'chimichurri'],
    ingredients: [l('costelles-coll', 1000), l('farigola', 2), l('romani', 1), l('all', 2), l('oli-oliva', 30), l('sal', 6)],
    passos: [
      p('Pica els alls ({all}) i barreja’ls amb l’oli ({oli-oliva}), la farigola ({farigola}) i el romaní ({romani}). Unta’n les costelles ({costelles-coll}).'),
      c('Cou-les a la graella fins que siguin ben daurades i fetes per dins (prop de l’os no han de ser rosades). El cronòmetre és per a cada banda.', 6, 'Coure cada banda'),
      p('Posa-hi la sal ({sal}) en treure-les.'),
    ],
  }),

  // ——— Vedella ———
  brasa({
    id: 'xurrasco-vedella',
    nom: 'Xurrasco de vedella a la brasa',
    minuts: 15,
    etiquetes: ['carn'],
    foc: 'fort',
    salses: ['chimichurri', 'salsa-pebre', 'salsa-formatge-blau'],
    ingredients: [l('xurrasco-vedella', 660), l('oli-oliva', 10), l('sal', 5)],
    passos: [
      p('Treu la carn ({xurrasco-vedella}) de la nevera mitja hora abans i unta-la amb l’oli ({oli-oliva}).'),
      c('Cou-la a foc fort fins que sigui ben marcada; per dins, al gust (com més temps, més feta). El cronòmetre és per a cada banda.', 3, 'Coure cada banda'),
      reposar(3),
      p('Posa-hi la sal ({sal}) per sobre i serveix-la amb el chimichurri.'),
    ],
  }),
  brasa({
    id: 'hamburgueses-brasa',
    nom: 'Hamburgueses a la barbacoa',
    minuts: 20,
    etiquetes: ['carn'],
    acompanyaments: ['patates-caliu', 'patates-fregides', 'panotxes-brasa', 'amanida'],
    salses: ['salsa-barbacoa'],
    ingredients: [
      l('hamburguesa', 4, 'u'),
      l('sal', 2),
      l('formatge-llesques', 80),
      l('pa-hamburguesa', 4),
      l('enciam', 1),
      l('tomaquet', 1, 'u'),
      l('ceba-vermella', 75),
      l('ketchup', 40),
    ],
    passos: [
      p('Renta l’enciam ({enciam}) i talla el tomàquet ({tomaquet}) i la ceba vermella ({ceba-vermella}) a rodanxes fines.'),
      c(
        'Sala les hamburgueses ({hamburguesa}) amb la sal ({sal}) i cou-les a la graella fins que siguin fetes per dins. Gira-les una sola vegada i no les aixafis ' +
          '(perdrien el suc). El cronòmetre és per a cada banda.',
        5,
        'Coure cada banda',
      ),
      p('L’últim minut, posa una llesca de formatge ({formatge-llesques}) sobre cada hamburguesa i torra els panets ({pa-hamburguesa}) oberts a la graella.'),
      p('Munta-les: panet, enciam, hamburguesa amb formatge, tomàquet, ceba i ketchup ({ketchup}).'),
    ],
  }),

  // ——— Pollastre ———
  brasa({
    id: 'pollastre-brasa-herbes',
    nom: 'Pollastre a la brasa amb llimona i herbes',
    minuts: 60,
    etiquetes: ['carn'],
    foc: 'suau',
    salses: ['allioli', 'mojo-verd'],
    ingredients: [
      l('quarts-pollastre', 1600),
      l('llimona', 1, 'u'),
      l('all', 3),
      l('romani', 2),
      l('farigola', 2),
      l('oli-oliva', 40),
      l('pebre-negre', 1),
      l('sal', 8),
    ],
    passos: [
      p(
        'Adob: barreja el suc de la llimona ({llimona}), els alls ({all}) picats, el romaní ({romani}), la farigola ({farigola}), l’oli ({oli-oliva}), ' +
          'el pebre ({pebre-negre}) i la sal ({sal}). Fes uns talls a la carn dels quarts de pollastre ({quarts-pollastre}) i unta’ls bé, també per sota la pell.',
      ),
      c(
        'Posa el pollastre a la graella amb la pell cap amunt, a la banda de menys brasa: ha de coure’s a poc a poc. Gira’l cada 10 minuts.',
        40,
        'Coure el pollastre',
      ),
      c(
        'Acaba’l amb la pell cap avall, a sobre de més brasa, fins que sigui daurada i cruixent. És fet quan, punxant la part més gruixuda de la cuixa, el suc surt clar.',
        8,
        'Daurar la pell',
      ),
    ],
  }),
  brasa({
    id: 'ales-pollastre-barbacoa',
    nom: 'Ales de pollastre a la barbacoa',
    minuts: 35,
    etiquetes: ['carn'],
    foc: 'suau',
    acompanyaments: ['patates-caliu', 'patates-fregides', 'panotxes-brasa', 'amanida'],
    salses: ['salsa-barbacoa', 'salsa-formatge-blau'],
    ingredients: [
      l('ales-pollastre', 1200),
      l('pebre-vermell', 5),
      l('all', 2),
      l('sal', 4),
      l('ketchup', 100),
      l('mel', 30),
      l('salsa-soja', 20),
    ],
    passos: [
      p('Si les ales ({ales-pollastre}) són congelades, descongela-les a la nevera la nit abans. Asseca-les amb paper de cuina.'),
      p('Frega-les amb els alls ({all}) picats, el pebre vermell ({pebre-vermell}) i la sal ({sal}).'),
      c('Cou-les a la graella a foc suau, girant-les sovint, fins que la pell sigui daurada i la carn feta.', 20, 'Coure les ales'),
      p('Barreja el ketchup ({ketchup}), la mel ({mel}) i la salsa de soja ({salsa-soja}).'),
      c('Pinta les ales amb la salsa i deixa-les uns minuts més, girant-les i tornant-les a pintar, fins que quedin enganxoses. Vigila que no es cremin.', 6, 'Glasejar les ales'),
    ],
  }),
  brasa({
    id: 'contracuixes-marinades-brasa',
    nom: 'Contracuixes de pollastre marinades amb soja i mel',
    minuts: 50,
    etiquetes: ['carn'],
    salses: ['salsa-mostassa-mel'],
    ingredients: [
      l('cuixes-pollastre', 1000),
      l('salsa-soja', 40),
      l('mel', 30),
      l('llimona', 1, 'u'),
      l('all', 2),
      l('oli-oliva', 20),
      l('pebre-negre', 1),
    ],
    passos: [
      p(
        'Marinada: barreja la salsa de soja ({salsa-soja}), la mel ({mel}), el suc de la llimona ({llimona}), els alls ({all}) picats, l’oli ({oli-oliva}) ' +
          'i el pebre ({pebre-negre}). No cal sal: la soja ja n’hi posa.',
      ),
      c('Posa les contracuixes ({cuixes-pollastre}) a la marinada i deixa-les-hi mentre es fan les brases (si pots, des del matí a la nevera).', 30, 'Marinar el pollastre'),
      c(
        'Cou-les a la graella fins que siguin daurades i fetes per dins (el suc ha de sortir clar). Vigila que la mel no les cremi. El cronòmetre és per a cada banda.',
        8,
        'Coure cada banda',
      ),
    ],
  }),
  brasa({
    id: 'broquetes-pollastre-pebrot',
    nom: 'Broquetes de pollastre i pebrot',
    minuts: 50,
    etiquetes: ['carn'],
    salses: ['mojo-verd', 'salsa-mostassa-mel'],
    ingredients: [
      l('pit-pollastre', 700),
      l('pebrot-vermell', 200),
      l('pebrot-verd', 150),
      l('ceba', 1, 'u'),
      l('llimona', 1, 'u'),
      l('pebre-vermell', 3),
      l('orenga', 2),
      l('oli-oliva', 40),
      l('sal', 5),
    ],
    passos: [
      p('Si les broquetes són de fusta, posa-les en remull amb aigua 20 minuts perquè no es cremin.'),
      c(
        'Talla el pit de pollastre ({pit-pollastre}) a daus de 3 cm i barreja’l amb el suc de la llimona ({llimona}), el pebre vermell ({pebre-vermell}), ' +
          'l’orenga ({orenga}), l’oli ({oli-oliva}) i la sal ({sal}). Deixa’l marinar una estona.',
        20,
        'Marinar el pollastre',
      ),
      p('Talla els pebrots ({pebrot-vermell}, {pebrot-verd}) i la ceba ({ceba}) a quadrats i fes les broquetes alternant pollastre i verdures.'),
      c('Cou-les a la graella, girant-les cada pocs minuts, fins que el pollastre sigui daurat i fet per dins (sense que s’assequi).', 12, 'Coure les broquetes'),
    ],
  }),
  brasa({
    id: 'pollastre-teriyaki-brasa',
    nom: 'Pollastre teriyaki a la brasa',
    minuts: 40,
    etiquetes: ['carn'],
    acompanyaments: ['arros-blanc', 'verdures-brasa', 'esparrecs-brasa'],
    salses: ['salsa-teriyaki'],
    ingredients: [
      l('cuixes-pollastre', 1000),
      l('salsa-soja', 80),
      l('mel', 40),
      l('sucre', 10),
      l('gingebre', 10),
      l('all', 2),
    ],
    passos: [
      p('Pela i ratlla el gingebre ({gingebre}) i els alls ({all}).'),
      c(
        'Salsa teriyaki: posa’ls en un cassó amb la salsa de soja ({salsa-soja}), la mel ({mel}), el sucre ({sucre}) i 3 cullerades d’aigua, ' +
          'i cou-ho a foc baix fins que espesseixi. Separa’n la meitat per servir.',
        6,
        'Fer la salsa',
      ),
      c('Pinta les contracuixes ({cuixes-pollastre}) amb l’altra meitat i cou-les a la graella, pintant-les cada vegada que les giris. El cronòmetre és per a cada banda.', 8, 'Coure cada banda'),
      p('Talla-les a tires i serveix-les amb la salsa reservada per sobre.'),
    ],
  }),

  // ——— Xai i conill ———
  brasa({
    id: 'costelles-xai-brasa',
    nom: 'Costelles de xai a la brasa amb romaní',
    minuts: 15,
    etiquetes: ['carn'],
    foc: 'fort',
    salses: ['allioli'],
    ingredients: [l('costelles-xai', 870), l('romani', 2), l('all', 2), l('oli-oliva', 20), l('sal', 5)],
    passos: [
      p('Pica els alls ({all}) i barreja’ls amb l’oli ({oli-oliva}) i el romaní ({romani}). Unta’n les costelles ({costelles-xai}).'),
      c('Cou-les a foc fort fins que el greix sigui daurat i la carn encara una mica rosada. El cronòmetre és per a cada banda.', 3, 'Coure cada banda'),
      p('Posa-hi la sal ({sal}) en treure-les i menja-les de seguida (amb les mans, com es fa a la brasa).'),
    ],
  }),
  brasa({
    id: 'conill-brasa',
    nom: 'Conill a la brasa amb farigola',
    minuts: 35,
    etiquetes: ['carn'],
    foc: 'suau',
    salses: ['allioli'],
    ingredients: [l('conill', 1200), l('all', 2), l('farigola', 2), l('oli-oliva', 30), l('sal', 6)],
    passos: [
      p('Pica els alls ({all}) i barreja’ls amb l’oli ({oli-oliva}), la farigola ({farigola}) i la sal ({sal}). Unta’n bé els trossos de conill ({conill}).'),
      c(
        'Cou el conill a la graella a foc suau, girant-lo i pintant-lo amb l’oli que hagi sobrat, fins que sigui daurat i fet per dins (el conill sec no és bo: vigila els trossos prims).',
        25,
        'Coure el conill',
      ),
      p('Serveix-lo amb l’allioli.'),
    ],
  }),

  // ——— Peix i marisc ———
  brasa({
    id: 'sardines-brasa',
    nom: 'Sardines a la brasa',
    minuts: 15,
    etiquetes: ['peix'],
    foc: 'fort',
    peix: true,
    acompanyaments: ['pa-amb-tomaquet', 'amanida', 'amanida-ceba-tomaquet', 'escalivada-brasa', 'patates-caliu'],
    ingredients: [l('sardines', 1000), l('sal', 8), l('oli-oliva', 20)],
    passos: [
      p('Renta les sardines ({sardines}) i asseca-les. Posa-hi la sal ({sal}) per sobre deu minuts abans de coure-les.'),
      c('Posa-les a la graella (millor amb una graella doble, per girar-les totes alhora) i cou-les fins que la pell faci bombolles. El cronòmetre és per a cada banda.', 2.5, 'Coure cada banda'),
      p('Serveix-les amb un raig d’oli ({oli-oliva}).'),
    ],
  }),
  brasa({
    id: 'orada-brasa',
    nom: 'Orada a la brasa a l’espatlla',
    minuts: 20,
    etiquetes: ['peix'],
    peix: true,
    salses: ['all-i-julivert'],
    ingredients: [l('orada', 4), l('sal', 5), l('all', 3), l('julivert', 5), l('oli-oliva', 60), l('vinagre', 10)],
    passos: [
      p('Asseca les orades obertes ({orada}) amb paper de cuina i posa-hi la sal ({sal}) per la banda de la carn.'),
      c('Posa-les a la graella amb la pell cap avall i no les toquis: es fan gairebé del tot per aquesta banda.', 8, 'Coure per la pell'),
      c('Gira-les amb compte i deixa-les per la banda de la carn només fins que sigui blanca i se separi de l’espina.', 2, 'Coure per la carn'),
      p(
        'Mentrestant, a la cuina, daura els alls ({all}) laminats en un cassó amb l’oli ({oli-oliva}). Aparta’l del foc, afegeix-hi el vinagre ({vinagre}) ' +
          'i el julivert ({julivert}) picat i tira-ho per sobre de les orades.',
      ),
    ],
  }),
  brasa({
    id: 'llobarro-brasa',
    nom: 'Llobarro a la brasa amb llimona',
    minuts: 20,
    etiquetes: ['peix'],
    peix: true,
    salses: ['all-i-julivert', 'mojo-verd'],
    ingredients: [l('llobarro', 4), l('sal', 5), l('farigola', 1), l('llimona', 1, 'u'), l('oli-oliva', 40)],
    passos: [
      p('Asseca els llobarros oberts ({llobarro}) i unta’ls amb la meitat de l’oli ({oli-oliva:1/2}), la sal ({sal}) i la farigola ({farigola}).'),
      c('Cou-los amb la pell cap avall fins que la pell sigui cruixent i la carn gairebé blanca.', 8, 'Coure per la pell'),
      c('Gira’ls un moment per la banda de la carn.', 2, 'Coure per la carn'),
      p('Serveix-los amb la llimona ({llimona}) a gallons i la resta de l’oli per sobre.'),
    ],
  }),
  brasa({
    id: 'salmo-brasa',
    nom: 'Salmó a la brasa',
    minuts: 15,
    etiquetes: ['peix'],
    peix: true,
    salses: ['salsa-mostassa-mel', 'salsa-teriyaki'],
    ingredients: [l('salmo', 700), l('oli-oliva', 20), l('sal', 4), l('pebre-negre', 1), l('llimona', 1, 'u')],
    passos: [
      p('Asseca les rodanxes de salmó ({salmo}), unta-les amb l’oli ({oli-oliva}) i posa-hi la sal ({sal}) i el pebre ({pebre-negre}).'),
      c('Cou-les a la graella sense moure-les fins que es desenganxin soles. El cronòmetre és per a cada banda: per dins ha de quedar sucós.', 4, 'Coure cada banda'),
      p('Serveix-les amb la llimona ({llimona}) a gallons.'),
    ],
  }),
  brasa({
    id: 'tonyina-brasa',
    nom: 'Tonyina a la brasa',
    minuts: 10,
    etiquetes: ['peix'],
    foc: 'fort',
    peix: true,
    salses: ['mojo-verd', 'salsa-teriyaki'],
    ingredients: [l('tonyina-fresca', 700), l('oli-oliva', 20), l('sal', 4), l('pebre-negre', 1)],
    passos: [
      p('Si la tonyina ({tonyina-fresca}) és descongelada, asseca-la bé. Unta-la amb l’oli ({oli-oliva}).'),
      c('Cou-la a foc fort: només s’ha de marcar per fora i quedar rosada al mig (si es fa massa, queda seca). El cronòmetre és per a cada banda.', 1.5, 'Coure cada banda'),
      p('Posa-hi la sal ({sal}) i el pebre ({pebre-negre}) i talla-la a tires.'),
    ],
  }),
  brasa({
    id: 'llagostins-brasa',
    nom: 'Llagostins a la brasa',
    minuts: 15,
    etiquetes: ['peix'],
    foc: 'fort',
    peix: true,
    acompanyaments: ['amanida', 'amanida-ceba-tomaquet', 'arros-blanc', 'verdures-brasa', 'esparrecs-brasa'],
    salses: ['all-i-julivert', 'allioli'],
    ingredients: [l('llagostins', 800), l('oli-oliva', 30), l('sal', 6)],
    passos: [
      p('Descongela els llagostins ({llagostins}) a la nevera la nit abans. Asseca’ls i unta’ls amb l’oli ({oli-oliva}).'),
      c('Posa’ls a la graella amb la sal ({sal}) per sobre i cou-los fins que canviïn de color. El cronòmetre és per a cada banda.', 2, 'Coure cada banda'),
      p('Serveix-los de seguida amb l’oli d’all i julivert per sucar.'),
    ],
  }),
  brasa({
    id: 'sipia-brasa',
    nom: 'Sípia a la brasa amb all i julivert',
    minuts: 20,
    etiquetes: ['peix'],
    foc: 'fort',
    peix: true,
    salses: ['allioli'],
    ingredients: [l('sipia', 800), l('all', 3), l('julivert', 10), l('oli-oliva', 50), l('sal', 4)],
    passos: [
      p('Descongela la sípia ({sipia}) si cal, asseca-la molt bé i fes-hi uns talls superficials en forma de reixa perquè no s’arronsi.'),
      p('Pica els alls ({all}) i el julivert ({julivert}) i barreja’ls amb l’oli ({oli-oliva}) i la sal ({sal}).'),
      c('Cou la sípia a foc fort fins que sigui blanca i marcada. Pinta-la amb l’oli d’all i julivert en girar-la. El cronòmetre és per a cada banda.', 4, 'Coure cada banda'),
      p('Talla-la a tires i tira-hi per sobre la resta de l’oli d’all i julivert.'),
    ],
  }),
  brasa({
    id: 'calamarsons-brasa',
    nom: 'Calamars a la brasa',
    minuts: 15,
    etiquetes: ['peix'],
    foc: 'fort',
    peix: true,
    salses: ['all-i-julivert', 'allioli'],
    ingredients: [l('calamarsons', 900), l('all', 2), l('julivert', 5), l('oli-oliva', 40), l('sal', 4), l('llimona', 1, 'u')],
    passos: [
      p('Asseca molt bé els calamars ({calamarsons}): mullats, es couen en lloc de rostir-se.'),
      c('Cou-los a foc fort amb la sal ({sal}) fins que siguin blancs i amb marques de la graella: si es couen massa, queden durs. El cronòmetre és per a cada banda.', 2, 'Coure cada banda'),
      p('Pica els alls ({all}) i el julivert ({julivert}), barreja’ls amb l’oli ({oli-oliva}) i tira-ho per sobre. Serveix-los amb la llimona ({llimona}).'),
    ],
  }),
  brasa({
    id: 'pop-brasa-patates',
    nom: 'Pop a la brasa amb patates',
    minuts: 35,
    etiquetes: ['peix'],
    sol: true,
    peix: true,
    ingredients: [l('patata', 800), l('pop', 500), l('pebre-vermell', 4), l('oli-oliva', 50), l('sal', 5)],
    passos: [
      c(
        'A la cuina, bull les patates ({patata}) senceres i amb pell, en aigua amb sal ({sal}), fins que una agulla hi entri fàcilment.',
        25,
        'Bullir les patates',
      ),
      p('Talla les patates per la meitat i posa-les a la graella per la banda tallada fins que siguin rosses.'),
      c('Unta les potes de pop cuit ({pop}) amb una mica d’oli i posa-les a la graella fins que siguin calentes i torrades per fora.', 3, 'Torrar el pop'),
      p('Talla el pop a rodanxes sobre les patates i amaneix-ho amb el pebre vermell ({pebre-vermell}) i la resta de l’oli ({oli-oliva}).'),
    ],
  }),
  brasa({
    id: 'musclos-brasa',
    nom: 'Musclos a la brasa',
    minuts: 20,
    etiquetes: ['peix'],
    foc: 'fort',
    sol: true,
    peix: true,
    ingredients: [l('musclos', 2000), l('all', 2), l('julivert', 5), l('oli-oliva', 30), l('llimona', 1, 'u'), l('pa-pages', 300)],
    passos: [
      p('Neteja els musclos ({musclos}): raspa’ls, treu-los la barba i llença els que estiguin trencats o oberts que no es tanquin en tocar-los.'),
      c('Posa’ls directament sobre la graella a foc fort i deixa’ls fins que s’obrin (els que no s’obrin, es llencen).', 6, 'Obrir els musclos'),
      p('Pica els alls ({all}) i el julivert ({julivert}), barreja’ls amb l’oli ({oli-oliva}) i el suc de la llimona ({llimona}) i tira-ho sobre els musclos oberts.'),
      p('Torra el pa ({pa-pages}) a la graella per sucar-hi el suc.'),
    ],
  }),
  brasa({
    id: 'broquetes-llagostins-verdures',
    nom: 'Broquetes de llagostins i verdures',
    minuts: 35,
    etiquetes: ['peix'],
    peix: true,
    acompanyaments: ['arros-blanc', 'amanida', 'amanida-ceba-tomaquet'],
    salses: ['all-i-julivert', 'mojo-verd'],
    ingredients: [
      l('llagostins', 600),
      l('carbasso', 300),
      l('pebrot-vermell', 200),
      l('ceba-vermella', 150),
      l('all', 1),
      l('julivert', 5),
      l('oli-oliva', 40),
      l('sal', 4),
    ],
    passos: [
      p('Si les broquetes són de fusta, posa-les en remull 20 minuts. Descongela i pela els llagostins ({llagostins}), deixant-los la cua.'),
      p(
        'Talla el carbassó ({carbasso}) a rodanxes gruixudes i el pebrot ({pebrot-vermell}) i la ceba ({ceba-vermella}) a quadrats. ' +
          'Fes les broquetes alternant llagostins i verdures.',
      ),
      p('Pica l’all ({all}) i el julivert ({julivert}) i barreja’ls amb l’oli ({oli-oliva}) i la sal ({sal}). Pinta’n les broquetes.'),
      c('Cou-les a la graella, girant-les, fins que els llagostins siguin rosats i les verdures tendres i marcades.', 8, 'Coure les broquetes'),
    ],
  }),

  // ——— Verdures i vegetarians ———
  brasa({
    id: 'calcotada',
    nom: 'Calçots a la brasa amb salvitxada',
    minuts: 40,
    etiquetes: ['verdura', 'vegetaria'],
    foc: 'fort',
    sol: true,
    aparells: ['barbacoa', 'batedora'],
    ingredients: [
      l('calcots', 60),
      l('tomaquet', 3, 'u'),
      l('all', 4),
      l('ametlles', 40),
      l('pa-pages', 30),
      l('pebrot-xoricer', 30),
      l('bitxo', 1),
      l('vinagre', 15),
      l('pebre-vermell', 2),
      l('sal', 3),
      l('oli-oliva', 120),
    ],
    passos: [
      p('Els calçots ({calcots}) són de temporada (de gener a abril, a la verduleria o al mercat). Talla’ls l’arrel i les puntes verdes si són molt llargues.'),
      c(
        'Salvitxada: escaliva a la graella els tomàquets ({tomaquet}) i els alls ({all}) sencers, girant-los, fins que siguin tous i amb la pell negra.',
        15,
        'Escalivar tomàquet i alls',
      ),
      p(
        'Pela’ls i tritura’ls amb la batedora amb les ametlles ({ametlles}), el pa ({pa-pages}) torrat, la carn de pebrot xoricer ({pebrot-xoricer}), el bitxo ({bitxo}), ' +
          'el vinagre ({vinagre}), el pebre vermell ({pebre-vermell}) i la sal ({sal}), mentre hi tires l’oli ({oli-oliva}) a poc a poc.',
      ),
      c(
        'Posa els calçots a la graella, sobre flama viva, fins que les capes de fora siguin ben negres. Gira’ls una vegada.',
        10,
        'Coure els calçots',
      ),
      p(
        'Embolica’ls en paper de diari en paquets i deixa’ls 10 minuts perquè acabin de fer-se amb el seu vapor. Es mengen estirant la capa cremada ' +
          'i sucant-los a la salvitxada.',
      ),
    ],
  }),
  brasa({
    id: 'provoleta-verdures',
    nom: 'Provoleta amb verdures a la brasa',
    minuts: 25,
    etiquetes: ['vegetaria', 'verdura'],
    sol: true,
    salses: ['chimichurri'],
    ingredients: [
      l('carbasso', 300),
      l('alberginia', 300),
      l('pebrot-vermell', 200),
      l('oli-oliva', 30),
      l('sal', 4),
      l('provolone', 400),
      l('orenga', 2),
      l('pa-pages', 300),
    ],
    passos: [
      p('Talla el carbassó ({carbasso}) i l’albergínia ({alberginia}) a llesques de mig dit i el pebrot ({pebrot-vermell}) a tires. Unta-ho amb l’oli ({oli-oliva}) i la sal ({sal}).'),
      c('Cou les verdures a la graella, girant-les una vegada, fins que siguin tendres i marcades.', 10, 'Coure les verdures'),
      c(
        'Posa el provolone ({provolone}) en una paella de ferro o una safata d’alumini sobre la graella, amb l’orenga ({orenga}) per sobre, fins que sigui fos ' +
          'i daurat per sota.',
        6,
        'Fondre la provoleta',
      ),
      p('Torra el pa ({pa-pages}) a la graella i serveix la provoleta calenta al mig de la taula amb les verdures.'),
    ],
  }),
  brasa({
    id: 'portobellos-farcits-brasa',
    nom: 'Portobellos farcits a la brasa',
    minuts: 25,
    etiquetes: ['vegetaria', 'verdura'],
    acompanyaments: ['amanida', 'amanida-ceba-tomaquet', 'patates-caliu', 'pa-amb-tomaquet'],
    ingredients: [
      l('portobello', 8),
      l('all', 2),
      l('julivert', 10),
      l('pa-ratllat', 30),
      l('formatge-ratllat', 80),
      l('oli-oliva', 40),
      l('sal', 3),
    ],
    passos: [
      p('Neteja els portobellos ({portobello}) amb un drap humit, treu-los el peu i pica’l ben fi.'),
      p(
        'Pica els alls ({all}) i el julivert ({julivert}) i barreja’ls amb els peus picats, el pa ratllat ({pa-ratllat}), el formatge ({formatge-ratllat}), ' +
          'l’oli ({oli-oliva}) i la sal ({sal}). Omple’n els barrets.',
      ),
      c('Posa’ls a la graella amb el farcit cap amunt i, si pots, tapa la barbacoa, fins que siguin tendres i el formatge fos.', 12, 'Coure els portobellos'),
    ],
  }),
  brasa({
    id: 'broquetes-verdures',
    nom: 'Broquetes de verdures i xampinyons',
    minuts: 30,
    etiquetes: ['vegetaria', 'verdura'],
    acompanyaments: ['patates-caliu', 'moniatos-caliu', 'arros-blanc', 'cuscus'],
    salses: ['chimichurri', 'mojo-verd', 'romesco'],
    ingredients: [
      l('xampinyons-sencers', 300),
      l('carbasso', 300),
      l('pebrot-vermell', 200),
      l('ceba-vermella', 150),
      l('tomaquet', 2, 'u'),
      l('orenga', 2),
      l('oli-oliva', 40),
      l('sal', 4),
    ],
    passos: [
      p('Si les broquetes són de fusta, posa-les en remull 20 minuts.'),
      p(
        'Neteja els xampinyons ({xampinyons-sencers}). Talla el carbassó ({carbasso}) a rodanxes gruixudes, el pebrot ({pebrot-vermell}) i la ceba ({ceba-vermella}) ' +
          'a quadrats i els tomàquets ({tomaquet}) a quarts. Fes les broquetes alternant-ho tot.',
      ),
      p('Pinta-les amb l’oli ({oli-oliva}), l’orenga ({orenga}) i la sal ({sal}).'),
      c('Cou-les a la graella, girant-les, fins que les verdures siguin tendres i marcades.', 12, 'Coure les broquetes'),
    ],
  }),

  // ——— D’arreu ———
  brasa({
    id: 'tacos-pastor-brasa',
    nom: 'Tacos al pastor a la brasa',
    minuts: 50,
    etiquetes: ['carn'],
    sol: true,
    salses: ['guacamole', 'pico-de-gallo'],
    ingredients: [
      l('llom', 700),
      l('pebre-vermell', 6),
      l('comi', 2),
      l('orenga', 2),
      l('all', 2),
      l('vinagre', 20),
      l('oli-oliva', 20),
      l('sal', 5),
      l('pinya', 300),
      l('tortilla-blat', 12),
      l('ceba-vermella', 75),
      l('coriandre', 10),
      l('llima', 1, 'u'),
    ],
    passos: [
      c(
        'Adob: barreja el pebre vermell ({pebre-vermell}), el comí ({comi}), l’orenga ({orenga}), els alls ({all}) picats, el vinagre ({vinagre}), l’oli ({oli-oliva}) ' +
          'i la sal ({sal}). Unta’n els filets de llom ({llom}) i deixa’ls marinar.',
        30,
        'Marinar el llom',
      ),
      p('Pela la pinya ({pinya}) i talla-la a rodanxes. Pica la ceba vermella ({ceba-vermella}) i el coriandre ({coriandre}).'),
      c('Cou el llom i la pinya a la graella fins que siguin daurats i amb marques. El cronòmetre és per a cada banda.', 3, 'Coure cada banda'),
      p('Talla el llom i la pinya a trossets. Escalfa les tortilles ({tortilla-blat}) un moment a la graella.'),
      p('Omple les tortilles amb la carn i la pinya, la ceba, el coriandre i unes gotes de llima ({llima}).'),
    ],
  }),
  brasa({
    id: 'fajitas-brasa',
    nom: 'Fajitas de pollastre a la brasa',
    minuts: 40,
    etiquetes: ['carn'],
    sol: true,
    salses: ['guacamole', 'pico-de-gallo'],
    ingredients: [
      l('pit-pollastre', 700),
      l('comi', 2),
      l('pebre-vermell', 4),
      l('llima', 1, 'u'),
      l('oli-oliva', 30),
      l('sal', 4),
      l('pebrot-vermell', 200),
      l('pebrot-verd', 150),
      l('ceba', 1, 'u'),
      l('tortilla-blat', 8),
    ],
    passos: [
      c(
        'Barreja el comí ({comi}), el pebre vermell ({pebre-vermell}), el suc de la llima ({llima}), l’oli ({oli-oliva}) i la sal ({sal}) i unta’n els filets de pollastre ({pit-pollastre}).',
        15,
        'Marinar el pollastre',
      ),
      p('Talla els pebrots ({pebrot-vermell}, {pebrot-verd}) a quarts i la ceba ({ceba}) a rodanxes gruixudes.'),
      c('Cou el pollastre i les verdures a la graella fins que el pollastre sigui fet i les verdures tendres i marcades. El cronòmetre és per a cada banda.', 5, 'Coure cada banda'),
      p('Talla-ho tot a tires, escalfa les tortilles ({tortilla-blat}) a la graella i que cadascú es faci les fajitas.'),
    ],
  }),
  brasa({
    id: 'kofta-brasa',
    nom: 'Kofta de carn a la brasa amb salsa de iogurt',
    minuts: 35,
    etiquetes: ['carn'],
    sol: true,
    ingredients: [
      l('carn-picada', 600),
      l('ceba', 75),
      l('all', 2),
      l('julivert', 10),
      l('comi', 3),
      l('pebre-vermell', 3),
      l('pebre-negre', 1),
      l('sal', 5),
      l('tortilla-blat', 4),
      l('tomaquet', 2, 'u'),
      l('cogombre', 200),
      l('salsa-iogurt', 150),
    ],
    passos: [
      p('Ratlla la ceba ({ceba}) i escorre-la bé. Pica els alls ({all}) i el julivert ({julivert}).'),
      p(
        'Amassa la carn picada ({carn-picada}) amb la ceba, l’all, el julivert, el comí ({comi}), el pebre vermell ({pebre-vermell}), el pebre ({pebre-negre}) i la sal ({sal}). ' +
          'Fes-ne 8 salsitxes allargades al voltant de broquetes (o sense, si són gruixudes) i deixa-les a la nevera mentre es fan les brases.',
      ),
      c('Cou-les a la graella, girant-les amb compte, fins que siguin daurades i fetes per dins.', 10, 'Coure les kofta'),
      p('Talla el tomàquet ({tomaquet}) i el cogombre ({cogombre}) a daus. Escalfa les tortilles ({tortilla-blat}) a la graella.'),
      p('Serveix les kofta sobre les tortilles amb el tomàquet, el cogombre i la salsa de iogurt ({salsa-iogurt}) per sobre.'),
    ],
  }),
  brasa({
    id: 'frankfurts-brasa',
    nom: 'Frankfurts a la brasa amb pa (per a la mainada)',
    minuts: 15,
    etiquetes: ['carn'],
    foc: 'suau',
    acompanyaments: ['patates-caliu', 'patates-fregides', 'panotxes-brasa'],
    ingredients: [l('frankfurts', 400), l('pa-barra', 500), l('ketchup', 40), l('mostassa', 20)],
    passos: [
      c('Fes uns talls en diagonal als frankfurts ({frankfurts}) i posa’ls a la graella, girant-los, fins que s’obrin una mica i es daurin.', 6, 'Coure els frankfurts'),
      p('Talla el pa ({pa-barra}) a trossos de la llargada dels frankfurts, obre’ls i torra’ls a la graella.'),
      p('Posa un frankfurt dins de cada pa amb ketchup ({ketchup}) i mostassa ({mostassa}) al gust de cadascú.'),
    ],
  }),

  // ——— Acompanyaments de brasa ———
  brasa({
    id: 'escalivada-brasa',
    nom: 'Escalivada a la brasa',
    minuts: 40,
    etiquetes: [],
    tipus: 'acompanyament',
    ingredients: [l('alberginia', 2, 'u'), l('pebrot-vermell', 2, 'u'), l('ceba', 2, 'u'), l('oli-oliva', 60), l('sal', 3)],
    passos: [
      c(
        'Posa les albergínies ({alberginia}), els pebrots ({pebrot-vermell}) i les cebes ({ceba}) sencers directament sobre les brases o a la graella, ' +
          'girant-los de tant en tant, fins que la pell sigui negra i siguin ben tous (les cebes són les que triguen més).',
        35,
        'Escalivar',
      ),
      p('Embolica-ho en paper de diari o tapa-ho en un bol 10 minuts: així es pela més bé.'),
      p('Pela-ho, talla-ho a tires i amaneix-ho amb l’oli ({oli-oliva}) i la sal ({sal}).'),
    ],
  }),
  brasa({
    id: 'verdures-brasa',
    nom: 'Verdures a la brasa',
    minuts: 15,
    etiquetes: [],
    tipus: 'acompanyament',
    ingredients: [l('carbasso', 400), l('alberginia', 300), l('pebrot-vermell', 300), l('ceba', 1, 'u'), l('oli-oliva', 40), l('sal', 4)],
    passos: [
      p(
        'Talla el carbassó ({carbasso}) i l’albergínia ({alberginia}) a llesques de mig dit, el pebrot ({pebrot-vermell}) a tires amples i la ceba ({ceba}) a rodanxes gruixudes. ' +
          'Unta-ho amb l’oli ({oli-oliva}) i la sal ({sal}).',
      ),
      c('Cou-les a la graella, girant-les una vegada, fins que siguin tendres i marcades.', 10, 'Coure les verdures'),
    ],
  }),
  brasa({
    id: 'panotxes-brasa',
    nom: 'Panotxes de blat de moro a la brasa',
    minuts: 25,
    etiquetes: [],
    tipus: 'acompanyament',
    ingredients: [l('panotxa', 4), l('mantega', 40), l('sal', 3)],
    passos: [
      c('Bull les panotxes ({panotxa}) a la cuina en aigua sense sal perquè s’estovin.', 10, 'Bullir les panotxes'),
      c('Posa-les a la graella, girant-les, fins que els grans siguin daurats i alguns una mica torrats.', 10, 'Torrar les panotxes'),
      p('Unta-les amb la mantega ({mantega}) i posa-hi la sal ({sal}).'),
    ],
  }),
  brasa({
    id: 'patates-caliu',
    nom: 'Patates al caliu',
    minuts: 50,
    etiquetes: [],
    tipus: 'acompanyament',
    ingredients: [l('patata', 1000), l('oli-oliva', 20), l('sal', 4)],
    passos: [
      p('Renta bé les patates ({patata}), que siguin mitjanes i semblants, i embolica-les una a una amb paper d’alumini.'),
      c('Enterra-les a les brases (al caliu, no a la flama) des del principi, quan encara fan foc, i deixa-les-hi girant-les un parell de vegades.', 45, 'Patates al caliu'),
      p('Són fetes quan una agulla hi entra fàcilment. Obre-les per la meitat i posa-hi l’oli ({oli-oliva}) i la sal ({sal}).'),
    ],
  }),
  brasa({
    id: 'moniatos-caliu',
    nom: 'Moniatos al caliu',
    minuts: 50,
    etiquetes: [],
    tipus: 'acompanyament',
    ingredients: [l('moniato', 800), l('mantega', 20), l('sal', 2)],
    passos: [
      p('Renta els moniatos ({moniato}) i embolica’ls un a un amb paper d’alumini.'),
      c('Enterra’ls al caliu i deixa’ls-hi, girant-los alguna vegada, fins que siguin ben tous.', 45, 'Moniatos al caliu'),
      p('Obre’ls per la meitat i posa-hi la mantega ({mantega}) i un pessic de sal ({sal}).'),
    ],
  }),
  brasa({
    id: 'esparrecs-brasa',
    nom: 'Espàrrecs verds a la brasa',
    minuts: 10,
    etiquetes: [],
    tipus: 'acompanyament',
    ingredients: [l('esparrecs', 500), l('oli-oliva', 20), l('sal', 3)],
    passos: [
      p('Trenca la part dura del final de cada espàrrec ({esparrecs}): es trenca sola pel lloc just. Unta’ls amb l’oli ({oli-oliva}).'),
      c('Posa’ls a la graella de través (perquè no caiguin) i cou-los, girant-los, fins que siguin tendres i marcats.', 6, 'Coure els espàrrecs'),
      p('Posa-hi la sal ({sal}) en treure’ls.'),
    ],
  }),

  // ——— Asado argentí ———
  // Els talls de vedella argentins (vacío, entranya, tira d’asado, matambre, picanya) no són al Mercadona:
  // es demanen a la carnisseria i la llista de la compra ho avisa.
  brasa({
    id: 'vacio-brasa',
    nom: 'Vacío a la brasa',
    minuts: 95,
    etiquetes: ['carn'],
    foc: 'suau',
    acompanyaments: AMB_ARGENTINA,
    salses: ['chimichurri', 'salsa-criolla'],
    ingredients: [l('vacio', 1200), l('sal', 8)],
    passos: [
      p('Demana el vacío ({vacio}) a la carnisseria en una sola peça, amb el greix i la membrana. Treu-lo de la nevera una hora abans.'),
      c(
        'Posa’l a la graella amb la banda del greix i la membrana cap avall, a foc suau (la brasa ha d’estar repartida i no ha de fer flama). ' +
          'No el sal encara. Deixa’l fer a poc a poc: el greix s’ha de daurar i fondre sense cremar-se.',
        55,
        'Banda del greix',
      ),
      c('Gira’l, posa-hi la sal ({sal}) per la banda cuita i deixa’l fer per la banda de la carn fins que, en prémer-lo, sigui ferm però sucós.', 30, 'Banda de la carn'),
      reposar(8),
      p('Talla’l a tires gruixudes, de través a la fibra.'),
    ],
  }),
  brasa({
    id: 'entranya-brasa',
    nom: 'Entranya a la brasa',
    minuts: 20,
    etiquetes: ['carn'],
    foc: 'fort',
    acompanyaments: AMB_ARGENTINA,
    salses: ['chimichurri', 'salsa-criolla'],
    ingredients: [l('entranya', 800), l('sal', 6)],
    passos: [
      p('Demana l’entranya ({entranya}) a la carnisseria (que te la netegin de la membrana dura, o treu-la tu amb un ganivet). Asseca-la amb paper de cuina.'),
      c('Cou-la a foc fort, sense moure-la, fins que sigui ben marcada; gira-la una sola vegada. És un tall per menjar al punt, rosat al mig. El cronòmetre és per a cada banda.', 5, 'Coure cada banda'),
      reposar(3),
      p('Posa-hi la sal ({sal}) i talla-la a tires de través a la fibra (si no, queda dura).'),
    ],
  }),
  brasa({
    id: 'tira-asado-brasa',
    nom: 'Tira d’asado a la brasa',
    minuts: 50,
    etiquetes: ['carn'],
    foc: 'suau',
    acompanyaments: AMB_ARGENTINA,
    salses: ['chimichurri', 'salsa-criolla'],
    ingredients: [l('tira-asado', 1500), l('sal', 8)],
    passos: [
      p('Demana a la carnisseria costella de vedella tallada de través en tires de 3-4 dits d’amplada (tira d’asado, {tira-asado}).'),
      c('Posa les tires a la graella amb els ossos cap avall, a foc suau, i deixa-les fer a poc a poc: l’os fa de protecció i la carn es fa sense assecar-se.', 30, 'Banda dels ossos'),
      c('Gira-les, posa-hi la sal ({sal}) i acaba-les fins que la carn sigui daurada i es desenganxi una mica de l’os.', 15, 'Banda de la carn'),
      p('Talla-les entre os i os i serveix-les de seguida.'),
    ],
  }),
  brasa({
    id: 'matambre-pizza',
    nom: 'Matambre a la pizza',
    minuts: 65,
    etiquetes: ['carn'],
    foc: 'suau',
    acompanyaments: AMB_ARGENTINA,
    ingredients: [l('matambre', 1000), l('sal', 6), l('tomaquet-fregit', 200), l('mozzarella', 150), l('orenga', 2)],
    passos: [
      p('Demana el matambre ({matambre}) a la carnisseria, sencer. Si és molt gruixut, que te l’obrin en llibret.'),
      c('Cou-lo a foc suau amb la banda del greix cap avall fins que el greix sigui daurat i la carn comenci a ser tendra.', 40, 'Banda del greix'),
      c('Gira’l, sala’l amb la sal ({sal}) i deixa’l fer per l’altra banda.', 15, 'Banda de la carn'),
      c(
        'Estén-hi per sobre el tomàquet fregit ({tomaquet-fregit}), la mozzarella ({mozzarella}) i l’orenga ({orenga}), com una pizza. ' +
          'Tapa la barbacoa (o posa-hi una safata d’alumini a sobre) fins que el formatge sigui fos.',
        6,
        'Fondre el formatge',
      ),
      p('Talla’l a quadrats i serveix-lo.'),
    ],
  }),
  brasa({
    id: 'picanya-brasa',
    nom: 'Picanya a la brasa',
    minuts: 50,
    etiquetes: ['carn'],
    foc: 'suau',
    acompanyaments: AMB_ARGENTINA,
    salses: ['chimichurri', 'salsa-criolla'],
    ingredients: [l('picanya', 1000), l('sal', 8)],
    passos: [
      p('Demana la picanya ({picanya}) a la carnisseria en una peça, amb la capa de greix. Fes uns talls en reixa al greix sense arribar a la carn.'),
      c('Posa-la a la graella amb el greix cap avall, a foc suau, perquè es fongui i es dauri. Si fa flama, aparta-la un moment.', 25, 'Banda del greix'),
      c('Gira-la, posa-hi la sal ({sal}) i deixa-la fer per la banda de la carn fins que al mig sigui rosada (com més gruixuda, més estona).', 15, 'Banda de la carn'),
      reposar(8),
      p('Talla-la a llesques d’un dit, de través a la fibra.'),
    ],
  }),
  brasa({
    id: 'bife-chorizo-brasa',
    nom: 'Bife de chorizo a la brasa',
    minuts: 20,
    etiquetes: ['carn'],
    foc: 'fort',
    acompanyaments: AMB_ARGENTINA,
    salses: ['chimichurri', 'salsa-criolla', 'salsa-pebre'],
    ingredients: [l('llom-vedella', 900), l('sal', 6)],
    passos: [
      p('Treu el llom de vedella ({llom-vedella}) de la nevera mitja hora abans. El bife de chorizo és aquest tall, en filets gruixuts de dos dits.'),
      c('Cou-lo a foc fort fins que sigui ben marcat per fora; per dins, al punt o al gust. Gira’l una sola vegada. El cronòmetre és per a cada banda.', 5, 'Coure cada banda'),
      reposar(4),
      p('Posa-hi la sal ({sal}) just abans de servir-lo.'),
    ],
  }),
  brasa({
    id: 'choripan',
    nom: 'Choripán amb chimichurri',
    minuts: 25,
    etiquetes: ['carn'],
    foc: 'suau',
    sol: true,
    salses: ['salsa-criolla'],
    ingredients: [
      l('julivert', 10),
      l('all', 1),
      l('orenga', 2),
      l('vinagre', 15),
      l('oli-oliva', 50),
      l('xoricet-criollo', 760),
      l('pa-barra', 500),
    ],
    passos: [
      p(
        'Chimichurri ràpid: pica molt fins el julivert ({julivert}) i l’all ({all}) i barreja’ls amb l’orenga ({orenga}), el vinagre ({vinagre}) i l’oli ({oli-oliva}). ' +
          'Deixa’l reposar mentre es fan les brases.',
      ),
      c(
        'Cou els xoriços criollos ({xoricet-criollo}) a foc suau, sencers i sense punxar-los, girant-los, fins que siguin daurats i fets per dins.',
        18,
        'Coure els xoriços',
      ),
      p('Talla el pa ({pa-barra}) en trossos de la llargada dels xoriços, obre’ls i torra’ls per dins a la graella.'),
      p('Obre els xoriços per la meitat de llarg («a la mariposa»), posa’ls dins del pa i tira-hi el chimichurri per sobre.'),
    ],
  }),
  brasa({
    id: 'parrillada-argentina',
    nom: 'Parrillada argentina',
    minuts: 50,
    etiquetes: ['carn'],
    foc: 'suau',
    acompanyaments: AMB_ARGENTINA,
    salses: ['chimichurri', 'salsa-criolla'],
    ingredients: [l('tira-asado', 600), l('xoricet-criollo', 380), l('botifarra-negra', 280), l('entranya', 400), l('sal', 8)],
    passos: [
      p('Demana a la carnisseria la tira d’asado ({tira-asado}) i l’entranya ({entranya}). L’asado es fa per ordre: primer el que triga més.'),
      c('Posa la tira d’asado amb els ossos cap avall a la banda de foc suau.', 20, 'Tira d’asado'),
      c('Afegeix-hi els xoriços criollos ({xoricet-criollo}) sencers i gira la tira d’asado. Gira els xoriços de tant en tant.', 15, 'Xoriços'),
      c('Afegeix-hi la botifarra negra ({botifarra-negra}) i, a la banda de més brasa, l’entranya, girant-la una vegada.', 10, 'Entranya i botifarra negra'),
      p('Posa la sal ({sal}) a la carn. Es serveix per tandes: primer els xoriços i la botifarra negra (com a entrant, amb pa), després la carn tallada.'),
    ],
  }),

  // Acompanyament argentí (es fa a la cuina)
  {
    id: 'papes-provencal',
    nom: 'Patates a la provençal',
    racions: 4,
    tempsMinuts: 40,
    etiquetes: [],
    tipus: 'acompanyament',
    ingredients: [l('patata', 1000), l('oli-girasol', 150), l('all', 3), l('julivert', 10), l('sal', 4)],
    passos: [
      p('Pela les patates ({patata}), talla-les a bastons i deixa-les 10 minuts en aigua freda. Escorre-les i asseca-les molt bé.'),
      c(
        'Fregeix-les en tandes en una paella fonda amb oli de gira-sol ({oli-girasol}) a foc mitjà fins que siguin toves, i després a foc fort fins que siguin daurades. ' +
          'El cronòmetre és per a cada tanda.',
        8,
        'Fregir les patates',
      ),
      p('Pica molt fins els alls ({all}) i el julivert ({julivert}). Barreja’ls amb les patates calentes i la sal ({sal}): la calor cou una mica l’all.'),
    ],
  },
];
