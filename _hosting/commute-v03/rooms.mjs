// Procedural rooms for the rooms edition. Each room is built around the origin; only one is drawn at a time.
// All geometry is illustrative: nothing here is a map, a measurement or a forecast.
import {Mesh,trs,hex,shade,mix} from './engine.mjs';

export const palettes={
 hub:{floor:'#e9dfc3',floor2:'#dccfad',wall:'#f4eedd',trim:'#2f6a57',accent:'#c9643f',fog:'#d3e8f6',sky:'#f3f6f4',ground:'#b9c9b1',dome:'#4f9fe0',horizon:'#cfe7f7',clouds:true,indoor:true,wallH:4.4},
 commute:{floor:'#a9b4b4',floor2:'#9ca8a8',wall:'#e1eaeb',trim:'#23404f',accent:'#e0a84a',fog:'#d3dee1',sky:'#f3f5f4',ground:'#a7b2b4',indoor:true,wallH:3.6},
 climate:{floor:'#a8c98e',floor2:'#9cbf83',wall:'#7aa067',trim:'#4f7a4a',accent:'#5fa9c1',fog:'#d7eaee',sky:'#eef7f6',ground:'#8fb47c',indoor:false,wallH:1},
 commons:{floor:'#e3caa7',floor2:'#d6bb94',wall:'#f1e6d3',trim:'#b4633e',accent:'#e9b949',fog:'#efe5d6',sky:'#fbf3e6',ground:'#c9b79a',indoor:false,wallH:1.2},
 village:{floor:'#b6cf96',floor2:'#a9c688',wall:'#8fae74',trim:'#8a5a3a',accent:'#e7c25a',fog:'#e3edd9',sky:'#f6f6e8',ground:'#9dbb80',indoor:false,wallH:.9},
 access:{floor:'#cfd9ea',floor2:'#c2cee3',wall:'#eef2f8',trim:'#2f4f86',accent:'#58a07d',fog:'#e1e7ef',sky:'#f6f8fb',ground:'#b8c2d1',indoor:true,wallH:3.6},
 postcode:{floor:'#ddd9cf',floor2:'#cfe0bd',wall:'#efede6',trim:'#5b4a7a',accent:'#d27f4e',fog:'#e7e5ee',sky:'#f7f5fa',ground:'#bdb8c9',indoor:false,wallH:1.1},
 places:{floor:'#cfae84',floor2:'#c3a277',wall:'#f8f6f1',trim:'#2f3b45',accent:'#c9643f',fog:'#eeece6',sky:'#faf9f5',ground:'#c7c1b5',indoor:true,wallH:3.8},
 commonstead:{floor:'#e3dcc5',floor2:'#d3e0c6',wall:'#f5f1e4',trim:'#2f6a57',accent:'#7d68b8',fog:'#e5ebe1',sky:'#f7f6ec',ground:'#b5c4ab',indoor:true,wallH:3.6},
 hall:{floor:'#e6dcc7',floor2:'#d6caae',wall:'#f2ecdf',trim:'#6b4f3a',accent:'#c9643f',fog:'#ebe4d6',sky:'#f8f3e8',ground:'#c5b9a2',indoor:true,wallH:7},
 charter:{floor:'#cfae80',floor2:'#c29f70',wall:'#f3e9d6',trim:'#7a3f2e',accent:'#2f6a57',fog:'#efe3cf',sky:'#fbf4e6',ground:'#cbb592',indoor:true,wallH:4}
};
export const relationColor={provides:'#2fa37a',design:'#e3a530',condition:'#4f7fd0',office:'#9e2b25'};
export const stanceColor={convinced:'#2fa37a',unsure:'#e3a530',objection:'#d9603f'};
const C=h=>hex(h);
const polar=(r,a)=>[Math.sin(a)*r,-Math.cos(a)*r];
export const lookYaw=(fx,fz,tx,tz)=>Math.atan2(-(tx-fx),-(tz-fz));
// n angles from an even number of evenly spaced slots between lo and hi, filled from the centre outwards,
// so an odd count never puts a crystal on the straight line to the next doorway.
export function fan(n,lo,hi){const slots=n+(n%2),step=slots>1?(hi-lo)/(slots-1):0,all=Array.from({length:slots},(_,i)=>lo+step*i);
 return all.map((a,i)=>i).sort((i,j)=>Math.abs(all[i])-Math.abs(all[j])||i-j).slice(0,n).sort((i,j)=>i-j).map(i=>all[i]);}

// Where pictures can hang. a: angle around the room (0 = the far wall seen on arrival, positive = to the right);
// y: centre height; w and h: the largest picture the slot holds (it is fitted inside, keeping its proportions);
// inset: distance in from the room radius (negative = outside the low wall); stand: a free-standing board;
// view: how far from the picture the camera stops when a visitor opens it. The walls are flat segments, so a wide
// picture needs a deeper inset to clear the wall and window boxes at its edges (P023 check script in _output).
// A slot shows nothing until data.mjs lists a picture for it.
const P=Math.PI,wall=(id,a,o={})=>({id,a,y:2,w:2.1,h:1.45,inset:.1,...o});
export const artSlots={
 hub:[wall('hub-mural',P,{y:2.3,w:5.4,h:2.4,inset:.35})],
 commute:[wall('commute-1',2.58,{inset:.38}),wall('commute-2',2.132,{inset:.38}),wall('commute-3',-2.356,{inset:.38}),wall('commute-4',-2.8,{inset:.38})],
 climate:[wall('climate-1',-2.4,{y:2.45,w:2.4,h:1.6,inset:-1.4,stand:true}),wall('climate-2',2.4,{y:2.45,w:2.4,h:1.6,inset:-1.4,stand:true})],
 commons:[wall('commons-1',-2.5,{y:2.45,w:2.4,h:1.6,inset:-1.4,stand:true}),wall('commons-2',2.5,{y:2.45,w:2.4,h:1.6,inset:-1.4,stand:true}),wall('commons-3',-1.885,{y:2.45,w:2.4,h:1.6,inset:-1.4,stand:true}),wall('commons-4',1.885,{y:2.45,w:2.4,h:1.6,inset:-1.4,stand:true})],
 village:[wall('village-1',-2.09,{y:2.45,w:2.4,h:1.6,inset:-1.4,stand:true}),wall('village-2',2.09,{y:2.45,w:2.4,h:1.6,inset:-1.4,stand:true}),wall('village-3',-.85,{y:2.45,w:2.4,h:1.6,inset:-1.4,stand:true})],
 access:[wall('access-1',2.58),wall('access-2',-2.356),wall('access-3',1.683)],
 postcode:[wall('postcode-1',2.75,{y:2.45,w:2.4,h:1.6,inset:-1.4,stand:true}),wall('postcode-2',-2.8,{y:2.45,w:2.4,h:1.6,inset:-1.4,stand:true}),wall('postcode-3',.85,{y:2.45,w:2.4,h:1.6,inset:-1.4,stand:true})],
 places:[wall('places-1',1.92,{y:1.825,w:1.5,h:1,inset:.25}),wall('places-2',2.55,{y:1.825,w:1.5,h:1,inset:.25}),wall('places-3',-2.47,{y:1.825,w:1.5,h:1,inset:.25}),wall('places-4',-1.85,{y:1.825,w:1.5,h:1,inset:.25})],
 commonstead:[-.62,-1.22,-1.82,-2.42,.62,1.22,1.82,2.42].map((a,i)=>wall('commonstead-'+(i+1),a,{y:2,w:2.1,h:1.7,inset:.28})),
 // Between alcoves (and above the windows), so the objection pillars never stand in front of a picture.
 hall:[0,1,-1,2,-2].map((k,i)=>wall('hall-'+(i+1),k*P*.4,{y:5,w:2.8,h:2.8,inset:.2,view:7})),
 charter:[wall('charter-1',2.945,{y:2.05,w:1.5,h:2.25,inset:.24}),wall('charter-2',2.16,{y:2.05,w:1.5,h:2.25,inset:.24}),wall('charter-3',-2.553,{y:2.05,w:1.5,h:2.25,inset:.24})]
};
export const slotById=id=>Object.values(artSlots).flat().find(s=>s.id===id);

