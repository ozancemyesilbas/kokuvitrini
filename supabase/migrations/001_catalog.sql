create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '',
  logo_url text,
  meta_title text,
  meta_description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '',
  meta_title text,
  meta_description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  brand_id uuid references public.brands(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  gender text not null check (gender in ('Erkek','Kadın','Unisex','Set')),
  family text not null,
  size text not null,
  price numeric(12,2) not null check (price >= 0),
  old_price numeric(12,2) check (old_price is null or old_price >= 0),
  currency text not null default 'TRY' check (currency = 'TRY'),
  stock integer not null default 0 check (stock >= 0),
  badge text,
  color text not null default '#77756d',
  short_description text not null,
  description text not null,
  notes text[] not null default '{}',
  seasons text[] not null default '{}',
  occasions text[] not null default '{}',
  intensity text not null default 'Orta',
  longevity text,
  sillage text,
  sku text unique,
  gtin text unique,
  mpn text,
  main_image_url text,
  image_alt text,
  meta_title text,
  meta_description text,
  search_keywords text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt_text text not null,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  created_at timestamptz not null default now()
);

create unique index if not exists product_images_one_primary
  on public.product_images(product_id) where is_primary;
create index if not exists products_status_sort_idx
  on public.products(status, is_featured desc, sort_order, created_at desc);
create index if not exists products_brand_idx on public.products(brand_id);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_notes_gin_idx on public.products using gin(notes);
create index if not exists products_seasons_gin_idx on public.products using gin(seasons);
create index if not exists products_occasions_gin_idx on public.products using gin(occasions);
create index if not exists product_images_product_idx
  on public.product_images(product_id, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists brands_set_updated_at on public.brands;
create trigger brands_set_updated_at before update on public.brands
for each row execute function public.set_updated_at();

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;

drop policy if exists "Users can read own admin status" on public.admin_users;
create policy "Users can read own admin status"
on public.admin_users for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Public can read active brands" on public.brands;
create policy "Public can read active brands"
on public.brands for select to anon, authenticated
using (is_active or public.is_admin());

drop policy if exists "Admins manage brands" on public.brands;
create policy "Admins manage brands"
on public.brands for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories for select to anon, authenticated
using (is_active or public.is_admin());

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
on public.categories for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read published products" on public.products;
create policy "Public can read published products"
on public.products for select to anon, authenticated
using (status = 'published' or public.is_admin());

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
on public.products for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read published product images" on public.product_images;
create policy "Public can read published product images"
on public.product_images for select to anon, authenticated
using (
  public.is_admin() or exists (
    select 1 from public.products
    where products.id = product_images.product_id
      and products.status = 'published'
  )
);

drop policy if exists "Admins manage product images" on public.product_images;
create policy "Admins manage product images"
on public.product_images for all to authenticated
using (public.is_admin()) with check (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.brands, public.categories, public.products, public.product_images
  to anon, authenticated;
grant insert, update, delete on public.brands, public.categories, public.products, public.product_images
  to authenticated;
grant select on public.admin_users to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp','image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view product image files" on storage.objects;
create policy "Public can view product image files"
on storage.objects for select to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists "Admins upload product image files" on storage.objects;
create policy "Admins upload product image files"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins update product image files" on storage.objects;
create policy "Admins update product image files"
on storage.objects for update to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins delete product image files" on storage.objects;
create policy "Admins delete product image files"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images' and public.is_admin());

insert into public.categories (name, slug, description, meta_title, meta_description, sort_order)
values
  ('Erkek Parfümleri','erkek-parfumleri','Erkekler için seçkin parfüm koleksiyonu','Erkek Parfümleri','Kalıcı ve karakterli erkek parfümlerini keşfedin.',1),
  ('Kadın Parfümleri','kadin-parfumleri','Kadınlar için seçkin parfüm koleksiyonu','Kadın Parfümleri','Çiçeksi, meyvemsi ve zarif kadın parfümlerini keşfedin.',2),
  ('Unisex Parfümler','unisex-parfumler','Kadın ve erkek kullanımına uygun kokular','Unisex Parfümler','Modern ve kalıcı unisex parfümleri keşfedin.',3),
  ('Parfüm Setleri','parfum-setleri','Hediye ve keşif parfüm setleri','Parfüm Setleri','Hediye etmeye hazır parfüm ve keşif setlerini inceleyin.',4)
on conflict (slug) do nothing;
