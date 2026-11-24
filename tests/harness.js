// Loads the game into a Node VM, one script at a time in the same order as index.html,
// with a stand-in canvas. Exposes the game's test hook (window.__g).
const fs=require('fs'),vm=require('vm'),path=require('path');
const ROOT=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const files=[...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1]);
const ctxp=new Proxy({},{get:(t,k)=>k in t?t[k]:()=>ctxp,set:(t,k,v)=>{t[k]=v;return true}});
const el=()=>({width:0,height:0,getContext:()=>ctxp,addEventListener(){},style:{},classList:{add(){},remove(){}},getBoundingClientRect:()=>({left:0,top:0,width:100,height:100}),setPointerCapture(){},setAttribute(){}});
const sb={document:{getElementById:el,createElement:el,fonts:null,addEventListener(){},hidden:false},addEventListener(){},requestAnimationFrame(){},setInterval(){},
  Math,console,JSON,Set,Map,Object,Array,String,Number,Error,performance,navigator:{},location:{protocol:'file:',hostname:''}};
sb.window=sb;vm.createContext(sb);
for(const f of files)vm.runInContext(fs.readFileSync(path.join(ROOT,f),'utf8'),sb,{filename:f});
module.exports=sb.__g;
