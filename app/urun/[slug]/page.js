import {notFound} from 'next/navigation';
import {Check,Clock,GitCompareArrows,PackageCheck,ShieldCheck,Star,Truck} from 'lucide-react';
import Breadcrumbs from '../../../components/Breadcrumbs';
import ProductGallery from '../../../components/ProductGallery';
import AddToCart from '../../../components/AddToCart';
import FavoriteButton from '../../../components/FavoriteButton';
import ProductCard from '../../../components/ProductCard';
import {getFinderProfile,money,SITE_URL,slugify,WHATSAPP} from '../../../lib/catalog';
import {getProductBySlug,getProducts} from '../../../lib/catalog-data';

export const dynamic='force-dynamic';
export const dynamicParams=true;

export async function generateStaticParams(){const products=await getProducts();return products.map(product=>({slug:product.slug}))}

export async function generateMetadata({params}){
 const {slug}=await params,product=await getProductBySlug(slug);
 if(!product)return{};
 const title=product.metaTitle||`${product.name} ${product.brand} ${product.size} ${product.gender} Parfüm`;
 const description=product.metaDescription||`${product.name} ${product.brand} ${product.size}: ${product.short} Notaları, kullanım önerileri ve güncel fiyatını inceleyin.`;
 const images=(product.images?.length?product.images:[product.image&&{url:product.image,alt:product.imageAlt}]).filter(Boolean).map(image=>({url:image.url,alt:image.alt||product.imageAlt||title}));
 return {title,description,keywords:[product.brand,product.name,product.family,...(product.notes||[])],alternates:{canonical:`/urun/${slug}`},openGraph:{title,description,type:'website',url:`/urun/${slug}`,...(images.length?{images}:{})},twitter:{card:'summary_large_image',title,description,...(images.length?{images:images.map(image=>image.url)}:{})}};
}