// Exhibit, value and doorway positions. Pure, so tests can check every target is inside the room.
export function layoutRoom(room,exhibits,vals,order){
 const R=room.radius,targets=[];
 const add=(kind,id,x,z,ry,extra={})=>targets.push({kind,id,x,z,ry,...extra});
 // Values share a distinct, walkable central circle; exhibits occupy the outer room.
 const valuesArea=vals.length?{x:0,z:1.2,radius:3.6}:null;
 if(room.theme==='hub'){
  add('exhibit',exhibits[0].id,-7,0,.9);add('exhibit',exhibits[1].id,7,0,-.9);add('exhibit',exhibits[2].id,0,-6.8,0);
  add('reading','reading',-4.8,-3.2,0);
  const dest=order.filter(id=>id!=='hub'),span=Math.PI*1.62;
  dest.forEach((id,i)=>{const a=-span/2+span*i/(dest.length-1),[x,z]=polar(R-.35,a);add('portal',id,x,z,-a);});
 }else if(room.theme==='hall'){
  const alcoves=10;
  for(const e of exhibits){
   const a=(e.alcove+.5)/alcoves*Math.PI*2,off=e.piece==='skeptic'?0:e.piece==='reply'?-.1:.1,r=e.piece==='skeptic'?R*.8:R*.67;
   const [x,z]=polar(r,a+off);add('exhibit',e.id,x,z,-(a+off),{alcove:e.alcove});
  }
  add('exhibit','tally',0,-1.2,0,{center:true});
  const [sx,sz]=polar(R-.4,Math.PI-.16),[cx,cz]=polar(R-.4,Math.PI+.16);
  add('portal','hub',sx,sz,-(Math.PI-.16));add('portal','charter',cx,cz,-(Math.PI+.16));
 }else{
  const n=exhibits.length,list=[...exhibits];
  for(const w of list.filter(e=>e.entrance)){list.splice(list.indexOf(w),1);const x=-R*.64,z=R*.32,ry=Math.atan2(-x,R*.74-z);add('exhibit',w.id,x,z,ry,{view:{x:x+Math.sin(ry)*3.2,z:z+Math.cos(ry)*3.2}});}
  const m=list.length,spread=m>4?1.45:1.28;
  list.forEach((e,i)=>{const a=m===1?0:-spread+2*spread*i/(m-1),[x,z]=polar(R*(vals.length?.76:.62),a);add('exhibit',e.id,x,z,-a);});
  const next=room.next;add('portal',next,0,-(R-.35),0,{role:'next'});
  if(room.id!=='hub'&&next!=='hub')add('portal','hub',0,R-.35,Math.PI,{role:'station'});
  if(room.id==='charter')add('portal','hall',-(R-.35),0,Math.PI/2,{role:'back'});
 }
 if(valuesArea){
  fan(vals.length,-1.55,1.55).forEach((a,i)=>{const [x,z]=polar(2.8,a);add('value',vals[i].id,x,z+valuesArea.z,0);});
  add('values-area','values-area',0,valuesArea.z+valuesArea.radius-.25,0);
 }
 return {targets,valuesArea,spawn:room.theme==='hall'?{x:0,z:7,yaw:0}:room.theme==='hub'?{x:0,z:8.2,yaw:0}:{x:0,z:R*.74,yaw:0},bounds:R-.9};
}

function sky(m,pal){const top=C(pal.dome||pal.sky),hor=C(pal.horizon||pal.fog);for(let j=0;j<6;j++){const p0=j/12*Math.PI,p1=(j+1)/12*Math.PI;for(let i=0;i<24;i++){const a0=i/24*Math.PI*2,a1=(i+1)/24*Math.PI*2,pt=(p,a)=>[Math.sin(p)*Math.cos(a)*90,Math.cos(p)*90-8,Math.sin(p)*Math.sin(a)*90];m.quad(pt(p0,a0),pt(p0,a1),pt(p1,a1),pt(p1,a0),mix(top,hor,j/5));}}}

