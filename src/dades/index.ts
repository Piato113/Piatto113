import { crearCataleg, validarCataleg } from '../domini';
import { ingredients } from './ingredients';
import { DATA_PREUS, preus } from './preus';
import { receptes } from './receptes';

export { ingredients, preus, receptes, DATA_PREUS };

/** Catàleg inicial amb què arrenca l'app (fins que les dades vinguin de Supabase). */
export const catalegInicial = crearCataleg(ingredients, receptes, preus);

/** Errors del catàleg inicial; ha de ser buit (ho comproven els tests). */
export const errorsCatalegInicial = (): string[] => validarCataleg(ingredients, receptes, preus);
