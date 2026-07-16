import {Star} from 'lucide-react';
import ProductVisual from './ProductVisual';
import AddToCart from './AddToCart';
import {money} from '../lib/catalog';
export default function ProductCard({product}){return <article className="product-card"><a className="card-visual" href={`/urun/${product.slug}`}><span className="product-badge">{product.badge}</span><ProductVisual product={product}/></a><div className="card-copy"><a className="card-brand" href={`/marka/${product.brand.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/[^a-z0-9]+/g,'-')}`}>{product.brand}</a><h3><a href={`/urun/${product.slug}`}>{product.name}</a> <small>{product.size}</small></h3><p>{product.short}</p><div className="card-rating"><Star fill="currentColor"/><span>{product.rating} editör puanı</span></div><div className="card-price"><b>{money(product.price)}</b><del>{money(product.oldPrice)}</del></div><AddToCart product={product}/></div></article>}
