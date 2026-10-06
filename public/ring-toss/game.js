import * as THREE from './three.module.js';

// A shallow tank: Three.js renders the toy, while a fixed-step simulation
// approximates drag, sinking, jets and moving water without a fluid solver.
const $ = id => document.getElementById(id);
const tank = $('tank');
const overlay = $('overlay');
const TOTAL = 8, FIXED_DT = 1 / 120;
const LEFT = -1.05, RIGHT = 1.05, TIP = 3.45;
const JET_POSITIONS = [-2.25,2.25];
const colors = [0xff7854, 0xffd642, 0x70ebba, 0xff94bb, 0xffd642, 0x58d8ff, 0xbba2ff, 0xff7854];
const state = {playing:true, won:false, count:0, time:0, tiltX:0, tiltY:-1, tiltZ:0, targetX:0, targetY:-1, targetZ:0, latest:null, sensor:false, lastShake:-10, pulse:[0,0]};
// A conserved air volume rises opposite gravity in all three tank dimensions.
// Curvature produces a rounded pocket against the front/back glass when flat.
const air={x:0,y:1,z:0,centerX:0,centerY:4.16,centerZ:-.125,curvature:0,level:8,halfWidth:3.05,top:8.32,lastX:NaN,lastY:NaN,lastZ:NaN};
const AIR_BACK=-.7,AIR_FRONT=.45,AIR_GRID_X=12,AIR_GRID_Y=24,AIR_GRID_Z=8;
const airSamples=new Float32Array(AIR_GRID_X*AIR_GRID_Y*AIR_GRID_Z*3);
const airProjections=new Float32Array(AIR_GRID_X*AIR_GRID_Y*AIR_GRID_Z);
let airSampleWidth=NaN,airSampleTop=NaN;
function airSigned(x,y,z){
  const dx=x-air.centerX,dy=y-air.centerY,dz=z-air.centerZ;
  const along=dx*air.x+dy*air.y+dz*air.z;
  return x*air.x+y*air.y+z*air.z-air.level-air.curvature*Math.max(0,dx*dx+dy*dy+dz*dz-along*along);
}
function updateAirPocket(){
  const length=Math.hypot(state.tiltX,state.tiltY,state.tiltZ);
  // Near zero measured gravity has no reliable direction; retain the last one.
  const x=length>.08?-state.tiltX/length:air.x;
  const y=length>.08?-state.tiltY/length:air.y;
  const z=length>.08?-state.tiltZ/length:air.z;
  const resized=airSampleWidth!==air.halfWidth||airSampleTop!==air.top;
  if(!resized&&Math.abs(x-air.lastX)<.005&&Math.abs(y-air.lastY)<.005&&Math.abs(z-air.lastZ)<.005)return;
  air.x=x;air.y=y;air.z=z;air.lastX=x;air.lastY=y;air.lastZ=z;
  const depthAxis=Math.max(.35,Math.abs(z));
  air.centerX=Math.max(-air.halfWidth*.65,Math.min(air.halfWidth*.65,x/depthAxis*.7));
  air.centerY=air.top*.5+Math.max(-air.top*.35,Math.min(air.top*.35,y/depthAxis*.7));
  air.centerZ=(AIR_BACK+AIR_FRONT)*.5;
  air.curvature=.18*Math.pow(Math.abs(z),4);
  if(resized){
    let k=0;
    for(let ix=0;ix<AIR_GRID_X;ix++)for(let iy=0;iy<AIR_GRID_Y;iy++)for(let iz=0;iz<AIR_GRID_Z;iz++){
      airSamples[k++]=-air.halfWidth+(ix+.5)*2*air.halfWidth/AIR_GRID_X;
      airSamples[k++]=(iy+.5)*air.top/AIR_GRID_Y;
      airSamples[k++]=AIR_BACK+(iz+.5)*(AIR_FRONT-AIR_BACK)/AIR_GRID_Z;
    }
    airSampleWidth=air.halfWidth;airSampleTop=air.top;
  }
  let low=Infinity,high=-Infinity;
  for(let i=0;i<airProjections.length;i++){
    const k=i*3,px=airSamples[k],py=airSamples[k+1],pz=airSamples[k+2];
    const dx=px-air.centerX,dy=py-air.centerY,dz=pz-air.centerZ,along=dx*x+dy*y+dz*z;
    const projected=px*x+py*y+pz*z-air.curvature*Math.max(0,dx*dx+dy*dy+dz*dz-along*along);
    airProjections[i]=projected;low=Math.min(low,projected);high=Math.max(high,projected);
  }
  // A smoothed occupancy spans half a cell's projected diagonal to avoid
  // discontinuous volume estimates from the small grid used on phones.
  const softness=.5*(Math.abs(x)*2*air.halfWidth/AIR_GRID_X+Math.abs(y)*air.top/AIR_GRID_Y+Math.abs(z)*(AIR_FRONT-AIR_BACK)/AIR_GRID_Z)+.01;
  low-=softness;high+=softness;
  const targetFraction=.32/air.top;
  for(let iteration=0;iteration<14;iteration++){
    const mid=(low+high)*.5;let occupied=0;
    for(let i=0;i<airProjections.length;i++)occupied+=Math.max(0,Math.min(1,.5+(airProjections[i]-mid)/(2*softness)));
    if(occupied/airProjections.length>targetFraction)low=mid;else high=mid;
  }
  air.level=(low+high)*.5;
}
function jetImmersion(side){
  // Use the same 3D field as the visible air, including the inlet's depth.
  const submergedDepth=-airSigned(JET_POSITIONS[side],.18,.30);
  return Math.max(0,Math.min(1,(submergedDepth+.075)/.15));
}
let renderer;
try {
  renderer = new THREE.WebGLRenderer({antialias:true, alpha:false, powerPreference:'low-power'});
} catch (error) {
  $('welcome-title').textContent = 'A small ripple.';
  $('welcome-copy').textContent = 'Your browser could not start the 3D tank. Try opening this page in Safari or Chrome.';
  $('start').hidden = true;
  $('note').hidden = true;
  throw error;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0xa6d5cd);
