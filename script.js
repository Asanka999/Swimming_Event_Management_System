// ---------- Events (34) ----------
const EV=[],$=id=>document.getElementById(id);
['Men','Women'].forEach(g=>[50,100,200,400].forEach(d=>EV.push(d+'m Freestyle '+g)));
EV.push('1500m Freestyle Men','800m Freestyle Women');
['Butterfly','Backstroke','Breaststroke'].forEach(s=>[50,100,200].forEach(d=>['Men','Women'].forEach(g=>EV.push(d+'m '+s+' '+g))));
['Men','Women'].forEach(g=>EV.push('200m Individual Medley '+g));
['Women','Men'].forEach(g=>EV.push('4x50m Freestyle Relay '+g));
['Women','Men'].forEach(g=>EV.push('4x50m Medley Relay '+g));
// ---------- State ----------
let S={meet:{name:'Swimming Championship',date:''},sw:[],en:[]},T=0;
try{const j=localStorage.getItem('swimS2');if(j)S=JSON.parse(j)}catch(e){}
let BKI={t:0,d:0,rem:20,auto:0,s:0},FH=null,FHN='';
try{Object.assign(BKI,JSON.parse(localStorage.getItem('swimBk')||'{}'))}catch(e){}
const saveBki=()=>{try{localStorage.setItem('swimBk',JSON.stringify(BKI))}catch(e){}};
const save=q=>{let ok=true;try{localStorage.setItem('swimS2',JSON.stringify(S))}catch(e){ok=false}
 if(q===true)return;BKI.d++;saveBki();
 if(Date.now()-BKI.s>10*60000){BKI.s=Date.now();snap('Auto')}
 if(FH)autoFile();else if(BKI.auto&&BKI.d>=BKI.auto)exportJSON(true);else if(BKI.rem&&BKI.d%BKI.rem==0)toast();
 if(!ok)toast('⚠ Browser storage is full or blocked — download a backup now!')};
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
const ago=t=>{const m=Math.round((Date.now()-t)/60000);return m<1?'just now':m<60?m+' min ago':m<1440?Math.round(m/60)+' h ago':Math.round(m/1440)+' d ago'}
// ---- snapshots (safety copies kept in this browser, max 5)
const snaps=()=>{try{return JSON.parse(localStorage.getItem('swimSnap'))||[]}catch(e){return[]}};
function snap(label){if(!S.sw.length&&!S.en.length)return;const e={t:Date.now(),label,sw:S.sw.length,en:S.en.length,res:S.en.filter(x=>x.res!=null||x.st).length,data:S};
 for(const n of [5,3,1]){try{localStorage.setItem('swimSnap',JSON.stringify([e,...snaps()].slice(0,n)));return}catch(x){}}}
function restoreSnap(k){const a=snaps(),e=a[k];if(!e)return;if(!confirm('Restore snapshot "'+e.label+'" from '+new Date(e.t).toLocaleString()+'?\n'+e.sw+' swimmers · '+e.en+' entries · '+e.res+' results\n\nCurrent data is replaced (and kept as a new snapshot).'))return;
 const d=JSON.parse(JSON.stringify(e.data));snap('Before snapshot restore');S=d;PICK={};PE=-1;RC=new Set();save();render()}
function toast(m){let t=$('toast');if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t)}
 t.innerHTML=(m||'💾 '+BKI.d+' changes not backed up yet')+` <button onclick="exportJSON();$('toast').remove()">Download backup</button><button class="s" onclick="$('toast').remove()">✕</button>`}

