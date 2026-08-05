-- Ralazaba Tatilde - Supabase şeması
-- Supabase Dashboard > SQL Editor içinde çalıştırın.

create extension if not exists "pgcrypto";

create table harcamalar (
  id uuid primary key default gen_random_uuid(),
  tutar integer not null check (tutar > 0),
  aciklama text not null,
  odeyen text not null,
  dahil_olanlar text[] not null check (array_length(dahil_olanlar, 1) >= 1),
  created_at timestamptz not null default now()
);

alter table harcamalar enable row level security;

-- Uygulamada giriş/kullanıcı sistemi yok (tek ortak PIN client-side).
-- Bu yüzden anon key ile tam CRUD erişimine izin veriyoruz.
create policy "anon full access" on harcamalar
  for all
  to anon
  using (true)
  with check (true);
