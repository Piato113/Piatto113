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
    taula: {
      persones: (n: number) => (n === 1 ? '1 persona' : `${n} persones`),
      sense: (noms: string) => `sense ${noms}`,
      convidats: (n: number) => (n === 1 ? '+1 convidat' : `+${n} convidats`),
      boto: (resum: string, apat: string, dia: string) => `Qui hi ha a taula al ${apat.toLowerCase()} de ${dia.toLowerCase()}: ${resum}`,
      titol: 'Qui hi ha a taula?',
      familia: 'De casa',
      convidatsTitol: 'Convidats',
      menys: 'Un convidat menys',
      mes: 'Un convidat més',
      ajuda: 'Les quantitats de la recepta i de la compra s’ajusten soles. Si no menja ningú a casa, desmarca l’àpat a «Quins àpats feu a casa?».',
      tothom: 'Torna a tota la família',
    },
  },
  triar: {
    titol: 'Tria el plat',
    quin: (apat: string, dia: string) => `${apat} de ${dia.toLowerCase()}`,
    atzar: 'Tria’n un a l’atzar',
    cercar: 'Busca un plat',
    capResultat: 'Cap plat no coincideix amb la cerca.',
    categories: {
      carn: 'Carn',
      peix: 'Peix',
      ou: 'Ous',
      llegums: 'Llegums',
      pasta: 'Pasta',
      arros: 'Arròs',
      verdura: 'Verdures, sopes i altres',
    },
    actual: 'Ara al menú',
    jaSurt: (llocs: string) => `Ja surt: ${llocs}`,
    passaTemps: (minuts: number) => `Passa dels ${minuts} min d’aquell dia`,
    ambAcompanyament: '+ acompanyament',
    titolAcompanyament: 'Amb què l’acompanyes?',
    plat: (nom: string) => `Per a: ${nom}`,
    triat: (plat: string) => `Fet: ${plat}.`,
  },
  compra: {
    titol: 'Llista de la compra',
    resum: (productes: number, total: string) =>
      `${productes === 1 ? '1 producte' : `${productes} productes`} · ${total} aproximadament`,
    preus: (data: string) => `Preus del Mercadona de Girona del ${data}.`,
    paquets: (paquets: number, mida: string) => `${paquets} × ${mida}`,
    paquetsProducte: (paquets: number, producte: string, mida: string) => `${paquets} × ${producte} (${mida})`,
    estimat: 'preu estimat',
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
  cuinar: {
    comencar: 'Comença a cuinar',
    sortir: 'Surt',
    sortirEtiqueta: 'Surt del mode cuinar',
    pas: (n: number, total: number) => `Pas ${n} de ${total}`,
    preparacio: 'Abans de començar',
    ajudaPreparacio: 'Deixa-ho tot a mà. Marca cada ingredient quan el tinguis.',
    anterior: 'Anterior',
    seguent: 'Següent',
    acabar: 'He acabat',
    engegar: 'Engega',
    continuar: 'Continua',
    pausar: 'Pausa',
    reiniciar: 'Reinicia',
    mesUnMinut: '+1 min',
    cronometre: 'Cronòmetre',
    enMarxa: 'Cronòmetres en marxa',
    anarAlPas: (nom: string, temps: string) => `${nom}: ${temps}. Ves al pas`,
    acabat: 'S’ha acabat el temps',
    entesos: 'Entesos',
    unMinutMes: 'Un minut més',
    bonProfit: 'Bon profit!',
    fet: 'Ja has acabat la recepta.',
    araAcompanyament: (nom: string) => `Ara l’acompanyament: ${nom.charAt(0).toLowerCase()}${nom.slice(1)}`,
    tornarMenu: 'Torna al menú',
    tornarRecepta: 'Torna a la recepta',
    pantallaEncesa: 'La pantalla es mantindrà encesa mentre cuines.',
  },
  benvinguda: {
    explicacio: 'Respon cinc preguntes i et proposarem el menú de la setmana, amb la llista de la compra.',
    desatLocal: 'De moment, les respostes es guarden en aquest dispositiu.',
    desatCompte: 'Les respostes es desen al teu compte.',
  },
  entrada: {
    titol: 'Entra',
    titolRegistre: 'Crea un compte',
    familia: 'A casa podeu fer servir tots el mateix compte: així veieu el mateix menú i la mateixa llista.',
    correu: 'Correu electrònic',
    contrasenya: 'Contrasenya',
    ajudaContrasenya: (min: number) => `Com a mínim ${min} caràcters.`,
    mostrar: 'Mostra',
    amagar: 'Amaga',
    entrar: 'Entra',
    entrant: 'Entrant…',
    registrar: 'Crea el compte',
    registrant: 'Creant el compte…',
    noTensCompte: 'No tens compte?',
    anarARegistre: 'Crea’n un',
    jaTensCompte: 'Ja tens compte?',
    anarAEntrar: 'Entra',
    confirmar: (correu: string) =>
      `T’hem enviat un correu a ${correu} per confirmar el compte. Obre l’enllaç i després torna aquí i entra.`,
    errors: {
      correu: 'Aquest correu no sembla vàlid. Revisa’l.',
      credencials: 'El correu o la contrasenya no són correctes.',
      'no-confirmat': 'Encara no has confirmat el compte. Mira el correu (també el correu brossa).',
      'contrasenya-curta': 'La contrasenya és massa curta o massa fàcil. Fes-ne una de més llarga.',
      'ja-existeix': 'Aquest correu ja té compte. Entra amb la teva contrasenya.',
      'registre-tancat': 'Ara mateix no es poden crear comptes nous.',
      'no-autoritzat': 'No s’ha pogut enviar el correu de confirmació a aquest correu.',
      'massa-intents': 'Massa intents seguits. Espera uns minuts i torna-ho a provar.',
      connexio: 'No hi ha connexió. Torna-ho a provar quan en tinguis.',
      desconegut: 'No ha funcionat. Torna-ho a provar d’aquí a una estona.',
    },
  },
  compte: {
    titol: 'Compte',
    entratCom: (correu: string) => `Has entrat com a ${correu}.`,
    desat: 'Tot desat al compte.',
    pendent: 'Hi ha canvis sense desar al compte: s’enviaran quan hi hagi connexió.',
    tancar: 'Tanca la sessió',
    confirmarTancar: 'Vols tancar la sessió en aquest mòbil? Les dades continuaran al compte.',
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
