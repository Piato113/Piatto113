import { describe, expect, it } from 'vitest';
import { crearCataleg, prepararRecepta, referenciesPas, validarPassos, type Ingredient, type Recepta } from '../src/domini';

const ingredients: Ingredient[] = [
  { id: 'ceba', nom: 'Ceba', unitat: 'g', conversions: { u: 150 } },
  { id: 'ou', nom: 'Ous', unitat: 'u', indivisible: true },
  { id: 'oli', nom: 'Oli', unitat: 'ml', rebost: true },
];

const truita: Recepta = {
  id: 'truita',
  nom: 'Truita de ceba',
  racions: 4,
  tempsMinuts: 30,
  etiquetes: [],
  ingredients: [
    { ingredientId: 'ou', quantitat: 6 },
    { ingredientId: 'ceba', quantitat: 1, unitat: 'u' },
    { ingredientId: 'oli', quantitat: 40 },
  ],
  passos: [
    { text: 'Talla la ceba ({ceba}) a làmines.' },
    {
      text: 'Ofega la ceba amb la meitat de l’oli ({oli:1/2}).',
      cronometre: { segons: 900, nom: 'Ofegar la ceba' },
    },
    { text: 'Bat els ous ({ou}) i qualla la truita amb la resta de l’oli ({oli:1/2}).' },
  ],
};

const cataleg = crearCataleg(ingredients, [truita], []);

describe('preparació', () => {
  it('troba les referències i les fraccions', () => {
    expect(referenciesPas('Posa {oli:1/2} i {ceba}.')).toEqual([
      { ingredientId: 'oli', numerador: 1, denominador: 2 },
      { ingredientId: 'ceba', numerador: 1, denominador: 1 },
    ]);
  });

  it('a les racions de la recepta, el text diu les quantitats originals', () => {
    const { passos } = prepararRecepta(cataleg, truita, 400);
    expect(passos.map((p) => p.text)).toEqual([
      'Talla la ceba (1 u) a làmines.',
      'Ofega la ceba amb la meitat de l’oli (20 ml).',
      'Bat els ous (6 u) i qualla la truita amb la resta de l’oli (20 ml).',
    ]);
    expect(passos[1]).toMatchObject({ numero: 2, cronometre: { segons: 900, nom: 'Ofegar la ceba' } });
    expect(passos[0]?.cronometre).toBeUndefined();
  });

  it('escala les quantitats del text; les peces indivisibles s’arrodoneixen a l’enter', () => {
    const { passos, ingredients: linies } = prepararRecepta(cataleg, truita, 450);
    // 6 ous × 4,5 ÷ 4 = 6,75 → 7; ceba 1,125 → 1½; oli 45 ml ÷ 2 = 22,5 → 23
    expect(passos[2]?.text).toBe('Bat els ous (7 u) i qualla la truita amb la resta de l’oli (23 ml).');
    expect(passos[0]?.text).toBe('Talla la ceba (1½ u) a làmines.');
    expect(linies.find((l) => l.ingredientId === 'ceba')).toMatchObject({ unitatRecepta: 'u', quantitatRecepta: 1.5, quantitat: 169 });
  });

  it('una recepta correcta no té errors', () => {
    expect(validarPassos(truita)).toEqual([]);
  });

  it('detecta referències, fraccions i cronòmetres incorrectes', () => {
    const dolenta: Recepta = {
      ...truita,
      passos: [
        { text: 'Posa la sal ({sal}) i la ceba ({ceba:3/2}).' },
        { text: 'Bat els ous ({ou}).', cronometre: { segons: 0, nom: '' } },
      ],
    };
    const errors = validarPassos(dolenta);
    expect(errors).toEqual([
      'Recepta «truita», pas 1: «sal» no és un ingredient de la recepta',
      'Recepta «truita», pas 1: fracció no vàlida de «ceba»',
      'Recepta «truita», pas 2: cronòmetre no vàlid',
      'Recepta «truita», pas 2: cronòmetre sense nom',
      'Recepta «truita»: l\'ingredient «oli» no surt a cap pas',
    ]);
  });

  it('una recepta sense passos definits no es valida (encara no en té)', () => {
    const { passos: _, ...sensePassos } = truita;
    expect(validarPassos(sensePassos)).toEqual([]);
    expect(validarPassos({ ...truita, passos: [] })).toEqual(['Recepta «truita»: sense passos']);
  });
});
