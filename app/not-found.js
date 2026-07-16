import {ArrowLeft,MessageCircle,Search} from 'lucide-react';
import {WHATSAPP} from '../lib/catalog';

export const metadata={title:'Sayfa Bulunamadı',robots:{index:false,follow:true}};
export default function NotFound(){return <main className="not-found-page"><span>404</span><p className="eyebrow">BU KOKUNUN İZİ KAYBOLMUŞ</p><h1>Aradığınız sayfayı bulamadık.</h1><p>Bağlantı değişmiş veya ürün vitrinden kaldırılmış olabilir. Koleksiyona dönerek aradığınız kokuyu yeniden keşfedebilirsiniz.</p><div><a className="primary-button" href="/parfumler"><Search/> Parfümleri keşfet</a><a className="text-button" href="/"><ArrowLeft/> Ana sayfaya dön</a><a className="text-button" href={`https://wa.me/${WHATSAPP}`}><MessageCircle/> Destek al</a></div></main>}
