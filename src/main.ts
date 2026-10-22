import './estils.css';
import { catalegInicial } from './dades';
import {
  avaluarMenu,
  diesQueQueden,
  esPeriodeNou,
  avui,
  canviarPlat,
  dillunsDe,
  diesDelMes,
  estalviCompraPeriode,
  mesSeguent,
  setmanesDelMenu,
  comensals,
  configuracioDesDeRespostes,
  conservarAssistencia,
  normalitzarAssistencia,
  racionsApat,
  acompanyamentsDePlat,
  triarPlat,
  planificar,
  respostesPerDefecte,
  type Assistencia,
  type ConfiguracioFamilia,
  type FiltreReceptari,
  type Graella,
  type RespostesQuestionari,
} from './domini';
import { textos } from './textos/ca';
import { pantallaCompra } from './ui/compra';
import { h, substituir } from './ui/dom';
import {
  carregarGraella,
  carregarMarcats,
  carregarMenu,
  carregarRespostes,
  desarGraella,
  desarMarcats,
  desarMenu,
  desarRespostes,
  type MenuAnterior,
  type MenuDesat,
  type PeriodeMenu,
} from './ui/emmagatzematge';
import { pantallaMenu } from './ui/menu';
import { pantallaPas, pantallaResum, PASSOS, type Pas } from './ui/questionari';
import { pantallaCuinar, sortirDelModeCuinar } from './ui/cuinar';
import { pantallaRecepta } from './ui/recepta';
import { pantallaTriar } from './ui/triar';
import { pantallaReceptari } from './ui/receptari';
import { pantallaEntrada } from './ui/entrada';
import {
  aturarSincronitzacio,
  hiHaPendents,
  iniciarSincronitzacio,
  nuvolActiu,
  sincronitzar,
  tancarSessio,
  usuariActual,
  type Usuari,
} from './ui/nuvol';

const arrel = document.querySelector<HTMLDivElement>('#app');
if (!arrel) throw new Error("No s'ha trobat l'element #app");

/** Pantalles amb adreça pròpia (es pot tornar enrere amb el botó del mòbil). */
type Seccio =
  | { tipus: 'menu' }
  | { tipus: 'anterior' }
  | { tipus: 'compra' }
  | { tipus: 'receptari' }
  | { tipus: 'resum' }
  | { tipus: 'triar'; index: number; receptaId?: string }
  | { tipus: 'recepta'; receptaId: string; acompanyamentId?: string; apat?: number; anterior?: boolean }
  | { tipus: 'cuinar'; receptaId: string; acompanyamentId?: string; pas: number; apat?: number; anterior?: boolean };

type Pantalla = { tipus: 'benvinguda' } | { tipus: 'pas'; pas: Pas; desDelResum: boolean } | Seccio;

const copia = (r: RespostesQuestionari): RespostesQuestionari => structuredClone(r);
const llavorNova = (): number => Math.floor(Math.random() * 2 ** 31);

/** Respostes desades; `null` si encara no s'ha fet el qüestionari. */
let desades = carregarRespostes();
/** Esborrany que editen les pantalles; només es desa en acabar. */
let esborrany = desades ? copia(desades) : respostesPerDefecte();
let menu: MenuDesat | null = carregarMenu(catalegInicial);
/** Missatge puntual per a la pantalla del menú (es mostra una vegada). */
let missatge: string | null = null;
/** Element a enfocar en tornar enrere (p. ex. el botó «Canvia» de l'àpat que s'acaba de canviar). */
let enfocarEnTornar: string | null = null;
/** Àpat del menú amb el quadre «Qui hi ha a taula?» obert. */
let assistenciaOberta: number | null = null;
/** Manté oberta la graella després de tocar-la. */
let graellaOberta = false;
/** Setmana del menú mensual que es mostra; `null`: la d'avui (o la primera). */
let setmanaVisible: number | null = null;
/** Setmana que es mostra del menú anterior (si és mensual). */
let setmanaVisibleAnterior: number | null = null;
/** Cerca del receptari (es conserva en tornar d'una recepta). */
let cercaReceptari = '';
/** Filtre de cuina o dieta del receptari. */
let filtreReceptari: FiltreReceptari | null = null;
/** Neteja de la pantalla actual (p. ex. el mode cuinar deixa d'escoltar els cronòmetres). */
let desmuntar: (() => void) | null = null;
/** Usuari amb sessió iniciada (només si hi ha Supabase configurat). */
let usuari: Usuari | null = null;
/** Cal iniciar sessió abans de fer res. */
const calEntrar = (): boolean => nuvolActiu && usuari === null;

