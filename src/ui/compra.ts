import { catalegInicial, DATA_PREUS, esPerCongelar } from '../dades';
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
  /** Marca o desmarca un producte com a «ja ho tinc» (surt de la compra i del total). */
  tenir: (ingredientId: string, tinc: boolean) => void;
  desmarcar: () => void;
  /** Comparteix (o copia) el text de la llista. */
  compartir: (text: string) => void;
}

const majuscula = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** «21/10/2026» a partir de «2026-10-21». */
function dataCurta(data: string): string {
  const [any, mes, dia] = data.split('-');
  return dia ? `${Number(dia)}/${Number(mes)}/${any}` : data;
}

/** Quantitat a comprar; si l'ingredient es compta també en peces, ho afegeix: «450 g (3 u)». */
export function quantitatCompra(e: ElementLlista): string {
  const base = formatQuantitat(e.quantitat, e.unitat);
  const peca = catalegInicial.ingredients.get(e.ingredientId)?.conversions?.u;
  if (e.unitat === 'g' && peca) return `${base} (${Math.max(1, Math.ceil(e.quantitat / peca))} u)`;
  return base;
}

/** Paquets a comprar: «2 × Llet semidesnatada Hacendado (1 l)»; `null` per al rebost o sense preu. */
export function detallCompra(e: ElementLlista): string | null {
  if (e.rebost || !e.cost) return null;
  // Al pes (carnisseria, mercat): no hi ha paquets, només el preu orientatiu.
  if (catalegInicial.ingredients.get(e.ingredientId)?.foraDelSuper && e.unitat !== 'u') return tc.estimat;
  const producte = catalegInicial.preus.get(e.ingredientId)?.producte;
  return producte
    ? tc.paquetsProducte(e.cost.paquets, producte.nom, formatQuantitat(e.cost.midaPaquet, e.unitat))
    : `${tc.paquets(e.cost.paquets, formatQuantitat(e.cost.midaPaquet, e.unitat))} · ${tc.estimat}`;
}

/** Avís per als productes que no són al Mercadona («⚠ No és al Mercadona: compra-ho a la carnisseria»). */
export function avisForaDelSuper(e: ElementLlista): HTMLElement | null {
  const on = catalegInicial.ingredients.get(e.ingredientId)?.foraDelSuper;
  return on && !e.rebost ? h('span', { class: 'producte__fora' }, tc.foraDelSuper(on)) : null;
}

const esForaDelSuper = (e: ElementLlista): boolean => !e.rebost && Boolean(catalegInicial.ingredients.get(e.ingredientId)?.foraDelSuper);

function element(e: ElementLlista, marcat: boolean, accions: AccionsCompra, mensual: boolean, tinc = false): HTMLElement {
  const plats = e.receptes.map((id) => catalegInicial.receptes.get(id)?.nom ?? id).join(', ');
  const detall = detallCompra(e);
  const botoTinc = e.rebost
    ? null
    : h(
        'button',
        {
          type: 'button',
          class: 'boto boto--petit boto--fantasma producte__tinc',
          'data-tinc': e.ingredientId,
          'aria-label': tinc ? tc.tornarALlistaEtiqueta(e.nom) : tc.tincEtiqueta(e.nom),
          onclick: () => accions.tenir(e.ingredientId, !tinc),
        },
        tinc ? `↩ ${tc.tornarALlista}` : `🏠 ${tc.tinc}`,
      );
  if (tinc) {
    return h(
      'li',
      { class: 'producte producte--tinc' },
      h(
        'div',
        { class: 'producte__etiqueta' },
        h(
          'span',
          { class: 'producte__text' },
          h('span', { class: 'producte__nom' }, e.nom),
          h('span', { class: 'producte__quantitat' }, quantitatCompra(e)),
        ),
        botoTinc,
      ),
    );
  }
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
        mensual && esPerCongelar(e.ingredientId) ? h('span', { class: 'producte__congelar' }, tc.congelar) : null,
        h('span', { class: 'producte__quantitat' }, [quantitatCompra(e), detall].filter(Boolean).join(' · ')),
        avisForaDelSuper(e),
        h('span', { class: 'producte__plats' }, tc.perA(plats)),
      ),
      e.rebost
        ? null
        : h('span', { class: 'producte__preu' }, e.cost ? euros(e.cost.costCompraCentims) : tc.senseCost),
    ),
    botoTinc ? h('div', { class: 'producte__accions' }, botoTinc) : null,
  );
}

/**
 * Text de la llista per compartir: el que encara cal comprar (sense el que ja és al carro ni el que ja es té),
 * per seccions, i al final el que cal comprovar del rebost.
 */
