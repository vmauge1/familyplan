-- Table pour stocker les tokens FCM des utilisateurs
-- Colle ce SQL dans Supabase → SQL Editor → Nouvelle requête

create table if not exists push_tokens (
  user_id    uuid        primary key references auth.users(id) on delete cascade,
  token      text        not null,
  updated_at timestamptz default now()
);

alter table push_tokens enable row level security;

-- Chaque utilisateur peut lire et écrire son propre token
create policy "own_token" on push_tokens
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- La Edge Function (service_role) peut lire tous les tokens
-- → déjà couvert par service_role qui bypass RLS
