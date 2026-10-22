import { describe, expect, it } from 'vitest';
import { catalegInicial } from '../src/dades';
import {
  canviarPlat,
  configuracioDesDeRespostes,
  filtrarReceptari,
  filtrarReceptes,
  filtresReceptari,
  graellaPerDefecte,
  planificar,
  receptari,
  respostesPerDefecte,
  type ConfiguracioFamilia,
  type Valoracio,
} from '../src/domini';

const base = configuracioDesDeRespostes(respostesPerDefecte());
const amb = (valoracions: Record<string, Valoracio>): ConfiguracioFamilia => ({ ...base, valoracions });
const graella = graellaPerDefecte();
const plats = (configuracio: ConfiguracioFamilia, llavors = 150): string[] =>
  Array.from({ length: llavors }, (_, llavor) => planificar({ cataleg: catalegInicial, configuracio, graella, llavor }).apats.map((a) => a.receptaId)).flat();

// Plats que surten sovint amb la configuració per defecte (per notar-ne el canvi).
const habituals = (() => {
  const comptes = new Map<string, number>();
  for (const id of plats(base)) comptes.set(id, (comptes.get(id) ?? 0) + 1);
  return [...comptes.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);
})();

describe('plats valorats', () => {
  it('👎: no surt mai sol al menú', () => {
    const dolents = habituals.slice(0, 10);
    const configuracio = amb(Object.fromEntries(dolents.map((id) => [id, 'no-agrada' as const])));
    const surten = new Set(plats(configuracio, 60));
    for (const id of dolents) expect(surten.has(id), id).toBe(false);
  });

  it('👎: es pot continuar triant a mà (surt al receptari)', () => {
    const id = habituals[0]!;
    const configuracio = amb({ [id]: 'no-agrada' });
    expect(filtrarReceptes(catalegInicial, configuracio).some((r) => r.id === id)).toBe(true);
  });

  it('👍: surt més sovint', () => {
    const bons = habituals.slice(40, 60);
    const comptar = (c: ConfiguracioFamilia): number => plats(c, 200).filter((id) => bons.includes(id)).length;
    const abans = comptar(base);
    const despres = comptar(amb(Object.fromEntries(bons.map((id) => [id, 'agrada' as const]))));
    expect(despres).toBeGreaterThan(abans * 1.5);
  });

  it('«Tria’n un a l’atzar» no proposa un plat amb 👎', () => {
    const { apats } = planificar({ cataleg: catalegInicial, configuracio: base, graella, llavor: 3 });
    const configuracio = amb(Object.fromEntries(habituals.slice(0, 30).map((id) => [id, 'no-agrada' as const])));
    for (let llavor = 0; llavor < 30; llavor++) {
      const nou = canviarPlat(catalegInicial, configuracio, apats, 0, llavor)[0]!;
      expect(configuracio.valoracions?.[nou.receptaId]).not.toBe('no-agrada');
    }
  });

  it('si sense els 👎 algun àpat es quedaria sense plat, se’n fan servir', () => {
    const totes = Object.fromEntries(filtrarReceptes(catalegInicial, base).map((r) => [r.id, 'no-agrada' as const]));
    const pla = planificar({ cataleg: catalegInicial, configuracio: amb(totes), graella, llavor: 1 });
    expect(pla.apats).toHaveLength(14);
  });

  it('filtre del receptari «Els que ens encanten»', () => {
    const complet = receptari(catalegInicial, base);
    expect(filtresReceptari(catalegInicial, complet, {})).not.toContain('agrada');
    const valoracions = { [habituals[0]!]: 'agrada' as const, [habituals[1]!]: 'no-agrada' as const };
    expect(filtresReceptari(catalegInicial, complet, valoracions)).toContain('agrada');
    const ids = filtrarReceptari(catalegInicial, complet, 'agrada', valoracions).flatMap((s) => s.receptes.map((r) => r.id));
    expect(ids).toEqual([habituals[0]]);
  });
});
