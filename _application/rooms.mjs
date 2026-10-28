// Procedural rooms for the rooms edition. Each room is built around the origin; only one is drawn at a time.
// All geometry is illustrative: nothing here is a map, a measurement or a forecast.
import {Mesh,trs,hex,shade,mix} from './engine.mjs';

const islandPalette={floor:'#d7c7a8',floor2:'#c5b58e',wall:'#e8ddc3',trim:'#45664b',accent:'#d2a25d',fog:'#c9dfe0',sky:'#a9d3e2',ground:'#9dbb88',dome:'#65a9c9',horizon:'#b7dce3',sea:'#4f9daa',path:'#d3c19d',canopy:'#527d53',canopyLight:'#719366',shrub:'#7f9f69',flowers:['#efd27d','#f1e9d0','#e59a78'],clouds:true,indoor:false,wallH:0};
const paletteByTheme={
 fairness:{ground:'#a3bd88',canopy:'#587d52',canopyLight:'#779868',shrub:'#87a76e',flowers:['#f0d47a','#f5edda','#df9d7b'],accent:'#c69a59'},
 hub:{ground:'#99b983',canopy:'#4f7952',canopyLight:'#71966b',shrub:'#80a06d',flowers:['#efd27b','#f4ecd7','#dd9879'],accent:'#d2a25d'},
 commute:{ground:'#a8bd8a',canopy:'#5d8055',canopyLight:'#82996a',shrub:'#91a972',flowers:['#e8c767','#f1e5ca','#d98b76'],accent:'#c89b5f'},
 climate:{ground:'#93b582',canopy:'#47744f',canopyLight:'#6d9163',shrub:'#789b68',flowers:['#e2c975','#ede8d5','#d99b80'],accent:'#c5a16d'},
 commons:{ground:'#a2bd87',canopy:'#527950',canopyLight:'#769466',shrub:'#8ca66d',flowers:['#ebcf75','#f3ead7','#d98772'],accent:'#c89b5b'},
 village:{ground:'#abc18e',canopy:'#648454',canopyLight:'#8b9e6e',shrub:'#93a86f',flowers:['#e7c979','#f5ebdf','#d98ea0'],accent:'#c99c65'},
 access:{ground:'#9cbd91',canopy:'#4f7f64',canopyLight:'#76a07b',shrub:'#84a986',flowers:['#e9d17f','#f4eee0','#a8bdcf'],accent:'#c29a65'},
 postcode:{ground:'#a4bd91',canopy:'#5d805e',canopyLight:'#809a72',shrub:'#91a77c',flowers:['#ebcf79','#eee8d8','#a894c1'],accent:'#c49b67'},
 places:{ground:'#97b794',canopy:'#4c786c',canopyLight:'#719787',shrub:'#81a797',flowers:['#ead081','#f3ecd9','#d98f86'],accent:'#bd986a'},
 commonstead:{ground:'#9db981',canopy:'#53784e',canopyLight:'#7a9563',shrub:'#89a66b',flowers:['#edcf74','#f3ead4','#dc9d73'],accent:'#c99d5a'},
 hall:{ground:'#a2bb8f',canopy:'#587b59',canopyLight:'#7c966f',shrub:'#8aa47b',flowers:['#e8ce7d','#f0eadc','#aa9bc4'],accent:'#c59a67'},
 charter:{ground:'#aec28c',canopy:'#617f4c',canopyLight:'#889b64',shrub:'#98a96c',flowers:['#f0d16c','#f3ecd9','#df9576'],accent:'#c99a55'}
};
export const palettes=Object.fromEntries(Object.entries(paletteByTheme).map(([id,theme])=>[id,{...islandPalette,...theme}]));
export const valueColor={principle:'#45ad99',question:'#8d8bc6',tension:'#d4a353'};
export const stanceColor={convinced:'#2fa37a',unsure:'#e3a530',objection:'#d9603f'};
const C=h=>hex(h);
const polar=(r,a)=>[Math.sin(a)*r,-Math.cos(a)*r];
export const lookYaw=(fx,fz,tx,tz)=>Math.atan2(-(tx-fx),-(tz-fz));
// n angles from an even number of evenly spaced slots between lo and hi, filled from the centre outwards,
// so an odd count never puts a crystal on the straight line to the next doorway.
export function fan(n,lo,hi){const slots=n+(n%2),step=slots>1?(hi-lo)/(slots-1):0,all=Array.from({length:slots},(_,i)=>lo+step*i);
 return all.map((a,i)=>i).sort((i,j)=>Math.abs(all[i])-Math.abs(all[j])||i-j).slice(0,n).sort((i,j)=>i-j).map(i=>all[i]);}

