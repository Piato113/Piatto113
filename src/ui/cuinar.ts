import { catalegInicial } from '../dades';
import {
  enMarxa,
  formatRellotge,
  prepararRecepta,
  restant,
  textQuantitat,
  type CronometreCuina,
  type PasPreparat,
} from '../domini';
import { textos } from '../textos/ca';
import {
  afegirMinut,
  cronometresActius,
  engegarCronometre,
  obtenirCronometre,
  pausarCronometre,
  reiniciarCronometre,
  subscriure,
} from './alarmes';
import { h, substituir } from './dom';

const tc = textos.cuinar;

export interface DadesCuinar {
  receptaId: string;
  acompanyamentId?: string;
  racionsCentesimes: number;
  /** 0 = preparació (ingredients); 1…n = passos; n + 1 = final. */
  pas: number;
}

export interface AccionsCuinar {
  anarAlPas: (pas: number) => void;
  /** Obre el mode cuinar d'una altra recepta (p. ex. l'acompanyament) o la del cronòmetre tocat. */
  cuinar: (receptaId: string, pas: number) => void;
  sortir: () => void;
  menu: () => void;
}

export interface PantallaCuinar {
  element: HTMLElement;
  /** Atura les actualitzacions i allibera la pantalla encesa. */
  desmuntar: () => void;
}

// ——— Pantalla encesa mentre es cuina ———

type Bloqueig = { release: () => Promise<void> };
let bloqueig: Bloqueig | null = null;
let volBloqueig = false;

async function demanarPantallaEncesa(): Promise<void> {
  volBloqueig = true;
  const wl = (navigator as unknown as { wakeLock?: { request: (t: 'screen') => Promise<Bloqueig> } }).wakeLock;
  if (!wl || bloqueig || document.visibilityState !== 'visible') return;
  try {
    bloqueig = await wl.request('screen');
    (bloqueig as unknown as EventTarget).addEventListener?.('release', () => {
      bloqueig = null;
    });
  } catch {
    bloqueig = null;
  }
}

function alliberarPantalla(): void {
  volBloqueig = false;
  void bloqueig?.release().catch(() => undefined);
  bloqueig = null;
}

document.addEventListener('visibilitychange', () => {
  // El navegador allibera el bloqueig en amagar la pàgina: es torna a demanar en tornar.
  if (volBloqueig && document.visibilityState === 'visible') void demanarPantallaEncesa();
});

// ——— Targeta del cronòmetre d'un pas ———

function targetaCronometre(receptaId: string, pas: PasPreparat): { element: HTMLElement; actualitzar: () => void } {
  const definicio = pas.cronometre!;
  const element = h('section', { class: 'cronometre', 'aria-label': `${tc.cronometre}: ${definicio.nom}` });
  let estatAnterior = '';
  let rellotge: HTMLElement | null = null;

  const actual = (): CronometreCuina => obtenirCronometre(receptaId, pas.numero, definicio.nom, definicio.segons);

  const actualitzar = (): void => {
    const c = actual();
    const ara = Date.now();
    const marxa = enMarxa(c, ara);
    const queda = restant(c, ara);
    const comencat = marxa || queda < c.duradaSegons;
    const estat = `${marxa}|${comencat}|${queda === 0}`;
    if (estat !== estatAnterior || !rellotge) {
      estatAnterior = estat;
      const enfocat = element.contains(document.activeElement) ? (document.activeElement as HTMLElement).dataset.accio : undefined;
      rellotge = h('p', { class: `cronometre__temps${queda === 0 ? ' cronometre__temps--fet' : ''}`, role: 'timer' }, formatRellotge(queda));
      const accio = marxa
        ? h('button', { type: 'button', class: 'boto boto--principal boto--gran', 'data-accio': 'principal', onclick: () => pausarCronometre(actual()) }, tc.pausar)
        : h(
            'button',
            { type: 'button', class: 'boto boto--principal boto--gran', 'data-accio': 'principal', onclick: () => engegarCronometre(actual()) },
            comencat && queda > 0 ? tc.continuar : tc.engegar,
          );
      substituir(
        element,
        h('p', { class: 'cronometre__nom' }, `⏱ ${definicio.nom}`),
        rellotge,
        h(
          'div',
          { class: 'cronometre__botons' },
          accio,
          h('button', { type: 'button', class: 'boto boto--secundari', 'data-accio': 'minut', onclick: () => afegirMinut(actual()) }, tc.mesUnMinut),
          comencat
            ? h('button', { type: 'button', class: 'boto boto--secundari', 'data-accio': 'reiniciar', onclick: () => reiniciarCronometre(actual()) }, tc.reiniciar)
            : null,
        ),
      );
      if (enfocat) element.querySelector<HTMLElement>(`[data-accio="${enfocat}"]`)?.focus();
    } else {
      rellotge.textContent = formatRellotge(queda);
    }
  };

  actualitzar();
  return { element, actualitzar };
}

