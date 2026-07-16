import './globals.css';
import './finder.css';
import './finder-scroll.css';
import './enhancements.css';
import './enhancements-extra.css';
import './mobile.css';
import StoreProvider from '../components/StoreProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RouteTracker from '../components/RouteTracker';
import {SITE_URL} from '../lib/catalog';

export const metadata={
 metadataBase:new URL(SITE_URL),
 title:{default:'Koku Vitrini | Seçkin Arap Parfümleri ve Niş Kokular',template:'%s | Koku Vitrini'},
 description:'French Avenue, Afnan, Khadlaj, Lattafa ve seçkin Arap parfümleri. Erkek, kadın, unisex parfümler ve hediye setleri Koku Vitrini’nde.',
 keywords:['Arap parfümleri','French Avenue parfümleri','kalıcı parfüm','erkek parfüm','kadın parfüm','unisex parfüm','parfüm seti','niş parfüm'],
 authors:[{name:'Koku Vitrini'}],creator:'Koku Vitrini',publisher:'Koku Vitrini',formatDetection:{telephone:false},
 openGraph:{title:'Koku Vitrini | Seçkin Parfümler',description:'Kokun, imzan olsun. Seçkin Arap parfümleri ve modern niş kokular.',url:SITE_URL,siteName:'Koku Vitrini',locale:'tr_TR',type:'website',images:[{url:'/og-koku-vitrini.png',width:1200,height:630,alt:'Koku Vitrini Parfümeri'}]},
 twitter:{card:'summary_large_image',title:'Koku Vitrini',description:'Seçkin Arap parfümleri ve modern niş kokular.',images:['/og-koku-vitrini.png']},
 robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
};

export default function RootLayout({children}){const schema={"@context":"https://schema.org","@graph":[{"@type":"OnlineStore","@id":`${SITE_URL}/#store`,"name":"Koku Vitrini","url":SITE_URL,"telephone":"+90 538 285 11 39","description":"Seçkin Arap ve niş parfümleri sunan online parfüm mağazası","areaServed":{"@type":"Country","name":"Türkiye"},"currenciesAccepted":"TRY","paymentAccepted":"Havale/EFT","sameAs":[]},{"@type":"WebSite","@id":`${SITE_URL}/#website`,"url":SITE_URL,"name":"Koku Vitrini","inLanguage":"tr-TR","publisher":{"@id":`${SITE_URL}/#store`},"potentialAction":{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":`${SITE_URL}/parfumler?q={search_term_string}`},"query-input":"required name=search_term_string"}}]};return <html lang="tr"><body><StoreProvider><RouteTracker/><Header/>{children}<Footer/></StoreProvider><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/></body></html>}
