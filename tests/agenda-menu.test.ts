import { describe, expect, it } from 'vitest';
import { agendaMenu, diaDeLaSetmana, setmanaAgendaInicial, type Apat, type ApatPlanificat, type Dia } from '../src/domini';

const ambData = (data: string, apat: Apat = 'sopar'): ApatPlanificat => ({ dia: diaDeLaSetmana(data), apat, receptaId: 'x', data });
const sensData = (dia: Dia, apat: Apat = 'sopar'): ApatPlanificat => ({ dia, apat, receptaId: 'x' });

/** Dies de l'any 2026 de cada data, per llegir els resultats fàcilment. */
const dates = (agenda: ReturnType<typeof agendaMenu>) =>
  agenda.map((s) => s.apats.map((a) => `${a.origen === 'actual' ? '' : 'ant:'}${a.data!.slice(5)}`));

describe('agenda de la pantalla del menú', () => {
  // Setmanal fet dijous 22 d'octubre: setmana del 19 al 25.
  const setmanal = { creat: '2026-10-22', apats: [sensData('dl'), sensData('dv', 'dinar'), sensData('dv'), sensData('dg')] };
  // Mensual de novembre (comença diumenge 1).
  const novembre = { periode: 'mes' as const, mes: '2026-11', apats: [ambData('2026-11-01'), ambData('2026-11-02', 'dinar'), ambData('2026-11-02')] };

  it('el menú setmanal és una setmana amb dates', () => {
    const agenda = agendaMenu(setmanal, undefined, '2026-10-23');
    expect(agenda.map((s) => s.dilluns)).toEqual(['2026-10-19']);
    expect(dates(agenda)).toEqual([['10-19', '10-23', '10-23', '10-25']]);
  });

  it('amb el mes que ve ja fet, avui i aquesta setmana surten del menú anterior', () => {
    const agenda = agendaMenu(novembre, setmanal, '2026-10-23');
    expect(agenda.map((s) => s.dilluns)).toEqual(['2026-10-19', '2026-10-26', '2026-11-02']);
    expect(dates(agenda)[0]).toEqual(['ant:10-19', 'ant:10-23', 'ant:10-23', 'ant:10-25']);
    expect(dates(agenda)[1]).toEqual(['11-01']);
    expect(setmanaAgendaInicial(agenda, '2026-10-23')).toBe(0);
  });

  it('les setmanes del menú anterior que ja han passat no hi surten', () => {
    const agenda = agendaMenu(novembre, setmanal, '2026-10-27');
    expect(agenda[0]!.dilluns).toBe('2026-10-26');
    expect(agenda.flatMap((s) => s.apats).some((a) => a.origen === 'anterior')).toBe(false);
  });

  it('els dies que cobreix el menú actual no surten del menú anterior', () => {
    // Setmanal anterior (19-25) i mensual de la resta d'octubre fet el dia 23.
    const resta = { periode: 'mes' as const, mes: '2026-10', apats: [ambData('2026-10-23'), ambData('2026-10-24')] };
    expect(dates(agendaMenu(resta, setmanal, '2026-10-23'))).toEqual([['ant:10-19', '10-23', '10-24'], []].filter((s) => s.length > 0));
  });

  it('els dinars van abans que els sopars del mateix dia', () => {
    const agenda = agendaMenu(novembre, undefined, '2026-10-23');
    const segona = agenda[1]!.apats.map((a) => novembre.apats[a.index]!.apat);
    expect(segona).toEqual(['dinar', 'sopar']);
    // Sense la setmana d'avui, s'obre la primera que ve.
    expect(setmanaAgendaInicial(agenda, '2026-10-23')).toBe(0);
  });

  it('un menú antic sense dates és una sola setmana', () => {
    const antic = { apats: [sensData('dl'), sensData('dt')] };
    expect(agendaMenu(antic, setmanal, '2026-10-23')).toEqual([
      { dilluns: '', apats: [{ origen: 'actual', index: 0 }, { origen: 'actual', index: 1 }] },
    ]);
  });
});
