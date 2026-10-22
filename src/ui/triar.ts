import { catalegInicial } from '../dades';
import {
  acompanyamentsDePlat,
  CATEGORIES_PLAT,
  costRecepta,
  esCapDeSetmana,
  opcionsDePlat,
  type ApatPlanificat,
  type ConfiguracioFamilia,
  type OpcioPlat,
  type Recepta,
} from '../domini';
import { textos } from '../textos/ca';
import { h, substituir } from './dom';
import { euros } from './format';

// Triar a mà el plat d'un àpat del menú: tots els plats que la família pot menjar, per categories.
// Si el plat triat demana acompanyament, un segon pas demana quin.

const t = textos.triar;

export interface DadesTriar {
  configuracio: ConfiguracioFamilia;
  apats: ApatPlanificat[];
  index: number;
  racionsCentesimes: number;
  /** Segon pas: plat ja triat que demana acompanyament. */
  receptaId?: string;
}

export interface AccionsTriar {
  tornar: () => void;
  /** Plat triat (amb acompanyament o sense). */
  triar: (receptaId: string, acompanyamentId?: string) => void;
  /** El plat triat demana acompanyament: passa al segon pas. */
  demanarAcompanyament: (receptaId: string) => void;
  atzar: () => void;
}

/** Sense accents ni majúscules, per buscar «arros» i trobar «Arròs». */
const normalitzar = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

const nomApat = (a: ApatPlanificat): string => t.quin(textos.apats[a.apat], textos.dies[a.dia]);

function botoTornar(tornar: () => void): HTMLElement {
  return h('button', { type: 'button', class: 'boto boto--petit boto--fantasma tornar', onclick: tornar }, `← ${textos.recepta.tornar}`);
}

function opcio(o: OpcioPlat, dades: DadesTriar, accions: AccionsTriar): HTMLElement {
  const r = o.recepta;
  const { feiners, capDeSetmana } = dades.configuracio.tempsMaximMinuts;
  const limit = esCapDeSetmana(dades.apats[dades.index]!.dia) ? capDeSetmana : feiners;
  const meta = [
    textos.menu.minuts(r.tempsMinuts),
    `${euros(costRecepta(catalegInicial, r, dades.racionsCentesimes))}${r.ambAcompanyament ? ` ${t.ambAcompanyament}` : ''}`,
  ].join(' · ');
  const notes = [
    o.actual ? t.actual : null,
    o.usatA.length > 0 ? t.jaSurt(o.usatA.map((i) => nomApat(dades.apats[i]!).toLowerCase()).join(', ')) : null,
    !o.dinsTemps && limit !== null ? t.passaTemps(limit) : null,
    o.barbacoaEntreSetmana ? t.barbacoa : null,
    dades.configuracio.valoracions?.[r.id] === 'agrada'
      ? textos.menu.valoracio.marcaAgrada
      : dades.configuracio.valoracions?.[r.id] === 'no-agrada'
        ? textos.menu.valoracio.marcaNoAgrada
        : null,
  ].filter((x): x is string => x !== null);
  return h(
    'li',
    {},
    h(
      'button',
      {
        type: 'button',
        class: `opcio-plat${o.actual ? ' opcio-plat--actual' : ''}`,
        'data-plat': r.id,
        'aria-current': o.actual ? 'true' : false,
        onclick: () => (o.actual && !r.ambAcompanyament ? accions.tornar() : r.ambAcompanyament ? accions.demanarAcompanyament(r.id) : accions.triar(r.id)),
      },
      h('span', { class: 'opcio-plat__nom' }, r.nom),
      h('span', { class: 'opcio-plat__meta' }, meta),
      ...notes.map((n) => h('span', { class: `opcio-plat__nota${n === t.actual ? ' opcio-plat__nota--actual' : ''}` }, n)),
    ),
  );
}