let _u=0;const uid=()=>Date.now().toString(36)+(_u++).toString(36)+Math.random().toString(36).slice(2,5);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const isRelay=i=>EV[i].includes('Relay'),evG=i=>EV[i].endsWith('Women')?'W':'M';
const swr=id=>S.sw.find(s=>s.id==id),who=x=>x.sid?(swr(x.sid)||{n:'?',p:''}):x;
function pt(s){s=String(s||'').trim();if(!s)return NaN;const p=s.split(':').map(Number);if(p.some(isNaN))return NaN;return p.reduce((a,v)=>a*60+v,0)}
function ft(x){if(x==null)return'-';const m=Math.floor(x/60),s=(x-m*60).toFixed(2).padStart(5,'0');return m?m+':'+s:s}
const normG=g=>/^(f|w|g)/i.test((g||'').trim())?'W':'M';
const byEv=i=>S.en.filter(x=>x.e==i).sort((a,b)=>(a.seed??1e9)-(b.seed??1e9));
const ranked=i=>S.en.filter(x=>x.e==i&&x.res!=null).sort((a,b)=>a.res-b.res);
function heats(i){
 const L=+$('ln').value,a=byEv(i),n=a.length;if(!n)return[];
 const H=Math.ceil(n/L),g=Array.from({length:H},()=>[]);
 a.forEach((x,k)=>g[Math.floor(k/L)].push(x));
 if(H>1&&g[H-1].length==1)g[H-1].unshift(g[H-2].pop());
 const o=L==8?[4,5,3,6,2,7,1,8]:[3,4,2,5,1,6];
 return g.reverse().map(h=>h.map((x,k)=>({x,lane:o[k]})).sort((a,b)=>a.lane-b.lane));
}
// ---------- Look & feel helpers ----------
const STK=[['Freestyle','#0a86b8'],['Butterfly','#8e44ad'],['Backstroke','#16a085'],['Breaststroke','#e67e22'],['Individual Medley','#c0392b'],['Medley Relay','#34495e'],['Freestyle Relay','#2c3e50']];
const stk=i=>{const e=EV[i];if(e.includes('Medley Relay'))return STK[5];if(e.includes('Relay'))return STK[6];return STK.find(s=>e.includes(s[0]))};
const col=i=>stk(i)[1];
const short=i=>EV[i].replace(/ (Men|Women)$/,'').replace('Individual Medley','IM').replace('Freestyle','Free').replace('Butterfly','Fly').replace('Backstroke','Back').replace('Breaststroke','Breast');
const PAL=['#0a86b8','#e67e22','#8e44ad','#16a085','#c0392b','#2c7a3f','#d4a017','#34495e','#e84393','#6c5ce7','#00b894','#d35400'];
const hash=s=>[...String(s||'')].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7);
const pcol=p=>p&&String(p).trim()?PAL[hash(String(p).trim().toLowerCase())%PAL.length]:'#8fa2b3';
const ini=n=>String(n||'?').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const avatar=x=>{const w=who(x);return`<span class="av" style="background:${pcol(w.p)}">${esc(ini(w.n))}</span>`};
const MC=['#f5c542','#c7ced6','#d99a62'],PTS=[9,7,6,5,4,3,2,1];
const medal=r=>`<span class="medal ${r<4?'m'+r:''}">${r}</span>`;
const WAVE='<svg class="wv" viewBox="0 0 1200 40" preserveAspectRatio="none"><path d="M0 20 Q150 0 300 20 T600 20 T900 20 T1200 20 V40 H0Z" fill="var(--card)"/></svg>';
const banner=(kind,title,sub,c)=>`<div class="rh" style="--c:${c}"><div class="rtop"><span>🏊 ${esc(S.meet.name)}</span><span>${esc(S.meet.date)}</span></div><div class="rk">${kind}</div><h1>${title}</h1><div class="rs">${sub}</div>${WAVE}</div>`;
const evBan=(i,k)=>banner(k,'Event '+(i+1)+' · '+esc(EV[i]),(evG(i)=='W'?'♀ Women':'♂ Men')+' · '+byEv(i).length+(isRelay(i)?' teams':' swimmers'),col(i));
const rf=()=>`<div class="rf">Swim Meet Manager · generated ${new Date().toLocaleString()}</div>`;
const rep=(ban,body,pr)=>`<div class="rep">${ban}<div class="rb">${body}${pr?rf():''}</div></div>`;
// ---------- Header / nav ----------
function setMeet(){S.meet.name=$('mn').value;S.meet.date=$('md').value;save(true)}
function stats(){
 const done=EV.filter((_,i)=>S.en.some(x=>x.e==i)&&S.en.filter(x=>x.e==i).every(x=>x.res!=null||x.st)).length;
 const has=S.sw.length||S.en.length;
 const bk=FH?`<span class="chip" onclick="tab(6)" style="cursor:pointer">📁 auto-saving to file</span>`:
  `<span class="chip ${has&&(BKI.d>0||!BKI.t)?'warn':''}" onclick="tab(6)" style="cursor:pointer" title="Open Backup & Reset">${BKI.t?'💾 backup '+ago(BKI.t)+(BKI.d?' · ⚠ '+BKI.d+' unsaved changes':' ✓'):(has?'⚠ no backup yet':'💾 no backup yet')}</span>`;
 $('stats').innerHTML=[`👤 ${S.sw.length} swimmers`,`📝 ${S.en.length} entries`,`✅ ${S.en.filter(x=>x.res!=null||x.st).length} results`,`🏁 ${done}/34 events done`].map(t=>`<span class="chip">${t}</span>`).join('')+bk;
}
let GF='A',SF='';
const vis=i=>(GF=='A'||evG(i)==GF)&&(SF===''||stk(i)===STK[+SF]);
function setF(){GF=$('gf').value;SF=$('sf').value;render()}
function setG(g){GF=g;render()}
function setS(k){SF=k;render()}
const TABS=['1 · Swimmers','2 · Entries','3 · Heats & Times','4 · Results & PDF','5 · Summary & Charts','6 · Report Center','7 · Backup & Reset'];
function tab(n){T=n;render()}
function render(){
 let cur=+($('ev').value||0);const L=EV.map((_,i)=>i).filter(vis);if(!L.includes(cur))cur=L[0];
 $('gf').value=GF;$('sf').value=SF;
 $('ev').innerHTML=L.map(i=>{const e=EV[i];const a=S.en.filter(x=>x.e==i),d=a.filter(x=>x.res!=null||x.st).length;return`<option value="${i}">${i+1}. ${e} (${a.length}${a.length&&d==a.length?' ✓':''})</option>`}).join('');
 $('ev').value=cur;
 $('tabs').innerHTML=TABS.map((t,i)=>`<button class="${i==T?'on':''}" onclick="tab(${i})">${t}</button>`).join('');
 $('bar').style.display=(T==0||T>=4)?'none':'flex';
 $('mn').value=S.meet.name;$('md').value=S.meet.date;
 [vSwim,vEntry,vHeat,vRes,vSum,vRep,vReset][T]();stats();
}
// ---------- 1 Swimmers ----------
function vSwim(){
 $('v').innerHTML=`<div class="card"><h2>Add swimmer (demographic data)</h2><div class="row">
 <input id="n" placeholder="Name"><input id="p" placeholder="Province"><select id="g"><option value="M">Male</option><option value="W">Female</option></select><input id="c" placeholder="Club / School"><button onclick="addSw()">Add</button></div>
 <h3>Import Excel / CSV / paste</h3><p class="mut">Excel (.xlsx): sheet "Swimmers" (name, province, gender M/F, club) and optional sheet "Entries" (name, event no, seed time). Pasted text: one swimmer per line.</p>
 <textarea id="bk" rows="4" style="width:100%"></textarea>
 <div class="row"><button class="s" onclick="impSw($('bk').value)">Import pasted</button><label class="btn s">Upload CSV / Excel<input type="file" accept=".csv,.txt,.xlsx" hidden onchange="fileSw(this)"></label>
 <button class="s" onclick="if(confirm('Delete ALL swimmers and entries?')){snap('Before clear all');S.sw=[];S.en=[];save();render()}">Clear all</button></div></div>
 <div class="card sc"><div class="row"><h2 style="margin:0">Swimmers</h2><input id="q" placeholder="🔍 search" oninput="listSw()"><select id="qg" onchange="listSw()"><option value="">All</option><option value="M">♂ Men</option><option value="W">♀ Women</option></select></div><div id="sl"></div></div>`;listSw();
}
function listSw(){
 const q=($('q')?.value||'').toLowerCase(),g=$('qg')?.value||'',a=S.sw.filter(s=>(!g||s.g==g)&&(s.n+s.p+s.c).toLowerCase().includes(q));
 $('sl').innerHTML=`<table><tr><th>Name</th><th>Province</th><th>Gender</th><th>Club</th><th>Events</th><th></th></tr>${a.map(s=>`<tr><td><div class="nm"><span class="av" style="background:${pcol(s.p)}">${esc(ini(s.n))}</span>${esc(s.n)}</div></td><td>${esc(s.p)}</td><td>${s.g=='W'?'Female':'Male'}</td><td>${esc(s.c)}</td><td>${S.en.filter(x=>x.sid==s.id).length}</td><td><button class="s" onclick="delSw('${s.id}')">✕</button></td></tr>`).join('')}</table>`;
}
function addSw(){const n=$('n').value.trim();if(!n)return alert('Name needed');S.sw.push({id:uid(),n,p:$('p').value.trim(),g:$('g').value,c:$('c').value.trim()});save();render()}
function delSw(id){S.sw=S.sw.filter(s=>s.id!=id);S.en=S.en.filter(x=>x.sid!=id);save();render()}
function impSw(t,q){let c=0,sk=0;t.split(/\r?\n/).forEach((l,k)=>{const p=l.split(/,|\t/).map(s=>s.trim());if(!p[0]||(k==0&&/^name$/i.test(p[0])))return;
 const g=normG(p[2]);if(S.sw.some(w=>w.n.toLowerCase()==p[0].toLowerCase()&&w.g==g)){sk++;return}
 S.sw.push({id:uid(),n:p[0],p:p[1]||'',g,c:p[3]||''});c++});save();if(!q){alert(c+' swimmers imported'+(sk?' ('+sk+' duplicates skipped)':''));render()}return{c,sk}}