function shell(m,room,pal,gaps){
 const R=room.radius,f1=C(pal.floor),f2=C(pal.floor2),wall=C(pal.wall),trim=C(pal.trim);
 if(!pal.indoor)m.disc(0,-.03,0,80,32,C(pal.ground));
 for(let i=0,r=R+.4;r>0.2;i++,r-=1.1)m.ring(0,i*.0006,0,Math.max(0,r-1.1),r,48,i%2?f2:f1);
 m.ring(0,.004,0,R-.25,R+.05,64,shade(trim,1.25));
 if(pal.indoor||room.theme==='commons')for(let i=0;i<32;i++){const a=i/32*Math.PI*2,c=Math.cos(a),s=Math.sin(a),w=.025;m.quad([c*1.2-s*w,.009,s*1.2+c*w],[c*(R-.3)-s*w,.009,s*(R-.3)+c*w],[c*(R-.3)+s*w,.009,s*(R-.3)-c*w],[c*1.2+s*w,.009,s*1.2-c*w],shade(f1,.9));}
 const seg=room.theme==='hall'?40:28,thick=.35;
 for(let i=0;i<seg;i++){
  const a=(i+.5)/seg*Math.PI*2,[x,z]=polar(R+.2,a);
  if(gaps.some(g=>Math.abs(Math.atan2(Math.sin(a-g),Math.cos(a-g)))<(room.theme==='hall'?.07:.16)))continue;
  const wlen=2*Math.PI*(R+.2)/seg+.04;
  m.box(x,0,z,wlen,pal.wallH,thick,wall,{ry:-a});
  if(pal.indoor){m.box(x,pal.wallH,z,wlen,.22,thick+.12,trim,{ry:-a});m.box(x,0,z,wlen,.28,thick+.06,shade(trim,1.1),{ry:-a});m.box(x,.28,z,wlen,.62,thick+.03,mix(wall,trim,.35),{ry:-a});if(i%2===0&&room.theme!=='places'){const [ix,iz]=polar(R+.17,a);m.box(ix,1.05,iz,wlen*.62,Math.min(2.2,pal.wallH-1.6),thick+.04,mix(C(pal.horizon||pal.sky),C(pal.accent),.12),{ry:-a});}}
  else m.box(x,pal.wallH,z,wlen,.12,thick+.1,shade(wall,1.12),{ry:-a});
 }
}

function tree(m,x,z,s=1,col='#5f9a62'){m.cyl(x,0,z,.12*s,1*s,6,C('#7a5a43'));m.cyl(x,.8*s,z,.75*s,1.6*s,7,C(col),{r2:0});m.cyl(x,1.6*s,z,.55*s,1.2*s,7,shade(C(col),1.08),{r2:0});}
function person(m,x,z,col,ry=0){m.cyl(x,0,z,.2,.95,8,C(col),{r2:.17,ry});m.sphere(x,1.15,z,.17,C('#e9c9a7'),8,5);}
function house(m,x,z,ry,wall='#f3e8d6',roof='#b4563c',s=1){m.box(x,0,z,2*s,1.5*s,1.8*s,C(wall),{ry});m.roof(x,1.5*s,z,2.2*s,2*s,.9*s,C(roof),ry);m.box(x,0,z,.45*s,.9*s,1.84*s,C('#7a5a43'),{ry});}

