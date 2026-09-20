import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/** Mount on a positioned empty element. Pointer input may come from a parent containing your search UI. */
export async function mountHeroScene(container, { modelUrl = './assets/scene.glb', eventTarget = container, onState = () => {} } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0xb8eee9, 1);
  container.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(23.996,16/9,.1,120);
  camera.position.set(0,7.5,45);
  camera.lookAt(0,7.5,0);
  let gltf;
  try { gltf = await new GLTFLoader().loadAsync(modelUrl); }
  catch (error) { renderer.dispose(); renderer.domElement.remove(); throw error; }
  const model = gltf.scene;
  scene.add(model);
  scene.add(new THREE.AmbientLight(0xffffff,Math.PI));
  const byName = name => model.getObjectByName(name);
  const required = ['BG_Skyline','FG_Palms','Plane','FlightTrail','Destination_Left','Destination_Right','Destination_Center'];
  for (const name of required) if (!byName(name)) throw new Error(`Missing scene object: ${name}`);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = new THREE.Vector2();
  const smooth = new THREE.Vector2();
  const layers = ['BG_Mountains','BG_Skyline','MG_Buildings','Near_Neighborhood','MG_Palms','FG_Palms'].map(name => ({object:byName(name), base:byName(name).position.clone(),factor:byName(name).userData.parallaxFactor || .1}));
  // Shared GPU wind: roots remain fixed; upper trunks bend and leaf tips flutter.
  const windTime={value:0}, windStrength={value:1};
  const windMaterials=new Set();
  for(const groupName of ['FG_Palms','MG_Palms']) byName(groupName).traverse(object=>{
    if(!object.isMesh)return;
    for(const material of (Array.isArray(object.material)?object.material:[object.material])) {
      if(windMaterials.has(material))continue;
      windMaterials.add(material);
      const crown=material.name.includes('foliage');
      material.onBeforeCompile=shader=>{
        shader.uniforms.heroWindTime=windTime;shader.uniforms.heroWindStrength=windStrength;
        shader.vertexShader='uniform float heroWindTime; uniform float heroWindStrength;\n'+shader.vertexShader;
        shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
          float heightWeight=pow(clamp(position.y/7.65,0.0,1.3),2.0);
          float phase=modelMatrix[3].x*0.31;
          float breeze=sin(heroWindTime*0.72+phase)*0.075+sin(heroWindTime*1.13+phase)*0.023;
          transformed.x+=breeze*heightWeight*heroWindStrength;
          ${crown ? 'float leafWeight=smoothstep(6.4,9.1,position.y); transformed.x+=sin(heroWindTime*1.7+position.x*2.4+phase)*0.026*leafWeight*heroWindStrength; transformed.y+=sin(heroWindTime*1.35+position.x*3.0+phase)*0.012*leafWeight*heroWindStrength;' : ''}
        `);
      };
      material.customProgramCacheKey=()=>crown?'hero-crown-breeze-v1':'hero-trunk-breeze-v1';
    }
  });
  const palms = [...byName('FG_Palms').children].map(object => ({object,base:object.position.clone(),rotation:object.rotation.clone()}));
  function opacityGroup(root) {
    const mats=[];
    root.traverse(o => {
      if (!o.isMesh) return;
      const cloned=(Array.isArray(o.material) ? o.material : [o.material]).map(m => {
        const c=m.clone(); c.transparent=true;c.depthWrite=false;if(root.name.startsWith('Destination_'))c.depthTest=false;mats.push({m:c,alpha:m.opacity});return c;
      });
      o.material=Array.isArray(o.material)?cloned:cloned[0];o.renderOrder=o.name.includes('_Shadow_')?2:3;
    });
    return amount => { for (const {m,alpha} of mats) m.opacity=alpha*amount; };
  }
  const cards = ['Left','Right','Center'].map((side,index) => {
    const root=byName('Destination_'+side);
    const clip=gltf.animations.find(c=>c.name==='Destination_'+side+'_Reveal');
    const position=clip.tracks.find(t=>t.name.endsWith('.position')).createInterpolant();
    const rotation=clip.tracks.find(t=>t.name.endsWith('.quaternion')).createInterpolant();
    return {root,position,rotation,clip,amount:0,side:side.toLowerCase(),alpha:opacityGroup(root),index};
  });
  const plane=byName('Plane'), trail=byName('FlightTrail');
  // A small directional highlight gives the aircraft volume without relighting the photographic city.
  plane.traverse(object=>object.layers.enable(1));camera.layers.enable(1);
  const aircraftLight=new THREE.DirectionalLight(0xd9f8ff,2.0);aircraftLight.position.set(-5,18,12);aircraftLight.layers.set(1);scene.add(aircraftLight);
  const planeAlpha=opacityGroup(plane),trailAlpha=opacityGroup(trail);
  const flightMixer=new THREE.AnimationMixer(model);
  const flightClip=gltf.animations.find(c=>c.name==='Plane_Fly');
  const flightAction=flightMixer.clipAction(flightClip);flightAction.setLoop(THREE.LoopOnce,1);flightAction.clampWhenFinished=true;flightAction.play();flightAction.paused=true;
  const trailMesh=byName('FlightTrail_Mesh');
  trail.scale.setScalar(1);
  const trailCount=trailMesh.geometry.index?.count ?? trailMesh.geometry.attributes.position.count;
  const sky=byName('Sky_Gradient');
  // Imported Blender camera coordinates are Y-up in glTF. Use a matching fixed hero camera.
  let state='default',width=0,height=0,visible=true,raf=0,disposed=false,last=performance.now(),elapsed=0,flightTime=0,flightAmount=0,flightProgress=null;
  function setState(next) {
    if (!['default','left','right','up','center'].includes(next)) next='default';
    if (next===state) return;
    if(next==='up' && state!=='up') flightTime=0;
    state=next;onState(next);
    container.dataset.state=next;
  }
  function resize() {
    width=container.clientWidth;height=container.clientHeight;
    if(!width || !height)return;
    const aspect=width/height;
    const sceneHeight=19.125,halfWidth=sceneHeight*aspect/2;
    camera.aspect=aspect;camera.fov=aspect>16/9 ? THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(23.996/2))*(16/9)/aspect)) : 23.996;camera.updateProjectionMatrix();
    renderer.setSize(width,height,false);
    const spread=Math.min(1,halfWidth/17);
    for(const p of palms)p.object.position.x=p.base.x*spread;
    // Full-size background extends beyond the camera; cards stay inside narrower hero layouts.
    sky.scale.x=1;
  }
  const observer=new ResizeObserver(resize);observer.observe(container);resize();
  function move(event) {
    if(event.target.closest?.('input,select,textarea,button,[data-hero-ui]')) return;
    const r=eventTarget.getBoundingClientRect();
    pointer.set(THREE.MathUtils.clamp((event.clientX-r.left)/r.width*2-1,-1,1),THREE.MathUtils.clamp((event.clientY-r.top)/r.height*2-1,-1,1));
    if(pointer.y<-.43)setState('up');
    else if(pointer.x<-.36)setState('left');
    else if(pointer.x>.36)setState('right');
    else if(pointer.y>.65)setState('center');
    else setState('default');
  }
  function leave(){pointer.set(0,0);setState('default');}
  function key(event) {
    if(event.target.closest?.('input,select,textarea,button,[data-hero-ui]'))return;
    const states={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'center',Escape:'default'};
    if(states[event.key]){event.preventDefault();setState(states[event.key]);}
  }
  eventTarget.addEventListener('pointermove',move);eventTarget.addEventListener('pointerleave',leave);eventTarget.addEventListener('pointercancel',leave);eventTarget.addEventListener('keydown',key);
  function focusState(){visible=!document.hidden;if(visible){last=performance.now();if(!raf)raf=requestAnimationFrame(tick);}else {cancelAnimationFrame(raf);raf=0;}}
  document.addEventListener('visibilitychange',focusState);
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting&&!document.hidden;if(visible&&!raf){last=performance.now();raf=requestAnimationFrame(tick);}});intersection.observe(container);
  function tick(now) {
    raf=0;if(disposed||!visible)return;
    const dt=Math.min((now-last)/1000,.05);last=now;elapsed+=dt;
    const follow=1-Math.exp(-dt*4.5),reveal=1-Math.exp(-dt*7);
    smooth.lerp(reduced.matches?new THREE.Vector2():pointer,follow);
    camera.position.x=smooth.x*.075;camera.position.y=7.5-smooth.y*.04;
    for(const layer of layers){layer.object.position.x=layer.base.x+smooth.x*layer.factor;layer.object.position.y=layer.base.y-smooth.y*layer.factor*.23;}
    windTime.value=elapsed;windStrength.value=reduced.matches?0:1;
    const spread=Math.min(1,(width/height)/(16/9)),cardSize=Math.max(.64,Math.min(1,spread*1.5));
    for(const card of cards){
      card.amount+=(Number(state===card.side)-card.amount)*reveal;
      if(card.amount<.001)card.amount=0;
      const sampleTime=card.amount*(card.clip.duration-.00001);
      card.root.position.fromArray(card.position.evaluate(sampleTime));
      card.root.quaternion.fromArray(card.rotation.evaluate(sampleTime));
      // Keep the slide from the GLB clip, but avoid shrinking the card during a fade.
      card.root.scale.setScalar(cardSize);card.root.position.x*=spread;
      if(!reduced.matches){card.root.position.y+=Math.sin(elapsed*1.25+card.index)*.045*card.amount;card.root.rotation.y+=smooth.x*.025*card.amount;}
      card.root.visible=card.amount>.005;card.alpha(card.amount);
    }
    flightAmount+=(Number(state==='up')-flightAmount)*reveal;
    if(state==='up')flightTime+=dt*(reduced.matches?0:1);
    const duration=flightClip.duration;
    const t=flightProgress ?? (reduced.matches?.73:(flightTime%(duration+1.2))/duration);
    flightAction.time=Math.min(.999,t)*duration;flightMixer.update(0);
    plane.visible=trail.visible=flightAmount>.005 && t<1;
    const fade=Math.min(1,t*9,(1-t)*7)*flightAmount;
    planeAlpha(Math.max(0,fade));trailAlpha(Math.max(0,fade)*.8);
    // Each sequential tube segment has eight triangles; reveal only the portion behind the plane.
    const segments=Math.floor(THREE.MathUtils.clamp(t-.018,0,1)*(trail.userData.segments || 56));
    trailMesh.geometry.setDrawRange(0,Math.min(trailCount,segments*24));
    renderer.render(scene,camera);
    raf=requestAnimationFrame(tick);
  }
  container.dataset.state='default';onState('default');raf=requestAnimationFrame(tick);
  return {
    setState,
    /** Optional host-driven scrub: 0..1, or null to resume normal flight. */
    setFlightProgress(progress){flightProgress=progress===null?null:THREE.MathUtils.clamp(progress,0,1);},
    /** For host QA; values are measured, not performance guarantees. */
    getStats:()=>({triangles:renderer.info.render.triangles,drawCalls:renderer.info.render.calls,animations:gltf.animations.map(c=>c.name)}),
    dispose(){
      disposed=true;cancelAnimationFrame(raf);observer.disconnect();intersection.disconnect();
      eventTarget.removeEventListener('pointermove',move);eventTarget.removeEventListener('pointerleave',leave);eventTarget.removeEventListener('pointercancel',leave);eventTarget.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',focusState);
      flightMixer.stopAllAction();flightMixer.uncacheRoot(model);
      const geometries=new Set(),materials=new Set();model.traverse(o=>{if(o.isMesh){geometries.add(o.geometry);for(const m of (Array.isArray(o.material)?o.material:[o.material]))materials.add(m);}});
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();
    }
  };
}