// ---- Excel (.xlsx) reader: no library needed (uses the browser's built-in DecompressionStream) ----
async function readXlsx(file){
 const buf=await file.arrayBuffer(),dv=new DataView(buf),u8=new Uint8Array(buf),td=new TextDecoder(),dp=t=>new DOMParser().parseFromString(t,'application/xml');
 let e=buf.byteLength-22;while(e>=0&&dv.getUint32(e,true)!=0x06054b50)e--;
 if(e<0)throw Error('Not a valid .xlsx file');
 const n=dv.getUint16(e+10,true),F={};let p=dv.getUint32(e+16,true);
 for(let k=0;k<n;k++){const nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true);
  F[td.decode(u8.subarray(p+46,p+46+nl))]={m:dv.getUint16(p+10,true),z:dv.getUint32(p+20,true),o:dv.getUint32(p+42,true)};p+=46+nl+xl+cl}
 const get=async nm=>{const f=F[nm];if(!f)return null;const l=f.o,d=u8.subarray(l+30+dv.getUint16(l+26,true)+dv.getUint16(l+28,true));const raw=d.subarray(0,f.z);
  if(f.m==0)return td.decode(raw);
  const ds=new DecompressionStream('deflate-raw'),w=ds.writable.getWriter();w.write(raw);w.close();
  return td.decode(await new Response(ds.readable).arrayBuffer())};
 const ss=[],sx=await get('xl/sharedStrings.xml');
 if(sx)dp(sx).querySelectorAll('si').forEach(si=>ss.push([...si.querySelectorAll('t')].map(t=>t.textContent).join('')));
 const wb=dp(await get('xl/workbook.xml')),rm={};
 dp(await get('xl/_rels/workbook.xml.rels')).querySelectorAll('Relationship').forEach(r=>rm[r.getAttribute('Id')]=r.getAttribute('Target'));
 const out=[];
 for(const sh of wb.querySelectorAll('sheet')){
  let t=(rm[sh.getAttribute('r:id')]||'').replace(/^\//,'');t=t.startsWith('xl/')?t:'xl/'+t;
  const x=await get(t);if(!x)continue;const rows=[];
  dp(x).querySelectorAll('row').forEach(r=>{const row=[];
   r.querySelectorAll('c').forEach(c=>{const m=(c.getAttribute('r')||'').match(/^[A-Z]+/);let ci=0;if(m)for(const ch of m[0])ci=ci*26+ch.charCodeAt(0)-64;ci=ci?ci-1:row.length;
    const ty=c.getAttribute('t'),v=c.querySelector('v');let val='';
    if(ty=='s')val=ss[+v.textContent]??'';else if(ty=='inlineStr')val=[...c.querySelectorAll('t')].map(t=>t.textContent).join('');else if(v)val=v.textContent;
    row[ci]=val});rows.push(row)});
  out.push({name:sh.getAttribute('name'),rows})}
 return out}
const toTSV=rows=>rows.map(r=>Array.from(r,c=>String(c??'').replace(/[\t\r\n]/g,' ').trim()).join('\t')).join('\n');
async function fileSw(i){
 const f=i.files[0];if(!f)return;i.value='';
 if(!/\.xlsx$/i.test(f.name)){const r=new FileReader();r.onload=()=>impSw(r.result);r.readAsText(f);return}
 try{const sh=await readXlsx(f),sw=sh.find(x=>/swimmer|player/i.test(x.name))||sh[0],en=sh.find(x=>/entr/i.test(x.name)&&x!==sw);
  const a=impSw(toTSV(sw.rows),1),b=en?impEnText(toTSV(en.rows)):null;save();
  alert(a.c+' swimmers imported'+(a.sk?' ('+a.sk+' duplicates skipped)':'')+(b?'\n'+b.c+' entries imported'+(b.bad.length?'\nSkipped entries: '+b.bad.slice(0,15).join(', ')+(b.bad.length>15?'…':''):''):''));render()
 }catch(e){alert('Could not read Excel file: '+e.message)}}
