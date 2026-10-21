import { generadorAleatori } from './aleatori';
import { acompanyamentsAdmesos, potSerAcompanyament, potSerPrincipal, type Cataleg } from './cataleg';
import { costRecepta } from './cost';
import { racionsEfectives } from './escalat';
import { apatsMarcats } from './graella';
import { generarLlista, type LlistaCompra } from './llista';
import type { ApatPlanificat, Avis, ConfiguracioFamilia, Graella, Recepta } from './tipus';

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
  avisos: Avis[];
}

/** Pes extra de cada etiqueta preferida en el sorteig. */
const PES_PREFERIDA = 2;

function compleix(r: Recepta, configuracio: ConfiguracioFamilia, exclosos: ReadonlySet<string>): boolean {
  return (
    !r.ingredients.some((l) => exclosos.has(l.ingredientId)) &&
    (configuracio.tempsMaximMinuts === null || r.tempsMinuts <= configuracio.tempsMaximMinuts)
  );
}

const perId = (a: Recepta, b: Recepta): number => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

/**
 * Acompanyaments vàlids (també les receptes de doble ús): cap ingredient exclòs i dins del temps màxim.
 * Les etiquetes obligatòries s'apliquen a la recepta principal, no a l'acompanyament.
 */
export function filtrarAcompanyaments(cataleg: Cataleg, configuracio: ConfiguracioFamilia): Recepta[] {
  const exclosos = new Set(configuracio.exclosos);
  return [...cataleg.receptes.values()]
    .filter((r) => potSerAcompanyament(r) && compleix(r, configuracio, exclosos))
    .sort(perId);
}

/**
 * Receptes principals que compleixen la configuració:
 * cap ingredient exclòs, dins del temps màxim i amb totes les etiquetes obligatòries.
 * Les que demanen acompanyament només hi són si n'hi ha algun de vàlid entre els que admeten.
 * Ordenades per identificador perquè el resultat no depengui de l'ordre del catàleg.
 */
export function filtrarReceptes(cataleg: Cataleg, configuracio: ConfiguracioFamilia): Recepta[] {
  const exclosos = new Set(configuracio.exclosos);
  const acompanyaments = filtrarAcompanyaments(cataleg, configuracio);
  return [...cataleg.receptes.values()]
    .filter((r) => potSerPrincipal(r) && compleix(r, configuracio, exclosos))
    .filter((r) => configuracio.etiquetesObligatories.every((e) => r.etiquetes.includes(e)))
    .filter((r) => !r.ambAcompanyament || acompanyamentsAdmesos(r, acompanyaments).length > 0)
    .sort(perId);
}

function pes(recepta: Recepta, preferides: readonly string[]): number {
  return 1 + PES_PREFERIDA * recepta.etiquetes.filter((e) => preferides.includes(e)).length;
}

/** Sorteig ponderat sense repetir: quan s'acaben les receptes, torna a començar. */
class Sorteig {
  private pendents: Recepta[] = [];
  private anterior: string | undefined;

  constructor(
    private readonly candidates: Recepta[],
    private readonly preferides: readonly string[],
    private readonly aleatori: () => number,
  ) {}

  /** Treu una recepta, evitant la mateixa que l'anterior si n'hi ha d'altres. */
  treure(): Recepta {
    if (this.pendents.length === 0) this.pendents = [...this.candidates];
    const elegibles = this.pendents.length > 1 ? this.pendents.filter((r) => r.id !== this.anterior) : this.pendents;
    const total = elegibles.reduce((s, r) => s + pes(r, this.preferides), 0);
    let punt = this.aleatori() * total;
    const triada = elegibles.find((r) => (punt -= pes(r, this.preferides)) < 0) ?? elegibles[elegibles.length - 1]!;
    this.pendents.splice(this.pendents.indexOf(triada), 1);
    this.anterior = triada.id;
    return triada;
  }
}

/**
 * Tria l'acompanyament de cada principal entre els que admet:
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

  treure(principal: Recepta): Recepta | undefined {
    const admesos = acompanyamentsAdmesos(principal, this.acompanyaments);
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

interface Triada {
  principal: Recepta;
  acompanyament?: Recepta;
}

const idsDe = (triades: Triada[]): string[] =>
  triades.flatMap((t) => (t.acompanyament ? [t.principal.id, t.acompanyament.id] : [t.principal.id]));

/**
 * Planifica la setmana:
 * 1. filtra les receptes;
 * 2. en tria una per àpat marcat, sense repetir mentre n'hi hagi prou, amb la llavor;
 *    si la recepta demana acompanyament, en tria un dels que admet;
 * 3. si el cost de compra supera el pressupost, substitueix l'àpat més car
 *    per l'opció més barata disponible, fins que hi càpiga o ja no es pugui abaratir.
 */
