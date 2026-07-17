'use client';

import {useCallback,useEffect,useMemo,useState} from 'react';
import {Archive,Check,ChevronRight,ImagePlus,KeyRound,LayoutDashboard,LogOut,PackagePlus,Pencil,Plus,RefreshCw,Save,Search,ShieldCheck,Star,Tags,Trash2,UploadCloud,X} from 'lucide-react';
import {brands as seedBrands,categories as seedCategories,getFinderProfile,products as seedProducts,slugify} from '../lib/catalog';
import {getSupabaseBrowserClient,isSupabaseConfigured} from '../lib/supabase';

const emptyProduct={id:null,name:'',slug:'',brand_id:'',category_id:'',gender:'Unisex',family:'',size:'100 ML',price:'',old_price:'',stock:0,badge:'',color:'#77756d',short_description:'',description:'',notes:'',seasons:'',occasions:'',intensity:'Orta',longevity:'',sillage:'',sku:'',gtin:'',mpn:'',main_image_url:'',image_alt:'',meta_title:'',meta_description:'',status:'draft',is_featured:false,sort_order:0,product_images:[]};
const splitList=value=>(value||'').split(',').map(item=>item.trim()).filter(Boolean);
const joinList=value=>Array.isArray(value)?value.join(', '):value||'';
const nullableNumber=value=>value===''||value===null?null:Number(value);
const productToForm=row=>({...emptyProduct,...row,price:String(row.price??''),old_price:row.old_price===null||row.old_price===undefined?'':String(row.old_price),notes:joinList(row.notes),seasons:joinList(row.seasons),occasions:joinList(row.occasions),product_images:row.product_images||[]});

function Field({label,hint,wide=false,children}){return <label className={`admin-field ${wide?'wide':''}`}><span>{label}</span>{children}{hint&&<small>{hint}</small>}</label>}
function EmptyState({title,copy}){return <div className="admin-empty"><PackagePlus/><h3>{title}</h3><p>{copy}</p></div>}

function SeoScore({form}){
 const checks=[
  [form.name?.length>=3,'Ürün adı'],[form.slug?.length>=8,'Temiz bağlantı'],[form.short_description?.length>=70,'Kısa açıklama'],[form.description?.length>=180,'Detaylı açıklama'],
  [splitList(form.notes).length>=3,'En az 3 nota'],[form.meta_title?.length>=35&&form.meta_title?.length<=65,'SEO başlığı'],[form.meta_description?.length>=120&&form.meta_description?.length<=165,'SEO açıklaması'],
  [Boolean(form.main_image_url||form.product_images?.length),'Ürün görseli'],[form.image_alt?.length>=10,'Görsel açıklaması'],[Boolean(form.sku||form.gtin||form.mpn),'Ürün kodu']
 ];
 const completed=checks.filter(([ok])=>ok).length,score=Math.round(completed/checks.length*100);
 return <div className="seo-score"><div><span>SEO hazırlığı</span><b>{score}/100</b></div><div className="seo-meter"><i style={{width:`${score}%`}}/></div><ul>{checks.map(([ok,label])=><li className={ok?'done':''} key={label}>{ok?<Check/>:<span/>}{label}</li>)}</ul></div>
}

