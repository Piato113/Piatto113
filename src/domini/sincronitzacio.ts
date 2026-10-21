// Decideix com s'ajunten les dades del mòbil i les del compte (núvol).
// Regles:
//  - El que s'ha canviat al mòbil i encara no s'ha pogut enviar (pendent) mana: es torna a enviar.
//  - Si el núvol té una dada, mana el núvol (així dos mòbils amb el mateix correu veuen el mateix).
//  - Si el núvol no la té i el mòbil sí (primera vegada que s'entra), s'envia la del mòbil.

/** JSON amb les claus ordenades: el jsonb de Postgres no conserva l'ordre de les claus. */
export function jsonCanonic(valor: unknown): string {
  if (valor === null || typeof valor !== 'object') return JSON.stringify(valor) ?? 'null';
  if (Array.isArray(valor)) return `[${valor.map(jsonCanonic).join(',')}]`;
  const objecte = valor as Record<string, unknown>;
  const claus = Object.keys(objecte)
    .filter((k) => objecte[k] !== undefined)
    .sort();
  return `{${claus.map((k) => `${JSON.stringify(k)}:${jsonCanonic(objecte[k])}`).join(',')}}`;
}

export const iguals = (a: unknown, b: unknown): boolean => jsonCanonic(a ?? null) === jsonCanonic(b ?? null);

export interface Fusio<C extends string> {
  /** Dades del núvol que s'han de desar al mòbil. */
  aplicar: Partial<Record<C, unknown>>;
  /** Dades del mòbil que s'han d'enviar al núvol. */
  pujar: C[];
}

/**
 * @param local   Dades del mòbil (`null` = no n'hi ha).
 * @param remot   Fila del núvol, o `null` si l'usuari encara no en té.
 * @param pendents Dades canviades al mòbil que encara no s'han enviat.
 */
export function fusionar<C extends string>(
  columnes: readonly C[],
  local: Readonly<Record<C, unknown>>,
  remot: Readonly<Record<C, unknown>> | null,
  pendents: readonly C[],
): Fusio<C> {
  const aplicar: Partial<Record<C, unknown>> = {};
  const pujar: C[] = [];
  for (const c of columnes) {
    const l = local[c] ?? null;
    const r = remot ? (remot[c] ?? null) : null;
    if (pendents.includes(c)) {
      if (l !== null && !iguals(l, r)) pujar.push(c);
    } else if (r !== null) {
      if (!iguals(l, r)) aplicar[c] = r;
    } else if (l !== null) {
      pujar.push(c);
    }
  }
  return { aplicar, pujar };
}
