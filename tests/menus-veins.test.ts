import { describe, expect, it } from 'vitest';
import { catalegInicial } from '../src/dades';
import {
  configuracioDesDeRespostes,
  dataApat,
  diesDelMes,
  diesEntre,
  DIES_SENSE_REPETIR,
  evitarRepetirVeins,
  graellaPerDefecte,
  planificar,
  platsAmbData,
  repeteixVei,
  respostesPerDefecte,
  type ApatPlanificat,
} from '../src/domini';

const configuracio = configuracioDesDeRespostes(respostesPerDefecte());
const graella = graellaPerDefecte();

// Menú setmanal de la setmana del 26 d'octubre (acaba diumenge 1 de novembre) i mensual de novembre.
const setmanal = (llavor: number) => ({
  creat: '2026-10-26',
  apats: planificar({ cataleg: catalegInicial, configuracio, graella, llavor }).apats,
});
const novembre = (llavor: number): ApatPlanificat[] =>
  planificar({ cataleg: catalegInicial, configuracio, graella, llavor, dies: diesDelMes('2026-11') }).apats;
const identitatNovembre = { periode: 'mes' as const, mes: '2026-11' };

describe('menús veïns', () => {
  it('sap si un plat surt a l’altre menú a menys de tres dies', () => {
    const veins = [{ receptaId: 'x', data: '2026-10-31' }];
    expect(repeteixVei('x', '2026-11-01', veins)).toBe(true);
    expect(repeteixVei('x', `2026-11-0${1 + DIES_SENSE_REPETIR}`, veins)).toBe(false);
    expect(repeteixVei('y', '2026-11-01', veins)).toBe(false);
    expect(repeteixVei('x', undefined, veins)).toBe(false);
  });

  it('el menú setmanal té les dates de la seva setmana', () => {
    const dates = platsAmbData(setmanal(1)).map((p) => p.data);
    expect(dates[0]).toBe('2026-10-26');
    expect(dates.at(-1)).toBe('2026-11-01');
  });

  it('el menú nou no repeteix a prop cap plat del menú anterior', () => {
    let calia = 0;
    for (let llavor = 0; llavor < 40; llavor++) {
      const anterior = setmanal(llavor);
      // El cas de Roger: el mateix dinar l'últim dia de l'anterior i el primer del nou.
      const nous = novembre(llavor + 500);
      const ultim = anterior.apats.find((a) => dataApat(a, anterior) === '2026-11-01' && a.apat === 'dinar')!;
      const primer = nous.findIndex((a) => a.data === '2026-11-02' && a.apat === 'dinar');
      nous[primer] = { ...nous[primer]!, receptaId: ultim.receptaId };
      const veins = platsAmbData(anterior);
      const resultat = evitarRepetirVeins(catalegInicial, configuracio, nous, identitatNovembre, veins, llavor);
      if (resultat[primer]!.receptaId !== ultim.receptaId) calia++;
      for (const a of resultat) {
        for (const v of veins) {
          if (v.receptaId === a.receptaId) expect(Math.abs(diesEntre(v.data, a.data!))).toBeGreaterThan(DIES_SENSE_REPETIR);
        }
      }
      expect(resultat).toHaveLength(nous.length);
    }
    expect(calia).toBe(40);
  });

  it('no toca els plats fixats', () => {
    const anterior = setmanal(3);
    const nous = novembre(7);
    const ultim = anterior.apats.at(-1)!;
    nous[0] = { ...nous[0]!, receptaId: ultim.receptaId, fixat: true };
    const resultat = evitarRepetirVeins(catalegInicial, configuracio, nous, identitatNovembre, platsAmbData(anterior), 1);
    expect(resultat[0]).toMatchObject({ receptaId: ultim.receptaId, fixat: true });
  });
});