// Freestanding garden boards and stone stelae. a: angle around the room (0 = the far view on arrival, positive = right);
// y: centre height; w and h: the largest picture the slot holds (it is fitted inside, keeping its proportions);
// inset: distance in from the room radius (negative = beyond the garden edge); stand: the board has visible supports;
// view: how far from the picture the camera stops when a visitor opens it.
// A slot shows nothing until data.mjs lists a picture for it.
const P=Math.PI,wall=(id,a,o={})=>({id,a,y:2,w:2.1,h:1.45,inset:.1,stand:true,...o});
export const artSlots={
 fairness:[wall('fairness-1',2.65,{y:2.1,w:3,h:2,inset:.3})],
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
  // The opening includes both evaluative language and objectivity. Keep every
  // lectern outside the central values circle and clear of the doorway ring.
  const openingSlots=[[-7,0,.9],[7,0,-.9],[0,-6.8,0],[-8,-6,.65],[8,-6,-.65],[0,-10.5,0]];
  if(exhibits.length>openingSlots.length)throw Error('Opening room needs another planned exhibit slot');
  exhibits.forEach((exhibit,i)=>add('exhibit',exhibit.id,...openingSlots[i]));
  add('reading','reading',-4.8,-3.2,0);
  const dest=order.filter(id=>id!=='hub'),span=Math.PI*1.62;
  dest.forEach((id,i)=>{const a=-span/2+span*i/(dest.length-1),[x,z]=polar(R-.35,a);add('portal',id,x,z,-a);});
 }else if(room.theme==='hall'){
  const alcoves=10;
  for(const e of exhibits){
   const a=(e.alcove+.5)/alcoves*Math.PI*2,off=e.piece==='skeptic'?0:e.piece==='reply'?-.1:.1,r=e.piece==='skeptic'?R*.8:R*.67;
   const [x,z]=polar(r,a+off);add('exhibit',e.id,x,z,-(a+off),{alcove:e.alcove});
  }
  add('exhibit','tally',0,-6.5,0,{center:true});
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

function sky(m,pal){
 const top=C(pal.dome||pal.sky),hor=C(pal.horizon||pal.fog),radius=155,center=-18,rings=10,segments=32;
 for(let j=0;j<rings;j++){const p0=j/rings*1.61,p1=(j+1)/rings*1.61;
  for(let i=0;i<segments;i++){const a0=i/segments*Math.PI*2,a1=(i+1)/segments*Math.PI*2,pt=(p,a)=>[Math.sin(p)*Math.cos(a)*radius,Math.cos(p)*radius+center,Math.sin(p)*Math.sin(a)*radius];
   m.quad(pt(p0,a0),pt(p0,a1),pt(p1,a1),pt(p1,a0),mix(top,hor,j/(rings-1)));
  }
 }
}

function coastWave(a,phase){return Math.sin(a*2.7+phase)*.72+Math.sin(a*6.3-phase*.65)*.28+Math.sin(a*11+phase*.4)*.09;}
function coastPoint(r,y,a,warp,phase){const wobble=coastWave(a,phase)*warp;return [Math.sin(a)*(r+wobble),y+Math.sin(a*3.7+phase)*warp*.11,-Math.cos(a)*(r+wobble)];}
function terrainBand(m,r0,r1,y0,y1,warp0,warp1,col0,col1,phase){
 for(let i=0;i<72;i++){const a0=i/72*Math.PI*2,a1=(i+1)/72*Math.PI*2;
  const p0=coastPoint(r0,y0,a0,warp0,phase),p1=coastPoint(r1,y1,a0,warp1,phase),p2=coastPoint(r1,y1,a1,warp1,phase),p3=coastPoint(r0,y0,a1,warp0,phase);
  const tint=i%7===0?.25:.06;m.quad(p0,p1,p2,p3,mix(C(col0),C(col1),tint));
 }
}
function ellipsoid(m,x,y,z,rx,ry,rz,col,seg=12,rings=6,yaw=0){
 const c=Math.cos(yaw),s=Math.sin(yaw),pt=(p,a)=>{const dx=Math.sin(p)*Math.cos(a)*rx,dz=Math.sin(p)*Math.sin(a)*rz;return [x+dx*c+dz*s,y+Math.cos(p)*ry,z-dx*s+dz*c];};
 for(let j=0;j<rings;j++){const p0=j/rings*Math.PI,p1=(j+1)/rings*Math.PI;
  for(let i=0;i<seg;i++){const a0=i/seg*Math.PI*2,a1=(i+1)/seg*Math.PI*2,k=.84+.16*Math.cos(p0);m.quad(pt(p0,a0),pt(p0,a1),pt(p1,a1),pt(p1,a0),shade(col,k));}
 }
}
function horizonIslands(m,pal){
 // Overlapping broad ellipsoids form round, multi-peaked ridges; the low shore is hidden beneath the sea plane.
 const greens=['#668d68','#72976d','#5f8667','#7b9c70','#6a906e'];
 for(let i=0;i<9;i++){
  const a=-Math.PI+i*Math.PI*2/9+Math.sin(i*2.13)*.105,r=43+(i*17%27),[x,z]=polar(r,a),yaw=-a;
  const w=12+(i*7%7),d=6.5+(i*5%4),base=C(greens[i%greens.length]),upper=C(pal.canopyLight||'#78976c');
  ellipsoid(m,x,-1.5,z,w,4.7,d,base,12,6,yaw);
  ellipsoid(m,x-.15*Math.cos(a),-.25,z+.15*Math.sin(a),w*.69,3.8,d*.72,shade(base,1.08),12,6,yaw);
  const peaks=[[-w*.31,1.05,-d*.05,.47,.58], [w*.25,.55,d*.13,.42,.53], [w*.02,1.65,-d*.3,.29,.40]];
  for(let p=0;p<peaks.length;p++){const [lx,cy,lz,scaleX,scaleZ]=peaks[p],px=x+lx*Math.cos(yaw)+lz*Math.sin(yaw),pz=z-lx*Math.sin(yaw)+lz*Math.cos(yaw),height=4.5+(i+p*3)%3.2;
   ellipsoid(m,px,cy,pz,w*scaleX,height,d*scaleZ,p===1?upper:base,12,6,yaw);
  }
 }
}
function shell(m,room,pal,gaps){
 const R=room.radius,sea=C(pal.sea||'#4f9daa'),stone=C(pal.path||'#d3c19d'),shoreEnd=R+5.8,seaY=-1.84;
 // The near shore sits just beyond the original walkable bound; a raised sea reveals the archipelago at eye level.
 m.disc(0,seaY,0,158,96,sea);
 m.disc(0,-.025,0,R+.42,88,C(pal.ground));
 terrainBand(m,R+.4,R+1.72,-.025,-.31,0,.2,'#8eaa70','#899c69',R*.17);
 terrainBand(m,R+1.72,R+3.72,-.31,-1.19,.2,.65,'#9b8d69','#928565',R*.17);
 terrainBand(m,R+3.72,shoreEnd,-1.19,seaY+.015,.65,1.05,'#a39778','#718375',R*.17);
 m.ring(0,seaY+.018,0,shoreEnd-.42,shoreEnd+.22,96,C('#8bc0b7'));
 // Limestone routes are interrupted visually by low faceted meadow beds, never by raised barriers.
 m.ring(0,.012,1.2,5.18,5.38,72,stone);
 m.ring(0,.014,0,R-1.32,R-.82,96,stone);
 m.ring(0,.016,0,R-1.42,R-1.34,96,C('#b8b58d'));
 horizonIslands(m,pal);
}

function tree(m,x,z,s=1,pal={}){
 const bark=C('#795c43'),leaf=C(pal.canopy||'#527d53'),light=C(pal.canopyLight||'#719366');
 m.cyl(x,.48*s,z,.13*s,1.05*s,7,bark);m.cyl(x,1.05*s,z,.09*s,.85*s,6,bark,{r2:.05*s});
 // Clustered low-poly crowns read as rounded broadleaf canopies from the arrival view.
 ellipsoid(m,x,2.22*s,z,.93*s,1.07*s,.91*s,leaf,8,5);
 ellipsoid(m,x-.56*s,2.08*s,z-.13*s,.72*s,.81*s,.68*s,light,8,5);
 ellipsoid(m,x+.5*s,2.18*s,z+.2*s,.75*s,.84*s,.68*s,leaf,8,5);
 ellipsoid(m,x-.08*s,2.74*s,z+.49*s,.69*s,.79*s,.67*s,light,8,5);
 ellipsoid(m,x+.15*s,2.67*s,z-.48*s,.7*s,.76*s,.65*s,leaf,8,5);
}
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
  case 'tree':tree(m,x,z,.9,pal);return 3;
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
   for(const [lx,lz] of [[1.2,-.6],[1.4,-.2],[.9,-.5]])tree(m,P(lx,lz)[0],P(lx,lz)[1],.22,pal);return 2.2;}
  case 'shield':{const s=new Mesh();const pts=[[-.6,1.6],[.6,1.6],[.6,.8],[0,.2],[-.6,.8]];for(let i=1;i<4;i++)s.tri([pts[0][0],pts[0][1],0],[pts[i][0],pts[i][1],0],[pts[i+1][0],pts[i+1][1],0],tr);part('shield',s,0,.4,0);['g0','g1','g2'].forEach((g,i)=>part(g,new Mesh().octa(0,0,0,.11,C('#38b98a')),-.3+i*.3,1.3,.08,{em:[0,0,0]}));return 2.4;}
  case 'steps':for(let i=0;i<4;i++)part('step'+i,new Mesh().box(0,0,0,.46,.25+i*.28,.6,C(['#cfe0c4','#a9cfa0','#7fb586','#4f9a7a'][i])),-.75+i*.5,.28,0,{em:[0,0,0]});return 2;
  case 'pillar':m.cyl(x,.28,z,.45,3.2,12,C('#e9e3d3'));m.cyl(x,3.45,z,.6,.25,12,C('#d8cfbb'));{const [px,pz]=P(0,.48);m.box(px,1.4,pz,.7,.5,.05,C(pal.accent),{ry});}part('stance',new Mesh().sphere(0,0,0,.18,C('#ffffff'),10,6),0,3.95,0,{em:[0,0,0],stance:true});return 4.2;
  case 'lectern':m.box(x,.28,z,.6,1,.5,C('#8a5a3a'),{ry});m.box(x,1.28,z,.75,.08,.6,C('#a8714d'),{ry});return 2;
  case 'plinth':m.box(x,.28,z,.8,.9,.8,stone,{ry});m.box(x,1.18,z,.7,.1,.5,C('#fbf8ef'),{ry});m.box(x,1.28,z,.02,.04,.5,tr,{ry});return 1.9;
  default:m.box(x,.28,z,.8,1,.8,tr,{ry});return 1.8;
 }
}