// Static prop geometry plus named dynamic parts (built at a local origin and placed by transform).
function prop(m,kind,x,z,ry,pal,dyn){
 const tr=C(pal.trim),ac=C(pal.accent),stone=C('#e8e4da'),dark=C('#33424a');
 const P=(lx,lz)=>[x+lx*Math.cos(ry)+lz*Math.sin(ry),z-lx*Math.sin(ry)+lz*Math.cos(ry)];
 const part=(name,mesh,lx,ly,lz,extra={})=>{const [px,pz]=P(lx,lz);dyn.push({name,mesh,x:px,y:ly,z:pz,ry,...extra});};
 m.disc(x,.012,z,1.05,18,shade(C(pal.floor),.84));m.cyl(x,0,z,.62,.28,14,stone);
 switch(kind){
  case 'sign':m.box(x,.28,z,.12,1.2,.12,dark,{ry});m.box(x,1.25,z,1.5,.95,.1,tr,{ry});m.box(x,1.32,z,1.3,.78,.12,C('#fbf8ef'),{ry});return 2.4;
  case 'monolith':m.box(x,.28,z,1,2.5,.4,tr,{ry});m.box(x,1.9,z,1.02,.12,.42,ac,{ry});return 3.1;
  case 'column':{m.cyl(x,.28,z,.42,.2,14,tr);m.cyl(x,2.6,z,.42,.2,14,tr);const g=new Mesh().cyl(0,0,0,.36,2.1,16,C('#bfe3d8'),{cap:false});part('glass',g,0,.48,0,{transparent:true,alpha:.28});const f=new Mesh().cyl(0,0,0,.3,1,14,C('#38b98a'));part('fill',f,0,.48,0,{em:[.08,.2,.14],scaleY:true});return 3.2;}
  case 'clock':{m.box(x,.28,z,.18,1.4,.18,dark,{ry});const face=new Mesh();for(let i=0;i<20;i++){const a0=i/20*Math.PI*2,a1=(i+1)/20*Math.PI*2;face.tri([0,0,0],[Math.cos(a0)*.75,Math.sin(a0)*.75,0],[Math.cos(a1)*.75,Math.sin(a1)*.75,0],C('#fbf8ef'));face.tri([0,0,-.02],[Math.cos(a1)*.85,Math.sin(a1)*.85,-.02],[Math.cos(a0)*.85,Math.sin(a0)*.85,-.02],tr);}
   part('face',face,0,2.25,.12);part('hourHand',new Mesh().box(0,0,0,.07,.45,.03,dark),0,2.25,.16,{spin:.4});part('minuteHand',new Mesh().box(0,0,0,.05,.65,.03,C(pal.accent)),0,2.25,.18,{spin:4.8});return 3.2;}
  case 'turnstile':for(const lx of [-.55,.55]){const [px,pz]=P(lx,0);m.box(px,.28,pz,.3,1,.7,C('#b9c0c4'),{ry});}{const [px,pz]=P(0,0);m.box(px,1.05,pz,.8,.06,.06,ac,{ry});}return 1.9;
  case 'bars':{const hs=[.3,.75,1.25,1.9];hs.forEach((h,i)=>{const lx=-.6+i*.4;part('bar'+i,new Mesh().box(0,0,0,.3,h,.3,C(['#9fb4a8','#7fa894','#4f9a7a','#2f7d5f'][i])),lx,.28,0);});return 2.7;}
  case 'car':m.box(x,.28,z,1.6,.45,.8,C('#d9603f'),{ry});m.box(x,.73,z,.9,.35,.72,C('#f4d9cf'),{ry});return 1.7;
  case 'scale':{m.box(x,.28,z,.12,1.5,.12,dark,{ry});const beam=new Mesh().box(0,0,0,2.2,.08,.12,tr);beam.box(-1,-.6,0,.04,.6,.04,dark).box(1,-.6,0,.04,.6,.04,dark).cyl(-1,-.65,0,.32,.06,12,C('#c9643f')).cyl(1,-.65,0,.32,.06,12,C('#2fa37a'));part('beam',beam,0,1.78,0);return 2.6;}
  case 'tree':tree(m,x,z,.9);return 3;
  case 'pie':{const seg=[[.4,'#2f6a57'],[.34,'#e3a530'],[.11,'#d9603f'],[.15,'#c9c3b5']];let a=0;for(const [f,col] of seg){const n=Math.max(2,Math.round(f*24));for(let i=0;i<n;i++){const a0=a+f*Math.PI*2*i/n,a1=a+f*Math.PI*2*(i+1)/n;m.tri([x,1.05,z],[x+Math.cos(a1)*.9,1.05,z+Math.sin(a1)*.9],[x+Math.cos(a0)*.9,1.05,z+Math.sin(a0)*.9],C(col));m.quad([x+Math.cos(a0)*.9,.9,z+Math.sin(a0)*.9],[x+Math.cos(a1)*.9,.9,z+Math.sin(a1)*.9],[x+Math.cos(a1)*.9,1.05,z+Math.sin(a1)*.9],[x+Math.cos(a0)*.9,1.05,z+Math.sin(a0)*.9],shade(C(col),.85));}a+=f*Math.PI*2;}m.cyl(x,.28,z,.12,.62,8,dark);return 1.9;}
  case 'bench':{const [bx,bz]=P(0,.2);m.box(bx,.28,bz,1.4,.18,.45,C('#8a5a3a'),{ry});m.box(bx,.46,bz,1.4,.5,.08,C('#8a5a3a'),{ry});const [px,pz]=P(.35,.15);person(m,px,pz,'#6f8fb5',ry);return 1.9;}
  case 'cafe':m.cyl(x,.28,z,.08,.75,6,dark);m.cyl(x,1.03,z,.5,.05,14,C('#fbf8ef'));m.cyl(x,.28,z,.04,1.9,6,dark);m.cyl(x,1.8,z,1,.45,10,ac,{r2:.05});return 2.6;
  case 'house':{house(m,x,z,ry,'#f3e8d6','#b4563c',.8);const w=new Mesh().box(0,0,0,.36,.34,.05,C('#fff2b8'));part('window',w,-.42,.62,.74,{em:[0,0,0],lamp:true});part('window2',w,.42,.62,.74,{em:[0,0,0],lamp:true});return 2.4;}
  case 'crate':for(const [lx,lz,c] of [[-.3,0,'#c9894f'],[.3,0,'#b97a42'],[0,.05,'#d9a35f']]){const [px,pz]=P(lx,lz);m.box(px,lx===0?.83:.28,pz,.55,.55,.55,C(c),{ry});}{const [px,pz]=P(0,.05);m.sphere(px,1.5,pz,.14,C('#d9603f'),8,5);}return 2;
  case 'frame':m.box(x,.28,z,.1,1.1,.1,dark,{ry});m.box(x,1.1,z,1.7,1.25,.08,C('#b08a52'),{ry});{const [px,pz]=P(0,.05);m.box(px,1.2,pz,1.45,1.02,.04,C(pal.accent),{ry});m.box(px,1.2,pz,1.45,.42,.05,C('#7aa067'),{ry});m.box(px,1.62,pz,1.45,.3,.05,C('#bcd8e4'),{ry});}return 2.7;
  case 'door':m.box(x,.28,z,.18,2.3,.2,tr,{ry});{const [a,b]=P(1.1,0);m.box(a,.28,b,.18,2.3,.2,tr,{ry});const [c,d]=P(.55,0);m.box(c,2.5,d,1.32,.18,.22,tr,{ry});const [e,f]=P(.55,.75);m.box(e,.28,f,1,.12,1.1,C('#cfd6e2'),{ry});}return 3;
  case 'tower':{const [ax,az]=P(-.35,0),[bx,bz]=P(.35,0);m.box(ax,.28,az,.45,2.1,.45,C('#3a5a8c'),{ry});m.box(bx,.28,bz,.45,1.2,.45,C('#58a07d'),{ry});return 2.8;}
  case 'bus':m.box(x,.28,z,2,1,.9,C('#e0a84a'),{ry});{const [px,pz]=P(0,.46);m.box(px,.75,pz,1.7,.35,.02,C('#dfeef5'),{ry});}m.cyl(x,1.28,z,.05,.9,6,dark);return 2.5;
  case 'desk':m.box(x,.28,z,1.4,.72,.7,C('#c7a47a'),{ry});m.box(x,1,z,.55,.03,.38,dark,{ry});{const [px,pz]=P(0,-.12);m.box(px,1.02,pz,.55,.36,.03,dark,{ry});}return 1.9;
  case 'table':{m.box(x,.28,z,3.8,.7,2.6,C('#c7a47a'),{ry});m.box(x,.98,z,3.6,.06,2.4,C('#cfe0c4'),{ry});
   const homes=new Mesh();for(const [lx,lz] of [[-1.2,-.6],[-.9,-.7],[-1.3,-.2],[-.95,-.25]]){homes.box(lx,0,lz,.24,.2,.22,C('#f3e8d6')).roof(lx,.2,lz,.28,.24,.14,C('#b4563c'));}part('homes',homes,0,1.04,0,{em:[0,0,0],hi:'homes'});
   const hub=new Mesh().box(.2,0,.1,.7,.35,.5,C('#7d68b8')).box(.2,.35,.1,.76,.06,.56,C('#5b4a7a'));part('hub',hub,0,1.04,0,{em:[0,0,0],hi:'hub'});
   const rail=new Mesh().box(.2,0,.85,3.4,.04,.12,C('#5a6570')).box(1.2,.04,.85,.6,.18,.16,C('#e0a84a'));part('rail',rail,0,1.04,0,{em:[0,0,0],hi:'transit'});
   for(const [lx,lz] of [[1.2,-.6],[1.4,-.2],[.9,-.5]])tree(m,P(lx,lz)[0],P(lx,lz)[1],.22);return 2.2;}
  case 'shield':{const s=new Mesh();const pts=[[-.6,1.6],[.6,1.6],[.6,.8],[0,.2],[-.6,.8]];for(let i=1;i<4;i++)s.tri([pts[0][0],pts[0][1],0],[pts[i][0],pts[i][1],0],[pts[i+1][0],pts[i+1][1],0],tr);part('shield',s,0,.4,0);['g0','g1','g2'].forEach((g,i)=>part(g,new Mesh().octa(0,0,0,.11,C('#38b98a')),-.3+i*.3,1.3,.08,{em:[0,0,0]}));return 2.4;}
  case 'steps':for(let i=0;i<4;i++)part('step'+i,new Mesh().box(0,0,0,.46,.25+i*.28,.6,C(['#cfe0c4','#a9cfa0','#7fb586','#4f9a7a'][i])),-.75+i*.5,.28,0,{em:[0,0,0]});return 2;
  case 'pillar':m.cyl(x,.28,z,.45,3.2,12,C('#e9e3d3'));m.cyl(x,3.45,z,.6,.25,12,C('#d8cfbb'));{const [px,pz]=P(0,.48);m.box(px,1.4,pz,.7,.5,.05,C(pal.accent),{ry});}part('stance',new Mesh().sphere(0,0,0,.18,C('#ffffff'),10,6),0,3.95,0,{em:[0,0,0],stance:true});return 4.2;
  case 'lectern':m.box(x,.28,z,.6,1,.5,C('#8a5a3a'),{ry});m.box(x,1.28,z,.75,.08,.6,C('#a8714d'),{ry});return 2;
  case 'plinth':m.box(x,.28,z,.8,.9,.8,stone,{ry});m.box(x,1.18,z,.7,.1,.5,C('#fbf8ef'),{ry});m.box(x,1.28,z,.02,.04,.5,tr,{ry});return 1.9;
  default:m.box(x,.28,z,.8,1,.8,tr,{ry});return 1.8;
 }
}

