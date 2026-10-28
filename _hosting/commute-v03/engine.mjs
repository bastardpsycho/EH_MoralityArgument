// Minimal WebGL renderer for the rooms edition: flat-shaded vertex-coloured meshes, textured pictures, fog,
// a first-person camera, screen rays and projection. No dependencies, no network.
const V=(x=0,y=0,z=0)=>[x,y,z];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const norm=a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return [a[0]/l,a[1]/l,a[2]/l];};
export const hex=h=>{const n=parseInt(h.slice(1),16);return [(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];};
export const shade=(c,k)=>c.map(v=>Math.min(1,Math.max(0,v*k)));
export const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);

// Column-major 4x4 matrices.
export function trs(x=0,y=0,z=0,ry=0,rx=0,rz=0,sx=1,sy=sx,sz=sx){
 const cy=Math.cos(ry),sy_=Math.sin(ry),cx=Math.cos(rx),sx_=Math.sin(rx),cz=Math.cos(rz),sz_=Math.sin(rz);
 // R = Ry * Rx * Rz
 const r00=cy*cz+sy_*sx_*sz_,r01=-cy*sz_+sy_*sx_*cz,r02=sy_*cx;
 const r10=cx*sz_,r11=cx*cz,r12=-sx_;
 const r20=-sy_*cz+cy*sx_*sz_,r21=sy_*sz_+cy*sx_*cz,r22=cy*cx;
 const m=new Float32Array([r00*sx,r10*sx,r20*sx,0,r01*sy,r11*sy,r21*sy,0,r02*sz,r12*sz,r22*sz,0,x,y,z,1]);
 const n=new Float32Array([r00,r10,r20,r01,r11,r21,r02,r12,r22]);
 return {m,n};
}
function perspective(fovy,aspect,near,far){const f=1/Math.tan(fovy/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);}
export function basis(yaw,pitch){
 const f=[-Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch)];
 const r=[Math.cos(yaw),0,-Math.sin(yaw)];
 const u=cross(r,f);
 return {f,r,u};
}
function viewMatrix(p,yaw,pitch){const {f,r,u}=basis(yaw,pitch);return new Float32Array([r[0],u[0],-f[0],0,r[1],u[1],-f[1],0,r[2],u[2],-f[2],0,-dot(r,p),-dot(u,p),dot(f,p),1]);}
function mul4(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+r]*b[c*4+k];o[c*4+r]=s;}return o;}