function grassBed(m,x,z,rx,rz,seed,col){
 const n=9,points=[];
 for(let i=0;i<n;i++){const a=i/n*Math.PI*2,r=.78+.18*Math.sin(i*2.17+seed);points.push([x+Math.cos(a)*rx*r,.025+.035*(.5+.5*Math.sin(i*1.7+seed)),z+Math.sin(a)*rz*r]);}
 const center=[x,.035,z];
 for(let i=0;i<n;i++){const a=points[i],b=points[(i+1)%n],t=.94+.12*(.5+.5*Math.sin(i*2.4+seed));m.tri(center,a,b,shade(col,t));}
}
function wildflowerPatch(m,x,z,scale,seed,pal={}){
 const blooms=pal.flowers||['#e5c565','#e88765','#a79bc9','#f1e9d0','#d58bb0'],leaf=C(pal.shrub||'#7f9f69');
 ellipsoid(m,x,.16*scale,z,.48*scale,.19*scale,.4*scale,leaf,7,4);
 for(let i=0;i<9;i++){
  const a=i*2.399963+seed*.37,r=(i%4)*.22*scale,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r,h=(.24+(i%3)*.075)*scale;
  m.cyl(px,h*.42,pz,.018*scale,h*.84,4,C('#527b48'),{r2:.008*scale});
  m.octa(px,h+.035*scale,pz,.065*scale,C(blooms[(i+seed)%blooms.length]));
 }
}
function shrubPatch(m,x,z,scale,pal,seed){
 const leaf=C(pal.shrub||'#7f9f69'),light=C(pal.canopyLight||'#719366');
 ellipsoid(m,x,.31*scale,z,.54*scale,.36*scale,.46*scale,leaf,8,5);
 ellipsoid(m,x-.35*scale,.29*scale,z+.12*scale,.39*scale,.3*scale,.35*scale,light,8,5);
 ellipsoid(m,x+.33*scale,.34*scale,z-.15*scale,.4*scale,.33*scale,.36*scale,leaf,8,5);
 if(seed%2===0)wildflowerPatch(m,x+.04*scale,z+.02*scale,.8*scale,seed,pal);
}

