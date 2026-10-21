import { catalegInicial } from '../dades';
import {
  ALERGENS,
  configuracioDesDeRespostes,
  filtrarReceptes,
  MAX_PERSONES,
  OPCIONS_GANA,
  permetCarn,
  permetPeix,
  quantitatsEfectives,
  type Alergen,
  type Ingredient,
  type OpcioDieta,
  type OpcioQuantitat,
  type OpcioPressupost,
  type OpcioReceptari,
  type OpcioTemps,
  type RespostesQuestionari,
} from '../domini';
import { textos } from '../textos/ca';
import { h, substituir } from './dom';

const t = textos.questionari;
const a = textos.accions;

export const PASSOS = ['familia', 'receptari', 'pressupost', 'temps', 'restriccions'] as const;
export type Pas = (typeof PASSOS)[number];

export interface AccionsQuestionari {
  /** Va al pas indicat (o al resum si és `null`). */
  anar: (pas: Pas | null) => void;
  /** Desa les respostes i va al resum. */
  acabar: () => void;
}

/** Element `<label>` amb una opció de ràdio o casella, presentat com una targeta. */
function opcio(
  tipus: 'radio' | 'checkbox',
  nom: string,
  valor: string,
  text: string,
  marcada: boolean,
  canvi: (marcada: boolean) => void,
  classe = 'opcio',
): HTMLLabelElement {
  return h(
    'label',
    { class: classe },
    h('input', {
      type: tipus,
      name: nom,
      value: valor,
      checked: marcada,
      onchange: (e: Event) => canvi((e.target as HTMLInputElement).checked),
    }),
    h('span', { class: `${classe}__text` }, text),
  );
}

function grup(titol: string, ajuda: string | undefined, ...fills: Node[]): HTMLFieldSetElement {
  return h(
    'fieldset',
    { class: 'grup' },
    h('legend', { class: 'grup__titol' }, titol),
    ajuda ? h('p', { class: 'grup__ajuda' }, ajuda) : null,
    ...fills,
  );
}

/** Opcions d'una sola resposta. */
function radios<T extends string>(nom: string, opcions: Record<T, string>, actual: T, triar: (v: T) => void): HTMLElement {
  return h(
    'div',
    { class: 'opcions' },
    ...(Object.keys(opcions) as T[]).map((v) => opcio('radio', nom, v, opcions[v], v === actual, () => triar(v))),
  );
}

// ——— Pas 1: família ———

function pasFamilia(r: RespostesQuestionari, refer: () => void): HTMLElement {
  const tf = t.familia;
  const files = r.persones.map((p, i) => {
    const idNom = `persona-${i}-nom`;
    const idGana = `persona-${i}-gana`;
    return h(
      'li',
      { class: 'persona' },
      h(
        'div',
        { class: 'persona__camp' },
        h('label', { for: idNom, class: 'persona__etiqueta' }, tf.nom),
        h('input', {
          id: idNom,
          class: 'camp',
          type: 'text',
          value: p.nom,
          maxlength: 40,
          autocomplete: 'off',
          oninput: (e: Event) => {
            p.nom = (e.target as HTMLInputElement).value;
          },
          onblur: (e: Event) => {
            const camp = e.target as HTMLInputElement;
            if (camp.value.trim() === '') camp.value = p.nom = `Persona ${i + 1}`;
          },
        }),
      ),
      h(
        'div',
        { class: 'persona__camp' },
        h('label', { for: idGana, class: 'persona__etiqueta' }, tf.gana),
        h(
          'select',
          {
            id: idGana,
            class: 'camp',
            onchange: (e: Event) => {
              p.ganaCentesimes = Number((e.target as HTMLSelectElement).value);
            },
          },
          ...OPCIONS_GANA.map((g) =>
            h('option', { value: String(g), selected: g === p.ganaCentesimes }, tf.opcionsGana[g] ?? String(g)),
          ),
        ),
      ),
      r.persones.length > 1
        ? h(
            'button',
            {
              type: 'button',
              class: 'boto boto--petit boto--fantasma persona__treure',
              'aria-label': `${a.treure} ${p.nom}`,
              onclick: () => {
                r.persones.splice(i, 1);
                refer();
              },
            },
            '✕',
          )
        : null,
    );
  });

  const potAfegir = r.persones.length < MAX_PERSONES;
  return grup(
    tf.pregunta,
    tf.ajuda,
    h('ul', { class: 'persones' }, ...files),
    potAfegir
      ? h(
          'button',
          {
            type: 'button',
            class: 'boto boto--secundari',
            onclick: () => {
              r.persones.push({ nom: `Persona ${r.persones.length + 1}`, ganaCentesimes: 100 });
              refer();
            },
          },
          `+ ${a.afegirPersona}`,
        )
      : h('p', { class: 'grup__ajuda' }, tf.maxim(MAX_PERSONES)),
  );
}