// Geometry builder: every primitive takes a base position and an optional Y rotation about that base.
export class Mesh{
 constructor(){this.p=[];this.n=[];this.c=[];}
 get count(){return this.p.length/3;}
 tri(a,b,c,col){const n=norm(cross(sub(b,a),sub(c,a)));for(const v of [a,b,c]){this.p.push(v[0],v[1],v[2]);this.n.push(n[0],n[1],n[2]);this.c.push(col[0],col[1],col[2]);}return this;}
 quad(a,b,c,d,col){return this.tri(a,b,c,col).tri(a,c,d,col);}
 // Triangle with a colour per vertex, for gradients.
 triC(a,b,c,ca,cb,cc){const n=norm(cross(sub(b,a),sub(c,a)));[[a,ca],[b,cb],[c,cc]].forEach(([v,col])=>{this.p.push(v[0],v[1],v[2]);this.n.push(n[0],n[1],n[2]);this.c.push(col[0],col[1],col[2]);});return this;}
 place(x,y,z,ry){const c=Math.cos(ry),s=Math.sin(ry);return (lx,ly,lz)=>[x+lx*c+lz*s,y+ly,z-lx*s+lz*c];}
 box(x,y,z,w,h,d,col,{ry=0,top=null,bottom=false}={}){
  const P=this.place(x,y,z,ry),hw=w/2,hd=d/2,t=top||shade(col,1.08),sd=shade(col,.92);
  const v=[P(-hw,0,-hd),P(hw,0,-hd),P(hw,0,hd),P(-hw,0,hd),P(-hw,h,-hd),P(hw,h,-hd),P(hw,h,hd),P(-hw,h,hd)];
  this.quad(v[4],v[7],v[6],v[5],t);this.quad(v[3],v[2],v[6],v[7],col);this.quad(v[1],v[0],v[4],v[5],col);
  this.quad(v[0],v[3],v[7],v[4],sd);this.quad(v[2],v[1],v[5],v[6],sd);if(bottom)this.quad(v[0],v[1],v[2],v[3],shade(col,.7));return this;
 }
 cyl(x,y,z,r,h,seg,col,{r2=r,ry=0,cap=true,top=null}={}){
  const P=this.place(x,y,z,ry),t=top||shade(col,1.08);
  for(let i=0;i<seg;i++){const a0=i/seg*Math.PI*2,a1=(i+1)/seg*Math.PI*2;
   const b0=P(Math.cos(a0)*r,0,Math.sin(a0)*r),b1=P(Math.cos(a1)*r,0,Math.sin(a1)*r),t0=P(Math.cos(a0)*r2,h,Math.sin(a0)*r2),t1=P(Math.cos(a1)*r2,h,Math.sin(a1)*r2);
   const k=.86+.14*Math.cos(a0-.8);this.quad(b0,b1,t1,t0,shade(col,k));
   if(cap&&r2>0)this.tri(P(0,h,0),t1,t0,t);}
  return this;
 }
 disc(x,y,z,r,seg,col,ry=0){const P=this.place(x,y,z,ry);for(let i=0;i<seg;i++){const a0=i/seg*Math.PI*2,a1=(i+1)/seg*Math.PI*2;this.tri(P(0,0,0),P(Math.cos(a1)*r,0,Math.sin(a1)*r),P(Math.cos(a0)*r,0,Math.sin(a0)*r),col);}return this;}
 ring(x,y,z,r0,r1,seg,col){for(let i=0;i<seg;i++){const a0=i/seg*Math.PI*2,a1=(i+1)/seg*Math.PI*2,c0=Math.cos(a0),s0=Math.sin(a0),c1=Math.cos(a1),s1=Math.sin(a1);this.quad([x+c0*r0,y,z+s0*r0],[x+c0*r1,y,z+s0*r1],[x+c1*r1,y,z+s1*r1],[x+c1*r0,y,z+s1*r0],col);}return this;}
 sphere(x,y,z,r,col,seg=10,rings=6){for(let j=0;j<rings;j++){const p0=j/rings*Math.PI,p1=(j+1)/rings*Math.PI;for(let i=0;i<seg;i++){const a0=i/seg*Math.PI*2,a1=(i+1)/seg*Math.PI*2;const pt=(p,a)=>[x+Math.sin(p)*Math.cos(a)*r,y+Math.cos(p)*r,z+Math.sin(p)*Math.sin(a)*r];const k=.8+.2*Math.cos(p0);this.quad(pt(p0,a0),pt(p0,a1),pt(p1,a1),pt(p1,a0),shade(col,k));}}return this;}
 octa(x,y,z,r,col){const t=[x,y+r*1.4,z],b=[x,y-r*1.4,z],e=[[x+r,y,z],[x,y,z+r],[x-r,y,z],[x,y,z-r]];for(let i=0;i<4;i++){const a=e[i],c=e[(i+1)%4];this.tri(t,c,a,shade(col,1.1));this.tri(b,a,c,shade(col,.8));}return this;}
 roof(x,y,z,w,d,h,col,ry=0){const P=this.place(x,y,z,ry),hw=w/2,hd=d/2;const a=P(-hw,0,-hd),b=P(hw,0,-hd),c=P(hw,0,hd),e=P(-hw,0,hd),r0=P(-hw,h,0),r1=P(hw,h,0);this.quad(a,b,r1,r0,shade(col,.9));this.quad(c,e,r0,r1,col);this.tri(e,a,r0,shade(col,.8));this.tri(b,c,r1,shade(col,.8));return this;}
 // Flat panel standing upright, facing +z before rotation.
 panel(x,y,z,w,h,col,ry=0,t=.04){return this.box(x,y,z,w,h,t,col,{ry});}
}

