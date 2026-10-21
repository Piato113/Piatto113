import { describe, expect, it } from 'vitest';
import {
  apatsMarcats,
  canviarApat,
  crearCataleg,
  DIES,
  filtrarReceptes,
  generadorAleatori,
  graellaPerDefecte,
  planificar,
  type Graella,
} from '../src/domini';
import { textAvis } from '../src/textos/ca';
import { configuracio, ingredients, preus, receptes, receptesSintetiques } from './dades-prova';

const cataleg = crearCataleg(ingredients, receptes, preus);

/** Graella amb només el sopar de dilluns, dimarts i dimecres. */
function tresSopars(): Graella {
  let g = graellaPerDefecte();
  for (const dia of DIES) {
    g = canviarApat(g, dia, 'dinar', false);
    g = canviarApat(g, dia, 'sopar', dia === 'dl' || dia === 'dt' || dia === 'dc');
  }
  return g;
}

describe('graella', () => {
  it('per defecte: sopar entre setmana; dinar i sopar el cap de setmana', () => {
    const marcats = apatsMarcats(graellaPerDefecte());
    expect(marcats).toHaveLength(9);
    expect(marcats.slice(0, 5).every((m) => m.apat === 'sopar')).toBe(true);
    expect(marcats.slice(5)).toEqual([
      { dia: 'ds', apat: 'dinar' },
      { dia: 'ds', apat: 'sopar' },
      { dia: 'dg', apat: 'dinar' },
      { dia: 'dg', apat: 'sopar' },
    ]);
  });

  it('canviar un àpat no modifica la graella original', () => {
    const original = graellaPerDefecte();
    const festiu = canviarApat(original, 'dc', 'dinar', true);
    expect(original.dc.dinar).toBe(false);
    expect(festiu.dc.dinar).toBe(true);
    expect(apatsMarcats(festiu)).toHaveLength(10);
  });
});

describe('aleatori', () => {
  it('la mateixa llavor dona la mateixa seqüència', () => {
    const a = generadorAleatori(42);
    const b = generadorAleatori(42);
    const seqA = Array.from({ length: 5 }, a);
    expect(Array.from({ length: 5 }, b)).toEqual(seqA);
    expect(seqA.every((x) => x >= 0 && x < 1)).toBe(true);
  });
});

describe('filtres', () => {
  it('treu les receptes amb ingredients exclosos', () => {
    const ids = filtrarReceptes(cataleg, configuracio({ exclosos: ['ceba'] })).map((r) => r.id);
    expect(ids).toEqual(['salmo']);
  });

  it('respecta el temps màxim', () => {
    const ids = filtrarReceptes(cataleg, configuracio({ tempsMaximMinuts: 30 })).map((r) => r.id);
    expect(ids).toEqual(['salmo', 'truita']);
  });

  it('exigeix totes les etiquetes obligatòries', () => {
    const ids = filtrarReceptes(cataleg, configuracio({ etiquetesObligatories: ['vegetaria'] })).map((r) => r.id);
    expect(ids).toEqual(['llenties', 'truita']);
  });
});

