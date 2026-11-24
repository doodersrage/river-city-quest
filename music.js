"use strict";
/* River City Quest: chiptune sequencer. Each token is an eighth note; "-" holds the previous note, "." rests. */
const SONGS={
  title:{bpm:88,
    lead:'A4 - C5 - E5 - D5 C5 | B4 - G4 - E4 - - - | F4 - A4 - C5 - B4 A4 | G#4 - - - E4 - - - | A4 - C5 - E5 - A5 G5 | F5 - E5 - D5 - C5 - | B4 - C5 - D5 - E5 - | A4 - - - - - . .',
    bass:'A2 . E3 . A2 . E3 . | E2 . B2 . E2 . B2 . | F2 . C3 . F2 . C3 . | E2 . B2 . E2 . G#2 . | A2 . E3 . A2 . E3 . | D2 . A2 . D2 . A2 . | E2 . B2 . E2 . B2 . | A2 . E3 . A2 . . .',drum:''},
  city:{bpm:132,
    lead:'C5 - G4 C5 E5 - D5 C5 | D5 - G4 B4 D5 - C5 B4 | A4 - E4 A4 C5 - B4 A4 | G4 - - - D5 - B4 - | F4 - A4 C5 F5 - E5 D5 | E5 - C5 E5 G5 - F5 E5 | D5 - B4 G4 A4 B4 C5 D5 | C5 - - - - - . .',
    bass:'C3 . G3 . C3 . G3 . | G2 . D3 . G2 . D3 . | A2 . E3 . A2 . E3 . | G2 . D3 . G2 . B2 . | F2 . C3 . F2 . C3 . | C3 . G3 . C3 . E3 . | G2 . D3 . G2 . D3 . | C3 . G2 . C3 . . .',
    drum:'k . h . s . h h'},
  south:{bpm:120,
    lead:'F4 - A4 C5 - A4 F4 - | G4 - Bb4 D5 - C5 Bb4 - | A4 - C5 F5 - E5 D5 C5 | D5 - - - C5 - - - | Bb4 - D5 F5 - D5 Bb4 - | A4 - C5 F5 - C5 A4 - | G4 - A4 Bb4 C5 - E4 - | F4 - - - - - . .',
    bass:'F2 . C3 . F2 . C3 . | Bb1 . F2 . Bb1 . F2 . | F2 . C3 . F2 . C3 . | C2 . G2 . C2 . G2 . | Bb1 . F2 . Bb1 . F2 . | F2 . C3 . F2 . C3 . | C2 . G2 . C2 . E2 . | F2 . C3 . F2 . . .',
    drum:'k . h . s . h .'},
  dungeon:{bpm:96,
    lead:'D5 - - - A4 - - - | F4 - E4 - D4 - - - | C5 - - - G4 - - - | A4 - - - - - - - | D5 - - - A4 - - - | Bb4 - A4 - G4 - - - | F4 - E4 - C#4 - - - | D4 - - - - - - -',
    bass:'D2 . . . D2 . . . | D2 . . . D2 . . . | C2 . . . C2 . . . | A1 . . . A1 . . . | Bb1 . . . Bb1 . . . | G1 . . . G1 . . . | A1 . . . A1 . . . | D2 . . . D2 . . .',
    drum:'k . . . . . . . . . . . h . . .'},
  boss:{bpm:150,
    lead:'E5 E5 G5 E5 F#5 E5 D5 B4 | E5 E5 G5 E5 A5 G5 F#5 D5 | C5 C5 E5 C5 D5 C5 B4 G4 | B4 - D#5 - F#5 - B5 -',
    bass:'E2 E3 E2 E3 E2 E3 E2 E3 | E2 E3 E2 E3 D2 D3 D2 D3 | C2 C3 C2 C3 C2 C3 C2 C3 | B1 B2 B1 B2 B1 B2 B1 B2',
    drum:'k h s h k k s h'},
  night:{bpm:72,lt:'triangle',lv:.05,
    lead:'E5 - - - C5 - - - | D5 - B4 - G4 - - - | C5 - - - A4 - - - | B4 - - - - - - - | E5 - - - G5 - - - | F5 - E5 - D5 - - - | C5 - B4 - A4 - - - | A4 - - - - - . .',
    bass:'A2 . . . E3 . . . | G2 . . . D3 . . . | F2 . . . C3 . . . | E2 . . . B2 . . . | A2 . . . E3 . . . | D2 . . . A2 . . . | E2 . . . B2 . . . | A2 . . . . . . .',drum:''},
  forge:{bpm:108,
    lead:'E4 - E4 G4 - E4 A4 - | G4 - E4 - D4 - E4 - | E4 - E4 G4 - E4 B4 - | A4 - G4 - F#4 - E4 - | C5 - B4 - A4 - G4 - | A4 - G4 - F#4 - D4 - | E4 - E4 G4 - E4 A4 - | B4 - - - E4 - . .',
    bass:'E2 E2 . E2 E2 . E2 . | E2 E2 . E2 D2 . D2 . | E2 E2 . E2 E2 . E2 . | E2 E2 . E2 B1 . B1 . | A1 A1 . A1 A1 . A1 . | D2 D2 . D2 D2 . D2 . | E2 E2 . E2 E2 . E2 . | B1 B1 . B1 E2 . . .',
    drum:'k . s . k k s .'},
  win:{bpm:120,
    lead:'C5 - E5 - G5 - C6 - | B5 - G5 - E5 - G5 - | A5 - F5 - C5 - A5 - | G5 - - - - - - - | F5 - A5 - C6 - A5 - | G5 - E5 - C5 - E5 - | D5 - G5 - B5 - D6 - | C6 - - - - - . .',
    bass:'C3 . G3 . C3 . G3 . | E3 . B2 . E3 . B2 . | F2 . C3 . F2 . C3 . | G2 . D3 . G2 . D3 . | F2 . C3 . F2 . C3 . | C3 . G3 . C3 . G3 . | G2 . D3 . G2 . D3 . | C3 . G2 . C3 . . .',
    drum:'k . h . s . h .'}
};
const toks=s=>s.replace(/\|/g,' ').split(/\s+/).filter(Boolean);
for(const k in SONGS){const s=SONGS[k];s.L=toks(s.lead);s.B=toks(s.bass);s.D=toks(s.drum);}
function noteHz(n){const m=/^([A-G])(#|b)?(\d)$/.exec(n);if(!m)return 0;
  const k={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]=='#'?1:m[2]=='b'?-1:0);return 440*Math.pow(2,(k-9)/12+(+m[3]-4));}
