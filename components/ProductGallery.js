'use client';
import {useEffect,useState} from 'react';
import {Maximize2} from 'lucide-react';
import ProductVisual from './ProductVisual';

export default function ProductGallery({product}){
 const images=product.images?.length?product.images:(product.image?[{url:product.image,alt:product.imageAlt}]:[]);
 const [active,setActive]=useState(0),[zoom,setZoom]=useState(false);
 useEffect(()=>{if(!zoom)return;const onKey=e=>e.key==='Escape'&&setZoom(false);document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey)},[zoom]);
 if(!images.length)return <div className="detail-visual"><span className="detail-badge">{product.badge}</span><ProductVisual product={product} large/></div>;
 const selected=images[active]||images[0];
 return <div className="product-gallery">
  <div className="gallery-main"><span className="detail-badge">{product.badge}</span><img src={selected.url} alt={selected.alt||product.imageAlt} width={selected.width||1000} height={selected.height||1000}/><button type="button" onClick={()=>setZoom(true)} aria-label="Ürün fotoğrafını büyüt"><Maximize2/></button></div>
  {images.length>1&&<div className="gallery-thumbs">{images.map((image,index)=><button type="button" className={active===index?'active':''} onClick={()=>setActive(index)} key={image.id||image.url}><img src={image.url} alt={image.alt||`${product.name} görsel ${index+1}`} width="120" height="120"/></button>)}</div>}
  {zoom&&<div className="gallery-zoom" role="dialog" aria-modal="true" aria-label={`${product.name} büyütülmüş ürün görseli`} onClick={event=>event.target===event.currentTarget&&setZoom(false)}><button type="button" onClick={()=>setZoom(false)} aria-label="Büyütülmüş görseli kapat">×</button><img src={selected.url} alt={selected.alt||product.imageAlt}/></div>}
 </div>
}
