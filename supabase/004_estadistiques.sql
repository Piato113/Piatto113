-- A Taula (Piatto113) — Xifres del rètol: usuaris i menús fets
--
-- Com s'executa: Supabase → SQL Editor → New query → enganxa tot aquest fitxer → Run.
-- Es pot tornar a executar sense perdre dades (el comptador de menús es conserva).
--
-- Mentre no s'executi, l'app mostra al rètol només les receptes i les novetats.
-- Un cop executat, hi surten també «Ja som N a taula!» i «N menús fets», sense tocar res més.
--
-- Què crea:
--   * `comptadors`: taula amb el nombre de menús fets. Ningú hi pot llegir ni escriure directament (RLS sense regles).
--   * `estadistiques_app()`: torna {"usuaris": N, "menus": N}. Només números: cap correu ni cap dada de ningú.
--   * `sumar_menu()`: suma 1 als menús fets. L'app la crida cada vegada que fa un menú.
-- Totes dues funcions només es poden cridar amb la sessió iniciada.

begin;

create table if not exists public.comptadors (
  clau text primary key,
  valor bigint not null default 0 check (valor >= 0)
);

alter table public.comptadors enable row level security;
-- Sense regles: des de l'app no s'hi pot fer res directament; només a través de les funcions de sota.
revoke all on public.comptadors from anon, authenticated;

insert into public.comptadors (clau, valor) values ('menus', 0) on conflict (clau) do nothing;

comment on table public.comptadors is 'Comptadors generals de l''app (menús fets). Es canvien només amb sumar_menu().';

create or replace function public.estadistiques_app()
returns json
language sql
stable
security definer
set search_path = ''
as $$
  select json_build_object(
    'usuaris', (select count(*) from auth.users),
    'menus', coalesce((select valor from public.comptadors where clau = 'menus'), 0)
  );
$$;

create or replace function public.sumar_menu()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.comptadors set valor = valor + 1 where clau = 'menus';
$$;

revoke all on function public.estadistiques_app() from public, anon;
revoke all on function public.sumar_menu() from public, anon;
grant execute on function public.estadistiques_app() to authenticated;
grant execute on function public.sumar_menu() to authenticated;

commit;

-- Perquè l'API de Supabase vegi les funcions noves de seguida.
notify pgrst, 'reload schema';
