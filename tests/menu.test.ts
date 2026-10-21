import { describe, expect, it } from 'vitest';
import { catalegInicial } from '../src/dades';
import {
  avaluarMenu,
  canviarPlat,
  configuracioDesDeRespostes,
  crearCataleg,
  esCapDeSetmana,
  graellaPerDefecte,
  planificar,
  respostesPerDefecte,
} from '../src/domini';
import { configuracio, ingredients, preus, receptes } from './dades-prova';

const cataleg = crearCataleg(ingredients, receptes, preus);

describe('avaluar el menú', () => {
  it('dona el mateix cost i la mateixa llista que el planificador', () => {
    const config = configuracioDesDeRespostes(respostesPerDefecte());
    const pla = planificar({ cataleg: catalegInicial, configuracio: config, graella: graellaPerDefecte(), llavor: 3 });
    const avaluat = avaluarMenu(catalegInicial, config, pla.apats);
    expect(avaluat.costConsumitCentims).toBe(pla.costConsumitCentims);
    expect(avaluat.llista).toEqual(pla.llista);
  });
});

describe('canviar un plat', () => {
  const config = configuracioDesDeRespostes(respostesPerDefecte());
  const pla = planificar({ cataleg: catalegInicial, configuracio: config, graella: graellaPerDefecte(), llavor: 5 });

  it('canvia només aquell àpat, per un plat que no surt aquella setmana', () => {
    for (let llavor = 0; llavor < 20; llavor++) {
      const nous = canviarPlat(catalegInicial, config, pla.apats, 2, llavor);
      expect(nous).toHaveLength(pla.apats.length);
      nous.forEach((a, i) => (i === 2 ? expect(a.receptaId).not.toBe(pla.apats[2]!.receptaId) : expect(a).toEqual(pla.apats[i])));
      const altres = pla.apats.filter((_, i) => i !== 2).map((a) => a.receptaId);
      expect(altres).not.toContain(nous[2]!.receptaId);
    }
  });

  it('respecta el temps d’aquell dia i porta acompanyament si cal', () => {
    for (let llavor = 0; llavor < 30; llavor++) {
      pla.apats.forEach((apat, index) => {
        const nou = canviarPlat(catalegInicial, config, pla.apats, index, llavor)[index]!;
        const r = catalegInicial.receptes.get(nou.receptaId)!;
        if (!esCapDeSetmana(apat.dia)) expect(r.tempsMinuts).toBeLessThanOrEqual(40);
        expect(Boolean(nou.acompanyamentId)).toBe(Boolean(r.ambAcompanyament));
      });
    }
  });

  it('sense alternatives, no canvia res', () => {
    const unic = crearCataleg(ingredients, [receptes[0]!], preus);
    const apats = [{ dia: 'dl' as const, apat: 'sopar' as const, receptaId: receptes[0]!.id }];
    expect(canviarPlat(unic, configuracio(), apats, 0, 1)).toEqual(apats);
    expect(canviarPlat(cataleg, configuracio(), apats, 5, 1)).toEqual(apats);
  });
});