function decor(m,room,pal,dyn,gaps){
 const R=room.radius,th=room.theme;
 const ring=(r,n,fn,off=0)=>{for(let i=0;i<n;i++){const a=(i+.5)/n*Math.PI*2+off,[x,z]=polar(r,a);fn(x,z,a,i);}};
 if(th==='hub'){
  const doors=[...gaps].sort((a,b)=>a-b),step=doors.length>1?(doors.at(-1)-doors[0])/(doors.length-1):Math.PI/6;
  const pillars=[doors[0]-step/2,...doors.slice(1).map((a,i)=>(a+doors[i])/2),doors.at(-1)+step/2];
  for(const a of pillars){const [x,z]=polar(R-1.3,a);m.cyl(x,0,z,.32,4.4,10,C('#f3eedf'));m.cyl(x,4.4,z,.48,.3,10,C(pal.trim));}
  for(const [x,z] of [[-6,6],[6,6]]){m.box(x,0,z,2.2,.45,.6,C('#8a5a3a'),{ry:0});m.box(x,.45,z+.25,2.2,.5,.1,C('#8a5a3a'));}
  m.box(0,4.2,R+.1,6,1.3,.2,C('#22303a'));for(let i=0;i<4;i++)m.box(-1.8+i*1.2,4.45,R-.02,.9,.14,.05,C('#f3c969'));}
 if(th==='commute'){const tx=-(R-1.9);m.box(tx,.25,0,2.5,2.6,9,C('#c9d3d6'),{ry:0});m.box(tx+1.26,1.25,0,.05,.8,8.4,C('#33424a'));m.box(tx,2.85,0,2.6,.15,9.1,C('#344e5c'));m.box(tx+1.27,.25,0,.04,.14,9,C('#e0a84a'));
  for(const z of [-3,3]){m.box(R-1.6,0,z,.6,.45,2,C('#8a5a3a'));}for(const z of [-4,0,4])m.box(R-.5,2.4,z,.1,.5,1.6,C('#344e5c'));
  ring(R-.05,28,(x,z,a)=>{for(let k=1;k<4;k++)m.box(x,k*.85,z,2.4,.03,.38,C('#c7cdd2'),{ry:-a});});}
 if(th==='climate'){m.ring(0,.012,0,R-2.7,R-.9,64,C('#5b6466'));m.ring(0,.016,0,R-1.83,R-1.77,64,C('#eef0ec'));
  ring(R+3,14,(x,z,a,i)=>tree(m,x,z,1.2+(i%3)*.3,i%2?'#5f9a62':'#4f8a57'));ring(R+12,8,(x,z,a,i)=>{m.cyl(x,0,z,.25,9,8,C('#f1f1ec'),{r2:.15});},.3);
  for(let i=0;i<12;i++)dyn.push({name:'car'+i,mesh:new Mesh().box(0,0,0,.9,.38,1.6,C(['#d9603f','#e3a530','#5f86b5','#6f8f7a'][i%4])).box(0,.38,.05,.75,.3,.85,C('#eef3f5')),x:0,y:.03,z:0,ry:0,car:i});}
 if(th==='commons'){ring(R+2.4,10,(x,z,a,i)=>{m.box(x,0,z,3.4,3+(i%3)*.6,2.2,C(['#f3e2c7','#e9cdb0','#f1d6c4'][i%3]),{ry:-a});m.box(x,2.2,z,3.5,.12,2.6,C(i%2?'#b4633e':'#2f6a57'),{ry:-a});});
  for(const [x,z] of [[-5.8,5.4],[5.8,5.4],[-8.6,1.5],[8.6,1.5]])tree(m,x,z,.9,'#6aa66a');
  [[-3.4,3.2],[3.6,2.8],[0,-8.4],[-8.4,-5.2],[8.4,-5]].forEach(([x,z],i)=>dyn.push({name:'p'+i,mesh:new Mesh().cyl(0,0,0,.2,.95,8,C(['#6f8fb5','#b4633e','#2f6a57','#e3a530','#7d68b8'][i]),{r2:.17}).sphere(0,1.15,0,.17,C('#e9c9a7'),8,5),x,y:0,z,ry:i,bob:i}));}
 if(th==='village'){m.disc(0,-.025,0,60,24,C('#a9c688'));ring(R+3.4,9,(x,z,a,i)=>{const w=['#f3e8d6','#efe1c7','#f6eee0'][i%3];house(m,x,z,-a,w,i%2?'#b4563c':'#8a5a3a',1.1);const win=new Mesh().box(0,0,0,.4,.38,.05,C('#fff2b8'));const [wx,wz]=polar(R+3.4-1.02,a);dyn.push({name:'vwin'+i,mesh:win,x:wx,y:.7,z:wz,ry:-a,em:[0,0,0],lamp:true,idx:i});});
  {const [x,z]=polar(R+7,0);m.box(x,0,z,2,6,2,C('#efe1c7'));m.cyl(x,6,z,1.5,2.4,4,C('#8a5a3a'),{r2:0,ry:Math.PI/4});}ring(R+14,12,(x,z,a,i)=>tree(m,x,z,1.4,i%2?'#5f9a62':'#6aa66a'),.15);}
 if(th==='access'){for(const s of [-1,1]){const x=s*(R-1.4);m.box(x,0,-2,1.6,.1,5,C('#cfd6e2'));m.box(x,.1,-2,1.6,.3,.3,C('#3a5a8c'));}ring(R-.1,6,(x,z,a)=>{m.box(x,0,z,1.3,2.5,.4,C('#3a5a8c'),{ry:-a});m.box(x,0,z,.9,2.2,.45,C('#dfe7f2'),{ry:-a});},.5);}
 if(th==='postcode'){m.disc(0,.008,0,R,32,C('#e3e1d9'));
  for(let i=0;i<7;i++){const a=-Math.PI/2-.9+i*.3,[x,z]=polar(R+3,a);m.box(x,0,z,2.4,5+(i%3)*3,2.4,C(['#c9cbd6','#b7bccb','#d6d4dd'][i%3]),{ry:-a});}
  for(let i=0;i<6;i++){const a=Math.PI/2-.8+i*.32,[x,z]=polar(R+3,a);house(m,x,z,-a,'#f3e8d6','#5b8a57',1);tree(m,...polar(R+6,a+.15),1.1);}
  house(m,-5.2,1,Math.PI/2,'#d6d9e2','#5b4a7a',.9);house(m,5.2,1,-Math.PI/2,'#f3e8d6','#5b8a57',.9);m.box(0,.012,1,8.4,.01,.6,C('#cdbfa6'));}
 if(th==='places'){ring(R-.05,10,(x,z,a,i)=>{const fr=C('#b08a52');m.box(x,1.2,z,1.8,1.3,.3,fr,{ry:-a});m.box(x,1.3,z,1.55,1.05,.34,C(['#7aa067','#bcd8e4','#e3a530','#c9643f','#9fb4a8'][i%5]),{ry:-a});},.35);m.box(0,0,0,1.8,.45,.6,C('#2f3b45'));}
 if(th==='commonstead'){for(const s of artSlots.commonstead){const [x,z]=polar(R-.05,s.a);m.box(x,1.1,z,2.2,1.8,.4,C('#cfe3ea'),{ry:-s.a});}for(const [x,z] of [[-7,4],[7,4]])tree(m,x,z,.7,'#6aa66a');}
 if(th==='hall'){ring(R-1.2,40,(x,z,a)=>{if(Math.abs(Math.atan2(Math.sin(a-Math.PI),Math.cos(a-Math.PI)))<.3)return;m.cyl(x,0,z,.38,7,10,C('#f1ebde'));m.cyl(x,7,z,.55,.35,10,C('#d8cfbb'));});m.ring(0,7.3,0,R-2,R+.4,64,C('#d8cfbb'));
  m.cyl(0,0,0,4,.3,36,C('#ddd5c0'));for(let i=0;i<10;i++){const a=(i+.5)/10*Math.PI*2,[x,z]=polar(R*.8,a);m.ring(x,.01,z,0,2.4,20,C('#efe7d6'));}
  for(let i=0;i<3;i++)dyn.push({name:'tally'+i,mesh:new Mesh().box(0,0,0,.6,1,.6,C(['#2fa37a','#e3a530','#d9603f'][i])),x:-1+i,y:.3,z:-1.2,ry:0,tally:i,scaleY:true});}
 if(th==='charter'){ring(R-.05,16,(x,z,a,i)=>{if(i%2)m.box(x,.8,z,1.6,2.4,.3,C('#e9d9bb'),{ry:-a});});m.cyl(0,0,0,2.4,.15,28,C('#cfb48b'));}
 if(!pal.indoor&&th!=='village'&&th!=='climate'&&th!=='postcode')ring(R+8,10,(x,z,a,i)=>tree(m,x,z,1.3,i%2?'#5f9a62':'#6aa66a'),.2);
}

