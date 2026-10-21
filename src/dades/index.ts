import { crearCataleg, validarCataleg } from '../domini';
import { ingredients, ingredientsAmbAlergens } from './ingredients';
import { DATA_PREUS, ingredientsAmbPreuEstimat, preus } from './preus';
import { preusMercadona } from './preus-mercadona';
import { receptes } from './receptes';
export { carnIPeixPerCongelar, esPerCongelar } from './conservacio';

export { ingredients, ingredientsAmbAlergens, ingredientsAmbPreuEstimat, preus, preusMercadona, receptes, DATA_PREUS };

/** Catàleg inicial amb què arrenca l'app (fins que les dades vinguin de Supabase). */
export const catalegInicial = crearCataleg(ingredients, receptes, preus);

/** Errors del catàleg inicial; ha de ser buit (ho comproven els tests). */
export const errorsCatalegInicial = (): string[] => validarCataleg(ingredients, receptes, preus);