// ——— Adreces ———

function adrecaDe(p: Pantalla): string | null {
  switch (p.tipus) {
    case 'menu':
      return '#/menu';
    case 'anterior':
      return '#/menu/anterior';
    case 'compra':
      return '#/compra';
    case 'receptari':
      return '#/receptari';
    case 'resum':
      return '#/configuracio';
    case 'triar':
      return `#/triar/${p.index}${p.receptaId ? `/${encodeURIComponent(p.receptaId)}` : ''}`;
    case 'recepta':
    case 'cuinar': {
      const params = new URLSearchParams();
      if (p.tipus === 'cuinar') params.set('pas', String(p.pas));
      if (p.acompanyamentId) params.set('amb', p.acompanyamentId);
      if (p.apat !== undefined) params.set('apat', String(p.apat));
      if (p.anterior) params.set('ant', '1');
      const consulta = params.toString();
      return `#/${p.tipus}/${encodeURIComponent(p.receptaId)}${consulta ? `?${consulta}` : ''}`;
    }
    default:
      return null;
  }
}

function seccioDe(adreca: string): Seccio | null {
  const [cami = '', consulta = ''] = adreca.replace(/^#/, '').split('?');
  if (cami === '/menu') return { tipus: 'menu' };
  if (cami === '/menu/anterior') return { tipus: 'anterior' };
  if (cami === '/compra') return { tipus: 'compra' };
  if (cami === '/receptari') return { tipus: 'receptari' };
  if (cami === '/configuracio') return { tipus: 'resum' };
  const triar = /^\/triar\/(\d+)(?:\/([^/]+))?$/.exec(cami);
  if (triar) {
    const index = Number.parseInt(triar[1]!, 10);
    const receptaId = triar[2] ? decodeURIComponent(triar[2]) : undefined;
    if (receptaId !== undefined && !catalegInicial.receptes.has(receptaId)) return { tipus: 'triar', index };
    return receptaId ? { tipus: 'triar', index, receptaId } : { tipus: 'triar', index };
  }
  const plat = /^\/(recepta|cuinar)\/([^/]+)$/.exec(cami);
  if (plat) {
    const receptaId = decodeURIComponent(plat[2]!);
    if (!catalegInicial.receptes.has(receptaId)) return null;
    const params = new URLSearchParams(consulta);
    const amb = params.get('amb');
    const apat = Number.parseInt(params.get('apat') ?? '', 10);
    const extra = {
      ...(amb && catalegInicial.receptes.has(amb) ? { acompanyamentId: amb } : {}),
      ...(Number.isInteger(apat) && apat >= 0 ? { apat } : {}),
      ...(params.get('ant') === '1' ? { anterior: true } : {}),
    };
    if (plat[1] === 'recepta') return { tipus: 'recepta', receptaId, ...extra };
    const pas = Math.max(0, Number.parseInt(params.get('pas') ?? '0', 10) || 0);
    return { tipus: 'cuinar', receptaId, pas, ...extra };
  }
  return null;
}

let pantalla: Pantalla = desades ? (seccioDe(location.hash) ?? { tipus: 'menu' }) : { tipus: 'benvinguda' };

// ——— Menú ———

/** Mesos que es poden triar per al menú mensual: la resta del que corre i el següent. */
function mesosTriables(): { mes: string; resta: boolean }[] {
  const actual = avui().slice(0, 7);
  return [
    { mes: actual, resta: !avui().endsWith('-01') },
    { mes: mesSeguent(actual), resta: false },
  ];
}

/** Mes per defecte en passar a menú mensual: el que corre fins a mig mes; després, el següent. */
const mesPerDefecte = (): string => (Number(avui().slice(8)) <= 15 ? avui().slice(0, 7) : mesSeguent(avui().slice(0, 7)));

/** Fa un menú nou amb la llavor i la graella indicades (i el període del menú actual) i el desa. */
function ferMenu(
  respostes: RespostesQuestionari,
  graella: Graella,
  llavor: number,
  periode: PeriodeMenu = menu?.periode ?? 'setmana',
  mes: string | undefined = menu?.mes,
): MenuDesat {
  const configuracio = configuracioDesDeRespostes(respostes);
  // Un mes que ja ha passat (o sense dies que quedin) passa al mes per defecte.
  let mesTriat = periode === 'mes' ? (mes ?? mesPerDefecte()) : undefined;
  if (mesTriat && diesDelMes(mesTriat, avui()).filter((d) => d.data >= avui()).length === 0) mesTriat = mesPerDefecte();
  const dies = mesTriat ? diesDelMes(mesTriat, avui()) : undefined;
  const pla = planificar({ cataleg: catalegInicial, configuracio, graella, llavor, ...(dies ? { dies } : {}) });
  // Els convidats i absències d'un dia no canvien perquè es torni a fer el menú.
  const apats = conservarAssistencia(configuracio.persones, pla.apats, menu?.apats ?? []);
  const nou: MenuDesat = { signatura: JSON.stringify(respostes), llavor, graella, apats, avisos: pla.avisos, creat: avui() };
  if (mesTriat) Object.assign(nou, { periode: 'mes', mes: mesTriat });
  // El menú d'un altre període passa a ser l'anterior (per seguir-lo mentre s'acaba); si és el mateix, es conserva el d'abans.
  const anterior = menu && esPeriodeNou(menu, nou) ? senseAnterior(menu) : menu?.anterior;
  if (anterior) nou.anterior = anterior;
  desarMenu(nou);
  return nou;
}

function senseAnterior(m: MenuDesat): MenuAnterior {
  const { anterior: _anterior, ...resta } = m;
  return resta;
}

/** Com es diu un menú guardat com a anterior. */
const titolAnterior = (m: MenuAnterior): string =>
  m.periode === 'mes' && m.mes ? textos.menu.titolMes(m.mes) : textos.menu.anterior.setmana;

/** Setmana a mostrar del menú mensual: la triada o, si no, la que conté avui. */
function setmanaAMostrar(m: MenuAnterior, triada: number | null = setmanaVisible): number {
  if (triada !== null) return triada;
  const dilluns = dillunsDe(avui());
  const index = setmanesDelMenu(m.apats).findIndex((s) => s.dilluns === dilluns);
  return Math.max(0, index);
}

/** El menú actual; si les respostes han canviat des que es va fer, se'n fa un de nou. */
function menuActual(respostes: RespostesQuestionari): MenuDesat {
  if (!menu || menu.signatura !== JSON.stringify(respostes)) {
    menu = ferMenu(respostes, menu?.graella ?? carregarGraella(), llavorNova());
  }
  return menu;
}

/** Identifica la llista de la compra: si canvien els àpats o la família, els productes marcats es reinicien. */
const signaturaCompra = (m: MenuDesat): string =>
  JSON.stringify([m.signatura, m.apats.map((a) => [a.data ?? a.dia, a.apat, a.receptaId, a.acompanyamentId ?? null])]);

/** Racions d'un plat obert des del menú (amb els convidats i absències d'aquell àpat), o de tota la família. */
function racionsDePlat(
  configuracio: ConfiguracioFamilia,
  receptaId: string,
  index: number | undefined,
  anterior = false,
): { racions: number; persones: number } {
  const apat = index === undefined ? undefined : (anterior ? menu?.anterior : menu)?.apats[index];
  if (apat && (apat.receptaId === receptaId || apat.acompanyamentId === receptaId)) {
    return { racions: racionsApat(configuracio.persones, apat), persones: comensals(configuracio.persones, apat.assistencia) };
  }
  return { racions: racionsApat(configuracio.persones, {}), persones: configuracio.persones.length };
}

// ——— Navegació ———

function enfocarTitol(): void {
  window.scrollTo(0, 0);
  arrel!.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
}

function anar(nova: Pantalla, { substituirHistoria = false } = {}): void {
  if (pantalla.tipus === 'cuinar' && nova.tipus !== 'cuinar') sortirDelModeCuinar();
  pantalla = nova;
  graellaOberta = false;
  assistenciaOberta = null;
  const adreca = adrecaDe(nova);
  if (adreca && adreca !== location.hash) {
    if (substituirHistoria) history.replaceState({ piatto: true }, '', adreca);
    else history.pushState({ piatto: true }, '', adreca);
  }
  pintar();
  enfocarTitol();
}

window.addEventListener('popstate', () => {
  if (!desades || calEntrar()) return;
  const nova: Pantalla = seccioDe(location.hash) ?? { tipus: 'menu' };
  if (pantalla.tipus === 'cuinar' && nova.tipus !== 'cuinar') sortirDelModeCuinar();
  pantalla = nova;
  graellaOberta = false;
  assistenciaOberta = null;
  pintar();
  const enfocar = enfocarEnTornar ? arrel!.querySelector<HTMLElement>(enfocarEnTornar) : null;
  enfocarEnTornar = null;
  if (enfocar) {
    enfocar.scrollIntoView({ block: 'center' });
    enfocar.focus({ preventScroll: true });
  } else enfocarTitol();
});

/** Torna a la pantalla anterior si l'hem obert nosaltres; si no (enllaç directe), al menú. */
function tornar(): void {
  if ((history.state as { piatto?: boolean } | null)?.piatto && history.length > 1) history.back();
  else anar({ tipus: 'menu' }, { substituirHistoria: true });
}

// ——— Accions ———

const accionsQuestionari = {
  anar: (pas: Pas | null): void => {
    if (pas === null) {
      // Torna al resum sense desar els canvis del pas.
      if (desades) esborrany = copia(desades);
      anar({ tipus: 'resum' });
    } else {
      const desDelResum = pantalla.tipus === 'resum' || (pantalla.tipus === 'pas' && pantalla.desDelResum);
      pantalla = { tipus: 'pas', pas, desDelResum };
      pintar();
      enfocarTitol();
    }
  },
  acabar: (): void => {
    const primeraVegada = desades === null;
    desades = copia(esborrany);
    desarRespostes(desades);
    anar({ tipus: primeraVegada ? 'menu' : 'resum' }, { substituirHistoria: true });
  },
};

/** Torna al menú des del selector de plats, traient-lo de l'historial, i enfoca l'àpat canviat. */
function tornarAlMenuDesDeTriar(index: number): void {
  const passos = pantalla.tipus === 'triar' && pantalla.receptaId ? 2 : 1;
  enfocarEnTornar = `[data-canviar="${index}"]`;
  if ((history.state as { piatto?: boolean } | null)?.piatto && history.length > passos) history.go(-passos);
  else {
    anar({ tipus: 'menu' }, { substituirHistoria: true });
    const boto = arrel!.querySelector<HTMLElement>(enfocarEnTornar);
    enfocarEnTornar = null;
    boto?.scrollIntoView({ block: 'center' });
    boto?.focus({ preventScroll: true });
  }
}

function accionsTriar(index: number) {
  return {
    tornar,
    triar: (receptaId: string, acompanyamentId?: string): void => {
      if (!desades || !menu) return;
      const apats = triarPlat(catalegInicial, configuracioDesDeRespostes(desades), menu.apats, index, receptaId, acompanyamentId);
      if (apats !== menu.apats && JSON.stringify(apats) !== JSON.stringify(menu.apats)) {
        menu = { ...menu, apats };
        desarMenu(menu);
      }
      tornarAlMenuDesDeTriar(index);
    },
    demanarAcompanyament: (receptaId: string): void => anar({ tipus: 'triar', index, receptaId }),
    atzar: (): void => {
      accionsMenu.canviarPlat(index, { pintar: false });
      tornarAlMenuDesDeTriar(index);
    },
  };
}

/** Obre la recepta d'un àpat del menú actual o de l'anterior. */
function obrirReceptaDe(m: MenuAnterior | null | undefined, index: number, anterior: boolean): void {
  const apat = m?.apats[index];
  if (!apat) return;
  enfocarEnTornar = null;
  anar({
    tipus: 'recepta',
    receptaId: apat.receptaId,
    apat: index,
    ...(apat.acompanyamentId ? { acompanyamentId: apat.acompanyamentId } : {}),
    ...(anterior ? { anterior: true } : {}),
  });
}

const accionsMenu = {
  /** Obre el llistat de plats per triar el d'aquest àpat. */
  obrirTriar: (index: number): void => anar({ tipus: 'triar', index }),
  /** Canvia el plat per un altre a l'atzar. */
  canviarPlat: (index: number, { pintar: repintar = true } = {}): void => {
    if (!desades || !menu) return;
    const apats = canviarPlat(catalegInicial, configuracioDesDeRespostes(desades), menu.apats, index, llavorNova());
    if (apats[index]?.receptaId === menu.apats[index]?.receptaId) {
      missatge = textos.menu.senseAlternativa;
    } else {
      menu = { ...menu, apats };
      desarMenu(menu);
    }
    if (!repintar) return;
    pintar();
    arrel!.querySelector<HTMLElement>(`[data-canviar="${index}"]`)?.focus();
  },
  canviarGraella: (graella: Graella, clau: string): void => {
    if (!desades || !menu) return;
    desarGraella(graella);
    menu = ferMenu(desades, graella, menu.llavor);
    graellaOberta = true;
    pintar();
    arrel!.querySelector<HTMLElement>(`[data-graella="${clau}"]`)?.focus();
  },
  tornarAFer: (): void => {
    if (!desades || !menu) return;
    menu = ferMenu(desades, menu.graella, llavorNova());
    pintar();
    enfocarTitol();
  },
  canviarPeriode: (periode: PeriodeMenu, mes?: string): void => {
    if (!desades || !menu) return;
    const mesNou = periode === 'mes' ? (mes ?? menu.mes ?? mesPerDefecte()) : undefined;
    if ((menu.periode ?? 'setmana') === periode && menu.mes === mesNou) return;
    menu = ferMenu(desades, menu.graella, llavorNova(), periode, mesNou);
    setmanaVisible = null;
    pintar();
    arrel!.querySelector<HTMLElement>(`[data-periode="${mesNou ?? periode}"]`)?.focus();
  },
  veureSetmana: (index: number): void => {
    if (!menu || index < 0 || index >= setmanesDelMenu(menu.apats).length) return;
    const boto = (document.activeElement as HTMLElement | null)?.dataset['setmana'];
    setmanaVisible = index;
    pintar();
    if (boto) arrel!.querySelector<HTMLElement>(`[data-setmana="${boto}"]`)?.focus();
    else arrel!.querySelector<HTMLElement>('.setmanes')?.scrollIntoView({ block: 'start' });
  },
  obrirRecepta: (index: number): void => obrirReceptaDe(menu, index, false),
  veureAnterior: (): void => {
    if (!menu?.anterior) return;
    setmanaVisibleAnterior = null;
    anar({ tipus: 'anterior' });
  },
  tornarAlActual: (): void => anar({ tipus: 'menu' }),
  /** Obre o tanca el quadre «Qui hi ha a taula?» d'un àpat. */
  obrirAssistencia: (index: number): void => {
    assistenciaOberta = assistenciaOberta === index ? null : index;
    const y = window.scrollY;
    pintar();
    window.scrollTo(0, y);
    arrel!.querySelector<HTMLElement>(`[data-assistencia="${index}"]`)?.focus({ preventScroll: true });
  },
  canviarAssistencia: (index: number, assistencia: Assistencia, enfocar: string): void => {
    if (!desades || !menu?.apats[index]) return;
    const persones = configuracioDesDeRespostes(desades).persones;
    const normal = normalitzarAssistencia(persones, assistencia);
    menu = {
      ...menu,
      apats: menu.apats.map((a, i) => {
        if (i !== index) return a;
        const { assistencia: _treta, ...sense } = a;
        return normal ? { ...sense, assistencia: normal } : sense;
      }),
    };
    desarMenu(menu);
    assistenciaOberta = index;
    const y = window.scrollY;
    pintar();
    window.scrollTo(0, y);
    arrel!.querySelector<HTMLElement>(enfocar)?.focus({ preventScroll: true });
  },
};

function accionsCompra(signatura: string, marcats: Set<string>) {
  return {
    commutar: (ingredientId: string, marcat: boolean): void => {
      if (marcat) marcats.add(ingredientId);
      else marcats.delete(ingredientId);
      desarMarcats(signatura, marcats);
      pintar();
      arrel!.querySelector<HTMLElement>(`[data-ingredient="${ingredientId}"]`)?.focus({ preventScroll: true });
    },
    desmarcar: (): void => {
      desarMarcats(signatura, new Set());
      pintar();
      enfocarTitol();
    },
  };
}

// ——— Compte i dades al núvol ———

/** Torna a llegir les dades desades (p. ex. quan arriben del compte). */
function recarregarDades(): void {
  desades = carregarRespostes();
  menu = carregarMenu(catalegInicial);
  // Si s'està editant el qüestionari, no es trepitja l'esborrany.
  if (pantalla.tipus !== 'pas') esborrany = desades ? copia(desades) : respostesPerDefecte();
}

/** Han arribat dades d'un altre mòbil amb el mateix compte. */
function quanArribinCanvis(): void {
  recarregarDades();
  // No es repinta mentre s'edita el qüestionari o es cuina: les dades noves surten a la pantalla següent.
  if (pantalla.tipus === 'pas' || pantalla.tipus === 'cuinar') return;
  if (pantalla.tipus === 'benvinguda' && desades) pantalla = { tipus: 'menu' };
  const y = window.scrollY;
  pintar();
  window.scrollTo(0, y);
}

const textEstatCompte = (): string => (hiHaPendents() ? textos.compte.pendent : textos.compte.desat);

/** Actualitza només el text de l'estat del compte, si és a la pantalla. */
function pintarEstatCompte(): void {
  const el = arrel!.querySelector<HTMLElement>('[data-estat-compte]');
  if (el) el.textContent = textEstatCompte();
}

async function quanEntri(): Promise<void> {
  usuari = await usuariActual();
  if (!usuari) {
    pintar();
    return;
  }
  // Primer s'ajunten les dades del mòbil i les del compte, i després es mostra l'app.
  await sincronitzar();
  recarregarDades();
  iniciarSincronitzacio(quanArribinCanvis, pintarEstatCompte);
  anar(desades ? { tipus: 'menu' } : { tipus: 'benvinguda' }, { substituirHistoria: true });
}

async function sortirDelCompte(): Promise<void> {
  if (!window.confirm(textos.compte.confirmarTancar)) return;
  aturarSincronitzacio();
  await tancarSessio();
  usuari = null;
  desades = null;
  esborrany = respostesPerDefecte();
  menu = null;
  pantalla = { tipus: 'benvinguda' };
  history.replaceState({ piatto: false }, '', '#/');
  pintar();
  enfocarTitol();
}

function seccioCompte(): HTMLElement | null {
  if (!usuari) return null;
  return h(
    'section',
    { class: 'compte', 'aria-labelledby': 'compte-titol' },
    h('h2', { class: 'compte__titol', id: 'compte-titol' }, textos.compte.titol),
    h('p', { class: 'compte__text' }, textos.compte.entratCom(usuari.correu)),
    h('p', { class: 'compte__text', 'data-estat-compte': true, role: 'status' }, textEstatCompte()),
    h('button', { type: 'button', class: 'boto boto--secundari', onclick: () => void sortirDelCompte() }, textos.compte.tancar),
  );
}

// ——— Pantalles ———

function navegacio(): HTMLElement {
  // Una recepta oberta des d'un àpat és del menú; sense àpat, del receptari.
  const actiu =
    pantalla.tipus === 'recepta' ? (pantalla.apat === undefined ? 'receptari' : 'menu') : pantalla.tipus === 'triar' || pantalla.tipus === 'anterior' ? 'menu' : pantalla.tipus;
  const pestanya = (tipus: 'menu' | 'compra' | 'receptari' | 'resum', icona: string, text: string): HTMLElement =>
    h(
      'button',
      {
        type: 'button',
        class: 'navegacio__pestanya',
        'aria-current': actiu === tipus ? 'page' : false,
        onclick: () => {
          if (pantalla.tipus !== tipus) anar({ tipus });
        },
      },
      h('span', { class: 'navegacio__icona', 'aria-hidden': 'true' }, icona),
      h('span', { class: 'navegacio__text' }, text),
    );
  return h(
    'nav',
    { class: 'navegacio', 'aria-label': textos.navegacio.principal },
    pestanya('menu', '🍽', textos.navegacio.menu),
    pestanya('compra', '🛒', textos.navegacio.compra),
    pestanya('receptari', '📖', textos.navegacio.receptari),
    pestanya('resum', '⚙', textos.navegacio.configuracio),
  );
}

function capcalera(): HTMLElement {
  return h(
    'header',
    { class: 'capcalera' },
    h(
      'span',
      { class: 'marca capcalera__marca', 'aria-hidden': 'true' },
      h('span', { class: 'marca__paraula' }, textos.app.nomParts.paraula),
      h('span', { class: 'marca__numero' }, textos.app.nomParts.numero),
    ),
  );
}

function benvinguda(): HTMLElement {
  const { nomParts, lema } = textos.app;
  return h(
    'main',
    { class: 'benvinguda' },
    h('img', { class: 'benvinguda__icona', src: '/icons/icona-512.png', alt: '', width: 160, height: 160 }),
    h(
      'h1',
      { class: 'marca', tabindex: -1 },
      h('span', { class: 'marca__paraula' }, nomParts.paraula),
      h('span', { class: 'marca__numero' }, nomParts.numero),
    ),
    h('p', { class: 'benvinguda__lema' }, lema),
    h('p', { class: 'benvinguda__estat' }, textos.benvinguda.explicacio),
    h(
      'button',
      {
        type: 'button',
        class: 'boto boto--principal boto--gran',
        onclick: () => accionsQuestionari.anar(PASSOS[0]),
      },
      textos.accions.comencar,
    ),
    h('p', { class: 'benvinguda__nota' }, nuvolActiu ? textos.benvinguda.desatCompte : textos.benvinguda.desatLocal),
  );
}

function contingutSeccio(respostes: RespostesQuestionari, seccio: Seccio): HTMLElement {
  const configuracio = configuracioDesDeRespostes(respostes);
  const actual = menuActual(respostes);
  switch (seccio.tipus) {
    case 'resum': {
      const resum = pantallaResum(esborrany, accionsQuestionari);
      const compte = seccioCompte();
      if (compte) resum.append(compte);
      return resum;
    }
    case 'compra': {
      const signatura = signaturaCompra(actual);
      const marcats = carregarMarcats(signatura);
      const { llista } = avaluarMenu(catalegInicial, configuracio, actual.apats);
      const mensual = actual.periode === 'mes' && actual.mes ? actual.mes : undefined;
      const estalviCentims = mensual ? estalviCompraPeriode(catalegInicial, configuracio, actual.apats).estalviCentims : 0;
      return pantallaCompra(llista, marcats, accionsCompra(signatura, marcats), mensual ? { mes: mensual, estalviCentims } : undefined);
    }
    case 'receptari':
      return pantallaReceptari(
        { configuracio, racionsCentesimes: racionsApat(configuracio.persones, {}), cerca: cercaReceptari, filtre: filtreReceptari },
        {
          obrir: (receptaId) => {
            enfocarEnTornar = `[data-plat="${CSS.escape(receptaId)}"]`;
            anar({ tipus: 'recepta', receptaId });
          },
          cercar: (text) => {
            cercaReceptari = text;
          },
          filtrar: (filtre) => {
            filtreReceptari = filtre;
            const y = window.scrollY;
            pintar();
            window.scrollTo(0, y);
            arrel!.querySelector<HTMLElement>(`[data-filtre="${filtre ?? 'totes'}"]`)?.focus({ preventScroll: true });
          },
        },
      );
    case 'recepta': {
      const { racions, persones } = racionsDePlat(configuracio, seccio.receptaId, seccio.apat, seccio.anterior);
      // Plat a la carta que demana acompanyament: es diu amb què va bé.
      const suggeriments =
        seccio.apat === undefined && !seccio.acompanyamentId
          ? acompanyamentsDePlat(catalegInicial, configuracio, seccio.receptaId).map((r) => r.id)
          : [];
      return pantallaRecepta(
        { ...seccio, racionsCentesimes: racions, persones, suggeriments },
        {
          tornar,
          obrir: (receptaId) =>
            anar(
              seccio.apat === undefined
                ? { tipus: 'recepta', receptaId }
                : { tipus: 'recepta', receptaId, apat: seccio.apat, ...(seccio.anterior ? { anterior: true } : {}) },
            ),
          cuinar: () => anar({ ...seccio, tipus: 'cuinar', pas: 0 }),
        },
      );
    }
    case 'cuinar': {
      const { racions } = racionsDePlat(configuracio, seccio.receptaId, seccio.apat, seccio.anterior);
      const anarAlPas = (pas: number): void => anar({ ...seccio, pas }, { substituirHistoria: true });
      const pantallaC = pantallaCuinar(
        { ...seccio, racionsCentesimes: racions },
        {
          anarAlPas,
          cuinar: (receptaId, pas) =>
            anar(
              receptaId === seccio.receptaId
                ? { ...seccio, pas }
                : seccio.apat === undefined
                  ? { tipus: 'cuinar', receptaId, pas }
                  : { tipus: 'cuinar', receptaId, pas, apat: seccio.apat, ...(seccio.anterior ? { anterior: true } : {}) },
              { substituirHistoria: true },
            ),
          // Torna on era (normalment la recepta); si s'hi ha arribat per un enllaç directe, al menú.
          sortir: tornar,
          menu: () => anar({ tipus: 'menu' }, { substituirHistoria: true }),
        },
      );
      desmuntar = pantallaC.desmuntar;
      return pantallaC.element;
    }
    case 'triar': {
      if (!actual.apats[seccio.index]) {
        pantalla = { tipus: 'menu' };
        history.replaceState({ piatto: false }, '', '#/menu');
        return contingutSeccio(respostes, pantalla);
      }
      const racionsCentesimes = racionsApat(configuracio.persones, actual.apats[seccio.index]!);
      return pantallaTriar(
        { configuracio, apats: actual.apats, index: seccio.index, racionsCentesimes, ...(seccio.receptaId ? { receptaId: seccio.receptaId } : {}) },
        accionsTriar(seccio.index),
      );
    }
    case 'menu': {
      const avisPuntual = missatge;
      missatge = null;
      return pantallaMenu(
        {
          configuracio,
          graella: actual.graella,
          apats: actual.apats,
          avisos: actual.avisos,
          missatge: avisPuntual,
          graellaOberta,
          assistenciaOberta,
          periode: actual.periode ?? 'setmana',
          ...(actual.mes ? { mes: actual.mes } : {}),
          mesos: mesosTriables(),
          setmanaVisible: setmanaAMostrar(actual),
          ...(actual.anterior
            ? { anterior: { titol: titolAnterior(actual.anterior), queden: diesQueQueden(actual.anterior.apats, avui()) } }
            : {}),
        },
        accionsMenu,
      );
    }
    case 'anterior': {
      const ant = actual.anterior;
      if (!ant) {
        pantalla = { tipus: 'menu' };
        history.replaceState({ piatto: false }, '', '#/menu');
        return contingutSeccio(respostes, pantalla);
      }
      return pantallaMenu(
        {
          configuracio,
          graella: ant.graella,
          apats: ant.apats,
          avisos: [],
          periode: ant.periode ?? 'setmana',
          ...(ant.mes ? { mes: ant.mes } : {}),
          mesos: [],
          setmanaVisible: setmanaAMostrar(ant, setmanaVisibleAnterior),
          lectura: { titol: titolAnterior(ant) },
        },
        {
          ...accionsMenu,
          obrirRecepta: (index) => obrirReceptaDe(ant, index, true),
          veureSetmana: (index) => {
            if (index < 0 || index >= setmanesDelMenu(ant.apats).length) return;
            const boto = (document.activeElement as HTMLElement | null)?.dataset['setmana'];
            setmanaVisibleAnterior = index;
            pintar();
            if (boto) arrel!.querySelector<HTMLElement>(`[data-setmana="${boto}"]`)?.focus();
            else arrel!.querySelector<HTMLElement>('.setmanes')?.scrollIntoView({ block: 'start' });
          },
        },
      );
    }
  }
}

function pintar(): void {
  desmuntar?.();
  desmuntar = null;
  if (calEntrar()) {
    const entrada = pantallaEntrada(() => void quanEntri());
    desmuntar = entrada.desmuntar;
    substituir(arrel!, entrada.element);
  } else if (pantalla.tipus === 'pas') {
    substituir(arrel!, pantallaPas(esborrany, pantalla.pas, pantalla.desDelResum, accionsQuestionari));
  } else if (pantalla.tipus === 'benvinguda' || !desades) {
    pantalla = { tipus: 'benvinguda' };
    substituir(arrel!, benvinguda());
  } else if (pantalla.tipus === 'cuinar') {
    substituir(arrel!, contingutSeccio(desades, pantalla));
  } else {
    substituir(arrel!, capcalera(), contingutSeccio(desades, pantalla), navegacio());
  }
}

async function iniciar(): Promise<void> {
  if (nuvolActiu) {
    // La sessió es desa al mòbil: no cal connexió per saber si ja s'havia entrat.
    usuari = await usuariActual();
    if (usuari) iniciarSincronitzacio(quanArribinCanvis, pintarEstatCompte);
  }
  // Primera pantalla: fixa l'adreça sense afegir cap pas a l'historial.
  const adrecaInicial = adrecaDe(pantalla);
  if (adrecaInicial && adrecaInicial !== location.hash) history.replaceState({ piatto: false }, '', adrecaInicial);
  pintar();
}

void iniciar();
