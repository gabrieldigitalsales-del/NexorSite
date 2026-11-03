"use strict";
const toggle = document.getElementById('menuToggle');
const mobile = document.getElementById('mobileNav');
function closeMenu(){mobile.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');}
toggle.addEventListener('click',()=>{const opening=mobile.hidden;mobile.hidden=!opening;toggle.setAttribute('aria-expanded',String(opening));toggle.setAttribute('aria-label',opening?'Fechar menu':'Abrir menu');});
mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobile.hidden){closeMenu();toggle.focus();}});
const showMore = document.getElementById('showMorePackages');
const more = document.getElementById('morePackages');
showMore.addEventListener('click',()=>{const expanded=showMore.getAttribute('aria-expanded')==='true';more.hidden=expanded;showMore.setAttribute('aria-expanded',String(!expanded));showMore.querySelector('span:first-child').textContent=expanded?'Conhecer os outros três formatos':'Ocultar os três formatos adicionais';showMore.querySelector('.reveal-symbol').textContent=expanded?'+':'−';});

// Remove a tela de abertura ao terminar o carregamento, com fallback caso algum recurso externo demore.
(() => {
  const splash = document.getElementById('nexorLoader');
  if (!splash) return;
  const began = performance.now();
  let removed = false;
  function dismiss() {
    if (removed) return;
    removed = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = reduced ? 0 : Math.max(0, 850 - (performance.now() - began));
    window.setTimeout(() => {
      splash.classList.add('is-hidden');
      splash.setAttribute('aria-hidden','true');
      window.setTimeout(() => splash.remove(), reduced ? 0 : 900);
    }, delay);
  }
  if (document.readyState === 'complete') dismiss();
  else window.addEventListener('load', dismiss, {once:true});
  window.setTimeout(dismiss, 2200);
})();


// Cards de processo: rolagem automática contínua, com arraste pelo mouse ou toque.
// Em movimento reduzido, os cards são exibidos sem animação e continuam acessíveis.
(() => {
  const viewport = document.querySelector('.process-carousel');
  const track = viewport?.querySelector('.steps');
  if (!viewport || !track) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const originals = Array.from(track.children);
  if (!originals.length) return;
  let offset = 0, width = 1, last = 0, dragging = false, dragStartX = 0, dragStartOffset = 0, frame = 0;
  let focused = false, inView = true;
  function size() {
    // A segunda cópia começa exatamente uma volta depois da primeira.
    width = track.children[originals.length]?.offsetLeft - originals[0].offsetLeft || 1;
    offset = ((offset % width) + width) % width;
    paint();
  }
  function paint() { track.style.transform = `translate3d(${-offset}px,0,0)`; }
  if (!reduced.matches) {
    originals.forEach((el) => {
      const clone = el.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('inert', '');
      track.appendChild(clone);
    });
  }
  const normalize = n => ((n % width) + width) % width;
  function tick(now) {
    if (last && !dragging && !focused && inView && !reduced.matches) {
      offset = normalize(offset + Math.min(now - last, 40) * 0.035);
      paint();
    }
    last = now;
    frame = requestAnimationFrame(tick);
  }
  viewport.addEventListener('pointerdown', e => {
    if (reduced.matches || e.button !== 0) return;
    dragging = true; dragStartX = e.clientX; dragStartOffset = offset;
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener('pointermove', e => {
    if (!dragging) return;
    offset = normalize(dragStartOffset - (e.clientX - dragStartX));
    paint();
  });
  function endDrag() { dragging = false; viewport.classList.remove('is-dragging'); }
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('lostpointercapture', endDrag);
  viewport.addEventListener('focusin', () => focused = true);
  viewport.addEventListener('focusout', e => { if (!viewport.contains(e.relatedTarget)) focused = false; });
  viewport.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault(); offset = normalize(offset + (e.key === 'ArrowRight' ? 180 : -180)); paint();
  });
  viewport.tabIndex = 0;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { inView = entries[0].isIntersecting; }, {threshold:.01}).observe(viewport);
  }
  window.addEventListener('resize', size, {passive:true});
  if (document.fonts?.ready) document.fonts.ready.then(size);
  size(); frame = requestAnimationFrame(tick);
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame), {once:true});
})();

// Revelações sutis nas seções, fotografias e demais cartões.
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return;
  const elements = document.querySelectorAll('.section-heading, .about-layout, .wide-portrait, .package, .service-card, .system-prices article, .offer, .ending h2');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {threshold:0.06, rootMargin:'0px 0px 65px 0px'});
  elements.forEach(el => {el.classList.add('motion-reveal');observer.observe(el);});
  document.documentElement.classList.add('js-motion');
})();
