import { carnIPeixPerCongelar, catalegInicial } from '../dades';
import {
  APATS,
  avaluarMenu,
  categoriaPlat,
  diesDelMes,
  dillunsDe,
  sumarDies,
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
  type SetmanaAgenda,
  type Valoracio,
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
  /** Text de l'avís amb «Desfés» després de tornar a fer el menú; `null` si no es pot desfer. */
  desfer?: string | null;
  /** Data d'avui («AAAA-MM-DD»): els àpats d'abans es poden valorar (👍 / 👎) en lloc de canviar-los. */
  avui: string;
  /** Menú setmanal: dilluns de la setmana del menú («AAAA-MM-DD»), per posar data als dies. */
  dilluns?: string;
  /** Àpat amb el quadre «Qui hi ha a taula?» obert. */
  assistenciaOberta?: number | null;
  periode: PeriodeMenu;
  /** Mes del menú mensual («AAAA-MM»). */
  mes?: string;
  /** Mesos que es poden triar: el que corre (la resta) i el següent. */
  mesos: { mes: string; resta: boolean }[];
  /** Setmanes que es mostren (àpats per data, del menú actual i, si cal, de l'anterior): vegeu `agendaMenu`. */
  agenda: SetmanaAgenda[];
  /** Àpats del menú anterior (els de l'agenda amb origen «anterior»). */
  apatsAnterior?: ApatPlanificat[];
  /** Setmana de l'agenda que es mostra (índex). */
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
  /** Torna al menú d'abans de l'últim «Fes un altre menú» o canvi de graella. */
  desfer: () => void;
  /** Fixa o deixa de fixar el plat d'un àpat. */
  fixar: (index: number) => void;
  /** Valora un plat (👍 / 👎); `null` treu la valoració. `index`: àpat des d'on es valora (per tornar-hi el focus). */
  valorar: (receptaId: string, valoracio: Valoracio | null, index: number) => void;
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
  /** Obre el full «Ajusta el menú» (període i graella). */
  obrirAjustos: () => void;
  obrirCompra: () => void;
  /** Obre el mode cuinar del plat d'un àpat. */
  cuinar: (index: number) => void;
  /** Recepta i mode cuinar d'un àpat del menú anterior (els que encara surten a l'agenda). */
  obrirReceptaAnterior: (index: number) => void;
  cuinarAnterior: (index: number) => void;
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

function graellaEditable(graella: Graella, canviar: (g: Graella, clau: string) => void): HTMLElement {
  return h(
    'section',
    { class: 'graella', 'aria-labelledby': 'graella-titol' },
    h('h2', { class: 'graella__titol', id: 'graella-titol' }, tm.graella),
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
function selectorPeriode(dades: Pick<DadesMenu, 'periode' | 'mes' | 'mesos'>, accions: Pick<AccionsMenu, 'canviarPeriode'>): HTMLElement {
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
function calendariMes(mes: string, apats: readonly ApatPlanificat[], agenda: readonly SetmanaAgenda[], visible: number, accions: AccionsMenu): HTMLElement {
  const dies = diesDelMes(mes);
  const buits = DIES.indexOf(dies[0]!.dia);
  const setmanaDe = (data: string): number => agenda.findIndex((s) => s.dilluns === dillunsDe(data));
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
  passat = false,
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
  const fixat = a.fixat === true;
  return h(
    'article',
    { class: `apat${fixat ? ' apat--fixat' : ''}` },
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
    passat
      ? valoracioApat(a.receptaId, nomPlat, index, configuracio, accions)
      : lectura
      ? null
      : h(
          'div',
          { class: 'apat__botons' },
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
          h(
            'button',
            {
              type: 'button',
              class: `boto boto--petit apat__fixa${fixat ? ' apat__fixa--actiu' : ' boto--fantasma'}`,
              'data-fixar': index,
              'aria-pressed': fixat ? 'true' : 'false',
              'aria-label': (fixat ? tm.desfixaEtiqueta : tm.fixaEtiqueta)(textos.apats[a.apat], textos.dies[a.dia], nomPlat),
              onclick: () => accions.fixar(index),
            },
            h('span', { 'aria-hidden': 'true' }, '📌 '),
            fixat ? tm.fixat : tm.fixa,
          ),
        ),
    oberta && !lectura ? quadreTaula(configuracio, a, index, accions) : null,
  );
}

/** 👍 / 👎 d'un àpat que ja ha passat (es valora el plat, no l'àpat). */
function valoracioApat(receptaId: string, nomPlat: string, index: number, configuracio: ConfiguracioFamilia, accions: AccionsMenu): HTMLElement {
  const tv = tm.valoracio;
  const actual = configuracio.valoracions?.[receptaId];
  const boto = (v: Valoracio, icona: string, text: string, etiqueta: string): HTMLElement =>
    h(
      'button',
      {
        type: 'button',
        class: `boto boto--petit apat__polze${actual === v ? ' apat__polze--actiu' : ' boto--fantasma'}`,
        'data-valorar': `${index}-${v}`,
        'aria-pressed': actual === v ? 'true' : 'false',
        'aria-label': etiqueta,
        onclick: () => accions.valorar(receptaId, actual === v ? null : v, index),
      },
      // De dalt a baix: «Ens ha encantat», 👍, 👎, «No ha triomfat».
      ...(v === 'agrada'
        ? [h('span', { class: 'apat__polze-text' }, text), h('span', { class: 'apat__polze-icona', 'aria-hidden': 'true' }, icona)]
        : [h('span', { class: 'apat__polze-icona', 'aria-hidden': 'true' }, icona), h('span', { class: 'apat__polze-text' }, text)]),
    );
  return h(
    'div',
    { class: 'apat__valoracio', role: 'group', 'aria-label': tv.pregunta },
    boto('agrada', '👍', tv.agrada, tv.agradaEtiqueta(nomPlat)),
    boto('no-agrada', '👎', tv.noAgrada, tv.noAgradaEtiqueta(nomPlat)),
  );
}


/** Un àpat de l'agenda amb el seu plat i les accions del menú del qual és. */
interface ApatVist {
  a: ApatPlanificat;
  index: number;
  data?: string;
  anterior: boolean;
}

function apatsVistos(dades: DadesMenu, setmana: SetmanaAgenda | undefined): ApatVist[] {
  return (setmana?.apats ?? []).flatMap((x) => {
    const anterior = x.origen === 'anterior';
    const a = anterior ? dades.apatsAnterior?.[x.index] : dades.apats[x.index];
    if (!a) return [];
    return [{ a, index: x.index, anterior, ...(x.data ? { data: x.data } : {}) }];
  });
}

/** Accions per als àpats del menú anterior que surten a l'agenda: només consultar, cuinar i valorar. */
const accionsDe = (accions: AccionsMenu, anterior: boolean): AccionsMenu =>
  anterior ? { ...accions, obrirRecepta: accions.obrirReceptaAnterior, cuinar: accions.cuinarAnterior } : accions;

/** Targeta «Avui»: els àpats d'avui, amb accés directe a la recepta i al mode cuinar. */
function targetaAvui(avui: string, apats: ApatVist[], accions: AccionsMenu): HTMLElement {
  return h(
    'section',
    { class: 'avui', 'aria-labelledby': 'avui-titol' },
    h('h2', { class: 'avui__titol', id: 'avui-titol' }, tm.avui.titol(tm.diaAmbData(textos.dies[apats[0]!.a.dia], avui))),
    ...apats.map(({ a, index, anterior }) => {
      const acc = accionsDe(accions, anterior);
      const principal = recepta(a.receptaId);
      const acompanyament = a.acompanyamentId ? recepta(a.acompanyamentId) : undefined;
      const nomPlat = principal?.nom ?? a.receptaId;
      return h(
        'div',
        { class: 'avui__apat' },
        h(
          'div',
          { class: 'avui__text' },
          h('p', { class: 'apat__quan' }, textos.apats[a.apat]),
          h(
            'p',
            { class: 'avui__plat' },
            h('button', { type: 'button', class: 'enllac', 'aria-label': tm.veureRecepta(nomPlat), onclick: () => acc.obrirRecepta(index) }, nomPlat),
          ),
          acompanyament ? h('p', { class: 'apat__acompanyament' }, tm.amb(acompanyament.nom)) : null,
          principal ? h('p', { class: 'apat__meta' }, tm.minuts(principal.tempsMinuts)) : null,
        ),
        h(
          'button',
          { type: 'button', class: 'boto boto--petit boto--principal', 'data-cuinar': index, 'aria-label': tm.avui.cuinaEtiqueta(nomPlat), onclick: () => acc.cuinar(index) },
          `🍳 ${tm.avui.cuina}`,
        ),
      );
    }),
  );
}

export function pantallaMenu(dades: DadesMenu, accions: AccionsMenu): HTMLElement {
  const { configuracio, apats, avisos, lectura, agenda } = dades;
  const { llista, costConsumitCentims, racionsMenuCentesimes } = avaluarMenu(catalegInicial, configuracio, apats);
  const perApat = apats.length > 0 ? Math.round(costConsumitCentims / apats.length) : 0;
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
  const visible = Math.min(Math.max(0, dades.setmanaVisible), Math.max(0, agenda.length - 1));
  const setmanaActual = agenda[visible];
  const vistos = apatsVistos(dades, setmanaActual);
  // Dies de la setmana visible: per data; als menús antics sense dates, per dia de la setmana.
  const claus = [...new Set(vistos.map((v) => v.data ?? v.a.dia))];
  const dies = claus.map((clau) => {
    const delDia = vistos.filter((v) => (v.data ?? v.a.dia) === clau);
    const { a, data } = delDia[0]!;
    return { clau, data, nom: data ? tm.diaAmbData(textos.dies[a.dia], data) : textos.dies[a.dia], apats: delDia };
  });
  const datesSetmana = vistos.flatMap((v) => (v.data ? [v.data] : []));
  const navegacioSetmanes =
    agenda.length > 1 && setmanaActual
      ? h(
          'div',
          { class: 'setmanes' },
          h('button', { type: 'button', class: 'boto boto--petit boto--secundari', 'aria-label': tm.setmanaAnterior, 'data-setmana': 'anterior', disabled: visible === 0, onclick: () => accions.veureSetmana(visible - 1) }, '‹'),
          h(
            'p',
            { class: 'setmanes__text', 'aria-live': 'polite' },
            h('strong', {}, tm.setmana(visible + 1, agenda.length)),
            datesSetmana.length > 0 ? h('span', { class: 'setmanes__rang' }, tm.rang(datesSetmana[0]!, datesSetmana.at(-1)!)) : null,
          ),
          h('button', { type: 'button', class: 'boto boto--petit boto--secundari', 'aria-label': tm.setmanaSeguent, 'data-setmana': 'seguent', disabled: visible >= agenda.length - 1, onclick: () => accions.veureSetmana(visible + 1) }, '›'),
        )
      : null;

  // Títol: el mes, les dates de la setmana o, als menús antics sense data, «Menú de la setmana».
  const datesMenu = !mensual && dades.dilluns ? ([dades.dilluns, sumarDies(dades.dilluns, 6)] as const) : null;
  const titol = lectura ? lectura.titol : mensual ? tm.titolMes(dades.mes!) : datesMenu ? tm.titolDates(...datesMenu) : tm.titol;
  // Avui: de l'agenda sencera (pot ser d'una altra setmana de la que es veu, i del menú anterior).
  const apatsAvui = lectura ? [] : agenda.flatMap((s) => apatsVistos(dades, s)).filter((v) => v.data === dades.avui);
  const textResum =
    apats.length > 0 ? (mensual ? tm.resumLiniaMes : tm.resumLinia)(formatEuros(perApat), formatEuros(llista.totalCompraCentims)) : null;

  return h(
    'main',
    { class: 'menu' },
    // El títol es llegeix primer (lectors de pantalla); a la vista surt sota el calendari.
    h('h1', { class: 'visualment-amagat', tabindex: -1 }, titol),
    lectura
      ? h(
          'div',
          { class: 'menu__anterior' },
          h('p', { class: 'menu__nota' }, tm.anterior.lectura),
          h('button', { type: 'button', class: 'boto boto--petit boto--secundari', 'data-anterior': 'tornar', onclick: accions.tornarAlActual }, `← ${tm.anterior.tornar}`),
        )
      : null,
    !lectura && dades.missatge ? h('p', { class: 'avis', role: 'status' }, dades.missatge) : null,
    apatsAvui.length > 0 ? targetaAvui(dades.avui, apatsAvui, accions) : null,
    navegacioSetmanes,
    ...dies.map(({ clau, data, nom, apats: delDia }) => {
      const esAvui = !lectura && data === dades.avui;
      return h(
        'section',
        { class: `dia${esAvui ? ' dia--avui' : ''}`, 'aria-labelledby': `dia-${clau}` },
        h('h2', { class: 'dia__nom', id: `dia-${clau}` }, nom, esAvui ? h('span', { class: 'dia__avui' }, tm.avui.marca) : null),
        ...delDia.map(({ a, index, data: dataApat, anterior }) => {
          const passat = dataApat !== undefined && dataApat < dades.avui;
          const sola = lectura !== undefined || anterior;
          return targetaApat(a, index, configuracio, !sola && dades.assistenciaOberta === index, accionsDe(accions, anterior), sola, passat);
        }),
      );
    }),
    mensual && apats.length > 0 ? calendariMes(dades.mes!, apats, agenda, visible, accions) : null,
    h(
      'section',
      { class: 'menu__peu', 'aria-label': titol },
      h(
        'div',
        { class: 'menu__capcalera' },
        h('p', { class: 'menu__titol', 'aria-hidden': 'true' }, titol),
        lectura
          ? null
          : h(
              'button',
              { type: 'button', class: 'boto boto--petit boto--secundari', 'aria-label': tm.ajustaEtiqueta, 'data-ajustos': true, onclick: accions.obrirAjustos },
              `⚙ ${tm.ajusta}`,
            ),
      ),
      textResum
        ? lectura
          ? h('p', { class: 'menu__cost' }, textResum)
          : h(
              'button',
              { type: 'button', class: 'enllac menu__cost', 'aria-label': tm.resumEtiqueta(textResum), onclick: accions.obrirCompra },
              `${textResum} ›`,
            )
        : null,
      !lectura && sobrePressupost ? h('p', { class: 'avis', role: 'status' }, tm.sobrePressupost) : null,
      ...(lectura ? [] : textosAvisos).map((text) => h('p', { class: 'avis', role: 'status' }, text)),
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
    ),
    apats.length === 0 ? h('p', { class: 'avis' }, tm.capApat) : null,
    apats.length > 0 && !lectura
      ? h('button', { type: 'button', class: 'boto boto--secundari menu__refer', onclick: accions.tornarAFer }, `🔄 ${tm.tornarAFer}`)
      : null,
    !lectura && dades.desfer ? avisDesfer(dades.desfer, accions.desfer) : null,
  );
}

function avisDesfer(text: string, desfer: () => void): HTMLElement {
  return h(
    'div',
    { class: 'avis menu__desfer', role: 'status' },
    h('p', {}, text),
    h('button', { type: 'button', class: 'boto boto--petit boto--secundari', 'data-desfer': true, onclick: desfer }, `↩ ${tm.desfer}`),
  );
}

export interface DadesAjustos extends Pick<DadesMenu, 'periode' | 'mes' | 'mesos' | 'graella'> {
  desfer?: string | null;
}

/** Full «Ajusta el menú»: per a quant de temps i quins àpats es fan a casa. */
export function pantallaAjustos(
  dades: DadesAjustos,
  accions: Pick<AccionsMenu, 'canviarPeriode' | 'canviarGraella' | 'desfer'> & { tornar: () => void },
): HTMLElement {
  return h(
    'main',
    { class: 'menu ajustos' },
    h('button', { type: 'button', class: 'boto boto--petit boto--fantasma ajustos__tornar', onclick: accions.tornar }, `← ${tm.ajustos.tornar}`),
    h('h1', { class: 'menu__titol', tabindex: -1 }, tm.ajustos.titol),
    h('p', { class: 'menu__nota' }, tm.ajustos.ajuda),
    selectorPeriode(dades, accions),
    graellaEditable(dades.graella, accions.canviarGraella),
    dades.desfer ? avisDesfer(dades.desfer, accions.desfer) : null,
  );
}
