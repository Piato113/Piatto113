import { carnIPeixPerCongelar, catalegInicial } from '../dades';
import {
  APATS,
  avaluarMenu,
  categoriaPlat,
  diesDelMes,
  estalviCompraPeriode,
  setmanesDelMenu,
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
import type { PeriodeMenu } from './emmagatzematge';
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
  periode: PeriodeMenu;
  /** Mes del menú mensual («AAAA-MM»). */
  mes?: string;
  /** Mesos que es poden triar: el que corre (la resta) i el següent. */
  mesos: { mes: string; resta: boolean }[];
  /** Setmana del menú mensual que es mostra (índex). */
  setmanaVisible: number;
  /** Menú anterior guardat: com es diu i quants dies li queden (0 si ja ha passat). */
  anterior?: { titol: string; queden: number };
  /** Es mostra el menú anterior: només per consultar (sense «Canvia», graella ni període). */
  lectura?: { titol: string };
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
  /** Canvia entre menú setmanal i mensual (i de quin mes). */
  canviarPeriode: (periode: PeriodeMenu, mes?: string) => void;
  veureSetmana: (index: number) => void;
  /** Obre el menú anterior, o torna a l'actual des de l'anterior. */
  veureAnterior: () => void;
  tornarAlActual: () => void;
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

/** En un menú mensual, recorda treure del congelador la carn i el peix del plat. */
function notaDescongelar(receptes: (ReturnType<typeof recepta> | undefined)[]): HTMLElement | null {
  const noms = [
    ...new Set(
      receptes.flatMap((r) =>
        (r?.ingredients ?? []).filter((l) => carnIPeixPerCongelar.has(l.ingredientId)).map((l) => nomIngredient(l.ingredientId).toLowerCase()),
      ),
    ),
  ];
  return noms.length > 0 ? h('p', { class: 'apat__descongelar' }, tm.descongelar(noms.join(', '))) : null;
}

/** Selector «Una setmana / Un mes sencer» i, si és mensual, de quin mes. */
function selectorPeriode(dades: DadesMenu, accions: AccionsMenu): HTMLElement {
  const tp = tm.periode;
  const xip = (actiu: boolean, text: string, clau: string, accio: () => void): HTMLElement =>
    h(
      'button',
      { type: 'button', class: `xip${actiu ? ' xip--actiu' : ''}`, 'aria-pressed': actiu ? 'true' : 'false', 'data-periode': clau, onclick: accio },
      text,
    );
  const mensual = dades.periode === 'mes';
  return h(
    'section',
    { class: 'periode', 'aria-labelledby': 'periode-titol' },
    h('h2', { class: 'periode__titol', id: 'periode-titol' }, tp.titol),
    h(
      'div',
      { class: 'xips' },
      xip(!mensual, tp.setmana, 'setmana', () => accions.canviarPeriode('setmana')),
      xip(mensual, tp.mes, 'mes', () => accions.canviarPeriode('mes')),
    ),
    mensual
      ? h(
          'div',
          { class: 'xips' },
          ...dades.mesos.map(({ mes, resta }) =>
            xip(dades.mes === mes, resta ? tp.restaDe(mes) : tp.mesSencer(mes), mes, () => accions.canviarPeriode('mes', mes)),
          ),
        )
      : null,
    h('p', { class: 'grup__ajuda' }, tp.ajuda),
  );
}

/** Calendari del mes amb un punt de color per àpat (segons la categoria del plat). */
function calendariMes(mes: string, apats: readonly ApatPlanificat[], setmanes: { dilluns: string; indexs: number[] }[], visible: number, accions: AccionsMenu): HTMLElement {
  const dies = diesDelMes(mes);
  const buits = DIES.indexOf(dies[0]!.dia);
  const setmanaDe = (data: string): number => setmanes.findIndex((s) => s.indexs.some((i) => apats[i]!.data === data));
  return h(
    'section',
    { class: 'calendari', 'aria-label': tm.calendari },
    h('div', { class: 'calendari__graella' },
      ...DIES.map((d) => h('span', { class: 'calendari__capcalera', 'aria-hidden': 'true' }, textos.diesCurts[d])),
      ...Array.from({ length: buits }, () => h('span', { class: 'calendari__buit' })),
      ...dies.map(({ data }) => {
        const delDia = apats.filter((a) => a.data === data);
        const setmana = setmanaDe(data);
        const plats = delDia.map((a) => recepta(a.receptaId)?.nom ?? a.receptaId).join(', ') || tm.senseApats;
        return h(
          'button',
          {
            type: 'button',
            class: `calendari__dia${setmana === visible ? ' calendari__dia--visible' : ''}`,
            disabled: setmana < 0,
            'aria-label': tm.diaCalendari(data, plats),
            onclick: () => accions.veureSetmana(setmana),
          },
          h('span', { class: 'calendari__numero' }, String(Number(data.slice(8)))),
          h(
            'span',
            { class: 'calendari__punts', 'aria-hidden': 'true' },
            ...delDia.map((a) => {
              const r = recepta(a.receptaId);
              return h('span', { class: `calendari__punt calendari__punt--${r ? categoriaPlat(r) : 'verdura'}` });
            }),
          ),
        );
      }),
    ),
    h(
      'p',
      { class: 'calendari__llegenda' },
      ...CATEGORIES_LLEGENDA.map((c) =>
        h('span', { class: 'calendari__clau' }, h('span', { class: `calendari__punt calendari__punt--${c}`, 'aria-hidden': 'true' }), textos.triar.categories[c]),
      ),
    ),
    h('p', { class: 'grup__ajuda' }, tm.llegenda),
  );
}

const CATEGORIES_LLEGENDA = ['carn', 'peix', 'ou', 'llegums', 'pasta', 'arros', 'verdura'] as const;

let mensual = false;

function targetaApat(
  a: ApatPlanificat,
  index: number,
  configuracio: ConfiguracioFamilia,
  oberta: boolean,
  accions: AccionsMenu,
  lectura: boolean,
): HTMLElement {
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
      mensual && !lectura ? notaDescongelar([principal, acompanyament]) : null,
      lectura
        ? h('p', { class: 'apat__meta' }, h('span', { 'aria-hidden': 'true' }, '👥 '), resum)
        : h(
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
    lectura
      ? null
      : h(
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
    oberta && !lectura ? quadreTaula(configuracio, a, index, accions) : null,
  );
}

export function pantallaMenu(dades: DadesMenu, accions: AccionsMenu): HTMLElement {
  const { configuracio, graella, apats, avisos, lectura } = dades;
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

  mensual = dades.periode === 'mes' && dades.mes !== undefined;
  const setmanes = setmanesDelMenu(apats);
  const visible = Math.min(Math.max(0, dades.setmanaVisible), Math.max(0, setmanes.length - 1));
  const indexsVisibles = mensual ? (setmanes[visible]?.indexs ?? []) : apats.map((_, i) => i);
  // Dies a mostrar: en el menú mensual, cada data de la setmana visible; en el setmanal, cada dia de la setmana.
  const claus = mensual
    ? [...new Set(indexsVisibles.map((i) => apats[i]!.data!))]
    : DIES.filter((dia) => apats.some((a) => a.dia === dia));
  const dies = claus.map((clau) => {
    const delDia = indexsVisibles.map((index) => ({ a: apats[index]!, index })).filter(({ a }) => (mensual ? a.data === clau : a.dia === clau));
    const dia = delDia[0]!.a.dia;
    return { clau, nom: mensual ? tm.diaAmbData(textos.dies[dia], clau) : textos.dies[dia], apats: delDia };
  });
  const estalvi = mensual && apats.length > 0 ? estalviCompraPeriode(catalegInicial, configuracio, apats).estalviCentims : 0;
  const setmanaActual = setmanes[visible];
  const navegacioSetmanes =
    mensual && setmanaActual
      ? h(
          'div',
          { class: 'setmanes' },
          h('button', { type: 'button', class: 'boto boto--petit boto--secundari', 'aria-label': tm.setmanaAnterior, 'data-setmana': 'anterior', disabled: visible === 0, onclick: () => accions.veureSetmana(visible - 1) }, '‹'),
          h(
            'p',
            { class: 'setmanes__text', 'aria-live': 'polite' },
            h('strong', {}, tm.setmana(visible + 1, setmanes.length)),
            h('span', { class: 'setmanes__rang' }, tm.rang(apats[setmanaActual.indexs[0]!]!.data!, apats[setmanaActual.indexs.at(-1)!]!.data!)),
          ),
          h('button', { type: 'button', class: 'boto boto--petit boto--secundari', 'aria-label': tm.setmanaSeguent, 'data-setmana': 'seguent', disabled: visible >= setmanes.length - 1, onclick: () => accions.veureSetmana(visible + 1) }, '›'),
        )
      : null;

  return h(
    'main',
    { class: 'menu' },
    lectura
      ? h(
          'div',
          { class: 'menu__anterior' },
          h('p', { class: 'menu__nota' }, tm.anterior.lectura),
          h('button', { type: 'button', class: 'boto boto--petit boto--secundari', 'data-anterior': 'tornar', onclick: accions.tornarAlActual }, `← ${tm.anterior.tornar}`),
        )
      : null,
    h('h1', { class: 'menu__titol', tabindex: -1 }, lectura ? lectura.titol : mensual ? tm.titolMes(dades.mes!) : tm.titol),
    !lectura && dades.anterior
      ? dades.anterior.queden > 0
        ? h(
            'div',
            { class: 'avis menu__anterior', role: 'status' },
            h('p', {}, tm.anterior.queden(dades.anterior.queden, dades.anterior.titol)),
            h('button', { type: 'button', class: 'boto boto--petit boto--secundari', 'data-anterior': 'veure', onclick: accions.veureAnterior }, tm.anterior.veure),
          )
        : h(
            'button',
            { type: 'button', class: 'boto boto--petit boto--fantasma menu__veure-anterior', 'data-anterior': 'veure', onclick: accions.veureAnterior },
            `← ${tm.anterior.boto(dades.anterior.titol)}`,
          )
      : null,
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
          mensual
            ? h(
                'p',
                { class: 'menu__nota' },
                [tm.compraMes(formatEuros(llista.totalCompraCentims)), estalvi > 0 ? tm.estalviMes(formatEuros(estalvi)) : ''].filter(Boolean).join(' '),
              )
            : h('p', { class: 'menu__nota' }, `${tm.compra(formatEuros(llista.totalCompraCentims))} ${tm.explicacioCompra}`),
        )
      : null,
    !lectura && dades.missatge ? h('p', { class: 'avis', role: 'status' }, dades.missatge) : null,
    !lectura && sobrePressupost ? h('p', { class: 'avis', role: 'status' }, tm.sobrePressupost) : null,
    ...(lectura ? [] : textosAvisos).map((text) => h('p', { class: 'avis', role: 'status' }, text)),
    lectura ? null : selectorPeriode(dades, accions),
    lectura ? null : graellaEditable(graella, dades.graellaOberta === true, accions.canviarGraella),
    apats.length === 0 ? h('p', { class: 'avis' }, tm.capApat) : null,
    apats.length > 0 && !lectura
      ? h('button', { type: 'button', class: 'boto boto--secundari menu__refer', onclick: accions.tornarAFer }, `🔄 ${tm.tornarAFer}`)
      : null,
    mensual && apats.length > 0 ? calendariMes(dades.mes!, apats, setmanes, visible, accions) : null,
    navegacioSetmanes,
    ...dies.map(({ clau, nom, apats: delDia }) =>
      h(
        'section',
        { class: 'dia', 'aria-labelledby': `dia-${clau}` },
        h('h2', { class: 'dia__nom', id: `dia-${clau}` }, nom),
        ...delDia.map(({ a, index }) => targetaApat(a, index, configuracio, dades.assistenciaOberta === index, accions, lectura !== undefined)),
      ),
    ),
  );
}
