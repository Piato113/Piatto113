import { generadorAleatori } from './aleatori';
import { acompanyamentsAdmesos, calBarbacoa, esSalsa, potSerAcompanyament, potSerPrincipal, type Cataleg } from './cataleg';
import { costRecepta } from './cost';
import { racionsApat, racionsEfectives } from './escalat';
import { diesEntre, type DiaCalendari } from './calendari';
import { apatsMarcats, DIES, esCapDeSetmana } from './graella';
import { generarLlista, type LlistaCompra } from './llista';
import { CUINES, type Aparell, type Apat, type ApatPlanificat, type Avis, type ConfiguracioFamilia, type Cuina, type Dia, type Graella, type Recepta, type Valoracio } from './tipus';

export interface EntradaPlanificador {
  cataleg: Cataleg;
  configuracio: ConfiguracioFamilia;
  graella: Graella;
  /** Mateixa llavor + mateixes dades = mateix menú. */
  llavor: number;
  /**
   * Menú d'un període llarg (p. ex. un mes): els dies del calendari. Cada dia té els àpats que la graella
   * marca per a aquell dia de la setmana. Sense dies, es planifica una setmana (de dilluns a diumenge).
   */
  dies?: readonly DiaCalendari[];
}

export interface PlaSetmanal {
  apats: ApatPlanificat[];
  llista: LlistaCompra;
  racionsCentesimes: number;
  /** Cost del que es menja (principals i acompanyaments), en cèntims. És el que es compara amb el pressupost. */
  costConsumitCentims: number;
  avisos: Avis[];
}

/** Pes extra de cada etiqueta preferida en el sorteig. */
const PES_PREFERIDA = 2;
/** Multiplicador del pes d'una recepta amb alguna etiqueta evitada («poc peix»). */
const PES_EVITADA = 0.25;
/** Els plats amb 👍 surten el doble de sovint. */
export const PES_AGRADA = 2;

/** Plat amb 👎: no es posa sol al menú (però es pot triar a mà). */
export const noAgrada = (configuracio: ConfiguracioFamilia, receptaId: string): boolean =>
  configuracio.valoracions?.[receptaId] === 'no-agrada';
/** Límits del multiplicador del mode econòmic (cost mitjà ÷ cost del plat). */
const ECONOMIC_MIN = 0.5;
const ECONOMIC_MAX = 3;

/** Un plat no es repeteix si fa aquests dies o menys que ha sortit (0 = el mateix dia). */
export const DIES_SENSE_REPETIR = 2;

/** Grups que es reparteixen al llarg de la setmana en el mode equilibrat. */
export const GRUPS_EQUILIBRI: readonly string[] = ['carn', 'peix', 'ou', 'llegums', 'pasta', 'arros'];

const perId = (a: Recepta, b: Recepta): number => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

/** El límit més permissiu dels dos tipus de dia (`null` si algun no en té). */
function tempsMaximGlobal(configuracio: ConfiguracioFamilia): number | null {
  const { feiners, capDeSetmana } = configuracio.tempsMaximMinuts;
  return feiners === null || capDeSetmana === null ? null : Math.max(feiners, capDeSetmana);
}

const dinsTemps = (r: Recepta, limit: number | null): boolean => limit === null || r.tempsMinuts <= limit;

/** La família té els aparells que la recepta necessita (de cada llista d'alternatives, almenys un). */
export function teAparells(r: Recepta, disponibles: readonly Aparell[] | undefined): boolean {
  if (!disponibles || !r.aparells) return true;
  return r.aparells.every((cal) => (Array.isArray(cal) ? cal.some((a) => disponibles.includes(a)) : disponibles.includes(cal)));
}

/** Restriccions que no depenen del dia: ingredients exclosos, dieta, al·lèrgens, etiquetes excloses i aparells. */
function permesa(cataleg: Cataleg, r: Recepta, configuracio: ConfiguracioFamilia): boolean {
  if (!teAparells(r, configuracio.aparells)) return false;
  const exclosos = configuracio.exclosos;
  const alergens = configuracio.alergens;
  return (
    !r.etiquetes.some((e) => configuracio.etiquetesExcloses.includes(e)) &&
    !r.ingredients.some((l) => {
      if (exclosos.includes(l.ingredientId)) return true;
      const ing = cataleg.ingredients.get(l.ingredientId);
      if (ing?.origen && configuracio.origensExclosos.includes(ing.origen)) return true;
      return (ing?.alergens ?? []).some((a) => alergens.includes(a));
    })
  );
}

