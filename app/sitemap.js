import {SITE_URL} from '../lib/catalog';
import {getBrands,getProducts} from '../lib/catalog-data';
export const dynamic='force-dynamic';

export default async function sitemap(){
 const [brands,products]=await Promise.all([getBrands(),getProducts()]);
 const now=new Date();
 const staticPages=[['',1,'daily'],['/parfumler',.9,'daily'],['/koku-bulucu',.9,'weekly'],['/karsilastir',.75,'monthly'],['/erkek-parfumleri',.9,'weekly'],['/kadin-parfumleri',.9,'weekly'],['/unisex-parfumler',.9,'weekly'],['/parfum-setleri',.8,'weekly'],['/markalar',.8,'monthly'],['/parfum-rehberi',.8,'monthly'],['/hakkimizda',.5,'yearly'],['/iletisim',.5,'yearly'],['/sss',.6,'monthly'],['/teslimat-iade',.3,'yearly'],['/gizlilik',.2,'yearly'],['/mesafeli-satis',.2,'yearly']].map(([path,priority,changeFrequency])=>({url:SITE_URL+path,lastModified:now,changeFrequency,priority}));
 const brandPages=brands.map(b=>({url:`${SITE_URL}/marka/${b.slug}`,lastModified:now,changeFrequency:'weekly',priority:.75}));
 const productPages=products.map(p=>({url:`${SITE_URL}/urun/${p.slug}`,lastModified:p.updatedAt?new Date(p.updatedAt):now,changeFrequency:'weekly',priority:.8,...(p.image?{images:[p.image]}:{})}));
 return [...staticPages,...brandPages,...productPages]
}
