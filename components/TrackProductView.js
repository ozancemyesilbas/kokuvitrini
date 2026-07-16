'use client';
import {useEffect} from 'react';

export default function TrackProductView({slug}){
 useEffect(()=>{try{const current=JSON.parse(localStorage.getItem('kv-recent')||'[]').filter(x=>x!==slug);localStorage.setItem('kv-recent',JSON.stringify([slug,...current].slice(0,8)))}catch{}},[slug]);
 return null;
}
