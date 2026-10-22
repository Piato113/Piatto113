import type { OpcioDieta, OpcioPressupost, OpcioQuantitat, OpcioReceptari, OpcioTemps } from '../domini/questionari';
import type { Alergen, Aparell, Avis, Dia } from '../domini/tipus';
import { formatEuros } from '../domini/format';

// Tots els textos de la interfície en català.
// Afegir aquí qualsevol text nou en lloc d'escriure'l directament a les pantalles.
const MESOS = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];

const majusculaInicial = (t: string): string => t.charAt(0).toUpperCase() + t.slice(1);

/** «novembre» a partir de «2026-11». */
const nomMes = (mes: string): string => MESOS[Number(mes.slice(5, 7)) - 1] ?? mes;

/** «de novembre», «d’octubre». */
const deMes = (mes: string): string => {
  const nom = nomMes(mes);
  return /^[aeiou]/.test(nom) ? `d’${nom}` : `de ${nom}`;
};

/** «3 de novembre» a partir de «2026-11-03». */
const dataLlarga = (data: string): string => `${Number(data.slice(8, 10))} ${deMes(data.slice(0, 7))}`;

/** «2–8 de novembre» o «26 d’octubre – 1 de novembre». */
const rangDates = (inici: string, fi: string): string =>
  inici.slice(0, 7) === fi.slice(0, 7)
    ? inici === fi
      ? dataLlarga(inici)
      : `${Number(inici.slice(8, 10))}–${dataLlarga(fi)}`
    : `${dataLlarga(inici)} – ${dataLlarga(fi)}`;

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
  diesCurts: { dl: 'Dl', dt: 'Dt', dc: 'Dc', dj: 'Dj', dv: 'Dv', ds: 'Ds', dg: 'Dg' } satisfies Record<Dia, string>,
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
    receptari: 'Receptari',
    configuracio: 'Configuració',
    principal: 'Seccions',
  },
  menu: {
    titol: 'Menú de la setmana',
    titolMes: (mes: string) => `Menú ${deMes(mes)}`,
    periode: {
      titol: 'Per a quant de temps?',
      setmana: 'Una setmana',
      mes: 'Un mes sencer',
      ajuda: 'Amb el mes sencer, la compra es fa d’un cop i s’aprofiten els paquets oberts d’una setmana a l’altra.',
      restaDe: (mes: string) => `Resta ${deMes(mes)}`,
      mesSencer: (mes: string) => majusculaInicial(nomMes(mes)),
    },
    setmana: (n: number, total: number) => `Setmana ${n} de ${total}`,
    rang: (inici: string, fi: string) => rangDates(inici, fi),
    setmanaAnterior: 'Setmana anterior',
    setmanaSeguent: 'Setmana següent',
    calendari: 'Calendari del mes',
    llegenda: 'Cada punt és un àpat. Toca un dia per veure’n la setmana.',
    diaCalendari: (data: string, plats: string) => `${dataLlarga(data)}: ${plats}`,
    senseApats: 'sense àpats',
    diaAmbData: (dia: string, data: string) => `${dia} ${Number(data.slice(8))}`,
    compraMes: (total: string) => `Compra de tot el mes: ${total}.`,
    estalviMes: (estalvi: string) =>
      `Comprant-ho tot d’un cop estalvieu uns ${estalvi} respecte de fer la compra setmana a setmana.`,
    descongelar: (noms: string) => `❄ Si ho teniu congelat, traieu-ho la nit abans: ${noms}.`,
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
    valoracio: {
      pregunta: 'Què tal?',
      agrada: 'Ens ha encantat',
      noAgrada: 'No ha triomfat',
      agradaEtiqueta: (plat: string) => `${plat}: ens ha encantat (sortirà més sovint)`,
      noAgradaEtiqueta: (plat: string) => `${plat}: no ha triomfat (no sortirà sol al menú)`,
      marcaAgrada: '👍 Us encanta',
      marcaNoAgrada: '👎 No va triomfar',
    },
    confirmarTornarAFer: (fixats: number) =>
      fixats > 0
        ? `Vols fer un menú nou? Es mantindran ${fixats === 1 ? 'el plat fixat' : `els ${fixats} plats fixats`} (📌).`
        : 'Vols fer un menú nou? Si vols conservar algun plat, fixa’l abans amb 📌.',
    menuNou: 'Menú nou fet.',
    graellaCanviada: 'Menú refet amb els àpats nous.',
    desfer: 'Desfés',
    fixa: 'Fixa',
    fixat: 'Fixat',
    fixaEtiqueta: (apat: string, dia: string, plat: string) => `Fixa el ${apat.toLowerCase()} de ${dia.toLowerCase()} (${plat}): es mantindrà si tornes a fer el menú`,
    desfixaEtiqueta: (apat: string, dia: string, plat: string) => `Deixa de fixar el ${apat.toLowerCase()} de ${dia.toLowerCase()} (${plat})`,
    anterior: {
      setmana: 'Menú de la setmana anterior',
      boto: (titol: string) => `Mira el ${titol.charAt(0).toLowerCase()}${titol.slice(1)}`,
      queden: (n: number, titol: string) =>
        `Encara ${n === 1 ? 'queda 1 dia' : `queden ${n} dies`} del ${titol.charAt(0).toLowerCase()}${titol.slice(1)}.`,
      veure: 'Mira’l',
      lectura: 'És el menú anterior: el pots consultar i cuinar-ne les receptes, però no canviar-lo.',
      tornar: 'Torna al menú actual',
    },
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
    barbacoa: 'De barbacoa: millor en cap de setmana',
    ambAcompanyament: '+ acompanyament',
    titolAcompanyament: 'Amb què l’acompanyes?',
    plat: (nom: string) => `Per a: ${nom}`,
    triat: (plat: string) => `Fet: ${plat}.`,
  },
  receptari: {
    titol: 'Receptari',
    explicacio: (n: number) =>
      `${n} plats per fer a la carta. Només hi surten els que podeu menjar i fer amb els aparells que teniu.`,
    cercar: 'Busca una recepta',
    capResultat: 'Cap recepta no coincideix amb la cerca.',
    acompanyaments: 'Acompanyaments',
    salses: 'Salses',
    ambAcompanyament: 'va amb acompanyament',
    filtres: 'Filtra per cuina',
    totes: 'Totes',
    filtre: {
      agrada: '👍 Els que ens encanten',
      brasa: '🔥 A la brasa',
      catalana: 'Catalana',
      espanyola: 'D’arreu de l’Estat',
      casolana: 'De cada dia',
      italiana: 'Italiana',
      mexicana: 'Mexicana',
      argentina: 'Argentina',
      asiatica: 'Asiàtica',
      mon: 'Del món',
      vegetariana: 'Vegetariana',
      vegana: 'Vegana',
    },
    nombre: (n: number) => (n === 1 ? '1 recepta' : `${n} receptes`),
  },
  compra: {
    titol: 'Llista de la compra',
    titolMes: (mes: string) => `Compra ${deMes(mes)}`,
    congelar: '❄ Al congelador',
    ajudaCongelar: 'Els productes amb ❄ convé congelar-los en arribar a casa.',
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
    foraDelSuper: (on: string) => `⚠ No és al Mercadona: compra-ho ${on}`,
    resumForaDelSuper: (n: number) =>
      `${n === 1 ? '1 producte no és' : `${n} productes no són`} al Mercadona (marcats amb ⚠): el preu és estimat.`,
    tinc: 'Ja ho tinc',
    tincEtiqueta: (nom: string) => `${nom}: ja ho tinc (treu-ho de la compra)`,
    tornarALlista: 'Torna-ho a la llista',
    tornarALlistaEtiqueta: (nom: string) => `${nom}: torna-ho a la llista de la compra`,
    jaHoTeniu: 'Ja ho teniu a casa',
    ajudaTinc: 'No es compren ni compten al total.',
    resumTinc: (n: number) => (n === 1 ? '1 producte ja el teniu a casa.' : `${n} productes ja els teniu a casa.`),
    compartir: 'Comparteix la llista',
    copiada: 'Llista copiada: enganxa-la on vulguis (WhatsApp, notes…).',
    noCopiada: 'No s’ha pogut compartir ni copiar la llista en aquest mòbil.',
    textRebost: (productes: string) => `Comprova que en tens: ${productes}.`,
    resRes: 'Ja ho tenim tot!',
  },
  recepta: {
    tornar: 'Torna',
    aparells: 'Cal tenir',
    ingredients: 'Ingredients',
    preparacio: 'Preparació',
    perA: (persones: number, racions: string) =>
      `Quantitats per a ${persones === 1 ? '1 persona' : `${persones} persones`} (${racions} racions)`,
    temps: (n: number) => `${n} min`,
    cronometre: (minuts: string, nom: string) => `Cronòmetre: ${minuts} · ${nom}`,
    acompanyament: 'Acompanyament',
    ambPlat: 'S’acompanya amb',
    rebost: 'del rebost',
    compra: (total: string) => `Llista de la compra · ${total}`,
    compraAjuda: 'Paquets del Mercadona que cal comprar només per a aquest plat.',
    titolCompartir: (plat: string, persones: number) => `${plat} (per a ${persones === 1 ? '1 persona' : `${persones} persones`})`,
    compraRebost: (ingredients: string) => `Del rebost (comprova que en tens): ${ingredients}.`,
    vaBeAmb: 'Va bé amb',
    salses: 'Salses que hi van bé',
    salsa: 'Salsa',
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
  senseConfigurar: {
    titol: 'Aquest menú és d’exemple.',
    text: 'Encara no heu configurat la família ni les preferències: quantes persones sou, què no mengeu, les al·lèrgies, el temps i el pressupost. Fins aleshores, els plats no tenen en compte cap al·lèrgia.',
    boto: 'Configura-ho (2 min)',
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
    avis: {
      titol: 'Abans de començar',
      paragrafs: [
        'Piatto113 és una aplicació personal, sense ànim de lucre i no comercial. Va néixer perquè a casa, amb adolescents, decidir i cuinar els àpats de cada dia era un caos. Aquesta eina ens ho ha solucionat, i ara la compartim.',
        'No es basa en cap sistema nutricional ni dietètic estudiat. És una eina per ajudar-te a planificar els àpats, fer la llista de la compra i cuinar. No substitueix el consell d’un metge o d’un dietista.',
        'Els al·lèrgens, les quantitats i els preus són orientatius. Llegeix sempre l’etiqueta dels productes que compris.',
        'Les teves dades es desen al teu compte i no es comparteixen amb ningú. L’ús de l’app és sota la teva responsabilitat.',
      ],
      entesos: 'Ho entenc',
    },
  },
  valorats: {
    titol: 'Plats valorats',
    ajuda: 'Els 👍 surten més sovint al menú; els 👎 no hi surten sols (però els podeu triar a mà). Es valoren al menú, als àpats que ja han passat.',
    cap: 'Encara no heu valorat cap plat.',
    agraden: '👍 Us encanten',
    noAgraden: '👎 No van triomfar',
    treu: 'Treu',
    treuEtiqueta: (plat: string) => `Treu la valoració de ${plat}`,
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
    cuina: {
      pregunta: 'Què teniu a la cuina?',
      ajuda:
        'Marca els aparells que teniu. Les receptes que en necessiten un que no teniu no sortiran. ' +
        'Els plats de barbacoa només surten els caps de setmana (cal fer foc).',
      cap: 'Només fogons',
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
  aparells: {
    forn: 'Forn',
    microones: 'Microones',
    'fregidora-aire': 'Fregidora d’aire (Airfryer)',
    thermomix: 'Thermomix o robot de cuina',
    batedora: 'Batedora',
    barbacoa: 'Barbacoa o graella de brasa',
  } satisfies Record<Aparell, string>,
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
