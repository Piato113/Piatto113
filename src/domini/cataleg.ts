import type { Ingredient, Preu, Recepta } from './tipus';
import { validarPassos } from './preparacio';
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

/** Pot ocupar un àpat: principal (per defecte) o de doble ús. */
export const potSerPrincipal = (r: Recepta): boolean => r.tipus !== 'acompanyament' && r.tipus !== 'salsa';

/** És una salsa del receptari. */
export const esSalsa = (r: Recepta): boolean => r.tipus === 'salsa';

/** Només es pot fer a la barbacoa (cap alternativa): demana fer foc i només es planifica en cap de setmana. */
export const calBarbacoa = (r: Recepta): boolean => (r.aparells ?? []).some((a) => a === 'barbacoa');

/** Pot anar al costat d'una principal: acompanyament o de doble ús. */
export const potSerAcompanyament = (r: Recepta): boolean => r.tipus === 'acompanyament' || r.tipus === 'ambdos';

/**
 * Dels acompanyaments donats, els que admet la principal: tots si no en limita la llista,
 * i mai ella mateixa (una recepta de doble ús no s'acompanya a si mateixa).
 * Sense llista, els de barbacoa només van amb plats que també es fan a la barbacoa (no s'encén el foc per a un acompanyament),
 * i els que són només per a llista (`nomesAmbLlista`, com els de les cremes) no hi van mai.
 */
export function acompanyamentsAdmesos(principal: Recepta, acompanyaments: readonly Recepta[]): Recepta[] {
  const llista = principal.acompanyaments;
  return acompanyaments.filter(
    (a) =>
      a.id !== principal.id &&
      (llista === undefined ? !a.nomesAmbLlista && (!calBarbacoa(a) || calBarbacoa(principal)) : llista.includes(a.id)),
  );
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
    errors.push(...validarPassos(r));
    if (r.mesos !== undefined && (r.mesos.length === 0 || r.mesos.some((m) => !Number.isInteger(m) || m < 1 || m > 12))) {
      errors.push(`Recepta «${r.id}»: mesos de temporada no vàlids`);
    }
  }

  const receptaPerId = new Map(receptes.map((r) => [r.id, r]));
  for (const r of receptes) {
    if (r.tipus === 'acompanyament' && r.ambAcompanyament) {
      errors.push(`Recepta «${r.id}»: un acompanyament no pot demanar acompanyament`);
    }
    if (r.tipus === 'salsa' && (r.ambAcompanyament || r.salses)) {
      errors.push(`Recepta «${r.id}»: una salsa no porta acompanyament ni salses`);
    }
    for (const id of r.salses ?? []) {
      const s = receptaPerId.get(id);
      if (!s) errors.push(`Recepta «${r.id}»: salsa desconeguda «${id}»`);
      else if (s.tipus !== 'salsa') errors.push(`Recepta «${r.id}»: «${id}» no és una salsa`);
    }
    if (r.acompanyaments === undefined) continue;
    if (!r.ambAcompanyament) {
      errors.push(`Recepta «${r.id}»: indica acompanyaments però no en demana`);
    }
    if (r.acompanyaments.length === 0) errors.push(`Recepta «${r.id}»: la llista d’acompanyaments és buida`);
    for (const id of r.acompanyaments) {
      const a = receptaPerId.get(id);
      if (!a) errors.push(`Recepta «${r.id}»: acompanyament desconegut «${id}»`);
      else if (id === r.id) errors.push(`Recepta «${r.id}»: no es pot acompanyar a si mateixa`);
      else if (!potSerAcompanyament(a)) errors.push(`Recepta «${r.id}»: «${id}» no és un acompanyament`);
    }
  }
  for (const r of receptes) {
    if (!r.nomesAmbLlista) continue;
    if (!potSerAcompanyament(r)) errors.push(`Recepta «${r.id}»: només els acompanyaments poden ser només per a llista`);
    else if (!receptes.some((x) => x.acompanyaments?.includes(r.id))) {
      errors.push(`Recepta «${r.id}»: és només per a llista però cap principal no la té`);
    }
  }
  const totsElsAcompanyaments = receptes.filter(potSerAcompanyament);
  for (const r of receptes) {
    if (!r.ambAcompanyament || r.tipus === 'acompanyament') continue;
    if (acompanyamentsAdmesos(r, totsElsAcompanyaments).length === 0) {
      errors.push(`Recepta «${r.id}»: demana acompanyament però no n’hi ha cap de disponible`);
    }
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
