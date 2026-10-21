import { describe, expect, it } from 'vitest';
import {
  ErrorUnitat,
  formatEuros,
  formatNombre,
  formatQuantitat,
  liniaAMilesimes,
  milesimesACompra,
  milesimesAMostrar,
  type Ingredient,
} from '../src/domini';

const ceba: Ingredient = { id: 'ceba', nom: 'Ceba', unitat: 'g', conversions: { u: 150 } };
const farina: Ingredient = { id: 'farina', nom: 'Farina', unitat: 'g' };

describe('unitats', () => {
  it('passa una línia en unitat base a mil·lèsimes', () => {
    expect(liniaAMilesimes({ ingredientId: 'farina', quantitat: 250 }, farina)).toBe(250_000);
  });

  it('converteix només si l’ingredient ho declara', () => {
    expect(liniaAMilesimes({ ingredientId: 'ceba', quantitat: 2, unitat: 'u' }, ceba)).toBe(300_000);
    expect(() => liniaAMilesimes({ ingredientId: 'farina', quantitat: 1, unitat: 'ml' }, farina)).toThrow(ErrorUnitat);
  });

  it('arrodoneix la compra sempre cap amunt', () => {
    expect(milesimesACompra(1_000)).toBe(1);
    expect(milesimesACompra(1_001)).toBe(2);
    expect(milesimesACompra(0)).toBe(0);
  });

  it('mostra grams a l’enter (mínim 1) i unitats al mig', () => {
    expect(milesimesAMostrar(225_400, 'g')).toBe(225);
    expect(milesimesAMostrar(200, 'g')).toBe(1);
    expect(milesimesAMostrar(1_200, 'u')).toBe(1.5);
    expect(milesimesAMostrar(1_500, 'u')).toBe(1.5);
    expect(milesimesAMostrar(1_501, 'u')).toBe(2);
    expect(milesimesAMostrar(0, 'u')).toBe(0);
  });
});

describe('format en català', () => {
  it('formata euros amb coma decimal i punt de milers', () => {
    expect(formatEuros(0)).toBe('0,00 €');
    expect(formatEuros(345)).toBe('3,45 €');
    expect(formatEuros(123_456)).toBe('1.234,56 €');
    expect(formatEuros(-5)).toBe('-0,05 €');
  });

  it('formata nombres sense zeros sobrers', () => {
    expect(formatNombre(1.5)).toBe('1,5');
    expect(formatNombre(2)).toBe('2');
    expect(formatNombre(1234.567)).toBe('1.234,57');
  });

  it('formata quantitats amb la unitat adequada', () => {
    expect(formatQuantitat(250, 'g')).toBe('250 g');
    expect(formatQuantitat(1250, 'g')).toBe('1,25 kg');
    expect(formatQuantitat(1000, 'ml')).toBe('1 l');
    expect(formatQuantitat(330, 'ml')).toBe('330 ml');
    expect(formatQuantitat(3, 'u')).toBe('3 u');
    expect(formatQuantitat(1.5, 'u')).toBe('1½ u');
    expect(formatQuantitat(0.5, 'u')).toBe('½ u');
  });
});
