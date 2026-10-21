import type { OpcioPeix, OpcioPressupost, OpcioReceptari, OpcioTemps } from '../domini/questionari';
import type { Alergen, Avis, Dia } from '../domini/tipus';
import { formatEuros } from '../domini/format';

// Tots els textos de la interfície en català.
// Afegir aquí qualsevol text nou en lloc d'escriure'l directament a les pantalles.
export const textos = {
  app: {
    nom: 'Piatto113',
    nomParts: { paraula: 'Piatto', numero: '113' },
    lema: 'Menjar, quan tu vulguis',
    enConstruccio: 'Planificador setmanal d’àpats. En construcció.',
  },
  dies: {
    dl: 'Dilluns',
    dt: 'Dimarts',
    dc: 'Dimecres',
    dj: 'Dijous',
    dv: 'Divendres',
    ds: 'Dissabte',
    dg: 'Diumenge',
  } satisfies Record<Dia, string>,
  apats: { dinar: 'Dinar', sopar: 'Sopar' },
  questionari: {
    receptari: {
      pregunta: 'Quin tipus de receptari vols prioritzar?',
      ajuda: 'Pots triar-ne més d’un.',
      opcions: {
        variat: 'Variat i equilibrat, amb carn, peix, ous, llegums i pasta',
        economic: 'Econòmic, per controlar la despesa de la compra',
      } satisfies Record<OpcioReceptari, string>,
    },
    pressupost: {
      pregunta: 'Pressupost aproximat per àpat de quatre persones',
      ajuda: 'Compta el que es menja, no els paquets sencers. Amb més o menys persones, s’ajusta sol.',
      opcions: {
        economic: 'Econòmic: fins a 8 €',
        mitja: 'Mitjà: de 8 a 14 €',
        flexible: 'Flexible: prioritzar els plats, no el preu',
      } satisfies Record<OpcioPressupost, string>,
    },
    temps: {
      pregunta: 'Temps habitual per cuinar',
      opcions: {
        rapid: 'Ràpid: fins a 40 minuts',
        mixt: 'Entre setmana ràpid i el cap de setmana més elaborat',
        'sense-limit': 'Sense límit de temps',
      } satisfies Record<OpcioTemps, string>,
    },
    peix: {
      pregunta: 'Quant de peix voleu?',
      opcions: {
        normal: 'Cap restricció',
        poc: 'Poc peix',
        gens: 'Gens de peix',
      } satisfies Record<OpcioPeix, string>,
    },
    exclosos: {
      pregunta: 'Hi ha algun aliment que no pugui sortir mai?',
      ajuda: 'Verdures o llegums que no agraden, o qualsevol altre ingredient.',
    },
    alergens: {
      pregunta: 'Al·lèrgies i intoleràncies',
      ajuda: 'Cap recepta amb aquests al·lèrgens sortirà al menú.',
      avis:
        'La informació d’al·lèrgens és orientativa. Els productes envasats (embotits, brous, salses, pa…) ' +
        'poden contenir al·lèrgens o traces segons la marca: llegeix sempre l’etiqueta.',
    },
  },
  alergens: {
    gluten: 'Gluten',
    crustacis: 'Crustacis',
    ou: 'Ou',
    peix: 'Peix',
    cacauets: 'Cacauets',
    soja: 'Soja',
    llet: 'Llet i lactosa',
    'fruits-secs': 'Fruits secs',
    api: 'Api',
    mostassa: 'Mostassa',
    sesam: 'Sèsam',
    sulfits: 'Sulfits',
    tramussos: 'Tramussos',
    molluscs: 'Mol·luscs',
  } satisfies Record<Alergen, string>,
} as const;

/** Text d'un avís del planificador. `nomIngredient` tradueix identificadors a noms. */
export function textAvis(avis: Avis, nomIngredient: (id: string) => string = (id) => id): string {
  switch (avis.codi) {
    case 'cap-apat-marcat':
      return 'No hi ha cap àpat marcat aquesta setmana.';
    case 'cap-recepta-valida':
      return 'Cap recepta compleix les preferències, els aliments exclosos i el temps màxim. Revisa la configuració.';
    case 'receptes-repetides':
      return `Només hi ha ${avis.disponibles} receptes possibles per a ${avis.necessaries} àpats: algunes es repeteixen.`;
    case 'pressupost-impossible':
      return `No s’ha pogut ajustar al pressupost de ${formatEuros(avis.pressupostApatCentims)} per àpat. El menú més barat que s’ha trobat surt a ${formatEuros(avis.minimApatCentims)} per àpat.`;
    case 'sense-preu':
      return `Falta el preu de: ${avis.ingredientIds.map(nomIngredient).join(', ')}. El cost és incomplet.`;
  }
}