function pasPlat(dades: DadesTriar, accions: AccionsTriar): HTMLElement {
  const apat = dades.apats[dades.index]!;
  const opcions = opcionsDePlat(catalegInicial, dades.configuracio, dades.apats, dades.index);
  const llista = h('div', { class: 'triar__llista' });
  let cerca = '';

  function pintarLlista(): void {
    const filtre = normalitzar(cerca.trim());
    const visibles = filtre ? opcions.filter((o) => normalitzar(o.recepta.nom).includes(filtre)) : opcions;
    const grups = CATEGORIES_PLAT.map((c) => ({ c, plats: visibles.filter((o) => o.categoria === c) })).filter((g) => g.plats.length > 0);
    substituir(
      llista,
      grups.length === 0 ? h('p', { class: 'avis', role: 'status' }, t.capResultat) : null,
      ...grups.map(({ c, plats }) =>
        h(
          'section',
          { class: 'triar__categoria', 'aria-labelledby': `categoria-${c}` },
          h('h2', { class: 'triar__titol-categoria', id: `categoria-${c}` }, `${t.categories[c]} `, h('span', { class: 'triar__compte' }, `(${plats.length})`)),
          h('ul', { class: 'triar__plats' }, ...plats.map((o) => opcio(o, dades, accions))),
        ),
      ),
    );
  }
  pintarLlista();

  return h(
    'main',
    { class: 'pagina triar' },
    botoTornar(accions.tornar),
    h('p', { class: 'apat__quan' }, nomApat(apat)),
    h('h1', { class: 'pagina__titol', tabindex: -1 }, t.titol),
    h('button', { type: 'button', class: 'boto boto--secundari triar__atzar', onclick: accions.atzar }, `🎲 ${t.atzar}`),
    h(
      'label',
      { class: 'cerca triar__cerca' },
      h('span', { class: 'visualment-amagat' }, t.cercar),
      h('input', {
        class: 'camp',
        type: 'search',
        placeholder: t.cercar,
        autocomplete: 'off',
        oninput: (e: Event) => {
          cerca = (e.target as HTMLInputElement).value;
          pintarLlista();
        },
      }),
    ),
    llista,
  );
}

function pasAcompanyament(dades: DadesTriar, plat: Recepta, accions: AccionsTriar): HTMLElement {
  const apat = dades.apats[dades.index]!;
  const possibles = acompanyamentsDePlat(catalegInicial, dades.configuracio, plat.id);
  const usats = (id: string): ApatPlanificat[] =>
    dades.apats.filter((a, i) => i !== dades.index && (a.receptaId === id || a.acompanyamentId === id));
  return h(
    'main',
    { class: 'pagina triar' },
    botoTornar(accions.tornar),
    h('p', { class: 'apat__quan' }, nomApat(apat)),
    h('h1', { class: 'pagina__titol', tabindex: -1 }, t.titolAcompanyament),
    h('p', { class: 'menu__nota' }, t.plat(plat.nom)),
    h(
      'ul',
      { class: 'triar__plats triar__plats--acompanyaments' },
      ...possibles.map((a) => {
        const actual = apat.receptaId === plat.id && apat.acompanyamentId === a.id;
        const altres = usats(a.id);
        return h(
          'li',
          {},
          h(
            'button',
            {
              type: 'button',
              class: `opcio-plat${actual ? ' opcio-plat--actual' : ''}`,
              'data-acompanyament': a.id,
              'aria-current': actual ? 'true' : false,
              onclick: () => accions.triar(plat.id, a.id),
            },
            h('span', { class: 'opcio-plat__nom' }, a.nom),
            h(
              'span',
              { class: 'opcio-plat__meta' },
              `${textos.menu.minuts(a.tempsMinuts)} · ${euros(costRecepta(catalegInicial, a, dades.racionsCentesimes))}`,
            ),
            actual ? h('span', { class: 'opcio-plat__nota opcio-plat__nota--actual' }, t.actual) : null,
            altres.length > 0 ? h('span', { class: 'opcio-plat__nota' }, t.jaSurt(altres.map((x) => nomApat(x).toLowerCase()).join(', '))) : null,
          ),
        );
      }),
    ),
  );
}

export function pantallaTriar(dades: DadesTriar, accions: AccionsTriar): HTMLElement {
  const plat = dades.receptaId ? catalegInicial.receptes.get(dades.receptaId) : undefined;
  return plat?.ambAcompanyament ? pasAcompanyament(dades, plat, accions) : pasPlat(dades, accions);
}
