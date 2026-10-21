import type { OpcioDieta, OpcioPressupost, OpcioQuantitat, OpcioReceptari, OpcioTemps } from '../domini/questionari';
import type { Alergen, Avis, Dia } from '../domini/tipus';
import { formatEuros } from '../domini/format';

// Tots els textos de la interfície en català.
// Afegir aquí qualsevol text nou en lloc d'escriure'l directament a les pantalles.
export const textos = {
  app: {
    nom: 'Piatto113',
    nomParts: { paraula: 'Piatto', numero: '113' },
    lema: 'Menjar, quan tu vulguis',
    enConstruccio: 'Planificador setmanal d’àpats. En construcció.',
  },
  dies: {
    dl: 'Dilluns',
    dt: 'Dimarts',
    dc: 'Dimecres',
    dj: 'Dijous',
    dv: 'Divendres',
    ds: 'Dissabte',
    dg: 'Diumenge',
  } satisfies Record<Dia, string>,
  apats: { dinar: 'Dinar', sopar: 'Sopar' },
  accions: {
    comencar: 'Comença',
    seguent: 'Següent',
    enrere: 'Enrere',
    desar: 'Desa',
    canviar: 'Canvia',
    acabar: 'Veure el resum',
    afegirPersona: 'Afegeix una persona',
    treure: 'Treu',
  },
  navegacio: {
    menu: 'Menú',
    compra: 'Compra',
    configuracio: 'Configuració',
    principal: 'Seccions',
  },
  menu: {
    titol: 'Menú de la setmana',
    veureMenu: 'Veure el menú de la setmana',
    apats: (n: number) => (n === 1 ? '1 àpat' : `${n} àpats`),
    costSetmana: (total: string, perApat: string) => `${total} del que es menja (${perApat} per àpat)`,
    compra: (total: string) => `Compra estimada: ${total}.`,
    explicacioCompra: 'La compra inclou paquets sencers: el que sobri servirà per a la setmana vinent.',
    pressupost: (limit: string) => `Pressupost: fins a ${limit} per àpat.`,
    sobrePressupost: 'Aquest menú supera el pressupost. Canvia algun plat o fes-ne un altre.',
    graella: 'Quins àpats feu a casa?',
    ajudaGraella: 'Marca o desmarca els àpats. El menú es torna a fer.',
    canviar: 'Canvia',
    veureRecepta: (plat: string) => `Recepta: ${plat}`,
    canviarEtiqueta: (apat: string, dia: string, plat: string) => `Canvia el ${apat.toLowerCase()} de ${dia.toLowerCase()} (${plat})`,
    senseAlternativa: 'No hi ha cap altre plat possible per a aquest àpat.',
    tornarAFer: 'Fes un altre menú',
    amb: (nom: string) => `amb ${nom.charAt(0).toLowerCase()}${nom.slice(1)}`,
    minuts: (n: number) => `${n} min`,
    capApat: 'No hi ha cap àpat marcat. Marca’n algun a «Quins àpats feu a casa?».',
  },
  compra: {
    titol: 'Llista de la compra',
    resum: (productes: number, total: string) =>
      `${productes === 1 ? '1 producte' : `${productes} productes`} · ${total} aproximadament`,
    preus: (data: string) => `Preus orientatius del Mercadona (${data}). Es podran editar.`,
    paquets: (paquets: number, mida: string) => `${paquets} × ${mida}`,
    rebost: 'Del rebost',
    ajudaRebost: 'Comprova que en tens: no compta al cost.',
    senseCost: 'sense preu',
    desmarcar: 'Desmarca-ho tot',
    fet: (n: number, total: number) => `${n} de ${total} al carro`,
    buida: 'La llista és buida: no hi ha cap àpat al menú.',
    perA: (plats: string) => `Per a: ${plats}`,
  },
  recepta: {
    tornar: 'Torna',
    ingredients: 'Ingredients',
    preparacio: 'Preparació',
    perA: (persones: number, racions: string) =>
      `Quantitats per a ${persones === 1 ? '1 persona' : `${persones} persones`} (${racions} racions)`,
    temps: (n: number) => `${n} min`,
    cronometre: (minuts: string, nom: string) => `Cronòmetre: ${minuts} · ${nom}`,
    acompanyament: 'Acompanyament',
    ambPlat: 'S’acompanya amb',
    rebost: 'del rebost',
    noTrobada: 'No s’ha trobat aquesta recepta.',
  },
  benvinguda: {
    explicacio: 'Respon cinc preguntes i et proposarem el menú de la setmana, amb la llista de la compra.',
    desatLocal: 'De moment, les respostes es guarden en aquest dispositiu.',
  },
  questionari: {
    pas: (n: number, total: number) => `Pas ${n} de ${total}`,
    familia: {
      pregunta: 'Qui menja a casa?',
      ajuda: 'Les quantitats de les receptes s’ajusten a la gana de cadascú.',
      nom: 'Nom',
      gana: 'Gana',
      opcionsGana: { 75: 'Menja poc', 100: 'Normal', 125: 'Menja força', 150: 'Menja molt' } as Record<number, string>,
      maxim: (n: number) => `Com a màxim, ${n} persones.`,
    },
    restriccions: {
      titol: 'Dieta i restriccions',
    },
    resum: {
      titol: 'La vostra configuració',
      persones: (n: number) => (n === 1 ? '1 persona' : `${n} persones`),
      cap: 'Cap',
      receptariCap: 'Sense preferència',
      alergens: 'Al·lèrgies',
      exclosos: 'No surten mai',
      plats: (n: number) =>
        n === 0
          ? 'Cap plat compleix aquesta configuració. Revisa les restriccions.'
          : `${n} plats del receptari compleixen aquesta configuració.`,
      properament: 'Properament: el mode «cuinar», amb els cronòmetres de cada pas.',
    },
    receptari: {
      pregunta: 'Quin tipus de receptari vols prioritzar?',
      ajuda: 'Pots triar-ne més d’un.',
      opcions: {
        variat: 'Variat i equilibrat, amb carn, peix, ous, llegums i pasta',
        economic: 'Econòmic, per controlar la despesa de la compra',
      } satisfies Record<OpcioReceptari, string>,
    },
    pressupost: {
      pregunta: 'Pressupost aproximat per àpat de quatre persones',
      ajuda: 'Compta el que es menja, no els paquets sencers. Amb més o menys persones, s’ajusta sol.',
      opcions: {
        economic: 'Econòmic: fins a 8 €',
        mitja: 'Mitjà: de 8 a 14 €',
        flexible: 'Flexible: prioritzar els plats, no el preu',
      } satisfies Record<OpcioPressupost, string>,
    },
    temps: {
      pregunta: 'Temps habitual per cuinar',
      opcions: {
        rapid: 'Ràpid: fins a 40 minuts',
        mixt: 'Entre setmana ràpid i el cap de setmana més elaborat',
        'sense-limit': 'Sense límit de temps',
      } satisfies Record<OpcioTemps, string>,
    },
    dieta: {
      pregunta: 'Quin tipus de dieta seguiu?',
      opcions: {
        omnivora: 'Omnívora: de tot',
        pescetariana: 'Pescetariana: peix, però no carn',
        vegetariana: 'Vegetariana: sense carn ni peix, amb ous i làctics',
        vegana: 'Vegana: cap producte d’origen animal',
      } satisfies Record<OpcioDieta, string>,
      curta: {
        omnivora: 'Omnívora',
        pescetariana: 'Pescetariana',
        vegetariana: 'Vegetariana',
        vegana: 'Vegana',
      } satisfies Record<OpcioDieta, string>,
    },
    carn: {
      pregunta: 'Quanta carn voleu?',
      opcions: {
        normal: 'Sense restricció',
        poc: 'Poca carn',
        gens: 'Gens de carn',
      } satisfies Record<OpcioQuantitat, string>,
    },
    peix: {
      pregunta: 'Quant de peix voleu?',
      opcions: {
        normal: 'Sense restricció',
        poc: 'Poc peix',
        gens: 'Gens de peix',
      } satisfies Record<OpcioQuantitat, string>,
    },
    exclosos: {
      pregunta: 'Hi ha algun aliment que no pugui sortir mai?',
      ajuda: 'Verdures o llegums que no agraden, o qualsevol altre ingredient.',
      cercar: 'Cerca un ingredient',
      triats: (n: number) => (n === 1 ? '1 aliment triat' : `${n} aliments triats`),
      capResultat: 'Cap ingredient amb aquest nom.',
    },
    alergens: {
      pregunta: 'Al·lèrgies i intoleràncies',
      ajuda: 'Cap recepta amb aquests al·lèrgens sortirà al menú.',
      avis:
        'La informació d’al·lèrgens és orientativa. Els productes envasats (embotits, brous, salses, pa…) ' +
        'poden contenir al·lèrgens o traces segons la marca: llegeix sempre l’etiqueta.',
    },
  },
  alergens: {
    gluten: 'Gluten',
    crustacis: 'Crustacis',
    ou: 'Ou',
    peix: 'Peix',
    cacauets: 'Cacauets',
    soja: 'Soja',
    llet: 'Llet i lactosa',
    'fruits-secs': 'Fruits secs',
    api: 'Api',
    mostassa: 'Mostassa',
    sesam: 'Sèsam',
    sulfits: 'Sulfits',
    tramussos: 'Tramussos',
    molluscs: 'Mol·luscs',
  } satisfies Record<Alergen, string>,
} as const;

/** Text d'un avís del planificador. `nomIngredient` tradueix identificadors a noms. */
export function textAvis(avis: Avis, nomIngredient: (id: string) => string = (id) => id): string {
  switch (avis.codi) {
    case 'cap-apat-marcat':
      return 'No hi ha cap àpat marcat aquesta setmana.';
    case 'cap-recepta-valida':
      return 'Cap recepta compleix les preferències, els aliments exclosos i el temps màxim. Revisa la configuració.';
    case 'receptes-repetides':
      return `Només hi ha ${avis.disponibles} receptes possibles per a ${avis.necessaries} àpats: algunes es repeteixen.`;
    case 'pressupost-impossible':
      return `No s’ha pogut ajustar al pressupost de ${formatEuros(avis.pressupostApatCentims)} per àpat. El menú més barat que s’ha trobat surt a ${formatEuros(avis.minimApatCentims)} per àpat.`;
    case 'sense-preu':
      return `Falta el preu de: ${avis.ingredientIds.map(nomIngredient).join(', ')}. El cost és incomplet.`;
  }
}
