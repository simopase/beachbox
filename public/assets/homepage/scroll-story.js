/* GSAP + ScrollTrigger, vendored locally. No network or scroll interception. */
(() => {
  const section = document.querySelector('.scroll-story');
  if (!section) return;
  const pin = section.querySelector('.story-pin');
  const svg = section.querySelector('.story-svg');
  const phone = section.querySelector('.story-phone');
  const tabs = [...section.querySelectorAll('[data-step]')];
  const titles = ['La pausa comincia qui.', 'Un gesto. Il posto è riconosciuto.', 'Il tuo bar si apre sul telefono.', 'L’ordine arriva. Tu resti al mare.'];
  const descriptions = [
    'Il cliente si gode la spiaggia. Il QR è già al suo posto, sotto l’ombrellone.',
    'Alza il telefono e inquadra il QR. BeachBox riconosce l’ombrellone 37, senza inserire numeri.',
    'Il menu si apre nel browser. Sceglie cosa gli va, senza scaricare app o registrarsi.',
    'Paga dal telefono. Il bar riceve la comanda e lo staff sa dove consegnare. Qui è tutto simulato.'
  ];
  const stops = [.001, .37, .72, .98];
  let selected = -1;
  let jumpTo = null;
  const select = (index) => {
    if (index === selected) return;
    selected = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    section.querySelector('#story-counter').textContent = String(index + 1).padStart(2, '0');
    section.querySelector('#story-step-title').textContent = titles[index];
    section.querySelector('#story-step-copy').textContent = descriptions[index];
    section.querySelector('#journey-panel').setAttribute('aria-labelledby', 'step-' + index);
  };
  const getPhase = (progress) => progress < .19 ? 0 : progress < .54 ? 1 : progress < .85 ? 2 : 3;
  function foregroundPose(desktop) {
    const rect = section.querySelector('.story-stage').getBoundingClientRect();
    const viewWidth = desktop ? 1200 : 630;
    const viewHeight = desktop ? 640 : 740;
    const renderScale = Math.max(rect.width / viewWidth, rect.height / viewHeight);
    const visibleHeight = rect.height / renderScale;
    const scale = Math.min(desktop ? 1.05 : 1.2, (visibleHeight - 60) / 505);
    return { x: (desktop ? 957 : 467) - 125 * scale, y: (desktop ? 320 : 390) - 242.5 * scale, scale, rotation: 0 };
  }
  function still(index) {
    const mobile = matchMedia('(max-width: 700px)').matches;
    section.classList.add('story-no-motion');
    svg.setAttribute('viewBox', mobile ? '130 20 630 740' : '0 0 1200 640');
    const foreground = foregroundPose(!mobile);
    const largePose = `translate(${foreground.x} ${foreground.y}) scale(${foreground.scale})`;
    const poses = ['translate(354 340) rotate(-14) scale(.25)', 'translate(443 275) rotate(3) scale(.4)', largePose, largePose];
    phone.style.transform = '';
    phone.setAttribute('transform', poses[index]);
    section.querySelector('.story-forearm').setAttribute('d', index === 0 ? 'M333 383Q353 403 395 419' : 'M333 383Q386 411 459 407');
    section.querySelector('.story-hand').setAttribute('transform', index === 0 ? '' : 'translate(64 -12)');
    ['lock', 'camera', 'app', 'paid'].forEach((name, i) => {
      section.querySelector('.story-' + name).style.opacity = i === index ? '1' : '0';
    });
    section.querySelector('.story-world').style.opacity = index >= 2 ? '.5' : '1';
    section.querySelector('.story-qr-halo').style.opacity = index === 1 ? '1' : '0';
    section.querySelector('.story-found').style.opacity = '1';
    section.querySelector('.story-order-notice').style.opacity = index === 3 && !mobile ? '1' : '0';
    section.querySelector('.story-progress span').style.transform = 'scaleX(' + stops[index] + ')';
    select(index);
  }
  function activate(index) {
    if (jumpTo) jumpTo(index);
    else still(index);
  }
  tabs.forEach((tab) => tab.addEventListener('click', () => activate(Number(tab.dataset.step))));
  // Uses the same roving tab keyboard behavior as the existing plans.
  tabKeyboard(section.querySelector('.story-tabs'), '[data-step]', tab => activate(Number(tab.dataset.step)));
  select(0);
  if (!window.gsap || !window.ScrollTrigger) { still(0); return; }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const media = gsap.matchMedia();
  media.add({
    motion: '(prefers-reduced-motion: no-preference)',
    desktop: '(min-width: 701px)',
    tall: '(min-height: 600px)'
  }, context => {
    const { motion, desktop, tall } = context.conditions;
    jumpTo = null;
    if (!motion) { still(Math.max(selected, 0)); return; }
    section.classList.remove('story-no-motion');
    svg.setAttribute('viewBox', desktop ? '0 0 1200 640' : '130 20 630 740');
    // Reset fallback styles before creating a new responsive timeline.
    section.querySelectorAll('.story-world, .story-qr-halo, .story-lock, .story-camera, .story-app, .story-paid, .story-found, .story-order-notice').forEach(el => el.style.opacity = '');
    section.querySelector('.story-hand').removeAttribute('transform');
    // Render SVG transforms explicitly; foreignObject must not affect origins.
    const initialPose = { x: 354, y: 340, scale: .25, rotation: -14 };
    const scanPose = { x: 443, y: 275, scale: .4, rotation: 3 };
    const ease = gsap.parseEase('power2.inOut');
    const interpolatePose = (from, to, progress) => Object.fromEntries(Object.keys(from).map(key => [key, from[key] + (to[key] - from[key]) * progress]));
    const drawPhone = time => {
      let pose = initialPose;
      if (time >= 4.15) pose = interpolatePose(scanPose, foregroundPose(desktop), ease(Math.min(1, (time - 4.15) / 1.9)));
      else if (time >= .65) pose = interpolatePose(initialPose, scanPose, ease(Math.min(1, (time - .65) / 1.5)));
      phone.setAttribute('transform', `translate(${pose.x} ${pose.y}) rotate(${pose.rotation}) scale(${pose.scale})`);
    };
    phone.style.transform = '';
    drawPhone(0);
    gsap.set('.story-forearm', { attr: { d: 'M333 383Q353 403 395 419' } });
    gsap.set('.story-hand', { x: 0, y: 0 });
    gsap.set('.story-world', { opacity: 1, x: 0, scale: 1 });
    gsap.set('.story-lock', { opacity: 1 });
    gsap.set('.story-camera, .story-app, .story-paid, .story-qr-halo, .story-found, .story-order-notice', { opacity: 0 });
    gsap.set('.story-scan-line', { y: 0 });
    const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
    timeline.to('.story-forearm', { attr: { d: 'M333 383Q386 411 459 407' }, duration: 1.5, ease: 'power2.inOut' }, .65)
      .to('.story-hand', { x: 64, y: -12, duration: 1.5, ease: 'power2.inOut' }, .65)
      .to('.story-lock', { opacity: 0, duration: .3 }, 1.6)
      .to('.story-camera', { opacity: 1, duration: .3 }, 1.6)
      .to('.story-scan-line', { y: 170, duration: 1.25 }, 2.15)
      .to('.story-qr-halo', { opacity: 1, duration: .3 }, 2.45)
      .to('.story-found', { opacity: 1, duration: .3 }, 3.4)
      .to('.story-qr-halo', { opacity: 0, duration: .4 }, 4.25)
      .to('.story-world', { opacity: desktop ? .65 : .24, x: desktop ? -75 : -35, duration: 1.9, ease: 'power2.inOut' }, 4.15)
      .to('.story-camera', { opacity: 0, duration: .55 }, 4.5)
      .to('.story-app', { opacity: 1, duration: .55 }, 4.65)
      .fromTo('.story-app-item', { y: 12, opacity: 0 }, { y: 0, opacity: 1, stagger: .15, duration: .6, ease: 'power2.out' }, 5.15)
      .to('.story-app', { opacity: 0, duration: .5 }, 7.7)
      .to('.story-paid', { opacity: 1, duration: .5 }, 7.85)
      .to('.story-order-notice', { opacity: desktop ? 1 : 0, y: -12, duration: .5, ease: 'power2.out' }, 8.2)
      .to({}, { duration: .9 }, 8.6);
    timeline.eventCallback('onUpdate', () => drawPhone(timeline.time()));
    const canPin = tall && pin.offsetHeight <= innerHeight - 24;
    const trigger = ScrollTrigger.create({
      id: 'beachbox-story',
      trigger: pin,
      start: canPin ? 'top top+=12' : 'top center',
      end: () => '+=' + (canPin ? Math.round(innerHeight * (desktop ? 2.7 : 2.25)) : 700),
      pin: canPin,
      pinSpacing: true,
      animation: timeline,
      scrub: .55,
      // Geometry is recalculated by drawPhone; keep tween start values stable.
      invalidateOnRefresh: false,
      onRefresh: () => drawPhone(timeline.time()),
      onUpdate: self => {
        drawPhone(timeline.time());
        select(getPhase(self.progress));
        section.querySelector('.story-progress span').style.transform = 'scaleX(' + self.progress + ')';
      }
    });
    jumpTo = index => {
      const progress = stops[index];
      // Jump directly for controls; wheel and touch scrolling still scrub naturally.
      const html = document.documentElement;
      const previousBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      trigger.scroll(Math.round(trigger.start + (trigger.end - trigger.start) * progress));
      html.style.scrollBehavior = previousBehavior;
      trigger.update(true);
      trigger.getTween()?.progress(1);
      timeline.progress(progress);
      drawPhone(timeline.time());
      select(index);
    };
    return () => { jumpTo = null; };
  });
  // Images and local fonts can finish after the initial measurements.
  const refresh = () => ScrollTrigger.refresh();
  if (document.readyState === 'complete') refresh();
  else window.addEventListener('load', refresh, { once: true });
  document.fonts?.ready.then(refresh);
})();
