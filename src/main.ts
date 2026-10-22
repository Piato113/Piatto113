import './estils.css';
import { catalegInicial } from './dades';
import { NOVETATS } from './dades/novetats';
import {
  clauNovetat,
  llegirEstadistiques,
  novetatsPerMostrar,
  xifresCataleg,
  type Estadistiques,
  avaluarMenu,
  diesQueQueden,
  esPeriodeNou,
  avui,
  canviarPlat,
  mesDe,
  dillunsDe,
  diesDelMes,
  estalviCompraPeriode,
  mesSeguent,
  setmanesDelMenu,
  comensals,
  configuracioDesDeRespostes,
  conservarAssistencia,
  mantenirMenu,
  normalitzarAssistencia,
  racionsApat,
  acompanyamentsDePlat,
  triarPlat,
  planificar,
  respostesPerDefecte,
  type Assistencia,
  type Valoracio,
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
  carregarCompra,
  carregarMenu,
  carregarRespostes,
  carregarValoracions,
  desarGraella,
  desarCompra,
  desarMenu,
  desarRespostes,
  desarValoracions,
  type MenuAnterior,
  type MenuDesat,
  type EstatCompra,
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
  comptarMenu,
  demanarEstadistiques,
  type Usuari,
} from './ui/nuvol';
import { rotol } from './ui/rotol';

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

type Pantalla = { tipus: 'pas'; pas: Pas; desDelResum: boolean } | Seccio;

const copia = (r: RespostesQuestionari): RespostesQuestionari => structuredClone(r);
const llavorNova = (): number => Math.floor(Math.random() * 2 ** 31);

/** Respostes desades; `null` si encara no s'ha fet el qüestionari. */
let desades = carregarRespostes();
/** Respostes amb què es fa el menú: les desades o, si encara no s'ha configurat res, les per defecte (menú d'exemple). */
const respostesActives = (): RespostesQuestionari => desades ?? respostesPerDefecte();
/** Plats valorats (👍 / 👎) per la família. */
let valoracions = carregarValoracions(catalegInicial);
/** Configuració de la família: la de les respostes més les valoracions dels plats. */
const configuracioDe = (respostes: RespostesQuestionari): ConfiguracioFamilia => ({
  ...configuracioDesDeRespostes(respostes),
  valoracions,
});
/** Esborrany que editen les pantalles; només es desa en acabar. */
let esborrany = desades ? copia(desades) : respostesPerDefecte();
let menu: MenuDesat | null = carregarMenu(catalegInicial);
/** Missatge puntual per a la pantalla del menú (es mostra una vegada). */
let missatge: string | null = null;
/** Element a enfocar en tornar enrere (p. ex. el botó «Canvia» de l'àpat que s'acaba de canviar). */
let enfocarEnTornar: string | null = null;
/** Àpat del menú amb el quadre «Qui hi ha a taula?» obert. */
let assistenciaOberta: number | null = null;
/** Menú d'abans de l'últim «Fes un altre menú» o canvi de graella, per poder-lo desfer; i el text de l'avís. */
let menuDesfer: { menu: MenuDesat; text: string } | null = null;
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

// ——— Rètol de xifres i novetats ———
const CLAU_ESTADISTIQUES = 'piatto113:estadistiques:v1';
const CLAU_NOVETAT_VISTA = 'piatto113:novetat-vista:v1';
/** Cada quant es tornen a demanar les xifres al compte. */
const CONSULTA_ESTADISTIQUES_MS = 5 * 60 * 1000;

function llegirLocal(clau: string): string | null {
  try {
    return window.localStorage.getItem(clau);
  } catch {
    return null;
  }
}

function desarLocal(clau: string, valor: string): void {
  try {
    window.localStorage.setItem(clau, valor);
  } catch {
    // Sense emmagatzematge: només es perd el record.
  }
}

/** Últimes xifres rebudes (es guarden per mostrar-les també sense connexió). */
let estadistiques: Estadistiques | null = (() => {
  try {
    return llegirEstadistiques(JSON.parse(llegirLocal(CLAU_ESTADISTIQUES) ?? 'null'));
  } catch {
    return null;
  }
})();
let darreraConsultaEstadistiques = 0;
/** La llista de novetats és oberta. */
let novetatsObertes = false;
const XIFRES_CATALEG = xifresCataleg(catalegInicial);
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

