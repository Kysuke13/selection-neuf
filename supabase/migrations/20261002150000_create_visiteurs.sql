-- Table des visiteurs : enregistrement progressif dès la première saisie.
-- Chaque ligne correspond à une session unique (session_id).

create table if not exists public.visiteurs (
  id           uuid primary key default gen_random_uuid(),
  session_id   text        not null unique,
  ip           text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  prenom       text,
  nom          text,
  email        text,
  telephone    text,
  projet       text,
  typologie    text,
  consent      boolean,
  source       text,
  page_url     text,
  user_agent   text,
  utm_source   text,
  utm_campaign text,
  utm_ad       text
);

create index if not exists visiteurs_session_id_idx on public.visiteurs (session_id);
create index if not exists visiteurs_created_at_idx on public.visiteurs (created_at desc);
create index if not exists visiteurs_ip_idx on public.visiteurs (ip);

alter table public.visiteurs enable row level security;

drop policy if exists "Public can insert visiteurs" on public.visiteurs;
create policy "Public can insert visiteurs"
  on public.visiteurs
  for insert
  to public
  with check (true);

drop policy if exists "Public can update own visiteur" on public.visiteurs;
create policy "Public can update own visiteur"
  on public.visiteurs
  for update
  to public
  using (true)
  with check (true);

grant usage on schema public to anon, authenticated;
grant insert, update on table public.visiteurs to anon, authenticated;
