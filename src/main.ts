import './estils.css';
import { respostesPerDefecte, type RespostesQuestionari } from './domini';
import { textos } from './textos/ca';
import { h, substituir } from './ui/dom';
import { carregarRespostes, desarRespostes } from './ui/emmagatzematge';
import { pantallaPas, pantallaResum, PASSOS, type Pas } from './ui/questionari';

const arrel = document.querySelector<HTMLDivElement>('#app');
if (!arrel) throw new Error("No s'ha trobat l'element #app");

type Pantalla = { tipus: 'benvinguda' } | { tipus: 'pas'; pas: Pas; desDelResum: boolean } | { tipus: 'resum' };

const copia = (r: RespostesQuestionari): RespostesQuestionari => structuredClone(r);

/** Respostes desades; `null` si encara no s'ha fet el qüestionari. */
let desades = carregarRespostes();
/** Esborrany que editen les pantalles; només es desa en acabar. */
let esborrany = desades ? copia(desades) : respostesPerDefecte();
let pantalla: Pantalla = desades ? { tipus: 'resum' } : { tipus: 'benvinguda' };

function anar(nova: Pantalla): void {
  pantalla = nova;
  pintar();
  window.scrollTo(0, 0);
  arrel!.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
}

const accions = {
  anar: (pas: Pas | null): void => {
    if (pas === null) {
      // Torna al resum sense desar els canvis del pas.
      if (desades) esborrany = copia(desades);
      anar({ tipus: 'resum' });
    } else {
      anar({ tipus: 'pas', pas, desDelResum: pantalla.tipus === 'resum' || (pantalla.tipus === 'pas' && pantalla.desDelResum) });
    }
  },
  acabar: (): void => {
    desades = copia(esborrany);
    desarRespostes(desades);
    anar({ tipus: 'resum' });
  },
};

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
      { type: 'button', class: 'boto boto--principal boto--gran', onclick: () => anar({ tipus: 'pas', pas: PASSOS[0], desDelResum: false }) },
      textos.accions.comencar,
    ),
    h('p', { class: 'benvinguda__nota' }, textos.benvinguda.desatLocal),
  );
}

function pintar(): void {
  const contingut =
    pantalla.tipus === 'benvinguda'
      ? benvinguda()
      : pantalla.tipus === 'pas'
        ? pantallaPas(esborrany, pantalla.pas, pantalla.desDelResum, accions)
        : pantallaResum(esborrany, accions);
  substituir(arrel!, contingut);
}

pintar();