// ---------- 2 Entries (event-wise) ----------
let PICK={},PE=-1;
const provs=()=>[...new Set(S.sw.map(s=>s.p).filter(Boolean))].sort();
function goEv(i){$('ev').value=i;render();window.scrollTo({top:0,behavior:'smooth'})}
function vEntry(){
 const i=+$('ev').value,a=byEv(i),rel=isRelay(i);
 if(PE!=i){PICK={};PE=i}
 const grid=EV.map((e,k)=>k).filter(vis).map(k=>{const e=EV[k],n=S.en.filter(x=>x.e==k).length;return`<button class="evc ${k==i?'on':''} ${n?'has':''}" style="--c:${col(k)}" onclick="goEv(${k})" title="${esc(e)}"><b>${k+1}</b><span>${esc(short(k))}</span><i>${evG(k)=='W'?'♀':'♂'}</i><em>${n}</em></button>`}).join('');
 const pv=`<datalist id="pv">${provs().map(p=>`<option value="${esc(p)}">`).join('')}</datalist>`;
 const form=rel?`<div class="row"><input id="rn" placeholder="Team name"><input id="rp" list="pv" placeholder="Province"><input id="sd" placeholder="Seed time e.g. 1:45.32" size="18"><button onclick="addEn()">Add team</button></div>${pv}`:
 `<div class="row"><input id="pq" placeholder="🔍 search swimmer" oninput="listPick()"><select id="pf" onchange="listPick()"><option value="">All provinces</option>${provs().map(p=>`<option>${esc(p)}</option>`).join('')}</select>
  <button class="s" onclick="pickAll()">Select all shown</button><button class="s" onclick="PICK={};listPick()">Clear</button></div>
  <div id="pl" class="pl"></div>
  <div class="row"><button id="pb" onclick="addPicked()">Add selected (0)</button><span class="mut">Tick swimmers (type a seed time if known) then add them all at once.</span></div>
  <h3>➕ Quick add a new swimmer straight into this event</h3>
  <div class="row"><input id="qn" placeholder="Name"><input id="qp" list="pv" placeholder="Province"><input id="qc" placeholder="Club / School"><input id="qs" placeholder="Seed (optional)" size="12"><button onclick="quickAdd()">Add</button></div>${pv}`;
 $('v').innerHTML=`<details class="card" open><summary><h2 style="display:inline">🗂 All events — tap one to add players</h2></summary><div class="row" style="margin-top:10px">${[['A','All'],['M','♂ Men'],['W','♀ Women']].map(g=>`<button class="${GF==g[0]?'':'s'}" onclick="setG('${g[0]}')">${g[1]}</button>`).join('')}<span class="mut">|</span>${[['','All strokes'],['0','Free'],['1','Fly'],['2','Back'],['3','Breast'],['4','IM'],['5','Medley Rly'],['6','Free Rly']].map(g=>`<button class="${SF===g[0]?'':'s'}" onclick="setS('${g[0]}')">${g[1]}</button>`).join('')}</div><div class="evg">${grid}</div></details>
 <div class="card"><div class="evh" style="--c:${col(i)}"><b>Event ${i+1}</b> · ${esc(EV[i])} <span class="tag">${evG(i)=='W'?'♀ Women':'♂ Men'}</span> <span class="tag">${a.length} entered</span></div>${form}
 <details><summary class="mut">Bulk import entries (Excel / CSV)</summary><p class="mut">One per line: swimmer name, event no., seed time</p><textarea id="bk" rows="3" style="width:100%"></textarea><div class="row"><button class="s" onclick="impEn()">Import pasted</button><label class="btn s">Upload Excel / CSV<input type="file" accept=".csv,.txt,.xlsx" hidden onchange="fileEn(this)"></label></div></details></div>
 <div class="card sc"><div class="row"><h2 style="margin:0">Entered players (${a.length})</h2><span class="grow"></span>${a.length?`<button class="s" onclick="clrEv()">Clear this event</button>`:''}</div>
 <table><tr><th>#</th><th>Name</th><th>Province</th><th>Seed</th><th></th></tr>${a.map((x,k)=>`<tr><td>${k+1}</td><td><div class="nm">${avatar(x)}${esc(who(x).n)}</div></td><td>${esc(who(x).p)}</td><td><input class="ti" value="${x.seed!=null?ft(x.seed):''}" placeholder="seed" onchange="setSeed('${x.id}',this)"></td><td><button class="s" onclick="delEn('${x.id}')">✕</button></td></tr>`).join('')}</table></div>`;
 if(!rel)listPick();
}
function eligible(){
 const i=+$('ev').value,used=new Set(byEv(i).map(x=>x.sid)),q=($('pq')?.value||'').toLowerCase(),f=$('pf')?.value||'';
 return S.sw.filter(s=>s.g==evG(i)&&!used.has(s.id)&&(!f||s.p==f)&&(s.n+' '+s.p+' '+s.c).toLowerCase().includes(q)).sort((x,y)=>x.n.localeCompare(y.n));
}
function listPick(){
 const a=eligible();
 $('pl').innerHTML=a.length?a.map(s=>`<label class="pk ${s.id in PICK?'on':''}"><input type="checkbox" id="ck${s.id}" ${s.id in PICK?'checked':''} onchange="tgl('${s.id}',this)"><span class="av" style="background:${pcol(s.p)}">${esc(ini(s.n))}</span><span class="pn"><b>${esc(s.n)}</b><small>${esc(s.p)}${s.c?' · '+esc(s.c):''}</small></span><input class="sd" placeholder="seed" value="${esc(PICK[s.id]||'')}" oninput="setSd('${s.id}',this)"></label>`).join(''):'<p class="mut">No eligible swimmers left. Add swimmers in Tab 1 or use quick add below.</p>';
 cnt();
}
function cnt(){const b=$('pb');if(b)b.textContent='Add selected ('+Object.keys(PICK).length+')'}
function tgl(id,el){if(el.checked)PICK[id]=PICK[id]||'';else delete PICK[id];el.closest('label').classList.toggle('on',el.checked);cnt()}
function setSd(id,el){PICK[id]=el.value;const c=$('ck'+id);c.checked=true;c.closest('label').classList.add('on');cnt()}
function pickAll(){eligible().forEach(s=>{if(!(s.id in PICK))PICK[s.id]=''});listPick()}
function addPicked(){
 const i=+$('ev').value,ids=Object.keys(PICK);if(!ids.length)return alert('Select swimmers first');
 const bad=ids.filter(id=>PICK[id].trim()&&isNaN(pt(PICK[id])));
 if(bad.length)return alert('Invalid seed time for: '+bad.map(id=>swr(id)?.n).join(', '));
 ids.forEach(id=>{const v=PICK[id].trim();S.en.push({id:uid(),e:i,sid:id,seed:v?pt(v):null})});
 PICK={};save();render();
}
function quickAdd(){
 const i=+$('ev').value,n=$('qn').value.trim(),sd=$('qs').value.trim();
 if(!n)return alert('Name needed');if(sd&&isNaN(pt(sd)))return alert('Invalid time');
 let s=S.sw.find(w=>w.n.toLowerCase()==n.toLowerCase()&&w.g==evG(i));
 if(s&&S.en.some(x=>x.e==i&&x.sid==s.id))return alert(n+' is already in this event');
 if(!s){s={id:uid(),n,p:$('qp').value.trim(),g:evG(i),c:$('qc').value.trim()};S.sw.push(s)}
 S.en.push({id:uid(),e:i,sid:s.id,seed:sd?pt(sd):null});save();render();
}
function addEn(){ // relay team
 const i=+$('ev').value,sd=$('sd').value.trim(),seed=sd?pt(sd):null;if(sd&&isNaN(seed))return alert('Invalid time');
 const x={id:uid(),e:i,seed,n:$('rn').value.trim(),p:$('rp').value.trim()};if(!x.n)return alert('Team name needed');
 S.en.push(x);save();render()}
function setSeed(id,el){const x=S.en.find(e=>e.id==id),v=el.value.trim();if(!v)x.seed=null;else{const t=pt(v);if(isNaN(t)){alert('Invalid time');render();return}x.seed=t}save();render()}
function delEn(id){S.en=S.en.filter(x=>x.id!=id);save();render()}
function clrEv(){const i=+$('ev').value;if(confirm('Remove all entries from event '+(i+1)+'?')){S.en=S.en.filter(x=>x.e!=i);save();render()}}
const sv=v=>{v=String(v??'').trim();if(!v)return null;if(!v.includes(':')&&!isNaN(+v)&&+v>0&&+v<1)return Math.round(+v*8640000)/100;const t=pt(v);return isNaN(t)?null:t};
function impEnText(t){let c=0,bad=[];t.split(/\r?\n/).forEach((l,k)=>{const p=l.split(/,|\t/).map(s=>s.trim());if(!p[0])return;if(k==0&&isNaN(+p[1]))return;
 const e=+p[1]-1,s=S.sw.find(w=>w.n.toLowerCase()==p[0].toLowerCase());
 if(s&&EV[e]&&s.g==evG(e)&&!isRelay(e)&&!S.en.some(x=>x.e==e&&x.sid==s.id)){S.en.push({id:uid(),e,sid:s.id,seed:sv(p[2])});c++}else bad.push(p[0]+(EV[e]?' (#'+(e+1)+')':''))});
 save();return{c,bad}}
function impEn(){const r=impEnText($('bk').value);alert(r.c+' imported'+(r.bad.length?'\nSkipped (unknown name / wrong gender / duplicate): '+r.bad.join(', '):''));render()}
async function fileEn(i){
 const f=i.files[0];if(!f)return;i.value='';
 try{let t;if(/\.xlsx$/i.test(f.name)){const sh=await readXlsx(f);t=toTSV((sh.find(x=>/entr/i.test(x.name))||sh[0]).rows)}else t=await f.text();
  const r=impEnText(t);alert(r.c+' entries imported'+(r.bad.length?'\nSkipped (unknown name / wrong gender / duplicate): '+r.bad.slice(0,15).join(', ')+(r.bad.length>15?'…':''):''));render()
 }catch(e){alert('Could not read file: '+e.message)}}