// Topic-specific symbols stay beside the exhibits; the shared setting is an open garden island.
function decor(m,room,pal,dyn,gaps,layoutTargets=[]){
 const R=room.radius;
 const near=(a,b)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));
 const clear=(x,z,r=2.5)=>!layoutTargets.some(t=>['exhibit','reading','value','portal'].includes(t.kind)&&Math.hypot(t.x-x,t.z-z)<r);
 // Broadleaf trees form an airy grove at the outer rim; exit lanes stay open to each bridge.
 for(let i=0;i<24;i+=2){const a=(i+.35)/24*Math.PI*2;if(gaps.some(g=>near(a,g)<.2))continue;
  const [x,z]=polar(R-.42+(i%4)*.08,a);if(!clear(x,z,2.9))continue;
  tree(m,x,z,1.05+(i%3)*.12,pal);
 }
 // Low shrubs and flowers trace the shore in small, readable clusters without blocking the walking ring.
 for(let i=0;i<24;i++){const a=(i+.42)/24*Math.PI*2;if(gaps.some(g=>near(a,g)<.27))continue;
  const [x,z]=polar(R+.15+(i%3)*.11,a);if(!clear(x,z,2.1))continue;
  shrubPatch(m,x,z,.95+(i%4)*.08,pal,i);
 }
 // Muted, triangulated grass beds break up the broad lawn; their low relief stays below every pickup.
 const bedR=Math.min(R-3.2,Math.max(5.8,R*.48));
 for(let i=0;i<16;i++){const a=(i+.19*Math.sin(i*1.7))/16*Math.PI*2,[x,z]=polar(bedR,a);if(!clear(x,z,2.7))continue;
  grassBed(m,x,z,1.4+(i%3)*.25,.78+(i%2)*.16,i,C(pal.ground));
 }
 // The hub's many gateways thin the perimeter grove. A small inner-facing copse keeps the arrival view lush.
 if(room.theme==='hub'){
  const wellClear=(x,z)=>layoutTargets.every(t=>!['exhibit','reading','value','portal'].includes(t.kind)||Math.hypot(t.x-x,t.z-z)>=3.2);
  for(const [a,r] of [[-.44,R-4.7],[.44,R-4.7]]){const [x,z]=polar(r,a);if(wellClear(x,z))tree(m,x,z,1.12,pal);}
  for(const [a,r] of [[-.34,R-5.4],[.34,R-5.4]]){const [x,z]=polar(r,a);if(wellClear(x,z))shrubPatch(m,x,z,1.05,pal,18);}
 }
}

