import fs from 'node:fs';
import path from 'node:path';

const input=path.resolve(process.argv[2]||'data/urunler.csv');
const output=path.resolve(process.argv[3]||'lib/imported-products.js');
if(!fs.existsSync(input)){console.error(`Dosya bulunamadı: ${input}`);process.exit(1)}

const parse=text=>{
 const rows=[];let row=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){
  const char=text[i],next=text[i+1];
  if(char==='"'&&quoted&&next==='"'){cell+='"';i++;continue}
  if(char==='"'){quoted=!quoted;continue}
  if(char===';'&&!quoted){row.push(cell.trim());cell='';continue}
  if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&next==='\n')i++;row.push(cell.trim());cell='';if(row.some(Boolean))rows.push(row);row=[];continue}
  cell+=char;
 }
 if(cell||row.length){row.push(cell.trim());if(row.some(Boolean))rows.push(row)}
 return rows;
};
const slugify=value=>value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
const list=value=>(value||'').split('|').map(x=>x.trim()).filter(Boolean);
const number=value=>Number(String(value||0).replace(/\./g,'').replace(',','.'));
const rows=parse(fs.readFileSync(input,'utf8').replace(/^\uFEFF/,''));
if(rows.length<2){console.error('CSV dosyasında başlık dışında ürün bulunamadı.');process.exit(1)}
const headers=rows[0];
const required=['name','brand','gender','family','size','price','stock','short','description','notes','seasons','occasions','intensity'];
const products=rows.slice(1).map((row,index)=>Object.fromEntries(headers.map((header,i)=>[header,row[i]||'']))).map((p,index)=>{
 const missing=required.filter(field=>!p[field]);
 if(missing.length)throw new Error(`${index+2}. satırda eksik alanlar: ${missing.join(', ')}`);
 const slug=p.slug||slugify(`${p.name}-${p.brand}-${p.size}-${p.gender}-parfum`);
 return {slug,name:p.name,brand:p.brand,gender:p.gender,family:p.family,size:p.size,price:number(p.price),oldPrice:number(p.oldPrice)||number(p.price),color:p.color||'#77756d',badge:p.badge||'Yeni',rating:0,stock:number(p.stock),sku:p.sku||slug.toUpperCase().slice(0,32),gtin:p.gtin||undefined,image:p.image||undefined,intensity:p.intensity,longevity:p.longevity||undefined,sillage:p.sillage||undefined,notes:list(p.notes),short:p.short,description:p.description,finder:{notes:list(p.notes),seasons:list(p.seasons),occasions:list(p.occasions),intensity:p.intensity}};
});
const content=`// Bu dosya scripts/import-products.mjs tarafından oluşturuldu.\nexport const importedProducts = ${JSON.stringify(products,null,2)};\n`;
fs.writeFileSync(output,content);
console.log(`${products.length} ürün başarıyla aktarıldı → ${output}`);
