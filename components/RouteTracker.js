'use client';
import {useEffect} from 'react';

export default function RouteTracker(){
 useEffect(()=>{const match=window.location.pathname.match(/^\/urun\/([^/]+)$/);if(!match)return;try{const slug=decodeURIComponent(match[1]);const current=JSON.parse(localStorage.getItem('kv-recent')||'[]').filter(x=>x!==slug);localStorage.setItem('kv-recent',JSON.stringify([slug,...current].slice(0,8)))}catch{}},[]);
 return null;
}
