'use client';
import {ShoppingBag} from 'lucide-react';
import {useStore} from './StoreProvider';
export default function AddToCart({product,label='Sepete ekle'}){const {add}=useStore();return <button className="add-button" onClick={()=>add(product)}>{label}<ShoppingBag/></button>}
