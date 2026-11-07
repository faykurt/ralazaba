-- Ralazaba Tatilde - Fiş / screenshot yüklemeleri
-- admin_schema.sql'den SONRA, Supabase SQL Editor'da BİR KEZ çalıştırın.

create table if not exists yuklemeler (
  id uuid primary key default gen_random_uuid(),
  tatil_id uuid not null references tatiller(id) on delete cascade,
  dosya_yolu text not null,
  dosya_adi text,
  tur text not null default 'fis' check (tur in ('fis', 'not', 'diger')),
  aciklama text,
  islendi boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists yuklemeler_tatil_idx on yuklemeler(tatil_id);

alter table yuklemeler enable row level security;

create policy "admin yuklemeler" on yuklemeler
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