renderer.outputColorSpace = THREE.SRGBColorSpace;
tank.prepend(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-3.15,3.15,4,-4,.1,40);
// A slightly elevated view keeps horizontal ring openings visible.
camera.position.set(0,10,14);
camera.lookAt(0,3.9,0);
scene.add(new THREE.HemisphereLight(0xeaffff,0x136170,2.6));
const light = new THREE.DirectionalLight(0xfff2d3,3);
light.position.set(-4,8,6); scene.add(light);
const back = new THREE.Mesh(new THREE.PlaneGeometry(6.6,9),new THREE.ShaderMaterial({
  uniforms:{time:{value:0},jets:{value:new THREE.Vector2()},airDirection:{value:new THREE.Vector3(0,1,0)},airCenter:{value:new THREE.Vector3()},airCurvature:{value:0},airLevel:{value:8},surface:{value:8},tankBounds:{value:new THREE.Vector2(3.05,8.32)}},
  vertexShader:`varying vec3 tankPosition;
    void main(){vec4 world=modelMatrix*vec4(position,1.0);tankPosition=world.xyz;
      gl_Position=projectionMatrix*viewMatrix*world;}`,
  fragmentShader:`varying vec3 tankPosition;uniform float time;uniform vec2 jets;
    uniform vec3 airDirection;uniform vec3 airCenter;uniform float airCurvature;
    uniform float airLevel;uniform float surface;
    void main(){
      vec2 p=tankPosition.xy;
      float left=exp(-pow((p.x+2.25)/.8,2.0))*jets.x;
      float right=exp(-pow((p.x-2.25)/.8,2.0))*jets.y;
      float disturbance=min(left+right,1.0);
      vec3 delta=tankPosition-airCenter;
      float axial=dot(delta,airDirection);
      float distanceToAir=dot(tankPosition,airDirection)-airLevel-airCurvature*max(0.0,dot(delta,delta)-axial*axial);
      distanceToAir+=sin(dot(p,vec2(airDirection.y,-airDirection.x))*3.0-time*7.0)*disturbance*.035;
      float submerged=1.0-smoothstep(-.025,.025,distanceToAir);
      vec3 water=mix(vec3(.23,.56,.57),vec3(.67,.85,.79),clamp(p.y/surface,0.0,1.0));
      // Fixed light refraction at rest. Motion is localized to pumped water.
      float lightPattern=sin(p.x*5.0+sin(p.y*2.6))*cos(p.y*5.2+cos(p.x*2.4));
      water+=pow(max(0.0,lightPattern),12.0)*vec3(.035,.055,.04);
      water+=sin(p.y*10.0-time*12.0)*disturbance*.018;
      vec3 col=mix(vec3(.83,.89,.80),water,submerged);
      float meniscus=exp(-pow(distanceToAir/.028,2.0));
      col=mix(col,vec3(.91,.98,.87),meniscus*.7);
      gl_FragColor=vec4(col,1.0);
    }`
}));
back.position.set(0,3.8,-.7); scene.add(back);
// A transparent lens on the front glass reveals air collecting toward the
// viewer. It shares the exact region used by the rear water and pump inlets.
const frontAir=new THREE.Mesh(new THREE.PlaneGeometry(6.6,9),new THREE.ShaderMaterial({
  uniforms:back.material.uniforms,
  transparent:true,depthWrite:false,
  vertexShader:`varying vec3 tankPosition;
    void main(){vec4 world=modelMatrix*vec4(position,1.0);tankPosition=world.xyz;
      gl_Position=projectionMatrix*viewMatrix*world;}`,
  fragmentShader:`varying vec3 tankPosition;uniform vec3 airDirection;
    uniform vec3 airCenter;uniform float airCurvature;uniform float airLevel;
    uniform vec2 tankBounds;
    void main(){
      if(abs(tankPosition.x)>tankBounds.x||tankPosition.y<0.0||tankPosition.y>tankBounds.y)discard;
      vec3 delta=tankPosition-airCenter;
      float axial=dot(delta,airDirection);
      float d=dot(tankPosition,airDirection)-airLevel-airCurvature*max(0.0,dot(delta,delta)-axial*axial);
      float front=smoothstep(.08,.45,airDirection.z);
      float inside=smoothstep(-.025,.025,d);
      float edge=exp(-pow(d/.026,2.0));
      float highlight=clamp(.45+delta.y*.2-delta.x*.2,0.0,1.0);
      vec3 rim=mix(vec3(.22,.48,.42),vec3(.97,1.0,.90),highlight);
      vec3 col=mix(vec3(.92,.97,.84),rim,edge);
      gl_FragColor=vec4(col,front*(inside*.10+edge*.68));
    }`
}));
frontAir.position.set(0,3.8,.45);frontAir.renderOrder=5;scene.add(frontAir);
function mesh(geometry,color,x,y,z=0){const m=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color,roughness:.26,metalness:.05}));m.position.set(x,y,z);scene.add(m);return m;}
const floor=mesh(new THREE.BoxGeometry(6.4,.18,1.0),0x88d5cf,0,.03,0);
const posts = [LEFT,RIGHT].map(x=>{
  mesh(new THREE.CylinderGeometry(.065,.095,TIP-.22,16),0xffdd61,x,(TIP+.22)/2,0);
  mesh(new THREE.SphereGeometry(.069,16,12),0xffed99,x,TIP,0);
  mesh(new THREE.CylinderGeometry(.37,.47,.22,28),0x2baaaa,x,.19,0);
  return {x};
});
// Pump outlets sit at the outer ends, separate from the ring-catching poles.
for(const x of JET_POSITIONS){mesh(new THREE.CylinderGeometry(.13,.18,.15,20),0x154e59,x,.18,.30);}
// Rings lie mostly flat, with a little tumbling. Their holes stay visually
// open; a ring can thread a pole only while descending across its tip.
const ringGeo=new THREE.TorusGeometry(.265,.067,10,32);
const rings=colors.map((color,i)=>({mesh:mesh(ringGeo,color,0,0),x:0,y:0,z:0,vx:0,vy:0,vz:0,angle:0,spin:0,pole:null,index:i}));
const bubbleCount=100;
const bubblePositions=new Float32Array(bubbleCount*3);
const bubbleData=Array.from({length:bubbleCount},()=>({x:0,y:-2,z:0,speed:0,life:0}));
const bubbleGeometry=new THREE.BufferGeometry();
bubbleGeometry.setAttribute('position',new THREE.BufferAttribute(bubblePositions,3));
// Round hollow bubbles instead of square pixels, emitted only by squeezes/shakes.
const bubbleCanvas=document.createElement('canvas');bubbleCanvas.width=64;bubbleCanvas.height=64;
const bubbleContext=bubbleCanvas.getContext('2d');
const bubbleGlow=bubbleContext.createRadialGradient(32,32,17,32,32,29);
bubbleGlow.addColorStop(0,'rgba(230,255,250,0)');bubbleGlow.addColorStop(.65,'rgba(220,255,245,.15)');bubbleGlow.addColorStop(.85,'rgba(240,255,252,.8)');bubbleGlow.addColorStop(1,'rgba(230,255,250,0)');
bubbleContext.fillStyle=bubbleGlow;bubbleContext.fillRect(0,0,64,64);
bubbleContext.fillStyle='rgba(255,255,255,.85)';bubbleContext.beginPath();bubbleContext.arc(23,21,3,0,Math.PI*2);bubbleContext.fill();
const bubbles=new THREE.Points(bubbleGeometry,new THREE.PointsMaterial({color:0xffffff,map:new THREE.CanvasTexture(bubbleCanvas),size:.09,transparent:true,opacity:.7,depthWrite:false}));scene.add(bubbles);
let bubbleCursor=0;
function emit(x,n){for(let i=0;i<n;i++){const b=bubbleData[bubbleCursor++%bubbleCount];Object.assign(b,{x:x+(Math.random()-.5)*.25,y:.35,z:.25,speed:1.5+Math.random()*2,life:2+Math.random()});}}
function updateScore(){const count=rings.filter(r=>r.pole!==null).length;if(count!==state.count){state.count=count;$('count').textContent=count;}state.won=count===TOTAL;}
function reset(){state.count=0;state.won=false;state.time=0;state.pulse=[0,0];$('count').textContent='0';rings.forEach((r,i)=>{r.x=-2.15+(i%4)*1.4;r.y=.5+Math.floor(i/4)*.38;r.z=(Math.random()-.5)*.22;r.vx=(Math.random()-.5)*.4;r.vy=0;r.vz=0;r.angle=(Math.random()-.5)*.7;r.spin=(Math.random()-.5);r.pole=null;});}
function pump(side){if(!state.playing)return;updateAirPocket();const immersion=jetImmersion(side);state.pulse[side]=Math.min(2.8,state.pulse[side]+1.25*immersion);if(immersion>.05)emit(JET_POSITIONS[side],Math.ceil(14*immersion));}
// Track contacts only for button visuals; a held contact never pumps again.
const held=new Map();

