import { generadorAleatori } from './aleatori';
import { acompanyamentsAdmesos, potSerAcompanyament, potSerPrincipal, type Cataleg } from './cataleg';
import { costRecepta } from './cost';
import { racionsEfectives } from './escalat';
import { apatsMarcats, esCapDeSetmana } from './graella';
import { generarLlista, type LlistaCompra } from './llista';
import type { Apat, ApatPlanificat, Avis, ConfiguracioFamilia, Dia, Graella, Recepta } from './tipus';

export interface EntradaPlanificador {
  cataleg: Cataleg;
  configuracio: ConfiguracioFamilia;
  graella: Graella;
  /** Mateixa llavor + mateixes dades = mateix menú. */
  llavor: number;
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
/** Límits del multiplicador del mode econòmic (cost mitjà ÷ cost del plat). */
const ECONOMIC_MIN = 0.5;
const ECONOMIC_MAX = 3;

/** Grups que es reparteixen al llarg de la setmana en el mode equilibrat. */
export const GRUPS_EQUILIBRI: readonly string[] = ['carn', 'peix', 'ou', 'llegums', 'pasta', 'arros'];

const perId = (a: Recepta, b: Recepta): number => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

/** El límit més permissiu dels dos tipus de dia (`null` si algun no en té). */
function tempsMaximGlobal(configuracio: ConfiguracioFamilia): number | null {
  const { feiners, capDeSetmana } = configuracio.tempsMaximMinuts;
  return feiners === null || capDeSetmana === null ? null : Math.max(feiners, capDeSetmana);
}

const dinsTemps = (r: Recepta, limit: number | null): boolean => limit === null || r.tempsMinuts <= limit;

/** Restriccions que no depenen del dia: ingredients exclosos, al·lèrgens i etiquetes excloses. */
function permesa(cataleg: Cataleg, r: Recepta, configuracio: ConfiguracioFamilia): boolean {
  const exclosos = configuracio.exclosos;
  const alergens = configuracio.alergens;
  return (
    !r.etiquetes.some((e) => configuracio.etiquetesExcloses.includes(e)) &&
    !r.ingredients.some((l) => {
      if (exclosos.includes(l.ingredientId)) return true;
      const ing = cataleg.ingredients.get(l.ingredientId);
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
}

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

  treure(admet: (r: Recepta) => boolean): Recepta {
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
export function planificar({ cataleg, configuracio, graella, llavor }: EntradaPlanificador): PlaSetmanal {
  const racionsCentesimes = racionsEfectives(configuracio.persones);
  const forats: Forat[] = apatsMarcats(graella).map(({ dia, apat }) => ({
    dia,
    apat,
    limit: esCapDeSetmana(dia) ? configuracio.tempsMaximMinuts.capDeSetmana : configuracio.tempsMaximMinuts.feiners,
  }));
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

  const candidates = filtrarReceptes(cataleg, configuracio);
  const acompanyaments = filtrarAcompanyaments(cataleg, configuracio);
  const aptesPer = (forat: Forat): Recepta[] => candidates.filter((r) => apta(r, acompanyaments, forat.limit));
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
    if (configuracio.economic) {
      const c = costosOpcio.get(r.id) ?? 0;
      const factor = c > 0 ? costMitja / c : ECONOMIC_MAX;
      pes *= Math.min(ECONOMIC_MAX, Math.max(ECONOMIC_MIN, factor));
    }
    return pes;
  };

  const aleatori = generadorAleatori(llavor);
  const sorteig = new SorteigPrincipals(candidates, pesBase, configuracio.equilibrat, aleatori);
  const principals = forats.map((f) => sorteig.treure((r) => apta(r, acompanyaments, f.limit)));
  const triaAcompanyaments = new TriaAcompanyaments(acompanyaments, aleatori);
  for (const principal of principals) triaAcompanyaments.anotar(principal.id);
  const triades: Triada[] = principals.map((principal, i) => {
    const acompanyament = principal.ambAcompanyament ? triaAcompanyaments.treure(principal, forats[i]!.limit) : undefined;
    return acompanyament ? { principal, acompanyament } : { principal };
  });

  const ambRepeticions = new Set(principals.map((r) => r.id)).size < forats.length;
  if (ambRepeticions) {
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
      const alternativa = (t: Triada, forat: Forat): Triada | undefined => {
        const opcions = aptesPer(forat)
          .filter((r) => ambRepeticions || !usades.has(r.id))
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
        const alt = alternativa(t, forats[i]!);
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

  const apats = forats.map(({ dia, apat }, i): ApatPlanificat => {
    const t = triades[i]!;
    return t.acompanyament
      ? { dia, apat, receptaId: t.principal.id, acompanyamentId: t.acompanyament.id }
      : { dia, apat, receptaId: t.principal.id };
  });
  return { apats, llista, racionsCentesimes, costConsumitCentims: costTotal(), avisos };
}
