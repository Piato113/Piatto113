// Dades petites i inventades, només per als tests (no és el catàleg de l'app).
import type { ConfiguracioFamilia, Ingredient, Preu, Recepta } from '../src/domini';

export const ingredients: Ingredient[] = [
  { id: 'arros', nom: 'Arròs', unitat: 'g', seccio: 'secs' },
  { id: 'ceba', nom: 'Ceba', unitat: 'g', seccio: 'fruita', conversions: { u: 150 } },
  { id: 'ou', nom: 'Ous', unitat: 'u', seccio: 'frescos' },
  { id: 'pollastre', nom: 'Pollastre', unitat: 'g', seccio: 'carn' },
  { id: 'llenties', nom: 'Llenties', unitat: 'g', seccio: 'secs' },
  { id: 'tomaquet', nom: 'Tomàquet', unitat: 'g', seccio: 'fruita' },
  { id: 'salmo', nom: 'Salmó', unitat: 'g', seccio: 'peix' },
  { id: 'oli', nom: 'Oli d’oliva', unitat: 'ml', rebost: true },
  { id: 'sal', nom: 'Sal', unitat: 'g', rebost: true },
];

export const preus: Preu[] = [
  { ingredientId: 'arros', midaPaquet: 1000, preuCentims: 150 },
  { ingredientId: 'ceba', midaPaquet: 1000, preuCentims: 200 },
  { ingredientId: 'ou', midaPaquet: 12, preuCentims: 300 },
  { ingredientId: 'pollastre', midaPaquet: 1000, preuCentims: 800 },
  { ingredientId: 'llenties', midaPaquet: 500, preuCentims: 180 },
  { ingredientId: 'tomaquet', midaPaquet: 1000, preuCentims: 250 },
  { ingredientId: 'salmo', midaPaquet: 1000, preuCentims: 2000 },
  { ingredientId: 'oli', midaPaquet: 1000, preuCentims: 900 },
];

export const receptes: Recepta[] = [
  {
    id: 'truita',
    nom: 'Truita de ceba',
    racions: 4,
    tempsMinuts: 30,
    etiquetes: ['vegetaria'],
    ingredients: [
      { ingredientId: 'ou', quantitat: 6 },
      { ingredientId: 'ceba', quantitat: 1, unitat: 'u' },
      { ingredientId: 'oli', quantitat: 50 },
      { ingredientId: 'sal', quantitat: 5 },
    ],
  },
  {
    id: 'arros-pollastre',
    nom: 'Arròs amb pollastre',
    racions: 4,
    tempsMinuts: 45,
    etiquetes: ['carn'],
    ingredients: [
      { ingredientId: 'arros', quantitat: 320 },
      { ingredientId: 'pollastre', quantitat: 600 },
      { ingredientId: 'ceba', quantitat: 1, unitat: 'u' },
      { ingredientId: 'oli', quantitat: 40 },
    ],
  },
  {
    id: 'llenties',
    nom: 'Llenties guisades',
    racions: 4,
    tempsMinuts: 60,
    etiquetes: ['vegetaria'],
    ingredients: [
      { ingredientId: 'llenties', quantitat: 400 },
      { ingredientId: 'ceba', quantitat: 150 },
      { ingredientId: 'tomaquet', quantitat: 200 },
    ],
  },
  {
    id: 'salmo',
    nom: 'Salmó al forn',
    racions: 4,
    tempsMinuts: 25,
    etiquetes: ['peix'],
    ingredients: [
      { ingredientId: 'salmo', quantitat: 800 },
      { ingredientId: 'tomaquet', quantitat: 300 },
      { ingredientId: 'oli', quantitat: 30 },
    ],
  },
];

export function configuracio(canvis: Partial<ConfiguracioFamilia> = {}): ConfiguracioFamilia {
  return {
    persones: [
      { nom: 'A', ganaCentesimes: 100 },
      { nom: 'B', ganaCentesimes: 100 },
      { nom: 'C', ganaCentesimes: 100 },
      { nom: 'D', ganaCentesimes: 100 },
    ],
    exclosos: [],
    origensExclosos: [],
    alergens: [],
    etiquetesObligatories: [],
    etiquetesExcloses: [],
    etiquetesPreferides: [],
    etiquetesEvitades: [],
    equilibrat: false,
    economic: false,
    tempsMaximMinuts: { feiners: null, capDeSetmana: null },
    pressupostRacioCentims: null,
    ...canvis,
  };
}

/** El mateix temps màxim tots els dies. */
export const temps = (minuts: number | null): ConfiguracioFamilia['tempsMaximMinuts'] => ({
  feiners: minuts,
  capDeSetmana: minuts,
});

/** Receptes sintètiques d'un sol ingredient, per tenir-ne moltes. */
export function receptesSintetiques(quantes: number): Recepta[] {
  return Array.from({ length: quantes }, (_, i) => ({
    id: `r${String(i).padStart(2, '0')}`,
    nom: `Recepta ${i}`,
    racions: 4,
    tempsMinuts: 20,
    etiquetes: [],
    ingredients: [{ ingredientId: 'arros', quantitat: 100 + i }],
  }));
}