/**
 * Acompanyaments vàlids (també les receptes de doble ús): permesos i dins del temps màxim
 * d'algun tipus de dia. Les etiquetes obligatòries s'apliquen a la principal, no a l'acompanyament.
 */
export function filtrarAcompanyaments(cataleg: Cataleg, configuracio: ConfiguracioFamilia): Recepta[] {
  const limit = tempsMaximGlobal(configuracio);
  return [...cataleg.receptes.values()]
    .filter((r) => potSerAcompanyament(r) && permesa(cataleg, r, configuracio) && dinsTemps(r, limit))
    .sort(perId);
}

/** Acompanyaments que admet la principal i que es poden fer dins del límit de temps. */
const acompanyamentsPossibles = (r: Recepta, acompanyaments: readonly Recepta[], limit: number | null): Recepta[] =>
  acompanyamentsAdmesos(r, acompanyaments).filter((a) => dinsTemps(a, limit));

/** La principal es pot posar en un àpat amb aquest límit de temps (amb acompanyament, si en demana). */
const apta = (r: Recepta, acompanyaments: readonly Recepta[], limit: number | null): boolean =>
  dinsTemps(r, limit) && (!r.ambAcompanyament || acompanyamentsPossibles(r, acompanyaments, limit).length > 0);

/**
 * Receptes principals que compleixen la configuració: cap ingredient exclòs ni al·lergen,
 * cap etiqueta exclosa, totes les obligatòries, i aptes per a algun tipus de dia
 * (les que demanen acompanyament, només si en queda algun de vàlid dels que admeten).
 * Ordenades per identificador perquè el resultat no depengui de l'ordre del catàleg.
 */
export function filtrarReceptes(cataleg: Cataleg, configuracio: ConfiguracioFamilia): Recepta[] {
  const acompanyaments = filtrarAcompanyaments(cataleg, configuracio);
  const limit = tempsMaximGlobal(configuracio);
  return [...cataleg.receptes.values()]
    .filter((r) => potSerPrincipal(r) && permesa(cataleg, r, configuracio))
    .filter((r) => configuracio.etiquetesObligatories.every((e) => r.etiquetes.includes(e)))
    .filter((r) => apta(r, acompanyaments, limit))
    .sort(perId);
}

const grups = (r: Recepta): string[] => r.etiquetes.filter((e) => GRUPS_EQUILIBRI.includes(e));

interface Forat {
  dia: Dia;
  apat: Apat;
  limit: number | null;
  /** Número del dia dins del període (per saber quants dies separen dos àpats). */
  ordre: number;
  /** Data del calendari, només en els menús d'un període llarg. */
  data?: string;
}

/** Els plats de barbacoa (cal fer foc) només es posen en cap de setmana. */
const diaAdient = (r: Recepta, dia: Dia): boolean => !calBarbacoa(r) || esCapDeSetmana(dia);

interface Triada {
  principal: Recepta;
  acompanyament?: Recepta;
}

/**
 * Sorteig ponderat de principals, sense repetir mentre n'hi hagi (quan s'acaben, torna a començar).
 * Mai la mateixa que l'anterior si n'hi ha d'altres; en mode equilibrat, tampoc del mateix grup si es pot evitar,
 * i els grups ja usats a la setmana pesen menys.
 */
class SorteigPrincipals {
  private pendents: Recepta[] = [];
  private anterior: Recepta | undefined;
  private readonly usosGrup = new Map<string, number>();
  /** Últim dia (ordre) en què ha sortit cada recepta. */
  private readonly ultimDia = new Map<string, number>();

  constructor(
    private readonly candidates: Recepta[],
    private readonly pesBase: (r: Recepta) => number,
    private readonly equilibrat: boolean,
    private readonly aleatori: () => number,
  ) {}

  private pes(r: Recepta): number {
    const base = this.pesBase(r);
    if (!this.equilibrat) return base;
    const usos = grups(r).reduce((s, g) => s + (this.usosGrup.get(g) ?? 0), 0);
    return base / (1 + usos);
  }

