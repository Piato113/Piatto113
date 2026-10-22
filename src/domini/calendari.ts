import type { Dia } from './tipus';

// Dates del menú mensual, sempre com a text «AAAA-MM-DD» (sense hores ni zones horàries).

/** Un dia del calendari amb el seu dia de la setmana. */
export interface DiaCalendari {
  data: string;
  dia: Dia;
}

/** Dia de la setmana de cada `getUTCDay()` (0 = diumenge). */
const PER_NUMERO: readonly Dia[] = ['dg', 'dl', 'dt', 'dc', 'dj', 'dv', 'ds'];

const dosXifres = (n: number): string => String(n).padStart(2, '0');

/** «2026-11-03» a partir d'any, mes (1-12) i dia. */
export const textData = (any: number, mes: number, dia: number): string => `${any}-${dosXifres(mes)}-${dosXifres(dia)}`;

/** Any, mes (1-12) i dia d'una data «AAAA-MM-DD»; `null` si no és vàlida. */
export function llegirData(data: string): { any: number; mes: number; dia: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data);
  if (!m) return null;
  const [any, mes, dia] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(Date.UTC(any, mes - 1, dia));
  if (d.getUTCFullYear() !== any || d.getUTCMonth() !== mes - 1 || d.getUTCDate() !== dia) return null;
  return { any, mes, dia };
}

export const esData = (data: unknown): data is string => typeof data === 'string' && llegirData(data) !== null;

/** «2026-11» a partir d'una data o d'any i mes. */
export const textMes = (any: number, mes: number): string => `${any}-${dosXifres(mes)}`;

/** Any i mes d'un text «AAAA-MM»; `null` si no és vàlid. */
export function llegirMes(text: string): { any: number; mes: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(text);
  if (!m) return null;
  const any = Number(m[1]);
  const mes = Number(m[2]);
  return mes >= 1 && mes <= 12 ? { any, mes } : null;
}

export const diesDelMesNombre = (any: number, mes: number): number => new Date(Date.UTC(any, mes, 0)).getUTCDate();

export function diaDeLaSetmana(data: string): Dia {
  const d = llegirData(data);
  if (!d) throw new Error(`Data no vàlida: ${data}`);
  return PER_NUMERO[new Date(Date.UTC(d.any, d.mes - 1, d.dia)).getUTCDay()]!;
}

/** Mes següent d'un «AAAA-MM». */
export function mesSeguent(text: string): string {
  const m = llegirMes(text);
  if (!m) throw new Error(`Mes no vàlid: ${text}`);
  return m.mes === 12 ? textMes(m.any + 1, 1) : textMes(m.any, m.mes + 1);
}

/**
 * Dies d'un mes, del primer a l'últim; si `desDe` és d'aquell mateix mes, des d'aquell dia
 * (per no planificar els dies que ja han passat).
 */
export function diesDelMes(mes: string, desDe?: string): DiaCalendari[] {
  const m = llegirMes(mes);
  if (!m) return [];
  const inici = desDe?.startsWith(`${mes}-`) ? (llegirData(desDe)?.dia ?? 1) : 1;
  const dies: DiaCalendari[] = [];
  for (let d = inici; d <= diesDelMesNombre(m.any, m.mes); d++) {
    const data = textData(m.any, m.mes, d);
    dies.push({ data, dia: diaDeLaSetmana(data) });
  }
  return dies;
}

/** Dies entre dues dates (b − a). */
export function diesEntre(a: string, b: string): number {
  const da = llegirData(a);
  const db = llegirData(b);
  if (!da || !db) return 0;
  return Math.round((Date.UTC(db.any, db.mes - 1, db.dia) - Date.UTC(da.any, da.mes - 1, da.dia)) / 86_400_000);
}

/** Dilluns de la setmana d'una data (les setmanes comencen en dilluns). */
export function dillunsDe(data: string): string {
  const d = llegirData(data);
  if (!d) throw new Error(`Data no vàlida: ${data}`);
  const t = new Date(Date.UTC(d.any, d.mes - 1, d.dia));
  const desplacament = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - desplacament);
  return textData(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
}

/** Data `n` dies després (o abans, si és negatiu). */
export function sumarDies(data: string, n: number): string {
  const d = llegirData(data);
  if (!d) throw new Error(`Data no vàlida: ${data}`);
  const t = new Date(Date.UTC(d.any, d.mes - 1, d.dia + n));
  return textData(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
}

/** Data d'avui al dispositiu, «AAAA-MM-DD». */
export function avui(ara: Date = new Date()): string {
  return textData(ara.getFullYear(), ara.getMonth() + 1, ara.getDate());
}
