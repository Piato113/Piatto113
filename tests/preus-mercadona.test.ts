import { describe, expect, it } from 'vitest';
import csvProductes from '../dades/mercadona/productes-17003.csv?raw';
import jsonCorrespondencies from '../dades/mercadona/correspondencies.json?raw';
import { ingredients, ingredientsAmbPreuEstimat, preus, preusMercadona } from '../src/dades';

/** Llegeix el CSV del llistat (camps entre cometes si porten comes). */
function llegirCsv(text: string): Record<string, string>[] {
  const files: string[][] = [];
  let fila: string[] = [];
  let camp = '';
  let cometes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (cometes) {
      if (c === '"' && text[i + 1] === '"') {
        camp += '"';
        i++;
      } else if (c === '"') cometes = false;
      else camp += c;
    } else if (c === '"') cometes = true;
    else if (c === ',') {
      fila.push(camp);
      camp = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      fila.push(camp);
      if (fila.some((x) => x !== '')) files.push(fila);
      fila = [];
      camp = '';
    } else camp += c;
  }
  const [capcalera = [], ...dades] = files;
  return dades.map((f) => Object.fromEntries(capcalera.map((c, i) => [c, f[i] ?? ''])));
}

const productes = new Map(llegirCsv(csvProductes).map((p) => [p.id!, p]));
const correspondencies = JSON.parse(jsonCorrespondencies) as Record<string, { producte: string }>;
const perId = new Map(ingredients.map((i) => [i.id, i]));

describe('preus del Mercadona', () => {
  it('cada correspondència és d’un ingredient i d’un producte que existeixen', () => {
    for (const [id, c] of Object.entries(correspondencies)) {
      if (id.startsWith('_')) continue;
      expect(perId.has(id), id).toBe(true);
      expect(productes.has(c.producte), `${id} → ${c.producte}`).toBe(true);
    }
  });

  it('el fitxer generat està al dia amb el llistat (torna a executar el script si falla)', () => {
    const generats = new Set(preusMercadona.map((p) => p.ingredientId));
    expect([...generats].sort()).toEqual(Object.keys(correspondencies).filter((k) => !k.startsWith('_')).sort());
    for (const p of preusMercadona) {
      const producte = productes.get(p.producte!.id);
      expect(producte?.producte, p.ingredientId).toBe(p.producte!.nom);
      expect(Math.round(Number(producte?.preu) * 100), p.ingredientId).toBe(p.preuCentims);
    }
  });

  it('la mida del paquet és en la unitat de l’ingredient', () => {
    for (const p of preusMercadona) expect(p.unitat, p.ingredientId).toBe(perId.get(p.ingredientId)?.unitat);
  });

  it('un sol preu per ingredient, i el del Mercadona mana sobre l’estimat', () => {
    const ids = preus.map((p) => p.ingredientId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of preusMercadona) {
      expect(preus.find((x) => x.ingredientId === p.ingredientId)?.preuCentims).toBe(p.preuCentims);
    }
    for (const id of ingredientsAmbPreuEstimat) expect(preus.find((x) => x.ingredientId === id)?.producte).toBeUndefined();
  });
});
