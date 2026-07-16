'use client';
import {Heart,Menu,Search,ShoppingBag,X} from 'lucide-react';
import {useState} from 'react';
import {useStore} from './StoreProvider';
import {products} from '../lib/catalog';

export default function Header(){
 const {count,setOpen}=useStore();
 const [menu,setMenu]=useState(false),[search,setSearch]=useState(false),[q,setQ]=useState('');
 const results=q.length>1?products.filter(p=>(p.name+' '+p.brand+' '+p.family+' '+p.notes.join(' ')).toLocaleLowerCase('tr').includes(q.toLocaleLowerCase('tr'))).slice(0,6):[];
 return <>
  <div className="announcement">Türkiye’nin her yerine hızlı gönderim <span>•</span> Sipariş desteği: +90 538 285 11 39</div>
  <header className="site-header">
   <button className="menu-toggle" onClick={()=>setMenu(!menu)} aria-label="Menü">{menu?<X/>:<Menu/>}</button>
   <a className="brand-logo" href="/">KOKU <i>VİTRİNİ</i><small>PARFÜMERİ</small></a>
   <nav className={menu?'nav-open':''}><a href="/parfumler">Tüm Parfümler</a><a href="/erkek-parfumleri">Erkek</a><a href="/kadin-parfumleri">Kadın</a><a href="/unisex-parfumler">Unisex</a><a href="/parfum-setleri">Setler</a><a href="/markalar">Markalar</a><a className="finder-nav" href="/koku-bulucu">Koku Bulucu</a><a href="/parfum-rehberi">Rehber</a></nav>
   <div className="header-actions"><button onClick={()=>setSearch(true)} aria-label="Ara"><Search/></button><a href="/favoriler" aria-label="Favorilerim"><Heart/></a><button onClick={()=>setOpen(true)} aria-label="Sepet"><ShoppingBag/><b>{count}</b></button></div>
  </header>
  {search&&<div className="search-modal"><div className="search-box"><Search/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Parfüm, marka veya koku ailesi ara..."/><button onClick={()=>setSearch(false)} aria-label="Aramayı kapat"><X/></button></div><div className="search-results">{q.length>1&&!results.length&&<p>Aramanızla eşleşen ürün bulunamadı.</p>}{results.map(p=><a key={p.slug} href={`/urun/${p.slug}`}><span className="search-dot" style={{background:p.color}}/><div><b>{p.name}</b><small>{p.brand} · {p.size}</small></div></a>)}</div></div>}
 </>
}
