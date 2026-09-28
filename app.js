(() => {
  'use strict';

  const storyText = [
    '那时，它还没有“凌小芒”这个名字。小小的雪豹幼崽在高原降生，跟着妈妈度过生命最初的日子。',
    '第二年六月，久治县下起了雪。牧民发现小芒时，它几乎被雪掩住，虚弱得站不起来。妈妈却不在身边。',
    '第二天，人们在约十公里外找到了小芒的妈妈。她已离世，胃里空空，身上带伤。回到孩子身边的路，她再也没能走完。',
    '妈妈没走完的路，被一双双手接了下去。牧民报了信，救援人员赶来，兽医悉心照料。几天后，小芒重新自己吃饭，也迈出了脚步。',
    '今天，桑桑两岁了。它会玩球、会跳跃，有许多人为它庆生。妈妈没能陪它走到这里；每一声“生日快乐”，也有一份是说给妈妈听的。'
  ];
  const titles = ['最初的日子','那场大雪','没走完的路','有人接着走','两岁了'];
  const dates = ['2024.10.01','2025.06.02','2025.06.03','2025.06.10','2026.10.01'];
  const positions = [[-.42,.34],[.42,.34],[-.48,-.04],[.48,-.04],[0,-.73]];
  const $ = id => document.getElementById(id);
  const assets = name => `./assets/${name}`;

  const scene = document.createElement('a-scene');
  scene.id = 'ar-scene';
  scene.setAttribute('mindar-image', 'imageTargetSrc: ./assets/target.mind; autoStart: true; maxTrack: 1; filterMinCF: 0.001; filterBeta: 45; warmupTolerance: 5; missTolerance: 5; uiScanning: no; uiError: no;');
  scene.setAttribute('embedded', '');
  scene.setAttribute('renderer', 'colorManagement: true; antialias: true; alpha: true; physicallyCorrectLights: false');
  scene.setAttribute('vr-mode-ui', 'enabled: false');
  scene.setAttribute('device-orientation-permission-ui', 'enabled: false');

  const assetEl = document.createElement('a-assets');
  const imageNames = ['01_fan_base','02_rotating_brush_ring','03_rear_ribbons','04_gold_growth_orbit','05_wooden_stump','06_ling_xiaomang_original','07_front_ribbon','10_birthday_scroll'];
  for (let i=1;i<=5;i++) imageNames.push(`node_0${i}_idle`, `node_0${i}_active`);
  imageNames.forEach(name => {
    const img = document.createElement('img');
    img.id = `asset_${name}`;
    img.setAttribute('src', assets(`${name}.webp`));
    assetEl.appendChild(img);
  });
  scene.appendChild(assetEl);

  const camera = document.createElement('a-camera');
  camera.setAttribute('position','0 0 0');
  camera.setAttribute('look-controls','enabled: false');
  camera.setAttribute('cursor','rayOrigin: mouse; fuse: false');
  camera.setAttribute('raycaster','objects: .clickable; far: 1000');
  scene.appendChild(camera);

  const target = document.createElement('a-entity');
  target.id = 'target';
  target.setAttribute('mindar-image-target','targetIndex: 0');
  scene.appendChild(target);
  $('app').prepend(scene);

  function plane(name, width, height, position, extra={}) {
    const el = document.createElement('a-plane');
    el.setAttribute('src', `#asset_${name}`);
    el.setAttribute('material','transparent: true; alphaTest: 0.02; side: double; depthWrite: false');
    el.setAttribute('width', width);
    el.setAttribute('height', height);
    el.setAttribute('position', position.join(' '));
    Object.entries(extra).forEach(([key,value]) => el.setAttribute(key,value));
    target.appendChild(el);
    return el;
  }

  // 2.5D spatial stack: each layer sits at a different depth from the poster.
  const fan = plane('01_fan_base', .92, .92, [0,.09,.10]);
  fan.setAttribute('rotation','0 0 0');

  const rear = plane('03_rear_ribbons', 1.00, .67, [0,.12,.18]);
  rear.setAttribute('rotation','0 0 -4');
  rear.setAttribute('animation__drift','property: rotation; from: 0 0 -6; to: 0 0 6; dir: alternate; dur: 5200; loop: true; easing: easeInOutSine');

  const orbit = plane('04_gold_growth_orbit', .88, .88, [0,.13,.28]);
  orbit.setAttribute('rotation','62 0 0');
  orbit.setAttribute('animation__orbit','property: rotation; from: 62 0 0; to: 62 0 360; dur: 16000; loop: true; easing: linear');

  const brush = plane('02_rotating_brush_ring', .91, .91, [0,.11,.34]);
  brush.setAttribute('rotation','0 16 0');
  brush.setAttribute('animation__spin','property: rotation; from: 0 16 0; to: 0 16 -360; dur: 11000; loop: true; easing: linear');

  const stump = plane('05_wooden_stump', .62, .413, [0,-.53,.38]);
  stump.setAttribute('rotation','-10 0 0');

  const leopard = plane('06_ling_xiaomang_original', .50, .678, [0,-.07,.62]);
  leopard.setAttribute('id','leopard');
  leopard.setAttribute('rotation','-2 0 0');

  const frontRibbon = plane('07_front_ribbon', .75, .375, [0,-.36,.72]);
  frontRibbon.setAttribute('rotation','-4 0 0');
  frontRibbon.setAttribute('animation__float','property: position; from: 0 -0.38 0.72; to: 0 -0.34 0.78; dir: alternate; dur: 2300; loop: true; easing: easeInOutSine');

  const scroll = plane('10_birthday_scroll', .67, .268, [0,.66,.68]);
  scroll.setAttribute('id','scroll');
  scroll.setAttribute('rotation','2 0 0');

  // Floating sparkles enhance depth cues.
  const sparklePositions = [
    [-.34,.56,.82],[.30,.50,.76],[-.40,.02,.86],[.38,-.22,.90],
    [-.22,-.62,.84],[.18,.18,.94],[.08,.56,.88],[-.08,-.24,.96]
  ];
  sparklePositions.forEach((p,i) => {
    const s=document.createElement('a-circle');
    s.setAttribute('radius', i%3===0 ? '.018' : '.011');
    s.setAttribute('position',p.join(' '));
    s.setAttribute('material','shader: flat; color: #ffd66b; transparent: true; opacity: .85; side: double; depthWrite: false');
    s.setAttribute('animation__pulse',`property: scale; from: .55 .55 .55; to: 1.45 1.45 1.45; dir: alternate; dur: ${900+i*120}; loop: true; easing: easeInOutSine`);
    s.setAttribute('animation__rise',`property: position; from: ${p[0]} ${p[1]} ${p[2]}; to: ${p[0]} ${p[1]+.04} ${p[2]+.05}; dir: alternate; dur: ${1700+i*110}; loop: true; easing: easeInOutSine`);
    target.appendChild(s);
  });

  const nodes=[];
  positions.forEach(([x,y],i) => {
    const z = .82 + (i%2)*.10;
    const node=plane(`node_0${i+1}_idle`, .145, .145, [x,y,z]);
    node.classList.add('clickable');
    node.setAttribute('rotation', `0 ${x<0?12:-12} 0`);
    node.setAttribute('animation__float', `property: position; from: ${x} ${y-.012} ${z}; to: ${x} ${y+.028} ${z+.08}; dir: alternate; dur: ${1550+i*170}; loop: true; easing: easeInOutSine`);
    node.addEventListener('click',()=>showStory(i));
    nodes.push(node);
  });

  let reached=-1, selected=0, introPlayed=false, musicOn=false;
  const chapterButtons=[];
  titles.forEach((title,i)=>{
    const button=document.createElement('button');
    button.type='button';
    button.innerHTML=`<span>0${i+1}</span>${title}`;
    button.setAttribute('aria-label',`${dates[i]} ${title}`);
    button.addEventListener('click',()=>showStory(i));
    $('chapters').appendChild(button);
    chapterButtons.push(button);
  });

  function updateChapters(){
    chapterButtons.forEach((button,i)=>{
      button.classList.toggle('reached',i<=reached);
      button.classList.toggle('selected',i===selected&&$('story').open);
    });
  }

  function showStory(i){
    selected=Math.max(0,Math.min(4,i));
    $('story-image').src=assets(`card_0${selected+1}.webp`);
    $('story-image').alt=`${dates[selected]} ${titles[selected]}：${storyText[selected]}`;
    $('story-heading').textContent=`0${selected+1}｜${titles[selected]}`;
    $('story-date').textContent=dates[selected];
    $('story-body').textContent=storyText[selected];
    $('story-progress').textContent=`${selected+1} / 5`;
    $('prev-story').disabled=selected===0;
    $('next-story').disabled=selected===4;
    if(!$('story').open) $('story').showModal();
    updateChapters();
  }

  $('close-story').addEventListener('click',()=>$('story').close());
  $('story').addEventListener('close',updateChapters);
  $('read-story').addEventListener('click',()=>{
    const textMode=$('story-copy').hidden;
    $('story-copy').hidden=!textMode;
    $('story-image').hidden=textMode;
    $('read-story').textContent=textMode?'看卡片':'看大字';
  });
  $('prev-story').addEventListener('click',()=>showStory(selected-1));
  $('next-story').addEventListener('click',()=>showStory(selected+1));

  const music=$('lion-music');
  function setMusic(on){
    musicOn=on;
    $('music').textContent=on?'关闭音乐':'开启音乐';
    $('music').setAttribute('aria-pressed',String(on));
    if(on) music.play().catch(()=>{musicOn=false;$('music').textContent='开启音乐';});
    else music.pause();
  }
  $('music').addEventListener('click',()=>setMusic(!musicOn));

  scene.addEventListener('arError',()=>{
    $('error').textContent='相机未能启动。请允许相机权限；如果扫码应用不支持相机，请在手机浏览器中打开此页面。';
    $('error').hidden=false;
  });

  target.addEventListener('targetFound',()=>{
    $('scan-tip').textContent='识别成功 · 点击画面中的 01–05 节点';
    $('scan-tip').hidden=false;
    setTimeout(()=>{$('scan-tip').hidden=true;},2600);
    if(introPlayed)return;
    introPlayed=true;

    // Leopard moves forward in Z as well as upward, creating a clear “coming out of the poster” cue.
    leopard.setAttribute('animation__jump','property: position; from: 0 -0.88 0.18; to: 0 -0.07 0.62; dur: 1050; easing: easeOutBack');
    leopard.setAttribute('animation__scale','property: scale; from: .45 .45 .45; to: 1 1 1; dur: 1050; easing: easeOutBack');
    setTimeout(()=>{
      leopard.setAttribute('animation__breathe','property: position; from: 0 -0.085 0.62; to: 0 -0.035 0.68; dir: alternate; dur: 1800; loop: true; easing: easeInOutSine');
    },1100);

    scroll.setAttribute('animation__open','property: scale; from: .08 1 1; to: 1 1 1; dur: 760; easing: easeOutQuad');

    nodes.forEach((node,i)=>setTimeout(()=>{
      reached=i;
      node.setAttribute('src',`#asset_node_0${i+1}_active`);
      node.setAttribute('animation__pop','property: scale; from: .15 .15 .15; to: 1 1 1; dur: 460; easing: easeOutBack');
      updateChapters();
    },1050+i*430));
  });

  target.addEventListener('targetLost',()=>{
    $('scan-tip').textContent='请重新对准完整展板';
    $('scan-tip').hidden=false;
  });
})();