// ——— Passos 2 a 4 ———

function pasReceptari(r: RespostesQuestionari): HTMLElement {
  const opcions = t.receptari.opcions;
  return grup(
    t.receptari.pregunta,
    t.receptari.ajuda,
    h(
      'div',
      { class: 'opcions' },
      ...(Object.keys(opcions) as OpcioReceptari[]).map((v) =>
        opcio('checkbox', 'receptari', v, opcions[v], r.receptari.includes(v), (marcada) => {
          r.receptari = marcada ? [...r.receptari, v] : r.receptari.filter((x) => x !== v);
        }),
      ),
    ),
  );
}

const pasPressupost = (r: RespostesQuestionari): HTMLElement =>
  grup(
    t.pressupost.pregunta,
    t.pressupost.ajuda,
    radios<OpcioPressupost>('pressupost', t.pressupost.opcions, r.pressupost, (v) => (r.pressupost = v)),
  );

const pasTemps = (r: RespostesQuestionari): HTMLElement =>
  grup(t.temps.pregunta, undefined, radios<OpcioTemps>('temps', t.temps.opcions, r.temps, (v) => (r.temps = v)));

// ——— Pas 5: restriccions ———

const normalitzar = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

const majuscula = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

function selectorExclosos(r: RespostesQuestionari): HTMLElement {
  const ingredients = [...catalegInicial.ingredients.values()].sort((x, y) => x.nom.localeCompare(y.nom, 'ca'));
  const nomDe = (id: string): string => catalegInicial.ingredients.get(id)?.nom ?? id;
  let cerca = '';

  const triats = h('div', { class: 'triats', 'aria-live': 'polite' });
  const llista = h('div', { class: 'ingredients' });

  const commutar = (id: string, marcat: boolean): void => {
    r.exclosos = marcat ? [...r.exclosos, id] : r.exclosos.filter((x) => x !== id);
    pintar();
  };

  function pintar(): void {
    substituir(
      triats,
      r.exclosos.length > 0 ? h('p', { class: 'grup__ajuda' }, t.exclosos.triats(r.exclosos.length)) : null,
      ...r.exclosos.map((id) =>
        h(
          'button',
          {
            type: 'button',
            class: 'xip xip--actiu',
            'aria-label': `${a.treure} ${nomDe(id)}`,
            onclick: () => commutar(id, false),
          },
          `${nomDe(id)} ✕`,
        ),
      ),
    );

    const filtre = normalitzar(cerca.trim());
    const visibles = ingredients.filter((i) => filtre === '' || normalitzar(i.nom).includes(filtre));
    const perSeccio = new Map<string, Ingredient[]>();
    for (const i of visibles) {
      const seccio = i.seccio ?? 'altres';
      perSeccio.set(seccio, [...(perSeccio.get(seccio) ?? []), i]);
    }
    substituir(
      llista,
      visibles.length === 0 ? h('p', { class: 'grup__ajuda' }, t.exclosos.capResultat) : null,
      ...[...perSeccio.entries()]
        .sort(([x], [y]) => x.localeCompare(y, 'ca'))
        .map(([seccio, items]) =>
          h(
            'div',
            { class: 'seccio' },
            h('h3', { class: 'seccio__titol' }, majuscula(seccio)),
            h(
              'div',
              { class: 'xips' },
              ...items.map((i) =>
                opcio('checkbox', 'exclosos', i.id, i.nom, r.exclosos.includes(i.id), (m) => commutar(i.id, m), 'xip-opcio'),
              ),
            ),
          ),
        ),
    );
  }

  pintar();
  return grup(
    t.exclosos.pregunta,
    t.exclosos.ajuda,
    triats,
    h(
      'label',
      { class: 'cerca' },
      h('span', { class: 'visualment-amagat' }, t.exclosos.cercar),
      h('input', {
        class: 'camp',
        type: 'search',
        placeholder: t.exclosos.cercar,
        autocomplete: 'off',
        oninput: (e: Event) => {
          cerca = (e.target as HTMLInputElement).value;
          pintar();
        },
      }),
    ),
    llista,
  );
}

