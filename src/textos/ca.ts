import type { Avis, Dia } from '../domini/tipus';
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
      return `No s’ha pogut ajustar al pressupost de ${formatEuros(avis.pressupostCentims)}. El menú més barat que s’ha trobat costa ${formatEuros(avis.minimCentims)}.`;
    case 'sense-preu':
      return `Falta el preu de: ${avis.ingredientIds.map(nomIngredient).join(', ')}. El cost és incomplet.`;
  }
}
