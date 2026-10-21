import type { Ingredient, Preu, Recepta } from './tipus';
import { factorConversio } from './unitats';

/** Catàleg indexat per identificador, per a consultes ràpides. */
export interface Cataleg {
  ingredients: ReadonlyMap<string, Ingredient>;
  receptes: ReadonlyMap<string, Recepta>;
  preus: ReadonlyMap<string, Preu>;
}

export function crearCataleg(ingredients: Ingredient[], receptes: Recepta[], preus: Preu[]): Cataleg {
  return {
    ingredients: new Map(ingredients.map((i) => [i.id, i])),
    receptes: new Map(receptes.map((r) => [r.id, r])),
    preus: new Map(preus.map((p) => [p.ingredientId, p])),
  };
}

export function ingredient(cataleg: Cataleg, id: string): Ingredient {
  const trobat = cataleg.ingredients.get(id);
  if (!trobat) throw new Error(`Ingredient desconegut: «${id}»`);
  return trobat;
}

export function recepta(cataleg: Cataleg, id: string): Recepta {
  const trobada = cataleg.receptes.get(id);
  if (!trobada) throw new Error(`Recepta desconeguda: «${id}»`);
  return trobada;
}

/**
 * Comprova que el catàleg és coherent i retorna la llista d'errors (buida si tot és correcte).
 * Serveix per detectar errors en les dades abans que arribin als càlculs.
 */
export function validarCataleg(ingredients: Ingredient[], receptes: Recepta[], preus: Preu[]): string[] {
  const errors: string[] = [];
  const perId = new Map<string, Ingredient>();

  for (const i of ingredients) {
    if (perId.has(i.id)) errors.push(`Ingredient repetit: «${i.id}»`);
    perId.set(i.id, i);
    for (const [unitat, factor] of Object.entries(i.conversions ?? {})) {
      if (!(typeof factor === 'number' && factor > 0)) {
        errors.push(`Ingredient «${i.id}»: conversió a ${unitat} no vàlida`);
      }
    }
  }

  const receptesVistes = new Set<string>();
  for (const r of receptes) {
    if (receptesVistes.has(r.id)) errors.push(`Recepta repetida: «${r.id}»`);
    receptesVistes.add(r.id);
    if (!Number.isInteger(r.racions) || r.racions <= 0) errors.push(`Recepta «${r.id}»: racions no vàlides`);
    if (!Number.isInteger(r.tempsMinuts) || r.tempsMinuts <= 0) errors.push(`Recepta «${r.id}»: temps no vàlid`);
    if (r.ingredients.length === 0) errors.push(`Recepta «${r.id}»: sense ingredients`);
    for (const linia of r.ingredients) {
      const ing = perId.get(linia.ingredientId);
      if (!ing) {
        errors.push(`Recepta «${r.id}»: ingredient desconegut «${linia.ingredientId}»`);
        continue;
      }
      if (!Number.isInteger(linia.quantitat) || linia.quantitat <= 0) {
        errors.push(`Recepta «${r.id}»: quantitat no vàlida de «${linia.ingredientId}»`);
      }
      const unitat = linia.unitat ?? ing.unitat;
      if (factorConversio(ing, unitat) === null) {
        errors.push(`Recepta «${r.id}»: «${linia.ingredientId}» en ${unitat} sense conversió a ${ing.unitat}`);
      }
    }
  }

  for (const r of receptes) {
    if (r.tipus === 'acompanyament' && r.ambAcompanyament) {
      errors.push(`Recepta «${r.id}»: un acompanyament no pot demanar acompanyament`);
    }
  }
  if (receptes.some((r) => r.ambAcompanyament) && !receptes.some((r) => r.tipus === 'acompanyament')) {
    errors.push('Hi ha receptes que demanen acompanyament però no n’hi ha cap');
  }

  const preusVistos = new Set<string>();
  for (const p of preus) {
    if (preusVistos.has(p.ingredientId)) errors.push(`Preu repetit: «${p.ingredientId}»`);
    preusVistos.add(p.ingredientId);
    if (!perId.has(p.ingredientId)) errors.push(`Preu d'un ingredient desconegut: «${p.ingredientId}»`);
    if (!Number.isInteger(p.midaPaquet) || p.midaPaquet <= 0) errors.push(`Preu «${p.ingredientId}»: mida de paquet no vàlida`);
    if (!Number.isInteger(p.preuCentims) || p.preuCentims < 0) errors.push(`Preu «${p.ingredientId}»: preu no vàlid`);
  }

  return errors;
}