const VS=`attribute vec3 aP;attribute vec3 aN;attribute vec3 aC;uniform mat4 uPV,uM;uniform mat3 uNM;varying vec3 vC,vN,vW;void main(){vec4 w=uM*vec4(aP,1.);vW=w.xyz;vN=uNM*aN;vC=aC;gl_Position=uPV*w;}`;
const FS=`precision mediump float;varying vec3 vC,vN,vW;uniform vec3 uL,uSky,uGround,uFog,uCam,uEm;uniform float uNear,uFar,uUnlit,uAlpha;
void main(){vec3 n=normalize(vN);vec3 v=normalize(uCam-vW);if(dot(n,v)<0.)n=-n;float d=max(dot(n,uL),0.);vec3 amb=mix(uGround,uSky,.5+.5*n.y);
float ao=mix(.84,1.,clamp(vW.y*.9+.15,0.,1.));vec3 c=mix(vC*(amb*.74+d*.4)*ao,vC,uUnlit)+uEm;float f=smoothstep(uNear,uFar,length(vW-uCam))*(1.-uUnlit);gl_FragColor=vec4(mix(c,uFog,f),uAlpha);}`;

// Pictures: one unit quad, textured, evenly lit and fogged like everything else.
const TVS=`attribute vec3 aP;attribute vec2 aT;uniform mat4 uPV,uM;varying vec2 vT;varying vec3 vW;void main(){vec4 w=uM*vec4(aP,1.);vW=w.xyz;vT=aT;gl_Position=uPV*w;}`;
const TFS=`precision mediump float;varying vec2 vT;varying vec3 vW;uniform sampler2D uTex;uniform vec3 uFog,uCam;uniform float uNear,uFar;
void main(){vec3 c=texture2D(uTex,vT).rgb*.97;float f=smoothstep(uNear,uFar,length(vW-uCam));gl_FragColor=vec4(mix(c,uFog,f),1.);}`;

