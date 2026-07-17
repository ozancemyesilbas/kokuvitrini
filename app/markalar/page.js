import Breadcrumbs from '../../components/Breadcrumbs';
import {getBrands} from '../../lib/catalog-data';
export const metadata={title:'Parfüm Markaları | French Avenue, Afnan, Khadlaj',description:'French Avenue, Afnan, Khadlaj, Lattafa, Rasasi, Rayhaan, Armaf ve seçkin parfüm markalarını keşfedin.',alternates:{canonical:'/markalar'}};
export const dynamic='force-dynamic';
export default async function Page(){const brands=await getBrands();return <main><div className="collection-hero"><Breadcrumbs items={[{name:'Markalar',url:'/markalar'}]}/><p className="eyebrow">PARFÜM EVLERİ</p><h1>Seçkin Markalar</h1><p>Koku karakteri ve parfümeri yaklaşımıyla öne çıkan markaları yakından tanıyın.</p></div><section className="brand-grid">{brands.map((b,i)=><a href={`/marka/${b.slug}`} key={b.slug}><span>{String(i+1).padStart(2,'0')}</span><h2>{b.name}</h2><p>{b.copy}</p><b>Markayı keşfet →</b></a>)}</section></main>}
