import { describe, expect, it } from 'vitest';
import { catalegInicial } from '../src/dades';
import {
  avaluarMenu,
  canviarPlat,
  comensals,
  configuracioDesDeRespostes,
  conservarAssistencia,
  graellaPerDefecte,
  normalitzarAssistencia,
  planificar,
  racionsApat,
  respostesPerDefecte,
  triarPlat,
  type ApatPlanificat,
  type Persona,
} from '../src/domini';

const familia: Persona[] = [
  { nom: 'Roger', ganaCentesimes: 100 },
  { nom: 'Anna', ganaCentesimes: 100 },
  { nom: 'Pol', ganaCentesimes: 75 },
];

describe('racions d’un àpat', () => {
  it('sense assistència: tota la família', () => {
    expect(racionsApat(familia, {})).toBe(275);
    expect(comensals(familia, undefined)).toBe(3);
  });
  it('treu la gana de qui no hi és i suma una ració normal per convidat', () => {
    expect(racionsApat(familia, { assistencia: { absents: [2], convidats: 0 } })).toBe(200);
    expect(racionsApat(familia, { assistencia: { absents: [0], convidats: 2 } })).toBe(375);
    expect(comensals(familia, { absents: [0], convidats: 2 })).toBe(4);
  });
  it('si no queda ningú a taula, no compta les absències', () => {
    expect(racionsApat(familia, { assistencia: { absents: [0, 1, 2], convidats: 0 } })).toBe(275);
    expect(racionsApat(familia, { assistencia: { absents: [0, 1, 2], convidats: 1 } })).toBe(100);
  });
  it('neteja índexs que no existeixen, repetits i convidats negatius', () => {
    expect(normalitzarAssistencia(familia, { absents: [5, 1, 1, -1], convidats: -3 })).toEqual({ absents: [1], convidats: 0 });
    expect(normalitzarAssistencia(familia, { absents: [], convidats: 0 })).toBeUndefined();
    expect(normalitzarAssistencia(familia, { absents: [], convidats: 99 })).toEqual({ absents: [], convidats: 20 });
  });
});

describe('menú amb convidats', () => {
  const config = configuracioDesDeRespostes(respostesPerDefecte());
  const pla = planificar({ cataleg: catalegInicial, configuracio: config, graella: graellaPerDefecte(), llavor: 11 });
  const ambConvidats: ApatPlanificat[] = pla.apats.map((a, i) => (i === 0 ? { ...a, assistencia: { absents: [], convidats: 4 } } : a));

  it('la compra i el cost creixen només per aquell àpat', () => {
    const abans = avaluarMenu(catalegInicial, config, pla.apats);
    const despres = avaluarMenu(catalegInicial, config, ambConvidats);
    expect(despres.racionsMenuCentesimes - abans.racionsMenuCentesimes).toBe(400);
    expect(despres.costConsumitCentims).toBeGreaterThan(abans.costConsumitCentims);
    // Un àpat amb el doble de gent: el seu plat principal surt amb el doble d'ingredients.
    const nomes = (apats: ApatPlanificat[]) => avaluarMenu(catalegInicial, config, apats.slice(0, 1));
    expect(nomes(ambConvidats).costConsumitCentims).toBeGreaterThan(nomes(pla.apats).costConsumitCentims * 1.9);
  });

  it('canviar o triar el plat conserva qui hi ha a taula', () => {
    expect(canviarPlat(catalegInicial, config, ambConvidats, 0, 3)[0]!.assistencia).toEqual({ absents: [], convidats: 4 });
    expect(triarPlat(catalegInicial, config, ambConvidats, 0, 'cigrons-espinacs')[0]!.assistencia).toEqual({ absents: [], convidats: 4 });
  });

  it('en tornar a fer el menú, es conserva per dia i àpat', () => {
    const nou = planificar({ cataleg: catalegInicial, configuracio: config, graella: graellaPerDefecte(), llavor: 99 }).apats;
    const amb = conservarAssistencia(config.persones, nou, ambConvidats);
    expect(amb[0]!.assistencia).toEqual({ absents: [], convidats: 4 });
    expect(amb.slice(1).every((a) => a.assistencia === undefined)).toBe(true);
  });
});
