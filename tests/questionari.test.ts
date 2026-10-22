import { describe, expect, it } from 'vitest';
import { catalegInicial, ingredients as ingredientsInicials, ingredientsAmbAlergens } from '../src/dades';
import {
  ALERGENS,
  canviarApat,
  configuracioDesDeRespostes,
  crearCataleg,
  DIES,
  esCapDeSetmana,
  filtrarReceptes,
  llegirRespostes,
  planificar,
  PRESSUPOST_RACIO,
  respostesPerDefecte,
  type ConfiguracioFamilia,
  type Graella,
  type Ingredient,
  type Recepta,
} from '../src/domini';
import { textos } from '../src/textos/ca';
import { configuracio, graellaNouApats, ingredients, preus, receptes } from './dades-prova';

const cataleg = crearCataleg(ingredients, receptes, preus);

function nomesDilluns(): Graella {
  let g = graellaNouApats();
  for (const dia of DIES) g = canviarApat(canviarApat(g, dia, 'dinar', false), dia, 'sopar', dia === 'dl');
  return g;
}

const plans = (config: ConfiguracioFamilia, graella: Graella = graellaNouApats(), quants = 40, cat = cataleg) =>
  Array.from({ length: quants }, (_, llavor) => planificar({ cataleg: cat, configuracio: config, graella, llavor }));

/** Quantes vegades surt una recepta al sopar de dilluns en 400 llavors. */
const vegadesDilluns = (config: ConfiguracioFamilia, id: string, cat = cataleg): number =>
  plans(config, nomesDilluns(), 400, cat).filter((p) => p.apats[0]?.receptaId === id).length;

describe('temps per tipus de dia', () => {
  // Dades de prova: truita 30 min, salmó 25, arròs amb pollastre 45, llenties 60.
  const mixt = configuracio({ tempsMaximMinuts: { feiners: 30, capDeSetmana: null } });

  it('entre setmana només plats ràpids; el cap de setmana, també els llargs', () => {
    const apats = plans(mixt).flatMap((p) => p.apats);
    for (const a of apats.filter((a) => !esCapDeSetmana(a.dia))) expect(['truita', 'salmo']).toContain(a.receptaId);
    const capDeSetmana = apats.filter((a) => esCapDeSetmana(a.dia)).map((a) => a.receptaId);
    expect(capDeSetmana).toContain('llenties');
    expect(capDeSetmana).toContain('arros-pollastre');
  });

  it('avisa si algun dia no té cap recepta possible', () => {
    const pla = planificar({
      cataleg,
      configuracio: configuracio({ tempsMaximMinuts: { feiners: 10, capDeSetmana: null } }),
      graella: graellaNouApats(),
      llavor: 1,
    });
    expect(pla.avisos).toEqual([{ codi: 'cap-recepta-valida' }]);
  });
});

describe('etiquetes excloses i evitades', () => {
  it('«gens de peix» treu les receptes de peix', () => {
    expect(filtrarReceptes(cataleg, configuracio({ etiquetesExcloses: ['peix'] })).map((r) => r.id)).not.toContain(
      'salmo',
    );
  });

  it('«poc peix» el fa sortir menys, però pot sortir', () => {
    const normal = vegadesDilluns(configuracio(), 'salmo');
    const poc = vegadesDilluns(configuracio({ etiquetesEvitades: ['peix'] }), 'salmo');
    expect(poc).toBeGreaterThan(0);
    expect(poc).toBeLessThan(normal / 2);
  });
});

describe('al·lèrgens', () => {
  const ambAlergens: Ingredient[] = ingredients.map((i) =>
    i.id === 'ou' ? { ...i, alergens: ['ou'] } : i.id === 'salmo' ? { ...i, alergens: ['peix'] } : i,
  );
  const guarnicio: Recepta = {
    id: 'guarnicio-ou',
    nom: 'Guarnició amb ou',
    racions: 4,
    tempsMinuts: 10,
    etiquetes: [],
    tipus: 'acompanyament',
    ingredients: [{ ingredientId: 'ou', quantitat: 2 }],
  };
  const arrosBlanc: Recepta = { ...guarnicio, id: 'arros-blanc', ingredients: [{ ingredientId: 'arros', quantitat: 300 }] };
  const pollastre: Recepta = {
    id: 'pollastre',
    nom: 'Pollastre',
    racions: 4,
    tempsMinuts: 20,
    etiquetes: ['carn'],
    ambAcompanyament: true,
    ingredients: [{ ingredientId: 'pollastre', quantitat: 600 }],
  };
  const cat = crearCataleg(ambAlergens, [...receptes, pollastre, guarnicio, arrosBlanc], preus);

  it('cap recepta amb un al·lergen de la família, tampoc als acompanyaments', () => {
    const config = configuracio({ alergens: ['ou', 'peix'] });
    expect(filtrarReceptes(cat, config).map((r) => r.id)).toEqual(['arros-pollastre', 'llenties', 'pollastre']);
    for (const a of plans(config, graellaNouApats(), 30, cat).flatMap((p) => p.apats)) {
      if (a.acompanyamentId) expect(a.acompanyamentId).toBe('arros-blanc');
    }
  });
});

