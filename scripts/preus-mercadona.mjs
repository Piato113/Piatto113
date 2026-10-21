// Genera src/dades/preus-mercadona.ts a partir del llistat del Mercadona i de les correspondències.
// Ús: node scripts/preus-mercadona.mjs
// Entrades: dades/mercadona/productes-17003.csv i dades/mercadona/correspondencies.json

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const arrel = fileURLToPath(new URL('..', import.meta.url));
const csv = readFileSync(`${arrel}dades/mercadona/productes-17003.csv`, 'utf8');
const correspondencies = JSON.parse(readFileSync(`${arrel}dades/mercadona/correspondencies.json`, 'utf8'));

/** CSV amb cometes (els noms poden portar comes). */
function llegirCsv(text) {
  const files = [];
  let fila = [];
  let camp = '';
  let entreCometes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (entreCometes) {
      if (c === '"' && text[i + 1] === '"') {
        camp += '"';
        i++;
      } else if (c === '"') entreCometes = false;
      else camp += c;
    } else if (c === '"') entreCometes = true;
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
  if (camp !== '' || fila.length > 0) files.push([...fila, camp]);
  const [capcalera, ...dades] = files;
  return dades.map((f) => Object.fromEntries(capcalera.map((c, i) => [c, f[i] ?? ''])));
}

const productes = new Map(llegirCsv(csv).map((p) => [p.id, p]));
const errors = [];
const preus = [];
let data = '';

for (const [ingredientId, c] of Object.entries(correspondencies)) {
  if (ingredientId.startsWith('_')) continue;
  const p = productes.get(c.producte);
  if (!p) {
    errors.push(`${ingredientId}: el producte ${c.producte} no és al llistat`);
    continue;
  }
  data = p.data > data ? p.data : data;
  const preuCentims = Math.round(Number(p.preu) * 100);
  let quantitat = Number(p.quantitat);
  if (!p.quantitat) {
    // Pes variable (congelats): quantitat = preu ÷ preu per kg.
    if (p.unitat_referencia !== 'kg' || !Number(p.preu_referencia)) {
      errors.push(`${ingredientId}: el producte ${p.id} no té quantitat`);
      continue;
    }
    quantitat = Number(p.preu) / Number(p.preu_referencia);
  }
  let unitat;
  let midaPaquet;
  if (c.peces) {
    unitat = 'u';
    midaPaquet = c.peces;
  } else if (p.format === 'ud') {
    unitat = 'u';
    midaPaquet = Math.round(quantitat);
  } else {
    unitat = p.format === 'l' ? 'ml' : 'g';
    midaPaquet = c.mida ?? Math.round(quantitat * 1000);
  }
  if (!(midaPaquet > 0) || !(preuCentims > 0)) {
    errors.push(`${ingredientId}: mida o preu no vàlids`);
    continue;
  }
  preus.push({ ingredientId, midaPaquet, preuCentims, unitat, producte: { id: p.id, nom: p.producte } });
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const linies = preus.map(
  (p) =>
    `  { ingredientId: ${JSON.stringify(p.ingredientId)}, midaPaquet: ${p.midaPaquet}, preuCentims: ${p.preuCentims}, ` +
    `unitat: '${p.unitat}', producte: { id: ${JSON.stringify(p.producte.id)}, nom: ${JSON.stringify(p.producte.nom)} } },`,
);

const sortida = `// GENERAT per scripts/preus-mercadona.mjs a partir de dades/mercadona/. No l'editis a mà:
// canvia les correspondències o el llistat i torna a executar \`node scripts/preus-mercadona.mjs\`.
import type { Preu, Unitat } from '../domini';

/** Data del llistat de preus del Mercadona (Girona, 17003). */
export const DATA_PREUS_MERCADONA = '${data}';

/** Preus del Mercadona. \`unitat\` és la unitat de la mida del paquet (es comprova als tests). */
export const preusMercadona: (Preu & { unitat: Unitat })[] = [
${linies.join('\n')}
];
`;

writeFileSync(`${arrel}src/dades/preus-mercadona.ts`, sortida);
console.log(`${preus.length} preus generats (llistat del ${data}).`);
