-- Marka ve kategori görselleri
-- Supabase SQL Editor içinde bir kez çalıştırılabilir.
alter table public.brands
  add column if not exists cover_image_url text;

alter table public.categories
  add column if not exists image_url text;