// ---------- 3 Heats & Times ----------
function heatBody(i,scr){
 const h=heats(i);if(!h.length)return'<p class="mut empty">No entries for this event.</p>';
 return h.map((hh,k)=>`<div class="hh"><span>HEAT ${k+1}</span><span>of ${h.length}</span></div><div class="sc"><table class="ht"><tr><th>Lane</th><th>Swimmer</th><th>Province</th><th>Seed</th><th class="${scr?'':'blank'}">Race time</th></tr>${hh.map(({x,lane})=>`<tr class="lane"><td><span class="ln">${lane}</span></td><td><div class="nm">${avatar(x)}<b>${esc(who(x).n)}</b></div></td><td><span class="dot" style="background:${pcol(who(x).p)}"></span>${esc(who(x).p)}</td><td>${ft(x.seed)}</td><td${scr?'':' class="blank"'}>${scr?`<input class="ti" value="${x.st||(x.res!=null?ft(x.res):'')}" placeholder="mm:ss.00" onchange="setRes('${x.id}',this)">`:''}</td></tr>`).join('')}</table></div>`).join('');
}
function vHeat(){
 const i=+$('ev').value;
 $('v').innerHTML=`<div class="row"><button onclick="pdf(heatHTML)">🖨 Heat sheet PDF</button><button class="s" onclick="pdf(heatHTML,1)">All events</button></div>`+
 rep(evBan(i,'HEATS & TIMES'),heatBody(i,1)+`<p class="mut">Enter race time (e.g. 58.32 or 1:02.45). Type DQ / DNS / DNF for no time.</p>`);
}
function setRes(id,el){
 const x=S.en.find(e=>e.id==id),v=el.value.trim().toUpperCase();
 if(!v){x.res=null;x.st=null}
 else if(['DQ','DNS','DNF'].includes(v)){x.st=v;x.res=null;el.value=v}
 else{const t=pt(v);if(isNaN(t)){alert('Invalid time');el.value='';return}x.res=t;x.st=null;el.value=ft(t)}
 save();stats();
}
// ---------- 4 Results & PDF ----------
const trunc=(s,n)=>s.length>n?s.slice(0,n-1)+'…':s;
function podium(r){
 if(!r.length)return'';
 const B=[{k:1,x:185,h:112},{k:0,x:22,h:82},{k:2,x:348,h:58}],base=196;
 return`<svg class="pod" viewBox="0 0 520 210" role="img" aria-label="Podium">${B.filter(b=>r[b.k]).map(b=>{const x=r[b.k],w=who(x),top=base-b.h,cx=b.x+75,c=MC[b.k];
 return`<rect x="${b.x}" y="${top}" width="150" height="${b.h}" rx="8" fill="${c}"/><rect x="${b.x}" y="${top}" width="150" height="10" rx="5" fill="#fff" opacity=".35"/>`+
 `<circle cx="${cx}" cy="${top+27}" r="15" fill="#fff" opacity=".85"/><text x="${cx}" y="${top+33}" text-anchor="middle" class="pk1">${b.k+1}</text>`+
 `<text x="${cx}" y="${top+52}" text-anchor="middle" class="pk2">${ft(x.res)}</text>`+
 `<text x="${cx}" y="${top-26}" text-anchor="middle" class="pk3">${esc(trunc(w.n,19))}</text><text x="${cx}" y="${top-10}" text-anchor="middle" class="pk4">${esc(trunc(w.p||'',22))}</text>`+
 (b.k==0?`<text x="${cx}" y="${top-46}" text-anchor="middle" font-size="22">👑</text>`:'')}).join('')}<rect x="10" y="${base}" width="500" height="6" rx="3" fill="var(--bd)"/></svg>`;
}
function resBody(i,top){
 const r=ranked(i),ns=S.en.filter(x=>x.e==i&&x.res==null&&x.st);
 if(!r.length&&!ns.length)return'<p class="mut empty">No results entered yet.</p>';
 const a=top?r.slice(0,8):r,mn=r.length?r[0].res:0,mx=r.length?r[r.length-1].res:0,bar=t=>mx>mn?100-55*(t-mn)/(mx-mn):100;
 return podium(r)+`<div class="sc"><table class="rt"><tr><th>Rank</th><th>Swimmer</th><th>Province</th><th>Time</th><th class="bc">Pace</th><th>Behind</th></tr>${a.map((x,k)=>`<tr class="r${k<3?k+1:0}"><td>${medal(k+1)}</td><td><div class="nm">${avatar(x)}<b>${esc(who(x).n)}</b>${!top&&k<8?'<span class="fin">FINAL</span>':''}</div></td><td><span class="dot" style="background:${pcol(who(x).p)}"></span>${esc(who(x).p)}</td><td class="tm">${ft(x.res)}</td><td class="bc"><div class="tb"><i style="width:${bar(x.res).toFixed(1)}%;background:${k<3?MC[k]:col(i)}"></i></div></td><td class="mut">${k?'+'+(x.res-mn).toFixed(2):'—'}</td></tr>`).join('')}${top?'':ns.map(x=>`<tr><td><span class="medal">-</span></td><td><div class="nm">${avatar(x)}<b>${esc(who(x).n)}</b></div></td><td><span class="dot" style="background:${pcol(who(x).p)}"></span>${esc(who(x).p)}</td><td class="tm">${x.st}</td><td class="bc"></td><td></td></tr>`).join('')}</table></div>`;
}
function vRes(){
 const i=+$('ev').value,prog=S.en.length?100*S.en.filter(x=>x.res!=null||x.st).length/S.en.length:0;
 $('v').innerHTML=`<div class="row"><button onclick="pdf(resHTML,0,1)">🖨 Results PDF</button><button onclick="pdf(topHTML,0,1)">🏅 Best 8 PDF</button>
 <button class="s" onclick="pdf(resHTML,1,1)">All results</button><button class="s" onclick="pdf(topHTML,1,1)">All Best 8</button><span class="grow"></span><button class="s" onclick="rstEvRes(${i})">↺ Clear this event's results</button></div>`+
 rep(evBan(i,'RESULTS'),resBody(i,0))+
 `<div class="card"><h2>Meet progress · ${prog.toFixed(0)}%</h2><div class="bar2"><i style="width:${prog}%"></i></div></div>`;
}
// ---------- 5 Summary & charts ----------
function medals(){
 const m={},g=p=>{p=p||'—';return m[p]=m[p]||{p,g:0,s:0,b:0,pts:0,sw:new Set(),en:0}};
 S.en.forEach(x=>{const r=g(who(x).p);r.en++;if(x.sid)r.sw.add(x.sid)});
 EV.forEach((_,i)=>ranked(i).forEach((x,k)=>{const r=g(who(x).p);if(k<3)r['gsb'[k]]++;r.pts+=PTS[k]||0}));
 return Object.values(m).sort((a,b)=>b.g-a.g||b.s-a.s||b.b-a.b||b.pts-a.pts||a.p.localeCompare(b.p));
}
function topSw(){const t={};EV.forEach((_,i)=>ranked(i).forEach((x,k)=>{if(!x.sid||k>2)return;const r=t[x.sid]=t[x.sid]||{id:x.sid,g:0,s:0,b:0};r['gsb'[k]]++}));
 return Object.values(t).sort((a,b)=>b.g-a.g||b.s-a.s||b.b-a.b).slice(0,10)}
