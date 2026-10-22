import { describe, expect, it } from 'vitest';
import { catalegInicial } from '../src/dades';
import { cuinesReceptes } from '../src/dades/cuines';
import { configuracioDesDeRespostes, filtrarReceptari, filtresReceptari, generarLlista, receptari, respostesPerDefecte, type RespostesQuestionari } from '../src/domini';

const config = (canvis: Partial<RespostesQuestionari> = {}) => configuracioDesDeRespostes({ ...respostesPerDefecte(), ...canvis });
const ids = (canvis: Partial<RespostesQuestionari> = {}) => receptari(catalegInicial, config(canvis)).flatMap((s) => s.receptes.map((r) => r.id));

describe('receptari complet', () => {
  it('té totes les receptes que la família pot fer, sense límit de temps, i els acompanyaments al final', () => {
    const seccions = receptari(catalegInicial, config({ temps: 'rapid' }));
    expect(seccions.at(-2)!.grup).toBe('acompanyament');
    expect(seccions.at(-1)!.grup).toBe('salsa');
    const principals = seccions.filter((s) => s.grup !== 'acompanyament' && s.grup !== 'salsa').flatMap((s) => s.receptes);
    expect(principals.some((r) => r.tempsMinuts > 60)).toBe(true);
    expect(principals.some((r) => r.tipus === 'acompanyament')).toBe(false);
    expect(seccions.at(-2)!.receptes.every((r) => r.tipus === 'acompanyament' || r.tipus === 'ambdos')).toBe(true);
    expect(seccions.at(-1)!.receptes.every((r) => r.tipus === 'salsa')).toBe(true);
    for (const s of seccions) {
      const noms = s.receptes.map((r) => r.nom);
      expect(noms).toEqual([...noms].sort((a, b) => a.localeCompare(b, 'ca')));
    }
  });

  it('treu el que la família no pot menjar ni fer', () => {
    const vegans = ids({ dieta: 'vegana' });
    expect(vegans.length).toBeGreaterThan(0);
    for (const id of vegans) {
      const r = catalegInicial.receptes.get(id)!;
      for (const l of r.ingredients) expect(catalegInicial.ingredients.get(l.ingredientId)?.origen).toBeUndefined();
    }
    const tots = ids();
    expect(ids({ aparells: [] }).length).toBeLessThan(tots.length);
  });
});

describe('llista de la compra d’un sol plat', () => {
  it('suma els paquets que cal comprar per a aquella recepta', () => {
    const r = [...catalegInicial.receptes.values()].find((x) => x.tipus !== 'acompanyament' && x.tipus !== 'ambdos')!;
    const llista = generarLlista(catalegInicial, [r.id], 400);
    expect(llista.elements.length).toBeGreaterThan(0);
    expect(llista.totalCompraCentims).toBeGreaterThan(0);
    expect(llista.elements.every((e) => e.receptes.length === 1 && e.receptes[0] === r.id)).toBe(true);
  });
});

describe('filtres del receptari', () => {
  const seccions = receptari(catalegInicial, config());
  const totes = seccions.flatMap((s) => s.receptes);

  it('cada recepta té cuina i les de cuines.ts existeixen', () => {
    for (const id of Object.keys(cuinesReceptes)) expect(catalegInicial.receptes.has(id), id).toBe(true);
    expect([...catalegInicial.receptes.values()].every((r) => r.cuina !== undefined)).toBe(true);
  });

  it('filtra per cuina i per dieta', () => {
    const italianes = filtrarReceptari(catalegInicial, seccions, 'italiana').flatMap((s) => s.receptes);
    expect(italianes.length).toBeGreaterThan(20);
    expect(italianes.every((r) => r.cuina === 'italiana')).toBe(true);
    const veganes = filtrarReceptari(catalegInicial, seccions, 'vegana').flatMap((s) => s.receptes.map((r) => r.id));
    expect(veganes).toContain('falafel');
    expect(veganes).not.toContain('truita-carbasso');
    const vegetarianes = filtrarReceptari(catalegInicial, seccions, 'vegetariana').flatMap((s) => s.receptes.map((r) => r.id));
    expect(vegetarianes).toContain('truita-carbasso');
    expect(vegetarianes).not.toContain('paella');
    expect(filtrarReceptari(catalegInicial, seccions, null).flatMap((s) => s.receptes)).toHaveLength(totes.length);
  });

  it('només ofereix filtres útils', () => {
    expect(filtresReceptari(catalegInicial, seccions)).toEqual(expect.arrayContaining(['catalana', 'italiana', 'mexicana', 'vegana']));
    const vegans = receptari(catalegInicial, config({ dieta: 'vegana' }));
    expect(filtresReceptari(catalegInicial, vegans)).not.toContain('vegana');
  });
});
