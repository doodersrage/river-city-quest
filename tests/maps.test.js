const G=require('./harness.js'),SC=G.SC,SOL=G.SOLID;let bad=0;
for(const id in SC){const s=SC[id];
  const m=s.g0.map(r=>r.map(c=>c=='#'?s.base:c));
  for(const d of s.dyn)for(const [x,y] of d.cells)m[y][x]=d.open;
  (s.braz||[]).forEach(([x,y])=>m[y][x]='j');for(const c of s.chests||[])m[c.ty][c.tx]='c';
  if(s.bossT){m[8][7]=m[8][8]='E';}
  for(let y=0;y<s.h;y++)for(let x=0;x<s.w;x++)if(m[y][x]=='b'||m[y][x]=='~'||m[y][x]=='_')m[y][x]=s.base; // bushes can be cut, kayak crosses rapids, the hook crosses pits
  const npc=new Set((s.npcs||[]).map(n=>n.tx+','+n.ty));
  const walk=(x,y)=>x>=0&&y>=0&&x<s.w&&y<s.h&&!SOL.includes(m[y][x])&&!npc.has(x+','+y);
  let start=null;for(let y=0;y<s.h&&!start;y++)for(let x=0;x<s.w;x++)if((y==0||y==s.h-1||x==0||x==s.w-1)&&walk(x,y)){start=[x,y];break;}
  if(!start)for(let y=0;y<s.h&&!start;y++)for(let x=0;x<s.w;x++)if(m[y][x]=='E'){start=[x,y];break;}
  if(!start){console.log('NO START',id);bad++;continue;}
  const seen=new Set([start+'']),q=[start];
  while(q.length){const [x,y]=q.pop();for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const k=(x+a)+','+(y+b);if(walk(x+a,y+b)&&!seen.has(k)){seen.add(k);q.push([x+a,y+b]);}}}
  // grappling hook: from a reachable cell, fire in a straight line over water or pits to an iron post and land in front of it
  for(let grew=true;grew;){grew=false;
    for(const k of [...seen]){const [x0,y0]=k.split(',').map(Number);
      for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){for(let d=1;d<=6;d++){const x=x0+a*d,y=y0+b*d;if(x<0||y<0||x>=s.w||y>=s.h)break;const t=s.g0[y][x];
        if(t=='+'){const lx=x-a,ly=y-b,lk=lx+','+ly;if(d>1&&walk(lx,ly)&&!seen.has(lk)){seen.add(lk);const q2=[[lx,ly]];while(q2.length){const [qx,qy]=q2.pop();for(const [c,e] of [[1,0],[-1,0],[0,1],[0,-1]]){const kk=(qx+c)+','+(qy+e);if(walk(qx+c,qy+e)&&!seen.has(kk)){seen.add(kk);q2.push([qx+c,qy+e]);}}}grew=true;}break;}
        if(SOL.includes(t)&&!'_w~'.includes(t))break;}}}}
  const reach=(x,y)=>seen.has(x+','+y),adj=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>reach(x+a,y+b));
  const chk=(what,x,y,needAdj)=>{if(needAdj?!adj(x,y):!reach(x,y)){console.log('UNREACHABLE',id,what,x,y);bad++;}};
  for(let y=0;y<s.h;y++)for(let x=0;x<s.w;x++){const t=m[y][x];if((y==0||y==s.h-1||x==0||x==s.w-1)&&walk(x,y))chk('edge',x,y);if('DE'.includes(t))chk('door '+t,x,y);}
  for(const n of s.npcs||[])chk('npc '+n.who,n.tx,n.ty,true);
  for(const k in s.reads){const [x,y]=k.split(',').map(Number);chk('read '+s.reads[k],x,y,true);}
  for(const c of s.chests||[])chk('chest '+c.item,c.tx,c.ty,true);
  if(id!='ow:0,2')for(const [x,y] of s.spots||[])chk('challenge spot',x,y);
  for(const [x,y] of (s.lamps||[]).concat(s.murals||[]))chk('lamp/mural',x,y,true);
  (s.braz||[]).forEach(([x,y])=>chk('brazier',x,y,true));
  for(const it of s.items||[]){if(it.kind=='skey'||it.id.startsWith('pc:ow:0,2'))continue;chk('item '+it.id,it.tx,it.ty);}
  for(const [t,x,y] of s.en)if(!'bat ghost raven vampire wraith bell'.includes(t)&&!walk(x,y)){console.log('ENEMY IN WALL',id,t,x,y);bad++;}
  for(const d of s.doors||[]){if(!SC[d.to]){console.log('BAD DOOR',id,d.to);bad++;}if(!walk(d.ret[0],d.ret[1])){console.log('BAD RET',id,d.ret);bad++;}}
}
// cross-map edge alignment: every walkable edge cell must land on a walkable cell next door
const dirs=[['E',1,0],['W',-1,0],['S',0,1],['N',0,-1]];
for(const id in SC){const s=SC[id];if(!s.ow)continue;
  for(const [d,dx,dy] of dirs){const nid='ow:'+(s.ax+dx)+','+(s.ay+dy),n=SC[nid];
    for(let k=0;k<(dx?s.h:s.w);k++){const x=dx>0?s.w-1:dx<0?0:k,y=dy>0?s.h-1:dy<0?0:k,t=s.g0[y][x];
      if(SOL.replace('~','').includes(t))continue;
      if(!n){console.log('EDGE TO NOWHERE',id,d,x,y,t);bad++;continue;}
      const nx=dx>0?0:dx<0?n.w-1:x,ny=dy>0?0:dy<0?n.h-1:y,nt=n.g0[ny][nx];
      if(SOL.replace('~','').includes(nt)){console.log('EDGE MISMATCH',id,'->',nid,x,y,t,'lands on',nt);bad++;}}}}
const LO=new Set(G.LORE.map(l=>l[0]));
for(const id in SC){const s=SC[id];for(const r of Object.values(s.reads).concat(Object.values(s.readsT||{})))if(r[0]!='!'&&!LO.has(r)){console.log('MISSING LORE',id,r);bad++;}}
console.log('problems',bad,'scenes',Object.keys(SC).length,'lore',G.LORE.length,'pieces',Object.values(SC).reduce((a,s)=>a+s.items.filter(i=>i.kind=='piece').length+(s.chests||[]).filter(c=>c.item=='piece').length,0));
