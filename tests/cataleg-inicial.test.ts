import { describe, expect, it } from 'vitest';
import { catalegInicial, errorsCatalegInicial, ingredients, preus, receptes } from '../src/dades';
import { costRecepta, graellaPerDefecte, planificar, type ConfiguracioFamilia } from '../src/domini';

const familia: ConfiguracioFamilia = {
  persones: [
    { nom: 'A', ganaCentesimes: 100 },
    { nom: 'B', ganaCentesimes: 100 },
    { nom: 'C', ganaCentesimes: 100 },
    { nom: 'D', ganaCentesimes: 100 },
  ],
  exclosos: [],
  etiquetesObligatories: [],
  etiquetesPreferides: [],
  tempsMaximMinuts: null,
  pressupostCentims: null,
};

describe('catàleg inicial', () => {
  it('no té errors de dades', () => {
    expect(errorsCatalegInicial()).toEqual([]);
  });

  it('tots els ingredients que no són de rebost tenen preu', () => {
    const ambPreu = new Set(preus.map((p) => p.ingredientId));
    expect(ingredients.filter((i) => !i.rebost && !ambPreu.has(i.id)).map((i) => i.id)).toEqual([]);
  });

  it('tots els ingredients es fan servir en alguna recepta', () => {
    const usats = new Set(receptes.flatMap((r) => r.ingredients.map((l) => l.ingredientId)));
    expect(ingredients.filter((i) => !usats.has(i.id)).map((i) => i.id)).toEqual([]);
  });

  it('el cost per ració de cada plat principal és raonable (entre 0,30 € i 6 €)', () => {
    for (const r of receptes.filter((r) => r.tipus !== 'acompanyament')) {
      const perRacio = costRecepta(catalegInicial, r, 400) / 4;
      expect(perRacio, r.id).toBeGreaterThan(30);
      expect(perRacio, r.id).toBeLessThan(600);
    }
  });

  it('planifica una setmana per defecte sense repetir ni avisos', () => {
    for (let llavor = 0; llavor < 20; llavor++) {
      const pla = planificar({ cataleg: catalegInicial, configuracio: familia, graella: graellaPerDefecte(), llavor });
      expect(pla.apats).toHaveLength(9);
      expect(new Set(pla.apats.map((a) => a.receptaId)).size).toBe(9);
      expect(pla.avisos).toEqual([]);
      for (const a of pla.apats) {
        expect(Boolean(a.acompanyamentId)).toBe(Boolean(catalegInicial.receptes.get(a.receptaId)?.ambAcompanyament));
      }
    }
  });
});