function pressPump(side){
  // The squeeze pumps immediately; permission is requested by the click event.
  pump(side);
}
function clearPumps(){held.clear();$('left').classList.remove('pressed');$('right').classList.remove('pressed');}
for(const [id,side] of [['left',0],['right',1]]){
  const el=$(id);
  el.addEventListener('pointerdown',e=>{e.preventDefault();if(held.has(e.pointerId))return;el.setPointerCapture(e.pointerId);held.set(e.pointerId,{side});el.classList.add('pressed');void pressPump(side);});
  const release=e=>{held.delete(e.pointerId);if(![...held.values()].some(h=>h.side===side))el.classList.remove('pressed');};
  el.addEventListener('pointerup',release);el.addEventListener('pointercancel',release);el.addEventListener('lostpointercapture',release);
  // Native button activation remains available to assistive technology.
  el.addEventListener('click',e=>{
    // Safari recognizes button activation as a permission gesture. Retry if
    // no sensor signal arrived, rather than permanently locking out motion.
    if(!state.sensor)void start();
    if(e.detail===0)pressPump(side);
  });
}
window.addEventListener('blur',clearPumps);
function screenAngle(){return screen.orientation?.angle??window.orientation??0;}
let presentationRotation=0;
function keepPortrait(){
  const landscape=window.innerWidth>window.innerHeight;
  const angle=((screenAngle()+180)%360+360)%360-180;
  presentationRotation=landscape?(Math.abs(angle)===90?angle:90):0;
  document.documentElement.style.setProperty('--game-rotation',`${presentationRotation}deg`);
}
keepPortrait();
function gravityDirection(betaDegrees,gammaDegrees,screenDegrees){
  // Transform world-down into device coordinates using the W3C Z-X-Y
  // rotation convention. A vector stays continuous through Euler wraps
  // and reverses vertical sinking when the phone is upside down.
  const beta=betaDegrees*Math.PI/180,gamma=gammaDegrees*Math.PI/180;
  const angle=screenDegrees*Math.PI/180;
  const x=Math.cos(beta)*Math.sin(gamma),y=-Math.sin(beta);
  return {x:x*Math.cos(angle)+y*Math.sin(angle),
    y:-x*Math.sin(angle)+y*Math.cos(angle),
    z:-Math.cos(beta)*Math.cos(gamma)};
}
function orientation(e){
  if(!Number.isFinite(e.beta)||!Number.isFinite(e.gamma))return;
  state.latest={beta:e.beta,gamma:e.gamma};
  // The portrait surface counteracts the browser's landscape layout.
  // Express gravity in that surface's coordinates, keeping tilt intuitive.
  const gravity=gravityDirection(e.beta,e.gamma,screenAngle()-presentationRotation);
  state.targetX=gravity.x;state.targetY=gravity.y;state.targetZ=gravity.z;
  state.sensor=true;
  if(state.playing)$('motion-status').textContent='Tilt connected';
}
function motion(e){if(!state.playing)return;
  // Some mobile browsers expose gravity through motion but not orientation.
  const g=e.accelerationIncludingGravity;
  if(!state.latest&&g&&[g.x,g.y,g.z].every(Number.isFinite)){
    const length=Math.hypot(g.x,g.y,g.z);
    if(length>1){
      const angle=(screenAngle()-presentationRotation)*Math.PI/180;
      const x=g.x/length,y=g.y/length;
      state.targetX=x*Math.cos(angle)+y*Math.sin(angle);
      state.targetY=-x*Math.sin(angle)+y*Math.cos(angle);
      state.targetZ=g.z/length;state.sensor=true;
    }
  }
  const a=e.acceleration;if(!a||a.x===null||a.y===null||a.z===null)return;const magnitude=Math.hypot(a.x,a.y,a.z);if(magnitude>6&&state.time-state.lastShake>.55){state.lastShake=state.time;for(const r of rings){if(r.pole===null){r.vx+=(Math.random()-.5)*Math.min(magnitude*.13,2.0);r.vy+=Math.min(magnitude*.09,1.4);r.spin+=(Math.random()-.5)*2;}}emit(0,8);}}
