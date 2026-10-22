import { textos } from '../textos/ca';
import { h } from './dom';

// Avís que surt una sola vegada, just després de crear un compte nou:
// l'app és personal, no comercial i orientativa.

const t = textos.entrada.avis;

/** Mostra l'avís a sobre de la pantalla i es resol quan es toca «Ho entenc». */
export function avisRegistre(): Promise<void> {
  return new Promise((resoldre) => {
    const anterior = document.activeElement as HTMLElement | null;
    const boto = h('button', { type: 'button', class: 'boto boto--principal boto--gran' }, t.entesos);
    const capa = h(
      'div',
      { class: 'avis-registre', role: 'alertdialog', 'aria-modal': 'true', 'aria-labelledby': 'avis-registre-titol' },
      h(
        'div',
        { class: 'avis-registre__caixa' },
        h('h2', { class: 'avis-registre__titol', id: 'avis-registre-titol' }, t.titol),
        ...t.paragrafs.map((p) => h('p', {}, p)),
        boto,
      ),
    );
    boto.addEventListener('click', () => {
      capa.remove();
      anterior?.focus?.();
      resoldre();
    });
    document.body.append(capa);
    boto.focus();
  });
}