let pantalla: Pantalla = seccioDe(location.hash) ?? { tipus: 'menu' };

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
  mantenirFixats = false,
): MenuDesat {
  const configuracio = configuracioDe(respostes);
  // Un mes que ja ha passat (o sense dies que quedin) passa al mes per defecte.
  let mesTriat = periode === 'mes' ? (mes ?? mesPerDefecte()) : undefined;
  if (mesTriat && diesDelMes(mesTriat, avui()).filter((d) => d.data >= avui()).length === 0) mesTriat = mesPerDefecte();
  const dies = mesTriat ? diesDelMes(mesTriat, avui()) : undefined;
  const pla = planificar({ cataleg: catalegInicial, configuracio, graella, llavor, ...(dies ? { dies } : { mes: mesDe(avui()) }) });
  // Els convidats i absències d'un dia no canvien perquè es torni a fer el menú.
  const ambGent = conservarAssistencia(configuracio.persones, pla.apats, menu?.apats ?? []);
  // El que ja s'ha menjat aquesta setmana (o aquest mes) no canvia, i els plats fixats es mantenen
  // quan es torna a fer el menú amb les mateixes respostes.
  const identitat = mesTriat ? { periode: 'mes' as const, mes: mesTriat, creat: avui() } : { creat: avui() };
  const apats = mantenirMenu(catalegInicial, configuracio, ambGent, identitat, menu, avui(), llavor, mantenirFixats);
  const nou: MenuDesat = { signatura: JSON.stringify(respostes), llavor, graella, apats, avisos: pla.avisos, creat: avui() };
  if (mesTriat) Object.assign(nou, { periode: 'mes', mes: mesTriat });
  // El menú d'un altre període passa a ser l'anterior (per seguir-lo mentre s'acaba); si és el mateix, es conserva el d'abans.
  const anterior = menu && esPeriodeNou(menu, nou) ? senseAnterior(menu) : menu?.anterior;
  if (anterior) nou.anterior = anterior;
  desarMenu(nou);
  void comptarMenu();
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
  assistenciaOberta = null;
  menuDesfer = null;
  const adreca = adrecaDe(nova);
  if (adreca && adreca !== location.hash) {
    if (substituirHistoria) history.replaceState({ piatto: true }, '', adreca);
    else history.pushState({ piatto: true }, '', adreca);
  }
  pintar();
  enfocarTitol();
}