  treure(admet: (r: Recepta) => boolean, ordre: number): Recepta {
    let possibles = this.pendents.filter(admet);
    if (possibles.length === 0) {
      this.pendents = [...this.candidates];
      possibles = this.pendents.filter(admet);
    }
    const anterior = this.anterior;
    const restringir = (filtre: (r: Recepta) => boolean): void => {
      const restants = possibles.filter(filtre);
      if (restants.length > 0) possibles = restants;
    };
    // Si es pot, cap plat que hagi sortit fa pocs dies.
    restringir((r) => {
      const ultim = this.ultimDia.get(r.id);
      return ultim === undefined || ordre - ultim > DIES_SENSE_REPETIR;
    });
    if (anterior) {
      restringir((r) => r.id !== anterior.id);
      if (this.equilibrat) {
        const grupsAnterior = grups(anterior);
        restringir((r) => !grups(r).some((g) => grupsAnterior.includes(g)));
      }
    }

    const total = possibles.reduce((s, r) => s + this.pes(r), 0);
    let punt = this.aleatori() * total;
    const triada = possibles.find((r) => (punt -= this.pes(r)) < 0) ?? possibles[possibles.length - 1]!;

    const index = this.pendents.indexOf(triada);
    if (index >= 0) this.pendents.splice(index, 1);
    for (const g of grups(triada)) this.usosGrup.set(g, (this.usosGrup.get(g) ?? 0) + 1);
    this.anterior = triada;
    this.ultimDia.set(triada.id, ordre);
    return triada;
  }
}

/**
 * Tria l'acompanyament de cada principal entre els que admet i caben al temps de l'àpat:
 * primer els menys usats de la setmana (comptant també les principals, perquè una recepta
 * de doble ús no surti dues vegades si es pot evitar), i mai el mateix que l'anterior si n'hi ha d'altres.
 */
class TriaAcompanyaments {
  private readonly usos = new Map<string, number>();
  private anterior: string | undefined;

  constructor(
    private readonly acompanyaments: Recepta[],
    private readonly aleatori: () => number,
  ) {}

  anotar(id: string): void {
    this.usos.set(id, (this.usos.get(id) ?? 0) + 1);
  }

  treure(principal: Recepta, limit: number | null): Recepta | undefined {
    const admesos = acompanyamentsPossibles(principal, this.acompanyaments, limit);
    if (admesos.length === 0) return undefined;
    const usos = (r: Recepta): number => this.usos.get(r.id) ?? 0;
    const senseAnterior = admesos.length > 1 ? admesos.filter((r) => r.id !== this.anterior) : admesos;
    const minim = Math.min(...senseAnterior.map(usos));
    const elegibles = senseAnterior.filter((r) => usos(r) === minim);
    const triat = elegibles[Math.floor(this.aleatori() * elegibles.length)] ?? elegibles[0]!;
    this.anotar(triat.id);
    this.anterior = triat.id;
    return triat;
  }
}

const idsDe = (triades: Triada[]): string[] =>
  triades.flatMap((t) => (t.acompanyament ? [t.principal.id, t.acompanyament.id] : [t.principal.id]));

/**
 * Planifica la setmana:
 * 1. filtra les receptes;
 * 2. en tria una per àpat marcat, dins del temps màxim d'aquell dia, sense repetir mentre n'hi hagi prou,
 *    amb la llavor; si la recepta demana acompanyament, en tria un dels que admet;
 * 3. si el cost del que es menja supera el pressupost, substitueix l'àpat més car
 *    per l'opció més barata disponible, fins que hi càpiga o ja no es pugui abaratir.
 */