export function textLlista(llista: LlistaCompra, marcats: ReadonlySet<string>, tinc: ReadonlySet<string>, titol: string): string {
  const pendents = llista.elements.filter((e) => !e.rebost && !marcats.has(e.ingredientId) && !tinc.has(e.ingredientId));
  const linies: string[] = [`🛒 ${titol}`];
  for (const s of agruparPerSeccio(pendents)) {
    linies.push('', majuscula(s.seccio).toUpperCase());
    for (const e of s.elements) {
      const producte = catalegInicial.preus.get(e.ingredientId)?.producte;
      const paquets =
        e.cost && producte ? ` → ${tc.paquetsProducte(e.cost.paquets, producte.nom, formatQuantitat(e.cost.midaPaquet, e.unitat))}` : '';
      const on = catalegInicial.ingredients.get(e.ingredientId)?.foraDelSuper;
      linies.push(`- ${e.nom}: ${quantitatCompra(e)}${paquets}${on ? ` (⚠ ${on})` : ''}`);
    }
  }
  const rebost = llista.elements.filter((e) => e.rebost).map((e) => e.nom.toLowerCase());
  if (rebost.length > 0) linies.push('', tc.textRebost(rebost.join(', ')));
  if (pendents.length === 0) linies.push('', tc.resRes);
  return linies.join('\n');
}

/** Compra d'un menú mensual: el mes i quant s'estalvia comprant-ho tot d'un cop. */
export interface CompraMensual {
  mes: string;
  estalviCentims: number;
}

export function pantallaCompra(
  llista: LlistaCompra,
  marcats: ReadonlySet<string>,
  tinc: ReadonlySet<string>,
  accions: AccionsCompra,
  mensual?: CompraMensual,
  avis?: string | null,
): HTMLElement {
  const queden = llista.elements.filter((e) => !tinc.has(e.ingredientId));
  const jaHoTinc = llista.elements.filter((e) => tinc.has(e.ingredientId));
  const seccions = agruparPerSeccio(queden);
  const aComprar = queden.filter((e) => !e.rebost);
  const fets = aComprar.filter((e) => marcats.has(e.ingredientId)).length;
  const total = aComprar.reduce((suma, e) => suma + (e.cost?.costCompraCentims ?? 0), 0);
  const titol = mensual ? tc.titolMes(mensual.mes) : tc.titol;

  return h(
    'main',
    { class: 'pagina compra' },
    h('h1', { class: 'pagina__titol', tabindex: -1 }, titol),
    llista.elements.length === 0
      ? h('p', { class: 'avis' }, tc.buida)
      : h(
          'section',
          { class: 'menu__resum' },
          h('p', { class: 'menu__cost' }, tc.resum(aComprar.length, euros(total))),
          jaHoTinc.length > 0 ? h('p', { class: 'menu__nota' }, tc.resumTinc(jaHoTinc.length)) : null,
          h('p', { class: 'menu__nota', role: 'status' }, tc.fet(fets, aComprar.length)),
          mensual && mensual.estalviCentims > 0 ? h('p', { class: 'menu__nota' }, textos.menu.estalviMes(euros(mensual.estalviCentims))) : null,
          mensual && aComprar.some((e) => esPerCongelar(e.ingredientId)) ? h('p', { class: 'menu__nota' }, tc.ajudaCongelar) : null,
          h('p', { class: 'menu__nota' }, tc.preus(dataCurta(DATA_PREUS))),
          aComprar.some(esForaDelSuper) ? h('p', { class: 'avis' }, tc.resumForaDelSuper(aComprar.filter(esForaDelSuper).length)) : null,
          h(
            'button',
            {
              type: 'button',
              class: 'boto boto--principal compra__compartir',
              'data-compartir': true,
              onclick: () => accions.compartir(textLlista(llista, marcats, tinc, titol)),
            },
            `📤 ${tc.compartir}`,
          ),
          avis ? h('p', { class: 'menu__nota', role: 'status' }, avis) : null,
        ),
    ...seccions.map((s) =>
      h(
        'section',
        { class: 'seccio-compra' },
        h('h2', { class: 'dia__nom' }, s.rebost ? tc.rebost : majuscula(s.seccio)),
        s.rebost ? h('p', { class: 'menu__nota' }, tc.ajudaRebost) : null,
        h('ul', { class: 'productes' }, ...s.elements.map((e) => element(e, marcats.has(e.ingredientId), accions, mensual !== undefined))),
      ),
    ),
    jaHoTinc.length > 0
      ? h(
          'section',
          { class: 'seccio-compra' },
          h('h2', { class: 'dia__nom' }, `🏠 ${tc.jaHoTeniu}`),
          h('p', { class: 'menu__nota' }, tc.ajudaTinc),
          h('ul', { class: 'productes' }, ...jaHoTinc.map((e) => element(e, false, accions, false, true))),
        )
      : null,
    marcats.size > 0 || tinc.size > 0
      ? h('button', { type: 'button', class: 'boto boto--secundari menu__refer', onclick: accions.desmarcar }, tc.desmarcar)
      : null,
  );
}
