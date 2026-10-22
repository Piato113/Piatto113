import { describe, expect, it } from 'vitest';
import { catalegInicial } from '../src/dades';
import { NOVETATS } from '../src/dades/novetats';
import {
  clauNovetat,
  llegirEstadistiques,
  MAX_NOVETATS_ROTOL,
  novetatsPerMostrar,
  xifresCataleg,
  type Novetat,
} from '../src/domini';
import { textos } from '../src/textos/ca';

describe('xifres del catàleg', () => {
  it('compta plats (també els de doble ús), acompanyaments i salses', () => {
    const x = xifresCataleg(catalegInicial);
    expect(x.plats + x.acompanyaments + x.salses).toBe(catalegInicial.receptes.size);
    const ambdos = [...catalegInicial.receptes.values()].filter((r) => r.tipus === 'ambdos').length;
    const senseTipus = [...catalegInicial.receptes.values()].filter((r) => r.tipus === undefined || r.tipus === 'principal').length;
    expect(ambdos).toBeGreaterThan(0);
    expect(x.plats).toBe(senseTipus + ambdos);
    expect(x.salses).toBeGreaterThan(0);
    expect(x.acompanyaments).toBeGreaterThan(0);
  });
});

describe('novetats del rètol', () => {
  const llista: Novetat[] = [
    { data: '2026-10-22', text: 'C' },
    { data: '2026-10-20', text: 'B' },
    { data: '2026-09-01', text: 'A' },
  ];

  it('mostra les recents que encara no s’han vist', () => {
    expect(novetatsPerMostrar(llista, null, '2026-10-22').map((n) => n.text)).toEqual(['C', 'B']);
    expect(novetatsPerMostrar(llista, clauNovetat(llista[1]!), '2026-10-22').map((n) => n.text)).toEqual(['C']);
    expect(novetatsPerMostrar(llista, clauNovetat(llista[0]!), '2026-10-22')).toEqual([]);
  });

  it('les de fa més d’un mes ja no passen pel rètol', () => {
    expect(novetatsPerMostrar(llista, null, '2026-12-01')).toEqual([]);
  });

  it('si la vista ja no és a la llista, compten totes', () => {
    expect(novetatsPerMostrar(llista, 'una que ja no hi és', '2026-10-22').map((n) => n.text)).toEqual(['C', 'B']);
  });

  it('com a molt surten unes quantes', () => {
    const moltes = Array.from({ length: 10 }, (_, i) => ({ data: '2026-10-22', text: `N${i}` }));
    expect(novetatsPerMostrar(moltes, null, '2026-10-22')).toHaveLength(MAX_NOVETATS_ROTOL);
  });

  it('les novetats de l’app van de la més nova a la més vella, amb data vàlida i sense repetir-se', () => {
    for (let i = 1; i < NOVETATS.length; i++) expect(NOVETATS[i - 1]!.data >= NOVETATS[i]!.data).toBe(true);
    expect(NOVETATS.every((n) => /^\d{4}-\d{2}-\d{2}$/.test(n.data) && n.text.length > 0 && !n.text.endsWith('.'))).toBe(true);
    expect(new Set(NOVETATS.map(clauNovetat)).size).toBe(NOVETATS.length);
  });
});

describe('xifres del compte', () => {
  it('accepta només números enters no negatius', () => {
    expect(llegirEstadistiques({ usuaris: 42, menus: 1250 })).toEqual({ usuaris: 42, menus: 1250 });
    expect(llegirEstadistiques({ usuaris: '42', menus: '7' })).toEqual({ usuaris: 42, menus: 7 });
    expect(llegirEstadistiques({ usuaris: -1, menus: 0 })).toBeNull();
    expect(llegirEstadistiques({ usuaris: 3 })).toBeNull();
    expect(llegirEstadistiques(null)).toBeNull();
    expect(llegirEstadistiques('x')).toBeNull();
  });
});

describe('textos del rètol', () => {
  it('escriu les xifres en català', () => {
    expect(textos.rotol.usuaris(1250)).toBe('🍽 Ja som 1.250 a taula!');
    expect(textos.rotol.menus(1)).toBe('🗓 1 menú fet');
    expect(textos.rotol.menus(3)).toBe('🗓 3 menús fets');
    expect(textos.rotol.data('2026-10-22')).toBe('22 d’octubre');
    expect(textos.rotol.data('2026-11-03')).toBe('3 de novembre');
  });
});