export function planificar({ cataleg, configuracio, graella, llavor, dies }: EntradaPlanificador): PlaSetmanal {
  const racionsCentesimes = racionsEfectives(configuracio.persones);
  const limitDia = (dia: Dia): number | null =>
    esCapDeSetmana(dia) ? configuracio.tempsMaximMinuts.capDeSetmana : configuracio.tempsMaximMinuts.feiners;
  const marcats = apatsMarcats(graella);
  const forats: Forat[] = dies
    ? dies.flatMap(({ data, dia }, ordre) =>
        marcats.filter((m) => m.dia === dia).map(({ apat }) => ({ dia, apat, limit: limitDia(dia), ordre, data })),
      )
    : marcats.map(({ dia, apat }) => ({ dia, apat, limit: limitDia(dia), ordre: DIES.indexOf(dia) }));
  const avisos: Avis[] = [];
  const buit = (): PlaSetmanal => ({
    apats: [],
    llista: generarLlista(cataleg, [], racionsCentesimes),
    racionsCentesimes,
    costConsumitCentims: 0,
    avisos,
  });

  if (forats.length === 0) {
    avisos.push({ codi: 'cap-apat-marcat' });
    return buit();
  }

  const permeses = filtrarReceptes(cataleg, configuracio);
  const acompanyaments = filtrarAcompanyaments(cataleg, configuracio);
  const aptaPer = (r: Recepta, forat: Forat): boolean => diaAdient(r, forat.dia) && apta(r, acompanyaments, forat.limit);
  // Els plats amb 👎 no surten sols, tret que sense ells algun àpat es quedés sense cap opció.
  const sensePerdre = permeses.filter((r) => !noAgrada(configuracio, r.id));
  const candidates = forats.every((f) => sensePerdre.some((r) => aptaPer(r, f))) ? sensePerdre : permeses;
  const aptesPer = (forat: Forat): Recepta[] => candidates.filter((r) => aptaPer(r, forat));
  if (forats.some((f) => aptesPer(f).length === 0)) {
    avisos.push({ codi: 'cap-recepta-valida' });
    return buit();
  }

  const cost = new Map(
    [...candidates, ...acompanyaments].map((r) => [r.id, costRecepta(cataleg, r, racionsCentesimes)]),
  );
  const costDe = (r: Recepta | undefined): number => (r ? (cost.get(r.id) ?? 0) : 0);
  /** Acompanyament més barat dels que admet una principal dins d'un límit de temps. */
  const acompanyamentMesBarat = (r: Recepta, limit: number | null): Recepta | undefined =>
    acompanyamentsPossibles(r, acompanyaments, limit).reduce<Recepta | undefined>(
      (millor, a) => (millor === undefined || costDe(a) < costDe(millor) ? a : millor),
      undefined,
    );
  /** Opció més barata per a un àpat: la principal i, si cal, l'acompanyament més barat que admet. */
  const opcio = (r: Recepta, limit: number | null): Triada => {
    const acompanyament = r.ambAcompanyament ? acompanyamentMesBarat(r, limit) : undefined;
    return acompanyament ? { principal: r, acompanyament } : { principal: r };
  };
  const costTriada = (t: Triada): number => costDe(t.principal) + costDe(t.acompanyament);

  // Pes de cada principal: preferides, evitades i, en mode econòmic, el cost respecte del cost mitjà.
  const costosOpcio = new Map(candidates.map((r) => [r.id, costTriada(opcio(r, null))]));
  const ordenats = [...costosOpcio.values()].sort((a, b) => a - b);
  const costMitja = ordenats[Math.floor(ordenats.length / 2)] ?? 0;
  const pesBase = (r: Recepta): number => {
    let pes = 1 + PES_PREFERIDA * r.etiquetes.filter((e) => configuracio.etiquetesPreferides.includes(e)).length;
    if (r.etiquetes.some((e) => configuracio.etiquetesEvitades.includes(e))) pes *= PES_EVITADA;
    if (configuracio.valoracions?.[r.id] === 'agrada') pes *= PES_AGRADA;
    if (configuracio.economic) {
      const c = costosOpcio.get(r.id) ?? 0;
      const factor = c > 0 ? costMitja / c : ECONOMIC_MAX;
      pes *= Math.min(ECONOMIC_MAX, Math.max(ECONOMIC_MIN, factor));
    }
    return pes;
  };

  const aleatori = generadorAleatori(llavor);
  const sorteig = new SorteigPrincipals(candidates, pesBase, configuracio.equilibrat, aleatori);
  const principals = forats.map((f) => sorteig.treure((r) => aptaPer(r, f), f.ordre));
  const triaAcompanyaments = new TriaAcompanyaments(acompanyaments, aleatori);
  for (const principal of principals) triaAcompanyaments.anotar(principal.id);
  const triades: Triada[] = principals.map((principal, i) => {
    const acompanyament = principal.ambAcompanyament ? triaAcompanyaments.treure(principal, forats[i]!.limit) : undefined;
    return acompanyament ? { principal, acompanyament } : { principal };
  });

  const ambRepeticions = new Set(principals.map((r) => r.id)).size < forats.length;
  /** El plat `r` a l'àpat `i` no surt en cap altre àpat a pocs dies. */
  const separat = (r: Recepta, i: number, triadesActuals: readonly Triada[]): boolean =>
    triadesActuals.every(
      (t, j) => j === i || t.principal.id !== r.id || Math.abs(forats[j]!.ordre - forats[i]!.ordre) > DIES_SENSE_REPETIR,
    );
  // En una setmana, qualsevol repetició s'avisa; en un període llarg, només si surten a pocs dies.
  const avisarRepeticions = dies
    ? principals.some((r, i) => !separat(r, i, principals.map((p) => ({ principal: p }))))
    : ambRepeticions;
  if (avisarRepeticions) {
    avisos.push({ codi: 'receptes-repetides', disponibles: candidates.length, necessaries: forats.length });
  }

  const costTotal = (): number => triades.reduce((s, t) => s + costTriada(t), 0);
  const pressupostRacio = configuracio.pressupostRacioCentims;
  if (pressupostRacio !== null) {
    const pressupostApat = Math.round((pressupostRacio * racionsCentesimes) / 100);
    const limitTotal = pressupostApat * forats.length;

    while (costTotal() > limitTotal) {
      const usades = new Set(triades.map((t) => t.principal.id));

      // Per a cada àpat, la millor alternativa dins del seu temps: una altra principal més barata
      // (sense repetir-ne cap, si abans no calia) o la mateixa amb l'acompanyament més barat.
      const alternativa = (t: Triada, forat: Forat, i: number): Triada | undefined => {
        const opcions = aptesPer(forat)
          .filter((r) => ambRepeticions || !usades.has(r.id))
          .filter((r) => !dies || r.id === t.principal.id || separat(r, i, triades))
          .map((r) => opcio(r, forat.limit));
        if (t.acompanyament) opcions.push(opcio(t.principal, forat.limit));
        const millor = opcions.reduce<Triada | undefined>(
          (m, o) => (m === undefined || costTriada(o) < costTriada(m) ? o : m),
          undefined,
        );
        return millor && costTriada(millor) < costTriada(t) ? millor : undefined;
      };

      // L'àpat més car que es pugui abaratir (a igualtat, el primer de la setmana).
      let index = -1;
      let substituta: Triada | undefined;
      for (let i = 0; i < triades.length; i++) {
        const t = triades[i]!;
        const alt = alternativa(t, forats[i]!, i);
        if (alt && (index === -1 || costTriada(t) > costTriada(triades[index]!))) {
          index = i;
          substituta = alt;
        }
      }
      if (index === -1 || !substituta) {
        avisos.push({
          codi: 'pressupost-impossible',
          pressupostApatCentims: pressupostApat,
          minimApatCentims: Math.round(costTotal() / forats.length),
        });
        break;
      }
      triades[index] = substituta;
    }
  }

  const llista = generarLlista(cataleg, idsDe(triades), racionsCentesimes);
  if (llista.senseCost.length > 0) avisos.push({ codi: 'sense-preu', ingredientIds: llista.senseCost });

  const apats = forats.map(({ dia, apat, data }, i): ApatPlanificat => {
    const t = triades[i]!;
    const base: ApatPlanificat = data ? { dia, apat, data, receptaId: t.principal.id } : { dia, apat, receptaId: t.principal.id };
    return t.acompanyament ? { ...base, acompanyamentId: t.acompanyament.id } : base;
  });
  return { apats, llista, racionsCentesimes, costConsumitCentims: costTotal(), avisos };
}

