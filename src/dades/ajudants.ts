import type { LiniaRecepta, Pas, Unitat } from '../domini';

/** Línia d'ingredient: `l('ceba', 1, 'u')`. Sense unitat, és la unitat base de l'ingredient. */
export const l = (ingredientId: string, quantitat: number, unitat?: Unitat): LiniaRecepta =>
  unitat ? { ingredientId, quantitat, unitat } : { ingredientId, quantitat };

/** Pas sense cronòmetre. */
export const p = (text: string): Pas => ({ text });

/** Pas amb cronòmetre: durada en minuts (admet decimals) i nom curt. */
export const c = (text: string, minuts: number, nom: string): Pas => ({
  text,
  cronometre: { segons: Math.round(minuts * 60), nom },
});