function pasRestriccions(r: RespostesQuestionari, refer: () => void): HTMLElement {
  return h(
    'div',
    { class: 'grups' },
    grup(
      t.dieta.pregunta,
      undefined,
      radios<OpcioDieta>('dieta', t.dieta.opcions, r.dieta, (v) => {
        r.dieta = v;
        // Mostra o amaga les preguntes de carn i peix segons la dieta, sense perdre el focus.
        refer();
        document.querySelector<HTMLInputElement>(`input[name=dieta][value=${v}]`)?.focus();
      }),
    ),
    permetCarn(r.dieta)
      ? grup(t.carn.pregunta, undefined, radios<OpcioQuantitat>('carn', t.carn.opcions, r.carn, (v) => (r.carn = v)))
      : null,
    permetPeix(r.dieta)
      ? grup(t.peix.pregunta, undefined, radios<OpcioQuantitat>('peix', t.peix.opcions, r.peix, (v) => (r.peix = v)))
      : null,
    grup(
      t.alergens.pregunta,
      t.alergens.ajuda,
      h(
        'div',
        { class: 'xips' },
        ...ALERGENS.map((al: Alergen) =>
          opcio(
            'checkbox',
            'alergens',
            al,
            textos.alergens[al],
            r.alergens.includes(al),
            (m) => {
              r.alergens = m ? [...r.alergens, al] : r.alergens.filter((x) => x !== al);
            },
            'xip-opcio',
          ),
        ),
      ),
      h('p', { class: 'avis', role: 'note' }, t.alergens.avis),
    ),
    selectorExclosos(r),
  );
}

// ——— Pantalla d'un pas ———

const TITOLS: Record<Pas, string> = {
  familia: t.familia.pregunta,
  receptari: t.receptari.pregunta,
  pressupost: t.pressupost.pregunta,
  temps: t.temps.pregunta,
  restriccions: t.restriccions.titol,
};

/** Pantalla d'un pas del qüestionari. Treballa sobre `r` directament (és l'esborrany). */
export function pantallaPas(
  r: RespostesQuestionari,
  pas: Pas,
  desDelResum: boolean,
  accions: AccionsQuestionari,
): HTMLElement {
  const index = PASSOS.indexOf(pas);
  const cos = h('div', { class: 'pas__cos' });
  const refer = (): void => {
    const contingut =
      pas === 'familia'
        ? pasFamilia(r, refer)
        : pas === 'receptari'
          ? pasReceptari(r)
          : pas === 'pressupost'
            ? pasPressupost(r)
            : pas === 'temps'
              ? pasTemps(r)
              : pasRestriccions(r, refer);
    substituir(cos, contingut);
  };
  refer();

  const darrer = index === PASSOS.length - 1;
  const seguent = (): void => {
    if (desDelResum || darrer) accions.acabar();
    else accions.anar(PASSOS[index + 1]!);
  };
  const enrere = (): void => {
    if (desDelResum) accions.anar(null);
    else if (index > 0) accions.anar(PASSOS[index - 1]!);
  };

  return h(
    'main',
    { class: 'pas' },
    h(
      'header',
      { class: 'pas__capcalera' },
      h('p', { class: 'pas__numero' }, t.pas(index + 1, PASSOS.length)),
      h(
        'div',
        {
          class: 'progres',
          role: 'progressbar',
          'aria-valuemin': 1,
          'aria-valuemax': PASSOS.length,
          'aria-valuenow': index + 1,
          'aria-label': t.pas(index + 1, PASSOS.length),
        },
        h('div', { class: 'progres__barra', style: `width: ${((index + 1) / PASSOS.length) * 100}%` }),
      ),
      h('h1', { class: 'visualment-amagat', tabindex: -1 }, TITOLS[pas]),
    ),
    h(
      'form',
      {
        class: 'pas__formulari',
        novalidate: true,
        onsubmit: (e: Event) => {
          e.preventDefault();
          seguent();
        },
      },
      cos,
      h(
        'footer',
        { class: 'peu' },
        index > 0 || desDelResum
          ? h('button', { type: 'button', class: 'boto boto--secundari', onclick: enrere }, a.enrere)
          : h('span'),
        h('button', { type: 'submit', class: 'boto boto--principal' }, desDelResum ? a.desar : darrer ? a.acabar : a.seguent),
      ),
    ),
  );
}

