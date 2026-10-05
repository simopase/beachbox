/* Progressive enhancement: every section is usable before animation loads. */
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  const title = document.querySelector('#manifesto-title');
  // Keep one coherent accessible heading while animating individual visual words.
  const titleLabel = title.textContent;
  const originalTitle = title.innerHTML;
  media.add('(prefers-reduced-motion: no-preference)', () => {
    title.setAttribute('aria-label', titleLabel);
    title.innerHTML = '<span aria-hidden="true">' + originalTitle.replace(/([^<>\s]+)(?=[^<>]*(?:<|$))/g, '<span class="word">$1</span>') + '</span>';
    if (scrollY < 100) {
      gsap.from('.scene-caption > *', { opacity: 0, y: 26, duration: .9, delay: .25, stagger: .15, ease: 'power3.out' });
    }
    gsap.fromTo('.hero-scene', { clipPath: 'inset(0 3% 0 3%)' }, { clipPath: 'inset(0 0% 0 0%)', ease: 'none', scrollTrigger: { trigger: '.hero-scene', start: 'top 90%', end: 'top 15%', scrub: .8 } });
    gsap.fromTo('.hero-photo', { yPercent: -3, scale: 1.08 }, { yPercent: 3, scale: 1, ease: 'none', scrollTrigger: { trigger: '.hero-scene', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    gsap.fromTo('.hero-menu', { rotation: 7, y: 25 }, { rotation: -3, y: -15, ease: 'none', scrollTrigger: { trigger: '.hero-scene', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    gsap.to('.ribbon-track', { xPercent: -24, ease: 'none', scrollTrigger: { trigger: '.summer-ribbon', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    gsap.fromTo(title.querySelectorAll('.word'), { color: '#b0aaa0' }, { color: '#0d2d4a', stagger: .15, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top 72%', end: 'bottom 65%', scrub: .6 } });
    gsap.to('.manifesto-asterisk', { rotation: 120, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    gsap.from('.benefit-arrow', { rotation: 0, x: -35, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.benefits', start: 'top 75%', once: true } });
    const revealGroups = ['.benefit-list > div', '.operations-head > *', '.calculator > div', '.setup-list > div', '.pricing .section-heading', '.pricing-layout', '.faq > div'];
    revealGroups.forEach(selector => {
      gsap.from(selector, { y: 32, opacity: 0, duration: .8, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: selector, start: 'top 92%', once: true } });
    });
    gsap.from('.dashboard', { y: 50, scale: .97, opacity: .5, ease: 'none', scrollTrigger: { trigger: '.dashboard', start: 'top 95%', end: 'top 52%', scrub: .8 } });
    gsap.to('.reading-progress span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2 } });
    return () => { title.innerHTML = originalTitle; title.removeAttribute('aria-label'); };
  });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
})();
