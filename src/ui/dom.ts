// Ajudants mínims per construir la interfície sense framework.
// Tot el text passa per `textContent`, mai per `innerHTML`: res del que escriu l'usuari s'interpreta com a HTML.

type Fill = Node | string | null | undefined | false;

type Atributs = {
  class?: string;
  /** Altres atributs HTML (type, name, for, aria-*…). `false` o `null` el treuen. */
  [nom: string]: string | number | boolean | null | undefined | ((e: Event) => void);
};

/**
 * Crea un element: `h('button', { class: 'boto', onclick: fes }, 'Text')`.
 * Les claus que comencen per `on` són esdeveniments; `checked`, `value` i `disabled` es posen com a propietats.
 */
export function h<K extends keyof HTMLElementTagNameMap>(
  etiqueta: K,
  atributs: Atributs = {},
  ...fills: Fill[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(etiqueta);
  for (const [nom, valor] of Object.entries(atributs)) {
    if (valor === undefined || valor === null || valor === false) continue;
    if (typeof valor === 'function') {
      el.addEventListener(nom.slice(2), valor);
    } else if (nom === 'checked' || nom === 'value' || nom === 'disabled') {
      (el as unknown as Record<string, unknown>)[nom] = valor;
    } else {
      el.setAttribute(nom, valor === true ? '' : String(valor));
    }
  }
  for (const fill of fills) {
    if (fill === null || fill === undefined || fill === false) continue;
    el.append(fill);
  }
  return el;
}

/** Substitueix tot el contingut d'un element. */
export function substituir(pare: Element, ...fills: Fill[]): void {
  pare.replaceChildren(...fills.filter((f): f is Node | string => f !== null && f !== undefined && f !== false));
}
