import {SITE_URL} from '../lib/catalog';
export const dynamic='force-static';
export default function robots(){return {rules:[{userAgent:'*',allow:'/',disallow:['/hesabim','/*?sort=','/*?q=','/*?filter=']}],sitemap:`${SITE_URL}/sitemap.xml`,host:SITE_URL}}