describe('receptari variat i equilibrat', () => {
  const plat = (id: string, etiquetes: string[]): Recepta => ({
    id,
    nom: id,
    racions: 4,
    tempsMinuts: 20,
    etiquetes,
    ingredients: [{ ingredientId: 'arros', quantitat: 100 }],
  });
  const receptari = [
    ...Array.from({ length: 10 }, (_, i) => plat(`carn-${i}`, ['carn'])),
    plat('peix-1', ['peix']),
    plat('peix-2', ['peix']),
    plat('llegums-1', ['llegums']),
    plat('llegums-2', ['llegums']),
    plat('pasta-1', ['pasta']),
    plat('ou-1', ['ou']),
  ];
  const cat = crearCataleg(ingredients, receptari, preus);
  const grup = (id: string) => id.split('-')[0];
  const seguitsIguals = (config: ConfiguracioFamilia) =>
    plans(config, graellaNouApats(), 40, cat).reduce((total, p) => {
      const ids = p.apats.map((a) => a.receptaId);
      return total + ids.slice(1).filter((id, i) => grup(id) === grup(ids[i]!)).length;
    }, 0);
  const carnPerSetmana = (config: ConfiguracioFamilia) =>
    plans(config, graellaNouApats(), 40, cat).flatMap((p) => p.apats).filter((a) => grup(a.receptaId) === 'carn')
      .length / 40;

  it('no posa el mateix grup dos àpats seguits', () => {
    expect(seguitsIguals(configuracio())).toBeGreaterThan(0);
    expect(seguitsIguals(configuracio({ equilibrat: true }))).toBe(0);
  });

  it('reparteix els grups encara que el receptari tingui molta carn', () => {
    // Sense equilibri, 10 de 16 plats són de carn: ~5,6 de 9 àpats. Amb equilibri, com a molt 5 (alternats).
    expect(carnPerSetmana(configuracio())).toBeGreaterThan(5);
    expect(carnPerSetmana(configuracio({ equilibrat: true }))).toBeLessThanOrEqual(5);
  });
});

describe('receptari econòmic', () => {
  it('els plats barats surten més sovint', () => {
    // Truita (1,80 €) contra salmó (16,75 €).
    const normal = vegadesDilluns(configuracio(), 'truita');
    const economic = vegadesDilluns(configuracio({ economic: true }), 'truita');
    expect(economic).toBeGreaterThan(normal * 1.3);
    expect(vegadesDilluns(configuracio({ economic: true }), 'salmo')).toBeLessThan(vegadesDilluns(configuracio(), 'salmo'));
  });
});

describe('qüestionari', () => {
  it('tradueix les respostes a la configuració', () => {
    const config = configuracioDesDeRespostes({
      ...respostesPerDefecte(),
      receptari: ['variat', 'economic'],
      pressupost: 'economic',
      temps: 'rapid',
      peix: 'gens',
      exclosos: ['col'],
      alergens: ['gluten'],
    });
    expect(config).toMatchObject({
      equilibrat: true,
      economic: true,
      pressupostRacioCentims: 200,
      tempsMaximMinuts: { feiners: 40, capDeSetmana: 40 },
      origensExclosos: ['peix'],
      etiquetesEvitades: [],
      exclosos: ['col'],
      alergens: ['gluten'],
    });
    const mixt = configuracioDesDeRespostes({ ...respostesPerDefecte(), temps: 'mixt', peix: 'poc', pressupost: 'flexible' });
    expect(mixt).toMatchObject({
      tempsMaximMinuts: { feiners: 40, capDeSetmana: null },
      etiquetesEvitades: ['peix'],
      pressupostRacioCentims: null,
    });
  });

  it('el pressupost de les opcions és el de quatre persones: 8 € i 14 € per àpat', () => {
    expect(PRESSUPOST_RACIO.economic! * 4).toBe(800);
    expect(PRESSUPOST_RACIO.mitja! * 4).toBe(1400);
  });

  it('té textos per a totes les opcions i tots els al·lèrgens', () => {
    for (const a of ALERGENS) expect(textos.alergens[a]).toBeTruthy();
    expect(Object.keys(textos.questionari.pressupost.opcions)).toEqual(Object.keys(PRESSUPOST_RACIO));
  });
});

