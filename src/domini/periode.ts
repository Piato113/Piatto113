import { dillunsDe, sumarDies } from './calendari';
import type { Cataleg } from './cataleg';
import { DIES } from './graella';
import { avaluarMenu, conservarFixats } from './planificador';
import type { ApatPlanificat, ConfiguracioFamilia } from './tipus';

/** Una setmana d'un menú llarg: el dilluns i els índexs dels seus àpats (en ordre). */
export interface SetmanaMenu {
  dilluns: string;
  indexs: number[];
}

/**
 * Agrupa els àpats per setmanes (de dilluns a diumenge). Un menú setmanal (sense dates) és una sola setmana,
 * amb `dilluns` buit.
 */
export function setmanesDelMenu(apats: readonly ApatPlanificat[]): SetmanaMenu[] {
  const setmanes: SetmanaMenu[] = [];
  apats.forEach((a, i) => {
    const dilluns = a.data ? dillunsDe(a.data) : '';
    const ultima = setmanes.at(-1);
    if (ultima && ultima.dilluns === dilluns) ultima.indexs.push(i);
    else setmanes.push({ dilluns, indexs: [i] });
  });
  return setmanes;
}

/**
 * Quant costaria comprar setmana a setmana (paquets sencers cada setmana) i quant comprant-ho tot d'un cop.
 * La diferència és el que s'estalvia aprofitant els paquets oberts d'una setmana a l'altra.
 */
export function estalviCompraPeriode(
  cataleg: Cataleg,
  configuracio: ConfiguracioFamilia,
  apats: readonly ApatPlanificat[],
): { setmanalCentims: number; totCentims: number; estalviCentims: number } {
  const totCentims = avaluarMenu(cataleg, configuracio, apats).llista.totalCompraCentims;
  const setmanalCentims = setmanesDelMenu(apats).reduce(
    (s, setmana) =>
      s + avaluarMenu(cataleg, configuracio, setmana.indexs.map((i) => apats[i]!)).llista.totalCompraCentims,
    0,
  );
  return { setmanalCentims, totCentims, estalviCentims: Math.max(0, setmanalCentims - totCentims) };
}

/** Dades d'un menú que diuen de quin període és. */
export interface IdentitatMenu {
  periode?: 'setmana' | 'mes';
  /** «AAAA-MM» del menú mensual. */
  mes?: string;
  /** «AAAA-MM-DD» del dia que es va fer. */
  creat?: string;
}

/**
 * Període que cobreix un menú: el mes, en el mensual; la setmana en què es va fer, en el setmanal.
 * `null` si no se sap (menús antics sense data).
 */
export function clauPeriode(m: IdentitatMenu): string | null {
  if (m.periode === 'mes') return m.mes ? `mes:${m.mes}` : null;
  return m.creat ? `setmana:${dillunsDe(m.creat)}` : null;
}

/**
 * En fer un menú nou, l'actual passa a ser l'anterior només si és d'un altre període
 * (tornar a fer el menú del mateix mes o de la mateixa setmana no esborra l'anterior de debò).
 */
export function esPeriodeNou(actual: IdentitatMenu, nou: IdentitatMenu): boolean {
  const a = clauPeriode(actual);
  return a === null || a !== clauPeriode(nou);
}

/** Dies (dates diferents) d'un menú amb data que encara no han passat, des d'avui inclòs. */
export function diesQueQueden(apats: readonly ApatPlanificat[], avui: string): number {
  return new Set(apats.flatMap((a) => (a.data && a.data >= avui ? [a.data] : []))).size;
}

/** Data d'un àpat: la seva (menú mensual) o, en el setmanal, la del seu dia dins la setmana en què es va fer el menú. */
export function dataApat(a: ApatPlanificat, m: IdentitatMenu): string | undefined {
  if (a.data) return a.data;
  return m.periode !== 'mes' && m.creat ? sumarDies(dillunsDe(m.creat), DIES.indexOf(a.dia)) : undefined;
}

const clauApat = (a: ApatPlanificat): string => `${a.dia}|${a.apat}|${a.data ?? ''}`;

/**
 * Ajusta un menú que s'acaba de tornar a fer amb el que hi havia abans:
 * - Si és del mateix període (la mateixa setmana o el mateix mes), els àpats que ja han passat no canvien: ja s'han menjat
 *   (i s'han pogut valorar). En el mensual, els dies passats no es tornen a planificar i es posen al davant.
 * - Si `mantenirFixats`, els plats fixats es mantenen.
 * Els àpats nous que repetirien massa a prop un plat passat o fixat es canvien per un altre.
 */
export function mantenirMenu(
  cataleg: Cataleg,
  configuracio: ConfiguracioFamilia,
  nous: readonly ApatPlanificat[],
  menuNou: IdentitatMenu,
  anterior: (IdentitatMenu & { apats: readonly ApatPlanificat[] }) | null,
  avui: string,
  llavor: number,
  mantenirFixats: boolean,
): ApatPlanificat[] {
  if (!anterior) return [...nous];
  const mateixPeriode = !esPeriodeNou(anterior, menuNou);
  const passats = mateixPeriode
    ? anterior.apats.filter((a) => {
        const data = dataApat(a, anterior);
        return data !== undefined && data < avui;
      })
    : [];
  const fixats = mantenirFixats ? anterior.apats.filter((a) => a.fixat && !passats.includes(a)) : [];
  if (passats.length === 0 && fixats.length === 0) return [...nous];
  const clausNoves = new Set(nous.map(clauApat));
  const davant = passats.filter((a) => a.data !== undefined && !clausNoves.has(clauApat(a)));
  const referencia = [...passats.map((a) => ({ ...a, fixat: true })), ...fixats];
  const resultat = conservarFixats(cataleg, configuracio, [...davant, ...nous], referencia, llavor);
  // Els passats es marquen com a fixats només per mantenir-los: es torna a deixar com estaven.
  const eraFixat = new Set(anterior.apats.filter((a) => a.fixat).map(clauApat));
  return resultat.map((a) => {
    if (!a.fixat || eraFixat.has(clauApat(a))) return a;
    const { fixat: _treta, ...sense } = a;
    return sense;
  });
}
