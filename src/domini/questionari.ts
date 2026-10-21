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
