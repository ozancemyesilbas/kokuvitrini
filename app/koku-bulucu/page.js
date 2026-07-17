import Breadcrumbs from '../../components/Breadcrumbs';
import FragranceFinder from '../../components/FragranceFinder';
import {SITE_URL} from '../../lib/catalog';
import {getProducts} from '../../lib/catalog-data';

export const metadata={
 title:'Parfüm Bulucu | Notalara Göre Parfüm Seç',
 description:'Sevdiğiniz notaları, koku ailesini, mevsimi, kullanım ortamını ve bütçenizi seçin; size uygun parfümleri karşılaştırın.',
 alternates:{canonical:'/koku-bulucu'}
};

export const dynamic='force-dynamic';
export default async function Page(){
 const products=await getProducts();
 const schema={"@context":"https://schema.org","@type":"WebPage","name":"Koku Vitrini Parfüm Bulucu","url":`${SITE_URL}/koku-bulucu`,"description":"Nota, koku ailesi, mevsim, kullanım ortamı, yoğunluk ve bütçeye göre parfüm önerileri."};
 return <main><div className="finder-hero"><Breadcrumbs items={[{name:'Koku Bulucu',url:'/koku-bulucu'}]}/><p className="eyebrow">SANA UYGUN KOKUYU BUL</p><h1>Parfüm seçimini<br/><em>hislere bırakma.</em></h1><p>Sevdiğin notaları ve kokudan beklentini seç. Koku Vitrini, koleksiyondaki en uygun parfümleri senin için sıralasın.</p><div className="finder-steps"><span><b>01</b> Kriterlerini seç</span><span><b>02</b> Uyum oranını gör</span><span><b>03</b> Kokunu keşfet</span></div></div><FragranceFinder items={products}/><section className="seo-copy"><h2>Notalara Göre Parfüm Nasıl Seçilir?</h2><p>Parfüm Bulucu; sevdiğiniz koku notalarını, koku ailesini, mevsimi ve kullanım ortamını birlikte değerlendirir. Vanilya ve amber gibi sıcak notalardan narenciye ve deniz notaları gibi ferah profillere kadar tercihlerinizi belirleyerek koleksiyondaki uygun kokuları daha hızlı bulabilirsiniz.</p><p>Sonuçlar editöryal ürün profilleri üzerinden uygunluk oranına göre sıralanır. Parfümün teninizdeki gelişimi kişiden kişiye değişebileceği için ürün detaylarını incelemenizi ve karar öncesinde destek almanızı öneririz.</p></section><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/></main>
}
