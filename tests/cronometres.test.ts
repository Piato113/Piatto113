import { describe, expect, it } from 'vitest';
import {
  acabat,
  afegirTemps,
  crearCronometre,
  engegar,
  enMarxa,
  formatRellotge,
  pausar,
  reiniciar,
  restant,
} from '../src/domini';

const T0 = 1_000_000;
const s = (segons: number) => T0 + segons * 1000;

describe('cronòmetres de cuina', () => {
  const c = crearCronometre('arros-blanc', 3, 'Coure l’arròs', 18 * 60);

  it('comença aturat amb tota la durada', () => {
    expect(c.id).toBe('arros-blanc:3');
    expect(restant(c, T0)).toBe(1080);
    expect(enMarxa(c, T0)).toBe(false);
    expect(acabat(c, T0)).toBe(false);
  });

  it('compta a partir de l’hora, encara que la pàgina s’aturi una estona', () => {
    const enMarxaC = engegar(c, T0);
    expect(restant(enMarxaC, s(60))).toBe(1020);
    expect(restant(enMarxaC, s(60.2))).toBe(1020); // arrodoneix cap amunt
    expect(enMarxa(enMarxaC, s(1079))).toBe(true);
    expect(acabat(enMarxaC, s(1080))).toBe(true);
    expect(restant(enMarxaC, s(5000))).toBe(0);
  });

  it('es pot pausar i continuar sense perdre temps', () => {
    const pausat = pausar(engegar(c, T0), s(100));
    expect(restant(pausat, s(500))).toBe(980);
    const represa = engegar(pausat, s(500));
    expect(restant(represa, s(600))).toBe(880);
  });

  it('reiniciar torna a la durada; engegar un d’acabat torna a començar', () => {
    const fet = engegar(c, T0);
    expect(restant(engegar(fet, s(2000)), s(2000))).toBe(1080);
    expect(restant(reiniciar(fet), s(10))).toBe(1080);
  });

  it('es pot afegir o treure temps', () => {
    expect(restant(afegirTemps(c, 60, T0), T0)).toBe(1140);
    const marxa = engegar(c, T0);
    expect(restant(afegirTemps(marxa, 60, s(10)), s(10))).toBe(1130);
    expect(restant(afegirTemps(marxa, -5000, s(10)), s(10))).toBe(0);
    // Un cop acabat, «+1 min» compta des d'ara.
    expect(restant(afegirTemps(marxa, 60, s(2000)), s(2000))).toBe(60);
  });

  it('formata el rellotge', () => {
    expect(formatRellotge(245)).toBe('4:05');
    expect(formatRellotge(720)).toBe('12:00');
    expect(formatRellotge(3729)).toBe('1:02:09');
    expect(formatRellotge(0)).toBe('0:00');
  });
});