const hbar=(items,fmt=v=>v)=>{const m=Math.max(1,...items.map(x=>x.v));return`<div class="hb">${items.map(x=>`<div class="hbr"><span class="hl">${esc(x.l)}</span><div class="hbt"><i style="width:${(100*x.v/m).toFixed(1)}%;background:${x.c}"></i></div><b>${fmt(x.v)}</b></div>`).join('')}</div>`};
function donut(items,label){
 const its=items.filter(x=>x.v>0),tot=its.reduce((a,x)=>a+x.v,0);
 if(!tot)return'<p class="mut">No data yet.</p>';
 const R=52,C=2*Math.PI*R;let o=0;
 const arcs=its.map(x=>{const l=C*x.v/tot,s=`<circle r="${R}" cx="70" cy="70" fill="none" stroke="${x.c}" stroke-width="22" stroke-dasharray="${l.toFixed(2)} ${(C-l).toFixed(2)}" stroke-dashoffset="${(-o).toFixed(2)}" transform="rotate(-90 70 70)"/>`;o+=l;return s}).join('');
 return`<div class="dn"><svg viewBox="0 0 140 140" width="140" height="140"><circle r="${R}" cx="70" cy="70" fill="none" stroke="var(--bd)" stroke-width="22"/>${arcs}<text x="70" y="70" text-anchor="middle" class="dc">${tot}</text><text x="70" y="88" text-anchor="middle" class="dl">${label}</text></svg><div class="lg">${its.map(x=>`<div><i style="background:${x.c}"></i>${esc(x.l)} <b>${x.v}</b></div>`).join('')}</div></div>`;
}
function evBars(){
 const c=EV.map((_,i)=>S.en.filter(x=>x.e==i).length),m=Math.max(1,...c),bw=20;
 return`<svg viewBox="0 0 ${34*bw+20} 146" class="evb">${c.map((n,i)=>{const h=100*n/m,x=10+i*bw;return`<rect x="${x+2}" y="${116-h}" width="${bw-4}" height="${Math.max(h,1)}" rx="3" fill="${col(i)}" opacity="${n?1:.25}"/><text x="${x+bw/2}" y="${112-h}" text-anchor="middle" class="bn">${n||''}</text><text x="${x+bw/2}" y="132" text-anchor="middle" class="bx">${i+1}</text>`}).join('')}</svg>
 <div class="lg2">${STK.map(s=>`<span><i style="background:${s[1]}"></i>${s[0]}</span>`).join('')}</div>`;
}
function sumHTML(pr){
 const M=medals(),T=topSw(),sw=S.sw.length,en=S.en.length,rs=S.en.filter(x=>x.res!=null||x.st).length;
 const done=EV.filter((_,i)=>S.en.some(x=>x.e==i)&&S.en.filter(x=>x.e==i).every(x=>x.res!=null||x.st)).length;
 const kp=(v,l,a,b)=>`<div class="kp" style="--k1:${a};--k2:${b}"><b>${v}</b><span>${l}</span></div>`;
 const hasR=M.some(r=>r.pts>0),top7=M.slice().sort((a,b)=>b.en-a.en).slice(0,7),oth=M.slice().sort((a,b)=>b.en-a.en).slice(7).reduce((a,r)=>a+r.en,0);
 const prov=top7.map(r=>({l:r.p,v:r.en,c:pcol(r.p)}));if(oth)prov.push({l:'Others',v:oth,c:'#8fa2b3'});
 const mt=M.length?`<div class="sc"><table class="rt mt"><tr><th>#</th><th>Province</th><th class="mc">🥇</th><th class="mc">🥈</th><th class="mc">🥉</th><th class="mc">Total</th><th class="mc">Points</th></tr>${M.map((r,k)=>`<tr class="${hasR&&k<3?'r'+(k+1):''}"><td>${medal(k+1)}</td><td><span class="dot" style="background:${pcol(r.p)}"></span><b>${esc(r.p)}</b></td><td class="mc">${r.g}</td><td class="mc">${r.s}</td><td class="mc">${r.b}</td><td class="mc">${r.g+r.s+r.b}</td><td class="mc">${r.pts}</td></tr>`).join('')}</table></div>`:'<p class="mut">Add swimmers and entries to see the medal table.</p>';
 const ts=T.length?`<div class="sc"><table class="rt"><tr><th>#</th><th>Swimmer</th><th>Province</th><th class="mc">🥇</th><th class="mc">🥈</th><th class="mc">🥉</th></tr>${T.map((t,k)=>{const w=swr(t.id)||{n:'?',p:''};return`<tr><td>${medal(k+1)}</td><td><div class="nm"><span class="av" style="background:${pcol(w.p)}">${esc(ini(w.n))}</span><b>${esc(w.n)}</b></div></td><td>${esc(w.p)}</td><td class="mc">${t.g}</td><td class="mc">${t.s}</td><td class="mc">${t.b}</td></tr>`}).join('')}</table></div>`:'<p class="mut">No medals yet.</p>';
 const body=`<div class="kpis">${kp(sw,'Swimmers','#0b3d68','#0a86b8')}${kp(en,'Entries','#6c3fb5','#8e44ad')}${kp(M.length,'Provinces','#0f7a68','#16a085')}${kp(done+'/34','Events completed','#c26a12','#e67e22')}${kp(rs,'Results in','#a52a2a','#c0392b')}</div>
 <div class="pnl"><h3>🏆 Medal table by province</h3>${mt}</div>
 <div class="grid2"><div class="pnl"><h3>📊 ${hasR?'Points by province (9-7-6-5-4-3-2-1)':'Entries by province'}</h3>${M.length?hbar(M.slice(0,10).map(r=>({l:r.p,v:hasR?r.pts:r.en,c:pcol(r.p)}))):'<p class="mut">No data yet.</p>'}</div>
 <div class="pnl"><h3>🍩 Entries share by province</h3>${donut(prov,'entries')}</div>
 <div class="pnl"><h3>⚥ Swimmers by gender</h3>${donut([{l:'Male',v:S.sw.filter(s=>s.g=='M').length,c:'#0a86b8'},{l:'Female',v:S.sw.filter(s=>s.g=='W').length,c:'#e84393'}],'swimmers')}</div>
 <div class="pnl"><h3>⭐ Top medallists</h3>${ts}</div></div>
 <div class="pnl"><h3>🏊 Entries per event</h3>${evBars()}</div>`;
 return rep(banner('MEET SUMMARY','Medal Table &amp; Statistics',esc(S.meet.name)+(S.meet.date?' · '+esc(S.meet.date):''),'#0a86b8'),body,pr);
}
function vSum(){$('v').innerHTML=`<div class="row"><button onclick="printSum()">🖨 Summary PDF</button><span class="mut">Medal table, charts and top medallists — print or save as PDF.</span></div>`+sumHTML(0)}
function printSum(){$('print').innerHTML=`<div class="pb">${sumHTML(1)}</div>`;window.print()}
// ---------- 6 Report Center (event-wise reports) ----------
let RC=new Set(),RT='res';
const hasData=(i,t)=>t=='heat'?byEv(i).length>0:ranked(i).length>0;
const rcN=i=>RT=='heat'?byEv(i).length:ranked(i).length;
function vRep(){
 const types=[['heat','📋 Heat sheet'],['res','🏁 Results'],['top','🏅 Best 8']];
 const chips=EV.map((e,i)=>`<label class="rc ${RC.has(i)?'on':''} ${hasData(i,RT)?'':'dim'}" style="--c:${col(i)}"><input type="checkbox" ${RC.has(i)?'checked':''} onchange="rcTgl(${i},this)"><b>${i+1}</b><span>${esc(short(i))}</span><i>${evG(i)=='W'?'♀':'♂'}</i><em>${hasData(i,RT)?rcN(i):'–'}</em></label>`).join('');
 const q=(k,l)=>`<button class="s" onclick="rcSel('${k}')">${l}</button>`;
 $('v').innerHTML=`<div class="card"><h2>📑 Event-wise report generator</h2>
 <h3>1 · Report type</h3><div class="row">${types.map(t=>`<button class="${RT==t[0]?'':'s'}" onclick="rcType('${t[0]}')">${t[1]}</button>`).join('')}
 <label class="mut">Lanes <select id="rl" onchange="$('ln').value=this.value"><option value="8">8 lanes</option><option value="6">6 lanes</option></select></label></div>
 <h3>2 · Pick events <span class="mut">(dim = nothing to print for this report type)</span></h3>
 <div class="row">${q('all','All')}${q('data','With data')}${q('M','♂ Men')}${q('W','♀ Women')}${q('Freestyle','Free')}${q('Butterfly','Fly')}${q('Backstroke','Back')}${q('Breaststroke','Breast')}${q('Medley','IM / Medley')}${q('Relay','Relays')}<button class="s" onclick="rcSel('none')">✕ None</button></div>
 <div class="rcg">${chips}</div>
 <h3>3 · Generate</h3><div class="row"><label><input type="checkbox" id="rs"> Add medal summary page at the end</label><span class="grow"></span><button id="rgo" onclick="rcGo()">🖨 Generate PDF (0 events)</button></div>
 <p class="mut">Each selected event prints on its own page. In the print dialog choose "Save as PDF".</p></div>`;
 $('rl').value=$('ln').value;rcCnt();
}
function rcType(t){RT=t;vRep()}
function rcTgl(i,el){el.checked?RC.add(i):RC.delete(i);el.closest('label').classList.toggle('on',el.checked);rcCnt()}
function rcSel(k){
 const f={all:()=>1,none:()=>0,data:i=>hasData(i,RT),M:i=>evG(i)=='M',W:i=>evG(i)=='W',Relay:i=>isRelay(i),Medley:i=>EV[i].includes('Medley')}[k]||(i=>!isRelay(i)&&EV[i].includes(k));
 if(k=='none')RC=new Set();else EV.forEach((_,i)=>{if(f(i))RC.add(i)});
 vRep();
}
function rcCnt(){const b=$('rgo');if(b)b.textContent='🖨 Generate PDF ('+RC.size+' event'+(RC.size==1?'':'s')+')'}
function rcGo(){
 const fn={heat:heatHTML,res:resHTML,top:topHTML}[RT],sel=[...RC].sort((a,b)=>a-b),ok=sel.filter(i=>hasData(i,RT)),skip=sel.length-ok.length;
 if(!sel.length)return alert('Select at least one event');
 if(!ok.length)return alert('Selected events have no '+(RT=='heat'?'entries':'results')+' yet');
 if(skip&&!confirm(skip+' selected event(s) have no data and will be skipped. Continue?'))return;
 let h=ok.map(i=>`<div class="pb">${fn(i)}</div>`).join('');
 if($('rs').checked)h+=`<div class="pb">${sumHTML(1)}</div>`;
 $('print').innerHTML=h;window.print();
}
// ---------- 7 Backup & Reset ----------
function bkCard(){
 const has=S.sw.length||S.en.length,st=BKI.t?`Last backup: <b>${ago(BKI.t)}</b> (${new Date(BKI.t).toLocaleString()}) · ${BKI.d?`<b style="color:#c0392b">⚠ ${BKI.d} changes since then</b>`:'<b style="color:#1a8a4a">everything saved ✓</b>'}`:`<b style="color:#c0392b">${has?'⚠ No backup downloaded yet':'No backup yet'}</b>`;
 const o=(k,vals)=>`<select onchange="setOpt('${k}',this.value)">${vals.map(v=>`<option value="${v}" ${BKI[k]==v?'selected':''}>${v?'every '+v+' changes':'off'}</option>`).join('')}</select>`;
 return`<div class="card"><h2>💾 Backup &amp; restore (JSON file)</h2>
 <p class="mut">Your data lives in this browser. If the browser data is cleared, or you switch computer/phone, it is gone — so keep a <b>.json backup file</b>. To continue later: <b>Restore</b> that file and carry on.</p>
 <p>${st}</p>
 <div class="row"><button onclick="exportJSON()">⬇ Download backup (.json)</button><label class="btn s">⬆ Restore from file<input type="file" accept=".json,application/json" hidden onchange="importJSON(this)"></label></div>
 <h3>📁 Auto-save to a file <span class="mut">(Chrome / Edge on computer)</span></h3>
 ${FH?`<div class="row"><span class="tag" style="background:#c8f0d6">✓ Auto-saving to <b>${esc(FHN)}</b> after every change</span><button class="s" onclick="unlinkFile()">Stop</button></div>`:`<div class="row"><button class="s" onclick="linkFile()">📁 Choose file for auto-save</button><span class="mut">Every change is written to that file automatically. After reopening the app, choose it again (or Restore it).</span></div>`}
 <h3>🔔 Reminders</h3><div class="row"><label>Remind me to back up ${o('rem',[0,10,20,50])}</label><label>Auto-download backup ${o('auto',[0,25,50,100])}</label></div></div>`}
