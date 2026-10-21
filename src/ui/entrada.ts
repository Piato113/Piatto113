import { textos } from '../textos/ca';
import { h, substituir } from './dom';
import { entrar, MIN_CONTRASENYA, registrar, type ErrorEntrada } from './nuvol';

// Pantalla d'entrada: correu i contrasenya, o crear un compte nou.
// Cada compte té les seves dades; a casa es pot compartir el mateix compte.

const t = textos.entrada;

interface Estat {
  mode: 'entrar' | 'registre';
  correu: string;
  contrasenya: string;
  veure: boolean;
  enviant: boolean;
  error: ErrorEntrada | null;
  /** Compte creat que s'ha de confirmar per correu. */
  confirmar: boolean;
}

const correuValid = (c: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);

/** Crea la pantalla d'entrada. `entrat` es crida quan la sessió ja és iniciada. */
export function pantallaEntrada(entrat: () => void): { element: HTMLElement; desmuntar: () => void } {
  const estat: Estat = { mode: 'entrar', correu: '', contrasenya: '', veure: false, enviant: false, error: null, confirmar: false };
  const element = h('main', { class: 'benvinguda entrada' });

  async function enviar(): Promise<void> {
    const correu = estat.correu.trim().toLowerCase();
    if (!correuValid(correu)) {
      estat.error = 'correu';
      pintar('[name="correu"]');
      return;
    }
    const registre = estat.mode === 'registre';
    if (registre ? estat.contrasenya.length < MIN_CONTRASENYA : estat.contrasenya === '') {
      estat.error = registre ? 'contrasenya-curta' : 'credencials';
      pintar('[name="contrasenya"]');
      return;
    }
    estat.correu = correu;
    estat.enviant = true;
    estat.error = null;
    estat.confirmar = false;
    pintar();
    let error: ErrorEntrada | null;
    if (registre) {
      const resultat = await registrar(correu, estat.contrasenya);
      error = resultat.error;
      if (!error && resultat.confirmar) {
        // Cal confirmar el correu: torna a «Entra» amb el correu escrit.
        estat.enviant = false;
        estat.confirmar = true;
        estat.mode = 'entrar';
        estat.contrasenya = '';
        pintar('[name="contrasenya"]');
        return;
      }
    } else {
      error = await entrar(correu, estat.contrasenya);
    }
    if (error) {
      estat.enviant = false;
      estat.error = error;
      pintar(error === 'correu' || error === 'ja-existeix' ? '[name="correu"]' : '[name="contrasenya"]');
      return;
    }
    entrat();
  }

  function canviarMode(): void {
    estat.mode = estat.mode === 'entrar' ? 'registre' : 'entrar';
    estat.error = null;
    estat.confirmar = false;
    pintar('h1');
  }

  function pintar(enfocar?: string): void {
    const { nomParts, lema } = textos.app;
    const registre = estat.mode === 'registre';
    const descrit = [estat.error ? 'entrada-error' : '', registre ? 'entrada-ajuda' : ''].filter(Boolean).join(' ') || false;
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
      h('h1', { class: 'entrada__titol', tabindex: -1 }, registre ? t.titolRegistre : t.titol),
      h(
        'form',
        {
          class: 'entrada__formulari',
          novalidate: true,
          onsubmit: (e: Event) => {
            e.preventDefault();
            void enviar();
          },
        },
        h('label', { class: 'entrada__etiqueta', for: 'entrada-correu' }, t.correu),
        h('input', {
          id: 'entrada-correu',
          class: 'camp',
          name: 'correu',
          type: 'email',
          inputmode: 'email',
          autocomplete: 'username',
          autocapitalize: 'off',
          spellcheck: 'false',
          value: estat.correu,
          'aria-invalid': estat.error === 'correu' ? 'true' : false,
          'aria-describedby': descrit,
          oninput: (e: Event) => {
            estat.correu = (e.target as HTMLInputElement).value;
          },
        }),
        h('label', { class: 'entrada__etiqueta', for: 'entrada-contrasenya' }, t.contrasenya),
        h(
          'div',
          { class: 'entrada__contrasenya' },
          h('input', {
            id: 'entrada-contrasenya',
            class: 'camp',
            name: 'contrasenya',
            type: estat.veure ? 'text' : 'password',
            autocomplete: registre ? 'new-password' : 'current-password',
            autocapitalize: 'off',
            spellcheck: 'false',
            value: estat.contrasenya,
            'aria-invalid': estat.error === 'credencials' || estat.error === 'contrasenya-curta' ? 'true' : false,
            'aria-describedby': descrit,
            oninput: (e: Event) => {
              estat.contrasenya = (e.target as HTMLInputElement).value;
            },
          }),
          h(
            'button',
            {
              type: 'button',
              class: 'boto boto--petit boto--fantasma entrada__veure',
              'aria-pressed': estat.veure ? 'true' : 'false',
              'aria-controls': 'entrada-contrasenya',
              onclick: () => {
                estat.veure = !estat.veure;
                pintar('.entrada__veure');
              },
            },
            estat.veure ? t.amagar : t.mostrar,
          ),
        ),
        registre ? h('p', { class: 'entrada__ajuda', id: 'entrada-ajuda' }, t.ajudaContrasenya(MIN_CONTRASENYA)) : null,
        estat.error ? h('p', { class: 'avis avis--error entrada__avis', id: 'entrada-error', role: 'alert' }, t.errors[estat.error]) : null,
        estat.confirmar ? h('p', { class: 'avis entrada__avis', role: 'status' }, t.confirmar(estat.correu)) : null,
        h(
          'button',
          { type: 'submit', class: 'boto boto--principal boto--gran', disabled: estat.enviant },
          registre ? (estat.enviant ? t.registrant : t.registrar) : estat.enviant ? t.entrant : t.entrar,
        ),
      ),
      h(
        'p',
        { class: 'entrada__canvi' },
        `${registre ? t.jaTensCompte : t.noTensCompte} `,
        h('button', { type: 'button', class: 'enllac', disabled: estat.enviant, onclick: canviarMode }, registre ? t.anarAEntrar : t.anarARegistre),
      ),
      h('p', { class: 'benvinguda__nota entrada__familia' }, t.familia),
    );
    if (enfocar) element.querySelector<HTMLElement>(enfocar)?.focus();
  }

  pintar();
  return { element, desmuntar: () => {} };
}
