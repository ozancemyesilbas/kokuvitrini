import {notFound} from 'next/navigation';
import Breadcrumbs from '../../../components/Breadcrumbs';
import CatalogGrid from '../../../components/CatalogGrid';
import {SITE_URL} from '../../../lib/catalog';
import {getBrands,getProducts} from '../../../lib/catalog-data';

export const dynamic='force-dynamic';
export const dynamicParams=true;

export async function generateStaticParams(){const brands=await getBrands();return brands.map(brand=>({slug:brand.slug}))}

export async function generateMetadata({params}){
 const {slug}=await params,brands=await getBrands(),brand=brands.find(item=>item.slug===slug);
 if(!brand)return{};
 return {title:brand.metaTitle||`${brand.name} Parfümleri ve Fiyatları`,description:brand.metaDescription||`${brand.name} erkek, kadın ve unisex parfümlerini keşfedin. ${brand.copy}`,alternates:{canonical:`/marka/${slug}`},openGraph:{title:`${brand.name} Parfümleri`,description:brand.copy,url:`/marka/${slug}`}};
}
export default async function Page({params}){
 const {slug}=await params,[brands,products]=await Promise.all([getBrands(),getProducts()]),brand=brands.find(item=>item.slug===slug);
 if(!brand)notFound();
 const items=products.filter(product=>product.brandSlug===slug||product.brand===brand.name);
 const schema={"@context":"https://schema.org","@type":"CollectionPage","name":`${brand.name} Parfümleri`,"url":`${SITE_URL}/marka/${slug}`,"description":brand.copy,"mainEntity":{"@type":"ItemList","numberOfItems":items.length,"itemListElement":items.map((product,index)=>({"@type":"ListItem","position":index+1,"name":`${product.brand} ${product.name}`,"url":`${SITE_URL}/urun/${product.slug}`}))}};
 return <main><div className={`collection-hero brand-hero ${brand.cover?'has-cover':''}`} style={brand.cover?{backgroundImage:`linear-gradient(90deg,#151714d9,#1517148f),url("${brand.cover}")`}:undefined}><Breadcrumbs items={[{name:'Markalar',url:'/markalar'},{name:brand.name,url:`/marka/${slug}`}]} />{brand.logo&&<img className="brand-hero-logo" src={brand.logo} alt={`${brand.name} logosu`} width="220" height="90"/>}<p className="eyebrow">SEÇKİN PARFÜM EVİ</p><h1>{brand.name} Parfümleri</h1><p>{brand.copy}</p></div><section className="catalog-section"><CatalogGrid items={items}/></section><section className="seo-copy"><h2>{brand.name} Parfüm Seçkisi</h2><p>{brand.name} koleksiyonundaki kokuları koku ailesi, kullanım zamanı ve karakterine göre karşılaştırabilirsiniz. Ürün sayfalarındaki nota ve kullanım bilgileri doğru kokuyu daha kolay bulmanıza yardımcı olur.</p></section><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/></main>;
}