function snapCard(){
 const a=snaps();
 return`<div class="card"><h2>🕘 Safety snapshots <span class="mut" style="font-weight:400">(undo for resets &amp; restores)</span></h2>${a.length?`<table><tr><th>When</th><th>Why</th><th>Data</th><th></th></tr>${a.map((e,k)=>`<tr><td>${new Date(e.t).toLocaleString()}<br><span class="mut">${ago(e.t)}</span></td><td>${esc(e.label)}</td><td>${e.sw} swimmers · ${e.en} entries · ${e.res} results</td><td><button class="s" onclick="restoreSnap(${k})">Restore</button></td></tr>`).join('')}</table>`:'<p class="mut">No snapshots yet. One is saved automatically before every reset/restore and every few minutes while you work.</p>'}
 <p class="mut">Snapshots are stored in the same browser, so they protect against mistakes — not against cleared browser data. Use the JSON backup for that.</p></div>`}

let RI=0;
const typed=(w,msg)=>{const v=prompt(msg+'\n\nType '+w+' to confirm:');return !!v&&v.trim().toUpperCase()==w};
const nRes=l=>S.en.filter(x=>(x.res!=null||x.st)&&(!l||l(x))).length;
function vReset(){
 const i=RI,ne=S.en.filter(x=>x.e==i).length,nr=nRes(x=>x.e==i);
 $('v').innerHTML=`${bkCard()}${snapCard()}
 <div class="card"><h2>🎯 Reset a single event</h2><div class="row"><select id="ri" onchange="RI=+this.value;vReset()">${EV.map((e,k)=>`<option value="${k}" ${k==i?'selected':''}>${k+1}. ${esc(e)}</option>`).join('')}</select></div>
 <div class="row"><button class="s" onclick="rstEvRes(${i})">↺ Clear results (${nr})</button><button class="dg" onclick="rstEvEn(${i})">🗑 Remove all entries (${ne})</button></div>
 <p class="mut">Clearing results keeps the entries and heats. Removing entries also removes that event's results.</p></div>
 <div class="card dz"><h2>⚠ Reset whole meet</h2>
 <div class="rz"><div><b>Clear all results</b><br><span class="mut">Keeps swimmers, entries and heats. ${nRes()} results will be removed.</span></div><button class="s" onclick="rstAllRes()">↺ Clear results</button></div>
 <div class="rz"><div><b>Clear all entries</b><br><span class="mut">Keeps the swimmer list. ${S.en.length} entries (and their results) will be removed.</span></div><button class="dg" onclick="rstAllEn()">🗑 Clear entries</button></div>
 <div class="rz"><div><b>Delete all swimmers</b><br><span class="mut">${S.sw.length} swimmers plus all entries and results.</span></div><button class="dg" onclick="rstSw()">🗑 Delete swimmers</button></div>
 <div class="rz"><div><b>Start a brand-new meet</b><br><span class="mut">Wipes everything. <label><input type="checkbox" id="keep" checked> keep meet name &amp; date</label></span></div><button class="dg" onclick="rstAll()">💣 Full reset</button></div></div>`;
}
function rstEvRes(i){if(!nRes(x=>x.e==i))return alert('No results in this event');if(!confirm('Clear all results of event '+(i+1)+' ('+EV[i]+')?'))return;
 snap('Before clearing event '+(i+1)+' results');S.en.forEach(x=>{if(x.e==i){x.res=null;x.st=null}});save();render()}
