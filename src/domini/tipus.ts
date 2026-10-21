// Tipus del domini. Tot és dada pura: sense interfície ni emmagatzematge.
//
// Convencions:
// - Quantitats en la unitat base de l'ingredient i en nombres enters.
// - Diners en cèntims enters.
// - Factors (gana) en centèsimes enteres: 100 = normal, 125 = menja un 25 % més.

/**
 * Els 14 al·lèrgens de declaració obligatòria a la UE (Reglament 1169/2011).
 * 'llet' inclou la lactosa; 'fruits-secs' són els de closca (ametlles, avellanes, pinyons…).
 */
/** Aparells de cuina que una recepta pot necessitar (els fogons es donen per suposats). */
export const APARELLS = ['forn', 'microones', 'fregidora-aire', 'thermomix', 'batedora'] as const;
export type Aparell = (typeof APARELLS)[number];

export const ALERGENS = [
  'gluten',
  'crustacis',
  'ou',
  'peix',
  'cacauets',
  'soja',
  'llet',
  'fruits-secs',
  'api',
  'mostassa',
  'sesam',
  'sulfits',
  'tramussos',
  'molluscs',
] as const;
export type Alergen = (typeof ALERGENS)[number];

/** Origen animal d'un ingredient, per a les dietes: carn, peix (i marisc) o derivat (ous, làctics, mel). */
export type OrigenAnimal = 'carn' | 'peix' | 'derivat';

/** Unitats base: grams, mil·lilitres i unitats (peces). */
export type Unitat = 'g' | 'ml' | 'u';

export interface Ingredient {
  id: string;
  nom: string;
  /** Unitat en què es comptabilitza l'ingredient a tota l'app. */
  unitat: Unitat;
  /** Oli, sal, espècies…: surt a la llista però no suma al cost de compra. */
  rebost?: boolean;
  /** Peces que no es parteixen (ous, grans d'all…): a la recepta s'arrodoneixen cap amunt a l'enter. */
  indivisible?: boolean;
  /** Origen animal; sense valor, és d'origen vegetal (o mineral, com la sal). */
  origen?: OrigenAnimal;
  /** Al·lèrgens que conté (orientatiu: els productes envasats poden variar segons la marca). */
  alergens?: Alergen[];
  /** Secció del supermercat, per ordenar la llista de compra. */
  seccio?: string;
  /**
   * Conversions declarades: quantes unitats base equivalen a 1 de l'altra unitat.
   * Exemple: una ceba amb unitat 'g' i `{ u: 150 }` vol dir 1 u = 150 g.
   * Sense conversió declarada, no es converteix mai entre dimensions.
   */
  conversions?: Partial<Record<Unitat, number>>;
}

export interface LiniaRecepta {
  ingredientId: string;
  /** Quantitat entera per a les racions de la recepta. */
  quantitat: number;
  /** Si no s'indica, és la unitat base de l'ingredient. */
  unitat?: Unitat;
}

export interface Cronometre {
  /** Durada en segons. */
  segons: number;
  /** Nom curt que es mostra al cronòmetre (p. ex. «Bullir macarrons»). */
  nom: string;
}

/**
 * Un pas de la preparació.
 * Dins del text, `{ingredientId}` es substitueix per la quantitat escalada de l'ingredient
 * i `{ingredientId:1/2}` per una fracció d'aquesta quantitat.
 */
export interface Pas {
  text: string;
  cronometre?: Cronometre;
}

export type TipusRecepta = 'principal' | 'acompanyament' | 'ambdos';

export interface Recepta {
  id: string;
  nom: string;
  /** Racions per a les quals estan escrites les quantitats. */
  racions: number;
  tempsMinuts: number;
  /** Etiquetes alimentàries (p. ex. 'vegetaria', 'peix'). Llista encara oberta. */
  etiquetes: string[];
  ingredients: LiniaRecepta[];
  /**
   * 'principal' (per defecte) ocupa un àpat; 'acompanyament' (arròs blanc, patates…)
   * només surt al costat d'una principal que el demana; 'ambdos' (truita de patates)
   * pot ocupar un àpat o anar al costat d'una altra principal.
   */
  tipus?: TipusRecepta;
  /**
   * Quan fa de principal, es planifica amb un acompanyament (p. ex. carn arrebossada).
   * Una recepta 'ambdos' que fa d'acompanyament no en porta cap.
   */
  ambAcompanyament?: boolean;
  /**
   * Acompanyaments que admet aquesta principal (identificadors).
   * Si no s'indica, admet qualsevol acompanyament.
   */
  acompanyaments?: string[];
  /** Preparació pas a pas. */
  passos?: Pas[];
  /**
   * Aparells imprescindibles. Cada element és un aparell necessari, o una llista d'alternatives
   * (n'hi ha prou amb un): `['batedora', ['forn', 'fregidora-aire']]`.
   */
  aparells?: (Aparell | Aparell[])[];
}

