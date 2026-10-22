import { catalegInicial } from '../dades';
import { costRecepta, formatNombre, generarLlista, prepararRecepta, textQuantitat } from '../domini';
import { textos } from '../textos/ca';
import { h } from './dom';
import { detallCompra, quantitatCompra, textLlista } from './compra';
import { iconaAparell } from './icones';
import { durada, euros } from './format';

const tr = textos.recepta;

export interface DadesRecepta {
  receptaId: string;
  racionsCentesimes: number;
  persones: number;
  /** Acompanyament amb què es serveix aquest plat al menú, si en té. */
  acompanyamentId?: string;
  /** Acompanyaments que hi van bé, quan el plat en demana i no se n'ha triat cap (receptari). */
  suggeriments?: string[];
}

export interface AccionsRecepta {
  tornar: () => void;
  obrir: (receptaId: string) => void;
  cuinar: () => void;
  /** Comparteix (o copia) un text; retorna el missatge a mostrar, si n'hi ha. */
  compartir: (text: string) => Promise<string | null>;
}

/** Què cal comprar per fer només aquest plat: paquets, preu i el que ha de ser al rebost. */
function compraDelPlat(receptaId: string, racionsCentesimes: number, persones: number, compartir: AccionsRecepta['compartir']): HTMLElement {
  const llista = generarLlista(catalegInicial, [receptaId], racionsCentesimes);
  const aComprar = llista.elements.filter((e) => !e.rebost);
  const rebost = llista.elements.filter((e) => e.rebost);
  const nom = catalegInicial.receptes.get(receptaId)?.nom ?? receptaId;
  const estat = h('p', { class: 'menu__nota', role: 'status' });
  return h(
    'details',
    { class: 'compra-plat' },
    h('summary', { class: 'compra-plat__titol' }, `🛒 ${tr.compra(euros(llista.totalCompraCentims))}`),
    h('p', { class: 'menu__nota' }, tr.compraAjuda),
    h(
      'ul',
      { class: 'compra-plat__llista' },
      ...aComprar.map((e) =>
        h(
          'li',
          { class: 'compra-plat__producte' },
          h(
            'span',
            { class: 'producte__text' },
            h('span', { class: 'producte__nom' }, e.nom),
            h('span', { class: 'producte__quantitat' }, [quantitatCompra(e), detallCompra(e)].filter(Boolean).join(' · ')),
          ),
          h('span', { class: 'producte__preu' }, e.cost ? euros(e.cost.costCompraCentims) : textos.compra.senseCost),
        ),
      ),
    ),
    rebost.length > 0 ? h('p', { class: 'menu__nota' }, tr.compraRebost(rebost.map((e) => e.nom.toLowerCase()).join(', '))) : null,
    h(
      'button',
      {
        type: 'button',
        class: 'boto boto--secundari compra-plat__compartir',
        'data-compartir': true,
        onclick: () =>
          void compartir(textLlista(llista, new Set(), new Set(), tr.titolCompartir(nom, persones))).then((avis) => {
            estat.textContent = avis ?? '';
          }),
      },
      `📤 ${textos.compra.compartir}`,
    ),
    estat,
  );
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
    recepta.tipus === 'salsa' ? h('p', { class: 'apat__quan' }, tr.salsa) : null,
    h('h1', { class: 'pagina__titol', tabindex: -1 }, recepta.nom),
    h('p', { class: 'recepta__meta' }, `${tr.temps(recepta.tempsMinuts)} · ${euros(cost)}`),
    h('p', { class: 'menu__nota' }, tr.perA(dades.persones, formatNombre(dades.racionsCentesimes / 100))),
    recepta.aparells && recepta.aparells.length > 0
      ? h(
          'p',
          { class: 'recepta__aparells' },
          h('span', { class: 'recepta__aparells-titol' }, `${tr.aparells}:`),
          ...recepta.aparells.map((cal) => {
            const opcions = Array.isArray(cal) ? cal : [cal];
            return h(
              'span',
              { class: 'aparell' },
              ...opcions.flatMap((ap, i) => [i > 0 ? h('span', { class: 'aparell__o' }, ' o ') : null, iconaAparell(ap, 20), ` ${textos.aparells[ap]} `]),
            );
          }),
        )
      : null,
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
    !acompanyament && dades.suggeriments && dades.suggeriments.length > 0
      ? h(
          'p',
          { class: 'recepta__acompanyament' },
          `${tr.vaBeAmb}: `,
          ...dades.suggeriments.flatMap((id, i) => {
            const a = catalegInicial.receptes.get(id);
            if (!a) return [];
            return [
              i > 0 ? ', ' : null,
              h('button', { type: 'button', class: 'enllac', onclick: () => accions.obrir(a.id) }, a.nom.toLowerCase()),
            ];
          }),
        )
      : null,

    recepta.salses && recepta.salses.length > 0
      ? h(
          'p',
          { class: 'recepta__acompanyament' },
          `${tr.salses}: `,
          ...recepta.salses.flatMap((id, i) => {
            const s = catalegInicial.receptes.get(id);
            if (!s) return [];
            return [i > 0 ? ', ' : null, h('button', { type: 'button', class: 'enllac', onclick: () => accions.obrir(s.id) }, s.nom.toLowerCase())];
          }),
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

    compraDelPlat(recepta.id, dades.racionsCentesimes, dades.persones, accions.compartir),

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
