import { describe, expect, it } from 'vitest';
import {
  costIngredient,
  costRecepta,
  crearCataleg,
  escalarRecepta,
  generarLlista,
  racionsEfectives,
  recepta,
  validarCataleg,
  type Ingredient,
  type Recepta,
} from '../src/domini';
import { ingredients, preus, receptes } from './dades-prova';

const cataleg = crearCataleg(ingredients, receptes, preus);

describe('racions efectives', () => {
  it('sumen els factors de gana', () => {
    expect(
      racionsEfectives([
        { nom: 'A', ganaCentesimes: 100 },
        { nom: 'B', ganaCentesimes: 125 },
        { nom: 'C', ganaCentesimes: 75 },
      ]),
    ).toBe(300);
    expect(racionsEfectives([])).toBe(0);
  });
});

describe('escalat', () => {
  it('escala de 4 a 6 racions i converteix unitats declarades', () => {
    const linies = escalarRecepta(cataleg, recepta(cataleg, 'truita'), 600);
    const perId = Object.fromEntries(linies.map((l) => [l.ingredientId, l]));
    expect(perId.ou).toMatchObject({ unitat: 'u', milesimes: 9_000, quantitat: 9 });
    // 1 ceba = 150 g → 225 g
    expect(perId.ceba).toMatchObject({ unitat: 'g', milesimes: 225_000, quantitat: 225 });
    expect(perId.oli?.quantitat).toBe(75);
  });

  it('a les mateixes racions no canvia res', () => {
    const linies = escalarRecepta(cataleg, recepta(cataleg, 'llenties'), 400);
    expect(linies.map((l) => l.quantitat)).toEqual([400, 150, 200]);
  });
});

describe('cost', () => {
  it('compra paquets sencers i calcula el cost consumit', () => {
    expect(costIngredient(1100, { ingredientId: 'arros', midaPaquet: 1000, preuCentims: 150 })).toEqual({
      paquets: 2,
      midaPaquet: 1000,
      costCompraCentims: 300,
      costConsumitCentims: 165,
    });
  });

  it('un paquet exacte no en compra un de més', () => {
    expect(costIngredient(12, { ingredientId: 'ou', midaPaquet: 12, preuCentims: 300 }).paquets).toBe(1);
  });

  it('quantitat zero no costa res', () => {
    expect(costIngredient(0, { ingredientId: 'ou', midaPaquet: 12, preuCentims: 300 }).costCompraCentims).toBe(0);
  });

  it('el cost d’una recepta no compta el rebost', () => {
    // salmó: 800 g × 20 €/kg = 1600; tomàquet: 300 g × 2,50 €/kg = 75; oli és rebost
    expect(costRecepta(cataleg, recepta(cataleg, 'salmo'), 400)).toBe(1675);
  });
});

describe('llista de compra', () => {
  it('unifica els ingredients de diverses receptes', () => {
    const llista = generarLlista(cataleg, ['truita', 'arros-pollastre', 'llenties'], 400);
    const ceba = llista.elements.find((e) => e.ingredientId === 'ceba');
    // 150 + 150 + 150 g
    expect(ceba?.quantitat).toBe(450);
    expect(ceba?.receptes).toEqual(['truita', 'arros-pollastre', 'llenties']);
    expect(ceba?.cost).toMatchObject({ paquets: 1, costCompraCentims: 200, costConsumitCentims: 90 });
  });

  it('el rebost surt a la llista, al final, però no suma al cost', () => {
    const llista = generarLlista(cataleg, ['truita'], 400);
    const ultims = llista.elements.slice(-2).map((e) => e.ingredientId).sort();
    expect(ultims).toEqual(['oli', 'sal']);
    // ous: 1 paquet de 12 = 300; ceba: 1 paquet = 200
    expect(llista.totalCompraCentims).toBe(500);
    // ous: 6 × 300 ÷ 12 = 150; ceba: 150 × 200 ÷ 1000 = 30
    expect(llista.totalConsumitCentims).toBe(180);
    // la sal no té preu, però és de rebost: no és un error
    expect(llista.senseCost).toEqual([]);
  });

  it('una recepta repetida suma dues vegades', () => {
    const llista = generarLlista(cataleg, ['truita', 'truita'], 400);
    expect(llista.elements.find((e) => e.ingredientId === 'ou')?.quantitat).toBe(12);
    expect(llista.elements.find((e) => e.ingredientId === 'ou')?.receptes).toEqual(['truita']);
  });

  it('suma les fraccions abans d’arrodonir', () => {
    const all: Ingredient = { id: 'all', nom: 'All', unitat: 'u' };
    const r = (id: string): Recepta => ({
      id,
      nom: id,
      racions: 4,
      tempsMinuts: 10,
      etiquetes: [],
      ingredients: [{ ingredientId: 'all', quantitat: 1 }],
    });
    const petit = crearCataleg([all], [r('a'), r('b')], []);
    // dues receptes amb mig all cadascuna (2 racions) → 1 all, no 2
    expect(generarLlista(petit, ['a', 'b'], 200).elements[0]?.quantitat).toBe(1);
  });

  it('avisa dels ingredients sense preu', () => {
    const sensePreuPollastre = crearCataleg(
      ingredients,
      receptes,
      preus.filter((p) => p.ingredientId !== 'pollastre'),
    );
    expect(generarLlista(sensePreuPollastre, ['arros-pollastre'], 400).senseCost).toEqual(['pollastre']);
  });

  it('ordena per secció i nom', () => {
    const llista = generarLlista(cataleg, ['llenties', 'salmo'], 400);
    expect(llista.elements.map((e) => e.ingredientId)).toEqual(['ceba', 'tomaquet', 'salmo', 'llenties', 'oli']);
  });
});

describe('validació del catàleg', () => {
  it('el catàleg de prova és correcte', () => {
    expect(validarCataleg(ingredients, receptes, preus)).toEqual([]);
  });

  it('detecta errors de dades', () => {
    const dolenta: Recepta = {
      id: 'dolenta',
      nom: 'Dolenta',
      racions: 0,
      tempsMinuts: 10,
      etiquetes: [],
      ingredients: [
        { ingredientId: 'inexistent', quantitat: 1 },
        { ingredientId: 'arros', quantitat: 1, unitat: 'u' },
        { ingredientId: 'ou', quantitat: 1.5 },
      ],
    };
    const errors = validarCataleg(ingredients, [dolenta], [{ ingredientId: 'ou', midaPaquet: 0, preuCentims: 10 }]);
    expect(errors).toHaveLength(5);
    expect(errors.join('\n')).toMatch(/racions no vàlides/);
    expect(errors.join('\n')).toMatch(/ingredient desconegut «inexistent»/);
    expect(errors.join('\n')).toMatch(/«arros» en u sense conversió/);
    expect(errors.join('\n')).toMatch(/quantitat no vàlida de «ou»/);
    expect(errors.join('\n')).toMatch(/mida de paquet no vàlida/);
  });
});
