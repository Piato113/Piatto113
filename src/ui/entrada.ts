import { textos } from '../textos/ca';
import { h, substituir } from './dom';
import { entrar, type ErrorEntrada } from './nuvol';

// Pantalla d'entrada: correu i contrasenya.
// No hi ha registre a l'app: el compte es crea a Supabase. La família entra amb el mateix correu.

const t = textos.entrada;

interface Estat {
  correu: string;
  contrasenya: string;
  veure: boolean;
  enviant: boolean;
  error: ErrorEntrada | null;
}

const correuValid = (c: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);

/** Crea la pantalla d'entrada. `entrat` es crida quan la sessió ja és iniciada. */
export function pantallaEntrada(entrat: () => void): { element: HTMLElement; desmuntar: () => void } {
  const estat: Estat = { correu: '', contrasenya: '', veure: false, enviant: false, error: null };
  const element = h('main', { class: 'benvinguda entrada' });

  async function enviar(): Promise<void> {
    const correu = estat.correu.trim().toLowerCase();
    if (!correuValid(correu)) {
      estat.error = 'correu';
      pintar('[name="correu"]');
      return;
    }
    if (estat.contrasenya === '') {
      estat.error = 'credencials';
      pintar('[name="contrasenya"]');
      return;
    }
    estat.correu = correu;
    estat.enviant = true;
    estat.error = null;
    pintar();
    const error = await entrar(correu, estat.contrasenya);
    if (error) {
      estat.enviant = false;
      estat.error = error;
      pintar(error === 'correu' ? '[name="correu"]' : '[name="contrasenya"]');
      return;
    }
    entrat();
  }

  function pintar(enfocar?: string): void {
    const { nomParts, lema } = textos.app;
    const descrit = estat.error ? 'entrada-error' : false;
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
      h('h1', { class: 'entrada__titol', tabindex: -1 }, t.titol),
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
            autocomplete: 'current-password',
            autocapitalize: 'off',
            spellcheck: 'false',
            value: estat.contrasenya,
            'aria-invalid': estat.error === 'credencials' ? 'true' : false,
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
        estat.error ? h('p', { class: 'avis avis--error entrada__avis', id: 'entrada-error', role: 'alert' }, t.errors[estat.error]) : null,
        h('button', { type: 'submit', class: 'boto boto--principal boto--gran', disabled: estat.enviant }, estat.enviant ? t.entrant : t.entrar),
      ),
      h('p', { class: 'benvinguda__nota entrada__familia' }, t.familia),
    );
    if (enfocar) element.querySelector<HTMLElement>(enfocar)?.focus();
  }

  pintar();
  return { element, desmuntar: () => {} };
}
