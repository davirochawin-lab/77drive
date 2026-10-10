-- ============================================================
-- 77 Drive — Analytics + Painel Admin
-- Rode este arquivo inteiro no SQL Editor do Supabase (uma vez).
-- ============================================================

-- 1) Tabela de eventos de analytics
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  button text,
  session_id uuid,
  path text,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_event_idx on public.analytics_events (event);

-- 2) Tabela de administradores do painel
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 3) Função que verifica se o usuário logado é admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- 4) RLS
alter table public.analytics_events enable row level security;
alter table public.admin_users enable row level security;

-- Qualquer visitante pode INSERIR eventos (anônimo, sem login)
drop policy if exists "anon insert events" on public.analytics_events;
create policy "anon insert events"
  on public.analytics_events for insert
  to anon, authenticated
  with check (true);

-- Só admins podem LER eventos
drop policy if exists "admins read events" on public.analytics_events;
create policy "admins read events"
  on public.analytics_events for select
  to authenticated
  using (public.is_admin());

-- Cada usuário vê apenas a própria linha em admin_users
drop policy if exists "read own admin row" on public.admin_users;
create policy "read own admin row"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

-- 5) Realtime para o painel atualizar sozinho
alter publication supabase_realtime add table public.analytics_events;

-- ============================================================
-- DEPOIS DE RODAR:
-- 1. Crie seu usuário em Authentication → Users → Add user
--    (e-mail + senha, marque "Auto Confirm User").
-- 2. Cadastre-o como admin rodando (troque o e-mail):
--
--    insert into public.admin_users (user_id)
--    select id from auth.users where email = 'seu@email.com';
--
-- 3. Acesse seudominio.com/admin e entre com esse e-mail e senha.
-- ============================================================