describe('catàleg inicial amb el qüestionari', () => {
  it('els al·lèrgens estan assignats a ingredients que existeixen', () => {
    const ids = new Set(ingredientsInicials.map((i) => i.id));
    expect(ingredientsAmbAlergens.filter((id) => !ids.has(id))).toEqual([]);
  });

  it('amb les respostes per defecte, la setmana surt sense avisos i dins del pressupost', () => {
    const config = configuracioDesDeRespostes(respostesPerDefecte());
    for (const pla of plans(config, graellaNouApats(), 20, catalegInicial)) {
      expect(pla.avisos).toEqual([]);
      expect(pla.costConsumitCentims).toBeLessThanOrEqual(350 * 4 * 9);
      for (const a of pla.apats.filter((a) => !esCapDeSetmana(a.dia))) {
        expect(catalegInicial.receptes.get(a.receptaId)!.tempsMinuts).toBeLessThanOrEqual(40);
      }
    }
  });

  it('el pressupost econòmic (8 € per àpat de quatre) és assolible', () => {
    const config = configuracioDesDeRespostes({ ...respostesPerDefecte(), pressupost: 'economic' });
    for (const pla of plans(config, graellaNouApats(), 20, catalegInicial)) {
      expect(pla.avisos).toEqual([]);
      expect(pla.costConsumitCentims).toBeLessThanOrEqual(200 * 4 * 9);
    }
  });

  it('sense gluten, cap ingredient del menú en porta', () => {
    const config = configuracioDesDeRespostes({ ...respostesPerDefecte(), alergens: ['gluten'] });
    for (const pla of plans(config, graellaNouApats(), 20, catalegInicial)) {
      for (const e of pla.llista.elements) {
        expect(catalegInicial.ingredients.get(e.ingredientId)?.alergens ?? [], e.ingredientId).not.toContain('gluten');
      }
    }
  });
});

describe('respostes desades', () => {
  it('llegeix unes respostes vàlides tal com són', () => {
    const r = { ...respostesPerDefecte(), receptari: ['economic'], alergens: ['gluten'], exclosos: ['col'] };
    expect(llegirRespostes(JSON.parse(JSON.stringify(r)), ALERGENS)).toEqual(r);
  });

  it('corregeix camps no vàlids i descarta les dades sense persones', () => {
    expect(llegirRespostes(null, ALERGENS)).toBeNull();
    expect(llegirRespostes({ persones: [] }, ALERGENS)).toBeNull();
    expect(
      llegirRespostes(
        {
          persones: [{ nom: '  ', ganaCentesimes: 9999 }, 'x'],
          receptari: ['variat', 'variat', 'contundent'],
          pressupost: 'car',
          alergens: ['gluten', 'inventat'],
          exclosos: ['col', 3],
        },
        ALERGENS,
      ),
    ).toEqual({
      persones: [{ nom: 'Persona 1', ganaCentesimes: 300 }],
      receptari: ['variat'],
      pressupost: 'mitja',
      temps: 'mixt',
      dieta: 'omnivora',
      carn: 'normal',
      peix: 'normal',
      exclosos: ['col'],
      alergens: ['gluten'],
      // Respostes d'abans de la pregunta dels aparells: forn, microones i batedora.
      aparells: ['forn', 'microones', 'batedora'],
    });
  });
});

describe('dieta', () => {
  const amb = (canvis: Partial<ReturnType<typeof respostesPerDefecte>>) =>
    configuracioDesDeRespostes({ ...respostesPerDefecte(), ...canvis });

  it('la dieta mana sobre les respostes de carn i peix', () => {
    expect(amb({ dieta: 'omnivora', carn: 'poc', peix: 'gens' })).toMatchObject({
      origensExclosos: ['peix'],
      etiquetesEvitades: ['carn'],
    });
    expect(amb({ dieta: 'pescetariana', carn: 'normal', peix: 'poc' })).toMatchObject({
      origensExclosos: ['carn'],
      etiquetesEvitades: ['peix'],
    });
    expect(amb({ dieta: 'vegetariana', carn: 'normal', peix: 'normal' })).toMatchObject({
      origensExclosos: ['carn', 'peix'],
      etiquetesEvitades: [],
    });
    expect(amb({ dieta: 'vegana' }).origensExclosos).toEqual(['carn', 'peix', 'derivat']);
  });

  it('l’origen dels ingredients es dedueix de la secció, els al·lèrgens i els casos explícits', () => {
    const origen = (id: string) => catalegInicial.ingredients.get(id)?.origen;
    expect(origen('entrecot')).toBe('carn');
    expect(origen('brou-pollastre')).toBe('carn');
    expect(origen('raviolis')).toBe('derivat');
    expect(origen('lluc')).toBe('peix');
    expect(origen('fumet')).toBe('peix');
    expect(origen('tonyina')).toBe('peix');
    expect(origen('ou')).toBe('derivat');
    expect(origen('mozzarella')).toBe('derivat');
    expect(origen('mel')).toBe('derivat');
    expect(origen('patata')).toBeUndefined();
    expect(origen('brou-verdures')).toBeUndefined();
  });

  for (const [dieta, prohibits] of [
    ['pescetariana', ['carn']],
    ['vegetariana', ['carn', 'peix']],
    ['vegana', ['carn', 'peix', 'derivat']],
  ] as const) {
    it(`menú ${dieta}: cap ingredient de ${prohibits.join(', ')}`, () => {
      const config = amb({ dieta });
      for (const pla of plans(config, graellaNouApats(), 10, catalegInicial)) {
        for (const e of pla.llista.elements) {
          const origen = catalegInicial.ingredients.get(e.ingredientId)?.origen;
          if (origen) expect(prohibits as readonly string[], e.ingredientId).not.toContain(origen);
        }
      }
    });
  }
});
