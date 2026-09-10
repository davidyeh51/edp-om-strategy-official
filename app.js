
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
    var m = hash.match(/^(p1|p2|p3|p4|p5)-(\d+)$/);
    if(m){
      var v=m[1], i=parseInt(m[2],10)-1;
      if(parts[v] && parts[v][i]){ state.view=v; state.idx=i; render(); return; }
    }
    if(parts[hash]){ state.view=hash; state.idx=last[hash]||0; render(); return; }
    state.view='home'; render();
  }

  function setHash(){
    var h = state.view==='home' ? '#home' : '#'+state.view+'-'+(state.idx+1);
    if(location.hash!==h) history.replaceState(null,'',h);
  }

  function move(d){
    if(state.view==='home'){
      if(d>0){ state.view='p1'; state.idx=0; render(); setHash(); }
      return;
    }
    var slides = parts[state.view];
    var n = state.idx + d, pos = order.indexOf(state.view);
    if(n < 0){
      if(pos > 0){ state.view=order[pos-1]; state.idx=parts[state.view].length-1; }
      else { state.view='home'; }
    } else if(n >= slides.length){
      if(pos < order.length-1){ state.view=order[pos+1]; state.idx=0; }
      else { state.view='home'; }
    } else {
      state.idx=n;
    }
    render(); setHash();
  }

  document.getElementById('btnPrev').addEventListener('click',function(){move(-1)});
  document.getElementById('btnNext').addEventListener('click',function(){move(1)});

  document.addEventListener('keydown',function(e){
    var t=e.target;
    if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT')) return;
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


// ================= SIMULATOR LOGIC =================
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
    outAvgPrice: document.getElementById('out-avg-price'),
    outHc: document.getElementById('out-hc'),
    outLabor: document.getElementById('out-labor'),
    outLaborPct: document.getElementById('out-labor-pct'),
    outOutsource: document.getElementById('out-outsource')
  };

  function update(){
    var mw = parseFloat(inMw.value);
    var kw = parseFloat(inKw.value);
    var sd = parseFloat(inSd.value);
    var om2 = parseFloat(inOm2.value);
    var am = parseFloat(inAm.value);
    
    // Constraints
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

    // Revenue
    var avgPrice = (mPct*15 + om1Pct*32 + om2*43 + am*35) / 100;
    var serviceRev = mw * avgPrice;
    var repairRev = sites * 4;
    var engRev = repairRev + sd;
    var totalRev = serviceRev + engRev;

    // Headcount & Labor Cost
    var serviceHc = Math.max(mw / 25, sites / 40);
    var engHc = engRev / 2000;
    var buHc = 4;
    var totalHc = Math.ceil(serviceHc + engHc + buHc);
    var laborCost = totalHc * 84; // 84萬 per person per year

    // Other Costs (System Dynamics Simulation)
    // Assume other costs scale with revenue + fixed outsourcing baseline
    var otherCost = (totalRev * 0.22) + repairRev; 
    var totalCost = laborCost + otherCost;

    var grossProfit = totalRev - totalCost;
    var gpPct = (grossProfit / totalRev) * 100;

    var buExp = totalRev * 0.10;
    var corpExp = totalRev * 0.05;
    var netProfit = grossProfit - buExp - corpExp;
    var npPct = (netProfit / totalRev) * 100;

    // Update UI
    els.outRev.textContent = Math.round(totalRev).toLocaleString();
    els.outGp.textContent = Math.round(grossProfit).toLocaleString();
    els.outGpPct.textContent = '毛利 (' + gpPct.toFixed(1) + '%)';
    els.outNp.textContent = Math.round(netProfit).toLocaleString();
    els.outNpPct.textContent = '稅前淨利 (' + npPct.toFixed(1) + '%)';
    
    els.outSites.textContent = sites.toLocaleString();
    els.outAvgPrice.textContent = avgPrice.toFixed(2);
    els.outHc.textContent = totalHc;
    els.outLabor.textContent = Math.round(laborCost).toLocaleString();
    els.outLaborPct.textContent = ((laborCost / totalRev) * 100).toFixed(1) + '%';
    els.outOutsource.textContent = Math.round(otherCost).toLocaleString();
    
    // Color coding
    els.outGp.style.color = gpPct < 20 ? 'var(--coral)' : 'var(--teal)';
    els.outNp.style.color = npPct < 5 ? 'var(--coral)' : 'var(--teal)';
  }

  [inMw, inKw, inSd, inOm2, inAm].forEach(function(el){
    el.addEventListener('input', update);
  });
  update();
})();