/** Llista de la compra i cost del que es menja d'uns àpats ja triats. */
export function avaluarMenu(
  cataleg: Cataleg,
  configuracio: ConfiguracioFamilia,
  apats: readonly ApatPlanificat[],
): {
  llista: LlistaCompra;
  costConsumitCentims: number;
  /** Racions de la família sencera. */
  racionsCentesimes: number;
  /** Suma de les racions de tots els àpats (amb convidats i absències). */
  racionsMenuCentesimes: number;
} {
  const racionsCentesimes = racionsEfectives(configuracio.persones);
  const receptes = apats.flatMap((a) => {
    const racions = racionsApat(configuracio.persones, a);
    const ids = a.acompanyamentId ? [a.receptaId, a.acompanyamentId] : [a.receptaId];
    return ids.map((receptaId) => ({ receptaId, racionsCentesimes: racions }));
  });
  const costConsumitCentims = receptes.reduce((s, { receptaId, racionsCentesimes: racions }) => {
    const r = cataleg.receptes.get(receptaId);
    return s + (r ? costRecepta(cataleg, r, racions) : 0);
  }, 0);
  const racionsMenuCentesimes = apats.reduce((s, a) => s + racionsApat(configuracio.persones, a), 0);
  return { llista: generarLlista(cataleg, receptes, racionsCentesimes), costConsumitCentims, racionsCentesimes, racionsMenuCentesimes };
}

/**
 * Canvia el plat d'un àpat per un altre que compleixi la configuració i el temps d'aquell dia.
 * Prefereix plats que no surtin aquella setmana i, en mode equilibrat, d'un grup diferent dels àpats del costat.
 * Si la principal demana acompanyament, en tria un dels que admet, preferint els no usats.
 * Retorna una còpia dels àpats; si no hi ha cap alternativa, la retorna sense canvis.
 */
