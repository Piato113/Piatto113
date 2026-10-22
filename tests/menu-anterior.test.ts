import { describe, expect, it } from 'vitest';
import { clauPeriode, diesQueQueden, esPeriodeNou, type ApatPlanificat } from '../src/domini';

describe('menú anterior', () => {
  it('identifica el període del menú', () => {
    expect(clauPeriode({ periode: 'mes', mes: '2026-11' })).toBe('mes:2026-11');
    expect(clauPeriode({ creat: '2026-10-22' })).toBe('setmana:2026-10-19');
    expect(clauPeriode({})).toBeNull();
  });

  it('preparar el mes següent guarda el d’aquest mes com a anterior', () => {
    expect(esPeriodeNou({ periode: 'mes', mes: '2026-10' }, { periode: 'mes', mes: '2026-11' })).toBe(true);
    expect(esPeriodeNou({ creat: '2026-10-20' }, { periode: 'mes', mes: '2026-11' })).toBe(true);
  });

  it('tornar a fer el menú del mateix període no canvia l’anterior', () => {
    expect(esPeriodeNou({ periode: 'mes', mes: '2026-11' }, { periode: 'mes', mes: '2026-11' })).toBe(false);
    expect(esPeriodeNou({ creat: '2026-10-19' }, { creat: '2026-10-25' })).toBe(false);
    expect(esPeriodeNou({ creat: '2026-10-18' }, { creat: '2026-10-19' })).toBe(true);
    expect(esPeriodeNou({}, { creat: '2026-10-19' })).toBe(true);
  });

  it('compta els dies que queden d’un menú', () => {
    const apat = (data: string): ApatPlanificat => ({ dia: 'dilluns', apat: 'sopar', receptaId: 'x', data }) as unknown as ApatPlanificat;
    expect(diesQueQueden([apat('2026-10-28'), apat('2026-10-29'), apat('2026-10-29'), apat('2026-10-31'), apat('2026-10-20')], '2026-10-29')).toBe(2);
  });
});
