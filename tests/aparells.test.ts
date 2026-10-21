import { describe, expect, it } from 'vitest';
import { catalegInicial } from '../src/dades';
import { aparellsReceptes } from '../src/dades/aparells';
import {
  ALERGENS,
  APARELLS,
  configuracioDesDeRespostes,
  filtrarAcompanyaments,
  filtrarReceptes,
  llegirRespostes,
  respostesPerDefecte,
  teAparells,
  type Aparell,
} from '../src/domini';

const config = (aparells: Aparell[]) => configuracioDesDeRespostes({ ...respostesPerDefecte(), temps: 'sense-limit', aparells });
const ids = (aparells: Aparell[]) => filtrarReceptes(catalegInicial, config(aparells)).map((r) => r.id);

describe('aparells de les receptes', () => {
  it('les receptes de la llista existeixen i els aparells són vàlids', () => {
    for (const [id, aparells] of Object.entries(aparellsReceptes)) {
      expect(catalegInicial.receptes.has(id), id).toBe(true);
      for (const a of aparells.flat()) expect(APARELLS).toContain(a);
    }
  });

  it('tota recepta que diu «Encén el forn» necessita forn (o una alternativa)', () => {
    // L'entrepà explica com fer-lo sense forn.
    const ambAlternativa = new Set(['entrepans-llom-formatge']);
    for (const r of catalegInicial.receptes.values()) {
      const text = (r.passos ?? []).map((p) => p.text).join(' ');
      if (!/Encén el forn/i.test(text) || ambAlternativa.has(r.id)) continue;
      expect(r.aparells?.flat() ?? [], r.id).toContain('forn');
    }
  });

  it('sense forn no surt cap plat de forn, però sí les tires de pollastre si hi ha fregidora d’aire', () => {
    const senseForn = ids(['microones', 'batedora']);
    expect(senseForn).not.toContain('lasanya');
    expect(senseForn).not.toContain('tires-pollastre-forn');
    expect(senseForn).toContain('macarrons-bolonyesa');
    expect(ids(['microones', 'batedora', 'fregidora-aire'])).toContain('tires-pollastre-forn');
    expect(filtrarAcompanyaments(catalegInicial, config([])).map((r) => r.id)).not.toContain('patates-adobades');
  });

  it('amb tots els aparells, no es treu res', () => {
    expect(ids([...APARELLS])).toHaveLength(filtrarReceptes(catalegInicial, { ...config([]), aparells: undefined }).length);
  });

  it('teAparells: alternatives', () => {
    const r = { ...catalegInicial.receptes.get('tires-pollastre-forn')! };
    expect(teAparells(r, ['forn'])).toBe(true);
    expect(teAparells(r, ['fregidora-aire'])).toBe(true);
    expect(teAparells(r, ['microones'])).toBe(false);
    expect(teAparells(r, undefined)).toBe(true);
  });

  it('les respostes desades llegeixen els aparells i descarten els desconeguts', () => {
    const r = llegirRespostes({ persones: [{ nom: 'A', ganaCentesimes: 100 }], aparells: ['thermomix', 'tostadora'] }, ALERGENS);
    expect(r?.aparells).toEqual(['thermomix']);
  });
});