export default async function Page({params}){
 const {slug}=await params,[product,products]=await Promise.all([getProductBySlug(slug),getProducts()]);
 if(!product)notFound();
 const profile=getFinderProfile(product);
 const related=products.filter(item=>item.slug!==product.slug&&(item.brand===product.brand||item.family===product.family)).slice(0,4);
 const images=(product.images?.length?product.images.map(image=>image.url):[product.image]).filter(Boolean);
 const schema={"@context":"https://schema.org","@type":"Product","@id":`${SITE_URL}/urun/${product.slug}#product`,"name":`${product.name} ${product.brand} ${product.size} ${product.gender} Parfüm`,"description":product.description,"url":`${SITE_URL}/urun/${product.slug}`,...(product.sku?{"sku":product.sku}:{}),...(product.gtin?{"gtin":product.gtin}:{}),...(product.mpn?{"mpn":product.mpn}:{}),...(images.length?{"image":images}:{}),"brand":{"@type":"Brand","name":product.brand},"category":`${product.gender} Parfüm`,"size":product.size,"additionalProperty":[{"@type":"PropertyValue","name":"Koku ailesi","value":product.family},{"@type":"PropertyValue","name":"Yoğunluk","value":product.intensity||profile.intensity},...product.notes.map(note=>({"@type":"PropertyValue","name":"Koku notası","value":note}))],"offers":{"@type":"Offer","url":`${SITE_URL}/urun/${product.slug}`,"priceCurrency":"TRY","price":product.price,"availability":product.stock>0?'https://schema.org/InStock':'https://schema.org/OutOfStock',"itemCondition":"https://schema.org/NewCondition","seller":{"@type":"Organization","name":"Koku Vitrini"},"shippingDetails":{"@type":"OfferShippingDetails","shippingDestination":{"@type":"DefinedRegion","addressCountry":"TR"},"deliveryTime":{"@type":"ShippingDeliveryTime","handlingTime":{"@type":"QuantitativeValue","minValue":0,"maxValue":1,"unitCode":"DAY"},"transitTime":{"@type":"QuantitativeValue","minValue":1,"maxValue":3,"unitCode":"DAY"}}}}};
 const categoryUrl=product.categorySlug?`/${product.categorySlug}`:product.gender==='Erkek'?'/erkek-parfumleri':product.gender==='Kadın'?'/kadin-parfumleri':product.gender==='Set'?'/parfum-setleri':'/unisex-parfumler';
 return <main>
  <div className="product-page-wrap"><Breadcrumbs items={[{name:product.gender==='Set'?'Parfüm Setleri':`${product.gender} Parfümler`,url:categoryUrl},{name:product.name,url:`/urun/${product.slug}`}]} /><div className="product-detail"><ProductGallery product={product}/><div className="detail-copy"><a className="detail-brand" href={`/marka/${product.brandSlug||slugify(product.brand)}`}>{product.brand}</a><h1>{product.name} <small>{product.size} {product.gender} Parfüm</small></h1>{product.rating>0&&<div className="detail-rating"><span>{[1,2,3,4,5].map(item=><Star key={item} fill="currentColor"/>)}</span><b>{product.rating}</b><small>Editör koku profili puanı</small></div>}<p className="lead">{product.short}</p><div className="detail-facts"><span><small>KOKU AİLESİ</small><b>{product.family}</b></span><span><small>KOKU YOĞUNLUĞU</small><b>{product.intensity||profile.intensity}</b></span><span><small>STOK</small><b>{product.stock>0?`${product.stock} adet`:'Tükendi'}</b></span></div><div className="detail-price"><b>{money(product.price)}</b>{product.oldPrice>product.price&&<><del>{money(product.oldPrice)}</del><span>%{Math.round((1-product.price/product.oldPrice)*100)} indirim</span></>}</div><AddToCart product={product} label="Sepete ekle"/><div className="detail-save-tools"><FavoriteButton product={product}/><a href={`/karsilastir?urun=${product.slug}`}><GitCompareArrows/> Karşılaştırmaya ekle</a></div><a className="direct-whatsapp" target="_blank" rel="noreferrer" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Merhaba, ${product.name} ${product.size} hakkında bilgi almak istiyorum.`)}`}>WhatsApp’tan bilgi al</a><div className="detail-trust"><span><Truck/><b>1–3 iş gününde gönderim</b></span><span><ShieldCheck/><b>Güvenli sipariş desteği</b></span><span><PackageCheck/><b>Özenli paketleme</b></span></div></div></div></div>
  <section className="product-content"><div><p className="eyebrow">KOKU HİKÂYESİ</p><h2>{product.name} – {product.family} Koku Karakteri</h2><p>{product.description}</p><p>Parfümün tende gelişimi, uygulanan miktara, ten yapısına ve hava koşullarına göre değişebilir. En iyi deneyim için temiz tene ve nabız noktalarına uygulayın.</p></div><aside><h3>Öne Çıkan Notalar</h3>{product.notes.map((note,index)=><span key={note}><b>0{index+1}</b>{note}</span>)}</aside></section>
  <section className="usage-section"><div><Clock/><h3>Ne zaman kullanılır?</h3><p>{profile.seasons.length?`${profile.seasons.join(', ')} mevsimlerinde; ${profile.occasions.join(', ').toLocaleLowerCase('tr')} kullanımı için uygun bir karakter sunar.`:'Ürün profili tamamlandığında mevsim ve kullanım önerileri burada gösterilir.'}</p></div><div><Check/><h3>Kimler için uygun?</h3><p>{product.gender==='Unisex'?'Koku seçiminde cinsiyet sınırı aramayan, karakterli ve dengeli parfümleri sevenler için.':product.gender==='Set'?'Farklı kokuları denemek veya şık bir parfüm hediyesi vermek isteyenler için.':`${product.gender} parfümlerinde ${product.family.toLocaleLowerCase('tr')} ve dikkat çekici karakter arayanlar için.`}</p></div></section>
  {related.length>0&&<section className="home-section related"><div className="section-title"><div><p className="eyebrow">BUNLARI DA SEVEBİLİRSİN</p><h2>Benzer kokular</h2></div></div><div className="product-grid">{related.map(item=><ProductCard key={item.slug} product={item}/>)}</div></section>}
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
 </main>;
}