// Soft clouds drifting slowly around the Station, beyond the walls. Unlit, so the haze never hides them.
function cloudMesh(seed){const g=new Mesh(),puffs=4+seed%3;for(let i=0;i<puffs;i++){const k=i/(puffs-1)-.5;g.sphere(k*6.5,Math.cos(k*2.6)*1.2,((i*7+seed)%5-2)*.5,2.2+Math.cos(k*3)*1.1,[1,1,1],12,7);}
 for(let i=0;i<g.c.length;i++)g.c[i]=.62+.38*g.c[i]+(i%3===2?.02:0);return g;}
function clouds(dyn){const shapes=[0,1,2].map(cloudMesh);
 for(let i=0;i<11;i++){const a=i/11*Math.PI*2+(i%3)*.17,r=46+(i*13)%20;dyn.push({name:'cloud',mesh:shapes[i%3],x:0,y:0,z:0,ry:0,unlit:true,cloud:{a,r,y:15+(i*7)%11,s:.8+(i%4)*.18}});}}

// Doorways are vortices: royal blue at the rim, black at the centre, with slowly turning arms and a silver ring.
const royal=hex('#2f55e0'),abyss=[0,0,.02];
function vortexMesh(){const g=new Mesh(),hw=1.1,hh=1.55,n=40,rings=[0,.12,.3,.5,.72,.9,1];
 const at=(i,f)=>{const a=i/n*Math.PI*2+(1-f)*1.3,dx=Math.cos(a),dy=Math.sin(a),edge=Math.min(hw/Math.max(Math.abs(dx),1e-6),hh/Math.max(Math.abs(dy),1e-6));
  const arm=1+.22*Math.sin(a*3-f*5)*f*(1-f)*3;return {p:[dx*edge*f,hh+dy*edge*f,0],c:mix(abyss,royal,Math.min(1,Math.pow(f,1.35)*arm))};};
 for(let k=0;k<rings.length-1;k++)for(let i=0;i<n;i++){const a=at(i,rings[k]),b=at(i+1,rings[k]),c=at(i+1,rings[k+1]),d=at(i,rings[k+1]);g.triC(a.p,b.p,c.p,a.c,b.c,c.c).triC(a.p,c.p,d.p,a.c,c.c,d.c);}
 return g;}
function armsMesh(){const g=new Mesh(),glow=hex('#7f9cff');for(let k=0;k<3;k++)for(let j=0;j<18;j++){const s0=j/18,s1=(j+1)/18,pt=(s,side)=>{const r=.08+.95*s,a=k*Math.PI*2/3+2.8*s,w=(.03+.14*s)*side;return [Math.cos(a)*r-Math.sin(a)*w,Math.sin(a)*r+Math.cos(a)*w,0];};
  const c0=mix([0,0,0],glow,s0*(1-s0*.4)),c1=mix([0,0,0],glow,s1*(1-s1*.4));g.triC(pt(s0,-1),pt(s1,-1),pt(s1,1),c0,c1,c1).triC(pt(s0,-1),pt(s1,1),pt(s0,1),c0,c1,c0);}return g;}