export function planificar({ cataleg, configuracio, graella, llavor }: EntradaPlanificador): PlaSetmanal {
  const racionsCentesimes = racionsEfectives(configuracio.persones);
  const forats = apatsMarcats(graella);
  const avisos: Avis[] = [];
  const buit = (): PlaSetmanal => ({
    apats: [],
    llista: generarLlista(cataleg, [], racionsCentesimes),
    racionsCentesimes,
    avisos,
  });

  if (forats.length === 0) {
    avisos.push({ codi: 'cap-apat-marcat' });
    return buit();
  }

  const candidates = filtrarReceptes(cataleg, configuracio);
  if (candidates.length === 0) {
    avisos.push({ codi: 'cap-recepta-valida' });
    return buit();
  }
  const acompanyaments = filtrarAcompanyaments(cataleg, configuracio);

  const ambRepeticions = candidates.length < forats.length;
  if (ambRepeticions) {
    avisos.push({ codi: 'receptes-repetides', disponibles: candidates.length, necessaries: forats.length });
  }

  const aleatori = generadorAleatori(llavor);
  const sorteigPrincipals = new Sorteig(candidates, configuracio.etiquetesPreferides, aleatori);
  const principals = forats.map(() => sorteigPrincipals.treure());
  const triaAcompanyaments = new TriaAcompanyaments(acompanyaments, aleatori);
  for (const principal of principals) triaAcompanyaments.anotar(principal.id);
  const triades: Triada[] = principals.map((principal) => {
    const acompanyament = principal.ambAcompanyament ? triaAcompanyaments.treure(principal) : undefined;
    return acompanyament ? { principal, acompanyament } : { principal };
  });

  let llista = generarLlista(cataleg, idsDe(triades), racionsCentesimes);

  const pressupost = configuracio.pressupostCentims;
  if (pressupost !== null) {
    const cost = new Map(
      [...candidates, ...acompanyaments].map((r) => [r.id, costRecepta(cataleg, r, racionsCentesimes)]),
    );
    const costDe = (r: Recepta | undefined): number => (r ? (cost.get(r.id) ?? 0) : 0);
    /** Acompanyament més barat dels que admet una principal. */
    const acompanyamentMesBarat = (r: Recepta): Recepta | undefined =>
      acompanyamentsAdmesos(r, acompanyaments).reduce<Recepta | undefined>(
        (millor, a) => (millor === undefined || costDe(a) < costDe(millor) ? a : millor),
        undefined,
      );
    /** Opció més barata per a un àpat: la principal i, si cal, l'acompanyament més barat que admet. */
    const opcio = (r: Recepta): Triada => {
      const acompanyament = r.ambAcompanyament ? acompanyamentMesBarat(r) : undefined;
      return acompanyament ? { principal: r, acompanyament } : { principal: r };
    };
    const costTriada = (t: Triada): number => costDe(t.principal) + costDe(t.acompanyament);

    while (llista.totalCompraCentims > pressupost) {
      const usades = new Set(triades.map((t) => t.principal.id));
      const disponibles = ambRepeticions ? candidates : candidates.filter((r) => !usades.has(r.id));
      const mesBarata = disponibles
        .map(opcio)
        .reduce<Triada | undefined>((millor, t) => (millor === undefined || costTriada(t) < costTriada(millor) ? t : millor), undefined);

      // Per a cada àpat, la millor alternativa: una altra principal més barata
      // o la mateixa principal amb l'acompanyament més barat.
      const alternativa = (t: Triada): Triada | undefined => {
        const mateixa = t.acompanyament ? opcio(t.principal) : undefined;
        const opcions = [mesBarata, mateixa].filter((o): o is Triada => o !== undefined);
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
        const alt = alternativa(t);
        if (alt && (index === -1 || costTriada(t) > costTriada(triades[index]!))) {
          index = i;
          substituta = alt;
        }
      }
      if (index === -1 || !substituta) {
        avisos.push({
          codi: 'pressupost-impossible',
          pressupostCentims: pressupost,
          minimCentims: llista.totalCompraCentims,
        });
        break;
      }

      triades[index] = substituta;
      llista = generarLlista(cataleg, idsDe(triades), racionsCentesimes);
    }
  }

  if (llista.senseCost.length > 0) avisos.push({ codi: 'sense-preu', ingredientIds: llista.senseCost });

  const apats = forats.map((forat, i): ApatPlanificat => {
    const t = triades[i]!;
    return t.acompanyament
      ? { ...forat, receptaId: t.principal.id, acompanyamentId: t.acompanyament.id }
      : { ...forat, receptaId: t.principal.id };
  });
  return { apats, llista, racionsCentesimes, avisos };
}
