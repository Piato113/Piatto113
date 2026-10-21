// Genera supabase/002_productes.sql a partir del llistat del Mercadona.
// Ús: npm run productes-sql
// Entrada: dades/mercadona/productes-17003.csv
//
// L'SQL resultant afegeix o actualitza tots els productes del llistat i esborra els de la mateixa
// botiga que ja no hi surten. Roger l'executa a l'SQL Editor de Supabase després de 001_esquema.sql.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { llegirCsv } from './csv.mjs';

const BOTIGA = '17003';
const FORMATS = new Set(['kg', 'l', 'ud']);

const arrel = fileURLToPath(new URL('..', import.meta.url));
const productes = llegirCsv(readFileSync(`${arrel}dades/mercadona/productes-17003.csv`, 'utf8'));

const text = (v) => `'${String(v).replaceAll("'", "''")}'`;
const opcional = (v) => (v === '' ? 'null' : v);
/** Euros amb decimals → cèntims, sense errors de coma flotant. */
function centims(euros, decimals) {
  if (euros === '') return null;
  if (!/^\d+(\.\d+)?$/.test(euros)) return undefined;
  const valor = Math.round(Number(euros) * 100 * 10 ** decimals) / 10 ** decimals;
  return valor > 0 ? valor : undefined;
}

const errors = [];
const vistos = new Set();
let data = '';
const files = [];

for (const p of productes) {
  const on = `producte ${p.id || '(sense id)'}`;
  if (!/^\d+(\.\d+)?$/.test(p.id)) errors.push(`${on}: id no vàlid`);
  if (vistos.has(p.id)) errors.push(`${on}: repetit`);
  vistos.add(p.id);
  if (!FORMATS.has(p.format)) errors.push(`${on}: format «${p.format}» desconegut`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.data)) errors.push(`${on}: data no vàlida`);
  if (p.quantitat !== '' && !(Number(p.quantitat) > 0)) errors.push(`${on}: quantitat no vàlida`);
  const preu = centims(p.preu, 0);
  const preuReferencia = centims(p.preu_referencia, 1);
  if (!preu) errors.push(`${on}: preu no vàlid`);
  if (preuReferencia === undefined) errors.push(`${on}: preu de referència no vàlid`);
  data = p.data > data ? p.data : data;
  files.push(
    `  (${text(BOTIGA)}, ${text(p.id)}, ${text(p.categoria)}, ${text(p.subcategoria)}, ${text(p.producte)}, ` +
      `${text(p.format)}, ${opcional(p.quantitat)}, ${preu}, ${preuReferencia ?? 'null'}, ` +
      `${p.unitat_referencia === '' ? 'null' : text(p.unitat_referencia)}, ${text(p.data)})`,
  );
}

if (files.length === 0) errors.push('El llistat és buit');
if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const sortida = `-- GENERAT per scripts/productes-sql.mjs a partir de dades/mercadona/productes-17003.csv. No l'editis a mà.
-- Productes del Mercadona de Girona (${BOTIGA}), llistat del ${data}: ${files.length} productes.
--
-- Com s'executa: Supabase → SQL Editor → New query → enganxa tot aquest fitxer → Run.
-- Cal haver executat abans 001_esquema.sql. Es pot tornar a executar amb un llistat nou:
-- afegeix els productes nous, actualitza els que hi eren i esborra els que ja no hi surten.

begin;

insert into public.productes
  (botiga, id, categoria, subcategoria, nom, format, quantitat, preu_centims, preu_referencia_centims, unitat_referencia, data)
values
${files.join(',\n')}
on conflict (botiga, id) do update set
  categoria               = excluded.categoria,
  subcategoria            = excluded.subcategoria,
  nom                     = excluded.nom,
  format                  = excluded.format,
  quantitat               = excluded.quantitat,
  preu_centims            = excluded.preu_centims,
  preu_referencia_centims = excluded.preu_referencia_centims,
  unitat_referencia       = excluded.unitat_referencia,
  data                    = excluded.data;

-- Els productes d'aquesta botiga que no són al llistat ja no es venen.
delete from public.productes
where botiga = ${text(BOTIGA)}
  and id not in (${[...vistos].map(text).join(', ')});

commit;
`;

writeFileSync(`${arrel}supabase/002_productes.sql`, sortida);
console.log(`${files.length} productes a supabase/002_productes.sql (llistat del ${data}).`);
