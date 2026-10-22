import { describe, expect, it } from 'vitest';
import { catalegInicial } from '../src/dades';
import {
  canviarPlat,
  configuracioDesDeRespostes,
  conservarFixats,
  DIES_SENSE_REPETIR,
  diesDelMes,
  diesEntre,
  graellaPerDefecte,
  planificar,
  respostesPerDefecte,
  type ApatPlanificat,
} from '../src/domini';

const configuracio = configuracioDesDeRespostes(respostesPerDefecte());
const graella = graellaPerDefecte();
const menu = (llavor: number, dies?: ReturnType<typeof diesDelMes>): ApatPlanificat[] =>
  planificar({ cataleg: catalegInicial, configuracio, graella, llavor, ...(dies ? { dies } : {}) }).apats;
const fixar = (apats: ApatPlanificat[], indexs: number[]): ApatPlanificat[] =>
  apats.map((a, i) => (indexs.includes(i) ? { ...a, fixat: true } : a));

describe('plats fixats', () => {
  it('es mantenen al mateix àpat quan es torna a fer el menú', () => {
    for (let llavor = 0; llavor < 20; llavor++) {
      const abans = fixar(menu(llavor), [0, 5, 13]);
      const despres = conservarFixats(catalegInicial, configuracio, menu(llavor + 1000), abans, llavor);
      for (const i of [0, 5, 13]) {
        expect(despres[i]).toMatchObject({ receptaId: abans[i]!.receptaId, fixat: true });
        expect(despres[i]!.acompanyamentId).toBe(abans[i]!.acompanyamentId);
      }
      expect(despres.filter((a) => a.fixat)).toHaveLength(3);
    }
  });

  it('cap altre àpat de la setmana repeteix un plat fixat', () => {
    for (let llavor = 0; llavor < 20; llavor++) {
      const abans = fixar(menu(llavor), [2, 9]);
      // Força la repetició: el menú nou ja té els plats fixats en altres àpats.
      const nou = menu(llavor + 1000).map((a, i) => (i === 4 ? { ...a, receptaId: abans[2]!.receptaId } : i === 11 ? { ...a, receptaId: abans[9]!.receptaId } : a));
      const despres = conservarFixats(catalegInicial, configuracio, nou, abans, llavor);
      const fixats = new Set(despres.filter((a) => a.fixat).map((a) => a.receptaId));
      expect(despres.filter((a) => !a.fixat && fixats.has(a.receptaId))).toEqual([]);
    }
  });

  it('en el mensual, el plat fixat no es repeteix a prop', () => {
    const dies = diesDelMes('2026-11');
    const abans = fixar(menu(3, dies), [10]);
    const despres = conservarFixats(catalegInicial, configuracio, menu(7, dies), abans, 3);
    const f = despres[10]!;
    expect(f).toMatchObject({ receptaId: abans[10]!.receptaId, fixat: true });
    for (const a of despres) {
      if (a !== f && a.receptaId === f.receptaId) expect(Math.abs(diesEntre(a.data!, f.data!))).toBeGreaterThan(DIES_SENSE_REPETIR);
    }
  });

  it('sense plats fixats, el menú nou no canvia', () => {
    const nou = menu(5);
    expect(conservarFixats(catalegInicial, configuracio, nou, menu(4), 1)).toEqual(nou);
  });

  it('canviar el plat d’un àpat fixat el manté fixat', () => {
    const abans = fixar(menu(1), [3]);
    expect(canviarPlat(catalegInicial, configuracio, abans, 3, 9)[3]!.fixat).toBe(true);
  });
});
