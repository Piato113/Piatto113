import {
  ALERGENS,
  APATS,
  DIES,
  esData,
  graellaPerDefecte,
  llegirMes,
  llegirRespostes,
  type ApatPlanificat,
  type Avis,
  type Cataleg,
  type Graella,
  type RespostesQuestionari,
  type Valoracio,
  VALORACIONS,
} from '../domini';

// Desa les dades en aquest dispositiu (localStorage). Amb sessió iniciada, també es copien al núvol
// (vegeu nuvol.ts): aquí només s'avisa de cada canvi amb `quanEsDesi`.
// El navegador pot no deixar guardar (navegació privada, dades esborrades): l'app funciona igualment.

/** Dades que es desen al compte; cadascuna és una columna de la taula `dades_usuari`. */
export type Columna = 'respostes' | 'graella' | 'menu' | 'compra' | 'valoracions';
export const COLUMNES: readonly Columna[] = ['respostes', 'graella', 'menu', 'compra', 'valoracions'];

const CLAU = 'piatto113:respostes:v1';
const CLAU_MENU = 'piatto113:menu:v1';
const CLAU_GRAELLA = 'piatto113:graella:v1';
const CLAU_COMPRA = 'piatto113:compra:v1';
const CLAU_VALORACIONS = 'piatto113:valoracions:v1';

const CLAUS: Record<Columna, string> = {
  respostes: CLAU,
  graella: CLAU_GRAELLA,
  menu: CLAU_MENU,
  compra: CLAU_COMPRA,
  valoracions: CLAU_VALORACIONS,
};

let enDesar: ((columna: Columna) => void) | null = null;

/** Funció que es crida cada vegada que l'app desa una dada (per copiar-la al núvol). */
export function quanEsDesi(f: ((columna: Columna) => void) | null): void {
  enDesar = f;
}

function desar(columna: Columna, valor: unknown): void {
  try {
    window.localStorage.setItem(CLAUS[columna], JSON.stringify(valor));
  } catch {
    // Sense emmagatzematge: les dades només duren mentre la pàgina és oberta.
  }
  enDesar?.(columna);
}

/** Dades desades tal com són (sense validar), per enviar-les al núvol. Les que falten són `null`. */
export function llegirDades(): Record<Columna, unknown> {
  const dades = { respostes: null, graella: null, menu: null, compra: null, valoracions: null } as Record<Columna, unknown>;
  for (const c of COLUMNES) {
    try {
      const text = window.localStorage.getItem(CLAUS[c]);
      dades[c] = text ? JSON.parse(text) : null;
    } catch {
      dades[c] = null;
    }
  }
  return dades;
}

/** Desa dades que vénen del núvol, sense tornar-les a enviar. Les funcions `carregar…` les validen en llegir-les. */
export function posarDades(dades: Partial<Record<Columna, unknown>>): void {
  for (const c of COLUMNES) {
    if (!(c in dades)) continue;
    try {
      const valor = dades[c];
      if (valor === null || valor === undefined) window.localStorage.removeItem(CLAUS[c]);
      else window.localStorage.setItem(CLAUS[c], JSON.stringify(valor));
    } catch {
      // Sense emmagatzematge.
    }
  }
}

/** Esborra les dades d'aquest dispositiu (en tancar la sessió). */
export function esborrarDades(): void {
  posarDades({ respostes: null, graella: null, menu: null, compra: null, valoracions: null });
}

export function carregarRespostes(): RespostesQuestionari | null {
  try {
    const text = window.localStorage.getItem(CLAU);
    return text ? llegirRespostes(JSON.parse(text), ALERGENS) : null;
  } catch {
    return null;
  }
}

export function desarRespostes(respostes: RespostesQuestionari): void {
  desar('respostes', respostes);
}

// ——— Menú de la setmana ———


export interface MenuDesat {
  /** Respostes amb què es va fer (en JSON): si canvien, el menú es torna a fer. */
  signatura: string;
  llavor: number;
  graella: Graella;
  apats: ApatPlanificat[];
  avisos: Avis[];
  /** Menú d'una setmana (per defecte) o d'un mes sencer. */
  periode?: PeriodeMenu;
  /** Mes del menú mensual, «AAAA-MM». */
  mes?: string;
  /** Dia que es va fer, «AAAA-MM-DD» (els menús antics no en tenen). */
  creat?: string;
  /** Menú del període anterior, per poder-lo seguir mentre s'acaba (sense el seu propi anterior). */
  anterior?: MenuAnterior;
}

export type MenuAnterior = Omit<MenuDesat, 'anterior'>;

export type PeriodeMenu = 'setmana' | 'mes';

function llegirGraella(valor: unknown): Graella | null {
  if (typeof valor !== 'object' || valor === null) return null;
  const v = valor as Record<string, unknown>;
  const graella = graellaPerDefecte();
  for (const dia of DIES) {
    const d = v[dia] as Record<string, unknown> | undefined;
    if (typeof d !== 'object' || d === null) return null;
    for (const apat of APATS) {
      if (typeof d[apat] !== 'boolean') return null;
      graella[dia][apat] = d[apat] as boolean;
    }
  }
  return graella;
}

