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
  const positions = [[-.37,.35],[.37,.35],[-.45,-.08],[.45,-.08],[0,-.69]];
  const $ = id => document.getElementById(id);
  const assets = name => `./assets/${name}`;
  const scene = document.createElement('a-scene');
  scene.id = 'ar-scene';
  scene.setAttribute('mindar-image', 'imageTargetSrc: ./assets/target.mind; autoStart: true; maxTrack: 1; filterMinCF: 0.001; filterBeta: 1000; uiScanning: no; uiError: no;');
  scene.setAttribute('embedded', '');
  scene.setAttribute('renderer', 'colorManagement: true; antialias: true; alpha: true');
  scene.setAttribute('vr-mode-ui', 'enabled: false');
  scene.setAttribute('device-orientation-permission-ui', 'enabled: false');
  const assetEl = document.createElement('a-assets');
  const imageNames = ['01_fan_base','02_rotating_brush_ring','03_rear_ribbons','04_gold_growth_orbit','05_wooden_stump','06_ling_xiaomang_original','07_front_ribbon','10_birthday_scroll'];
  for (let i=1;i<=5;i++) imageNames.push(`node_0${i}_idle`, `node_0${i}_active`);
  imageNames.forEach(name => { const img = document.createElement('img'); img.id = `asset_${name}`; img.setAttribute('src',assets(`${name}.webp`)); assetEl.appendChild(img); });
  scene.appendChild(assetEl);
  const camera = document.createElement('a-camera');
  camera.setAttribute('position','0 0 0');
  camera.setAttribute('look-controls','enabled: false');
  camera.setAttribute('cursor','rayOrigin: mouse; fuse: false');
  camera.setAttribute('raycaster','objects: .clickable');
  scene.appendChild(camera);
  const target = document.createElement('a-entity');
  target.id = 'target';
  target.setAttribute('mindar-image-target','targetIndex: 0');
  scene.appendChild(target);
  $('app').prepend(scene);

  function plane(name, width, height, position, extra={}) {
    const el = document.createElement('a-plane');
    el.setAttribute('src',`#asset_${name}`);
    el.setAttribute('material','transparent: true; alphaTest: 0.01; side: double; depthWrite: false');
    el.setAttribute('width',width);
    el.setAttribute('height',height);
    el.setAttribute('position',position.join(' '));
    for (const [key,value] of Object.entries(extra)) el.setAttribute(key,value);
    target.appendChild(el);
    return el;
  }
  plane('01_fan_base',.96,.96,[0,.10,.02]);
  plane('03_rear_ribbons',1.05,.70,[0,.10,.04],{'animation__spin':'property: rotation; from: 0 0 0; to: 0 0 360; dur: 28000; loop: true; easing: linear'});
  plane('02_rotating_brush_ring',.92,.92,[0,.10,.06],{'animation__spin':'property: rotation; from: 0 0 0; to: 0 0 -360; dur: 22000; loop: true; easing: linear'});
  plane('04_gold_growth_orbit',.94,.94,[0,.10,.08]);
  plane('05_wooden_stump',.65,.433,[0,-.51,.12]);
  const leopard = plane('06_ling_xiaomang_original',.53,.719,[0,-.05,.19]);
  leopard.setAttribute('id','leopard');
  plane('07_front_ribbon',.78,.39,[0,-.36,.23]);
  const scroll = plane('10_birthday_scroll',.70,.28,[0,.66,.24]);
  scroll.setAttribute('id','scroll');
  const nodes=[];
  positions.forEach(([x,y],i) => {
    const node=plane(`node_0${i+1}_idle`,.155,.155,[x,y,.3]);
    node.classList.add('clickable');
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
    chapterButtons.forEach((button,i)=>{button.classList.toggle('reached',i<=reached);button.classList.toggle('selected',i===selected&&$('story').open)});
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
    $('scan-tip').hidden=true;
    if(introPlayed)return;
    introPlayed=true;
    leopard.setAttribute('animation__jump','property: position; from: 0 -1.05 0.19; to: 0 -0.05 0.19; dur: 1200; easing: easeOutBack');
    scroll.setAttribute('animation__open','property: scale; from: 0.1 1 1; to: 1 1 1; dur: 800; easing: easeOutQuad');
    nodes.forEach((node,i)=>setTimeout(()=>{
      reached=i;
      node.setAttribute('src',`#asset_node_0${i+1}_active`);
      node.setAttribute('animation__glow','property: scale; from: 0.5 0.5 0.5; to: 1 1 1; dur: 400; easing: easeOutBack');
      updateChapters();
    },1400+i*720));
  });
  target.addEventListener('targetLost',()=>{
    $('scan-tip').hidden=false;
  });
})();
