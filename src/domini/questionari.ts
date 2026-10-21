import type { Alergen, ConfiguracioFamilia, Persona } from './tipus';

// Qüestionari de configuració: respostes tancades que es tradueixen a la configuració del planificador.
// Els textos de les preguntes i les opcions són a `src/textos/ca.ts`.

/** Tipus de receptari a prioritzar (es poden triar tots dos o cap). */
export type OpcioReceptari = 'variat' | 'economic';
/** Pressupost aproximat per àpat de quatre persones. */
export type OpcioPressupost = 'economic' | 'mitja' | 'flexible';
/** Temps habitual per cuinar. */
export type OpcioTemps = 'rapid' | 'mixt' | 'sense-limit';
/** Quant de peix voleu. */
export type OpcioPeix = 'normal' | 'poc' | 'gens';

export interface RespostesQuestionari {
  persones: Persona[];
  receptari: OpcioReceptari[];
  pressupost: OpcioPressupost;
  temps: OpcioTemps;
  peix: OpcioPeix;
  /** Ingredients que no han de sortir mai (verdures o llegums que no agraden, o qualsevol altre). */
  exclosos: string[];
  /** Al·lèrgies i intoleràncies de la família. */
  alergens: Alergen[];
}

/**
 * Pressupost de cada opció per ració normal, en cèntims: per a 4 persones,
 * econòmic = fins a 8 € per àpat i mitjà = fins a 14 € per àpat.
 */
export const PRESSUPOST_RACIO: Record<OpcioPressupost, number | null> = {
  economic: 200,
  mitja: 350,
  flexible: null,
};

/** Límit de l'opció «ràpid», en minuts. */
export const TEMPS_RAPID = 40;

const TEMPS: Record<OpcioTemps, ConfiguracioFamilia['tempsMaximMinuts']> = {
  rapid: { feiners: TEMPS_RAPID, capDeSetmana: TEMPS_RAPID },
  mixt: { feiners: TEMPS_RAPID, capDeSetmana: null },
  'sense-limit': { feiners: null, capDeSetmana: null },
};

/** Respostes amb què comença el qüestionari: quatre persones, variat, mitjà, ràpid entre setmana. */
export function respostesPerDefecte(): RespostesQuestionari {
  return {
    persones: [1, 2, 3, 4].map((n) => ({ nom: `Persona ${n}`, ganaCentesimes: 100 })),
    receptari: ['variat'],
    pressupost: 'mitja',
    temps: 'mixt',
    peix: 'normal',
    exclosos: [],
    alergens: [],
  };
}

/** Configuració del planificador que correspon a les respostes. */
export function configuracioDesDeRespostes(r: RespostesQuestionari): ConfiguracioFamilia {
  return {
    persones: r.persones.map((p) => ({ ...p })),
    exclosos: [...r.exclosos],
    alergens: [...r.alergens],
    etiquetesObligatories: [],
    etiquetesExcloses: r.peix === 'gens' ? ['peix'] : [],
    etiquetesPreferides: [],
    etiquetesEvitades: r.peix === 'poc' ? ['peix'] : [],
    equilibrat: r.receptari.includes('variat'),
    economic: r.receptari.includes('economic'),
    tempsMaximMinuts: { ...TEMPS[r.temps] },
    pressupostRacioCentims: PRESSUPOST_RACIO[r.pressupost],
  };
}

/** Opcions de gana que ofereix el qüestionari, en centèsimes. */
export const OPCIONS_GANA = [75, 100, 125, 150] as const;
/** Màxim de persones de la família. */
export const MAX_PERSONES = 10;

const RECEPTARI: readonly OpcioReceptari[] = ['variat', 'economic'];
const PRESSUPOSTOS: readonly OpcioPressupost[] = ['economic', 'mitja', 'flexible'];
const TEMPSOS: readonly OpcioTemps[] = ['rapid', 'mixt', 'sense-limit'];
const PEIXOS: readonly OpcioPeix[] = ['normal', 'poc', 'gens'];

const esObjecte = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const textos = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
const unDe = <T extends string>(v: unknown, opcions: readonly T[], perDefecte: T): T =>
  opcions.includes(v as T) ? (v as T) : perDefecte;

/**
 * Llegeix unes respostes desades (p. ex. del navegador) i les valida.
 * Els camps que falten o no són vàlids prenen el valor per defecte; si no hi ha cap persona vàlida, retorna `null`.
 */
export function llegirRespostes(valor: unknown, alergensValids: readonly string[]): RespostesQuestionari | null {
  if (!esObjecte(valor)) return null;
  const perDefecte = respostesPerDefecte();
  const persones = (Array.isArray(valor.persones) ? valor.persones : [])
    .filter(esObjecte)
    .slice(0, MAX_PERSONES)
    .map((p, i): Persona => {
      const gana = typeof p.ganaCentesimes === 'number' && Number.isInteger(p.ganaCentesimes) ? p.ganaCentesimes : 100;
      const nom = typeof p.nom === 'string' && p.nom.trim() !== '' ? p.nom.trim().slice(0, 40) : `Persona ${i + 1}`;
      return { nom, ganaCentesimes: Math.min(300, Math.max(25, gana)) };
    });
  if (persones.length === 0) return null;
  return {
    persones,
    receptari: [...new Set(textos(valor.receptari))].filter((o): o is OpcioReceptari => RECEPTARI.includes(o as OpcioReceptari)),
    pressupost: unDe(valor.pressupost, PRESSUPOSTOS, perDefecte.pressupost),
    temps: unDe(valor.temps, TEMPSOS, perDefecte.temps),
    peix: unDe(valor.peix, PEIXOS, perDefecte.peix),
    exclosos: [...new Set(textos(valor.exclosos))],
    alergens: [...new Set(textos(valor.alergens))].filter((a): a is Alergen => alergensValids.includes(a)),
  };
}