export function carregarGraella(): Graella {
  try {
    const text = window.localStorage.getItem(CLAU_GRAELLA);
    return (text && llegirGraella(JSON.parse(text))) || graellaPerDefecte();
  } catch {
    return graellaPerDefecte();
  }
}

export function desarGraella(graella: Graella): void {
  desar('graella', graella);
}

/** Menú desat, si és vàlid amb el catàleg actual (les receptes poden haver canviat entre versions). */
export function carregarMenu(cataleg: Cataleg): MenuDesat | null {
  try {
    const text = window.localStorage.getItem(CLAU_MENU);
    if (!text) return null;
    const v = JSON.parse(text) as Partial<MenuDesat>;
    const menu = llegirMenu(v, cataleg);
    if (!menu) return null;
    // Si el menú anterior ja no és vàlid (p. ex. una recepta que ja no hi és), es perd només l'anterior.
    const anterior = typeof v.anterior === 'object' && v.anterior !== null ? llegirMenu(v.anterior, cataleg) : null;
    return anterior ? { ...menu, anterior } : menu;
  } catch {
    return null;
  }
}

function llegirMenu(v: Partial<MenuDesat>, cataleg: Cataleg): MenuAnterior | null {
  try {
    const graella = llegirGraella(v.graella);
    if (typeof v.signatura !== 'string' || typeof v.llavor !== 'number' || !graella || !Array.isArray(v.apats)) return null;
    const valids = v.apats.every(
      (a) =>
        DIES.includes(a.dia) &&
        APATS.includes(a.apat) &&
        cataleg.receptes.has(a.receptaId) &&
        (a.acompanyamentId === undefined || cataleg.receptes.has(a.acompanyamentId)) &&
        (a.data === undefined || esData(a.data)),
    );
    if (!valids) return null;
    // Convidats i absències: si no tenen la forma esperada, es descarten (hi és tota la família).
    const apats = v.apats.map((a) => {
      const { assistencia, ...sense } = a;
      const valida =
        typeof assistencia === 'object' &&
        assistencia !== null &&
        Array.isArray(assistencia.absents) &&
        assistencia.absents.every((i) => Number.isInteger(i)) &&
        Number.isInteger(assistencia.convidats);
      const { fixat, ...net } = sense;
      const base = fixat === true ? { ...net, fixat: true } : net;
      return valida ? { ...base, assistencia: { absents: [...assistencia.absents], convidats: assistencia.convidats } } : base;
    });
    const menu: MenuAnterior = { signatura: v.signatura, llavor: v.llavor, graella, apats, avisos: Array.isArray(v.avisos) ? v.avisos : [] };
    if (typeof v.creat === 'string' && esData(v.creat)) menu.creat = v.creat;
    // Menú mensual: cal el mes i que tots els àpats tinguin data; si no, es tracta com un de setmanal nou.
    if (v.periode === 'mes') {
      if (typeof v.mes !== 'string' || !llegirMes(v.mes) || !apats.every((a) => a.data !== undefined)) return null;
      return { ...menu, periode: 'mes', mes: v.mes };
    }
    return menu;
  } catch {
    return null;
  }
}

export function desarMenu(menu: MenuDesat): void {
  desar('menu', menu);
}

// ——— Productes marcats a la llista de la compra ———

/** Estat de la llista de la compra: què ja és al carro i què ja es té a casa. */
export interface EstatCompra {
  marcats: Set<string>;
  tinc: Set<string>;
}

const textos_ = (v: unknown): Set<string> => new Set(Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

/** Estat de la llista, si és de la mateixa llista (`signatura`); si la llista ha canviat, buit. */
export function carregarCompra(signatura: string): EstatCompra {
  try {
    const text = window.localStorage.getItem(CLAU_COMPRA);
    if (!text) return { marcats: new Set(), tinc: new Set() };
    const v = JSON.parse(text) as { signatura?: unknown; marcats?: unknown; tinc?: unknown };
    if (v.signatura !== signatura) return { marcats: new Set(), tinc: new Set() };
    return { marcats: textos_(v.marcats), tinc: textos_(v.tinc) };
  } catch {
    return { marcats: new Set(), tinc: new Set() };
  }
}

export function desarCompra(signatura: string, estat: EstatCompra): void {
  desar('compra', { signatura, marcats: [...estat.marcats], tinc: [...estat.tinc] });
}

// ——— Plats valorats (👍 / 👎) ———

/** Valoracions desades, per identificador de recepta (només les vàlides i de receptes que existeixen). */
export function carregarValoracions(cataleg: Cataleg): Record<string, Valoracio> {
  try {
    const text = window.localStorage.getItem(CLAU_VALORACIONS);
    const v = text ? (JSON.parse(text) as unknown) : null;
    if (typeof v !== 'object' || v === null || Array.isArray(v)) return {};
    const resultat: Record<string, Valoracio> = {};
    for (const [id, valor] of Object.entries(v as Record<string, unknown>)) {
      if (cataleg.receptes.has(id) && VALORACIONS.includes(valor as Valoracio)) resultat[id] = valor as Valoracio;
    }
    return resultat;
  } catch {
    return {};
  }
}

export function desarValoracions(valoracions: Readonly<Record<string, Valoracio>>): void {
  desar('valoracions', valoracions);
}
