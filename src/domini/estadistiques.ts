import type { Cataleg } from './cataleg';
import { sumarDies } from './calendari';

// Rètol de xifres i novetats que es desplaça a dalt del menú.
// Les receptes es compten del catàleg; els usuaris i els menús fets venen del compte (Supabase), si hi són.

/** Una novetat de l'app. `data` en format «AAAA-MM-DD». */
export interface Novetat {
  data: string;
  text: string;
}

/** Xifres generals que torna Supabase (funció `estadistiques_app`). */
export interface Estadistiques {
  usuaris: number;
  menus: number;
}

export interface XifresCataleg {
  /** Plats principals (també els de doble ús, com la truita). */
  plats: number;
  acompanyaments: number;
  salses: number;
}

export function xifresCataleg(cataleg: Cataleg): XifresCataleg {
  const xifres: XifresCataleg = { plats: 0, acompanyaments: 0, salses: 0 };
  for (const r of cataleg.receptes.values()) {
    if (r.tipus === 'salsa') xifres.salses += 1;
    else if (r.tipus === 'acompanyament') xifres.acompanyaments += 1;
    else xifres.plats += 1;
  }
  return xifres;
}

/** Identifica una novetat (per recordar quina és l'última que s'ha vist). */
export const clauNovetat = (n: Novetat): string => `${n.data} ${n.text}`;

/** Quants dies es mostra una novetat al rètol. */
export const DIES_NOVETAT = 30;

/** Màxim de novetats al rètol (la resta, a la llista que s'obre en tocar-lo). */
export const MAX_NOVETATS_ROTOL = 4;

/**
 * Novetats que surten al rètol: les més noves que l'última vista, de fa menys de `DIES_NOVETAT` dies,
 * com a molt `MAX_NOVETATS_ROTOL`. `novetats` va de la més nova a la més vella.
 */
export function novetatsPerMostrar(novetats: readonly Novetat[], vista: string | null, avui: string): Novetat[] {
  const limit = sumarDies(avui, -DIES_NOVETAT);
  const index = vista === null ? -1 : novetats.findIndex((n) => clauNovetat(n) === vista);
  const noves = index === -1 ? novetats : novetats.slice(0, index);
  return noves.filter((n) => n.data >= limit && n.data <= avui).slice(0, MAX_NOVETATS_ROTOL);
}

/** Llegeix les xifres que torna Supabase; si no tenen la forma esperada, `null`. */
export function llegirEstadistiques(valor: unknown): Estadistiques | null {
  if (typeof valor !== 'object' || valor === null) return null;
  const { usuaris, menus } = valor as Record<string, unknown>;
  const enter = (v: unknown): number | null => {
    const n = typeof v === 'string' ? Number(v) : v;
    return typeof n === 'number' && Number.isInteger(n) && n >= 0 ? n : null;
  };
  const u = enter(usuaris);
  const m = enter(menus);
  return u === null || m === null ? null : { usuaris: u, menus: m };
}
