import { describe, expect, it } from 'vitest';
import {
  canviarApat,
  crearCataleg,
  DIES,
  filtrarReceptes,
  graellaPerDefecte,
  planificar,
  validarCataleg,
  type Graella,
  type Recepta,
} from '../src/domini';
import { configuracio, ingredients, preus } from './dades-prova';

const pollastre: Recepta = {
  id: 'pollastre-arrebossat',
  nom: 'Pollastre arrebossat',
  racions: 4,
  tempsMinuts: 25,
  etiquetes: ['carn'],
  ambAcompanyament: true,
  ingredients: [
    { ingredientId: 'pollastre', quantitat: 600 },
    { ingredientId: 'ou', quantitat: 2 },
  ],
};
const truita: Recepta = {
  id: 'truita',
  nom: 'Truita',
  racions: 4,
  tempsMinuts: 20,
  etiquetes: ['vegetaria'],
  ingredients: [{ ingredientId: 'ou', quantitat: 6 }],
};
const arrosBlanc: Recepta = {
  id: 'arros-blanc',
  nom: 'Arròs blanc',
  racions: 4,
  tempsMinuts: 20,
  etiquetes: [],
  tipus: 'acompanyament',
  ingredients: [{ ingredientId: 'arros', quantitat: 300 }],
};
const salmoGuarnicio: Recepta = {
  id: 'salmo-guarnicio',
  nom: 'Guarnició cara',
  racions: 4,
  tempsMinuts: 60,
  etiquetes: [],
  tipus: 'acompanyament',
  ingredients: [{ ingredientId: 'salmo', quantitat: 400 }],
};

const receptes = [pollastre, truita, arrosBlanc, salmoGuarnicio];
const cataleg = crearCataleg(ingredients, receptes, preus);

function nomesDilluns(): Graella {
  let g = graellaPerDefecte();
  for (const dia of DIES) g = canviarApat(canviarApat(g, dia, 'dinar', false), dia, 'sopar', dia === 'dl');
  return g;
}

describe('acompanyaments', () => {
  it('els acompanyaments no ocupen mai un àpat sols', () => {
    expect(filtrarReceptes(cataleg, configuracio()).map((r) => r.id)).toEqual(['pollastre-arrebossat', 'truita']);
    for (let llavor = 0; llavor < 30; llavor++) {
      const pla = planificar({ cataleg, configuracio: configuracio(), graella: graellaPerDefecte(), llavor });
      for (const a of pla.apats) expect(['pollastre-arrebossat', 'truita']).toContain(a.receptaId);
    }
  });

  it('la recepta que el demana porta acompanyament, i la llista el compta', () => {
    const plans = Array.from({ length: 20 }, (_, llavor) =>
      planificar({ cataleg, configuracio: configuracio(), graella: nomesDilluns(), llavor }),
    );
    const ambPollastre = plans.find((p) => p.apats[0]?.receptaId === 'pollastre-arrebossat');
    const ambTruita = plans.find((p) => p.apats[0]?.receptaId === 'truita');
    expect(ambPollastre?.apats[0]?.acompanyamentId).toMatch(/^(arros-blanc|salmo-guarnicio)$/);
    expect(ambTruita?.apats[0]?.acompanyamentId).toBeUndefined();

    const idAcompanyament = ambPollastre!.apats[0]!.acompanyamentId!;
    const ingredientAcompanyament = idAcompanyament === 'arros-blanc' ? 'arros' : 'salmo';
    const element = ambPollastre!.llista.elements.find((e) => e.ingredientId === ingredientAcompanyament);
    expect(element?.receptes).toEqual([idAcompanyament]);
  });

  it('respecta exclosos i temps màxim també en l’acompanyament', () => {
    for (let llavor = 0; llavor < 20; llavor++) {
      const pla = planificar({
        cataleg,
        configuracio: configuracio({ tempsMaximMinuts: 30 }),
        graella: graellaPerDefecte(),
        llavor,
      });
      for (const a of pla.apats) if (a.acompanyamentId) expect(a.acompanyamentId).toBe('arros-blanc');
    }
  });

  it('sense cap acompanyament vàlid, la recepta que en demana no surt', () => {
    const ids = filtrarReceptes(cataleg, configuracio({ exclosos: ['arros', 'salmo'] })).map((r) => r.id);
    expect(ids).toEqual(['truita']);
  });

  it('el pressupost també abarateix l’acompanyament', () => {
    const nomesPollastre = crearCataleg(ingredients, [pollastre, arrosBlanc, salmoGuarnicio], preus);
    // Amb l’arròs blanc: pollastre 800 + ous 300 + arròs 150 = 12,50 €; amb la guarnició de salmó: 31,00 €.
    for (let llavor = 0; llavor < 20; llavor++) {
      const pla = planificar({
        cataleg: nomesPollastre,
        configuracio: configuracio({ pressupostCentims: 1500 }),
        graella: nomesDilluns(),
        llavor,
      });
      expect(pla.apats[0]?.acompanyamentId).toBe('arros-blanc');
      expect(pla.avisos).toEqual([]);
    }
  });

  it('la validació detecta acompanyaments mal definits', () => {
    expect(validarCataleg(ingredients, [pollastre, truita], preus)).toContain(
      'Recepta «pollastre-arrebossat»: demana acompanyament però no n’hi ha cap de disponible',
    );
    expect(validarCataleg(ingredients, [{ ...arrosBlanc, ambAcompanyament: true }], preus)).toContain(
      'Recepta «arros-blanc»: un acompanyament no pot demanar acompanyament',
    );
  });
});
