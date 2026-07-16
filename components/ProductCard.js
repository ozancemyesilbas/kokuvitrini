import {GitCompareArrows,Star} from 'lucide-react';
import ProductVisual from './ProductVisual';
import AddToCart from './AddToCart';
import FavoriteButton from './FavoriteButton';
import {money,slugify} from '../lib/catalog';

export default function ProductCard({product}){return <article className="product-card"><div className="card-visual"><a className="card-visual-link" href={`/urun/${product.slug}`}><span className="product-badge">{product.badge}</span><ProductVisual product={product}/></a><FavoriteButton product={product} compact/></div><div className="card-copy"><a className="card-brand" href={`/marka/${slugify(product.brand)}`}>{product.brand}</a><h3><a href={`/urun/${product.slug}`}>{product.name}</a> <small>{product.size}</small></h3><p>{product.short}</p><div className="card-rating"><Star fill="currentColor"/><span>{product.rating?`${product.rating} editör puanı`:'Koku profili hazır'}</span></div><div className="card-price"><b>{money(product.price)}</b>{product.oldPrice>product.price&&<del>{money(product.oldPrice)}</del>}</div><div className="card-secondary"><a href={`/karsilastir?urun=${product.slug}`}><GitCompareArrows/> Karşılaştır</a><FavoriteButton product={product}/></div><AddToCart product={product}/></div></article>}
