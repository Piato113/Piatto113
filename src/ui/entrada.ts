import { textos } from '../textos/ca';
import { h, substituir } from './dom';
import { enviarCodi, verificarCodi, type ErrorEntrada } from './nuvol';

// Pantalla d'entrada: correu → codi de 6 xifres que arriba per correu.
// Es fa amb codi (i no amb enllaç) perquè l'enllaç s'obre al navegador i no a l'app instal·lada.

const t = textos.entrada;
/** Supabase no deixa demanar un altre codi abans d'un minut. */
const ESPERA_REENVIAR_S = 60;

interface Estat {
  pas: 'correu' | 'codi';
  correu: string;
  codi: string;
  enviant: boolean;
  error: ErrorEntrada | null;
  nota: string | null;
  /** Moment a partir del qual es pot tornar a demanar el codi. */
  reenviarDes: number;
}

const correuValid = (c: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);
const netejarCodi = (c: string): string => c.replace(/\D/g, '').slice(0, 10);

/** Crea la pantalla d'entrada. `entrat` es crida quan la sessió ja és iniciada. */
export function pantallaEntrada(entrat: () => void): { element: HTMLElement; desmuntar: () => void } {
  const estat: Estat = { pas: 'correu', correu: '', codi: '', enviant: false, error: null, nota: null, reenviarDes: 0 };
  const element = h('main', { class: 'benvinguda entrada' });
  let rellotge: ReturnType<typeof setInterval> | null = null;

  const segonsPerReenviar = (): number => Math.max(0, Math.ceil((estat.reenviarDes - Date.now()) / 1000));

  async function demanarCodi(): Promise<void> {
    const correu = estat.correu.trim().toLowerCase();
    if (!correuValid(correu)) {
      estat.error = 'correu';
      pintar('[name="correu"]');
      return;
    }
    estat.correu = correu;
    estat.enviant = true;
    estat.error = null;
    pintar();
    const error = await enviarCodi(correu);
    estat.enviant = false;
    if (error) {
      estat.error = error;
      pintar(estat.pas === 'correu' ? '[name="correu"]' : '[name="codi"]');
      return;
    }
    estat.nota = estat.pas === 'codi' ? t.reenviat : null;
    estat.pas = 'codi';
    estat.codi = '';
    estat.reenviarDes = Date.now() + ESPERA_REENVIAR_S * 1000;
    pintar('[name="codi"]');
  }

  async function comprovarCodi(): Promise<void> {
    const codi = netejarCodi(estat.codi);
    if (codi.length < 6) {
      estat.error = 'codi';
      pintar('[name="codi"]');
      return;
    }
    estat.enviant = true;
    estat.error = null;
    estat.nota = null;
    pintar();
    const error = await verificarCodi(estat.correu, codi);
    estat.enviant = false;
    if (error) {
      estat.error = error;
      pintar('[name="codi"]');
      return;
    }
    estat.nota = t.carregant;
    estat.enviant = true;
    pintar();
    entrat();
  }

  /** Error o nota, just sota el camp perquè es vegi sense baixar. */
  const missatges = (): (HTMLElement | null)[] => [
    estat.error ? h('p', { class: 'avis avis--error entrada__avis', id: 'entrada-error', role: 'alert' }, t.errors[estat.error]) : null,
    estat.nota ? h('p', { class: 'avis entrada__avis', role: 'status' }, estat.nota) : null,
  ];

  function formulariCorreu(): HTMLElement {
    return h(
      'form',
      {
        class: 'entrada__formulari',
        novalidate: true,
        onsubmit: (e: Event) => {
          e.preventDefault();
          void demanarCodi();
        },
      },
      h('label', { class: 'entrada__etiqueta', for: 'entrada-correu' }, t.correu),
      h('input', {
        id: 'entrada-correu',
        class: 'camp',
        name: 'correu',
        type: 'email',
        inputmode: 'email',
        autocomplete: 'email',
        autocapitalize: 'off',
        spellcheck: 'false',
        required: true,
        value: estat.correu,
        'aria-invalid': estat.error === 'correu' ? 'true' : false,
        'aria-describedby': estat.error ? 'entrada-error' : false,
        oninput: (e: Event) => {
          estat.correu = (e.target as HTMLInputElement).value;
        },
      }),
      ...missatges(),
      h('button', { type: 'submit', class: 'boto boto--principal boto--gran', disabled: estat.enviant }, estat.enviant ? t.enviant : t.enviar),
    );
  }

  function formulariCodi(): HTMLElement {
    const segons = segonsPerReenviar();
    return h(
      'form',
      {
        class: 'entrada__formulari',
        novalidate: true,
        onsubmit: (e: Event) => {
          e.preventDefault();
          void comprovarCodi();
        },
      },
      h('label', { class: 'entrada__etiqueta', for: 'entrada-codi' }, t.codi),
      h('input', {
        id: 'entrada-codi',
        class: 'camp entrada__codi',
        name: 'codi',
        type: 'text',
        inputmode: 'numeric',
        autocomplete: 'one-time-code',
        pattern: '[0-9]*',
        maxlength: 10,
        value: estat.codi,
        'aria-invalid': estat.error === 'codi' ? 'true' : false,
        'aria-describedby': estat.error ? 'entrada-error' : false,
        oninput: (e: Event) => {
          const camp = e.target as HTMLInputElement;
          estat.codi = netejarCodi(camp.value);
          if (camp.value !== estat.codi) camp.value = estat.codi;
        },
      }),
      ...missatges(),
      h('button', { type: 'submit', class: 'boto boto--principal boto--gran', disabled: estat.enviant }, estat.enviant ? t.comprovant : t.entrar),
      h(
        'button',
        {
          type: 'button',
          class: 'boto boto--secundari',
          'data-reenviar': true,
          disabled: estat.enviant || segons > 0,
          onclick: () => void demanarCodi(),
        },
        t.reenviar,
      ),
      segons > 0 ? h('p', { class: 'benvinguda__nota', 'data-compte-enrere': true }, t.reenviarEn(segons)) : null,
      h(
        'button',
        {
          type: 'button',
          class: 'boto boto--fantasma',
          disabled: estat.enviant,
          onclick: () => {
            estat.pas = 'correu';
            estat.error = null;
            estat.nota = null;
            pintar('[name="correu"]');
          },
        },
        t.canviarCorreu,
      ),
    );
  }

  function pintar(enfocar?: string): void {
    const { nomParts, lema } = textos.app;
    substituir(
      element,
      h('img', { class: 'benvinguda__icona entrada__icona', src: '/icons/icona-512.png', alt: '', width: 112, height: 112 }),
      h(
        'p',
        { class: 'marca', 'aria-hidden': 'true' },
        h('span', { class: 'marca__paraula' }, nomParts.paraula),
        h('span', { class: 'marca__numero' }, nomParts.numero),
      ),
      h('p', { class: 'benvinguda__lema' }, lema),
      h('h1', { class: 'entrada__titol', tabindex: -1 }, estat.pas === 'correu' ? t.titol : t.titolCodi),
      h('p', { class: 'benvinguda__estat entrada__explicacio' }, estat.pas === 'correu' ? t.explicacio : t.codiEnviat(estat.correu)),
      estat.pas === 'correu' ? formulariCorreu() : formulariCodi(),
      estat.pas === 'correu' ? h('p', { class: 'benvinguda__nota entrada__familia' }, t.familia) : null,
    );
    if (enfocar) element.querySelector<HTMLElement>(enfocar)?.focus();
  }

  // Compte enrere per tornar a demanar el codi: només actualitza aquest text i el botó.
  rellotge = setInterval(() => {
    if (estat.pas !== 'codi') return;
    const segons = segonsPerReenviar();
    const boto = element.querySelector<HTMLButtonElement>('[data-reenviar]');
    const text = element.querySelector<HTMLElement>('[data-compte-enrere]');
    if (boto) boto.disabled = estat.enviant || segons > 0;
    if (text) {
      if (segons > 0) text.textContent = t.reenviarEn(segons);
      else text.remove();
    }
  }, 1000);

  pintar();
  return {
    element,
    desmuntar: () => {
      if (rellotge) clearInterval(rellotge);
      rellotge = null;
    },
  };
}
