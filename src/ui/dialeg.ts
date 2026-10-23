import { textos } from '../textos/ca';
import { h } from './dom';

// Diàlegs propis de l'app (en lloc de window.confirm, que mostra el quadre del navegador).

export interface OpcionsConfirmar {
  titol: string;
  text: string;
  /** Text del botó que accepta. */
  acceptar: string;
  /** Text del botó que no fa res (per defecte, «Cancel·la»). */
  cancellar?: string;
}

/** Demana confirmació amb una finestra de l'app; es resol amb `true` si s'accepta. */
export function confirmar(opcions: OpcionsConfirmar): Promise<boolean> {
  return new Promise((resoldre) => {
    const anterior = document.activeElement as HTMLElement | null;
    const no = h('button', { type: 'button', class: 'boto boto--secundari', 'data-dialeg': 'no' }, opcions.cancellar ?? textos.dialeg.cancellar);
    const si = h('button', { type: 'button', class: 'boto boto--principal', 'data-dialeg': 'si' }, opcions.acceptar);
    const capa = h(
      'div',
      { class: 'avis-registre dialeg', role: 'alertdialog', 'aria-modal': 'true', 'aria-labelledby': 'dialeg-titol', 'aria-describedby': 'dialeg-text' },
      h(
        'div',
        { class: 'avis-registre__caixa' },
        h('h2', { class: 'avis-registre__titol', id: 'dialeg-titol' }, opcions.titol),
        h('p', { id: 'dialeg-text' }, opcions.text),
        h('div', { class: 'dialeg__botons' }, no, si),
      ),
    );
    const tancar = (resposta: boolean): void => {
      document.removeEventListener('keydown', tecla, true);
      capa.remove();
      anterior?.focus?.();
      resoldre(resposta);
    };
    const tecla = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.preventDefault();
        tancar(false);
      } else if (e.key === 'Tab') {
        // El focus no surt de la finestra.
        e.preventDefault();
        (document.activeElement === si ? no : si).focus();
      }
    };
    no.addEventListener('click', () => tancar(false));
    si.addEventListener('click', () => tancar(true));
    // Tocar fora de la finestra és com «Cancel·la».
    capa.addEventListener('click', (e) => {
      if (e.target === capa) tancar(false);
    });
    document.addEventListener('keydown', tecla, true);
    document.body.append(capa);
    no.focus();
  });
}