function silverMesh(){const g=new Mesh();for(let i=0;i<16;i++){const a=i/16*Math.PI*2;g.octa(Math.cos(a)*.8,Math.sin(a)*.8,0,.075,hex(i%2?'#c3c9d2':'#e4e8ee'));}return g;}
let doorMeshes=null;
function portalParts(dyn,t,accent){
 doorMeshes??={vortex:vortexMesh(),arms:armsMesh(),silver:silverMesh()};
 const frame=new Mesh().box(-1.25,0,0,.3,3.2,.4,C('#2f3b45')).box(1.25,0,0,.3,3.2,.4,C('#2f3b45')).box(0,3.2,0,2.8,.35,.45,C('#2f3b45')).box(0,0,0,2.2,.06,.8,C(accent));
 const [ox,oz]=[Math.sin(t.ry),Math.cos(t.ry)];
 dyn.push({name:'frame',mesh:frame,x:t.x,y:0,z:t.z,ry:t.ry,portal:t.id});
 dyn.push({name:'membrane',mesh:doorMeshes.vortex,x:t.x,y:.05,z:t.z,ry:t.ry,portal:t.id,unlit:true});
 dyn.push({name:'arms',mesh:doorMeshes.arms,x:t.x+ox*.03,y:1.6,z:t.z+oz*.03,ry:t.ry,portal:t.id,transparent:true,alpha:.55,unlit:true,arms:true});
 dyn.push({name:'swirl',mesh:doorMeshes.silver,x:t.x+ox*.07,y:1.6,z:t.z+oz*.07,ry:t.ry,portal:t.id,em:[.08,.08,.1],swirl:true});
}

// Build a room into GPU buffers once; returns targets, dynamic items and an update function.
export function buildRoom(engine,room,exhibits,vals,order,themeOf,art=[]){
 const pal=palettes[room.theme],m=new Mesh(),sk=new Mesh(),dyn=[];
 const L=layoutRoom(room,exhibits,vals,order);
 const gaps=L.targets.filter(t=>t.kind==='portal').map(t=>Math.atan2(t.x,-t.z));
 sky(sk,pal);
 shell(m,room,pal,gaps);decor(m,room,pal,dyn,gaps);if(pal.clouds)clouds(dyn);
 if(L.valuesArea){const a=L.valuesArea;
  m.disc(a.x,.035,a.z,a.radius,64,C('#d4e5cf'));
  m.ring(a.x,.04,a.z,a.radius-.12,a.radius,64,C('#2f6a57'));
  m.ring(a.x,.041,a.z,a.radius-.27,a.radius-.23,64,C('#a9c8a3'));
 }
 const targets=[];
 for(const t of L.targets){
  if(t.kind==='exhibit'){
   const ex=exhibits.find(e=>e.id===t.id),kind=t.id==='tally'?'column':ex?.prop||'sign';
   const before=dyn.length,h=t.id==='tally'?0:prop(m,kind,t.x,t.z,t.ry,pal,dyn);
   for(const d of dyn.slice(before))d.owner=t.id;
   const glow=new Mesh().ring(0,0,0,.72,.95,28,C(pal.accent));dyn.push({name:'glow',mesh:glow,x:t.x,y:.02,z:t.z,ry:0,owner:t.id,transparent:true,alpha:.55,unlit:true,glow:true});
   const toC=Math.hypot(t.x,t.z)||1,dist=t.center?4.4:3.5,vx=t.view?t.view.x:t.center?t.x:t.x-t.x/toC*dist,vz=t.view?t.view.z:t.center?t.z+dist:t.z-t.z/toC*dist;
   const hh=h||2.8;targets.push({kind:'exhibit',id:t.id,pos:[t.x,hh+.15,t.z],hit:[t.x,hh*.5,t.z],r:Math.max(t.center?1.4:1,hh*.48),view:{x:vx,z:vz,yaw:lookYaw(vx,vz,t.x,t.z)},alcove:t.alcove});
  }else if(t.kind==='reading'){
   m.cyl(t.x,0,t.z,1.1,.18,32,C('#b8d8bb'));
   m.cyl(t.x,.18,t.z,.82,1.7,32,C('#2f6a57'));
   m.cyl(t.x,1.88,t.z,.92,.12,32,C('#cfead5'));
   m.box(t.x-.28,2.02,t.z,.52,.07,.65,C('#fbf8ef'),{ry:-.12});
   m.box(t.x+.28,2.02,t.z,.52,.07,.65,C('#fbf8ef'),{ry:.12});
   targets.push({kind:'reading',id:t.id,pos:[t.x,3.6,t.z],hit:[t.x,1.2,t.z],r:1.1});
  }else if(t.kind==='values-area'){
   targets.push({kind:t.kind,id:t.id,pos:[t.x,.35,t.z]});
  }else if(t.kind==='value'){
   const v=vals.find(x=>x.id===t.id),col=C(relationColor[v.relation]);
   m.cyl(t.x,0,t.z,.3,.12,10,C('#e8e4da'));
   // Commercial priorities are dark red blocks rather than gems.
   dyn.push({name:'crystal',mesh:v.relation==='office'?new Mesh().box(0,-.24,0,.44,.48,.44,col):new Mesh().octa(0,0,0,.32,col),x:t.x,y:.9,z:t.z,ry:0,value:t.id,em:[0,0,0]});
   dyn.push({name:'halo',mesh:new Mesh().ring(0,0,0,.42,.52,20,col),x:t.x,y:.9,z:t.z,ry:0,value:t.id,transparent:true,alpha:.5,unlit:true,halo:true});
   targets.push({kind:'value',id:t.id,pos:[t.x,1.7,t.z],hit:[t.x,.9,t.z],r:.6,view:{x:t.x,z:t.z+2.4,yaw:0}});
  }else if(t.kind==='portal'){
   const acc=palettes[themeOf(t.id)]?.accent||'#c9643f';portalParts(dyn,t,acc);
   const toC=Math.hypot(t.x,t.z)||1;targets.push({kind:'portal',id:t.id,role:t.role,pos:[t.x,3.7,t.z],hit:[t.x,1.6,t.z],r:1.5,view:{x:t.x-t.x/toC*2.5,z:t.z-t.z/toC*2.5,yaw:lookYaw(t.x-t.x/toC*2.5,t.z-t.z/toC*2.5,t.x,t.z)}});
  }
 }
 // Pictures: a frame (and posts for a free-standing board) plus a textured quad that app.mjs fills once the image loads.
 const R=room.radius,pics=[];
 for(const a of art){
  const sl=artSlots[room.id]?.find(x=>x.id===a.slot);if(!sl)continue;
  const w=Math.min(sl.w,sl.h*a.aspect),h=w/a.aspect,r=R-sl.inset,[x,z]=polar(r,sl.a),ry=-sl.a,[fx,fz]=[Math.sin(ry),Math.cos(ry)];
  if(sl.stand)for(const s2 of [-1,1]){const px=x+Math.cos(ry)*s2*(w/2-.1)-fx*.06,pz=z-Math.sin(ry)*s2*(w/2-.1)-fz*.06;m.box(px,0,pz,.12,sl.y,.12,C('#3a3027'),{ry});}
  m.box(x-fx*.04,sl.y-h/2-.07,z-fz*.04,w+.14,h+.14,.06,C(sl.stand?'#3a3027':'#4a3b2c'),{ry});
  const pic={name:'art',art:a.id,x:x+fx*.005,y:sl.y,z:z+fz*.005,ry,w,h,picture:true};pics.push(pic);
  const d=sl.view||Math.max(3,h*1.9,w*1.15),vx=x+fx*d,vz=z+fz*d,lim=room.radius-1.1,vr=Math.hypot(vx,vz),k=vr>lim?lim/vr:1;
  targets.push({kind:'art',id:a.id,pos:[x,sl.y+h/2+.32,z],hit:[x,sl.y,z],r:Math.max(w,h)*.55,view:{x:vx*k,z:vz*k,yaw:lookYaw(vx*k,vz*k,x,z),pitch:Math.atan2(sl.y-1.65,Math.hypot(x-vx*k,z-vz*k))}});
 }
 for(const p of pics)p.t=trs(p.x,p.y,p.z,p.ry,0,0,p.w,p.h,1);
 const statics=[{handle:engine.upload(m)}];if(sk.count)statics.unshift({handle:engine.upload(sk),unlit:true});
 const cache=new Map();
 for(const d of dyn){const key=d.mesh;if(!cache.has(key))cache.set(key,engine.upload(d.mesh));d.handle=cache.get(key);d.t=trs(d.x,d.y,d.z,d.ry);}
 const items=[...statics,...dyn,...pics];
 const env={fog:C(pal.fog),sky:C(pal.sky),ground:C(pal.ground),near:pal.indoor?(room.theme==='hall'?32:18):24,far:pal.indoor?(room.theme==='hall'?85:62):95};
 const obstacles=targets.filter(t=>t.kind==='exhibit'||t.kind==='reading').map(t=>({x:t.pos[0],z:t.pos[2],r:t.kind==='reading'?1.1:t.id==='tally'?1.4:(exhibits.find(e=>e.id===t.id)?.prop==='table'?2.4:.85)}));
 return {room,items,dyn,targets,pics,spawn:L.spawn,bounds:L.bounds,env,obstacles,pal};
}

