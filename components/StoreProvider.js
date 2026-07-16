'use client';
import {createContext,useContext,useEffect,useState} from 'react';
import {Minus,Plus,ShoppingBag,X} from 'lucide-react';
import {money,WHATSAPP} from '../lib/catalog';

const StoreContext=createContext(null);
export const useStore=()=>useContext(StoreContext);

export default function StoreProvider({children}){
 const [cart,setCart]=useState([]),[open,setOpen]=useState(false);
 useEffect(()=>{try{setCart(JSON.parse(localStorage.getItem('kv-cart')||'[]'))}catch{}},[]);
 useEffect(()=>{localStorage.setItem('kv-cart',JSON.stringify(cart))},[cart]);
 const add=p=>{setCart(c=>{const x=c.find(i=>i.slug===p.slug);return x?c.map(i=>i.slug===p.slug?{...i,qty:i.qty+1}:i):[...c,{...p,qty:1}]});setOpen(true)};
 const qty=(slug,d)=>setCart(c=>c.map(i=>i.slug===slug?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0));
 const count=cart.reduce((s,i)=>s+i.qty,0),total=cart.reduce((s,i)=>s+i.price*i.qty,0);
 const orderText=['Merhaba, Koku Vitrini siparişimi tamamlamak istiyorum:','',...cart.map(i=>`• ${i.name} (${i.size}) × ${i.qty} — ${money(i.price*i.qty)}`),'',`Toplam: ${money(total)}`].join('\n');
 return <StoreContext.Provider value={{cart,add,qty,count,total,setOpen}}>{children}{open&&<div className="drawer-overlay" onClick={()=>setOpen(false)}><aside className="cart-drawer" onClick={e=>e.stopPropagation()}><div className="drawer-title"><div><small>ALIŞVERİŞ SEPETİ</small><h2>Sepetim ({count})</h2></div><button onClick={()=>setOpen(false)} aria-label="Sepeti kapat"><X/></button></div>{!cart.length?<div className="empty-cart"><ShoppingBag/><h3>Sepetin henüz boş</h3><p>Vitrindeki seçkin kokuları keşfetmeye başla.</p><button onClick={()=>setOpen(false)}>Alışverişe devam et</button></div>:<><div className="drawer-items">{cart.map(i=><div className="drawer-item" key={i.slug}><div className="mini-bottle" style={{'--tone':i.color}}><span>{i.name.charAt(0)}</span></div><div><a href={`/urun/${i.slug}`}>{i.name}</a><small>{i.brand} · {i.size}</small><b>{money(i.price)}</b><div className="quantity"><button onClick={()=>qty(i.slug,-1)}><Minus/></button><span>{i.qty}</span><button onClick={()=>qty(i.slug,1)}><Plus/></button></div></div></div>)}</div><div className="drawer-bottom"><div><span>Ara toplam</span><b>{money(total)}</b></div><a className="whatsapp-order" target="_blank" rel="noreferrer" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(orderText)}`}>WhatsApp ile siparişi tamamla</a><p>Temsilcimiz stok ve teslimat bilgisi için sizinle iletişime geçer.</p></div></>}</aside></div>}</StoreContext.Provider>
}
