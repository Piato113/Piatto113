import { catalegInicial } from '../dades';
import {
  APATS,
  avaluarMenu,
  comensals,
  costRecepta,
  DIES,
  MAX_CONVIDATS,
  normalitzarAssistencia,
  racionsApat,
  type ApatPlanificat,
  type Assistencia,
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
  /** Àpat amb el quadre «Qui hi ha a taula?» obert. */
  assistenciaOberta?: number | null;
}

export interface AccionsMenu {
  /** Obre el llistat de plats per triar el d'aquest àpat. */
  obrirTriar: (index: number) => void;
  canviarGraella: (graella: Graella, clau: string) => void;
  tornarAFer: () => void;
  obrirRecepta: (index: number) => void;
  obrirAssistencia: (index: number) => void;
  /** `enfocar`: selector de l'element que ha de tenir el focus després de tornar a pintar. */
  canviarAssistencia: (index: number, assistencia: Assistencia, enfocar: string) => void;
}

const tt = tm.taula;

/** «4 persones», «3 persones · sense Pol», «6 persones · +2 convidats». */
function resumTaula(configuracio: ConfiguracioFamilia, a: ApatPlanificat): string {
  const persones = configuracio.persones;
  const ass = normalitzarAssistencia(persones, a.assistencia);
  const parts = [tt.persones(comensals(persones, ass))];
  if (ass && ass.absents.length > 0) {
    const noms = ass.absents.map((i) => persones[i]!.nom);
    parts.push(tt.sense(noms.length > 1 ? `${noms.slice(0, -1).join(', ')} i ${noms.at(-1)}` : noms[0]!));
  }
  if (ass && ass.convidats > 0) parts.push(tt.convidats(ass.convidats));
  return parts.join(' · ');
}

function quadreTaula(configuracio: ConfiguracioFamilia, a: ApatPlanificat, index: number, accions: AccionsMenu): HTMLElement {
  const persones = configuracio.persones;
  const ass = normalitzarAssistencia(persones, a.assistencia) ?? { absents: [], convidats: 0 };
  const presents = persones.length - ass.absents.length;
  const canviar = (nova: Assistencia, enfocar: string): void => accions.canviarAssistencia(index, nova, enfocar);
  return h(
    'div',
    { class: 'taula', id: `taula-${index}`, role: 'group', 'aria-label': tt.titol },
    h('p', { class: 'taula__titol' }, tt.titol),
    h('p', { class: 'taula__subtitol' }, tt.familia),
    h(
      'div',
      { class: 'taula__persones' },
      ...persones.map((p, i) => {
        const hiEs = !ass.absents.includes(i);
        // No es pot treure l'última persona si no hi ha convidats: llavors l'àpat s'ha de desmarcar a la graella.
        const ultima = hiEs && presents === 1 && ass.convidats === 0;
        const clau = `[data-persona="${index}-${i}"]`;
        return h(
          'button',
          {
            type: 'button',
            class: `xip${hiEs ? ' xip--actiu' : ''}`,
            'aria-pressed': hiEs ? 'true' : 'false',
            'data-persona': `${index}-${i}`,
            disabled: ultima,
            onclick: () =>
              canviar({ ...ass, absents: hiEs ? [...ass.absents, i] : ass.absents.filter((x) => x !== i) }, clau),
          },
          p.nom,
        );
      }),
    ),
    h('p', { class: 'taula__subtitol' }, tt.convidatsTitol),
    h(
      'div',
      { class: 'taula__convidats' },
      h(
        'button',
        {
          type: 'button',
          class: 'boto boto--petit boto--secundari taula__pas',
          'aria-label': tt.menys,
          'data-convidats': `${index}-menys`,
          // Sense família a taula, no es pot quedar sense convidats.
          disabled: ass.convidats === 0 || (presents === 0 && ass.convidats === 1),
          onclick: () => canviar({ ...ass, convidats: ass.convidats - 1 }, `[data-convidats="${index}-menys"]`),
        },
        '−',
      ),
      h('span', { class: 'taula__nombre', 'aria-live': 'polite' }, String(ass.convidats)),
      h(
        'button',
        {
          type: 'button',
          class: 'boto boto--petit boto--secundari taula__pas',
          'aria-label': tt.mes,
          'data-convidats': `${index}-mes`,
          disabled: ass.convidats >= MAX_CONVIDATS,
          onclick: () => canviar({ ...ass, convidats: ass.convidats + 1 }, `[data-convidats="${index}-mes"]`),
        },
        '+',
      ),
    ),
    ass.absents.length > 0 || ass.convidats > 0
      ? h(
          'button',
          {
            type: 'button',
            class: 'boto boto--petit boto--fantasma taula__tothom',
            onclick: () => canviar({ absents: [], convidats: 0 }, `[data-assistencia="${index}"]`),
          },
          tt.tothom,
        )
      : null,
    h('p', { class: 'grup__ajuda' }, tt.ajuda),
  );
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

function targetaApat(a: ApatPlanificat, index: number, configuracio: ConfiguracioFamilia, oberta: boolean, accions: AccionsMenu): HTMLElement {
  const racions = racionsApat(configuracio.persones, a);
  const resum = resumTaula(configuracio, a);
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
      h(
        'button',
        {
          type: 'button',
          class: `apat__taula${a.assistencia ? ' apat__taula--canviada' : ''}`,
          'data-assistencia': index,
          'aria-expanded': oberta ? 'true' : 'false',
          'aria-controls': `taula-${index}`,
          'aria-label': tt.boto(resum, textos.apats[a.apat], textos.dies[a.dia]),
          onclick: () => accions.obrirAssistencia(index),
        },
        h('span', { 'aria-hidden': 'true' }, '👥 '),
        resum,
      ),
    ),
    h(
      'button',
      {
        type: 'button',
        class: 'boto boto--petit boto--secundari',
        'data-canviar': index,
        'aria-label': tm.canviarEtiqueta(textos.apats[a.apat], textos.dies[a.dia], nomPlat),
        onclick: () => accions.obrirTriar(index),
      },
      tm.canviar,
    ),
    oberta ? quadreTaula(configuracio, a, index, accions) : null,
  );
}

export function pantallaMenu(dades: DadesMenu, accions: AccionsMenu): HTMLElement {
  const { configuracio, graella, apats, avisos } = dades;
  const { llista, costConsumitCentims, racionsCentesimes, racionsMenuCentesimes } = avaluarMenu(catalegInicial, configuracio, apats);
  const perApat = apats.length > 0 ? Math.round(costConsumitCentims / apats.length) : 0;
  const pressupostApat =
    configuracio.pressupostRacioCentims === null
      ? null
      : Math.round((configuracio.pressupostRacioCentims * racionsCentesimes) / 100);
  // Amb convidats el menú costa més: es compara amb el pressupost per ració de totes les racions de la setmana.
  const sobrePressupost =
    configuracio.pressupostRacioCentims !== null &&
    apats.length > 0 &&
    costConsumitCentims > Math.round((configuracio.pressupostRacioCentims * racionsMenuCentesimes) / 100);

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
        ...delDia.map(({ a, index }) => targetaApat(a, index, configuracio, dades.assistenciaOberta === index, accions)),
      ),
    ),
    apats.length > 0
      ? h('button', { type: 'button', class: 'boto boto--secundari menu__refer', onclick: accions.tornarAFer }, tm.tornarAFer)
      : null,
  );
}
