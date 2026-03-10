-- ── Activer pg_cron et pg_net ────────────────────────────────────────────
-- Colle ce SQL dans Supabase → SQL Editor → New query

-- 1. Activer les extensions nécessaires
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 2. Rappel matin  : tous les jours à 8h00 heure de Paris (7h UTC hiver / 6h UTC été)
--    On programme à 7h UTC ce qui correspond à ~8h Paris en hiver
select cron.schedule(
  'rappel-matin',
  '0 7 * * *',
  $$
    select net.http_post(
      url     := current_setting('app.supabase_url') || '/functions/v1/send-reminders',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_anon_key')
      ),
      body    := '{}'::jsonb
    );
  $$
);

-- 3. Rappel veille : tous les jours à 20h00 heure de Paris (19h UTC hiver / 18h UTC été)
select cron.schedule(
  'rappel-veille',
  '0 19 * * *',
  $$
    select net.http_post(
      url     := current_setting('app.supabase_url') || '/functions/v1/send-reminders',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_anon_key')
      ),
      body    := '{}'::jsonb
    );
  $$
);

-- Pour vérifier les cron jobs créés :
-- select * from cron.job;

-- Pour supprimer un job si besoin :
-- select cron.unschedule('rappel-matin');
-- select cron.unschedule('rappel-veille');
