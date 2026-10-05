(() => {
  const $ = id => document.getElementById(id);
  const story = $('story'), stage = $('stage'), photo = $('photo'), photoImg = $('photoImg');
  const umbrella = $('umbrella'), phone = $('phone'), scanbar = $('scanbar');
  const views = [$('camera'), $('menuView'), $('cartView'), $('successView')];
  const controls = [...document.querySelectorAll('[data-step]')];
  const states = [
    ['01 · Scansiona', 'Un QR per ogni ombrellone.', 'Il cliente resta comodamente al proprio posto e inquadra il QR associato alla sua postazione.'],
    ['02 · Accedi', 'Il menu si apre subito.', 'Nessuna app da installare. Il QR riconosce l’ombrellone e apre il menu dello stabilimento.'],
    ['03 · Scegli', 'Tutto il menu, nel palmo della mano.', 'Drink, snack e piatti: scegli quello che ti va e aggiungilo al tuo ordine.'],
    ['04 · Ordina', 'Pochi tocchi. E arriva al bar.', 'Controlla il carrello e conferma. Lo staff sa già a quale ombrellone portare tutto.'],
    ['05 · Rilassati', 'Adesso pensa a tutto lo staff.', 'Niente code, niente avanti e indietro. Il tuo ordine arriva direttamente sotto l’ombrellone.']
  ];
  const clamp = v => Math.max(0, Math.min(1, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t * t * (3 - 2 * t);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const preview = new URLSearchParams(location.search).has('preview');
  if (preview) document.body.classList.add('preview');
  let selected = 0, last = -1, pending = false;

  function update() {
    const width = innerWidth, height = stage.clientHeight, mobile = width < 900;
    const rect = story.getBoundingClientRect();
    const p = preview ? 0 : reduced.matches ? selected / 4 : clamp(-rect.top / Math.max(1, story.offsetHeight - height));
    const idx = reduced.matches ? selected : Math.min(4, Math.floor(p * 5));
    const clean = p >= .35;
    stage.classList.toggle('is-clean', clean);
    if (idx !== last) {
      last = idx;
      $('step').textContent = states[idx][0]; $('title').textContent = states[idx][1]; $('text').textContent = states[idx][2];
      $('counter').textContent = `0${idx + 1} / 05`;
      controls.forEach((button, i) => {
        if (i === idx) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
        button.tabIndex = i === idx ? 0 : -1;
      });
    }
    $('track').style.transform = `scaleX(${p})`;
    const out = ease(clamp((p - .25) / .12));
    photo.style.opacity = String(1 - out);
    photoImg.style.transform = `scale(${lerp(1.015, 1.045, reduced.matches ? 0 : clamp(p / .3))})`;
    umbrella.style.opacity = String(1 - out);
    umbrella.style.visibility = out === 1 ? 'hidden' : 'visible';
    $('sceneNote').style.opacity = String(1 - out);
    $('sceneNote').style.visibility = out === 1 ? 'hidden' : 'visible';
    scanbar.style.opacity = String(clamp((p - .02) / .025) * (1 - clamp((p - .19) / .035)));
    scanbar.style.top = `${lerp(38, 74, clamp(p / .17))}%`;

    const approach = ease(clamp(p / .18)), zoom = ease(clamp((p - .19) / .19));
    const sceneRect = umbrella.getBoundingClientRect();
    const qrX = (sceneRect.left + sceneRect.width * .51) / width * 100;
    const qrY = (sceneRect.top + sceneRect.height * .535) / height * 100;
    const copyBottom = $('copy').getBoundingClientRect().bottom - stage.getBoundingClientRect().top;
    const safeTop = mobile ? Math.max(copyBottom + 26, height * .30) : 42;
    const safeBottom = height - (mobile ? 58 : 85);
    const available = Math.max(190, safeBottom - safeTop);
    const fullScale = Math.min(mobile ? .91 : 1, available / 616, (width - 42) / 326);
    const finalY = mobile ? (safeTop + safeBottom) / 2 / height * 100 : 49;
    const startX = mobile ? 83 : 65, startY = mobile ? 78 : 64;
    const left = lerp(lerp(startX, qrX + (mobile ? 8 : 3), approach), mobile ? 50 : 70, zoom);
    const top = lerp(lerp(startY, qrY + 3, approach), finalY, zoom);
    const scale = lerp(lerp(mobile ? .31 : .39, mobile ? .39 : .44, approach), fullScale, zoom);
    const rotate = reduced.matches ? 0 : lerp(lerp(-10, -3, approach), 0, zoom);
    phone.style.left = `${left}%`; phone.style.top = `${top}%`;
    phone.style.transform = `translate(-50%,-50%) scale(${scale}) rotate(${rotate}deg)`;

    let active = p < .22 ? 0 : p < .6 ? 1 : p < .8 ? 2 : 3;
    views.forEach((el, i) => { el.classList.toggle('is-active', i === active); el.style.opacity = i === active ? '1' : '0'; el.setAttribute('aria-hidden', String(i !== active)); if ('inert' in el) el.inert = i !== active; });
    phone.classList.toggle('is-camera', active === 0);
  }

  function selectStep(index, focus = false) {
    selected = index;
    if (reduced.matches) update();
    else {
      const y = story.getBoundingClientRect().top + scrollY + (story.offsetHeight - stage.clientHeight) * (index === 0 ? 0 : index / 5 + .04);
      scrollTo({ top: y, behavior: 'instant' }); update();
    }
    if (focus) controls[index].focus({ preventScroll: true });
  }
  controls.forEach((button, i) => {
    button.addEventListener('click', () => selectStep(i));
    button.addEventListener('keydown', e => {
      let target;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') target = (i + 1) % 5;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') target = (i + 4) % 5;
      if (e.key === 'Home') target = 0;
      if (e.key === 'End') target = 4;
      if (target !== undefined) { e.preventDefault(); selectStep(target, true); }
    });
  });
  document.querySelectorAll('.cat').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.cat').forEach(el => { el.classList.toggle('active', el === button); el.setAttribute('aria-pressed', String(el === button)); });
    document.querySelectorAll('.product').forEach(el => { el.hidden = button.dataset.category !== 'all' && el.dataset.category !== button.dataset.category; });
  }));
  // The phone is a narrated preview. Its controls jump to the matching story step.
  document.querySelectorAll('.add,.phone-cart').forEach(button => button.addEventListener('click', () => selectStep(3)));
  $('orderButton').addEventListener('click', () => selectStep(4));
  $('backToMenu').addEventListener('click', () => selectStep(2));
  addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(() => { update(); pending = false; }); } }, { passive: true });
  addEventListener('resize', update);
  function motionChange() { document.body.classList.toggle('reduced', reduced.matches && !preview); last = -1; update(); }
  reduced.addEventListener('change', motionChange);
  document.fonts.ready.then(update);
  motionChange();
})();
