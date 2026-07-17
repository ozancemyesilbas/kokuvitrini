import SavedProducts from '../../components/SavedProducts';
import {getProducts} from '../../lib/catalog-data';

export const metadata={title:'Favorilerim ve Son Görüntülenenler',description:'Koku Vitrini’nde favoriye eklediğiniz ve son görüntülediğiniz parfümleri inceleyin.',robots:{index:false,follow:true}};
export const dynamic='force-dynamic';
export default async function Page(){const products=await getProducts();return <main><div className="collection-hero"><p className="eyebrow">KİŞİSEL VİTRİNİNİZ</p><h1>Kaydedilen kokular</h1><p>Beğendiğiniz parfümleri saklayın, daha önce incelediğiniz kokulara kolayca geri dönün.</p></div><SavedProducts items={products}/></main>}
