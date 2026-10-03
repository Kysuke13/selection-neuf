-- Temps passé sur la page (onglet visible), en secondes, pour chaque session visiteur.

alter table public.visiteurs
  add column if not exists duree_secondes integer not null default 0;
