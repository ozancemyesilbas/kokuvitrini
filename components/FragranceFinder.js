'use client';
import {useMemo,useState} from 'react';
import {RotateCcw,SearchCheck,Sparkles} from 'lucide-react';
import ProductCard from './ProductCard';
import {finderProfiles} from '../lib/catalog';

const groups={
 gender:{label:'Kimin için?',helper:'Bir veya birden fazla seçim yapabilirsiniz.',options:['Erkek','Kadın','Unisex']},
 family:{label:'Koku ailesi',helper:'Kokunun genel karakterini seçin.',options:['Fresh','Aquatik','Aromatik','Meyvemsi','Çiçeksi','Gurme','Baharatlı','Odunsu']},
 notes:{label:'Sevdiğiniz notalar',helper:'Birden fazla nota seçtikçe sonuçlar daha kişisel olur.',options:['Vanilya','Amber','Misk','Odunsu','Baharatlı','Meyvemsi','Narenciye','Bergamot','Elma','Tarçın','Lavanta','Çiçeksi','Aromatik','Deniz notaları']},
 seasons:{label:'Hangi mevsimde?',helper:'Kokuyu en çok ne zaman kullanacaksınız?',options:['İlkbahar','Yaz','Sonbahar','Kış']},
 occasions:{label:'Kullanım ortamı',helper:'Günlük rutininize veya özel planınıza göre seçin.',options:['Günlük','Ofis','Spor','Akşam','Özel gün']},
 intensity:{label:'Koku yoğunluğu',helper:'Daha sakin veya daha dikkat çekici bir etki seçin.',options:['Hafif','Orta','Güçlü']}
};
const empty={gender:[],family:[],notes:[],seasons:[],occasions:[],intensity:[]};

function overlap(selected,values){return selected.filter(value=>values.includes(value)).length}

export default function FragranceFinder({items}){
 const [filters,setFilters]=useState(empty);
 const [budget,setBudget]=useState('all');
 const toggle=(group,value)=>setFilters(current=>({...current,[group]:current[group].includes(value)?current[group].filter(x=>x!==value):[...current[group],value]}));
 const reset=()=>{setFilters(empty);setBudget('all')};
 const selectionCount=Object.values(filters).reduce((sum,list)=>sum+list.length,0)+(budget==='all'?0:1);
 const results=useMemo(()=>items.map(product=>{
   const profile=finderProfiles[product.slug];
   if(!profile)return null;
   const max=budget==='all'?Infinity:Number(budget);
   if(product.price>max)return null;
   if(filters.gender.length&&!filters.gender.includes(product.gender))return null;
   if(filters.family.length&&!filters.family.includes(product.family))return null;
   if(filters.notes.length&&!overlap(filters.notes,profile.notes))return null;
   if(filters.seasons.length&&!overlap(filters.seasons,profile.seasons))return null;
   if(filters.occasions.length&&!overlap(filters.occasions,profile.occasions))return null;
   if(filters.intensity.length&&!filters.intensity.includes(profile.intensity))return null;
   const dimensions=[
    filters.gender.length?Number(filters.gender.includes(product.gender)):null,
    filters.family.length?Number(filters.family.includes(product.family)):null,
    filters.notes.length?overlap(filters.notes,profile.notes)/filters.notes.length:null,
    filters.seasons.length?overlap(filters.seasons,profile.seasons)/filters.seasons.length:null,
    filters.occasions.length?overlap(filters.occasions,profile.occasions)/filters.occasions.length:null,
    filters.intensity.length?Number(filters.intensity.includes(profile.intensity)):null,
    budget!=='all'?1:null
   ].filter(value=>value!==null);
   const match=dimensions.length?Math.round(dimensions.reduce((a,b)=>a+b,0)/dimensions.length*100):100;
   return {product,profile,match};
  }).filter(Boolean).sort((a,b)=>b.match-a.match||b.product.rating-a.product.rating),[items,filters,budget]);
 return <div className="finder-layout">
  <aside className="finder-panel">
   <div className="finder-panel-title"><div><p className="eyebrow">TERCİHLERİNİZ</p><h2>Kokunu tarif et</h2></div>{selectionCount>0&&<button type="button" onClick={reset}><RotateCcw/> Temizle</button>}</div>
   {Object.entries(groups).map(([key,group])=><fieldset className="finder-group" key={key}><legend>{group.label}</legend><p>{group.helper}</p><div className="finder-options">{group.options.map(option=><button type="button" aria-pressed={filters[key].includes(option)} onClick={()=>toggle(key,option)} key={option}>{option}</button>)}</div></fieldset>)}
   <fieldset className="finder-group"><legend>Bütçe</legend><p>Üst fiyat sınırınızı belirleyin.</p><select value={budget} onChange={event=>setBudget(event.target.value)} aria-label="Bütçe seçin"><option value="all">Bütçe sınırı yok</option><option value="2500">2.500 ₺ ve altı</option><option value="3000">3.000 ₺ ve altı</option><option value="3500">3.500 ₺ ve altı</option></select></fieldset>
  </aside>
  <section className="finder-results" aria-live="polite">
   <div className="finder-result-head"><div><p className="eyebrow">KİŞİSEL EŞLEŞMELER</p><h2>{selectionCount?`${results.length} uygun parfüm bulundu`:'Seçkinin tamamını keşfet'}</h2><p>{selectionCount?'En güçlü eşleşmeler tercihlerinize göre ilk sırada gösteriliyor.':'Soldaki kriterleri seçin; parfümler size uygunluk oranına göre sıralansın.'}</p></div><SearchCheck/></div>
   {results.length?<div className="product-grid finder-grid">{results.map(({product,profile,match})=><div className="finder-product" key={product.slug}><div className="match-pill"><Sparkles/><b>%{match} uyum</b><span>{profile.intensity} · {profile.seasons.join(', ')}</span></div><ProductCard product={product}/></div>)}</div>:<div className="finder-empty"><SearchCheck/><h3>Bu seçimlerin tamamıyla eşleşen ürün bulunamadı</h3><p>Bir veya iki tercihi kaldırarak yakın alternatifleri görüntüleyebilirsiniz.</p><button type="button" className="primary-button" onClick={reset}>Seçimleri temizle</button></div>}
  </section>
 </div>
}
