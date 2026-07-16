'use client';
import {useEffect,useMemo,useState} from 'react';
import {GitCompareArrows,MessageCircle,X} from 'lucide-react';
import ProductVisual from './ProductVisual';
import {getFinderProfile,money,WHATSAPP} from '../lib/catalog';

export default function ProductCompare({items}){
 const [selected,setSelected]=useState(['','','']);
 useEffect(()=>{const slug=new URLSearchParams(window.location.search).get('urun');if(slug&&items.some(p=>p.slug===slug))setSelected([slug,'',''])},[items]);
 const products=useMemo(()=>selected.map(slug=>items.find(p=>p.slug===slug)||null),[selected,items]);
 const update=(index,value)=>setSelected(current=>current.map((x,i)=>i===index?value:x));
 const available=index=>items.filter(p=>!selected.includes(p.slug)||selected[index]===p.slug);
 const chosen=products.filter(Boolean);
 const text=['Merhaba, şu parfümleri karşılaştırıyorum:','',...chosen.map(p=>`• ${p.brand} ${p.name} ${p.size}`),'','Hangisini önerirsiniz?'].join('\n');
 return <div className="compare-wrap">
  <div className="compare-selectors">{selected.map((slug,index)=><label key={index}><span>{index+1}. parfüm</span><select value={slug} onChange={event=>update(index,event.target.value)}><option value="">Parfüm seçin</option>{available(index).map(p=><option key={p.slug} value={p.slug}>{p.brand} — {p.name}</option>)}</select>{slug&&<button onClick={()=>update(index,'')} aria-label="Seçimi kaldır"><X/></button>}</label>)}</div>
  {chosen.length<2?<div className="compare-empty"><GitCompareArrows/><h2>Karşılaştırmak için en az iki parfüm seçin</h2><p>Nota, mevsim, yoğunluk, fiyat ve kullanım alanlarını yan yana inceleyin.</p></div>:<><div className="compare-table" style={{'--compare-count':chosen.length}}><div className="compare-row compare-products"><b>ÜRÜNLER</b>{chosen.map(p=><div key={p.slug}><ProductVisual product={p}/><a href={`/urun/${p.slug}`}>{p.brand}<strong>{p.name}</strong><small>{p.size}</small></a></div>)}</div><CompareRow label="Fiyat" products={chosen} value={p=>money(p.price)}/><CompareRow label="Koku ailesi" products={chosen} value={p=>p.family}/><CompareRow label="Öne çıkan notalar" products={chosen} value={p=>getFinderProfile(p).notes.join(', ')}/><CompareRow label="Mevsim" products={chosen} value={p=>getFinderProfile(p).seasons.join(', ')}/><CompareRow label="Kullanım" products={chosen} value={p=>getFinderProfile(p).occasions.join(', ')}/><CompareRow label="Yoğunluk" products={chosen} value={p=>getFinderProfile(p).intensity}/><CompareRow label="Stok" products={chosen} value={p=>p.stock>0?`${p.stock} adet`:'Tükendi'}/></div><a className="compare-whatsapp" target="_blank" rel="noreferrer" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`}><MessageCircle/> Bu ürünleri WhatsApp’tan danış</a></>}
 </div>
}

function CompareRow({label,products,value}){return <div className="compare-row"><b>{label}</b>{products.map(p=><span key={p.slug}>{value(p)}</span>)}</div>}