export function createEngine(canvas){
 const gl=canvas.getContext('webgl',{antialias:true,alpha:false,powerPreference:'high-performance'})||canvas.getContext('experimental-webgl');
 if(!gl)throw new Error('WebGL unavailable');
 const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o;};
 const prog=gl.createProgram();gl.attachShader(prog,sh(gl.VERTEX_SHADER,VS));gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(prog);
 if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error('WebGL program failed');
 gl.useProgram(prog);
 const A={p:gl.getAttribLocation(prog,'aP'),n:gl.getAttribLocation(prog,'aN'),c:gl.getAttribLocation(prog,'aC')};
 const tprog=gl.createProgram();gl.attachShader(tprog,sh(gl.VERTEX_SHADER,TVS));gl.attachShader(tprog,sh(gl.FRAGMENT_SHADER,TFS));gl.linkProgram(tprog);
 if(!gl.getProgramParameter(tprog,gl.LINK_STATUS))throw new Error('WebGL picture program failed');
 const TA={p:gl.getAttribLocation(tprog,'aP'),t:gl.getAttribLocation(tprog,'aT')},TU={};for(const k of ['uPV','uM','uTex','uFog','uCam','uNear','uFar'])TU[k]=gl.getUniformLocation(tprog,k);
 const quad=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-.5,-.5,0,0,0, .5,-.5,0,1,0, .5,.5,0,1,1, -.5,-.5,0,0,0, .5,.5,0,1,1, -.5,.5,0,0,1]),gl.STATIC_DRAW);
 const aniso=gl.getExtension('EXT_texture_filter_anisotropic');
 const textures=new Set();
 gl.useProgram(prog);
 const U={};for(const k of ['uPV','uM','uNM','uL','uSky','uGround','uFog','uCam','uEm','uNear','uFar','uUnlit','uAlpha'])U[k]=gl.getUniformLocation(prog,k);
 const cam={x:0,y:1.65,z:6,yaw:0,pitch:-.05,fov:70*Math.PI/180};
 let env={fog:hex('#dfe9df'),sky:hex('#f6f3e6'),ground:hex('#9fb59a'),near:14,far:46,light:norm([.45,.8,.35])};
 let items=[],w=1,h=1,dpr=1,pv=null,raf=0,frameCb=null,last=0,lost=false;
 const buffers=new Set();
 function upload(mesh){
  const data=new Float32Array(mesh.count*9);
  for(let i=0;i<mesh.count;i++){data.set(mesh.p.slice(i*3,i*3+3),i*9);data.set(mesh.n.slice(i*3,i*3+3),i*9+3);data.set(mesh.c.slice(i*3,i*3+3),i*9+6);}
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);buffers.add(buf);
  return {buf,count:mesh.count};
 }
 function free(handle){if(handle&&buffers.has(handle.buf)){gl.deleteBuffer(handle.buf);buffers.delete(handle.buf);}}
 function resize(){dpr=Math.min(2,window.devicePixelRatio||1);const r=canvas.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);gl.viewport(0,0,canvas.width,canvas.height);}
 function matrices(){const p=perspective(cam.fov,w/h,.05,120);pv=mul4(p,viewMatrix([cam.x,cam.y,cam.z],cam.yaw,cam.pitch));return pv;}
 const I=trs();
 function draw(){
  matrices();
  gl.clearColor(env.fog[0],env.fog[1],env.fog[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);
  gl.uniformMatrix4fv(U.uPV,false,pv);gl.uniform3fv(U.uL,env.light);gl.uniform3fv(U.uSky,env.sky);gl.uniform3fv(U.uGround,env.ground);gl.uniform3fv(U.uFog,env.fog);
  gl.uniform3fv(U.uCam,[cam.x,cam.y,cam.z]);gl.uniform1f(U.uNear,env.near);gl.uniform1f(U.uFar,env.far);
  const pass=(transparent)=>{
   for(const it of items){
    if(it.hidden||!it.handle||Boolean(it.transparent)!==transparent)continue;
    const t=it.t||I;gl.uniformMatrix4fv(U.uM,false,t.m);gl.uniformMatrix3fv(U.uNM,false,t.n);
    gl.uniform3fv(U.uEm,it.em||[0,0,0]);gl.uniform1f(U.uUnlit,it.unlit?1:0);gl.uniform1f(U.uAlpha,it.alpha??1);
    gl.bindBuffer(gl.ARRAY_BUFFER,it.handle.buf);
    gl.enableVertexAttribArray(A.p);gl.vertexAttribPointer(A.p,3,gl.FLOAT,false,36,0);
    gl.enableVertexAttribArray(A.n);gl.vertexAttribPointer(A.n,3,gl.FLOAT,false,36,12);
    gl.enableVertexAttribArray(A.c);gl.vertexAttribPointer(A.c,3,gl.FLOAT,false,36,24);
    gl.drawArrays(gl.TRIANGLES,0,it.handle.count);
   }
  };
  pass(false);
  const pics=items.filter(it=>it.texture&&!it.hidden);
  if(pics.length){
   gl.useProgram(tprog);gl.disableVertexAttribArray(A.n);gl.disableVertexAttribArray(A.c);
   gl.uniformMatrix4fv(TU.uPV,false,pv);gl.uniform3fv(TU.uFog,env.fog);gl.uniform3fv(TU.uCam,[cam.x,cam.y,cam.z]);gl.uniform1f(TU.uNear,env.near);gl.uniform1f(TU.uFar,env.far);gl.uniform1i(TU.uTex,0);
   gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.enableVertexAttribArray(TA.p);gl.vertexAttribPointer(TA.p,3,gl.FLOAT,false,20,0);gl.enableVertexAttribArray(TA.t);gl.vertexAttribPointer(TA.t,2,gl.FLOAT,false,20,12);
   gl.activeTexture(gl.TEXTURE0);
   for(const it of pics){gl.bindTexture(gl.TEXTURE_2D,it.texture);gl.uniformMatrix4fv(TU.uM,false,it.t.m);gl.drawArrays(gl.TRIANGLES,0,6);}
   gl.disableVertexAttribArray(TA.p);gl.disableVertexAttribArray(TA.t);gl.useProgram(prog);
  }
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.depthMask(false);pass(true);gl.depthMask(true);gl.disable(gl.BLEND);
 }
 function loop(now){raf=requestAnimationFrame(loop);if(lost)return;const dt=Math.min(.05,last?(now-last)/1000:0);last=now;frameCb?.(dt,now/1000);draw();}
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;});
 resize();
 return {
  gl,cam,upload,free,resize,
  setEnv(e){env={...env,...e,light:e.light?norm(e.light):env.light};},
  setItems(list){items=list;},
  start(cb){frameCb=cb;if(!raf){last=0;raf=requestAnimationFrame(loop);}},
  stop(){cancelAnimationFrame(raf);raf=0;},
  renderOnce(){draw();},
  // A mipmapped texture from a loaded same-origin image, redrawn to power-of-two size so it stays smooth at a distance.
  texture(img){
   const pot=n=>2**Math.max(8,Math.min(10,Math.round(Math.log2(n)))),c=document.createElement('canvas');c.width=pot(img.naturalWidth);c.height=pot(img.naturalHeight);
   c.getContext('2d').drawImage(img,0,0,c.width,c.height);
   const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
   gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
   if(aniso)gl.texParameterf(gl.TEXTURE_2D,aniso.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(8,gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
   textures.add(t);return t;
  },
  get lost(){return lost;},
  // World-space ray through a client point.
  ray(clientX,clientY){const r=canvas.getBoundingClientRect();const nx=((clientX-r.left)/r.width)*2-1,ny=1-((clientY-r.top)/r.height)*2;const {f,r:rt,u}=basis(cam.yaw,cam.pitch);const t=Math.tan(cam.fov/2),a=w/h;return {o:[cam.x,cam.y,cam.z],d:norm([f[0]+rt[0]*nx*t*a+u[0]*ny*t,f[1]+rt[1]*nx*t*a+u[1]*ny*t,f[2]+rt[2]*nx*t*a+u[2]*ny*t])};},
  project(p){if(!pv)matrices();const x=pv[0]*p[0]+pv[4]*p[1]+pv[8]*p[2]+pv[12],y=pv[1]*p[0]+pv[5]*p[1]+pv[9]*p[2]+pv[13],ww=pv[3]*p[0]+pv[7]*p[1]+pv[11]*p[2]+pv[15];if(ww<=.05)return {visible:false};return {visible:true,x:(x/ww*.5+.5)*w,y:(1-(y/ww*.5+.5))*h,dist:Math.hypot(p[0]-cam.x,p[1]-cam.y,p[2]-cam.z)};},
  destroy(){this.stop();for(const b of buffers)gl.deleteBuffer(b);buffers.clear();for(const t of textures)gl.deleteTexture(t);textures.clear();}
 };
}
// Ray–sphere distance or Infinity.
export function hitSphere(ray,c,r){const oc=sub(ray.o,c),b=dot(oc,ray.d),q=dot(oc,oc)-r*r,disc=b*b-q;if(disc<0)return Infinity;const t=-b-Math.sqrt(disc);return t>0?t:(-b+Math.sqrt(disc)>0?0:Infinity);}
export function hitFloor(ray){if(ray.d[1]>=-1e-4)return null;const t=-ray.o[1]/ray.d[1];return {t,x:ray.o[0]+ray.d[0]*t,z:ray.o[2]+ray.d[2]*t};}
export {V};