// ——— Barra de cronòmetres en marxa (dels altres passos o receptes) ———

function barraActius(receptaId: string, pasActual: number, accions: AccionsCuinar): HTMLElement | null {
  const actius = cronometresActius().filter((c) => !(c.receptaId === receptaId && c.pas === pasActual));
  if (actius.length === 0) return null;
  const ara = Date.now();
  return h(
    'div',
    { class: 'actius', 'aria-label': tc.enMarxa },
    ...actius.map((c) =>
      h(
        'button',
        {
          type: 'button',
          class: 'xip xip--actiu actius__xip',
          'aria-label': tc.anarAlPas(c.nom, formatRellotge(restant(c, ara))),
          onclick: () => (c.receptaId === receptaId ? accions.anarAlPas(c.pas) : accions.cuinar(c.receptaId, c.pas)),
        },
        `⏱ ${c.nom} ·\u00a0`,
        h('span', { 'data-actiu': c.id }, formatRellotge(restant(c, ara))),
      ),
    ),
  );
}

// ——— Pantalla ———

export function pantallaCuinar(dades: DadesCuinar, accions: AccionsCuinar): PantallaCuinar {
  const recepta = catalegInicial.receptes.get(dades.receptaId)!;
  const preparada = prepararRecepta(catalegInicial, recepta, dades.racionsCentesimes);
  const total = preparada.passos.length;
  const pas = Math.min(Math.max(0, dades.pas), total + 1);
  const acompanyament = dades.acompanyamentId ? catalegInicial.receptes.get(dades.acompanyamentId) : undefined;

  let cronometre: { element: HTMLElement; actualitzar: () => void } | null = null;
  let cos: HTMLElement;

  if (pas === 0) {
    cos = h(
      'div',
      { class: 'cuinar__cos' },
      h('h1', { class: 'cuinar__titol', tabindex: -1 }, tc.preparacio),
      h('p', { class: 'menu__nota' }, tc.ajudaPreparacio),
      h(
        'ul',
        { class: 'productes' },
        ...preparada.ingredients.map((linia) =>
          h(
            'li',
            { class: 'producte' },
            h(
              'label',
              { class: 'producte__etiqueta' },
              h('input', {
                type: 'checkbox',
                class: 'producte__casella',
                onchange: (e: Event) => (e.target as HTMLElement).closest('li')?.classList.toggle('producte--fet'),
              }),
              h(
                'span',
                { class: 'producte__text' },
                h('span', { class: 'producte__nom' }, catalegInicial.ingredients.get(linia.ingredientId)?.nom ?? linia.ingredientId),
                h('span', { class: 'producte__quantitat' }, textQuantitat(linia)),
              ),
            ),
          ),
        ),
      ),
      'wakeLock' in navigator ? h('p', { class: 'menu__nota' }, tc.pantallaEncesa) : null,
    );
  } else if (pas <= total) {
    const p = preparada.passos[pas - 1]!;
    cronometre = p.cronometre ? targetaCronometre(recepta.id, p) : null;
    cos = h(
      'div',
      { class: 'cuinar__cos' },
      h('h1', { class: 'visualment-amagat', tabindex: -1 }, tc.pas(pas, total)),
      h('p', { class: 'cuinar__text' }, p.text),
      cronometre?.element ?? null,
    );
  } else {
    cos = h(
      'div',
      { class: 'cuinar__cos cuinar__final' },
      h('p', { class: 'alarma__icona', 'aria-hidden': 'true' }, '🍽'),
      h('h1', { class: 'cuinar__titol', tabindex: -1 }, tc.bonProfit),
      h('p', {}, tc.fet),
      acompanyament
        ? h(
            'button',
            { type: 'button', class: 'boto boto--principal boto--gran', onclick: () => accions.cuinar(acompanyament.id, 0) },
            tc.araAcompanyament(acompanyament.nom),
          )
        : null,
      h('button', { type: 'button', class: 'boto boto--secundari', onclick: accions.menu }, tc.tornarMenu),
    );
  }

  const progres = pas === 0 ? 0 : Math.min(pas, total) / total;
  const actius = h('div', { class: 'cuinar__actius' });
  const pintarActius = (): void => substituir(actius, barraActius(recepta.id, pas, accions));
  pintarActius();

  const element = h(
    'div',
    { class: 'cuinar' },
    h(
      'header',
      { class: 'cuinar__capcalera' },
      h(
        'button',
        { type: 'button', class: 'boto boto--petit boto--fantasma', 'aria-label': tc.sortirEtiqueta, onclick: accions.sortir },
        `✕ ${tc.sortir}`,
      ),
      h(
        'div',
        { class: 'cuinar__recepta' },
        h('p', { class: 'cuinar__nom' }, recepta.nom),
        pas >= 1 && pas <= total ? h('p', { class: 'pas__numero' }, tc.pas(pas, total)) : null,
      ),
    ),
    h(
      'div',
      { class: 'progres' },
      h('div', { class: 'progres__barra', style: `width: ${progres * 100}%` }),
    ),
    actius,
    h('main', { class: 'cuinar__principal' }, cos),
    pas <= total
      ? h(
          'footer',
          { class: 'peu cuinar__peu' },
          pas > 0
            ? h('button', { type: 'button', class: 'boto boto--secundari boto--gran', onclick: () => accions.anarAlPas(pas - 1) }, tc.anterior)
            : h('span'),
          h(
            'button',
            { type: 'button', class: 'boto boto--principal boto--gran', onclick: () => accions.anarAlPas(pas + 1) },
            pas === total ? tc.acabar : pas === 0 ? tc.comencar : tc.seguent,
          ),
        )
      : null,
  );

  const desubscriure = subscriure(() => {
    cronometre?.actualitzar();
    // La barra només es torna a pintar si canvia quins cronòmetres hi ha; si no, s'actualitzen els números.
    const ids = cronometresActius()
      .filter((c) => !(c.receptaId === recepta.id && c.pas === pas))
      .map((c) => c.id)
      .join(',');
    const mostrats = [...actius.querySelectorAll<HTMLElement>('[data-actiu]')].map((e) => e.dataset.actiu).join(',');
    if (ids !== mostrats) pintarActius();
    else {
      const ara = Date.now();
      for (const c of cronometresActius()) {
        const span = actius.querySelector<HTMLElement>(`[data-actiu="${c.id}"]`);
        if (span) span.textContent = formatRellotge(restant(c, ara));
      }
    }
  });
  void demanarPantallaEncesa();

  return {
    element,
    desmuntar: () => {
      desubscriure();
    },
  };
}

/** Allibera la pantalla encesa en sortir del mode cuinar. */
export function sortirDelModeCuinar(): void {
  alliberarPantalla();
}
