
(function(){
  var parts = {
    p1: [].slice.call(document.querySelectorAll('#view-p1 .slide')),
    p2: [].slice.call(document.querySelectorAll('#view-p2 .slide')),
    p3: [].slice.call(document.querySelectorAll('#view-p3 .slide'))
  };
  var order = ['p1','p2','p3'];
  var state = { view:'home', idx:0 };
  var last = { p1:0, p2:0, p3:0 };
  var views = {
    home: document.getElementById('view-home'),
    p1: document.getElementById('view-p1'),
    p2: document.getElementById('view-p2'),
    p3: document.getElementById('view-p3')
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
    var m = hash.match(/^(p1|p2|p3)-(\d+)$/);
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