var mus={name:'',step:0,next:0,gain:null,noise:null};
function musicVolume(on){if(mus&&mus.gain&&ac)mus.gain.gain.setTargetAtTime(on?1:0,ac.currentTime,.05);}
function wantSong(){
  if(mode=='title')return'title';if(mode=='win')return'win';if(!cur)return'';
  if(enemies.some(e=>e.boss))return'boss';
  if(cur.ow)return typeof dark=='function'&&dark()>.6?'night':cur.ay==3?'south':'city';
  return cur.lit?'city':cur.area=='tredegar'?'forge':'dungeon';
}
function voice(f,t,len,type,vol){const o=ac.createOscillator(),gn=ac.createGain();o.type=type;o.frequency.value=f;
  gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(vol,t+.01);gn.gain.setValueAtTime(vol,t+len*.7);gn.gain.linearRampToValueAtTime(0,t+len*.97);
  o.connect(gn);gn.connect(mus.gain);o.start(t);o.stop(t+len);}
function drum(kind,t){
  if(kind=='k'){const o=ac.createOscillator(),gn=ac.createGain();o.type='sine';o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(40,t+.12);
    gn.gain.setValueAtTime(.12,t);gn.gain.exponentialRampToValueAtTime(.001,t+.14);o.connect(gn);gn.connect(mus.gain);o.start(t);o.stop(t+.15);return;}
  if(!mus.noise){const b=ac.createBuffer(1,ac.sampleRate*.3,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;mus.noise=b;}
  const s=ac.createBufferSource(),f=ac.createBiquadFilter(),gn=ac.createGain();s.buffer=mus.noise;
  f.type=kind=='s'?'bandpass':'highpass';f.frequency.value=kind=='s'?1800:7000;const d=kind=='s'?.12:.04,v=kind=='s'?.05:.018;
  gn.gain.setValueAtTime(v,t);gn.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f);f.connect(gn);gn.connect(mus.gain);s.start(t);s.stop(t+d+.01);
}
function holdLen(arr,i){let n=1;while(arr[(i+n)%arr.length]=='-'&&n<arr.length)n++;return n;}
function musicTick(){
  if(!ac||ac.state!='running')return;
  if(!mus.gain){mus.gain=ac.createGain();mus.gain.gain.value=musicOn?1:0;mus.gain.connect(ac.destination);}
  const want=wantSong();
  if(want!=mus.name){mus.name=want;mus.step=0;mus.next=ac.currentTime+.08;}
  const s=SONGS[mus.name];if(!s)return;
  const dt=60/s.bpm/2;
  while(mus.next<ac.currentTime+.15){const t=mus.next,i=mus.step;
    if(musicOn){
      const l=s.L[i%s.L.length];if(l&&l!='-'&&l!='.')voice(noteHz(l),t,dt*holdLen(s.L,i%s.L.length),s.lt||'square',s.lv||.022);
      const b=s.B[i%s.B.length];if(b&&b!='-'&&b!='.')voice(noteHz(b),t,dt*holdLen(s.B,i%s.B.length)*.9,'triangle',.07);
      if(s.D.length){const d=s.D[i%s.D.length];if(d=='k'||d=='s'||d=='h')drum(d,t);}}
    mus.next+=dt;mus.step=(i+1)%Math.max(s.L.length,s.B.length);}
}
function pickSong(){}
/* weather and night ambience: looped noise through filters, plus crickets */
var amb={};
function noiseBuf(){if(!mus.noise2){const b=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){const w=Math.random()*2-1;l=l*.97+w*.03;d[i]=w*.6+l*4;}mus.noise2=b;}return mus.noise2;}
function ambTick(){
  if(!ac||ac.state!='running'||!mus.gain)return;
  if(!amb.rain){const mk=(type,freq,q)=>{const s=ac.createBufferSource(),f=ac.createBiquadFilter(),gn=ac.createGain();s.buffer=noiseBuf();s.loop=true;f.type=type;f.frequency.value=freq;f.Q.value=q;gn.gain.value=0;s.connect(f);f.connect(gn);gn.connect(mus.gain);s.start();return{f,gn};};
    amb.rain=mk('highpass',1200,.5);amb.wind=mk('lowpass',380,6);amb.t=0;}
  amb.t+=.025;const on=typeof mode!='undefined'&&mode=='play'&&cur&&cur.ow&&st,w=on?st.wx:'clear',k=on?st.wxk:0,now=ac.currentTime;
  amb.rain.gn.gain.setTargetAtTime(w=='rain'?.05*k:0,now,.5);
  const gust=.55+.45*Math.sin(amb.t*.7)*Math.sin(amb.t*.23);
  amb.wind.gn.gain.setTargetAtTime((w=='snow'||w=='fog')?.06*k*gust:0,now,.4);amb.wind.f.frequency.setTargetAtTime(260+240*gust,now,.3);
  if(on&&musicOn&&dark()>.6&&w!='rain'&&w!='snow'&&Math.random()<.025)for(let i=0;i<3;i++){const t=now+i*.07,o=ac.createOscillator(),gn=ac.createGain();o.type='sine';o.frequency.value=4300+Math.random()*300;
    gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(.006,t+.01);gn.gain.linearRampToValueAtTime(0,t+.04);o.connect(gn);gn.connect(mus.gain);o.start(t);o.stop(t+.05);}
}
function splashSfx(v,dl){if(!ac||!musicOn||ac.state!='running')return;try{const s=ac.createBufferSource(),f=ac.createBiquadFilter(),gn=ac.createGain(),t=ac.currentTime+(dl||0);s.buffer=noiseBuf();f.type='bandpass';f.frequency.setValueAtTime(1800,t);f.frequency.exponentialRampToValueAtTime(400,t+.25);
  gn.gain.setValueAtTime(.12*(v||1),t);gn.gain.exponentialRampToValueAtTime(.001,t+.3);s.connect(f);f.connect(gn);gn.connect(ac.destination);s.start(t);s.stop(t+.32);}catch(e){}}
setInterval(()=>{try{musicTick();ambTick();}catch(e){}},25);
