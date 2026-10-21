import { catalegInicial } from '../dades';
import {
  APATS,
  avaluarMenu,
  costRecepta,
  DIES,
  type ApatPlanificat,
  type Avis,
  type ConfiguracioFamilia,
  type Graella,
} from '../domini';
import { textAvis, textos } from '../textos/ca';
import { h } from './dom';
import { euros as formatEuros } from './format';

const tm = textos.menu;

export interface DadesMenu {
  configuracio: ConfiguracioFamilia;
  graella: Graella;
  apats: ApatPlanificat[];
  avisos: Avis[];
  /** Missatge puntual (p. ex. no hi ha cap altre plat possible). */
  missatge?: string | null;
  graellaOberta?: boolean;
}

export interface AccionsMenu {
  canviarPlat: (index: number) => void;
  canviarGraella: (graella: Graella, clau: string) => void;
  tornarAFer: () => void;
  obrirRecepta: (index: number) => void;
}

const nomIngredient = (id: string): string => catalegInicial.ingredients.get(id)?.nom ?? id;
const recepta = (id: string) => catalegInicial.receptes.get(id);

function graellaEditable(graella: Graella, oberta: boolean, canviar: (g: Graella, clau: string) => void): HTMLElement {
  return h(
    'details',
    { class: 'graella', open: oberta },
    h('summary', { class: 'graella__titol' }, tm.graella),
    h('p', { class: 'grup__ajuda' }, tm.ajudaGraella),
    h(
      'div',
      { class: 'graella__dies' },
      ...DIES.map((dia) =>
        h(
          'div',
          { class: 'graella__dia' },
          h('span', { class: 'graella__nom' }, textos.dies[dia]),
          ...APATS.map((apat) => {
            const marcat = graella[dia][apat];
            return h(
              'button',
              {
                type: 'button',
                class: `xip${marcat ? ' xip--actiu' : ''}`,
                'aria-pressed': marcat ? 'true' : 'false',
                'aria-label': `${textos.apats[apat]} de ${textos.dies[dia].toLowerCase()}`,
                'data-graella': `${dia}-${apat}`,
                onclick: () => canviar({ ...graella, [dia]: { ...graella[dia], [apat]: !marcat } }, `${dia}-${apat}`),
              },
              textos.apats[apat],
            );
          }),
        ),
      ),
    ),
  );
}

function targetaApat(a: ApatPlanificat, index: number, racions: number, accions: AccionsMenu): HTMLElement {
  const principal = recepta(a.receptaId);
  const acompanyament = a.acompanyamentId ? recepta(a.acompanyamentId) : undefined;
  const cost =
    (principal ? costRecepta(catalegInicial, principal, racions) : 0) +
    (acompanyament ? costRecepta(catalegInicial, acompanyament, racions) : 0);
  const temps = principal ? tm.minuts(principal.tempsMinuts) : '';
  const nomPlat = principal?.nom ?? a.receptaId;
  return h(
    'article',
    { class: 'apat' },
    h(
      'div',
      { class: 'apat__text' },
      h('p', { class: 'apat__quan' }, textos.apats[a.apat]),
      h(
        'h3',
        { class: 'apat__plat' },
        h(
          'button',
          { type: 'button', class: 'enllac', 'aria-label': tm.veureRecepta(nomPlat), onclick: () => accions.obrirRecepta(index) },
          nomPlat,
        ),
      ),
      acompanyament ? h('p', { class: 'apat__acompanyament' }, tm.amb(acompanyament.nom)) : null,
      h('p', { class: 'apat__meta' }, [temps, formatEuros(cost)].filter(Boolean).join(' · ')),
    ),
    h(
      'button',
      {
        type: 'button',
        class: 'boto boto--petit boto--secundari',
        'data-canviar': index,
        'aria-label': tm.canviarEtiqueta(textos.apats[a.apat], textos.dies[a.dia], nomPlat),
        onclick: () => accions.canviarPlat(index),
      },
      tm.canviar,
    ),
  );
}

export function pantallaMenu(dades: DadesMenu, accions: AccionsMenu): HTMLElement {
  const { configuracio, graella, apats, avisos } = dades;
  const { llista, costConsumitCentims, racionsCentesimes } = avaluarMenu(catalegInicial, configuracio, apats);
  const perApat = apats.length > 0 ? Math.round(costConsumitCentims / apats.length) : 0;
  const pressupostApat =
    configuracio.pressupostRacioCentims === null
      ? null
      : Math.round((configuracio.pressupostRacioCentims * racionsCentesimes) / 100);
  const sobrePressupost = pressupostApat !== null && apats.length > 0 && perApat > pressupostApat;

  // Avisos del planificador, sense el de pressupost (el resum ja el compara en directe), més els de preus.
  const textosAvisos = [
    ...avisos.filter((x) => x.codi !== 'pressupost-impossible' && x.codi !== 'sense-preu'),
    ...(llista.senseCost.length > 0 ? [{ codi: 'sense-preu', ingredientIds: llista.senseCost } as const] : []),
  ]
    .map((x) => textAvis(x, nomIngredient) as string | undefined)
    .filter((x): x is string => Boolean(x));

  const dies = DIES.map((dia) => ({
    dia,
    apats: apats.map((a, index) => ({ a, index })).filter(({ a }) => a.dia === dia),
  })).filter((d) => d.apats.length > 0);

  return h(
    'main',
    { class: 'menu' },
    h('h1', { class: 'menu__titol', tabindex: -1 }, tm.titol),
    apats.length > 0
      ? h(
          'section',
          { class: 'menu__resum', 'aria-label': tm.titol },
          h(
            'p',
            { class: 'menu__cost' },
            `${tm.apats(apats.length)} · ${tm.costSetmana(formatEuros(costConsumitCentims), formatEuros(perApat))}`,
          ),
          pressupostApat !== null ? h('p', { class: 'menu__nota' }, tm.pressupost(formatEuros(pressupostApat))) : null,
          h('p', { class: 'menu__nota' }, `${tm.compra(formatEuros(llista.totalCompraCentims))} ${tm.explicacioCompra}`),
        )
      : null,
    dades.missatge ? h('p', { class: 'avis', role: 'status' }, dades.missatge) : null,
    sobrePressupost ? h('p', { class: 'avis', role: 'status' }, tm.sobrePressupost) : null,
    ...textosAvisos.map((text) => h('p', { class: 'avis', role: 'status' }, text)),
    graellaEditable(graella, dades.graellaOberta === true, accions.canviarGraella),
    apats.length === 0 ? h('p', { class: 'avis' }, tm.capApat) : null,
    ...dies.map(({ dia, apats: delDia }) =>
      h(
        'section',
        { class: 'dia', 'aria-labelledby': `dia-${dia}` },
        h('h2', { class: 'dia__nom', id: `dia-${dia}` }, textos.dies[dia]),
        ...delDia.map(({ a, index }) => targetaApat(a, index, racionsCentesimes, accions)),
      ),
    ),
    apats.length > 0
      ? h('button', { type: 'button', class: 'boto boto--secundari menu__refer', onclick: accions.tornarAFer }, tm.tornarAFer)
      : null,
  );
}