/** Preu orientatiu i editable d'un paquet de compra. */
export interface Preu {
  ingredientId: string;
  /** Mida del paquet en la unitat base de l'ingredient (enter > 0). */
  midaPaquet: number;
  preuCentims: number;
  /** Producte del súper d'on surt el preu; sense producte, el preu és una estimació. */
  producte?: { id: string; nom: string };
}

export interface Persona {
  nom: string;
  /** Factor de gana en centèsimes (100 = normal). */
  ganaCentesimes: number;
}

/** Temps màxim per cuinar, en minuts, per a cada tipus de dia. `null` = sense límit. */
export interface TempsMaxim {
  /** De dilluns a divendres. */
  feiners: number | null;
  /** Dissabte i diumenge. */
  capDeSetmana: number | null;
}

export interface ConfiguracioFamilia {
  persones: Persona[];
  /** Ingredients que no poden aparèixer mai. */
  exclosos: string[];
  /** Dieta: cap recepta amb ingredients d'aquests orígens (vegetariana: carn i peix; vegana: tots). */
  origensExclosos: OrigenAnimal[];
  /** Al·lèrgens de la família: cap recepta amb un ingredient que en contingui no surt mai. */
  alergens: Alergen[];
  /** Totes les receptes triades han de tenir aquestes etiquetes (p. ex. 'vegetaria'). */
  etiquetesObligatories: string[];
  /** Cap recepta triada pot tenir aquestes etiquetes (p. ex. 'peix' per a «gens de peix»). */
  etiquetesExcloses: string[];
  /** Receptes amb aquestes etiquetes tenen més probabilitat de sortir. */
  etiquetesPreferides: string[];
  /** Receptes amb aquestes etiquetes surten menys (p. ex. 'peix' per a «poc peix»). */
  etiquetesEvitades: string[];
  /** Reparteix carn, peix, ou, llegums, pasta i arròs: mai el mateix grup dos àpats seguits si es pot evitar. */
  equilibrat: boolean;
  /** Els plats més barats surten més sovint. */
  economic: boolean;
  tempsMaximMinuts: TempsMaxim;
  /**
   * Pressupost per ració normal (gana 100) i àpat, en cèntims. `null` = sense límit.
   * Es compara amb el cost del que es menja (no amb el de compra, que inclou paquets sencers).
   */
  pressupostRacioCentims: number | null;
  /** Aparells que té la família. Sense indicar-ho, es consideren tots. */
  aparells?: Aparell[];
}

export type Dia = 'dl' | 'dt' | 'dc' | 'dj' | 'dv' | 'ds' | 'dg';
export type Apat = 'dinar' | 'sopar';

/** Quins àpats es planifiquen cada dia. */
export type Graella = Record<Dia, Record<Apat, boolean>>;

/** Qui menja en un àpat concret, si no és la família sencera. */
export interface Assistencia {
  /** Índexs (a `persones`) de qui no hi és. */
  absents: number[];
  /** Persones de fora de casa; mengen una ració normal. */
  convidats: number;
}

export interface ApatPlanificat {
  dia: Dia;
  apat: Apat;
  /** Data «AAAA-MM-DD», només en els menús d'un període llarg (mensual). */
  data?: string;
  receptaId: string;
  /** Només si la recepta principal demana acompanyament. */
  acompanyamentId?: string;
  /** Sense assistència, hi és tota la família. */
  assistencia?: Assistencia;
}

/** Avisos amb codi; el text en català és a `src/textos/ca.ts`. */
export type Avis =
  | { codi: 'cap-apat-marcat' }
  | { codi: 'cap-recepta-valida' }
  | { codi: 'receptes-repetides'; disponibles: number; necessaries: number }
  /** Imports per àpat de tota la família (mitjana de la setmana). */
  | { codi: 'pressupost-impossible'; pressupostApatCentims: number; minimApatCentims: number }
  | { codi: 'sense-preu'; ingredientIds: string[] };