export default function AdminPanel(){
 const supabase=useMemo(()=>getSupabaseBrowserClient(),[]);
 const [authReady,setAuthReady]=useState(false),[session,setSession]=useState(null),[isAdmin,setIsAdmin]=useState(false);
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[authError,setAuthError]=useState('');
 const [active,setActive]=useState('products'),[products,setProducts]=useState([]),[brands,setBrands]=useState([]),[categories,setCategories]=useState([]);
 const [form,setForm]=useState(emptyProduct),[query,setQuery]=useState(''),[statusFilter,setStatusFilter]=useState('all');
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 const [brandDraft,setBrandDraft]=useState({id:null,name:'',slug:'',description:'',meta_title:'',meta_description:'',sort_order:0,is_active:true});
 const [categoryDraft,setCategoryDraft]=useState({id:null,name:'',slug:'',description:'',meta_title:'',meta_description:'',sort_order:0,is_active:true});

 useEffect(()=>{document.body.classList.add('admin-page');return()=>document.body.classList.remove('admin-page')},[]);

 const flash=(text,isError=false)=>{if(isError){setError(text);setMessage('')}else{setMessage(text);setError('')}window.setTimeout(()=>{setMessage('');setError('')},5000)};

 const loadData=useCallback(async()=>{
  if(!supabase)return;
  setBusy(true);
  const [productResult,brandResult,categoryResult]=await Promise.all([
   supabase.from('products').select('*,brands(name),categories(name),product_images(*)').order('updated_at',{ascending:false}),
   supabase.from('brands').select('*').order('sort_order').order('name'),
   supabase.from('categories').select('*').order('sort_order').order('name')
  ]);
  setBusy(false);
  const firstError=productResult.error||brandResult.error||categoryResult.error;
  if(firstError){flash(`Veriler alınamadı: ${firstError.message}`,true);return}
  setProducts(productResult.data||[]);setBrands(brandResult.data||[]);setCategories(categoryResult.data||[]);
 },[supabase]);

 useEffect(()=>{
  if(!supabase){setAuthReady(true);return}
  supabase.auth.getSession().then(({data})=>{setSession(data.session);setAuthReady(true)});
  const {data}=supabase.auth.onAuthStateChange((_event,next)=>{setSession(next);setAuthReady(true)});
  return()=>data.subscription.unsubscribe();
 },[supabase]);

 useEffect(()=>{
  if(!supabase||!session){setIsAdmin(false);return}
  let activeRequest=true;
  supabase.from('admin_users').select('user_id').eq('user_id',session.user.id).maybeSingle().then(({data,error})=>{
   if(!activeRequest)return;
   if(error){setAuthError(error.message);setIsAdmin(false);return}
   setIsAdmin(Boolean(data));
  });
  return()=>{activeRequest=false};
 },[session,supabase]);

 useEffect(()=>{if(isAdmin)loadData()},[isAdmin,loadData]);

 async function signIn(event){
  event.preventDefault();setAuthError('');setBusy(true);
  const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});
  setBusy(false);if(error)setAuthError('Giriş yapılamadı. E-posta ve parolanızı kontrol edin.');
 }

 async function signOut(){await supabase.auth.signOut();setProducts([]);setForm(emptyProduct)}
 const update=(key,value)=>setForm(current=>({...current,[key]:value}));
 const startNew=()=>{setForm({...emptyProduct});setActive('products');window.scrollTo({top:0,behavior:'smooth'})};
 const editProduct=row=>{setForm(productToForm(row));setActive('products');window.scrollTo({top:0,behavior:'smooth'})};

 async function saveProduct(event){
  event.preventDefault();setBusy(true);setError('');
  const payload={
   name:form.name.trim(),slug:slugify(form.slug||form.name),brand_id:form.brand_id||null,category_id:form.category_id||null,gender:form.gender,family:form.family.trim(),size:form.size.trim(),
   price:Number(form.price||0),old_price:nullableNumber(form.old_price),stock:Number(form.stock||0),badge:form.badge.trim()||null,color:form.color||'#77756d',short_description:form.short_description.trim(),description:form.description.trim(),
   notes:splitList(form.notes),seasons:splitList(form.seasons),occasions:splitList(form.occasions),intensity:form.intensity,longevity:form.longevity.trim()||null,sillage:form.sillage.trim()||null,
   sku:form.sku.trim()||null,gtin:form.gtin.trim()||null,mpn:form.mpn.trim()||null,main_image_url:form.main_image_url||null,image_alt:form.image_alt.trim()||null,
   meta_title:form.meta_title.trim()||null,meta_description:form.meta_description.trim()||null,status:form.status,is_featured:Boolean(form.is_featured),sort_order:Number(form.sort_order||0),
   published_at:form.status==='published'?(form.published_at||new Date().toISOString()):null
  };
  const result=form.id
   ?await supabase.from('products').update(payload).eq('id',form.id).select('*,brands(name),categories(name),product_images(*)').single()
   :await supabase.from('products').insert(payload).select('*,brands(name),categories(name),product_images(*)').single();
  setBusy(false);
  if(result.error){flash(`Ürün kaydedilemedi: ${result.error.message}`,true);return}
  setForm(productToForm(result.data));await loadData();flash(form.id?'Ürün güncellendi.':'Ürün oluşturuldu. Şimdi görsellerini yükleyebilirsiniz.');
 }

 async function deleteProduct(row){
  if(!window.confirm(`“${row.name}” ürünü kalıcı olarak silinsin mi?`))return;
  setBusy(true);
  const paths=(row.product_images||[]).map(image=>storagePath(image.url)).filter(Boolean);
  if(paths.length)await supabase.storage.from('product-images').remove(paths);
  const {error}=await supabase.from('products').delete().eq('id',row.id);
  setBusy(false);if(error){flash(error.message,true);return}
  if(form.id===row.id)setForm(emptyProduct);await loadData();flash('Ürün silindi.');
 }

 function storagePath(url){const marker='/storage/v1/object/public/product-images/';return url?.includes(marker)?decodeURIComponent(url.split(marker)[1]):null}

 async function uploadImages(event){
  const files=[...event.target.files];event.target.value='';if(!form.id||!files.length)return;
  if(files.some(file=>file.size>5*1024*1024)){flash('Her görsel en fazla 5 MB olabilir.',true);return}
  setBusy(true);
  const existing=form.product_images||[],rows=[];
  for(let index=0;index<files.length;index++){
   const file=files[index],safe=file.name.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9.]+/g,'-');
   const path=`${form.id}/${crypto.randomUUID()}-${safe}`;
   const uploaded=await supabase.storage.from('product-images').upload(path,file,{cacheControl:'31536000',upsert:false});
   if(uploaded.error){setBusy(false);flash(`Görsel yüklenemedi: ${uploaded.error.message}`,true);return}
   const {data}=supabase.storage.from('product-images').getPublicUrl(path);
   rows.push({product_id:form.id,url:data.publicUrl,alt_text:form.image_alt||`${form.name} ${form.size} ürün görseli`,sort_order:existing.length+index,is_primary:existing.length===0&&index===0});
  }
  const inserted=await supabase.from('product_images').insert(rows).select('*');
  if(inserted.error){setBusy(false);flash(inserted.error.message,true);return}
  if(existing.length===0&&rows[0])await supabase.from('products').update({main_image_url:rows[0].url,image_alt:rows[0].alt_text}).eq('id',form.id);
  setBusy(false);await refreshSelected(form.id);await loadData();flash(`${files.length} görsel yüklendi.`);
 }

 async function refreshSelected(id){
  const {data}=await supabase.from('products').select('*,brands(name),categories(name),product_images(*)').eq('id',id).single();
  if(data)setForm(productToForm(data));
 }

 async function makePrimary(image){
  setBusy(true);await supabase.from('product_images').update({is_primary:false}).eq('product_id',form.id);
  const {error}=await supabase.from('product_images').update({is_primary:true}).eq('id',image.id);
  if(!error)await supabase.from('products').update({main_image_url:image.url,image_alt:image.alt_text}).eq('id',form.id);
  setBusy(false);if(error){flash(error.message,true);return}await refreshSelected(form.id);await loadData();flash('Kapak görseli güncellendi.');
 }

 async function deleteImage(image){
  if(!window.confirm('Bu ürün görseli silinsin mi?'))return;setBusy(true);
  const path=storagePath(image.url);if(path)await supabase.storage.from('product-images').remove([path]);
  const {error}=await supabase.from('product_images').delete().eq('id',image.id);
  if(!error&&image.is_primary){
   const next=(form.product_images||[]).find(item=>item.id!==image.id);
   if(next){await supabase.from('product_images').update({is_primary:true}).eq('id',next.id);await supabase.from('products').update({main_image_url:next.url,image_alt:next.alt_text}).eq('id',form.id)}
   else await supabase.from('products').update({main_image_url:null}).eq('id',form.id);
  }
  setBusy(false);if(error){flash(error.message,true);return}await refreshSelected(form.id);await loadData();flash('Görsel silindi.');
 }

 async function saveBrand(event){
  event.preventDefault();setBusy(true);const payload={...brandDraft,name:brandDraft.name.trim(),slug:slugify(brandDraft.slug||brandDraft.name),description:brandDraft.description.trim()};delete payload.id;
  const result=brandDraft.id?await supabase.from('brands').update(payload).eq('id',brandDraft.id):await supabase.from('brands').insert(payload);
  setBusy(false);if(result.error){flash(result.error.message,true);return}setBrandDraft({id:null,name:'',slug:'',description:'',meta_title:'',meta_description:'',sort_order:0,is_active:true});await loadData();flash('Marka kaydedildi.');
 }

 async function saveCategory(event){
  event.preventDefault();setBusy(true);const payload={...categoryDraft,name:categoryDraft.name.trim(),slug:slugify(categoryDraft.slug||categoryDraft.name),description:categoryDraft.description.trim()};delete payload.id;
  const result=categoryDraft.id?await supabase.from('categories').update(payload).eq('id',categoryDraft.id):await supabase.from('categories').insert(payload);
  setBusy(false);if(result.error){flash(result.error.message,true);return}setCategoryDraft({id:null,name:'',slug:'',description:'',meta_title:'',meta_description:'',sort_order:0,is_active:true});await loadData();flash('Kategori kaydedildi.');
 }

 async function deleteLookup(table,row){
  if(!window.confirm(`“${row.name}” silinsin mi? Ürünler silinmez; ilişki boş bırakılır.`))return;
  const {error}=await supabase.from(table).delete().eq('id',row.id);if(error){flash(error.message,true);return}await loadData();flash('Kayıt silindi.');
 }

 async function importSamples(){
  if(!window.confirm('Mevcut örnek vitrindeki ürünler veritabanına aktarılsın mı? Aynı bağlantı adına sahip ürünler güncellenir.'))return;
  setBusy(true);
  const brandRows=seedBrands.map((brand,index)=>({name:brand.name,slug:brand.slug,description:brand.copy,sort_order:index+1,is_active:true}));
  const categoryRows=seedCategories.map((category,index)=>({name:category.name,slug:category.slug,description:category.meta,meta_title:category.name,meta_description:category.meta,sort_order:index+1,is_active:true}));
  const brandResult=await supabase.from('brands').upsert(brandRows,{onConflict:'slug'}).select('*');
  const categoryResult=await supabase.from('categories').upsert(categoryRows,{onConflict:'slug'}).select('*');
  if(brandResult.error||categoryResult.error){setBusy(false);flash((brandResult.error||categoryResult.error).message,true);return}
  const productRows=seedProducts.map((product,index)=>{
   const profile=getFinderProfile(product),brand=brandResult.data.find(item=>item.slug===slugify(product.brand)),category=categoryResult.data.find(item=>item.slug===({'Erkek':'erkek-parfumleri','Kadın':'kadin-parfumleri','Unisex':'unisex-parfumler','Set':'parfum-setleri'}[product.gender]));
   return {slug:product.slug,name:product.name,brand_id:brand?.id||null,category_id:category?.id||null,gender:product.gender,family:product.family,size:product.size,price:product.price,old_price:product.oldPrice,stock:product.stock,badge:product.badge,color:product.color,short_description:product.short,description:product.description,notes:product.notes,seasons:profile.seasons,occasions:profile.occasions,intensity:profile.intensity,image_alt:`${product.brand} ${product.name} ${product.size} ${product.gender} parfüm`,meta_title:`${product.name} ${product.brand} ${product.size} ${product.gender} Parfüm`,meta_description:`${product.name} ${product.brand} ${product.size}: ${product.short}`.slice(0,160),status:'published',is_featured:index<8,sort_order:index+1,published_at:new Date().toISOString()};
  });
  const result=await supabase.from('products').upsert(productRows,{onConflict:'slug'});
  setBusy(false);if(result.error){flash(`Örnek ürünler aktarılamadı: ${result.error.message}`,true);return}await loadData();flash(`${productRows.length} örnek ürün veritabanına aktarıldı.`);
 }

 const filtered=products.filter(item=>{
  const matchQuery=!query||`${item.name} ${item.brands?.name||''} ${item.sku||''}`.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'));
  return matchQuery&&(statusFilter==='all'||item.status===statusFilter);
 });

 if(!isSupabaseConfigured)return <main className="admin-shell"><div className="admin-login"><Archive/><h1>Bağlantı ayarı eksik</h1><p>Yönetim paneli için Supabase bağlantı değerlerini site ortamına ekleyin.</p></div></main>;
 if(!authReady)return <main className="admin-shell"><div className="admin-loading"><RefreshCw/> Yönetim paneli hazırlanıyor…</div></main>;
 if(!session)return <main className="admin-shell"><section className="admin-login"><div className="admin-login-brand"><span>KV</span><div><b>Koku Vitrini</b><small>GÜVENLİ YÖNETİM PANELİ</small></div></div><ShieldCheck/><h1>Yönetici girişi</h1><p>Ürün, fiyat, stok, görsel ve SEO bilgilerini tek yerden yönetin.</p><form onSubmit={signIn}><Field label="E-posta"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required/></Field><Field label="Parola"><input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></Field>{authError&&<p className="admin-error">{authError}</p>}<button className="admin-primary" disabled={busy}><KeyRound/> {busy?'Kontrol ediliyor…':'Giriş yap'}</button></form><small>Bu sayfa arama motorlarına kapalıdır. Giriş bilgilerinizi kimseyle paylaşmayın.</small></section></main>;
 if(!isAdmin)return <main className="admin-shell"><section className="admin-login"><X/><h1>Yönetici yetkisi bulunamadı</h1><p>Bu hesap giriş yaptı ancak yönetici listesinde yer almıyor.</p>{authError&&<p className="admin-error">{authError}</p>}<button className="admin-secondary" onClick={signOut}>Çıkış yap</button></section></main>;

 return <main className="admin-shell">
  <header className="admin-top"><a href="/" target="_blank" rel="noreferrer"><span>KV</span><div><b>Koku Vitrini</b><small>YÖNETİM PANELİ</small></div></a><div><small>{session.user.email}</small><button onClick={signOut}><LogOut/> Çıkış</button></div></header>
  <div className="admin-layout">
   <aside className="admin-nav"><button className={active==='dashboard'?'active':''} onClick={()=>setActive('dashboard')}><LayoutDashboard/> Genel Bakış</button><button className={active==='products'?'active':''} onClick={()=>setActive('products')}><PackagePlus/> Ürünler <b>{products.length}</b></button><button className={active==='brands'?'active':''} onClick={()=>setActive('brands')}><Tags/> Markalar <b>{brands.length}</b></button><button className={active==='categories'?'active':''} onClick={()=>setActive('categories')}><Archive/> Kategoriler <b>{categories.length}</b></button><a href="/" target="_blank" rel="noreferrer">Mağazayı görüntüle <ChevronRight/></a></aside>
   <section className="admin-content">
    {message&&<div className="admin-toast success"><Check/>{message}</div>}{error&&<div className="admin-toast error"><X/>{error}</div>}{busy&&<div className="admin-progress"><i/></div>}

    {active==='dashboard'&&<><div className="admin-heading"><div><p>GENEL BAKIŞ</p><h1>Mağaza yönetimi</h1><span>Ürün kataloğunuzun yayın ve SEO durumunu buradan takip edin.</span></div><button className="admin-primary" onClick={startNew}><Plus/> Yeni ürün</button></div><div className="admin-stats"><article><PackagePlus/><span><b>{products.length}</b>Toplam ürün</span></article><article><Check/><span><b>{products.filter(p=>p.status==='published').length}</b>Yayında</span></article><article><Archive/><span><b>{products.filter(p=>p.status==='draft').length}</b>Taslak</span></article><article><ImagePlus/><span><b>{products.filter(p=>p.main_image_url).length}</b>Görselli ürün</span></article></div><div className="admin-dashboard-grid"><article><h2>Hızlı başlangıç</h2><p>Örnek vitrindeki ürünleri veritabanına tek tıkla aktarın; ardından her ürüne gerçek fotoğrafları ve doğru bilgileri ekleyin.</p><button className="admin-secondary" onClick={importSamples} disabled={busy}><UploadCloud/> Örnek kataloğu aktar</button></article><article><h2>Yayın kontrol listesi</h2><ul><li><Check/> Gerçek ürün fotoğrafları</li><li><Check/> Marka ve kategori ilişkileri</li><li><Check/> Özgün ürün açıklamaları</li><li><Check/> Stok, fiyat ve ürün kodu</li></ul></article></div></>}

    {active==='products'&&<><div className="admin-heading"><div><p>ÜRÜN KATALOĞU</p><h1>{form.id?'Ürünü düzenle':'Yeni ürün ekle'}</h1><span>{form.id?'Değişiklikleri kaydedin; yayın durumu anında güncellenir.':'Ürün bilgilerini tamamlayın, görselleri kayıt sonrasında yükleyin.'}</span></div><div>{form.id&&<button className="admin-secondary" onClick={startNew}><Plus/> Yeni</button>}<button className="admin-primary" form="product-form" disabled={busy}><Save/> Kaydet</button></div></div><div className="admin-product-layout"><div className="admin-product-editor"><form id="product-form" className="admin-form" onSubmit={saveProduct}><section><h2>Temel bilgiler</h2><div className="admin-form-grid"><Field label="Ürün adı"><input value={form.name} onChange={e=>{update('name',e.target.value);if(!form.slug)update('slug',slugify(e.target.value))}} required/></Field><Field label="Bağlantı adı" hint="Örnek: afnan-9-pm-100-ml"><input value={form.slug} onChange={e=>update('slug',slugify(e.target.value))} required/></Field><Field label="Marka"><select value={form.brand_id||''} onChange={e=>update('brand_id',e.target.value)}><option value="">Marka seçin</option>{brands.map(item=><option value={item.id} key={item.id}>{item.name}</option>)}</select></Field><Field label="Kategori"><select value={form.category_id||''} onChange={e=>update('category_id',e.target.value)}><option value="">Kategori seçin</option>{categories.map(item=><option value={item.id} key={item.id}>{item.name}</option>)}</select></Field><Field label="Kullanıcı grubu"><select value={form.gender} onChange={e=>update('gender',e.target.value)}>{['Erkek','Kadın','Unisex','Set'].map(item=><option key={item}>{item}</option>)}</select></Field><Field label="Koku ailesi"><input value={form.family} onChange={e=>update('family',e.target.value)} placeholder="Odunsu, Gurme, Fresh…" required/></Field><Field label="Boyut"><input value={form.size} onChange={e=>update('size',e.target.value)} required/></Field><Field label="Rozet"><input value={form.badge||''} onChange={e=>update('badge',e.target.value)} placeholder="Yeni, Çok Satan…"/></Field></div></section><section><h2>Fiyat ve stok</h2><div className="admin-form-grid"><Field label="Satış fiyatı (₺)"><input type="number" min="0" step="0.01" value={form.price} onChange={e=>update('price',e.target.value)} required/></Field><Field label="Eski fiyat (₺)"><input type="number" min="0" step="0.01" value={form.old_price} onChange={e=>update('old_price',e.target.value)}/></Field><Field label="Stok adedi"><input type="number" min="0" value={form.stock} onChange={e=>update('stock',e.target.value)} required/></Field><Field label="Vitrin sırası"><input type="number" min="0" value={form.sort_order} onChange={e=>update('sort_order',e.target.value)}/></Field><Field label="Yayın durumu"><select value={form.status} onChange={e=>update('status',e.target.value)}><option value="draft">Taslak</option><option value="published">Yayında</option><option value="archived">Arşiv</option></select></Field><Field label="Vitrinde öne çıkar"><span className="admin-switch"><input type="checkbox" checked={form.is_featured} onChange={e=>update('is_featured',e.target.checked)}/><i/><b>{form.is_featured?'Evet':'Hayır'}</b></span></Field></div></section><section><h2>Koku profili</h2><div className="admin-form-grid"><Field label="Nota listesi" wide hint="Virgülle ayırın: Bergamot, Vanilya, Amber"><input value={form.notes} onChange={e=>update('notes',e.target.value)}/></Field><Field label="Mevsimler" wide hint="Virgülle ayırın: İlkbahar, Yaz"><input value={form.seasons} onChange={e=>update('seasons',e.target.value)}/></Field><Field label="Kullanım ortamları" wide hint="Virgülle ayırın: Günlük, Ofis, Akşam"><input value={form.occasions} onChange={e=>update('occasions',e.target.value)}/></Field><Field label="Yoğunluk"><select value={form.intensity} onChange={e=>update('intensity',e.target.value)}>{['Hafif','Orta','Güçlü'].map(item=><option key={item}>{item}</option>)}</select></Field><Field label="Kalıcılık"><input value={form.longevity||''} onChange={e=>update('longevity',e.target.value)} placeholder="Örn. 6–8 saat"/></Field><Field label="Yayılım"><input value={form.sillage||''} onChange={e=>update('sillage',e.target.value)} placeholder="Örn. Orta / Güçlü"/></Field><Field label="Ürün rengi"><input type="color" value={form.color} onChange={e=>update('color',e.target.value)}/></Field></div></section><section><h2>Açıklamalar</h2><div className="admin-form-grid"><Field label="Kısa ürün açıklaması" wide hint={`${form.short_description.length}/160 karakter`}><textarea rows="3" maxLength="180" value={form.short_description} onChange={e=>update('short_description',e.target.value)} required/></Field><Field label="Detaylı, özgün ürün açıklaması" wide hint={`${form.description.length} karakter`}><textarea rows="8" value={form.description} onChange={e=>update('description',e.target.value)} required/></Field></div></section><section><h2>Ürün kodları</h2><div className="admin-form-grid"><Field label="Stok kodu (SKU)"><input value={form.sku||''} onChange={e=>update('sku',e.target.value)}/></Field><Field label="Barkod (GTIN/EAN)"><input value={form.gtin||''} onChange={e=>update('gtin',e.target.value)}/></Field><Field label="Üretici parça no (MPN)"><input value={form.mpn||''} onChange={e=>update('mpn',e.target.value)}/></Field></div></section><section><h2>Google ve SEO</h2><div className="admin-form-grid"><Field label="SEO başlığı" wide hint={`${form.meta_title.length}/65 karakter`}><input maxLength="70" value={form.meta_title||''} onChange={e=>update('meta_title',e.target.value)} placeholder={`${form.name||'Ürün adı'} | Koku Vitrini`}/></Field><Field label="SEO açıklaması" wide hint={`${form.meta_description.length}/165 karakter`}><textarea rows="3" maxLength="170" value={form.meta_description||''} onChange={e=>update('meta_description',e.target.value)}/></Field><Field label="Görsel açıklaması (alt metin)" wide><input value={form.image_alt||''} onChange={e=>update('image_alt',e.target.value)} placeholder="Marka + ürün + boyut + ürün tipi"/></Field></div><SeoScore form={form}/></section></form>{form.id&&<section className="admin-images"><div><h2>Ürün görselleri</h2><p>En iyi sonuç için kare, en az 1200×1200 px ve WebP/JPG görsel kullanın. Her dosya en fazla 5 MB.</p></div><label className="admin-upload"><ImagePlus/><b>Görsel yükle</b><small>Birden fazla seçebilirsiniz</small><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={uploadImages}/></label><div className="admin-image-grid">{(form.product_images||[]).sort((a,b)=>a.sort_order-b.sort_order).map(image=><article className={image.is_primary?'primary':''} key={image.id}><img src={image.url} alt={image.alt_text}/><div>{image.is_primary?<b><Star/> Kapak görseli</b>:<button onClick={()=>makePrimary(image)}><Star/> Kapak yap</button>}<button className="danger" onClick={()=>deleteImage(image)}><Trash2/> Sil</button></div></article>)}</div></section>}</div><aside className="admin-product-list"><div className="admin-list-tools"><label><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ürün ara"/></label><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="all">Tüm durumlar</option><option value="published">Yayında</option><option value="draft">Taslak</option><option value="archived">Arşiv</option></select></div>{filtered.length?filtered.map(item=><article className={form.id===item.id?'selected':''} key={item.id}><button className="admin-product-select" onClick={()=>editProduct(item)}><span className="admin-list-image">{item.main_image_url?<img src={item.main_image_url} alt=""/>:<PackagePlus/>}</span><span><b>{item.name}</b><small>{item.brands?.name||'Markasız'} · {item.size}</small><em className={item.status}>{item.status==='published'?'Yayında':item.status==='draft'?'Taslak':'Arşiv'}</em></span></button><button className="admin-icon danger" onClick={()=>deleteProduct(item)} aria-label={`${item.name} ürününü sil`}><Trash2/></button></article>):<EmptyState title="Ürün bulunamadı" copy="Arama veya durum filtresini değiştirin."/>}</aside></div></>}

    {active==='brands'&&<><div className="admin-heading"><div><p>MARKALAR</p><h1>Marka yönetimi</h1><span>Marka sayfaları ve SEO metinlerini buradan yönetin.</span></div></div><div className="admin-lookup-layout"><form className="admin-form admin-lookup-form" onSubmit={saveBrand}><h2>{brandDraft.id?'Markayı düzenle':'Yeni marka'}</h2><Field label="Marka adı"><input value={brandDraft.name} onChange={e=>setBrandDraft({...brandDraft,name:e.target.value,slug:brandDraft.slug||slugify(e.target.value)})} required/></Field><Field label="Bağlantı adı"><input value={brandDraft.slug} onChange={e=>setBrandDraft({...brandDraft,slug:slugify(e.target.value)})} required/></Field><Field label="Marka açıklaması"><textarea rows="5" value={brandDraft.description} onChange={e=>setBrandDraft({...brandDraft,description:e.target.value})}/></Field><Field label="SEO başlığı"><input value={brandDraft.meta_title||''} onChange={e=>setBrandDraft({...brandDraft,meta_title:e.target.value})}/></Field><Field label="SEO açıklaması"><textarea rows="3" value={brandDraft.meta_description||''} onChange={e=>setBrandDraft({...brandDraft,meta_description:e.target.value})}/></Field><button className="admin-primary"><Save/> Markayı kaydet</button></form><div className="admin-lookup-list">{brands.map(item=><article key={item.id}><div><b>{item.name}</b><small>/{item.slug}</small><p>{item.description}</p></div><span><button className="admin-icon" onClick={()=>setBrandDraft(item)}><Pencil/></button><button className="admin-icon danger" onClick={()=>deleteLookup('brands',item)}><Trash2/></button></span></article>)}</div></div></>}

    {active==='categories'&&<><div className="admin-heading"><div><p>KATEGORİLER</p><h1>Kategori yönetimi</h1><span>Koleksiyon sayfalarının başlık ve açıklamalarını yönetin.</span></div></div><div className="admin-lookup-layout"><form className="admin-form admin-lookup-form" onSubmit={saveCategory}><h2>{categoryDraft.id?'Kategoriyi düzenle':'Yeni kategori'}</h2><Field label="Kategori adı"><input value={categoryDraft.name} onChange={e=>setCategoryDraft({...categoryDraft,name:e.target.value,slug:categoryDraft.slug||slugify(e.target.value)})} required/></Field><Field label="Bağlantı adı"><input value={categoryDraft.slug} onChange={e=>setCategoryDraft({...categoryDraft,slug:slugify(e.target.value)})} required/></Field><Field label="Kategori açıklaması"><textarea rows="5" value={categoryDraft.description} onChange={e=>setCategoryDraft({...categoryDraft,description:e.target.value})}/></Field><Field label="SEO başlığı"><input value={categoryDraft.meta_title||''} onChange={e=>setCategoryDraft({...categoryDraft,meta_title:e.target.value})}/></Field><Field label="SEO açıklaması"><textarea rows="3" value={categoryDraft.meta_description||''} onChange={e=>setCategoryDraft({...categoryDraft,meta_description:e.target.value})}/></Field><button className="admin-primary"><Save/> Kategoriyi kaydet</button></form><div className="admin-lookup-list">{categories.map(item=><article key={item.id}><div><b>{item.name}</b><small>/{item.slug}</small><p>{item.description}</p></div><span><button className="admin-icon" onClick={()=>setCategoryDraft(item)}><Pencil/></button><button className="admin-icon danger" onClick={()=>deleteLookup('categories',item)}><Trash2/></button></span></article>)}</div></div></>}
   </section>
  </div>
 </main>;
}
