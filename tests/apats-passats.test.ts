import { describe, expect, it } from 'vitest';
import { catalegInicial } from '../src/dades';
import {
  configuracioDesDeRespostes,
  dataApat,
  diesDelMes,
  graellaPerDefecte,
  mantenirMenu,
  planificar,
  respostesPerDefecte,
  type ApatPlanificat,
} from '../src/domini';

const configuracio = configuracioDesDeRespostes(respostesPerDefecte());
const graella = graellaPerDefecte();
const setmana = (llavor: number): ApatPlanificat[] => planificar({ cataleg: catalegInicial, configuracio, graella, llavor }).apats;
const AVUI = '2026-10-22'; // dijous

describe('en tornar a fer el menú, el que ja s’ha menjat no canvia', () => {
  it('setmanal: els àpats de dilluns a dimecres es mantenen', () => {
    for (let llavor = 0; llavor < 20; llavor++) {
      const abans = { creat: '2026-10-19', apats: setmana(llavor) };
      const despres = mantenirMenu(catalegInicial, configuracio, setmana(llavor + 500), { creat: AVUI }, abans, AVUI, llavor, false);
      expect(despres).toHaveLength(14);
      for (let i = 0; i < 6; i++) expect(despres[i]).toEqual(abans.apats[i]);
      // Cap àpat de la resta de la setmana repeteix un plat ja menjat, i no queda res marcat com a fixat.
      const menjats = new Set(abans.apats.slice(0, 6).map((a) => a.receptaId));
      expect(despres.slice(6).filter((a) => menjats.has(a.receptaId))).toEqual([]);
      expect(despres.some((a) => a.fixat)).toBe(false);
    }
  });

  it('setmanal d’una altra setmana: es fa sencer de nou', () => {
    const abans = { creat: '2026-10-12', apats: setmana(1) };
    const nous = setmana(2);
    expect(mantenirMenu(catalegInicial, configuracio, nous, { creat: AVUI }, abans, AVUI, 1, false)).toEqual(nous);
  });

  it('mensual: els dies que ja han passat es posen al davant tal com eren', () => {
    const abans = {
      periode: 'mes' as const,
      mes: '2026-10',
      creat: '2026-10-01',
      apats: planificar({ cataleg: catalegInicial, configuracio, graella, llavor: 3, dies: diesDelMes('2026-10', '2026-10-01') }).apats,
    };
    const nous = planificar({ cataleg: catalegInicial, configuracio, graella, llavor: 9, dies: diesDelMes('2026-10', AVUI) }).apats;
    const despres = mantenirMenu(catalegInicial, configuracio, nous, { periode: 'mes', mes: '2026-10', creat: AVUI }, abans, AVUI, 9, false);
    const passats = abans.apats.filter((a) => a.data! < AVUI);
    expect(despres.slice(0, passats.length)).toEqual(passats);
    expect(despres).toHaveLength(passats.length + nous.length);
    expect(despres.every((a, i) => i === 0 || a.data! >= despres[i - 1]!.data!)).toBe(true);
  });

  it('els fixats que ja han passat es queden fixats', () => {
    const vells = setmana(4).map((a, i) => (i === 1 ? { ...a, fixat: true } : a));
    const despres = mantenirMenu(catalegInicial, configuracio, setmana(5), { creat: AVUI }, { creat: '2026-10-20', apats: vells }, AVUI, 4, true);
    expect(despres[1]).toEqual(vells[1]);
  });

  it('data dels àpats del menú setmanal', () => {
    expect(dataApat({ dia: 'dc', apat: 'sopar', receptaId: 'x' }, { creat: AVUI })).toBe('2026-10-21');
    expect(dataApat({ dia: 'dl', apat: 'sopar', receptaId: 'x' }, {})).toBeUndefined();
  });
});
