-- Paramètres Google Ads transmis dans l'URL d'arrivée :
-- ?utm_source=google&utm_campaign={campaignid}&utm_ad={creative}
alter table public.leads
  add column if not exists utm_source text,
  add column if not exists utm_campaign text,
  add column if not exists utm_ad text;

notify pgrst, 'reload schema';