// Soft daylight clouds drift above every open island.
function cloudMesh(seed){const g=new Mesh(),puffs=4+seed%3;for(let i=0;i<puffs;i++){const k=i/(puffs-1)-.5;g.sphere(k*6.5,Math.cos(k*2.6)*1.2,((i*7+seed)%5-2)*.5,2.2+Math.cos(k*3)*1.1,[1,1,1],12,7);}
 for(let i=0;i<g.c.length;i++)g.c[i]=.62+.38*g.c[i]+(i%3===2?.02:0);return g;}
function clouds(dyn){const shapes=[0,1,2].map(cloudMesh);
 for(let i=0;i<11;i++){const a=i/11*Math.PI*2+(i%3)*.17,r=46+(i*13)%20;dyn.push({name:'cloud',mesh:shapes[i%3],x:0,y:0,z:0,ry:0,unlit:true,cloud:{a,r,y:15+(i*7)%11,s:.8+(i%4)*.18}});}}

// Crossings are visual wayfinding only; the room's existing go action remains authoritative.
let crossingMeshCache=null;
function crossingMesh(){
 if(crossingMeshCache)return crossingMeshCache;
 const g=new Mesh(),stone=C('#cbb995'),light=C('#dfcfad'),wood=C('#805f3f');
 for(let i=0;i<8;i++){const z=-.48-i*1.05;g.box(0,.015,z,1.72,.15,.98,i%2?stone:light,{top:shade(i%2?stone:light,1.1)});}
 for(const side of [-1,1]){
  g.box(side*.99,.2,-4.15,.12,.27,8.15,wood);
  for(let i=0;i<5;i++)g.box(side*.99,.13,-.45-i*1.8,.13,.48,.14,wood);
 }
 g.box(0,-.015,-8.45,2.45,.18,1.1,stone);
 crossingMeshCache=g;return g;
}
function crossingMarker(accent){
 const stone=C('#b9a77f'),wood=C('#805f3f'),cap=C(accent);
 const g=new Mesh();
 for(const side of [-1,1]){g.box(side*1.14,0,.18,.3,.82,.3,stone);g.box(side*1.14,.82,.18,.4,.12,.4,cap);}
 g.box(0,.05,.18,2.5,.12,.5,wood);
 return g;
}
function portalParts(dyn,t,accent){
 dyn.push({name:'frame',mesh:crossingMarker(accent),x:t.x,y:0,z:t.z,ry:t.ry,portal:t.id});
 dyn.push({name:'crossing',mesh:crossingMesh(),x:t.x,y:0,z:t.z,ry:t.ry,portal:t.id,bridge:true});
}

