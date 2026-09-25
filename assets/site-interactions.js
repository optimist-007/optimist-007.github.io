(()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('has-site-interactions');

  const revealSelector=[
    '.hero-copy','.hero-art','.academic-profile','.focus-heading','.research-flow',
    '.question-grid article','.page-hero > *','.thinking-intro','.thought',
    '.project-card','.blog-card','.pub','.direction-item','.media-card',
    '.case-step','.project-facts','.project-question .wrap','.project-proof .wrap',
    '.project-evidence .wrap'
  ].join(',');

  let revealObserver=null;
  if(!reduced && 'IntersectionObserver' in window){
    revealObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:'0px 0px -4% 0px'});
  }

  function registerReveal(root=document){
    root.querySelectorAll?.(revealSelector).forEach((el,i)=>{
      if(el.dataset.revealReady)return;
      el.dataset.revealReady='1';
      el.style.setProperty('--reveal-delay',Math.min((i%6)*55,275)+'ms');
      if(reduced || !revealObserver) el.classList.add('in-view');
      else revealObserver.observe(el);
    });
  }
  registerReveal();

  if('MutationObserver' in window){
    const mo=new MutationObserver(records=>{
      records.forEach(r=>r.addedNodes.forEach(n=>{
        if(n.nodeType===1){
          if(n.matches?.(revealSelector)) registerReveal(n.parentElement||document);
          else registerReveal(n);
        }
      }));
    });
    mo.observe(document.body,{childList:true,subtree:true});
  }

  const hero=document.querySelector('.hero-art');
  if(hero && !reduced && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    let frame=0;
    hero.addEventListener('pointermove',e=>{
      const rect=hero.getBoundingClientRect();
      const x=(e.clientX-rect.left)/rect.width-.5;
      const y=(e.clientY-rect.top)/rect.height-.5;
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        hero.style.setProperty('--tilt-x',(x*4.5).toFixed(2)+'deg');
        hero.style.setProperty('--tilt-y',(-y*4.5).toFixed(2)+'deg');
        hero.style.setProperty('--shift-x',(x*12).toFixed(1)+'px');
        hero.style.setProperty('--shift-y',(y*12).toFixed(1)+'px');
      });
    });
    hero.addEventListener('pointerleave',()=>{
      hero.style.setProperty('--tilt-x','0deg');
      hero.style.setProperty('--tilt-y','0deg');
      hero.style.setProperty('--shift-x','0px');
      hero.style.setProperty('--shift-y','0px');
    });
  }

  document.addEventListener('click',e=>{
    const mode=e.target.closest?.('[data-hero-mode]');
    if(mode && hero){
      const active=mode.dataset.heroMode;
      hero.dataset.mode=active;
      hero.querySelectorAll('[data-hero-mode]').forEach(x=>x.setAttribute('aria-pressed',x===mode?'true':'false'));
      const captions={
        material:'composition / synthesis / structure',
        interface:'boundaries / transfer / retention',
        device:'response / measurement / function'
      };
      const caption=hero.querySelector('.art-caption');
      if(caption)caption.textContent=captions[active]||'structure / response / useful function';
    }

    const flow=e.target.closest?.('.flow-node[data-stage]');
    if(flow){
      const host=document.querySelector('.research-flow');
      const panel=document.querySelector('.flow-detail');
      if(!host||!panel)return;
      host.querySelectorAll('.flow-node').forEach(n=>n.setAttribute('aria-pressed',n===flow?'true':'false'));
      host.dataset.active=flow.dataset.stage||'';
      const title=panel.querySelector('strong');
      const copy=panel.querySelector('p');
      if(title)title.textContent=flow.dataset.title||'';
      if(copy)copy.textContent=flow.dataset.detail||'';
      panel.classList.remove('flow-detail-pulse');
      void panel.offsetWidth;
      panel.classList.add('flow-detail-pulse');
    }

    const img=e.target.closest?.('.media-card img');
    if(img){
      const overlay=document.createElement('div');
      overlay.className='media-lightbox';
      overlay.setAttribute('role','dialog');
      overlay.setAttribute('aria-modal','true');
      overlay.setAttribute('aria-label',img.alt||'Media preview');
      overlay.innerHTML='<button type="button" class="media-lightbox-close" aria-label="Close preview">×</button><img alt=""><p></p>';
      const big=overlay.querySelector('img');
      big.src=img.currentSrc||img.src;
      big.alt=img.alt||'Media preview';
      const caption=img.closest('.media-card')?.querySelector('p,h3')?.textContent||'';
      overlay.querySelector('p').textContent=caption;
      document.body.appendChild(overlay);
      document.body.classList.add('lightbox-open');
      const close=()=>{overlay.remove();document.body.classList.remove('lightbox-open');document.removeEventListener('keydown',onKey)};
      const onKey=ev=>{if(ev.key==='Escape')close()};
      overlay.querySelector('button').focus();
      overlay.addEventListener('click',ev=>{if(ev.target===overlay||ev.target.closest('.media-lightbox-close'))close()});
      document.addEventListener('keydown',onKey);
    }
  });

  const progress=document.createElement('div');
  progress.className='site-scroll-progress';
  progress.setAttribute('aria-hidden','true');
  document.body.appendChild(progress);
  let scrollFrame=0;
  const updateProgress=()=>{
    scrollFrame=0;
    const max=document.documentElement.scrollHeight-innerHeight;
    const ratio=max>0?Math.min(1,Math.max(0,scrollY/max)):0;
    progress.style.transform='scaleX('+ratio+')';
  };
  addEventListener('scroll',()=>{
    if(!scrollFrame)scrollFrame=requestAnimationFrame(updateProgress);
  },{passive:true});
  updateProgress();
})();