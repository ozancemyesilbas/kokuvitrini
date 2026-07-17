import {ArrowRight,BookOpen,Gift,ShieldCheck,Sparkles,Truck} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductVisual from '../components/ProductVisual';
import {getCatalog} from '../lib/catalog-data';

export const metadata={alternates:{canonical:'/'}};

export const dynamic='force-dynamic';

export default async function Home(){
 const {products,brands,categories}=await getCatalog();
 const featured=products.slice(0,8);
 const hero=products[0];
 const faq={"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Koku Vitrini’nde hangi parfüm markaları bulunur?","acceptedAnswer":{"@type":"Answer","text":"French Avenue, Afnan, Khadlaj, Lattafa, Rayhaan, Rasasi, Armaf ve Fragrance World gibi seçkin markalar bulunur."}},{"@type":"Question","name":"Doğru parfümü nasıl seçebilirim?","acceptedAnswer":{"@type":"Answer","text":"Koku ailesi, mevsim, kullanım zamanı ve sevdiğiniz notalara göre ürünleri karşılaştırabilir, WhatsApp üzerinden destek alabilirsiniz."}}]};
 return <main>
  <section className="home-hero">
   <div className="hero-copy"><p className="eyebrow">KOKUN, İMZAN OLSUN</p><h1>Sana ait olan<br/><em>kokuyu keşfet.</em></h1><p>Seçkin Arap parfümleri, özgün karakterler ve tende iz bırakan hikâyeler. Doğru kokuyu bulman için özenle seçildi.</p><div className="hero-buttons"><a className="primary-button" href="/koku-bulucu">Kokumu bul <ArrowRight/></a><a className="text-button" href="/parfumler">Koleksiyonu keşfet</a></div><div className="hero-proof"><span><b>8+</b> seçkin marka</span><span><b>WhatsApp</b> koku desteği</span><span><b>1–3 gün</b> hızlı gönderim</span></div></div>
   {hero&&<div className="hero-visual"><div className="hero-orbit"/><ProductVisual product={hero} large/><div className="hero-label"><small>VİTRİNİN GÖZDESİ</small><b>{hero.name}</b><span>{hero.brand}</span></div></div>}
  </section>
  <section className="trust-row"><div><Truck/><span><b>Hızlı Gönderim</b><small>1–3 iş gününde kargoda</small></span></div><div><ShieldCheck/><span><b>Güvenli Sipariş</b><small>Kontrollü sipariş süreci</small></span></div><div><Sparkles/><span><b>Özenli Seçki</b><small>Karakterli ve sevilen kokular</small></span></div><div><Gift/><span><b>Hediye Desteği</b><small>Doğru hediyeyi birlikte seçelim</small></span></div></section>
  <section className="finder-home"><div><Sparkles/><p className="eyebrow">AKILLI KOKU EŞLEŞTİRME</p><h2>Notalarını seç,<br/>kokunu birlikte bulalım.</h2><p>Sevdiğin notaları, mevsimi, kullanım ortamını ve bütçeni söyle. Koleksiyonumuzdaki en uygun parfümleri uyum oranıyla sıralayalım.</p><a className="primary-button" href="/koku-bulucu">Koku Bulucu’yu başlat <ArrowRight/></a></div><div className="finder-home-notes"><span>Vanilya</span><span>Amber</span><span>Bergamot</span><span>Odunsu</span><span>Deniz notaları</span><span>Misk</span><i>Senin kokun</i></div></section>
  <section className="home-section"><div className="section-title"><div><p className="eyebrow">KENDİ YOLUNU SEÇ</p><h2>Koku dünyanı bul</h2></div><a href="/parfumler">Tümünü görüntüle <ArrowRight/></a></div><div className="category-grid">{categories.map((c,i)=><a className={`category-card category-${i+1} ${c.image?'has-image':''}`} style={c.image?{'--category-image':`url("${c.image}")`}:undefined} href={`/${c.slug}`} key={c.slug}><span>0{i+1}</span><div><h3>{c.name}</h3><p>{c.short}</p></div><ArrowRight/></a>)}</div></section>
  <section className="home-section products-home"><div className="section-title"><div><p className="eyebrow">VİTRİNİN GÖZDELERİ</p><h2>En çok keşfedilenler</h2></div><a href="/parfumler">Tüm parfümler <ArrowRight/></a></div><div className="product-grid">{featured.map(p=><ProductCard key={p.slug} product={p}/>)}</div></section>
  <section className="brand-band"><p className="eyebrow">SEÇKİN MARKALAR</p><div>{brands.map(b=><a href={`/marka/${b.slug}`} key={b.slug}>{b.name}</a>)}</div><a className="text-button light-link" href="/markalar">Tüm markaları incele <ArrowRight/></a></section>
  <section className="guide-block"><div><BookOpen/><p className="eyebrow">KOKU REHBERİ</p><h2>Parfüm seçmek,<br/>kendini anlatmaktır.</h2><p>Koku ailelerinden mevsim seçimine, kalıcılıktan doğru uygulamaya kadar parfüm dünyasını yakından tanı.</p><a className="primary-button" href="/parfum-rehberi">Rehberi incele <ArrowRight/></a></div><div className="note-map"><span><small>ÜST NOTA</small><b>Bergamot</b></span><span><small>KALP NOTA</small><b>Safran</b></span><span><small>DİP NOTA</small><b>Amber</b></span><i>KV</i></div></section>
  <section className="seo-copy home-seo"><h2>Seçkin Arap Parfümleri Koku Vitrini’nde</h2><p>Koku Vitrini; French Avenue, Afnan, Khadlaj, Lattafa, Rasasi ve seçkin parfüm markalarını tek vitrinde bir araya getirir. Erkek, kadın ve unisex parfüm seçenekleri arasından tarzınıza, mevsime ve kullanım amacınıza uygun kokuyu keşfedebilirsiniz.</p><p>Vanilyalı, odunsu, baharatlı, meyvemsi, aquatik ve gurme koku ailelerini karşılaştırın; notaları, karakteri ve kullanım önerilerini inceleyerek imza kokunuzu daha bilinçli seçin.</p></section>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faq)}}/>
 </main>
}
