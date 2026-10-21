import { catalegInicial } from '../dades';
import { costRecepta, formatNombre, prepararRecepta, textQuantitat } from '../domini';
import { textos } from '../textos/ca';
import { h } from './dom';
import { durada, euros } from './format';

const tr = textos.recepta;

export interface DadesRecepta {
  receptaId: string;
  racionsCentesimes: number;
  persones: number;
  /** Acompanyament amb què es serveix aquest plat al menú, si en té. */
  acompanyamentId?: string;
}

export interface AccionsRecepta {
  tornar: () => void;
  obrir: (receptaId: string) => void;
  cuinar: () => void;
}

export function pantallaRecepta(dades: DadesRecepta, accions: AccionsRecepta): HTMLElement {
  const recepta = catalegInicial.receptes.get(dades.receptaId);
  const tornar = h('button', { type: 'button', class: 'boto boto--petit boto--fantasma tornar', onclick: accions.tornar }, `← ${tr.tornar}`);
  if (!recepta) {
    return h('main', { class: 'pagina' }, tornar, h('h1', { class: 'pagina__titol', tabindex: -1 }, tr.noTrobada));
  }

  const preparada = prepararRecepta(catalegInicial, recepta, dades.racionsCentesimes);
  const cost = costRecepta(catalegInicial, recepta, dades.racionsCentesimes);
  const acompanyament = dades.acompanyamentId ? catalegInicial.receptes.get(dades.acompanyamentId) : undefined;

  return h(
    'main',
    { class: 'pagina recepta' },
    tornar,
    recepta.tipus === 'acompanyament' ? h('p', { class: 'apat__quan' }, tr.acompanyament) : null,
    h('h1', { class: 'pagina__titol', tabindex: -1 }, recepta.nom),
    h('p', { class: 'recepta__meta' }, `${tr.temps(recepta.tempsMinuts)} · ${euros(cost)}`),
    h('p', { class: 'menu__nota' }, tr.perA(dades.persones, formatNombre(dades.racionsCentesimes / 100))),
    h('button', { type: 'button', class: 'boto boto--principal boto--gran recepta__cuinar', onclick: accions.cuinar }, `👩‍🍳 ${textos.cuinar.comencar}`),
    acompanyament
      ? h(
          'p',
          { class: 'recepta__acompanyament' },
          `${tr.ambPlat} `,
          h(
            'button',
            { type: 'button', class: 'enllac', onclick: () => accions.obrir(acompanyament.id) },
            acompanyament.nom.toLowerCase(),
          ),
        )
      : null,

    h('h2', { class: 'recepta__seccio' }, tr.ingredients),
    h(
      'ul',
      { class: 'ingredients-recepta' },
      ...preparada.ingredients.map((linia) => {
        const ing = catalegInicial.ingredients.get(linia.ingredientId);
        return h(
          'li',
          { class: 'ingredient' },
          h('span', { class: 'ingredient__quantitat' }, textQuantitat(linia)),
          h(
            'span',
            { class: 'ingredient__nom' },
            ing?.nom ?? linia.ingredientId,
            ing?.rebost ? h('span', { class: 'ingredient__rebost' }, ` · ${tr.rebost}`) : null,
          ),
        );
      }),
    ),

    h('h2', { class: 'recepta__seccio' }, tr.preparacio),
    h(
      'ol',
      { class: 'passos' },
      ...preparada.passos.map((pas) =>
        h(
          'li',
          { class: 'pas-recepta' },
          h('span', { class: 'pas-recepta__numero', 'aria-hidden': 'true' }, String(pas.numero)),
          h(
            'div',
            { class: 'pas-recepta__cos' },
            h('p', { class: 'pas-recepta__text' }, pas.text),
            pas.cronometre
              ? h('p', { class: 'pas-recepta__cronometre' }, `⏱ ${tr.cronometre(durada(pas.cronometre.segons), pas.cronometre.nom)}`)
              : null,
          ),
        ),
      ),
    ),
  );
}
