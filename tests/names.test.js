// Every script shares one global scope, so a function or top-level name declared twice
// silently replaces the first one. This catches that.
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..'),html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const files=[...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1]);
const seen={};let bad=0;
for(const f of files){const src=fs.readFileSync(path.join(ROOT,f),'utf8');
  for(const m of src.matchAll(/^(?:function\s+([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*))/gm)){const n=m[1]||m[2];
    if(seen[n]&&seen[n]!=f+':'+m.index){console.log('FAIL '+n+' is declared in both '+seen[n].split(':')[0]+' and '+f);bad++;}else seen[n]=f+':'+m.index;}}
console.log((bad?'FAIL ':'PASS ')+'no top-level name is declared twice across '+files.length+' scripts');
