import { catalegInicial, DATA_PREUS } from '../dades';
import {
  agruparPerSeccio,
  formatQuantitat,
  type ElementLlista,
  type LlistaCompra,
} from '../domini';
import { textos } from '../textos/ca';
import { h } from './dom';
import { euros } from './format';

const tc = textos.compra;

export interface AccionsCompra {
  commutar: (ingredientId: string, marcat: boolean) => void;
  desmarcar: () => void;
}

const majuscula = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** «Octubre de 2026» a partir de «2026-10». */
function mesAny(data: string): string {
  const [any, mes] = data.split('-').map(Number);
  const mesos = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];
  const nom = mesos[(mes ?? 1) - 1] ?? '';
  return `${nom} de ${any}`;
}

/** Quantitat a comprar; si l'ingredient es compta també en peces, ho afegeix: «450 g (3 u)». */
function quantitat(e: ElementLlista): string {
  const base = formatQuantitat(e.quantitat, e.unitat);
  const peca = catalegInicial.ingredients.get(e.ingredientId)?.conversions?.u;
  if (e.unitat === 'g' && peca) return `${base} (${Math.max(1, Math.ceil(e.quantitat / peca))} u)`;
  return base;
}

function element(e: ElementLlista, marcat: boolean, accions: AccionsCompra): HTMLElement {
  const plats = e.receptes.map((id) => catalegInicial.receptes.get(id)?.nom ?? id).join(', ');
  const detall =
    e.rebost || !e.cost
      ? null
      : tc.paquets(e.cost.paquets, formatQuantitat(e.cost.midaPaquet, e.unitat));
  return h(
    'li',
    { class: `producte${marcat ? ' producte--fet' : ''}` },
    h(
      'label',
      { class: 'producte__etiqueta' },
      h('input', {
        type: 'checkbox',
        class: 'producte__casella',
        checked: marcat,
        'data-ingredient': e.ingredientId,
        onchange: (ev: Event) => accions.commutar(e.ingredientId, (ev.target as HTMLInputElement).checked),
      }),
      h(
        'span',
        { class: 'producte__text' },
        h('span', { class: 'producte__nom' }, e.nom),
        h('span', { class: 'producte__quantitat' }, [quantitat(e), detall].filter(Boolean).join(' · ')),
        h('span', { class: 'producte__plats' }, tc.perA(plats)),
      ),
      e.rebost
        ? null
        : h('span', { class: 'producte__preu' }, e.cost ? euros(e.cost.costCompraCentims) : tc.senseCost),
    ),
  );
}

export function pantallaCompra(llista: LlistaCompra, marcats: ReadonlySet<string>, accions: AccionsCompra): HTMLElement {
  const seccions = agruparPerSeccio(llista.elements);
  const aComprar = llista.elements.filter((e) => !e.rebost);
  const fets = aComprar.filter((e) => marcats.has(e.ingredientId)).length;

  return h(
    'main',
    { class: 'pagina compra' },
    h('h1', { class: 'pagina__titol', tabindex: -1 }, tc.titol),
    llista.elements.length === 0
      ? h('p', { class: 'avis' }, tc.buida)
      : h(
          'section',
          { class: 'menu__resum' },
          h('p', { class: 'menu__cost' }, tc.resum(aComprar.length, euros(llista.totalCompraCentims))),
          h('p', { class: 'menu__nota', role: 'status' }, tc.fet(fets, aComprar.length)),
          h('p', { class: 'menu__nota' }, tc.preus(mesAny(DATA_PREUS))),
        ),
    ...seccions.map((s) =>
      h(
        'section',
        { class: 'seccio-compra' },
        h('h2', { class: 'dia__nom' }, s.rebost ? tc.rebost : majuscula(s.seccio)),
        s.rebost ? h('p', { class: 'menu__nota' }, tc.ajudaRebost) : null,
        h('ul', { class: 'productes' }, ...s.elements.map((e) => element(e, marcats.has(e.ingredientId), accions))),
      ),
    ),
    marcats.size > 0
      ? h('button', { type: 'button', class: 'boto boto--secundari menu__refer', onclick: accions.desmarcar }, tc.desmarcar)
      : null,
  );
}
