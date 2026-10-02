-- Ajout des colonnes de géolocalisation IP sur la table visiteurs.

alter table public.visiteurs add column if not exists geo_country text;
alter table public.visiteurs add column if not exists geo_region text;
alter table public.visiteurs add column if not exists geo_city text;
alter table public.visiteurs add column if not exists geo_lat double precision;
alter table public.visiteurs add column if not exists geo_lon double precision;