// Build a room into GPU buffers once; returns targets, dynamic items and an update function.
export function buildRoom(engine,room,exhibits,vals,order,themeOf,art=[]){
 const pal=palettes[room.theme],m=new Mesh(),sk=new Mesh(),dyn=[];
 const L=layoutRoom(room,exhibits,vals,order);
 const gaps=L.targets.filter(t=>t.kind==='portal').map(t=>Math.atan2(t.x,-t.z));
 sky(sk,pal);
 shell(m,room,pal,gaps);decor(m,room,pal,dyn,gaps,L.targets);if(pal.clouds)clouds(dyn);
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
   const v=vals.find(x=>x.id===t.id),col=C(valueColor[v.kind]||pal.accent);
   m.cyl(t.x,0,t.z,.3,.12,10,C('#e8e4da'));
   dyn.push({name:'crystal',mesh:new Mesh().octa(0,0,0,.32,col),x:t.x,y:.9,z:t.z,ry:0,value:t.id,em:[0,0,0]});
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
  if(sl.stand){
   m.box(x,.08,z,.62,.16,.58,C('#b9a77f'),{ry});
   for(const s2 of [-1,1]){const px=x+Math.cos(ry)*s2*(w/2-.1)-fx*.06,pz=z-Math.sin(ry)*s2*(w/2-.1)-fz*.06;
    m.box(px,0,pz,.14,sl.y,.14,C('#80603f'),{ry});m.box(px,sl.y,pz,.2,.12,.2,C('#d2a25d'),{ry});
   }
  }
  m.box(x-fx*.04,sl.y-h/2-.07,z-fz*.04,w+.16,h+.16,.08,C('#73553b'),{ry});
  const pic={name:'art',art:a.id,x:x+fx*.005,y:sl.y,z:z+fz*.005,ry,w,h,picture:true};pics.push(pic);
  const d=sl.view||Math.max(3,h*1.9,w*1.15),vx=x+fx*d,vz=z+fz*d,lim=room.radius-1.1,vr=Math.hypot(vx,vz),k=vr>lim?lim/vr:1;
  targets.push({kind:'art',id:a.id,pos:[x,sl.y+h/2+.32,z],hit:[x,sl.y,z],r:Math.max(w,h)*.55,view:{x:vx*k,z:vz*k,yaw:lookYaw(vx*k,vz*k,x,z),pitch:Math.atan2(sl.y-1.65,Math.hypot(x-vx*k,z-vz*k))}});
 }
 for(const p of pics)p.t=trs(p.x,p.y,p.z,p.ry,0,0,p.w,p.h,1);
 const statics=[{handle:engine.upload(m)}];if(sk.count)statics.unshift({handle:engine.upload(sk),unlit:true});
 const cache=new Map();
 for(const d of dyn){const key=d.mesh;if(!cache.has(key))cache.set(key,engine.upload(d.mesh));d.handle=cache.get(key);d.t=trs(d.x,d.y,d.z,d.ry);}
 const items=[...statics,...dyn,...pics];
 const env={fog:C(pal.fog),sky:C(pal.sky),ground:C(pal.ground),near:82,far:196};
 const obstacles=targets.filter(t=>t.kind==='exhibit'||t.kind==='reading').map(t=>({x:t.pos[0],z:t.pos[2],r:t.kind==='reading'?1.1:t.id==='tally'?1.4:(exhibits.find(e=>e.id===t.id)?.prop==='table'?2.4:.85)}));
 return {room,items,dyn,targets,pics,spawn:L.spawn,bounds:L.bounds,env,obstacles,pal};
}

