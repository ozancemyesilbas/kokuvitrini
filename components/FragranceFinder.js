'use client';
import {useMemo,useState} from 'react';
import {ChevronDown,MessageCircle,RotateCcw,SearchCheck,Sparkles,X} from 'lucide-react';
import ProductCard from './ProductCard';
import {getFinderProfile,money,WHATSAPP} from '../lib/catalog';

const groups={
 gender:{label:'Kimin için?',helper:'Bir veya birden fazla seçim yapabilirsiniz.',options:['Erkek','Kadın','Unisex']},
 family:{label:'Koku ailesi',helper:'Kokunun genel karakterini seçin.',options:['Fresh','Aquatik','Aromatik','Narenciye','Meyvemsi','Çiçeksi','Gurme','Baharatlı','Odunsu']},
 notes:{label:'Sevdiğiniz notalar',helper:'Birden fazla nota seçtikçe sonuçlar daha kişisel olur.',options:['Vanilya','Amber','Misk','Odunsu','Baharatlı','Meyvemsi','Narenciye','Bergamot','Elma','Tarçın','Lavanta','Çiçeksi','Aromatik','Deniz notaları']},
 seasons:{label:'Hangi mevsimde?',helper:'Kokuyu en çok ne zaman kullanacaksınız?',options:['İlkbahar','Yaz','Sonbahar','Kış']},
 occasions:{label:'Kullanım ortamı',helper:'Günlük rutininize veya özel planınıza göre seçin.',options:['Günlük','Ofis','Spor','Akşam','Özel gün']},
 intensity:{label:'Koku yoğunluğu',helper:'Daha sakin veya daha dikkat çekici bir etki seçin.',options:['Hafif','Orta','Güçlü']}
};
const empty={gender:[],family:[],notes:[],seasons:[],occasions:[],intensity:[]};
const weights={gender:2,family:2,notes:3,seasons:2,occasions:2,intensity:1,budget:1};
const overlap=(selected,values)=>selected.filter(value=>values.includes(value));

