import AdminPanel from '../../components/AdminPanel';

export const metadata={title:'Yönetim Paneli',description:'Koku Vitrini güvenli katalog yönetimi.',robots:{index:false,follow:false,noarchive:true,nosnippet:true},alternates:{canonical:'/yonetim'}};
export const dynamic='force-dynamic';

export default function Page(){
 const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL||'';
 const supabaseKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||'';
 return <AdminPanel supabaseUrl={supabaseUrl} supabaseKey={supabaseKey}/>;
}
