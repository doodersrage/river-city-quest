// Runs every test file and fails if any check fails.
const {spawnSync}=require('child_process'),fs=require('fs'),path=require('path');
let bad=0;
for(const f of fs.readdirSync(__dirname).filter(f=>f.endsWith('.test.js')).sort()){
  const r=spawnSync(process.execPath,[path.join(__dirname,f)],{encoding:'utf8'});const out=(r.stdout||'')+(r.stderr||'');
  const pass=(out.match(/^PASS /gm)||[]).length,fail=out.split('\n').filter(l=>/^FAIL |^ERR |problems [1-9]|Error/.test(l));
  if(r.status||fail.length){bad++;console.log('x '+f+'\n'+fail.concat(r.status&&!fail.length?[out.slice(-2000)]:[]).map(l=>'   '+l).join('\n'));}
  else console.log('ok '+f+(pass?' ('+pass+' checks)':'')+(out.match(/problems 0.*/)?' '+out.match(/problems 0.*/)[0]:''));}
process.exit(bad?1:0);