describe('planificador', () => {
  const base = { cataleg, graella: tresSopars(), configuracio: configuracio(), llavor: 7 };

  it('omple cada àpat marcat sense repetir quan hi ha prou receptes', () => {
    const pla = planificar(base);
    expect(pla.apats.map((a) => a.dia)).toEqual(['dl', 'dt', 'dc']);
    expect(new Set(pla.apats.map((a) => a.receptaId)).size).toBe(3);
    expect(pla.avisos).toEqual([]);
    expect(pla.racionsCentesimes).toBe(400);
  });

  it('és reproduïble amb la mateixa llavor', () => {
    expect(planificar(base)).toEqual(planificar(base));
  });

  it('llavors diferents donen menús diferents', () => {
    const menus = new Set(
      Array.from({ length: 20 }, (_, i) =>
        planificar({ ...base, llavor: i })
          .apats.map((a) => a.receptaId)
          .join(','),
      ),
    );
    expect(menus.size).toBeGreaterThan(5);
  });

  it('no repeteix en una setmana completa si hi ha prou receptes', () => {
    const gran = crearCataleg(ingredients, receptesSintetiques(12), preus);
    const pla = planificar({ ...base, cataleg: gran, graella: graellaPerDefecte() });
    expect(pla.apats).toHaveLength(9);
    expect(new Set(pla.apats.map((a) => a.receptaId)).size).toBe(9);
  });

  it('avisa si ha de repetir receptes', () => {
    const pla = planificar({ ...base, graella: graellaPerDefecte() });
    expect(pla.apats).toHaveLength(9);
    expect(pla.avisos).toContainEqual({ codi: 'receptes-repetides', disponibles: 4, necessaries: 9 });
    // Cap recepta surt més de tres vegades: es reparteixen per torns.
    const comptes = new Map<string, number>();
    for (const a of pla.apats) comptes.set(a.receptaId, (comptes.get(a.receptaId) ?? 0) + 1);
    expect(Math.max(...comptes.values())).toBeLessThanOrEqual(3);
  });

  it('en repetir, no posa la mateixa recepta en dos àpats seguits', () => {
    for (let llavor = 0; llavor < 50; llavor++) {
      const ids = planificar({ ...base, llavor, graella: graellaPerDefecte() }).apats.map((a) => a.receptaId);
      ids.slice(1).forEach((id, i) => expect(id).not.toBe(ids[i]));
    }
  });

  it('avisa si no hi ha cap àpat marcat', () => {
    let buida = graellaPerDefecte();
    for (const dia of DIES) buida = canviarApat(canviarApat(buida, dia, 'dinar', false), dia, 'sopar', false);
    const pla = planificar({ ...base, graella: buida });
    expect(pla.apats).toEqual([]);
    expect(pla.avisos).toEqual([{ codi: 'cap-apat-marcat' }]);
  });

  it('avisa si cap recepta compleix la configuració', () => {
    const pla = planificar({ ...base, configuracio: configuracio({ tempsMaximMinuts: 10 }) });
    expect(pla.apats).toEqual([]);
    expect(pla.avisos).toEqual([{ codi: 'cap-recepta-valida' }]);
  });

  it('les etiquetes preferides surten més sovint', () => {
    const unSopar = canviarApat(canviarApat(tresSopars(), 'dt', 'sopar', false), 'dc', 'sopar', false);
    const vegades = (preferides: string[]) =>
      Array.from({ length: 400 }, (_, llavor) =>
        planificar({ ...base, graella: unSopar, llavor, configuracio: configuracio({ etiquetesPreferides: preferides }) }),
      ).filter((p) => p.apats[0]?.receptaId === 'salmo').length;
    // Sense preferència ~1/4; preferint peix el salmó pesa 3 contra 1+1+1 → ~1/2.
    expect(vegades(['peix'])).toBeGreaterThan(vegades([]) * 1.5);
  });

  describe('pressupost', () => {
    // Menú més barat possible (truita, llenties, arròs amb pollastre): 18,80 € de compra.
    it('substitueix la recepta més cara per encabir-se al pressupost', () => {
      const senseLimit = Array.from({ length: 20 }, (_, llavor) => planificar({ ...base, llavor }));
      expect(senseLimit.some((p) => p.apats.some((a) => a.receptaId === 'salmo'))).toBe(true);

      for (let llavor = 0; llavor < 20; llavor++) {
        const pla = planificar({ ...base, llavor, configuracio: configuracio({ pressupostCentims: 1900 }) });
        expect(pla.llista.totalCompraCentims).toBeLessThanOrEqual(1900);
        expect(pla.apats.map((a) => a.receptaId)).not.toContain('salmo');
        expect(pla.avisos).toEqual([]);
      }
    });

    it('no toca un menú que ja hi cap', () => {
      const lliure = planificar(base);
      const ambMarge = planificar({ ...base, configuracio: configuracio({ pressupostCentims: 100_000 }) });
      expect(ambMarge.apats).toEqual(lliure.apats);
    });

    it('avisa clarament si no és possible', () => {
      const pla = planificar({ ...base, configuracio: configuracio({ pressupostCentims: 1000 }) });
      expect(pla.apats).toHaveLength(3);
      expect(pla.avisos).toEqual([{ codi: 'pressupost-impossible', pressupostCentims: 1000, minimCentims: 1880 }]);
      expect(pla.llista.totalCompraCentims).toBe(1880);
      expect(textAvis(pla.avisos[0]!)).toBe(
        'No s’ha pogut ajustar al pressupost de 10,00 €. El menú més barat que s’ha trobat costa 18,80 €.',
      );
    });
  });

  it('avisa dels ingredients sense preu amb el nom', () => {
    const sensePreus = crearCataleg(ingredients, receptes, []);
    const pla = planificar({ ...base, cataleg: sensePreus });
    const avis = pla.avisos.find((a) => a.codi === 'sense-preu');
    expect(avis).toBeDefined();
    const nom = (id: string) => sensePreus.ingredients.get(id)?.nom ?? id;
    expect(textAvis(avis!, nom)).toMatch(/^Falta el preu de: .+\. El cost és incomplet\.$/);
  });
});
