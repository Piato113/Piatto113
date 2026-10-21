-- Piatto113 — Esquema de la base de dades (Supabase)
--
-- Com s'executa: Supabase → SQL Editor → New query → enganxa tot aquest fitxer → Run.
-- Es pot tornar a executar sense perdre dades: només crea el que falta i refà les regles.
--
-- Dues taules:
--   dades_usuari  Una fila per usuari amb les dades que ara es desen al mòbil
--                 (respostes del qüestionari, graella, menú i productes marcats de la compra).
--                 Cada usuari només pot veure i canviar la seva fila (RLS).
--   productes     Llistat de productes i preus del Mercadona (Girona, 17003).
--                 Tothom el pot llegir; ningú el pot canviar des de l'app.
--                 Es carrega amb supabase/002_productes.sql (generat per `npm run productes-sql`).
--
-- Els cronòmetres de cuina NO van a Supabase: són d'aquell mòbil i d'aquell moment.

begin;

-- ——— Funció comuna: actualitza la data de l'últim canvi ———

create or replace function public.posa_data_actualitzacio()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.actualitzat := now();
  return new;
end;
$$;

-- ——— Dades de cada usuari ———
--
-- Les columnes són JSON amb el mateix format que l'app ja desa al mòbil
-- (l'app les valida en llegir-les, igual que ara amb el localStorage):
--   respostes  RespostesQuestionari  (persones, receptari, pressupost, temps, dieta, carn, peix, exclosos, alergens)
--   graella    Graella               (quins àpats es fan a casa cada dia)
--   menu       MenuDesat             (signatura, llavor, graella, apats, avisos)
--   compra     { signatura, marcats } (productes marcats a la llista de la compra)
-- Una columna buida (null) vol dir que encara no s'ha desat res.

create table if not exists public.dades_usuari (
  usuari_id   uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  respostes   jsonb,
  graella     jsonb,
  menu        jsonb,
  compra      jsonb,
  creat       timestamptz not null default now(),
  actualitzat timestamptz not null default now(),

  constraint respostes_objecte check (respostes is null or jsonb_typeof(respostes) = 'object'),
  constraint graella_objecte   check (graella   is null or jsonb_typeof(graella)   = 'object'),
  constraint menu_objecte      check (menu      is null or jsonb_typeof(menu)      = 'object'),
  constraint compra_objecte    check (compra    is null or jsonb_typeof(compra)    = 'object'),
  -- Límit de mida (100 kB per columna): un menú setmanal en fa uns pocs kB.
  constraint mida_raonable check (
    coalesce(octet_length(respostes::text), 0) <= 100000 and
    coalesce(octet_length(graella::text),   0) <= 100000 and
    coalesce(octet_length(menu::text),      0) <= 100000 and
    coalesce(octet_length(compra::text),    0) <= 100000
  )
);

comment on table public.dades_usuari is 'Dades de cada usuari de Piatto113 (una fila per usuari). Només les veu el seu propietari.';

drop trigger if exists dades_usuari_actualitzat on public.dades_usuari;
create trigger dades_usuari_actualitzat
  before update on public.dades_usuari
  for each row execute function public.posa_data_actualitzacio();

alter table public.dades_usuari enable row level security;

-- Cada usuari amb sessió iniciada només veu, crea, canvia i esborra la seva fila.
drop policy if exists "Cada usuari veu les seves dades"      on public.dades_usuari;
drop policy if exists "Cada usuari crea les seves dades"     on public.dades_usuari;
drop policy if exists "Cada usuari canvia les seves dades"   on public.dades_usuari;
drop policy if exists "Cada usuari esborra les seves dades"  on public.dades_usuari;

create policy "Cada usuari veu les seves dades" on public.dades_usuari
  for select to authenticated
  using ((select auth.uid()) = usuari_id);

create policy "Cada usuari crea les seves dades" on public.dades_usuari
  for insert to authenticated
  with check ((select auth.uid()) = usuari_id);

create policy "Cada usuari canvia les seves dades" on public.dades_usuari
  for update to authenticated
  using ((select auth.uid()) = usuari_id)
  with check ((select auth.uid()) = usuari_id);

create policy "Cada usuari esborra les seves dades" on public.dades_usuari
  for delete to authenticated
  using ((select auth.uid()) = usuari_id);

-- Sense sessió (anon) no s'hi pot fer res.
revoke all on table public.dades_usuari from anon;
grant select, insert, update, delete on table public.dades_usuari to authenticated;

-- ——— Productes del Mercadona ———
--
-- Una fila per producte del llistat (columnes de dades/mercadona/productes-17003.csv).
-- Diners en cèntims, com a l'app.
--   format             Com es ven: kg, l o ud.
--   quantitat          Quantitat del paquet en aquest format (buida si el pes és variable).
--   preu_centims       Preu del paquet.
--   preu_referencia_centims / unitat_referencia   Preu per kg, L, 100 g, unitat…, tal com surt al llistat.
--   data               Data del llistat d'on surt el preu.

create table if not exists public.productes (
  botiga                  text          not null default '17003',
  id                      text          not null,
  categoria               text          not null,
  subcategoria            text          not null,
  nom                     text          not null,
  format                  text          not null check (format in ('kg', 'l', 'ud')),
  quantitat               numeric(12,6) check (quantitat is null or quantitat > 0),
  preu_centims            integer       not null check (preu_centims > 0),
  preu_referencia_centims numeric(12,1) check (preu_referencia_centims is null or preu_referencia_centims > 0),
  unitat_referencia       text,
  data                    date          not null,
  actualitzat             timestamptz   not null default now(),
  primary key (botiga, id)
);

comment on table public.productes is 'Productes i preus del Mercadona de referència. Només lectura des de l''app.';

drop trigger if exists productes_actualitzat on public.productes;
create trigger productes_actualitzat
  before update on public.productes
  for each row execute function public.posa_data_actualitzacio();

alter table public.productes enable row level security;

-- Tothom el pot llegir (també abans d'iniciar sessió). No hi ha cap regla per escriure:
-- només es pot canviar des de l'SQL Editor de Supabase.
drop policy if exists "Tothom pot llegir els productes" on public.productes;
create policy "Tothom pot llegir els productes" on public.productes
  for select to anon, authenticated
  using (true);

revoke all on table public.productes from anon, authenticated;
grant select on table public.productes to anon, authenticated;

commit;