export function canviarPlat(
  cataleg: Cataleg,
  configuracio: ConfiguracioFamilia,
  apats: readonly ApatPlanificat[],
  index: number,
  llavor: number,
): ApatPlanificat[] {
  const actual = apats[index];
  if (!actual) return [...apats];
  const limit = esCapDeSetmana(actual.dia) ? configuracio.tempsMaximMinuts.capDeSetmana : configuracio.tempsMaximMinuts.feiners;
  const acompanyaments = filtrarAcompanyaments(cataleg, configuracio);
  const usats = new Set(apats.filter((_, i) => i !== index).flatMap((a) => [a.receptaId, a.acompanyamentId ?? '']));
  const veins = [apats[index - 1], apats[index + 1]]
    .flatMap((a) => (a ? [cataleg.receptes.get(a.receptaId)] : []))
    .filter((r): r is Recepta => r !== undefined);
  const grupsVeins = new Set(veins.flatMap(grups));

  let opcions = filtrarReceptes(cataleg, configuracio).filter(
    (r) => r.id !== actual.receptaId && diaAdient(r, actual.dia) && apta(r, acompanyaments, limit),
  );
  const preferir = (filtre: (r: Recepta) => boolean): void => {
    const restants = opcions.filter(filtre);
    if (restants.length > 0) opcions = restants;
  };
  preferir((r) => !noAgrada(configuracio, r.id));
  preferir((r) => !usats.has(r.id));
  if (configuracio.equilibrat) preferir((r) => !grups(r).some((g) => grupsVeins.has(g)));
  if (opcions.length === 0) return [...apats];

  const aleatori = generadorAleatori(llavor);
  const principal = opcions[Math.floor(aleatori() * opcions.length)] ?? opcions[0]!;
  let acompanyament: Recepta | undefined;
  if (principal.ambAcompanyament) {
    const possibles = acompanyamentsPossibles(principal, acompanyaments, limit);
    const nous = possibles.filter((a) => !usats.has(a.id));
    const triables = nous.length > 0 ? nous : possibles;
    acompanyament = triables[Math.floor(aleatori() * triables.length)];
  }

  const nou: ApatPlanificat = acompanyament
    ? { dia: actual.dia, apat: actual.apat, receptaId: principal.id, acompanyamentId: acompanyament.id }
    : { dia: actual.dia, apat: actual.apat, receptaId: principal.id };
  if (actual.data) nou.data = actual.data;
  if (actual.assistencia) nou.assistencia = actual.assistencia;
  if (actual.fixat) nou.fixat = true;
  return apats.map((a, i) => (i === index ? nou : a));
}

// ——— Plats fixats ———

/**
 * Torna a posar els plats fixats d'un menú anterior als mateixos àpats (mateix dia, àpat i data) del menú nou.
 * Els altres àpats que repeteixen un plat fixat massa a prop (en el setmanal, a qualsevol dia) es canvien per un altre.
 * Els fixats d'àpats que ja no hi són (p. ex. s'han desmarcat de la graella) es perden.
 */
export function conservarFixats(
  cataleg: Cataleg,
  configuracio: ConfiguracioFamilia,
  nous: readonly ApatPlanificat[],
  anteriors: readonly ApatPlanificat[],
  llavor: number,
): ApatPlanificat[] {
  const fixats = anteriors.filter((a) => a.fixat);
  if (fixats.length === 0) return [...nous];
  let apats = nous.map((a) => {
    const f = fixats.find((x) => x.dia === a.dia && x.apat === a.apat && x.data === a.data);
    if (!f) return a;
    const nou: ApatPlanificat = { dia: a.dia, apat: a.apat, receptaId: f.receptaId, fixat: true };
    if (f.acompanyamentId) nou.acompanyamentId = f.acompanyamentId;
    if (a.data) nou.data = a.data;
    if (a.assistencia) nou.assistencia = a.assistencia;
    return nou;
  });
  const aProp = (a: ApatPlanificat, b: ApatPlanificat): boolean =>
    a.data && b.data ? Math.abs(diesEntre(a.data, b.data)) <= DIES_SENSE_REPETIR : true;
  for (let i = 0; i < apats.length; i++) {
    const a = apats[i]!;
    if (a.fixat) continue;
    if (apats.some((b) => b.fixat && b.receptaId === a.receptaId && aProp(a, b))) {
      apats = canviarPlat(cataleg, configuracio, apats, i, llavor + i);
    }
  }
  return apats;
}

// ——— Triar el plat d'un àpat a mà ———

/** Categories del llistat de plats per triar, en l'ordre en què es mostren. */
export const CATEGORIES_PLAT = ['carn', 'peix', 'ou', 'llegums', 'pasta', 'arros', 'verdura'] as const;
export type CategoriaPlat = (typeof CATEGORIES_PLAT)[number];

/**
 * Categoria d'un plat al llistat. Si en té més d'una, mana el que en fa la base:
 * canelons de carn → pasta; arròs a la cubana → arròs; llenties amb xoriço → llegums; truita de botifarra → ou.
 * Els que no tenen cap grup (verdures, sopes, coques…) van a «verdura».
 */
