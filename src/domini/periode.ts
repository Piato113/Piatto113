import { dillunsDe } from './calendari';
import type { Cataleg } from './cataleg';
import { avaluarMenu } from './planificador';
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
