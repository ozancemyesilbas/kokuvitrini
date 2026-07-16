'use client';
import {useCallback,useEffect,useState} from 'react';
import {Heart,History} from 'lucide-react';
import ProductCard from './ProductCard';

export default function SavedProducts({items}){
 const [favorites,setFavorites]=useState([]),[recent,setRecent]=useState([]),[ready,setReady]=useState(false);
 const load=useCallback(()=>{try{setFavorites(JSON.parse(localStorage.getItem('kv-favorites')||'[]'));setRecent(JSON.parse(localStorage.getItem('kv-recent')||'[]'))}catch{}setReady(true)},[]);
 useEffect(()=>{load();window.addEventListener('kv-saved-change',load);return()=>window.removeEventListener('kv-saved-change',load)},[load]);
 const pick=slugs=>slugs.map(slug=>items.find(p=>p.slug===slug)).filter(Boolean);
 if(!ready)return <div className="saved-loading">Kaydedilen kokular hazırlanıyor…</div>;
 return <div className="saved-wrap">
  <section><div className="saved-title"><Heart/><div><p className="eyebrow">KAYDETTİKLERİNİZ</p><h2>Favori parfümlerim</h2></div></div>{favorites.length?<div className="product-grid">{pick(favorites).map(p=><ProductCard key={p.slug} product={p}/>)}</div>:<div className="saved-empty"><Heart/><h3>Henüz favoriniz yok</h3><p>Ürün kartlarındaki kalp simgesine dokunarak kokuları burada saklayabilirsiniz.</p><a className="primary-button" href="/parfumler">Parfümleri keşfet</a></div>}</section>
  {recent.length>0&&<section><div className="saved-title"><History/><div><p className="eyebrow">GEÇMİŞİNİZ</p><h2>Son görüntülenenler</h2></div></div><div className="product-grid">{pick(recent).slice(0,4).map(p=><ProductCard key={p.slug} product={p}/>)}</div></section>}
 </div>
}
