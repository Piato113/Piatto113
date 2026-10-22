-- Piatto113 — Comprovacions després d'executar 001_esquema.sql, 002_productes.sql i 003_valoracions.sql.
-- Supabase → SQL Editor → New query → enganxa-ho → Run. No canvia res: només consulta.
-- Resultat esperat: una fila per comprovació i totes amb «correcte» = true.

select 'Taula dades_usuari amb RLS' as comprovacio,
       relrowsecurity as correcte
from pg_class where oid = 'public.dades_usuari'::regclass

union all
select 'Taula productes amb RLS',
       relrowsecurity
from pg_class where oid = 'public.productes'::regclass

union all
select 'Quatre regles a dades_usuari (veure, crear, canviar, esborrar)',
       count(*) = 4
from pg_policies where schemaname = 'public' and tablename = 'dades_usuari'

union all
select 'Una regla de lectura a productes',
       count(*) = 1 and bool_and(cmd = 'SELECT')
from pg_policies where schemaname = 'public' and tablename = 'productes'

union all
select 'Sense sessió no es poden llegir les dades dels usuaris',
       not has_table_privilege('anon', 'public.dades_usuari', 'SELECT')

union all
select 'Ningú pot canviar els productes des de l''app',
       not has_table_privilege('anon', 'public.productes', 'UPDATE')
       and not has_table_privilege('authenticated', 'public.productes', 'UPDATE')

union all
select 'Productes carregats (1.693 al llistat del 21/10/2026)',
       count(*) > 0
from public.productes

union all
select 'Columna valoracions a dades_usuari (003_valoracions.sql)',
       count(*) = 1
from information_schema.columns
where table_schema = 'public' and table_name = 'dades_usuari' and column_name = 'valoracions';
