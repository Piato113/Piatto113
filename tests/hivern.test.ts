import { describe, expect, it } from 'vitest';
import { catalegInicial } from '../src/dades';
import { ACOMPANYAMENTS_CREMA, receptesHivern } from '../src/dades/receptes-hivern';
import { temporadesReceptes } from '../src/dades/temporades';
import {
  acompanyamentsAdmesos,
  APARELLS,
  canviarPlat,
  configuracioDesDeRespostes,
  diesDelMes,
  enTemporada,
  factorTemporada,
  filtrarAcompanyaments,
  filtrarReceptes,
  graellaPerDefecte,
  MESOS_HIVERN,
  PES_FORA_TEMPORADA,
  PES_TEMPORADA,
  planificar,
  potSerAcompanyament,
  respostesPerDefecte,
  validarCataleg,
  type Graella,
  type Recepta,
  type RespostesQuestionari,
} from '../src/domini';
import { ingredients, preus, receptes as receptesProva } from './dades-prova';

const receptes = [...catalegInicial.receptes.values()];
const recepta = (id: string): Recepta => catalegInicial.receptes.get(id)!;
const configuracio = (canvis: Partial<RespostesQuestionari> = {}) =>
  configuracioDesDeRespostes({ ...respostesPerDefecte(), temps: 'sense-limit', pressupost: 'flexible', aparells: [...APARELLS], ...canvis });
const totsElsDies = (): Graella => {
  const g = graellaPerDefecte();
  for (const dia of Object.keys(g) as (keyof Graella)[]) g[dia] = { dinar: true, sopar: true };
  return g;
};
const esHivern = (id: string): boolean => recepta(id).mesos !== undefined && recepta(id).mesos!.includes(1);

describe('receptes d’hivern', () => {
  it('hi ha 24 plats i 4 acompanyaments de crema, i tots tenen preparació', () => {
    const acompanyaments = receptesHivern.filter((r) => r.tipus === 'acompanyament');
    expect(receptesHivern.length - acompanyaments.length).toBe(24);
    expect(acompanyaments).toHaveLength(4);
    for (const r of receptesHivern) expect(recepta(r.id).passos?.length, r.id).toBeGreaterThan(1);
  });

  it('les cremes (també les d’abans) sempre porten un acompanyament de crema', () => {
    const cremes = receptes.filter((r) => r.nom.startsWith('Crema '));
    expect(cremes.length).toBeGreaterThanOrEqual(13);
    for (const r of cremes) {
      expect(r.ambAcompanyament, r.id).toBe(true);
      expect(r.acompanyaments, r.id).toEqual(ACOMPANYAMENTS_CREMA);
    }
  });

  it('els acompanyaments de crema no surten amb les principals que no els tenen a la llista', () => {
    const acompanyaments = receptes.filter(potSerAcompanyament);
    const senseLlista = receptes.filter((r) => r.ambAcompanyament && r.acompanyaments === undefined);
    expect(senseLlista.length).toBeGreaterThan(0);
    for (const r of senseLlista) {
      const ids = acompanyamentsAdmesos(r, acompanyaments).map((a) => a.id);
      for (const id of ['truita-francesa', 'torrades-pernil-formatge', 'hummus-torrades', 'croquetes-fregides']) expect(ids, r.id).not.toContain(id);
    }
  });

  it('una família vegana també pot menjar cremes (amb hummus)', () => {
    const vegana = configuracio({ dieta: 'vegana' });
    expect(filtrarReceptes(catalegInicial, vegana).map((r) => r.id)).toContain('crema-broquil-alvocat');
    expect(filtrarAcompanyaments(catalegInicial, vegana).map((r) => r.id)).toContain('hummus-torrades');
  });

  it('els plats d’hivern són de novembre a març, i els calçots de gener a abril', () => {
    for (const id of Object.keys(temporadesReceptes)) expect(catalegInicial.receptes.has(id), id).toBe(true);
    expect(recepta('crema-xampinyons').mesos).toEqual([...MESOS_HIVERN]);
    expect(recepta('calcotada').mesos).toEqual([1, 2, 3, 4]);
    expect(recepta('salmo-pesto-ruca').mesos).toBeUndefined();
  });
});

describe('temporada', () => {
  it('pes: més en temporada, molt menys fora, igual sense temporada o sense mes', () => {
    const hivern = recepta('crema-xampinyons');
    expect(factorTemporada(hivern, 1)).toBe(PES_TEMPORADA);
    expect(factorTemporada(hivern, 7)).toBe(PES_FORA_TEMPORADA);
    expect(factorTemporada(hivern, undefined)).toBe(1);
    expect(factorTemporada(recepta('paella'), 7)).toBe(1);
    expect(enTemporada(hivern, 7)).toBe(false);
    expect(enTemporada(hivern, 12)).toBe(true);
  });

  /** Plats d'hivern als menús d'unes quantes llavors. */
  const platsHivern = (mes: number): number => {
    let n = 0;
    for (let llavor = 1; llavor <= 30; llavor++) {
      const pla = planificar({ cataleg: catalegInicial, configuracio: configuracio(), graella: totsElsDies(), llavor, mes });
      n += pla.apats.filter((a) => esHivern(a.receptaId)).length;
    }
    return n;
  };

  it('els plats d’hivern surten molt més al gener que al juliol', () => {
    const gener = platsHivern(1);
    const juliol = platsHivern(7);
    expect(gener).toBeGreaterThan(juliol * 3);
    expect(juliol).toBeGreaterThan(0); // fora de temporada no desapareixen
  });

  it('el menú mensual agafa el mes dels dies', () => {
    const menus = (mes: string): number => {
      let n = 0;
      for (let llavor = 1; llavor <= 5; llavor++) {
        const pla = planificar({ cataleg: catalegInicial, configuracio: configuracio(), graella: totsElsDies(), llavor, dies: diesDelMes(mes, `${mes}-01`) });
        n += pla.apats.filter((a) => esHivern(a.receptaId)).length;
      }
      return n;
    };
    expect(menus('2027-01')).toBeGreaterThan(menus('2027-07') * 2);
  });

  it('«Tria’n un a l’atzar» prefereix els plats de temporada', () => {
    const pla = planificar({ cataleg: catalegInicial, configuracio: configuracio(), graella: totsElsDies(), llavor: 4, mes: 7 });
    for (let llavor = 1; llavor <= 40; llavor++) {
      const apats = canviarPlat(catalegInicial, configuracio(), pla.apats, 3, llavor, 7);
      expect(esHivern(apats[3]!.receptaId), apats[3]!.receptaId).toBe(false);
    }
  });

  it('la validació detecta mesos incorrectes i acompanyaments només per a llista que ningú no fa servir', () => {
    const errors = validarCataleg(ingredients, [
      ...receptesProva,
      { ...receptesProva[0]!, id: 'mal-mes', mesos: [0, 13] },
      { ...receptesProva[0]!, id: 'sol', tipus: 'acompanyament', nomesAmbLlista: true },
    ], preus);
    expect(errors).toContain('Recepta «mal-mes»: mesos de temporada no vàlids');
    expect(errors).toContain('Recepta «sol»: és només per a llista però cap principal no la té');
  });
});
