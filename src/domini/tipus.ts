// Tipus del domini. Tot és dada pura: sense interfície ni emmagatzematge.
//
// Convencions:
// - Quantitats en la unitat base de l'ingredient i en nombres enters.
// - Diners en cèntims enters.
// - Factors (gana) en centèsimes enteres: 100 = normal, 125 = menja un 25 % més.

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
   * només surt al costat d'una principal que el demana.
   */
  tipus?: 'principal' | 'acompanyament';
  /** La principal es planifica amb un acompanyament (p. ex. carn arrebossada). */
  ambAcompanyament?: boolean;
  /** Preparació pas a pas. */
  passos?: Pas[];
}

/** Preu orientatiu i editable d'un paquet de compra. */
export interface Preu {
  ingredientId: string;
  /** Mida del paquet en la unitat base de l'ingredient (enter > 0). */
  midaPaquet: number;
  preuCentims: number;
}

export interface Persona {
  nom: string;
  /** Factor de gana en centèsimes (100 = normal). */
  ganaCentesimes: number;
}

export interface ConfiguracioFamilia {
  persones: Persona[];
  /** Ingredients que no poden aparèixer mai. */
  exclosos: string[];
  /** Totes les receptes triades han de tenir aquestes etiquetes (p. ex. 'vegetaria'). */
  etiquetesObligatories: string[];
  /** Receptes amb aquestes etiquetes tenen més probabilitat de sortir. */
  etiquetesPreferides: string[];
  /** Temps màxim per cuinar, en minuts. `null` = sense límit. */
  tempsMaximMinuts: number | null;
  /** Pressupost setmanal en cèntims. `null` = sense límit. */
  pressupostCentims: number | null;
}

export type Dia = 'dl' | 'dt' | 'dc' | 'dj' | 'dv' | 'ds' | 'dg';
export type Apat = 'dinar' | 'sopar';

/** Quins àpats es planifiquen cada dia. */
export type Graella = Record<Dia, Record<Apat, boolean>>;

export interface ApatPlanificat {
  dia: Dia;
  apat: Apat;
  receptaId: string;
  /** Només si la recepta principal demana acompanyament. */
  acompanyamentId?: string;
}

/** Avisos amb codi; el text en català és a `src/textos/ca.ts`. */
export type Avis =
  | { codi: 'cap-apat-marcat' }
  | { codi: 'cap-recepta-valida' }
  | { codi: 'receptes-repetides'; disponibles: number; necessaries: number }
  | { codi: 'pressupost-impossible'; pressupostCentims: number; minimCentims: number }
  | { codi: 'sense-preu'; ingredientIds: string[] };
