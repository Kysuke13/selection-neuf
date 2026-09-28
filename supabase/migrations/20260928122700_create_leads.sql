-- Table des leads captés par le formulaire du site Sélection Neuf.
-- À exécuter dans Supabase (SQL Editor) ou via `supabase db push`.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  prenom       text        not null,
  nom          text        not null,
  email        text        not null,
  telephone    text        not null,
  projet       text,
  typologie    text,
  consent      boolean     not null default false,
  source       text        not null default 'duo-verde-montpellier',
  page_url     text,
  user_agent   text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (email);

-- Sécurité : on active RLS et on autorise uniquement l'insertion publique
-- (aucune lecture publique des leads).
alter table public.leads enable row level security;

drop policy if exists "Public can insert leads" on public.leads;
create policy "Public can insert leads"
  on public.leads
  for insert
  to public
  with check (true);

-- Autorise les rôles applicatifs à écrire dans la table.
grant usage on schema public to anon, authenticated;
grant insert on table public.leads to anon, authenticated;
