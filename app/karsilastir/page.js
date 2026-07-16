import Breadcrumbs from '../../components/Breadcrumbs';
import ProductCompare from '../../components/ProductCompare';
import {products,SITE_URL} from '../../lib/catalog';

export const metadata={title:'Parfüm Karşılaştırma | Nota, Kalıcılık ve Fiyat',description:'İki veya üç parfümü nota, koku ailesi, mevsim, yoğunluk, fiyat ve kullanım alanına göre yan yana karşılaştırın.',alternates:{canonical:'/karsilastir'}};
export default function Page(){const schema={"@context":"https://schema.org","@type":"WebPage","name":"Parfüm Karşılaştırma","url":`${SITE_URL}/karsilastir`};return <main><div className="collection-hero"><Breadcrumbs items={[{name:'Parfüm Karşılaştırma',url:'/karsilastir'}]}/><p className="eyebrow">DOĞRU SEÇİMİ YAPIN</p><h1>Parfümleri karşılaştır</h1><p>İki veya üç kokuyu yan yana getirin; notalarını, kullanım alanlarını ve karakterlerini tek ekranda değerlendirin.</p></div><ProductCompare items={products}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/></main>}
