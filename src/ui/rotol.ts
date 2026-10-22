import type { Novetat } from '../domini';
import { textos } from '../textos/ca';
import { h } from './dom';

// Rètol de xifres i novetats a dalt del menú: una tira que entra per la dreta i surt per l'esquerra.
// Tocar-lo obre la llista de totes les novetats. Si el mòbil demana menys moviment, la tira no es desplaça
// i va canviant de text.

export interface DadesRotol {
  /** Textos que passen pel rètol, en ordre. */
  elements: string[];
  /** Totes les novetats (per a la llista oberta), de la més nova a la més vella. */
  novetats: readonly Novetat[];
  /** Xifres (sense les novetats), per a la llista oberta. */
  xifres: string[];
  obert: boolean;
}

export interface AccionsRotol {
  obrir: () => void;
  tancar: () => void;
}

/** Velocitat de desplaçament, en píxels per segon (aproximada a partir del nombre de caràcters). */
const PIXELS_PER_SEGON = 55;
const PIXELS_PER_CARACTER = 8;
/** Cada quant canvia el text si no es desplaça. */
const CANVI_MS = 4000;

const menysMoviment = (): boolean =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function rotol(dades: DadesRotol, accions: AccionsRotol): HTMLElement | null {
  if (dades.obert) return llista(dades, accions);
  if (dades.elements.length === 0) return null;

  const pista = h('span', { class: 'rotol__pista', 'aria-hidden': 'true' });
  const boto = h(
    'button',
    {
      type: 'button',
      class: 'rotol',
      'aria-label': textos.rotol.etiqueta(dades.elements.join('. ')),
      'aria-expanded': 'false',
      onclick: accions.obrir,
    },
    pista,
  );

  if (menysMoviment()) {
    boto.classList.add('rotol--quiet');
    let i = 0;
    pista.textContent = dades.elements[0]!;
    if (dades.elements.length > 1) {
      const temporitzador = setInterval(() => {
        // La pantalla s'ha tornat a pintar: aquest rètol ja no hi és.
        if (!boto.isConnected) {
          clearInterval(temporitzador);
          return;
        }
        i = (i + 1) % dades.elements.length;
        pista.textContent = dades.elements[i]!;
      }, CANVI_MS);
    }
    return boto;
  }

  dades.elements.forEach((text, i) => {
    if (i > 0) pista.append(h('span', { class: 'rotol__punt' }, '·'));
    pista.append(h('span', { class: 'rotol__element' }, text));
  });
  // La durada depèn de la llargada perquè la velocitat sigui sempre semblant (es compta també l'amplada de la pantalla).
  const caracters = dades.elements.reduce((total, t) => total + t.length + 3, 0);
  const amplada = typeof window.innerWidth === 'number' && window.innerWidth > 0 ? window.innerWidth : 390;
  const segons = Math.max(8, Math.round((caracters * PIXELS_PER_CARACTER + amplada) / PIXELS_PER_SEGON));
  pista.style.setProperty('--durada', `${segons}s`);
  return boto;
}

function llista(dades: DadesRotol, accions: AccionsRotol): HTMLElement {
  const t = textos.rotol;
  return h(
    'section',
    { class: 'novetats', 'aria-labelledby': 'novetats-titol' },
    h(
      'div',
      { class: 'novetats__capcalera' },
      h('h2', { class: 'novetats__titol', id: 'novetats-titol', tabindex: '-1' }, t.titol),
      h('button', { type: 'button', class: 'boto boto--secundari novetats__tanca', 'aria-expanded': 'true', onclick: accions.tancar }, t.tanca),
    ),
    dades.xifres.length > 0
      ? h(
          'div',
          { class: 'novetats__xifres' },
          h('p', { class: 'novetats__subtitol' }, t.xifres),
          h('ul', {}, ...dades.xifres.map((x) => h('li', {}, x))),
        )
      : null,
    h(
      'ul',
      { class: 'novetats__llista' },
      ...dades.novetats.map((n) => h('li', {}, h('span', { class: 'novetats__data' }, t.data(n.data)), h('span', {}, n.text))),
    ),
  );
}
