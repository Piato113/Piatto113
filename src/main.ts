import './estils.css';
import { catalegInicial } from './dades';
import {
  canviarPlat,
  configuracioDesDeRespostes,
  planificar,
  respostesPerDefecte,
  type Graella,
  type RespostesQuestionari,
} from './domini';
import { textos } from './textos/ca';
import { h, substituir } from './ui/dom';
import {
  carregarGraella,
  carregarMenu,
  carregarRespostes,
  desarGraella,
  desarMenu,
  desarRespostes,
  type MenuDesat,
} from './ui/emmagatzematge';
import { pantallaMenu } from './ui/menu';
import { pantallaPas, pantallaResum, PASSOS, type Pas } from './ui/questionari';

const arrel = document.querySelector<HTMLDivElement>('#app');
if (!arrel) throw new Error("No s'ha trobat l'element #app");

type Pantalla =
  | { tipus: 'benvinguda' }
  | { tipus: 'pas'; pas: Pas; desDelResum: boolean }
  | { tipus: 'resum' }
  | { tipus: 'menu' };

const copia = (r: RespostesQuestionari): RespostesQuestionari => structuredClone(r);
const llavorNova = (): number => Math.floor(Math.random() * 2 ** 31);

/** Respostes desades; `null` si encara no s'ha fet el qüestionari. */
let desades = carregarRespostes();
/** Esborrany que editen les pantalles; només es desa en acabar. */
let esborrany = desades ? copia(desades) : respostesPerDefecte();
let pantalla: Pantalla = desades ? { tipus: 'menu' } : { tipus: 'benvinguda' };
let menu: MenuDesat | null = carregarMenu(catalegInicial);
/** Missatge puntual per a la pantalla del menú (es mostra una vegada). */
let missatge: string | null = null;
/** Manté oberta la graella després de tocar-la. */
let graellaOberta = false;

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

function anar(nova: Pantalla): void {
  pantalla = nova;
  graellaOberta = false;
  pintar();
  window.scrollTo(0, 0);
  arrel!.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
}

const accionsQuestionari = {
  anar: (pas: Pas | null): void => {
    if (pas === null) {
      // Torna al resum sense desar els canvis del pas.
      if (desades) esborrany = copia(desades);
      anar({ tipus: 'resum' });
    } else {
      const desDelResum = pantalla.tipus === 'resum' || (pantalla.tipus === 'pas' && pantalla.desDelResum);
      anar({ tipus: 'pas', pas, desDelResum });
    }
  },
  acabar: (): void => {
    const primeraVegada = desades === null;
    desades = copia(esborrany);
    desarRespostes(desades);
    anar({ tipus: primeraVegada ? 'menu' : 'resum' });
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
    anar({ tipus: 'menu' });
  },
};

function navegacio(): HTMLElement {
  const pestanya = (tipus: 'menu' | 'resum', text: string): HTMLElement =>
    h(
      'button',
      {
        type: 'button',
        class: 'navegacio__pestanya',
        'aria-current': pantalla.tipus === tipus ? 'page' : false,
        onclick: () => {
          if (pantalla.tipus !== tipus) anar({ tipus });
        },
      },
      text,
    );
  return h(
    'nav',
    { class: 'navegacio', 'aria-label': textos.navegacio.principal },
    h(
      'span',
      { class: 'marca navegacio__marca', 'aria-hidden': 'true' },
      h('span', { class: 'marca__paraula' }, textos.app.nomParts.paraula),
      h('span', { class: 'marca__numero' }, textos.app.nomParts.numero),
    ),
    h(
      'div',
      { class: 'navegacio__pestanyes' },
      pestanya('menu', textos.navegacio.menu),
      pestanya('resum', textos.navegacio.configuracio),
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
        onclick: () => anar({ tipus: 'pas', pas: PASSOS[0], desDelResum: false }),
      },
      textos.accions.comencar,
    ),
    h('p', { class: 'benvinguda__nota' }, textos.benvinguda.desatLocal),
  );
}

function pintar(): void {
  if (pantalla.tipus === 'benvinguda') {
    substituir(arrel!, benvinguda());
  } else if (pantalla.tipus === 'pas') {
    substituir(arrel!, pantallaPas(esborrany, pantalla.pas, pantalla.desDelResum, accionsQuestionari));
  } else if (pantalla.tipus === 'resum') {
    substituir(arrel!, navegacio(), pantallaResum(esborrany, accionsQuestionari));
  } else if (desades) {
    const actual = menuActual(desades);
    const avisPuntual = missatge;
    missatge = null;
    substituir(
      arrel!,
      navegacio(),
      pantallaMenu(
        {
          configuracio: configuracioDesDeRespostes(desades),
          graella: actual.graella,
          apats: actual.apats,
          avisos: actual.avisos,
          missatge: avisPuntual,
          graellaOberta,
        },
        accionsMenu,
      ),
    );
  } else {
    pantalla = { tipus: 'benvinguda' };
    substituir(arrel!, benvinguda());
  }
}

pintar();
