import { describe, expect, it } from 'vitest';
import { catalegInicial } from '../src/dades';
import {
  acompanyamentsDePlat,
  categoriaPlat,
  CATEGORIES_PLAT,
  configuracioDesDeRespostes,
  graellaPerDefecte,
  opcionsDePlat,
  planificar,
  respostesPerDefecte,
  triarPlat,
  type RespostesQuestionari,
} from '../src/domini';

const config = (canvis: Partial<RespostesQuestionari> = {}) => configuracioDesDeRespostes({ ...respostesPerDefecte(), ...canvis });
const pla = planificar({ cataleg: catalegInicial, configuracio: config(), graella: graellaPerDefecte(), llavor: 7 });
const recepta = (id: string) => catalegInicial.receptes.get(id)!;

describe('opcions per triar un plat', () => {
  it('surten tots els plats principals permesos, ordenats per categoria i nom', () => {
    const opcions = opcionsDePlat(catalegInicial, config(), pla.apats, 0);
    const principals = [...catalegInicial.receptes.values()].filter((r) => r.tipus !== 'acompanyament');
    expect(opcions).toHaveLength(principals.length);
    const ordre = opcions.map((o) => CATEGORIES_PLAT.indexOf(o.categoria));
    expect(ordre).toEqual([...ordre].sort((a, b) => a - b));
    expect(opcions.some((o) => o.recepta.tipus === 'acompanyament')).toBe(false);
  });

  it('marca el plat actual, on surten els altres i si passen del temps del dia', () => {
    const opcions = opcionsDePlat(catalegInicial, config(), pla.apats, 0);
    expect(opcions.filter((o) => o.actual).map((o) => o.recepta.id)).toEqual([pla.apats[0]!.receptaId]);
    const segon = opcions.find((o) => o.recepta.id === pla.apats[1]!.receptaId)!;
    expect(segon.usatA).toContain(1);
    // Dilluns (feiner) amb l'opció per defecte: fins a 40 minuts.
    expect(pla.apats[0]!.dia).toBe('dl');
    for (const o of opcions) expect(o.dinsTemps).toBe(o.recepta.tempsMinuts <= 40);
  });

  it('respecta dieta i al·lèrgies: no surt mai res que no es pugui menjar', () => {
    const vegana = opcionsDePlat(catalegInicial, config({ dieta: 'vegana' }), pla.apats, 0);
    expect(vegana.length).toBeGreaterThan(0);
    expect(vegana.every((o) => !['carn', 'peix', 'ou'].includes(o.categoria))).toBe(true);
    const sensePeix = opcionsDePlat(catalegInicial, config({ alergens: ['peix'] }), pla.apats, 0);
    const ambPeix = (id: string) => catalegInicial.ingredients.get(id)?.alergens?.includes('peix') ?? false;
    expect(sensePeix.some((o) => o.recepta.ingredients.some((l) => ambPeix(l.ingredientId)))).toBe(false);
    expect(sensePeix.some((o) => o.recepta.id === 'lluc-forn' || o.recepta.id === 'bacalla-tomaquet')).toBe(false);
  });

  it('categoria: mana la base del plat', () => {
    expect(categoriaPlat(recepta('truita-botifarra-ou'))).toBe('ou');
    expect(categoriaPlat(recepta('patates-olot'))).toBe('carn');
  });
});

describe('triar un plat', () => {
  it('canvia només aquell àpat', () => {
    const opcio = opcionsDePlat(catalegInicial, config(), pla.apats, 3).find((o) => !o.actual && !o.recepta.ambAcompanyament)!;
    const nous = triarPlat(catalegInicial, config(), pla.apats, 3, opcio.recepta.id);
    nous.forEach((a, i) => (i === 3 ? expect(a).toEqual({ dia: pla.apats[3]!.dia, apat: pla.apats[3]!.apat, receptaId: opcio.recepta.id }) : expect(a).toEqual(pla.apats[i])));
  });

  it("un plat que demana acompanyament: el triat, o un d'admès si no se'n tria cap", () => {
    expect(acompanyamentsDePlat(catalegInicial, config(), 'patates-olot').map((a) => a.id).sort()).toEqual(['amanida', 'pa-amb-tomaquet', 'pure-patata']);
    expect(triarPlat(catalegInicial, config(), pla.apats, 0, 'patates-olot', 'amanida')[0]!.acompanyamentId).toBe('amanida');
    const auto = triarPlat(catalegInicial, config(), pla.apats, 0, 'patates-olot')[0]!.acompanyamentId;
    expect(['amanida', 'pa-amb-tomaquet', 'pure-patata']).toContain(auto);
  });

  it('la truita com a principal no es pot acompanyar de si mateixa', () => {
    expect(acompanyamentsDePlat(catalegInicial, config(), 'truita-patates').some((a) => a.id === 'truita-patates')).toBe(false);
  });

  it('no deixa triar un plat prohibit ni un acompanyament que no toca', () => {
    const vegana = config({ dieta: 'vegana' });
    expect(triarPlat(catalegInicial, vegana, pla.apats, 0, 'patates-olot')).toEqual(pla.apats);
    expect(triarPlat(catalegInicial, config(), pla.apats, 0, 'patates-olot', 'arros-blanc')).toEqual(pla.apats);
    expect(triarPlat(catalegInicial, config(), pla.apats, 0, 'no-existeix')).toEqual(pla.apats);
  });
});