function rstEvEn(i){const n=S.en.filter(x=>x.e==i).length;if(!n)return alert('No entries in this event');if(!confirm('Remove ALL '+n+' entries (and results) of event '+(i+1)+'?'))return;
 snap('Before removing event '+(i+1)+' entries');S.en=S.en.filter(x=>x.e!=i);save();render()}
function rstAllRes(){if(!nRes())return alert('No results to clear');if(!confirm('Clear ALL results for every event? Entries stay.'))return;
 snap('Before clearing all results');S.en.forEach(x=>{x.res=null;x.st=null});save();render()}
function rstAllEn(){if(!S.en.length)return alert('No entries');if(!typed('ENTRIES','This removes ALL entries and results.'))return;snap('Before clearing all entries');S.en=[];save();render()}
function rstSw(){if(!S.sw.length)return alert('No swimmers');if(!typed('SWIMMERS','This deletes ALL swimmers, entries and results.'))return;snap('Before deleting swimmers');S.sw=[];S.en=[];save();render()}
function rstAll(){if(!typed('RESET','This wipes the entire meet.'))return;snap('Before full reset');const k=$('keep').checked,m=S.meet;
 S={meet:k?m:{name:'Swimming Championship',date:''},sw:[],en:[]};PICK={};PE=-1;RC=new Set();save();render()}
// ---------- Print / PDF ----------
const heatHTML=i=>rep(evBan(i,'HEAT SHEET'),heatBody(i,0),1);
const resHTML=i=>rep(evBan(i,'OFFICIAL RESULTS'),resBody(i,0),1);
const topHTML=i=>rep(evBan(i,'BEST 8 · FINALISTS'),resBody(i,1),1);
function pdf(fn,all,needRes){
 const idx=all?EV.map((_,i)=>i).filter(i=>needRes?ranked(i).length:byEv(i).length):[+$('ev').value];
 if(!idx.length)return alert('Nothing to print yet');
 $('print').innerHTML=idx.map(i=>`<div class="pb">${fn(i)}</div>`).join('');window.print();
}
// ---------- Backup ----------
const payload=()=>({app:'swim-meet-manager',version:2,exportedAt:new Date().toISOString(),summary:{swimmers:S.sw.length,entries:S.en.length,results:S.en.filter(x=>x.res!=null||x.st).length},data:S});
function exportJSON(auto){
 const d=new Date(),z=n=>String(n).padStart(2,'0'),nm=(S.meet.name||'meet').replace(/[^\w\-]+/g,'_').slice(0,30);
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(payload(),null,1)],{type:'application/json'}));
 a.download=`swim-backup_${nm}_${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}_${z(d.getHours())}${z(d.getMinutes())}.json`;
 document.body.appendChild(a);a.click();a.remove();
 BKI.t=Date.now();BKI.d=0;saveBki();snap(auto===true?'Auto-backup':'Backup');stats();if($('toast'))$('toast').remove();if(T==6)vReset();
}
function importJSON(i){
 const f=i.files[0];if(!f)return;i.value='';const r=new FileReader();
 r.onload=()=>{try{
  const j=JSON.parse(r.result),d=j&&j.app&&j.data?j.data:j;
  if(!d||!Array.isArray(d.sw)||!Array.isArray(d.en))throw Error('this is not a Swim Meet backup');
  d.meet=d.meet||{name:'Swimming Championship',date:''};
  const ids=new Set(d.sw.map(x=>x.id)),bad=d.en.filter(x=>x.sid&&!ids.has(x.sid)).length;
  d.en=d.en.filter(x=>!x.sid||ids.has(x.sid));
  const n=d.en.filter(x=>x.res!=null||x.st).length;
  if(!confirm('Restore this backup?\n\n'+(d.meet.name||'')+' '+(d.meet.date||'')+'\nSwimmers: '+d.sw.length+'\nEntries: '+d.en.length+'\nResults: '+n+(j.exportedAt?'\nSaved: '+new Date(j.exportedAt).toLocaleString():'')+(bad?'\n(⚠ '+bad+' broken entries ignored)':'')+'\n\nCurrent data will be replaced (a safety snapshot of it is kept).'))return;
  snap('Before restore');S=d;PICK={};PE=-1;RC=new Set();save();BKI.d=0;saveBki();render();alert('✅ Backup restored — you can continue where you left off.');
 }catch(e){alert('Could not restore: '+e.message)}};
 r.readAsText(f)}
// ---- auto-save to a real file (Chrome / Edge on computer)
let _ft;
function autoFile(){clearTimeout(_ft);_ft=setTimeout(writeFH,700)}
async function writeFH(){if(!FH)return;try{const w=await FH.createWritable();await w.write(JSON.stringify(payload(),null,1));await w.close();BKI.t=Date.now();BKI.d=0;saveBki();stats()}
 catch(e){FH=null;toast('⚠ Auto-save file disconnected ('+e.message+')');stats()}}
async function linkFile(){
 if(!window.showSaveFilePicker)return alert('Auto-save to file needs Chrome or Edge on a computer.\nOn this browser use "Download backup" instead.');
 try{FH=await showSaveFilePicker({suggestedName:'swim-meet-autosave.json',types:[{description:'Swim meet backup',accept:{'application/json':['.json']}}]});FHN=FH.name;await writeFH();render()}
 catch(e){if(e.name!='AbortError')alert('Could not link file: '+e.message)}}
function unlinkFile(){FH=null;FHN='';render()}
function setOpt(k,v){BKI[k]=+v;saveBki()}
render();
