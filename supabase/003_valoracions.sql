-- Piatto113 — Plats valorats (👍 / 👎)
--
-- Com s'executa: Supabase → SQL Editor → New query → enganxa tot aquest fitxer → Run.
-- Es pot tornar a executar sense perdre dades.
--
-- Afegeix a dades_usuari la columna `valoracions`: un objecte JSON amb una entrada per plat valorat,
--   { "<id de la recepta>": "agrada" | "no-agrada", ... }
-- Les regles de seguretat (RLS) de la taula ja la cobreixen: cada usuari només veu i canvia la seva fila.

begin;

alter table public.dades_usuari add column if not exists valoracions jsonb;

alter table public.dades_usuari drop constraint if exists valoracions_objecte;
alter table public.dades_usuari add constraint valoracions_objecte
  check (valoracions is null or jsonb_typeof(valoracions) = 'object');

alter table public.dades_usuari drop constraint if exists valoracions_mida;
alter table public.dades_usuari add constraint valoracions_mida
  check (coalesce(octet_length(valoracions::text), 0) <= 100000);

comment on column public.dades_usuari.valoracions is 'Plats valorats per la família: {receptaId: "agrada" | "no-agrada"}.';

commit;

-- Perquè l'API de Supabase vegi la columna nova de seguida.
notify pgrst, 'reload schema';
