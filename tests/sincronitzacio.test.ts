import { describe, expect, it } from 'vitest';
import { fusionar, iguals, jsonCanonic } from '../src/domini';

const C = ['respostes', 'graella', 'menu', 'compra'] as const;
type Col = (typeof C)[number];
const buit = (): Record<Col, unknown> => ({ respostes: null, graella: null, menu: null, compra: null });

describe('jsonCanonic', () => {
  it("no depèn de l'ordre de les claus", () => {
    expect(jsonCanonic({ b: 1, a: { d: [1, { y: 2, x: 1 }], c: null } })).toBe(jsonCanonic({ a: { c: null, d: [1, { x: 1, y: 2 }] }, b: 1 }));
    expect(iguals({ a: 1 }, { a: 2 })).toBe(false);
    expect(iguals(null, undefined)).toBe(true);
  });
  it("l'ordre de les llistes sí que compta", () => {
    expect(iguals([1, 2], [2, 1])).toBe(false);
  });
  it('ignora les claus sense valor, com JSON.stringify', () => {
    expect(iguals({ a: 1, b: undefined }, { a: 1 })).toBe(true);
  });
});

describe('fusionar', () => {
  it('primera vegada: el núvol és buit i el mòbil té dades → les envia', () => {
    const local = { ...buit(), respostes: { dieta: 'omnivora' }, menu: { llavor: 1 } };
    expect(fusionar(C, local, null, [])).toEqual({ aplicar: {}, pujar: ['respostes', 'menu'] });
  });

  it("segon mòbil: el núvol té dades → mana el núvol, també sobre el que hi havia al mòbil", () => {
    const local = { ...buit(), respostes: { dieta: 'vegana' } };
    const remot = { ...buit(), respostes: { dieta: 'omnivora' }, graella: { dl: {} } };
    expect(fusionar(C, local, remot, [])).toEqual({
      aplicar: { respostes: { dieta: 'omnivora' }, graella: { dl: {} } },
      pujar: [],
    });
  });

  it('els canvis pendents del mòbil manen i es tornen a enviar', () => {
    const local = { ...buit(), compra: { marcats: ['ceba'] } };
    const remot = { ...buit(), compra: { marcats: [] } };
    expect(fusionar(C, local, remot, ['compra'])).toEqual({ aplicar: {}, pujar: ['compra'] });
  });

  it("no fa res si les dades són iguals (encara que les claus vinguin en un altre ordre)", () => {
    const local = { ...buit(), menu: { llavor: 1, signatura: 's' } };
    const remot = { ...buit(), menu: { signatura: 's', llavor: 1 } };
    expect(fusionar(C, local, remot, ['menu'])).toEqual({ aplicar: {}, pujar: [] });
    expect(fusionar(C, local, remot, [])).toEqual({ aplicar: {}, pujar: [] });
  });

  it("una dada que el núvol té i el mòbil no, es baixa", () => {
    expect(fusionar(C, buit(), { ...buit(), graella: { dl: {} } }, [])).toEqual({ aplicar: { graella: { dl: {} } }, pujar: [] });
  });
});