// Per-frame animation and state reflection for dynamic parts.
export function animateRoom(built,dt,time,s,motion){
 const R=built.room.radius,mt=motion?time:0;
 for(const d of built.dyn){
  let x=d.x,y=d.y,z=d.z,ry=d.ry,rx=0,rz=0,sx=1,sy=1,sz=1;
  if(d.value){const claimed=s.values.has(d.value);
   if(d.name==='crystal'){y=d.y+(motion?Math.sin(time*1.6+d.x)*.08:0)+(claimed?.35:0);ry=mt*(claimed?2.2:.8);d.em=claimed?[.35,.28,.05]:(s.hover===d.value?[.15,.15,.15]:[0,0,0]);sx=sy=sz=claimed?.75:1;}
   else{y=d.y+(claimed?.35:0)+(motion?Math.sin(time*1.6+d.x)*.08:0);sx=sy=sz=claimed?1.25:1+(motion?Math.sin(time*2)*.05:0);d.alpha=claimed?.75:.35;}
  }
  if(d.glow){const seen=s.seen.has(d.owner);d.alpha=s.hover===d.owner?.9:seen?.18:.5+(motion?Math.sin(time*2.4)*.15:0);}
  if(d.swirl)rz=mt*1.2;
  if(d.arms)rz=-mt*1.6;
  if(d.cloud){const c=d.cloud,a=c.a+mt*.006;x=Math.sin(a)*c.r;z=-Math.cos(a)*c.r;y=c.y+(motion?Math.sin(time*.15+c.a*3)*.6:0);ry=-a+Math.PI/2;sx=sz=c.s;sy=c.s*.55;}
  if(d.spin)rz=-mt*d.spin;
  if(d.name==='fill'){const f=built.room.theme==='hub'||built.room.theme==='charter'?s.meter.fill:0;sy=Math.max(.02,f*2.05);d.em=[.06+.2*f,.18+.25*f,.12+.15*f];}
  if(d.car!==undefined){const n=Math.round(12*(1-s.remoteDays/5));d.hidden=d.car>=n;const ang=(d.car/12)*Math.PI*2+mt*.12*(d.car%2?1:-1)*.9;const r=d.car%2?R-1.4:R-2.2;x=Math.sin(ang)*r;z=-Math.cos(ang)*r;ry=Math.PI/2-ang+(d.car%2?0:Math.PI);}
  if(d.bob!==undefined){y=motion?Math.abs(Math.sin(time*2+d.bob))*.06:0;ry=d.ry+(motion?Math.sin(time*.4+d.bob)*.6:0);}
  if(d.name==='beam'){const gap=s.pay.equal?0:s.pay.gap/60000;rz=-gap*.9;}
  if(d.name.startsWith('bar')&&d.owner==='gradient'){const i=+d.name.slice(3),band=s.remoteDays===0?0:s.remoteDays===1?1:s.remoteDays<5?2:3;d.em=i===band?[.18,.16,.05]:[0,0,0];}
  if(d.lamp){const lit=d.idx===undefined?(d.owner!=='lights'||s.villageMode==='local'):(s.villageMode==='local'?d.idx%4!==3:d.idx%4===0);d.em=lit?[.55,.45,.12]:[0,0,0];}
  if(d.hi){d.em=s.priority===d.hi?[.25,.22,.08]:[0,0,0];y=d.y+(s.priority===d.hi&&motion?Math.abs(Math.sin(time*2))*.04:0);}
  if(/^g\d$/.test(d.name)){const k=['housing','green','hub'][+d.name[1]];d.em=s.safeguards[k]?[.1,.3,.2]:[0,0,0];sx=sy=sz=s.safeguards[k]?1:.6;ry=mt;}
  if(d.name.startsWith('step')){d.em=+d.name.slice(4)===s.phase?[.2,.2,.08]:[0,0,0];}
  if(d.tally!==undefined){const t=s.tally,v=[t.convinced,t.unsure,t.objection][d.tally];sy=.05+v*.32;}
  if(d.stance){const st=s.stances[d.owner?.slice(4)];d.em=st==='convinced'?[.05,.4,.25]:st==='unsure'?[.45,.32,.04]:st==='objection'?[.45,.12,.06]:[0,0,0];}
  d.t=trs(x,y,z,ry,rx,rz,sx,sy,sz);
 }
}
