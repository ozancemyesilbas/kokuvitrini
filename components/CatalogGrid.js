'use client';
import {useEffect,useMemo,useState} from 'react';
import {Search,SlidersHorizontal} from 'lucide-react';
import ProductCard from './ProductCard';
export default function CatalogGrid({items}){
 const [q,setQ]=useState(''),[sort,setSort]=useState('featured'),[family,setFamily]=useState('Tümü'),[brand,setBrand]=useState('Tümü'),[availability,setAvailability]=useState('Tümü');
 useEffect(()=>{const initial=new URLSearchParams(window.location.search).get('q');if(initial)setQ(initial)},[]);
 const families=['Tümü',...new Set(items.map(product=>product.family).filter(Boolean))],brands=['Tümü',...new Set(items.map(product=>product.brand).filter(Boolean))];
 const shown=useMemo(()=>{let result=items.filter(product=>{
  const haystack=`${product.name} ${product.brand} ${product.family} ${(product.notes||[]).join(' ')}`.toLocaleLowerCase('tr');
  return haystack.includes(q.toLocaleLowerCase('tr'))&&(family==='Tümü'||product.family===family)&&(brand==='Tümü'||product.brand===brand)&&(availability==='Tümü'||(availability==='Stokta'?product.stock>0:product.stock===0));
 });
 if(sort==='low')result=[...result].sort((a,b)=>a.price-b.price);if(sort==='high')result=[...result].sort((a,b)=>b.price-a.price);if(sort==='rating')result=[...result].sort((a,b)=>(b.rating||0)-(a.rating||0));if(sort==='new')result=[...result].sort((a,b)=>(b.sortOrder||0)-(a.sortOrder||0));return result;
 },[items,q,sort,family,brand,availability]);
 const reset=()=>{setQ('');setFamily('Tümü');setBrand('Tümü');setAvailability('Tümü');setSort('featured')};
 return <><div className="catalog-tools"><label><Search/><input value={q} onChange={event=>setQ(event.target.value)} placeholder="Ürün, marka veya nota ara"/></label><label><SlidersHorizontal/><select aria-label="Koku ailesi" value={family} onChange={event=>setFamily(event.target.value)}>{families.map(item=><option key={item}>{item}</option>)}</select></label><select aria-label="Marka" value={brand} onChange={event=>setBrand(event.target.value)}>{brands.map(item=><option key={item}>{item}</option>)}</select><select aria-label="Stok durumu" value={availability} onChange={event=>setAvailability(event.target.value)}><option>Tümü</option><option>Stokta</option><option>Tükendi</option></select><select aria-label="Sıralama" value={sort} onChange={event=>setSort(event.target.value)}><option value="featured">Önerilen sıralama</option><option value="new">Vitrin sırası</option><option value="low">Fiyat: Artan</option><option value="high">Fiyat: Azalan</option><option value="rating">En yüksek puan</option></select><span>{shown.length} ürün</span></div><div className="product-grid">{shown.map(product=><ProductCard key={product.slug} product={product}/>)}</div>{!shown.length&&<div className="no-result"><h3>Ürün bulunamadı</h3><p>Arama veya filtre seçiminizi değiştirin.</p><button type="button" onClick={reset}>Filtreleri temizle</button></div>}</>;
}
