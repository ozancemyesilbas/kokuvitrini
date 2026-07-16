'use client';
import {useEffect,useState} from 'react';
import {Heart} from 'lucide-react';

export default function FavoriteButton({product,compact=false}){
 const [active,setActive]=useState(false);
 useEffect(()=>{const sync=()=>{try{setActive(JSON.parse(localStorage.getItem('kv-favorites')||'[]').includes(product.slug))}catch{}};sync();window.addEventListener('kv-saved-change',sync);return()=>window.removeEventListener('kv-saved-change',sync)},[product.slug]);
 const toggle=event=>{event.preventDefault();event.stopPropagation();let next=[];try{const current=JSON.parse(localStorage.getItem('kv-favorites')||'[]');next=current.includes(product.slug)?current.filter(x=>x!==product.slug):[product.slug,...current]}catch{next=[product.slug]}localStorage.setItem('kv-favorites',JSON.stringify(next));setActive(next.includes(product.slug));window.dispatchEvent(new Event('kv-saved-change'))};
 return <button type="button" className={`favorite-button${active?' active':''}${compact?' compact':''}`} onClick={toggle} aria-label={active?'Favorilerden çıkar':'Favorilere ekle'} title={active?'Favorilerden çıkar':'Favorilere ekle'}><Heart fill={active?'currentColor':'none'}/>{!compact&&<span>{active?'Favorilerde':'Favoriye ekle'}</span>}</button>
}