window.addEventListener('deviceorientation',orientation);
window.addEventListener('devicemotion',motion);
function screenChanged(){keepPortrait();if(state.latest)orientation(state.latest);}
window.addEventListener('orientationchange',screenChanged);
screen.orientation?.addEventListener('change',screenChanged);
window.addEventListener('resize',screenChanged);
let startPending=null;
function start(){
  if(startPending)return startPending;
  startPending=enableMotion().finally(()=>{startPending=null;});
  return startPending;
}
async function enableMotion(){
  $('start').disabled=true;
  try{
    // Both permissions must be requested directly during the tap gesture.
    const requests=[];
    for(const api of [window.DeviceOrientationEvent,window.DeviceMotionEvent])if(typeof api?.requestPermission==='function')requests.push(api.requestPermission());
    const results=await Promise.all(requests);
    if(results.length&&results.every(result=>result==='denied')){$('welcome-copy').textContent='Motion access was declined. Allow motion in your browser settings, then try again.';$('start').textContent='Try motion again';return;}
    if(!window.DeviceOrientationEvent){$('welcome-copy').textContent='This browser does not provide tilt controls. Open this page in Safari or Chrome on your phone.';return;}
    if(state.latest)orientation(state.latest);
    state.playing=true;overlay.hidden=true;
    $('motion-status').textContent=state.sensor?'Tilt connected':'Waiting for tilt…';
    setTimeout(()=>{if(!state.sensor&&state.playing){$('motion-status').textContent='No tilt signal';$('hint').textContent='Jets work. Enable motion in browser settings for tilt.';}},3500);
  }catch(error){$('welcome-copy').textContent='Motion could not start. Open the secure page directly in your phone browser and try again.';$('start').textContent='Try motion again';}
  finally{$('start').disabled=false;}
}
$('start').addEventListener('click',start);
$('reset').addEventListener('click',()=>{reset();clearPumps();if(!state.playing&&overlay.hidden){state.playing=true;}else if(!state.playing){$('welcome-title').innerHTML='Go with<br>the flow.';$('welcome-copy').innerHTML='Pump the water. Tilt your phone.<br>Catch all eight rings on the poles.';$('start').textContent='Enable motion & play';$('note').textContent='Turn your phone to change which way the rings sink.';}});
function simulate(dt){
  state.time+=dt;
  state.tiltX=THREE.MathUtils.damp(state.tiltX,state.targetX,7,dt);
  state.tiltY=THREE.MathUtils.damp(state.tiltY,state.targetY,7,dt);
  state.tiltZ=THREE.MathUtils.damp(state.tiltZ,state.targetZ,7,dt);
  updateAirPocket();
  // A squeeze fades quickly and fully stops; only a fresh press adds water.
  for(let j=0;j<2;j++){state.pulse[j]*=Math.exp(-3.8*dt);if(state.pulse[j]<.02)state.pulse[j]=0;}
  for(const r of rings){
    const oldX=r.x,oldY=r.y;
    let ax=state.tiltX*1.65, ay=state.tiltY*1.65, az=state.tiltZ*1.65;
    // Jet columns widen with height. Side flow and eddies make pump timing
    // meaningful while drag prevents rings from flying like objects in air.
    for(let j=0;j<2;j++){const dx=r.x-JET_POSITIONS[j];const spread=.45+r.y*.1;const force=state.pulse[j]*jetImmersion(j)*Math.exp(-(dx*dx)/(spread*spread))*Math.exp(-r.y*.085);ay+=force*10;ax+=force*(dx*.9+Math.sin(state.time*2.5+r.index)*.8);r.spin+=force*.8*dt;}
    ax+=Math.sin(state.time*1.1+r.y*1.8+r.index)*.10;
    const drag=Math.exp(-1.8*dt);r.vx=(r.vx+ax*dt)*drag;r.vy=(r.vy+ay*dt)*drag;r.vz=(r.vz+az*dt)*Math.exp(-3*dt);
    r.x+=r.vx*dt;r.y+=r.vy*dt;r.z+=r.vz*dt;
    r.spin*=Math.exp(-2.2*dt);r.angle+=r.spin*dt;r.angle=THREE.MathUtils.damp(r.angle,0,1.6,dt);
    if(r.pole!==null){
      const post=posts[r.pole];
      // Let the pole guide the opening gently instead of teleporting the ring.
      r.x=THREE.MathUtils.damp(r.x,post.x,12,dt);
      r.z=THREE.MathUtils.damp(r.z,0,12,dt);
      r.vx*=Math.exp(-18*dt);r.vz*=Math.exp(-18*dt);
      r.angle=THREE.MathUtils.damp(r.angle,0,12,dt);
      const below=rings.filter(other=>other!==r&&other.pole===r.pole&&(other.y<r.y-.015||(Math.abs(other.y-r.y)<=.015&&other.index<r.index)));
      const bottom=.4+below.length*.15;
      if(r.y<bottom){r.y=bottom;r.vy=0;}
      if(r.y>TIP+.12){r.pole=null;r.vx=(Math.random()-.5)*.4;}
    }else{
      // This is a shallow tank: depth drift is visual motion, not another
      // aiming control. Allow a visibly aligned ring to thread across the
      // whole depth range, then guide its center onto the pole's plane.
      for(let j=0;j<2;j++){
        const dx=r.x-posts[j].x;
        if(r.vy<0&&r.y>=TIP&&r.y<TIP+.65&&Math.abs(dx)<.3){
          r.z=THREE.MathUtils.damp(r.z,0,12,dt);
          r.vz*=Math.exp(-12*dt);
        }
        if(oldY>=TIP&&r.y<=TIP&&r.vy<0&&Math.abs(r.angle)<.7){
          // Test the tip-crossing point, not just the frame's endpoint.
          const fraction=(oldY-TIP)/(oldY-r.y);
          const crossingX=oldX+(r.x-oldX)*fraction;
          if(Math.abs(crossingX-posts[j].x)<.185){
            r.pole=j;r.vx*=.35;r.vz*=.35;r.spin*=.35;break;
          }
        }
        if(r.y<TIP-.05&&r.y>.38&&Math.abs(dx)<.33){r.x=posts[j].x+(dx<0?-.34:.34);r.vx=(dx<0?-1:1)*Math.max(.12,Math.abs(r.vx)*.4);}
      }
      if(r.y<.25){r.y=.25;r.vy=Math.abs(r.vy)*.16;r.vx*=.97;}
    }
    if(r.y>7.45){r.y=7.45;r.vy=-Math.abs(r.vy)*.25;}
    if(Math.abs(r.x)>2.66){r.x=Math.sign(r.x)*2.66;r.vx=-r.vx*.4;}
    if(Math.abs(r.z)>.16){r.z=Math.sign(r.z)*.16;r.vz=-r.vz*.25;}
  }
  // Gentle ring contact response in the shallow water plane.
  for(let i=0;i<rings.length;i++)for(let j=i+1;j<rings.length;j++){
    const a=rings[i],b=rings[j];if(a.pole!==null||b.pole!==null)continue;
    const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d>0&&d<.48){const push=(.48-d)*.45;const nx=dx/d,ny=dy/d;a.x-=nx*push;b.x+=nx*push;a.y-=ny*push;b.y+=ny*push;const relative=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(relative<0){const impulse=-relative*.45;a.vx-=nx*impulse;a.vy-=ny*impulse;b.vx+=nx*impulse;b.vy+=ny*impulse;}}
  }
  updateScore();
}
function render(dt){
  for(const r of rings){r.mesh.position.set(r.x,r.y,r.z);r.visualYaw=THREE.MathUtils.damp(r.visualYaw??0,r.pole===null?Math.sin(state.time+r.index)*.12:0,10,dt);r.mesh.rotation.set(Math.PI/2+r.angle,r.visualYaw,r.angle*.2);}
  bubbleData.forEach((b,i)=>{if(state.playing&&b.life>0){b.life-=dt;b.y+=b.speed*dt;b.x+=Math.sin(b.y*4+i)*dt*.12;}const visible=b.life>0&&b.y<7.5;bubblePositions[i*3]=b.x;bubblePositions[i*3+1]=visible?b.y:-2;bubblePositions[i*3+2]=b.z;});bubbleGeometry.attributes.position.needsUpdate=true;
  back.material.uniforms.time.value=state.time;
  back.material.uniforms.jets.value.set(state.pulse[0]*jetImmersion(0),state.pulse[1]*jetImmersion(1));
  back.material.uniforms.airDirection.value.set(air.x,air.y,air.z);
  back.material.uniforms.airCenter.value.set(air.centerX,air.centerY,air.centerZ);
  back.material.uniforms.airCurvature.value=air.curvature;
  back.material.uniforms.airLevel.value=air.level;
  $('tilt-dot').style.transform=`translateX(${state.tiltX*23}px)`;
  renderer.render(scene,camera);
}
function resize(){
  const w=tank.clientWidth,h=tank.clientHeight;
  if(w<=0||h<=0)return;
  renderer.setSize(w,h,false);
  const ratio=w/h;
  const horizontal=Math.max(6.1,8.0*ratio);
  const halfHeight=horizontal/ratio/2;
  // Frustum bounds are camera-local. lookAt() already centers the tank;
  // adding its world-space center here would hide the floor and poles.
  camera.left=-horizontal/2;camera.right=horizontal/2;
  camera.top=halfHeight;camera.bottom=-halfHeight;
  camera.updateProjectionMatrix();
  // Keep the water backdrop covering the viewport in either orientation.
  back.scale.set(horizontal/6.6+.2,halfHeight*2/8+.2,1);
  frontAir.scale.copy(back.scale);
  // Leave a small visible air gap inside the glass at any phone aspect ratio.
  const cameraRise=camera.position.y-3.9;
  const viewLength=Math.hypot(cameraRise,camera.position.z);
  const verticalProjection=camera.position.z/viewLength;
  const depthProjection=cameraRise/viewLength;
  back.material.uniforms.surface.value=3.9+(halfHeight-.28-.7*depthProjection)/verticalProjection;
  air.halfWidth=horizontal*.5;air.top=back.material.uniforms.surface.value+.32;
  back.material.uniforms.tankBounds.value.set(air.halfWidth,air.top);
  air.lastX=NaN;air.lastY=NaN;air.lastZ=NaN;updateAirPocket();
}
new ResizeObserver(resize).observe(tank);
$('phone-url').textContent=location.hostname==='127.0.0.1'?'Your phone link will be ready when published.':location.href;
reset();resize();
let last=performance.now(),accumulator=0;
function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;if(!document.hidden){if(state.playing){accumulator+=dt;while(accumulator>=FIXED_DT&&state.playing){simulate(FIXED_DT);accumulator-=FIXED_DT;}}else accumulator=0;render(dt);}requestAnimationFrame(frame);}
document.addEventListener('visibilitychange',()=>{last=performance.now();accumulator=0;clearPumps();});
requestAnimationFrame(frame);

// Optional browser-agent tools reuse the exact same game actions.
if(document.modelContext?.registerTool){
  const definitions=[
    {name:'read_ring_toss',description:'Read the ring count and motion status.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({caught:state.count,total:TOTAL,playing:state.playing,motionConnected:state.sensor})},
    {name:'pump_water_jet',description:'Press one water jet in a running ring toss game.',inputSchema:{type:'object',properties:{side:{type:'string',enum:['left','right']}},required:['side'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{if(!input||!['left','right'].includes(input.side))throw new Error('Choose left or right.');if(!state.playing)throw new Error('Start the game on your phone first.');pump(input.side==='left'?0:1);return {pumped:input.side,caught:state.count};}}
  ];for(const tool of definitions){try{Promise.resolve(document.modelContext.registerTool(tool)).catch(()=>{});}catch{}}
}