export function categoriaPlat(r: Recepta): CategoriaPlat {
  const ordre: CategoriaPlat[] = ['pasta', 'arros', 'llegums', 'peix', 'ou', 'carn'];
  return ordre.find((c) => r.etiquetes.includes(c)) ?? 'verdura';
}

export interface OpcioPlat {
  recepta: Recepta;
  categoria: CategoriaPlat;
  /** Es fa dins del temps que la família té aquell dia. */
  dinsTemps: boolean;
  /** És el plat que ara hi ha en aquest àpat. */
  actual: boolean;
  /** Índexs dels altres àpats de la setmana on ja surt (com a plat o com a acompanyament). */
  usatA: number[];
  /** És de barbacoa i l'àpat és entre setmana (el planificador no l'hi posaria). */
  barbacoaEntreSetmana: boolean;
}

/** Límit de temps de l'àpat indicat. */
const limitDe = (configuracio: ConfiguracioFamilia, dia: Dia): number | null =>
  esCapDeSetmana(dia) ? configuracio.tempsMaximMinuts.capDeSetmana : configuracio.tempsMaximMinuts.feiners;

/**
 * Tots els plats que es poden triar per a un àpat: compleixen la dieta, les al·lèrgies, els aliments exclosos
 * i les etiquetes; els que demanen acompanyament, només si en tenen algun de vàlid.
 * El temps i el pressupost no en treuen cap (és una tria a mà), però es diu si passen del temps del dia.
 * Ordenats per categoria i nom.
 */
export function opcionsDePlat(
  cataleg: Cataleg,
  configuracio: ConfiguracioFamilia,
  apats: readonly ApatPlanificat[],
  index: number,
): OpcioPlat[] {
  const apat = apats[index];
  if (!apat) return [];
  const limit = limitDe(configuracio, apat.dia);
  const acompanyaments = filtrarAcompanyaments(cataleg, configuracio);
  const ordre = (c: CategoriaPlat): number => CATEGORIES_PLAT.indexOf(c);
  return [...cataleg.receptes.values()]
    .filter((r) => potSerPrincipal(r) && permesa(cataleg, r, configuracio))
    .filter((r) => configuracio.etiquetesObligatories.every((e) => r.etiquetes.includes(e)))
    .filter((r) => !r.ambAcompanyament || acompanyamentsAdmesos(r, acompanyaments).some((a) => a.id !== r.id))
    .map((r) => ({
      recepta: r,
      categoria: categoriaPlat(r),
      dinsTemps: dinsTemps(r, limit),
      barbacoaEntreSetmana: !diaAdient(r, apat.dia),
      actual: r.id === apat.receptaId,
      usatA: apats.flatMap((a, i) => (i !== index && (a.receptaId === r.id || a.acompanyamentId === r.id) ? [i] : [])),
    }))
    .sort((a, b) => ordre(a.categoria) - ordre(b.categoria) || a.recepta.nom.localeCompare(b.recepta.nom, 'ca'));
}

/** Acompanyaments que es poden posar amb una principal (mai ella mateixa), ordenats per nom. */
export function acompanyamentsDePlat(cataleg: Cataleg, configuracio: ConfiguracioFamilia, receptaId: string): Recepta[] {
  const r = cataleg.receptes.get(receptaId);
  if (!r?.ambAcompanyament) return [];
  return acompanyamentsAdmesos(r, filtrarAcompanyaments(cataleg, configuracio))
    .filter((a) => a.id !== r.id)
    .sort((a, b) => a.nom.localeCompare(b.nom, 'ca'));
}

/**
 * Posa a l'àpat el plat triat. Si demana acompanyament i no se n'indica cap, en tria un dels que admet,
 * preferint els que no surten aquella setmana. Retorna una còpia dels àpats;
 * si el plat o l'acompanyament no es poden triar, la retorna sense canvis.
 */
export function triarPlat(
  cataleg: Cataleg,
  configuracio: ConfiguracioFamilia,
  apats: readonly ApatPlanificat[],
  index: number,
  receptaId: string,
  acompanyamentId?: string,
): ApatPlanificat[] {
  const actual = apats[index];
  if (!actual || !opcionsDePlat(cataleg, configuracio, apats, index).some((o) => o.recepta.id === receptaId)) return [...apats];
  const possibles = acompanyamentsDePlat(cataleg, configuracio, receptaId);
  let acompanyament: string | undefined;
  if (possibles.length > 0) {
    if (acompanyamentId !== undefined) {
      if (!possibles.some((a) => a.id === acompanyamentId)) return [...apats];
      acompanyament = acompanyamentId;
    } else {
      const usats = new Set(apats.filter((_, i) => i !== index).flatMap((a) => [a.receptaId, a.acompanyamentId ?? '']));
      acompanyament = (possibles.find((a) => !usats.has(a.id)) ?? possibles[0])!.id;
    }
  }
  const nou: ApatPlanificat = acompanyament
    ? { dia: actual.dia, apat: actual.apat, receptaId, acompanyamentId: acompanyament }
    : { dia: actual.dia, apat: actual.apat, receptaId };
  if (actual.data) nou.data = actual.data;
  if (actual.assistencia) nou.assistencia = actual.assistencia;
  if (actual.fixat) nou.fixat = true;
  return apats.map((a, i) => (i === index ? nou : a));
}

