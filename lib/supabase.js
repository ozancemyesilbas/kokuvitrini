import {createClient} from '@supabase/supabase-js';

export const SUPABASE_URL=process.env.NEXT_PUBLIC_SUPABASE_URL||'';
export const SUPABASE_KEY=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||'';
export const isSupabaseConfigured=Boolean(SUPABASE_URL&&SUPABASE_KEY);

let browserClient;
export function getSupabaseBrowserClient(){
 if(!isSupabaseConfigured)return null;
 if(!browserClient)browserClient=createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 return browserClient;
}

