import { describe, expect, it } from 'vitest';
import { catalegInicial } from '../src/dades';
import { graellaNouApats } from './dades-prova';
import {
  configuracioDesDeRespostes,
  DIES_SENSE_REPETIR,
  diesDelMes,
  diesEntre,
  dillunsDe,
  estalviCompraPeriode,
  mesSeguent,
  planificar,
  respostesPerDefecte,
  setmanesDelMenu,
} from '../src/domini';

const configuracio = configuracioDesDeRespostes(respostesPerDefecte());

describe('calendari', () => {
  it('dies d’un mes, amb el dia de la setmana', () => {
    const novembre = diesDelMes('2026-11');
    expect(novembre).toHaveLength(30);
    expect(novembre[0]).toEqual({ data: '2026-11-01', dia: 'dg' });
    expect(novembre[1]).toEqual({ data: '2026-11-02', dia: 'dl' });
    expect(diesDelMes('2028-02')).toHaveLength(29);
  });

  it('el mes en curs comença avui', () => {
    const resta = diesDelMes('2026-10', '2026-10-21');
    expect(resta).toHaveLength(11);
    expect(resta[0]).toEqual({ data: '2026-10-21', dia: 'dc' });
    // Una data d'un altre mes no retalla res.
    expect(diesDelMes('2026-11', '2026-10-21')).toHaveLength(30);
  });

  it('setmanes de dilluns a diumenge i mes següent', () => {
    expect(dillunsDe('2026-11-01')).toBe('2026-10-26');
    expect(dillunsDe('2026-11-02')).toBe('2026-11-02');
    expect(diesEntre('2026-10-30', '2026-11-02')).toBe(3);
    expect(mesSeguent('2026-12')).toBe('2027-01');
  });
});

describe('menú mensual', () => {
  const dies = diesDelMes('2026-11');

  it('un àpat per cada àpat marcat de cada dia, amb la data', () => {
    const pla = planificar({ cataleg: catalegInicial, configuracio, graella: graellaNouApats(), llavor: 1, dies });
    // Novembre de 2026: 21 dies feiners (sopar) i 9 de cap de setmana (dinar i sopar).
    expect(pla.apats).toHaveLength(21 + 9 * 2);
    expect(pla.apats[0]).toMatchObject({ data: '2026-11-01', dia: 'dg', apat: 'dinar' });
    expect(pla.apats.at(-1)).toMatchObject({ data: '2026-11-30', dia: 'dl', apat: 'sopar' });
  });

  it('cap plat no es repeteix a menys de tres dies, i no hi ha avisos', () => {
    for (let llavor = 0; llavor < 20; llavor++) {
      const pla = planificar({ cataleg: catalegInicial, configuracio, graella: graellaNouApats(), llavor, dies });
      expect(pla.avisos, `llavor ${llavor}`).toEqual([]);
      pla.apats.forEach((a, i) => {
        pla.apats.slice(i + 1).forEach((b) => {
          if (a.receptaId === b.receptaId) expect(diesEntre(a.data!, b.data!)).toBeGreaterThan(DIES_SENSE_REPETIR);
        });
      });
    }
  });

  it('també amb dieta vegana i dinar i sopar cada dia (amb repeticions separades)', () => {
    const vega = configuracioDesDeRespostes({ ...respostesPerDefecte(), dieta: 'vegana' });
    const tot = graellaNouApats();
    for (const d of Object.values(tot)) {
      d.dinar = true;
      d.sopar = true;
    }
    const pla = planificar({ cataleg: catalegInicial, configuracio: vega, graella: tot, llavor: 3, dies });
    expect(pla.apats).toHaveLength(60);
    expect(pla.avisos.filter((a) => a.codi === 'receptes-repetides')).toEqual([]);
  });

  it('agrupa per setmanes i comprar-ho tot d’un cop surt més barat', () => {
    const pla = planificar({ cataleg: catalegInicial, configuracio, graella: graellaNouApats(), llavor: 5, dies });
    const setmanes = setmanesDelMenu(pla.apats);
    expect(setmanes.map((s) => s.dilluns)).toEqual(['2026-10-26', '2026-11-02', '2026-11-09', '2026-11-16', '2026-11-23', '2026-11-30']);
    expect(setmanes.flatMap((s) => s.indexs)).toEqual(pla.apats.map((_, i) => i));
    const { setmanalCentims, totCentims, estalviCentims } = estalviCompraPeriode(catalegInicial, configuracio, pla.apats);
    expect(estalviCentims).toBe(setmanalCentims - totCentims);
    expect(estalviCentims).toBeGreaterThan(0);
  });

  it('el menú setmanal no porta dates', () => {
    const pla = planificar({ cataleg: catalegInicial, configuracio, graella: graellaNouApats(), llavor: 1 });
    expect(pla.apats.every((a) => a.data === undefined)).toBe(true);
    expect(setmanesDelMenu(pla.apats)).toHaveLength(1);
  });
});
