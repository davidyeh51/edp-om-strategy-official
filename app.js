(function(){
  var parts = {
    p1: [].slice.call(document.querySelectorAll('#view-p1 .slide')),
    p2: [].slice.call(document.querySelectorAll('#view-p2 .slide')),
    p3: [].slice.call(document.querySelectorAll('#view-p3 .slide')),
    p4: [].slice.call(document.querySelectorAll('#view-p4 .slide')),
    p5: [].slice.call(document.querySelectorAll('#view-p5 .slide'))
  };
  var order = ['p1','p2','p3','p4','p5'];
  var state = { view:'home', idx:0 };
  var last = { p1:0, p2:0, p3:0, p4:0, p5:0 };
  var views = {
    home: document.getElementById('view-home'),
    p1: document.getElementById('view-p1'),
    p2: document.getElementById('view-p2'),
    p3: document.getElementById('view-p3'),
    p4: document.getElementById('view-p4'),
    p5: document.getElementById('view-p5')
  };
  var deckbar = document.getElementById('deckbar');
  var fill = document.getElementById('progressFill');
  var counter = document.getElementById('counter');

  function render(){
    Object.keys(views).forEach(function(k){
      if(views[k]) views[k].classList.toggle('active', k===state.view);
    });
    var navs = document.querySelectorAll('[data-nav]');
    for(var i=0;i<navs.length;i++){
      navs[i].classList.toggle('active', navs[i].getAttribute('data-nav')===state.view);
    }
    if(state.view==='home'){
      deckbar.style.display='none';
    } else {
      deckbar.style.display='block';
      var slides = parts[state.view];
      if(slides && slides.length){
        slides.forEach(function(s,i){ s.classList.toggle('active', i===state.idx); });
        counter.textContent = (state.idx+1)+' / '+slides.length;
        fill.style.width = ((state.idx+1)/slides.length*100)+'%';
        last[state.view]=state.idx;
      }
    }
    window.scrollTo(0,0);
  }

  function goHash(hash){
    hash = (hash||'#home').replace('#','');
    if(hash==='home'||hash===''){ state.view='home'; render(); return; }
    var m = hash.match(/^(p1|p2|p3|p4|p5)-(\\d+)$/);
    if(m){
      var v=m[1], i=parseInt(m[2],10)-1;
      if(parts[v] && parts[v][i]){ state.view=v; state.idx=i; render(); return; }
    }
    if(parts[hash]){
      state.view=hash;
      state.idx = last[hash] || 0;
      render(); return;
    }
    state.view='home'; render();
  }

  function setHash(){
    if(state.view==='home') history.replaceState(null,'','#home');
    else history.replaceState(null,'','#'+state.view+'-'+(state.idx+1));
  }

  function move(step){
    if(state.view==='home'){
      if(step>0){ state.view='p1'; state.idx=0; render(); setHash(); }
      return;
    }
    var slides = parts[state.view];
    var ni = state.idx + step;
    if(ni>=0 && ni<slides.length){
      state.idx = ni; render(); setHash();
    } else if(ni>=slides.length){
      var pi = order.indexOf(state.view);
      if(pi<order.length-1){ state.view=order[pi+1]; state.idx=0; render(); setHash(); }
    } else if(ni<0){
      var pi2 = order.indexOf(state.view);
      if(pi2>0){ state.view=order[pi2-1]; state.idx=parts[state.view].length-1; render(); setHash(); }
      else { state.view='home'; render(); setHash(); }
    }
  }

  document.getElementById('btnPrev').addEventListener('click',function(){ move(-1); });
  document.getElementById('btnNext').addEventListener('click',function(){ move(1); });

  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT') return;
    if(e.key==='ArrowRight'||e.key===' '||e.key==='PageDown'){ e.preventDefault(); move(1); }
    else if(e.key==='ArrowLeft'||e.key==='PageUp'){ e.preventDefault(); move(-1); }
    else if(e.key==='Home'){ e.preventDefault(); state.view='home'; render(); setHash(); }
    else if(e.key==='End'&&state.view!=='home'){ e.preventDefault(); state.idx=parts[state.view].length-1; render(); setHash(); }
    else if(e.key==='f'||e.key==='F'){
      if(document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    }
  });

  var tx=null, ty=null;
  document.addEventListener('touchstart',function(e){ tx=e.changedTouches[0].clientX; ty=e.changedTouches[0].clientY; },{passive:true});
  document.addEventListener('touchend',function(e){
    if(tx===null) return;
    var dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty;
    if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)) move(dx<0?1:-1);
    tx=null; ty=null;
  },{passive:true});

  window.addEventListener('hashchange',function(){ goHash(location.hash); });
  goHash(location.hash);
})();


