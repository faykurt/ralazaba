-- Ralazaba Tatilde - Admin (tatil kaydı / dokümantasyon) şeması
-- Supabase Dashboard > SQL Editor içinde BİR KEZ çalıştırın.
-- Mevcut "harcamalar" tablosuna dokunmaz; yalnızca yeni tablolar ekler.

-- Admin kullanıcı: Authentication > Users bölümünde bu e-posta ile oluşturulur.
-- Giriş ekranında "admin" yazılınca arka planda admin@ralazaba.app kullanılır.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'admin@ralazaba.app';
$$;

create table if not exists tatiller (
  id uuid primary key default gen_random_uuid(),
  ad text not null,
  baslangic date,
  bitis date,
  aciklama text,
  created_at timestamptz not null default now()
);

create table if not exists fisler (
  id uuid primary key default gen_random_uuid(),
  tatil_id uuid not null references tatiller(id) on delete cascade,
  market text not null,
  tarih date not null default current_date,
  toplam numeric(12,2) not null check (toplam >= 0),
  foto_yolu text,
  not_metni text,
  created_at timestamptz not null default now()
);

create table if not exists fis_kalemleri (
  id uuid primary key default gen_random_uuid(),
  fis_id uuid not null references fisler(id) on delete cascade,
  urun text not null,
  miktar numeric(12,3) not null default 1 check (miktar >= 0),
  birim text not null default 'adet',
  fiyat numeric(12,2) check (fiyat is null or fiyat >= 0)
);

create table if not exists tatil_notlari (
  id uuid primary key default gen_random_uuid(),
  tatil_id uuid not null references tatiller(id) on delete cascade,
  tarih date not null default current_date,
  metin text not null,
  created_at timestamptz not null default now()
);

-- Tatil sonunda artan / kalan ürünler
create table if not exists kalan_urunler (
  id uuid primary key default gen_random_uuid(),
  tatil_id uuid not null references tatiller(id) on delete cascade,
  urun text not null,
  miktar numeric(12,3) not null default 0 check (miktar >= 0),
  birim text not null default 'adet',
  created_at timestamptz not null default now()
);

create index if not exists fisler_tatil_idx on fisler(tatil_id);
create index if not exists fis_kalemleri_fis_idx on fis_kalemleri(fis_id);
create index if not exists tatil_notlari_tatil_idx on tatil_notlari(tatil_id);
create index if not exists kalan_urunler_tatil_idx on kalan_urunler(tatil_id);

-- Satır güvenliği: yalnızca admin okuyabilir/yazabilir (anon erişim YOK).
alter table tatiller enable row level security;
alter table fisler enable row level security;
alter table fis_kalemleri enable row level security;
alter table tatil_notlari enable row level security;
alter table kalan_urunler enable row level security;

create policy "admin tatiller" on tatiller
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin fisler" on fisler
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin fis_kalemleri" on fis_kalemleri
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin tatil_notlari" on tatil_notlari
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin kalan_urunler" on kalan_urunler
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Fiş fotoğrafları için özel (private) depolama alanı
insert into storage.buckets (id, name, public)
values ('fisler', 'fisler', false)
on conflict (id) do nothing;

create policy "admin fis foto okuma" on storage.objects
  for select to authenticated
  using (bucket_id = 'fisler' and public.is_admin());
create policy "admin fis foto yukleme" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'fisler' and public.is_admin());
create policy "admin fis foto silme" on storage.objects
  for delete to authenticated
  using (bucket_id = 'fisler' and public.is_admin());