window.addEventListener('popstate', () => {
  if (calEntrar()) return;
  const nova: Pantalla = seccioDe(location.hash) ?? { tipus: 'menu' };
  if (pantalla.tipus === 'cuinar' && nova.tipus !== 'cuinar') sortirDelModeCuinar();
  pantalla = nova;
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
  sortir: (): void => {
    esborrany = desades ? copia(desades) : respostesPerDefecte();
    anar({ tipus: 'menu' }, { substituirHistoria: true });
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
      if (!menu) return;
      const apats = triarPlat(catalegInicial, configuracioDe(respostesActives()), menu.apats, index, receptaId, acompanyamentId);
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
    if (!menu) return;
    const apats = canviarPlat(catalegInicial, configuracioDe(respostesActives()), menu.apats, index, llavorNova(), mesDe(avui()));
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
    if (!menu) return;
    desarGraella(graella);
    menuDesfer = { menu, text: textos.menu.graellaCanviada };
    menu = ferMenu(respostesActives(), graella, menu.llavor, menu.periode ?? 'setmana', menu.mes, true);
    pintar();
    arrel!.querySelector<HTMLElement>(`[data-graella="${clau}"]`)?.focus();
  },
  tornarAFer: (): void => {
    if (!menu) return;
    const fixats = menu.apats.filter((a) => a.fixat).length;
    if (!window.confirm(textos.menu.confirmarTornarAFer(fixats))) return;
    menuDesfer = { menu, text: textos.menu.menuNou };
    menu = ferMenu(respostesActives(), menu.graella, llavorNova(), menu.periode ?? 'setmana', menu.mes, true);
    pintar();
    arrel!.querySelector<HTMLElement>('[data-desfer]')?.focus();
  },
  desfer: (): void => {
    if (!menuDesfer) return;
    menu = menuDesfer.menu;
    menuDesfer = null;
    desarMenu(menu);
    desarGraella(menu.graella);
    pintar();
    enfocarTitol();
  },
  valorar: (receptaId: string, valoracio: Valoracio | null, index: number): void => {
    const noves = { ...valoracions };
    if (valoracio) noves[receptaId] = valoracio;
    else delete noves[receptaId];
    valoracions = noves;
    desarValoracions(valoracions);
    const y = window.scrollY;
    pintar();
    window.scrollTo(0, y);
    arrel!.querySelector<HTMLElement>(`[data-valorar="${index}-${valoracio ?? 'agrada'}"]`)?.focus({ preventScroll: true });
  },
  fixar: (index: number): void => {
    if (!menu?.apats[index]) return;
    menuDesfer = null;
    menu = {
      ...menu,
      apats: menu.apats.map((a, i) => {
        if (i !== index) return a;
        const { fixat, ...sense } = a;
        return fixat ? sense : { ...sense, fixat: true };
      }),
    };
    desarMenu(menu);
    const y = window.scrollY;
    pintar();
    window.scrollTo(0, y);
    arrel!.querySelector<HTMLElement>(`[data-fixar="${index}"]`)?.focus({ preventScroll: true });
  },
  canviarPeriode: (periode: PeriodeMenu, mes?: string): void => {
    if (!menu) return;
    const mesNou = periode === 'mes' ? (mes ?? menu.mes ?? mesPerDefecte()) : undefined;
    if ((menu.periode ?? 'setmana') === periode && menu.mes === mesNou) return;
    menu = ferMenu(respostesActives(), menu.graella, llavorNova(), periode, mesNou);
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
    if (!menu?.apats[index]) return;
    const persones = configuracioDe(respostesActives()).persones;
    const normal = normalitzarAssistencia(persones, assistencia);
    menuDesfer = null;
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

/** Avís puntual de la pantalla de la compra (p. ex. «Llista copiada»). */
let avisCompra: string | null = null;

/**
 * Comparteix el text amb el menú de compartir del mòbil; si no n'hi ha, el copia.
 * Retorna el missatge a mostrar (`null` si s'ha compartit o s'ha tancat el menú de compartir).
 */
async function compartirText(text: string): Promise<string | null> {
  try {
    if (navigator.share) {
      await navigator.share({ title: textos.compra.titol, text });
      return null;
    }
  } catch (e) {
    // Si la persona tanca el menú de compartir, no cal fer res.
    if ((e as { name?: string }).name === 'AbortError') return null;
  }
  try {
    await navigator.clipboard.writeText(text);
    return textos.compra.copiada;
  } catch {
    return textos.compra.noCopiada;
  }
}

function accionsCompra(signatura: string, estat: EstatCompra) {
  const desarIPintar = (enfocar?: string): void => {
    desarCompra(signatura, estat);
    const y = window.scrollY;
    pintar();
    window.scrollTo(0, y);
    if (enfocar) arrel!.querySelector<HTMLElement>(enfocar)?.focus({ preventScroll: true });
  };
  return {
    commutar: (ingredientId: string, marcat: boolean): void => {
      if (marcat) estat.marcats.add(ingredientId);
      else estat.marcats.delete(ingredientId);
      desarIPintar(`[data-ingredient="${CSS.escape(ingredientId)}"]`);
    },
    tenir: (ingredientId: string, tinc: boolean): void => {
      if (tinc) {
        estat.tinc.add(ingredientId);
        estat.marcats.delete(ingredientId);
      } else estat.tinc.delete(ingredientId);
      desarIPintar(`[data-tinc="${CSS.escape(ingredientId)}"]`);
    },
    desmarcar: (): void => {
      desarCompra(signatura, { marcats: new Set(), tinc: new Set() });
      pintar();
      enfocarTitol();
    },
    compartir: (text: string): void =>
      void compartirText(text).then((avis) => {
        if (!avis || pantalla.tipus !== 'compra') return;
        avisCompra = avis;
        pintar();
        arrel!.querySelector<HTMLElement>('[data-compartir]')?.focus();
      }),
  };
}

// ——— Compte i dades al núvol ———

/** Torna a llegir les dades desades (p. ex. quan arriben del compte). */
function recarregarDades(): void {
  desades = carregarRespostes();
  menu = carregarMenu(catalegInicial);
  valoracions = carregarValoracions(catalegInicial);
  // Si s'està editant el qüestionari, no es trepitja l'esborrany.
  if (pantalla.tipus !== 'pas') esborrany = desades ? copia(desades) : respostesPerDefecte();
}

/** Han arribat dades d'un altre mòbil amb el mateix compte. */
function quanArribinCanvis(): void {
  recarregarDades();
  // No es repinta mentre s'edita el qüestionari o es cuina: les dades noves surten a la pantalla següent.
  if (pantalla.tipus === 'pas' || pantalla.tipus === 'cuinar') return;
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
  anar({ tipus: 'menu' }, { substituirHistoria: true });
}

async function sortirDelCompte(): Promise<void> {
  if (!window.confirm(textos.compte.confirmarTancar)) return;
  aturarSincronitzacio();
  await tancarSessio();
  usuari = null;
  desades = null;
  esborrany = respostesPerDefecte();
  menu = null;
  valoracions = {};
  pantalla = { tipus: 'menu' };
  history.replaceState({ piatto: false }, '', '#/menu');
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

/** Llista dels plats valorats (a Configuració), per poder treure una valoració. */
function seccioValorats(): HTMLElement {
  const tv = textos.valorats;
  const llista = (valor: Valoracio, titol: string): HTMLElement | null => {
    const ids = Object.keys(valoracions)
      .filter((id) => valoracions[id] === valor)
      .sort((a, b) => (catalegInicial.receptes.get(a)?.nom ?? a).localeCompare(catalegInicial.receptes.get(b)?.nom ?? b, 'ca'));
    if (ids.length === 0) return null;
    return h(
      'div',
      { class: 'valorats__grup' },
      h('h3', { class: 'valorats__titol' }, titol),
      h(
        'ul',
        { class: 'productes' },
        ...ids.map((id) => {
          const nom = catalegInicial.receptes.get(id)?.nom ?? id;
          return h(
            'li',
            { class: 'producte valorats__plat' },
            h('span', { class: 'producte__nom' }, nom),
            h(
              'button',
              {
                type: 'button',
                class: 'boto boto--petit boto--secundari',
                'data-treure': id,
                'aria-label': tv.treuEtiqueta(nom),
                onclick: () => {
                  const noves = { ...valoracions };
                  delete noves[id];
                  valoracions = noves;
                  desarValoracions(valoracions);
                  pintar();
                  arrel!.querySelector<HTMLElement>('#valorats-titol')?.focus();
                },
              },
              tv.treu,
            ),
          );
        }),
      ),
    );
  };
  const agraden = llista('agrada', tv.agraden);
  const noAgraden = llista('no-agrada', tv.noAgraden);
  return h(
    'section',
    { class: 'compte valorats', 'aria-labelledby': 'valorats-titol' },
    h('h2', { class: 'compte__titol', id: 'valorats-titol', tabindex: -1 }, tv.titol),
    h('p', { class: 'compte__text' }, tv.ajuda),
    !agraden && !noAgraden ? h('p', { class: 'compte__text' }, tv.cap) : null,
    agraden,
    noAgraden,
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

/** Avís fix a dalt mentre no s'ha fet la configuració: el menú és d'exemple i no té en compte al·lèrgies. */
function avisSenseConfigurar(): HTMLElement | null {
  if (desades) return null;
  const t = textos.senseConfigurar;
  return h(
    'section',
    { class: 'sense-configurar', role: 'status', 'aria-labelledby': 'sense-configurar-titol' },
    h('p', { class: 'sense-configurar__titol', id: 'sense-configurar-titol' }, t.titol),
    h('p', {}, t.text),
    h(
      'button',
      { type: 'button', class: 'boto boto--principal', onclick: () => accionsQuestionari.anar(PASSOS[0]) },
      t.boto,
    ),
  );
}

/** Xifres del rètol: usuaris (si se saben), receptes i menús fets (si se saben). */
function xifresRotol(): string[] {
  const t = textos.rotol;
  const x = XIFRES_CATALEG;
  return [
    ...(estadistiques && estadistiques.usuaris > 0 ? [t.usuaris(estadistiques.usuaris)] : []),
    t.receptes(x.plats, x.acompanyaments, x.salses),
    ...(estadistiques && estadistiques.menus > 0 ? [t.menus(estadistiques.menus)] : []),
  ];
}

function elementRotol(): HTMLElement | null {
  const noves = novetatsPerMostrar(NOVETATS, llegirLocal(CLAU_NOVETAT_VISTA), avui());
  return rotol(
    {
      elements: [...xifresRotol(), ...noves.map((n) => textos.rotol.nou(n.text))],
      novetats: NOVETATS,
      xifres: xifresRotol(),
      obert: novetatsObertes,
    },
    {
      obrir: () => {
        novetatsObertes = true;
        // Les novetats que hi ha ara ja s'han vist: deixen de passar pel rètol.
        if (NOVETATS[0]) desarLocal(CLAU_NOVETAT_VISTA, clauNovetat(NOVETATS[0]));
        const y = window.scrollY;
        pintar();
        window.scrollTo(0, y);
        arrel!.querySelector<HTMLElement>('#novetats-titol')?.focus({ preventScroll: true });
      },
      tancar: () => {
        novetatsObertes = false;
        const y = window.scrollY;
        pintar();
        window.scrollTo(0, y);
        arrel!.querySelector<HTMLElement>('.rotol')?.focus({ preventScroll: true });
      },
    },
  );
}

/** El rètol només surt al menú, i no mentre el menú és d'exemple (ja hi ha l'avís de configurar). */
function seccioRotol(): HTMLElement | null {
  if (pantalla.tipus !== 'menu' || !desades) return null;
  actualitzarEstadistiques();
  return elementRotol();
}

/** Demana les xifres al compte (com a molt cada pocs minuts) i, si han canviat, refà només el rètol. */
function actualitzarEstadistiques(): void {
  if (!usuari || Date.now() - darreraConsultaEstadistiques < CONSULTA_ESTADISTIQUES_MS) return;
  darreraConsultaEstadistiques = Date.now();
  void demanarEstadistiques().then((noves) => {
    if (!noves || JSON.stringify(noves) === JSON.stringify(estadistiques)) return;
    estadistiques = noves;
    desarLocal(CLAU_ESTADISTIQUES, JSON.stringify(noves));
    if (novetatsObertes) return;
    const actual = arrel!.querySelector('.rotol');
    const nou = elementRotol();
    if (actual && nou && document.activeElement !== actual) actual.replaceWith(nou);
  });
}

function contingutSeccio(respostes: RespostesQuestionari, seccio: Seccio): HTMLElement {
  const configuracio = configuracioDe(respostes);
  const actual = menuActual(respostes);
  switch (seccio.tipus) {
    case 'resum': {
      const resum = pantallaResum(esborrany, accionsQuestionari);
      resum.append(seccioValorats());
      const compte = seccioCompte();
      if (compte) resum.append(compte);
      return resum;
    }
    case 'compra': {
      const signatura = signaturaCompra(actual);
      const estat = carregarCompra(signatura);
      const avis = avisCompra;
      avisCompra = null;
      const { llista } = avaluarMenu(catalegInicial, configuracio, actual.apats);
      const mensual = actual.periode === 'mes' && actual.mes ? actual.mes : undefined;
      const estalviCentims = mensual ? estalviCompraPeriode(catalegInicial, configuracio, actual.apats).estalviCentims : 0;
      return pantallaCompra(llista, estat.marcats, estat.tinc, accionsCompra(signatura, estat), mensual ? { mes: mensual, estalviCentims } : undefined, avis);
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
          compartir: compartirText,
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
          desfer: menuDesfer?.text ?? null,
          avui: avui(),
          ...(actual.periode !== 'mes' && actual.creat ? { dilluns: dillunsDe(actual.creat) } : {}),
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
          avui: avui(),
          ...(ant.periode !== 'mes' && ant.creat ? { dilluns: dillunsDe(ant.creat) } : {}),
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
  } else if (pantalla.tipus === 'cuinar') {
    substituir(arrel!, contingutSeccio(respostesActives(), pantalla));
  } else {
    substituir(arrel!, capcalera(), avisSenseConfigurar(), seccioRotol(), contingutSeccio(respostesActives(), pantalla), navegacio());
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

// Funcionament sense connexió: només a la versió publicada (el service worker el genera el build).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => void navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}