// ——— Resum ———

function resumDe(r: RespostesQuestionari): { pas: Pas; titol: string; valor: string }[] {
  const tr = t.resum;
  const persones = r.persones
    .map((p) => `${p.nom} (${t.familia.opcionsGana[p.ganaCentesimes]?.toLowerCase() ?? p.ganaCentesimes})`)
    .join(', ');
  const { carn, peix } = quantitatsEfectives(r);
  const restriccions = [
    t.dieta.curta[r.dieta],
    permetCarn(r.dieta) && carn !== 'normal' ? t.carn.opcions[carn] : null,
    permetPeix(r.dieta) && peix !== 'normal' ? t.peix.opcions[peix] : null,
    r.alergens.length > 0 ? `${t.resum.alergens}: ${r.alergens.map((x) => textos.alergens[x]).join(', ')}` : null,
    r.exclosos.length > 0
      ? `${t.resum.exclosos}: ${r.exclosos.map((id) => catalegInicial.ingredients.get(id)?.nom ?? id).join(', ')}`
      : null,
  ].filter((x): x is string => x !== null);
  return [
    { pas: 'familia', titol: tr.persones(r.persones.length), valor: persones },
    {
      pas: 'receptari',
      titol: t.receptari.pregunta,
      valor: r.receptari.length > 0 ? r.receptari.map((x) => t.receptari.opcions[x]).join(' · ') : tr.receptariCap,
    },
    { pas: 'pressupost', titol: t.pressupost.pregunta, valor: t.pressupost.opcions[r.pressupost] },
    { pas: 'temps', titol: t.temps.pregunta, valor: t.temps.opcions[r.temps] },
    { pas: 'restriccions', titol: t.restriccions.titol, valor: restriccions.join(' · ') },
  ];
}

export function pantallaResum(r: RespostesQuestionari, accions: AccionsQuestionari): HTMLElement {
  const plats = filtrarReceptes(catalegInicial, configuracioDesDeRespostes(r)).length;
  return h(
    'main',
    { class: 'resum' },
    h('h1', { class: 'resum__titol', tabindex: -1 }, t.resum.titol),
    h(
      'p',
      { class: plats === 0 ? 'avis avis--error' : 'resum__plats', role: 'status' },
      t.resum.plats(plats),
    ),
    h(
      'ul',
      { class: 'resum__llista' },
      ...resumDe(r).map(({ pas, titol, valor }) =>
        h(
          'li',
          { class: 'targeta' },
          h('div', { class: 'targeta__text' }, h('h2', { class: 'targeta__titol' }, titol), h('p', { class: 'targeta__valor' }, valor)),
          h(
            'button',
            {
              type: 'button',
              class: 'boto boto--petit boto--secundari',
              'aria-label': `${a.canviar}: ${titol}`,
              onclick: () => accions.anar(pas),
            },
            a.canviar,
          ),
        ),
      ),
    ),
    h('p', { class: 'resum__properament' }, t.resum.properament),
  );
}
