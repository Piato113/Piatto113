import './estils.css';
import { catalegInicial } from './dades';
import {
  avaluarMenu,
  canviarPlat,
  configuracioDesDeRespostes,
  planificar,
  respostesPerDefecte,
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
  type MenuDesat,
} from './ui/emmagatzematge';
import { pantallaMenu } from './ui/menu';
import { pantallaPas, pantallaResum, PASSOS, type Pas } from './ui/questionari';
import { pantallaRecepta } from './ui/recepta';

const arrel = document.querySelector<HTMLDivElement>('#app');
if (!arrel) throw new Error("No s'ha trobat l'element #app");

/** Pantalles amb adreça pròpia (es pot tornar enrere amb el botó del mòbil). */
type Seccio =
  | { tipus: 'menu' }
  | { tipus: 'compra' }
  | { tipus: 'resum' }
  | { tipus: 'recepta'; receptaId: string; acompanyamentId?: string };

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
/** Manté oberta la graella després de tocar-la. */
let graellaOberta = false;

// ——— Adreces ———

function adrecaDe(p: Pantalla): string | null {
  switch (p.tipus) {
    case 'menu':
      return '#/menu';
    case 'compra':
      return '#/compra';
    case 'resum':
      return '#/configuracio';
    case 'recepta':
      return `#/recepta/${encodeURIComponent(p.receptaId)}${p.acompanyamentId ? `?amb=${encodeURIComponent(p.acompanyamentId)}` : ''}`;
    default:
      return null;
  }
}

function seccioDe(adreca: string): Seccio | null {
  const [cami = '', consulta = ''] = adreca.replace(/^#/, '').split('?');
  if (cami === '/menu') return { tipus: 'menu' };
  if (cami === '/compra') return { tipus: 'compra' };
  if (cami === '/configuracio') return { tipus: 'resum' };
  const recepta = /^\/recepta\/([^/]+)$/.exec(cami);
  if (recepta) {
    const receptaId = decodeURIComponent(recepta[1]!);
    if (!catalegInicial.receptes.has(receptaId)) return null;
    const amb = new URLSearchParams(consulta).get('amb');
    return amb && catalegInicial.receptes.has(amb) ? { tipus: 'recepta', receptaId, acompanyamentId: amb } : { tipus: 'recepta', receptaId };
  }
  return null;
}

let pantalla: Pantalla = desades ? (seccioDe(location.hash) ?? { tipus: 'menu' }) : { tipus: 'benvinguda' };

// ——— Menú ———

/** Fa un menú nou amb la llavor i la graella indicades i el desa. */
function ferMenu(respostes: RespostesQuestionari, graella: Graella, llavor: number): MenuDesat {
  const pla = planificar({ cataleg: catalegInicial, configuracio: configuracioDesDeRespostes(respostes), graella, llavor });
  const nou: MenuDesat = { signatura: JSON.stringify(respostes), llavor, graella, apats: pla.apats, avisos: pla.avisos };
  desarMenu(nou);
  return nou;
}

/** El menú actual; si les respostes han canviat des que es va fer, se'n fa un de nou. */
function menuActual(respostes: RespostesQuestionari): MenuDesat {
  if (!menu || menu.signatura !== JSON.stringify(respostes)) {
    menu = ferMenu(respostes, menu?.graella ?? carregarGraella(), llavorNova());
  }
  return menu;
}

/** Identifica la llista de la compra: si canvien els àpats o la família, els productes marcats es reinicien. */
const signaturaCompra = (m: MenuDesat): string => JSON.stringify([m.signatura, m.apats]);

// ——— Navegació ———

function enfocarTitol(): void {
  window.scrollTo(0, 0);
  arrel!.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
}

function anar(nova: Pantalla, { substituirHistoria = false } = {}): void {
  pantalla = nova;
  graellaOberta = false;
  const adreca = adrecaDe(nova);
  if (adreca && adreca !== location.hash) {
    if (substituirHistoria) history.replaceState({ piatto: true }, '', adreca);
    else history.pushState({ piatto: true }, '', adreca);
  }
  pintar();
  enfocarTitol();
}

window.addEventListener('popstate', () => {
  if (!desades) return;
  pantalla = seccioDe(location.hash) ?? { tipus: 'menu' };
  graellaOberta = false;
  pintar();
  enfocarTitol();
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

const accionsMenu = {
  canviarPlat: (index: number): void => {
    if (!desades || !menu) return;
    const apats = canviarPlat(catalegInicial, configuracioDesDeRespostes(desades), menu.apats, index, llavorNova());
    if (apats[index]?.receptaId === menu.apats[index]?.receptaId) {
      missatge = textos.menu.senseAlternativa;
    } else {
      menu = { ...menu, apats };
      desarMenu(menu);
    }
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
  obrirRecepta: (index: number): void => {
    const apat = menu?.apats[index];
    if (!apat) return;
    anar(
      apat.acompanyamentId
        ? { tipus: 'recepta', receptaId: apat.receptaId, acompanyamentId: apat.acompanyamentId }
        : { tipus: 'recepta', receptaId: apat.receptaId },
    );
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

// ——— Pantalles ———

function navegacio(): HTMLElement {
  const actiu = pantalla.tipus === 'recepta' ? 'menu' : pantalla.tipus;
  const pestanya = (tipus: 'menu' | 'compra' | 'resum', icona: string, text: string): HTMLElement =>
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
    h('p', { class: 'benvinguda__nota' }, textos.benvinguda.desatLocal),
  );
}

function contingutSeccio(respostes: RespostesQuestionari, seccio: Seccio): HTMLElement {
  const configuracio = configuracioDesDeRespostes(respostes);
  const actual = menuActual(respostes);
  switch (seccio.tipus) {
    case 'resum':
      return pantallaResum(esborrany, accionsQuestionari);
    case 'compra': {
      const signatura = signaturaCompra(actual);
      const marcats = carregarMarcats(signatura);
      const { llista } = avaluarMenu(catalegInicial, configuracio, actual.apats);
      return pantallaCompra(llista, marcats, accionsCompra(signatura, marcats));
    }
    case 'recepta': {
      const { racionsCentesimes } = avaluarMenu(catalegInicial, configuracio, []);
      return pantallaRecepta(
        { ...seccio, racionsCentesimes, persones: configuracio.persones.length },
        { tornar, obrir: (receptaId) => anar({ tipus: 'recepta', receptaId }) },
      );
    }
    case 'menu': {
      const avisPuntual = missatge;
      missatge = null;
      return pantallaMenu(
        { configuracio, graella: actual.graella, apats: actual.apats, avisos: actual.avisos, missatge: avisPuntual, graellaOberta },
        accionsMenu,
      );
    }
  }
}

function pintar(): void {
  if (pantalla.tipus === 'pas') {
    substituir(arrel!, pantallaPas(esborrany, pantalla.pas, pantalla.desDelResum, accionsQuestionari));
  } else if (pantalla.tipus === 'benvinguda' || !desades) {
    pantalla = { tipus: 'benvinguda' };
    substituir(arrel!, benvinguda());
  } else {
    substituir(arrel!, capcalera(), contingutSeccio(desades, pantalla), navegacio());
  }
}

// Primera pantalla: fixa l'adreça sense afegir cap pas a l'historial.
const adrecaInicial = adrecaDe(pantalla);
if (adrecaInicial && adrecaInicial !== location.hash) history.replaceState({ piatto: false }, '', adrecaInicial);
pintar();