export default function FragranceFinder({items}){
 const [filters,setFilters]=useState(empty);
 const [budget,setBudget]=useState('all');
 const toggle=(group,value)=>setFilters(current=>({...current,[group]:current[group].includes(value)?current[group].filter(x=>x!==value):[...current[group],value]}));
 const remove=(group,value)=>setFilters(current=>({...current,[group]:current[group].filter(x=>x!==value)}));
 const reset=()=>{setFilters(empty);setBudget('all')};
 const selectionCount=Object.values(filters).reduce((sum,list)=>sum+list.length,0)+(budget==='all'?0:1);

 const ranked=useMemo(()=>items.map(product=>{
  const profile=getFinderProfile(product);
  const values={gender:[product.gender],family:[product.family],notes:profile.notes,seasons:profile.seasons,occasions:profile.occasions,intensity:[profile.intensity]};
  let earned=0,total=0;
  const matched=[];
  let exact=true;
  Object.keys(filters).forEach(key=>{
   if(!filters[key].length)return;
   const hits=overlap(filters[key],values[key]);
   total+=weights[key];
   earned+=weights[key]*(hits.length/filters[key].length);
   if(!hits.length)exact=false;
   if(hits.length)matched.push(...hits);
  });
  if(budget!=='all'){
   total+=weights.budget;
   if(product.price<=Number(budget)){earned+=weights.budget;matched.push(`${money(Number(budget))} altı`)}else exact=false;
  }
  const match=total?Math.round(earned/total*100):100;
  return {product,profile,match,exact,matched:[...new Set(matched)]};
 }).sort((a,b)=>b.match-a.match||(b.product.rating||0)-(a.product.rating||0)),[items,filters,budget]);

 const exactResults=selectionCount?ranked.filter(x=>x.exact):ranked;
 const alternatives=selectionCount?ranked.filter(x=>!x.exact&&x.match>=25).slice(0,Math.max(3,6-exactResults.length)):[];
 const recommendationList=(exactResults.length?exactResults:alternatives).slice(0,3);
 const selectedText=[...Object.entries(filters).flatMap(([key,values])=>values.map(value=>`${groups[key].label}: ${value}`)),...(budget==='all'?[]:[`Bütçe: ${money(Number(budget))} ve altı`])];
 const whatsappText=['Merhaba, Koku Bulucu seçimlerime göre destek almak istiyorum:','',...selectedText.map(x=>`• ${x}`),'',recommendationList.length?'Önerilen kokular:':'',...recommendationList.map(x=>`• ${x.product.brand} ${x.product.name} — %${x.match} uyum`)].filter(Boolean).join('\n');

 return <div className="finder-layout">
  <aside className="finder-panel">
   <div className="finder-panel-title"><div><p className="eyebrow">TERCİHLERİNİZ</p><h2>Kokunu tarif et</h2></div>{selectionCount>0&&<button type="button" onClick={reset}><RotateCcw/> Temizle</button>}</div>
   {Object.entries(groups).map(([key,group])=><details className="finder-group finder-accordion" open key={key}><summary><span>{group.label}{filters[key].length>0&&<b>{filters[key].length}</b>}</span><ChevronDown/></summary><p>{group.helper}</p><div className="finder-options">{group.options.map(option=><button type="button" aria-pressed={filters[key].includes(option)} onClick={()=>toggle(key,option)} key={option}>{option}</button>)}</div></details>)}
   <details className="finder-group finder-accordion" open><summary><span>Bütçe{budget!=='all'&&<b>1</b>}</span><ChevronDown/></summary><p>Üst fiyat sınırınızı belirleyin.</p><select value={budget} onChange={event=>setBudget(event.target.value)} aria-label="Bütçe seçin"><option value="all">Bütçe sınırı yok</option><option value="2500">2.500 ₺ ve altı</option><option value="3000">3.000 ₺ ve altı</option><option value="3500">3.500 ₺ ve altı</option></select></details>
  </aside>
  <section className="finder-results" aria-live="polite">
   <div className="finder-result-head"><div><p className="eyebrow">KİŞİSEL EŞLEŞMELER</p><h2>{selectionCount?`${exactResults.length} tam eşleşme bulundu`:'Seçkinin tamamını keşfet'}</h2><p>{selectionCount?'Sonuçlar kriterlerinize uygunluk oranına göre sıralandı.':'Soldaki kriterleri seçin; parfümler size uygunluk oranına göre sıralansın.'}</p></div><SearchCheck/></div>
   {selectionCount>0&&<div className="finder-selection-summary"><div>{Object.entries(filters).flatMap(([key,values])=>values.map(value=><button key={`${key}-${value}`} onClick={()=>remove(key,value)}>{value}<X/></button>))}{budget!=='all'&&<button onClick={()=>setBudget('all')}>{money(Number(budget))} altı<X/></button>}</div><a target="_blank" rel="noreferrer" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappText)}`}><MessageCircle/> Seçimlerimi WhatsApp’tan danış</a></div>}
   {exactResults.length>0&&<ResultGrid results={exactResults} alternative={false}/>} 
   {alternatives.length>0&&<div className="finder-alternatives"><div className="finder-subhead"><p className="eyebrow">YAKIN ALTERNATİFLER</p><h3>Tercihlerine yakın diğer kokular</h3><p>Bu ürünler bütün kriterleri karşılamasa da güçlü benzerlik gösteriyor.</p></div><ResultGrid results={alternatives} alternative/></div>}
   {!exactResults.length&&!alternatives.length&&<div className="finder-empty"><SearchCheck/><h3>Yakın bir alternatif bulunamadı</h3><p>Bir veya iki tercihi kaldırarak sonuç alanını genişletebilirsiniz.</p><button type="button" className="primary-button" onClick={reset}>Seçimleri temizle</button></div>}
  </section>
 </div>
}

function ResultGrid({results,alternative}){return <div className="product-grid finder-grid">{results.map(({product,profile,match,matched})=><div className={`finder-product${alternative?' is-alternative':''}`} key={product.slug}><div className="match-pill"><Sparkles/><b>{alternative?'Yakın alternatif':`%${match} uyum`}</b><span>{profile.intensity} · {profile.seasons.join(', ')}</span></div><ProductCard product={product}/>{matched.length>0&&<p className="match-reason"><b>Neden önerildi?</b> {matched.slice(0,4).join(' · ')}</p>}</div>)}</div>}
