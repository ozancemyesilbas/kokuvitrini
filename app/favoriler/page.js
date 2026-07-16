import SavedProducts from '../../components/SavedProducts';
import {products} from '../../lib/catalog';

export const metadata={title:'Favorilerim ve Son Görüntülenenler',description:'Koku Vitrini’nde favoriye eklediğiniz ve son görüntülediğiniz parfümleri inceleyin.',robots:{index:false,follow:true}};
export default function Page(){return <main><div className="collection-hero"><p className="eyebrow">KİŞİSEL VİTRİNİNİZ</p><h1>Kaydedilen kokular</h1><p>Beğendiğiniz parfümleri saklayın, daha önce incelediğiniz kokulara kolayca geri dönün.</p></div><SavedProducts items={products}/></main>}