// ================= SIMULATOR (25MW/人 & 25% 毛利基準) =================
(function(){
  var inMw = document.getElementById('input-mw');
  var inKw = document.getElementById('input-kw');
  var inSd = document.getElementById('input-sd');
  var inOm2 = document.getElementById('input-om2');
  var inAm = document.getElementById('input-am');

  if(!inMw) return;

  var els = {
    vMw: document.getElementById('val-mw'),
    vKw: document.getElementById('val-kw'),
    vSd: document.getElementById('val-sd'),
    vOm2: document.getElementById('val-om2'),
    vAm: document.getElementById('val-am'),

    outRev: document.getElementById('out-rev'),
    outGp: document.getElementById('out-gp'),
    outGpPct: document.getElementById('out-gp-pct'),
    outNp: document.getElementById('out-np'),
    outNpPct: document.getElementById('out-np-pct'),
    outSites: document.getElementById('out-sites'),
    outServiceHc: document.getElementById('out-service-hc'),
    outTotalHc: document.getElementById('out-total-hc'),
    outCogs: document.getElementById('out-cogs'),
    outReserve: document.getElementById('out-reserve'),
    outAvgPrice: document.getElementById('out-avg-price'),
    outDyStatus: document.getElementById('out-dy-status'),
    siteStatus: document.getElementById('site-status'),
    simWarning: document.getElementById('sim-warning')
  };

  function update(){
    var mw = parseFloat(inMw.value);
    var kw = parseFloat(inKw.value);
    var sd = parseFloat(inSd.value);
    var om2 = parseFloat(inOm2.value);
    var am = parseFloat(inAm.value);
    
    // Constraints: M is fixed at 15%
    if(om2 + am > 85) {
      om2 = 85 - am;
      inOm2.value = om2;
    }
    
    els.vMw.textContent = mw;
    els.vKw.textContent = kw;
    els.vSd.textContent = sd;
    els.vOm2.textContent = om2;
    els.vAm.textContent = am;

    // Derived Parameters
    var sites = Math.round((mw * 1000) / kw);
    var mPct = 15;
    var om1Pct = 100 - mPct - om2 - am;

    // Pricing & Revenue
    var avgPrice = (mPct * 15 + om1Pct * 32 + om2 * 43 + am * 35) / 100;
    var serviceRev = mw * avgPrice;
    var repairRev = sites * 4; // 4萬 / 案
    var engRev = repairRev + sd;
    var totalRev = serviceRev + engRev;

    // 人均承載 25 MW/人
    var serviceHc = Math.ceil(mw / 25.0);
    var engHc = Math.max(1, Math.ceil(engRev / 2000.0));
    var buHc = 4; // 固定管理編制
    var totalHc = serviceHc + engHc + buHc;

    // 2% 專項修繕準備金
    var reserveCost = serviceRev * 0.02;

    // 毛利率基準維持 25.0% (成本率 75.0%)
    var grossProfit = totalRev * 0.25;
    var totalCogs = totalRev * 0.75;
    var gpPct = 25.0;

    // 雙層費用：事業部 10% + 總部 5% = 淨利 10.0%
    var buExp = totalRev * 0.10;
    var corpExp = totalRev * 0.05;
    var netProfit = grossProfit - buExp - corpExp;
    var npPct = 10.0;

    // UI Updates
    els.outRev.textContent = Math.round(totalRev).toLocaleString();
    els.outGp.textContent = Math.round(grossProfit).toLocaleString();
    els.outGpPct.textContent = '毛利 (' + gpPct.toFixed(1) + '%)';
    els.outNp.textContent = Math.round(netProfit).toLocaleString();
    els.outNpPct.textContent = '稅前淨利 (' + npPct.toFixed(1) + '%)';
    
    els.outSites.textContent = sites.toLocaleString();
    els.outServiceHc.textContent = serviceHc;
    els.outTotalHc.textContent = totalHc;
    els.outCogs.textContent = Math.round(totalCogs).toLocaleString();
    els.outReserve.textContent = Math.round(reserveCost).toLocaleString();
    els.outAvgPrice.textContent = avgPrice.toFixed(2);

    // Site Size Warnings
    if(kw < 400) {
      els.siteStatus.textContent = '❌ 規模過小 (<400kW)';
      els.siteStatus.className = 'chip coral';
      els.simWarning.style.display = 'block';
      els.outDyStatus.textContent = '❌ 低於12萬成本淘汰線';
      els.outDyStatus.style.color = 'var(--coral)';
    } else if(kw > 1000) {
      els.siteStatus.textContent = '✅ 大案場優勢 (' + kw + 'kW)';
      els.siteStatus.className = 'chip green';
      els.simWarning.style.display = 'none';
      els.outDyStatus.textContent = '符合 ≥ 3.5 門檻';
      els.outDyStatus.style.color = 'var(--green)';
    } else {
      els.siteStatus.textContent = '符合 800kW 基準';
      els.siteStatus.className = 'chip blue';
      els.simWarning.style.display = 'none';
      els.outDyStatus.textContent = '符合 ≥ 3.5 門檻';
      els.outDyStatus.style.color = 'var(--green)';
    }
  }

  [inMw, inKw, inSd, inOm2, inAm].forEach(function(el){
    el.addEventListener('input', update);
  });
  update();
})();