// Per-frame animation and state reflection for dynamic parts.
export function animateRoom(built,dt,time,s,motion){
 const mt=motion?time:0;
 for(const d of built.dyn){let x=d.x,y=d.y,z=d.z,ry=d.ry,rz=0;
  if(d.glow)d.alpha=s.hover===d.owner?.9:s.seen.has(d.owner)?.18:.5+(motion?Math.sin(time*2.4)*.15:0);
  if(d.swirl)rz=mt*1.2;
  if(d.arms)rz=-mt*1.6;
  if(d.cloud){const c=d.cloud,a=c.a+mt*.006;x=Math.sin(a)*c.r;z=-Math.cos(a)*c.r;y=c.y+(motion?Math.sin(time*.15+c.a*3)*.6:0);ry=-a+Math.PI/2;}
  if(d.bob!==undefined){y=motion?Math.abs(Math.sin(time*2+d.bob))*.06:0;}
  if(d.lamp)d.em=[.2,.16,.05];
  if(d.vertical)rz=0;
  if(d.globe)ry=mt*.06;
  if(d.value){const picked=!!s.picks?.[d.value];y=d.y+(picked?.28:0)+(motion?Math.sin(time*1.6+d.x)*.06:0);ry=mt*(picked?1.3:.5);d.em=picked?[.16,.23,.12]:s.hover===d.value?[.12,.12,.12]:[0,0,0];}
  d.t=trs(x,y,z,ry,d.vertical?Math.PI/2:0,rz,d.cloud?d.cloud.s:1,d.cloud?d.cloud.s*.55:1,d.cloud?d.cloud.s:1);
 }
}
