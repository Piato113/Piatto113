import { describe, expect, it } from 'vitest';
import { catalegInicial } from '../src/dades';
import {
  APARELLS,
  calBarbacoa,
  canviarPlat,
  configuracioDesDeRespostes,
  diesDelMes,
  esCapDeSetmana,
  filtrarReceptari,
  graellaPerDefecte,
  opcionsDePlat,
  planificar,
  receptari,
  respostesPerDefecte,
  type Graella,
  type RespostesQuestionari,
} from '../src/domini';

const ambBarbacoa = (canvis: Partial<RespostesQuestionari> = {}) =>
  configuracioDesDeRespostes({ ...respostesPerDefecte(), temps: 'sense-limit', aparells: [...APARELLS], ...canvis });
const receptes = [...catalegInicial.receptes.values()];
const deBarbacoa = receptes.filter(calBarbacoa);

/** Graella amb sopar cada dia, perquè hi hagi àpats entre setmana i en cap de setmana. */
const totsElsDies = (): Graella => {
  const g = graellaPerDefecte();
  for (const dia of Object.keys(g) as (keyof Graella)[]) g[dia] = { dinar: true, sopar: true };
  return g;
};

describe('barbacoa', () => {
  it('hi ha entre 40 i 50 receptes de barbacoa i 14 salses', () => {
    expect(deBarbacoa.length).toBeGreaterThanOrEqual(40);
    expect(deBarbacoa.length).toBeLessThanOrEqual(50);
    expect(receptes.filter((r) => r.tipus === 'salsa')).toHaveLength(14);
  });

  it('sense barbacoa (per defecte) no en surt cap', () => {
    const pla = planificar({ cataleg: catalegInicial, configuracio: configuracioDesDeRespostes(respostesPerDefecte()), graella: totsElsDies(), llavor: 3 });
    expect(pla.apats.some((a) => calBarbacoa(catalegInicial.receptes.get(a.receptaId)!))).toBe(false);
  });

  it('els plats de barbacoa només surten en cap de setmana', () => {
    let alguna = 0;
    for (let llavor = 0; llavor < 40; llavor++) {
      const pla = planificar({ cataleg: catalegInicial, configuracio: ambBarbacoa(), graella: totsElsDies(), llavor });
      for (const a of pla.apats) {
        const r = catalegInicial.receptes.get(a.receptaId)!;
        if (!calBarbacoa(r)) continue;
        alguna++;
        expect(esCapDeSetmana(a.dia), `${r.id} el ${a.dia}`).toBe(true);
      }
    }
    expect(alguna).toBeGreaterThan(0);
  });

  it('també en el menú mensual i en canviar un plat a l’atzar', () => {
    const pla = planificar({ cataleg: catalegInicial, configuracio: ambBarbacoa(), graella: totsElsDies(), llavor: 5, dies: diesDelMes('2026-11') });
    for (const a of pla.apats) if (calBarbacoa(catalegInicial.receptes.get(a.receptaId)!)) expect(esCapDeSetmana(a.dia)).toBe(true);
    const index = pla.apats.findIndex((a) => !esCapDeSetmana(a.dia));
    for (let llavor = 0; llavor < 30; llavor++) {
      const apats = canviarPlat(catalegInicial, ambBarbacoa(), pla.apats, index, llavor);
      expect(calBarbacoa(catalegInicial.receptes.get(apats[index]!.receptaId)!)).toBe(false);
    }
  });

  it('els acompanyaments de brasa només van amb plats de brasa', () => {
    for (let llavor = 0; llavor < 40; llavor++) {
      const pla = planificar({ cataleg: catalegInicial, configuracio: ambBarbacoa(), graella: totsElsDies(), llavor });
      for (const a of pla.apats) {
        if (!a.acompanyamentId) continue;
        const acompanyament = catalegInicial.receptes.get(a.acompanyamentId)!;
        if (calBarbacoa(acompanyament)) expect(calBarbacoa(catalegInicial.receptes.get(a.receptaId)!), a.receptaId).toBe(true);
      }
    }
  });

  it('a mà es poden triar entre setmana, amb un avís', () => {
    const pla = planificar({ cataleg: catalegInicial, configuracio: ambBarbacoa(), graella: totsElsDies(), llavor: 1 });
    const index = pla.apats.findIndex((a) => a.dia === 'dt');
    const opcions = opcionsDePlat(catalegInicial, ambBarbacoa(), pla.apats, index);
    const brasa = opcions.filter((o) => calBarbacoa(o.recepta));
    expect(brasa.length).toBeGreaterThan(30);
    expect(brasa.every((o) => o.barbacoaEntreSetmana)).toBe(true);
    expect(opcions.some((o) => o.recepta.tipus === 'salsa')).toBe(false);
  });

  it('el filtre «A la brasa» del receptari porta els plats de brasa i les salses', () => {
    const seccions = filtrarReceptari(catalegInicial, receptari(catalegInicial, ambBarbacoa()), 'brasa');
    const ids = seccions.flatMap((s) => s.receptes);
    expect(ids.every((r) => calBarbacoa(r) || r.tipus === 'salsa')).toBe(true);
    expect(seccions.some((s) => s.grup === 'salsa')).toBe(true);
    expect(seccions.some((s) => s.grup === 'acompanyament')).toBe(true);
  });

  it('les salses proposades existeixen i són salses', () => {
    for (const r of receptes) {
      for (const id of r.salses ?? []) expect(catalegInicial.receptes.get(id)?.tipus, `${r.id} → ${id}`).toBe('salsa');
    }
    expect(deBarbacoa.filter((r) => r.tipus !== 'acompanyament' && r.salses).length).toBeGreaterThan(30);
  });
});
