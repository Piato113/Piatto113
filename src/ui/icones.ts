import type { Aparell } from '../domini';

// Icones dels aparells de cuina: SVG de línia, del color del text (currentColor), dibuixades per a l'app.

const NS = 'http://www.w3.org/2000/svg';

type Forma =
  | ['rect', number, number, number, number, number]
  | ['circle', number, number, number]
  | ['line', number, number, number, number]
  | ['path', string];

const FORMES: Record<Aparell, Forma[]> = {
  forn: [
    ['rect', 3, 3, 18, 18, 2.5],
    ['line', 3, 8, 21, 8],
    ['circle', 7, 5.5, 0.6],
    ['circle', 10.5, 5.5, 0.6],
    ['rect', 6.5, 11, 11, 7, 1.2],
  ],
  microones: [
    ['rect', 2, 5, 20, 14, 2.5],
    ['rect', 4.5, 8, 10, 8, 1.2],
    ['line', 17, 5, 17, 19],
    ['circle', 19.5, 9, 0.6],
    ['circle', 19.5, 12, 0.6],
    ['line', 18.8, 15.5, 20.2, 15.5],
  ],
  'fregidora-aire': [
    ['path', 'M7 3h10a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z'],
    ['line', 4, 13, 20, 13],
    ['line', 10, 16.5, 14, 16.5],
    ['circle', 12, 8, 2],
  ],
  thermomix: [
    ['rect', 4.5, 15, 15, 6, 2],
    ['path', 'M7.5 15 8.5 6h7l1 9'],
    ['line', 8, 6, 16, 6],
    ['line', 12, 3.5, 12, 6],
    ['path', 'M15.8 8.5h1.7a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-1.2'],
    ['circle', 12, 18, 1.2],
  ],
  barbacoa: [
    ['path', 'M3 10h18a9 6 0 0 1-18 0z'],
    ['line', 8, 15.5, 6, 21],
    ['line', 16, 15.5, 18, 21],
    ['line', 12, 16, 12, 21],
    ['path', 'M9 3c-1 1.3 1 2.4 0 4'],
    ['path', 'M15 3c-1 1.3 1 2.4 0 4'],
  ],
  batedora: [
    ['rect', 9.5, 2, 5, 10, 2.5],
    ['circle', 12, 5.5, 0.6],
    ['line', 12, 12, 12, 17.5],
    ['path', 'M8 17.5h8l-1.5 4h-5z'],
  ],
};

/** Icona d'un aparell (decorativa: el nom ha de sortir al costat). */
export function iconaAparell(aparell: Aparell, mida = 24): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg');
  const atributs: Record<string, string> = {
    viewBox: '0 0 24 24',
    width: String(mida),
    height: String(mida),
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
    focusable: 'false',
    class: 'icona-aparell',
  };
  for (const [k, v] of Object.entries(atributs)) svg.setAttribute(k, v);
  for (const forma of FORMES[aparell]) {
    const [tipus, ...valors] = forma;
    const el = document.createElementNS(NS, tipus);
    const noms =
      tipus === 'rect' ? ['x', 'y', 'width', 'height', 'rx'] : tipus === 'circle' ? ['cx', 'cy', 'r'] : tipus === 'line' ? ['x1', 'y1', 'x2', 'y2'] : ['d'];
    noms.forEach((n, i) => el.setAttribute(n, String(valors[i])));
    // Els punts (botons) van plens.
    if (tipus === 'circle' && (valors[2] as number) < 1) el.setAttribute('fill', 'currentColor');
    svg.append(el);
  }
  return svg;
}
