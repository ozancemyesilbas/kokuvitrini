'use client';
import {Bell,ShoppingBag} from 'lucide-react';
import {useStore} from './StoreProvider';
import {WHATSAPP} from '../lib/catalog';
export default function AddToCart({product,label='Sepete ekle'}){const {add}=useStore();if(product.stock<=0){const text=`Merhaba, ${product.brand} ${product.name} ${product.size} yeniden stoğa geldiğinde bilgi almak istiyorum.`;return <a className="add-button stock-notify" target="_blank" rel="noreferrer" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`}>Stok gelince haber ver <Bell/></a>}return <button className="add-button" onClick={()=>add(product)}>{label}<ShoppingBag/></button>}
