import { catalegInicial } from '../dades';
import { costRecepta, receptari, type ConfiguracioFamilia, type Recepta } from '../domini';
import { textos } from '../textos/ca';
import { h, substituir } from './dom';
import { euros } from './format';

// Receptari complet: totes les receptes que la família pot fer, per categories, per fer un plat a la carta.

const tr = textos.receptari;

export interface DadesReceptari {
  configuracio: ConfiguracioFamilia;
  racionsCentesimes: number;
  /** Text de la cerca (es conserva en tornar d'una recepta). */
  cerca: string;
}

export interface AccionsReceptari {
  obrir: (receptaId: string) => void;
  cercar: (text: string) => void;
}

/** Sense accents ni majúscules, per buscar «arros» i trobar «Arròs». */
const normalitzar = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

function element(r: Recepta, racions: number, obrir: (id: string) => void): HTMLElement {
  const meta = [
    textos.menu.minuts(r.tempsMinuts),
    euros(costRecepta(catalegInicial, r, racions)),
    r.ambAcompanyament ? tr.ambAcompanyament : null,
  ]
    .filter(Boolean)
    .join(' · ');
  return h(
    'li',
    {},
    h(
      'button',
      { type: 'button', class: 'opcio-plat', 'data-plat': r.id, onclick: () => obrir(r.id) },
      h('span', { class: 'opcio-plat__nom' }, r.nom),
      h('span', { class: 'opcio-plat__meta' }, meta),
    ),
  );
}

export function pantallaReceptari(dades: DadesReceptari, accions: AccionsReceptari): HTMLElement {
  const seccions = receptari(catalegInicial, dades.configuracio);
  const total = new Set(seccions.flatMap((s) => s.receptes.map((r) => r.id))).size;
  const llista = h('div', { class: 'triar__llista' });
  let cerca = dades.cerca;

  function pintarLlista(): void {
    const filtre = normalitzar(cerca.trim());
    const visibles = seccions
      .map((s) => ({ ...s, receptes: filtre ? s.receptes.filter((r) => normalitzar(r.nom).includes(filtre)) : s.receptes }))
      .filter((s) => s.receptes.length > 0);
    substituir(
      llista,
      visibles.length === 0 ? h('p', { class: 'avis', role: 'status' }, tr.capResultat) : null,
      ...visibles.map((s) =>
        h(
          'section',
          { class: 'triar__categoria', 'aria-labelledby': `receptari-${s.grup}` },
          h(
            'h2',
            { class: 'triar__titol-categoria', id: `receptari-${s.grup}` },
            `${s.grup === 'acompanyament' ? tr.acompanyaments : textos.triar.categories[s.grup]} `,
            h('span', { class: 'triar__compte' }, `(${s.receptes.length})`),
          ),
          h('ul', { class: 'triar__plats' }, ...s.receptes.map((r) => element(r, dades.racionsCentesimes, accions.obrir))),
        ),
      ),
    );
  }
  pintarLlista();

  return h(
    'main',
    { class: 'pagina triar' },
    h('h1', { class: 'pagina__titol', tabindex: -1 }, tr.titol),
    h('p', { class: 'menu__nota' }, tr.explicacio(total)),
    h(
      'label',
      { class: 'cerca triar__cerca' },
      h('span', { class: 'visualment-amagat' }, tr.cercar),
      h('input', {
        class: 'camp',
        type: 'search',
        placeholder: tr.cercar,
        autocomplete: 'off',
        value: cerca,
        oninput: (e: Event) => {
          cerca = (e.target as HTMLInputElement).value;
          accions.cercar(cerca);
          pintarLlista();
        },
      }),
    ),
    llista,
  );
}
