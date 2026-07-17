import {brands as fallbackBrands,categories as fallbackCategories,products as fallbackProducts,slugify} from './catalog';
import {SUPABASE_KEY,SUPABASE_URL,isSupabaseConfigured} from './supabase';

const headers=()=>({apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`});

async function rest(path){
 if(!isSupabaseConfigured)return null;
 try{
  const response=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{headers:headers(),cache:'no-store'});
  if(!response.ok)throw new Error(`Supabase ${response.status}`);
  return await response.json();
 }catch(error){
  console.error('Supabase catalog fallback:',error.message);
  return null;
 }
}

export function mapProduct(row){
 const gallery=(row.product_images||[]).slice().sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
 const primary=gallery.find(image=>image.is_primary)||gallery[0];
 const image=row.main_image_url||primary?.url||null;
 const brand=row.brands?.name||row.brand||'Koku Vitrini';
 return {
  id:row.id,slug:row.slug,name:row.name,brand,brandSlug:row.brands?.slug||slugify(brand),
  categorySlug:row.categories?.slug||null,gender:row.gender,family:row.family,size:row.size,
  price:Number(row.price||0),oldPrice:Number(row.old_price??row.price??0),currency:row.currency||'TRY',
  stock:Number(row.stock||0),badge:row.badge||'',color:row.color||'#77756d',rating:Number(row.rating||0),
  notes:row.notes||[],short:row.short_description||row.short||'',description:row.description||'',
  intensity:row.intensity||'Orta',longevity:row.longevity||null,sillage:row.sillage||null,
  sku:row.sku||null,gtin:row.gtin||null,mpn:row.mpn||null,image,
  imageAlt:row.image_alt||primary?.alt_text||`${brand} ${row.name} ${row.size}`,
  images:gallery.map(item=>({id:item.id,url:item.url,alt:item.alt_text||`${brand} ${row.name}`,width:item.width,height:item.height,isPrimary:item.is_primary})),
  metaTitle:row.meta_title||null,metaDescription:row.meta_description||null,status:row.status||'published',
  isFeatured:Boolean(row.is_featured),sortOrder:Number(row.sort_order||0),updatedAt:row.updated_at||null,
  finder:{notes:row.notes||[],seasons:row.seasons||[],occasions:row.occasions||[],intensity:row.intensity||'Orta'}
 };
}

export async function getProducts(){
 const select=encodeURIComponent('*,brands(name,slug),categories(name,slug),product_images(id,url,alt_text,sort_order,is_primary,width,height)');
 const rows=await rest(`products?select=${select}&status=eq.published&order=is_featured.desc,sort_order.asc,created_at.desc`);
 return rows?.length?rows.map(mapProduct):fallbackProducts;
}

export async function getProductBySlug(slug){
 const select=encodeURIComponent('*,brands(name,slug),categories(name,slug),product_images(id,url,alt_text,sort_order,is_primary,width,height)');
 const rows=await rest(`products?select=${select}&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`);
 if(rows?.length)return mapProduct(rows[0]);
 return fallbackProducts.find(product=>product.slug===slug)||null;
}

export async function getBrands(){
 const rows=await rest('brands?select=*&is_active=eq.true&order=sort_order.asc,name.asc');
 return rows?.length?rows.map(row=>({id:row.id,slug:row.slug,name:row.name,copy:row.description||'',logo:row.logo_url||null,cover:row.cover_image_url||null,metaTitle:row.meta_title,metaDescription:row.meta_description})):fallbackBrands;
}

export async function getCategories(){
 const rows=await rest('categories?select=*&is_active=eq.true&order=sort_order.asc,name.asc');
 if(!rows?.length)return fallbackCategories;
 return rows.map(row=>{const fallback=fallbackCategories.find(item=>item.slug===row.slug);return{id:row.id,slug:row.slug,name:row.name,short:fallback?.short||row.description,gender:fallback?.gender||({'erkek-parfumleri':'Erkek','kadin-parfumleri':'Kadın','unisex-parfumler':'Unisex','parfum-setleri':'Set'}[row.slug]),image:row.image_url||null,meta:row.description||row.meta_description||'',metaTitle:row.meta_title,metaDescription:row.meta_description}});
}

export async function getCatalog(){
 const [products,brands,categories]=await Promise.all([getProducts(),getBrands(),getCategories()]);
 return {products,brands,categories};
}
