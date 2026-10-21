import { describe, expect, it } from 'vitest';
import { catalegInicial } from '../src/dades';
import {
  canviarApat,
  crearCataleg,
  DIES,
  filtrarAcompanyaments,
  filtrarReceptes,
  graellaPerDefecte,
  planificar,
  validarCataleg,
  type ConfiguracioFamilia,
  type Graella,
  type Recepta,
} from '../src/domini';
import { configuracio, ingredients, preus } from './dades-prova';

const acompanyament = (id: string, ingredientId: string, quantitat: number): Recepta => ({
  id,
  nom: id,
  racions: 4,
  tempsMinuts: 15,
  etiquetes: [],
  tipus: 'acompanyament',
  ingredients: [{ ingredientId, quantitat }],
});

// Cost del que es menja per a 4 racions:
const arros = acompanyament('arros-blanc', 'arros', 300); // 0,45 €
const amanida = acompanyament('amanida', 'tomaquet', 400); // 1,00 €
const salmo = acompanyament('guarnicio-salmo', 'salmo', 400); // 8,00 €

/** Truita de doble ús: principal amb amanida o salmó, o acompanyament d’una altra principal. */
const truita: Recepta = {
  id: 'truita',
  nom: 'Truita',
  racions: 4,
  tempsMinuts: 20,
  etiquetes: ['vegetaria'],
  tipus: 'ambdos',
  ambAcompanyament: true,
  acompanyaments: ['amanida', 'guarnicio-salmo'],
  ingredients: [{ ingredientId: 'ou', quantitat: 6 }],
};
/** Admet qualsevol acompanyament, també la truita. */
const pollastre: Recepta = {
  id: 'pollastre',
  nom: 'Pollastre',
  racions: 4,
  tempsMinuts: 25,
  etiquetes: ['carn'],
  ambAcompanyament: true,
  ingredients: [{ ingredientId: 'pollastre', quantitat: 600 }],
};

const receptes = [truita, pollastre, arros, amanida, salmo];
const cataleg = crearCataleg(ingredients, receptes, preus);

function nomesDilluns(): Graella {
  let g = graellaPerDefecte();
  for (const dia of DIES) g = canviarApat(canviarApat(g, dia, 'dinar', false), dia, 'sopar', dia === 'dl');
  return g;
}

const plans = (config: ConfiguracioFamilia = configuracio(), graella: Graella = graellaPerDefecte()) =>
  Array.from({ length: 40 }, (_, llavor) => planificar({ cataleg, configuracio: config, graella, llavor }));

describe('receptes de doble ús', () => {
  it('són a la vegada principals i acompanyaments', () => {
    expect(filtrarReceptes(cataleg, configuracio()).map((r) => r.id)).toEqual(['pollastre', 'truita']);
    expect(filtrarAcompanyaments(cataleg, configuracio()).map((r) => r.id)).toEqual([
      'amanida',
      'arros-blanc',
      'guarnicio-salmo',
      'truita',
    ]);
  });

  it('la truita surt com a principal i també al costat d’una altra principal, però mai d’ella mateixa', () => {
    // A la mateixa setmana, una recepta que ja és principal queda darrere dels acompanyaments no usats.
    const apats = [...plans(), ...plans(configuracio(), nomesDilluns())].flatMap((p) => p.apats);
    expect(apats.some((a) => a.receptaId === 'truita')).toBe(true);
    // Un sol àpat amb pollastre: la truita no s’ha fet servir aquella setmana i pot acompanyar-lo.
    expect(apats.some((a) => a.receptaId === 'pollastre' && a.acompanyamentId === 'truita')).toBe(true);
    for (const a of apats) expect(a.acompanyamentId).not.toBe(a.receptaId);
  });
});

describe('acompanyaments compatibles', () => {
  it('una principal només porta els acompanyaments que admet', () => {
    for (const a of [...plans(), ...plans(configuracio(), nomesDilluns())].flatMap((p) => p.apats)) {
      expect(a.acompanyamentId).toBeDefined();
      if (a.receptaId === 'truita') expect(['amanida', 'guarnicio-salmo']).toContain(a.acompanyamentId);
    }
  });

  it('si tots els acompanyaments que admet queden exclosos, la principal no surt', () => {
    const ids = filtrarReceptes(cataleg, configuracio({ exclosos: ['tomaquet', 'salmo'] })).map((r) => r.id);
    expect(ids).toEqual(['pollastre']);
  });

  it('el pressupost tria l’acompanyament més barat dels admesos, no el més barat de tots', () => {
    const nomesTruita = crearCataleg(ingredients, [truita, arros, amanida, salmo], preus);
    // Ous 1,50 € + amanida 1,00 € = 2,50 € (pressupost: 0,70 € × 4 = 2,80 €).
    // L’arròs (0,45 €) és més barat, però la truita no l’admet.
    for (let llavor = 0; llavor < 20; llavor++) {
      const pla = planificar({
        cataleg: nomesTruita,
        configuracio: configuracio({ pressupostRacioCentims: 70 }),
        graella: nomesDilluns(),
        llavor,
      });
      expect(pla.apats[0]).toMatchObject({ receptaId: 'truita', acompanyamentId: 'amanida' });
      expect(pla.avisos).toEqual([]);
    }
  });

  it('la validació detecta llistes d’acompanyaments incorrectes', () => {
    const errors = (r: Recepta) => validarCataleg(ingredients, [r, arros, amanida, salmo, pollastre], preus);
    expect(errors({ ...truita, acompanyaments: ['patates'] })).toContain(
      'Recepta «truita»: acompanyament desconegut «patates»',
    );
    expect(errors({ ...truita, acompanyaments: ['pollastre'] })).toContain(
      'Recepta «truita»: «pollastre» no és un acompanyament',
    );
    expect(errors({ ...truita, acompanyaments: ['truita'] })).toContain(
      'Recepta «truita»: no es pot acompanyar a si mateixa',
    );
    expect(errors({ ...truita, ambAcompanyament: false })).toContain(
      'Recepta «truita»: indica acompanyaments però no en demana',
    );
    expect(errors(truita)).toEqual([]);
  });
});

describe('catàleg inicial: acompanyaments', () => {
  const apats = Array.from({ length: 60 }, (_, llavor) =>
    planificar({
      cataleg: catalegInicial,
      configuracio: configuracio({
        persones: [
          { nom: 'A', ganaCentesimes: 100 },
          { nom: 'B', ganaCentesimes: 100 },
        ],
      }),
      graella: graellaPerDefecte(),
      llavor,
    }),
  ).flatMap((p) => p.apats);

  it('la truita de patates va amb amanida o pa amb tomàquet', () => {
    for (const a of apats.filter((a) => a.receptaId === 'truita-patates')) {
      expect(['amanida', 'pa-amb-tomaquet']).toContain(a.acompanyamentId);
    }
  });

  it('les patates d’Olot van amb pa amb tomàquet, amanida o puré', () => {
    for (const a of apats.filter((a) => a.receptaId === 'patates-olot')) {
      expect(['pa-amb-tomaquet', 'amanida', 'pure-patata']).toContain(a.acompanyamentId);
    }
  });

  it('la truita de patates també surt d’acompanyament', () => {
    expect(apats.some((a) => a.acompanyamentId === 'truita-patates')).toBe(true);
  });
});