// ——— Receptari complet ———

/** Grups del receptari: les categories dels plats i, al final, els acompanyaments. */
export type GrupReceptari = CategoriaPlat | 'acompanyament' | 'salsa';

export interface SeccioReceptari {
  grup: GrupReceptari;
  receptes: Recepta[];
}

/**
 * Receptari per fer un plat a la carta: totes les receptes que la família pot menjar i fer
 * (dieta, al·lèrgies, aliments exclosos, etiquetes excloses i aparells), sense límit de temps ni pressupost.
 * Les principals van per categories; els acompanyaments, a part (la truita, de doble ús, surt als dos llocs).
 * Ordenades per nom; els grups buits no hi surten.
 */
export function receptari(cataleg: Cataleg, configuracio: ConfiguracioFamilia): SeccioReceptari[] {
  const permeses = [...cataleg.receptes.values()]
    .filter((r) => permesa(cataleg, r, configuracio))
    .sort((a, b) => a.nom.localeCompare(b.nom, 'ca'));
  const grups: SeccioReceptari[] = CATEGORIES_PLAT.map((grup) => ({
    grup,
    receptes: permeses.filter((r) => potSerPrincipal(r) && categoriaPlat(r) === grup),
  }));
  grups.push({ grup: 'acompanyament', receptes: permeses.filter(potSerAcompanyament) });
  grups.push({ grup: 'salsa', receptes: permeses.filter(esSalsa) });
  return grups.filter((g) => g.receptes.length > 0);
}

/**
 * Filtre del receptari: plats de barbacoa, una cuina o una dieta
 * (vegana: cap ingredient d'origen animal; vegetariana: ni carn ni peix).
 */
export type FiltreReceptari = 'agrada' | 'brasa' | Cuina | 'vegana' | 'vegetariana';

export function compleixFiltre(
  cataleg: Cataleg,
  r: Recepta,
  filtre: FiltreReceptari,
  valoracions: Readonly<Record<string, Valoracio>> = {},
): boolean {
  // 👍 Els que ens encanten.
  if (filtre === 'agrada') return valoracions[r.id] === 'agrada';
  // A la brasa: els plats i acompanyaments de barbacoa i les salses que hi van bé.
  if (filtre === 'brasa') return calBarbacoa(r) || esSalsa(r);
  if (filtre === 'vegana' || filtre === 'vegetariana') {
    return r.ingredients.every((l) => {
      const origen = cataleg.ingredients.get(l.ingredientId)?.origen;
      return origen === undefined || (filtre === 'vegetariana' && origen === 'derivat');
    });
  }
  return (r.cuina ?? 'casolana') === filtre;
}

/** Filtres que tenen sentit per a aquest receptari: els que deixen alguna recepta i no les deixen totes. */
export function filtresReceptari(
  cataleg: Cataleg,
  seccions: readonly SeccioReceptari[],
  valoracions: Readonly<Record<string, Valoracio>> = {},
): FiltreReceptari[] {
  const totes = seccions.flatMap((s) => s.receptes);
  const candidats: FiltreReceptari[] = ['agrada', 'brasa', ...CUINES, 'vegetariana', 'vegana'];
  return candidats.filter((f) => {
    const n = totes.filter((r) => compleixFiltre(cataleg, r, f, valoracions)).length;
    return n > 0 && n < totes.length;
  });
}

/** Aplica un filtre al receptari i treu els grups que queden buits. */
export function filtrarReceptari(
  cataleg: Cataleg,
  seccions: readonly SeccioReceptari[],
  filtre: FiltreReceptari | null,
  valoracions: Readonly<Record<string, Valoracio>> = {},
): SeccioReceptari[] {
  if (!filtre) return [...seccions];
  return seccions
    .map((s) => ({ ...s, receptes: s.receptes.filter((r) => compleixFiltre(cataleg, r, filtre, valoracions)) }))
    .filter((s) => s.receptes.length > 0);
}
