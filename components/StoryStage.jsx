'use client';

/* Port di scroll.js: la scena risponde allo scroll, senza intercettarlo. */
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import QrImage from './QrImage';

const states = [
  ['01 · Scansiona', 'Un QR per ogni ombrellone.', 'Il cliente resta comodamente al proprio posto e inquadra il QR associato alla sua postazione.'],
  ['02 · Accedi', 'Il menu si apre subito.', 'Nessuna app da installare. Il QR riconosce l’ombrellone e apre il menu dello stabilimento.'],
  ['03 · Scegli', 'Tutto il menu, nel palmo della mano.', 'Drink, snack e piatti: scegli quello che ti va e aggiungilo al tuo ordine.'],
  ['04 · Ordina', 'Pochi tocchi. E arriva al bar.', 'Controlla il carrello e conferma. Lo staff sa già a quale ombrellone portare tutto.'],
  ['05 · Rilassati', 'Adesso pensa a tutto lo staff.', 'Niente code, niente avanti e indietro. Il tuo ordine arriva direttamente sotto l’ombrellone.'],
];

const clamp = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => t * t * (3 - 2 * t);

export const DEMO_HREF = '/menu-demo?ombrellone=24';

export default function StoryStage() {
  const root = useRef(null);
  const phoneViewRefs = useRef({});

  const setView = (name) => (el) => {
    phoneViewRefs.current[name] = el;
  };

  useEffect(() => {
    const $ = (id) => root.current.querySelector(`#${id}`);
    const story = root.current;
    const stage = $('stage'), photo = $('photo'), photoImg = $('photoImg');
    const umbrella = $('umbrella'), phone = $('phone'), scanbar = $('scanbar');
    const views = [$('camera'), $('menuView'), $('cartView'), $('successView')];
    const controls = [...story.querySelectorAll('[data-step]')];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const preview = new URLSearchParams(location.search).has('preview');
    if (preview) document.body.classList.add('preview');
    let selected = 0, last = -1, pending = false, raf = 0;

    function update() {
      const width = innerWidth, height = stage.clientHeight, mobile = width < 900;
      const rect = story.getBoundingClientRect();
      const p = preview ? 0 : reduced.matches ? selected / 4 : clamp(-rect.top / Math.max(1, story.offsetHeight - height));
      const idx = reduced.matches ? selected : Math.min(4, Math.floor(p * 5));
      const clean = p >= 0.35;
      stage.classList.toggle('is-clean', clean);
      if (idx !== last) {
        last = idx;
        $('step').textContent = states[idx][0];
        $('title').textContent = states[idx][1];
        $('text').textContent = states[idx][2];
        $('counter').textContent = `0${idx + 1} / 05`;
        controls.forEach((button, i) => {
          if (i === idx) button.setAttribute('aria-current', 'step');
          else button.removeAttribute('aria-current');
          button.tabIndex = i === idx ? 0 : -1;
        });
      }
      $('track').style.transform = `scaleX(${p})`;
      const out = ease(clamp((p - 0.25) / 0.12));
      photo.style.opacity = String(1 - out);
      photoImg.style.transform = `scale(${lerp(1.015, 1.045, reduced.matches ? 0 : clamp(p / 0.3))})`;
      umbrella.style.opacity = String(1 - out);
      umbrella.style.visibility = out === 1 ? 'hidden' : 'visible';
      $('sceneNote').style.opacity = String(1 - out);
      $('sceneNote').style.visibility = out === 1 ? 'hidden' : 'visible';
      scanbar.style.opacity = String(clamp((p - 0.02) / 0.025) * (1 - clamp((p - 0.19) / 0.035)));
      scanbar.style.top = `${lerp(38, 74, clamp(p / 0.17))}%`;

      const approach = ease(clamp(p / 0.18)), zoom = ease(clamp((p - 0.19) / 0.19));
      const sceneRect = umbrella.getBoundingClientRect();
      const qrX = (sceneRect.left + sceneRect.width * 0.51) / width * 100;
      const qrY = (sceneRect.top + sceneRect.height * 0.535) / height * 100;
      const copyBottom = $('copy').getBoundingClientRect().bottom - stage.getBoundingClientRect().top;
      const safeTop = mobile ? Math.max(copyBottom + 26, height * 0.3) : 42;
      const safeBottom = height - (mobile ? 58 : 85);
      const available = Math.max(190, safeBottom - safeTop);
      const fullScale = Math.min(mobile ? 0.91 : 1, available / 616, (width - 42) / 326);
      const finalY = mobile ? ((safeTop + safeBottom) / 2 / height) * 100 : 49;
      const startX = mobile ? 83 : 65, startY = mobile ? 78 : 64;
      const left = lerp(lerp(startX, qrX + (mobile ? 8 : 3), approach), mobile ? 50 : 70, zoom);
      const top = lerp(lerp(startY, qrY + 3, approach), finalY, zoom);
      const scale = lerp(lerp(mobile ? 0.31 : 0.39, mobile ? 0.39 : 0.44, approach), fullScale, zoom);
      const rotate = reduced.matches ? 0 : lerp(lerp(-10, -3, approach), 0, zoom);
      phone.style.left = `${left}%`;
      phone.style.top = `${top}%`;
      phone.style.transform = `translate(-50%,-50%) scale(${scale}) rotate(${rotate}deg)`;

      const active = p < 0.22 ? 0 : p < 0.6 ? 1 : p < 0.8 ? 2 : 3;
      views.forEach((el, i) => {
        el.classList.toggle('is-active', i === active);
        el.style.opacity = i === active ? '1' : '0';
        el.setAttribute('aria-hidden', String(i !== active));
        if ('inert' in el) el.inert = i !== active;
      });
      phone.classList.toggle('is-camera', active === 0);
    }

    function selectStep(index, focus = false) {
      selected = index;
      if (reduced.matches) update();
      else {
        const y = story.getBoundingClientRect().top + scrollY + (story.offsetHeight - stage.clientHeight) * (index === 0 ? 0 : index / 5 + 0.04);
        scrollTo({ top: y, behavior: 'instant' });
        update();
      }
      if (focus) controls[index].focus({ preventScroll: true });
    }

    const controlHandlers = controls.map((button, i) => {
      const onClick = () => selectStep(i);
      const onKeydown = (e) => {
        let target;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') target = (i + 1) % 5;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') target = (i + 4) % 5;
        if (e.key === 'Home') target = 0;
        if (e.key === 'End') target = 4;
        if (target !== undefined) {
          e.preventDefault();
          selectStep(target, true);
        }
      };
      button.addEventListener('click', onClick);
      button.addEventListener('keydown', onKeydown);
      return () => {
        button.removeEventListener('click', onClick);
        button.removeEventListener('keydown', onKeydown);
      };
    });

    const jumpHandlers = [];
    story.querySelectorAll('.add,.phone-cart').forEach((button) => {
      const handler = () => selectStep(3);
      button.addEventListener('click', handler);
      jumpHandlers.push(() => button.removeEventListener('click', handler));
    });
    const orderHandler = () => selectStep(4);
    const backHandler = () => selectStep(2);
    $('orderButton').addEventListener('click', orderHandler);
    $('backToMenu').addEventListener('click', backHandler);

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      }
    };
    const onResize = () => update();
    const motionChange = () => {
      document.body.classList.toggle('reduced', reduced.matches && !preview);
      last = -1;
      update();
    };

    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    reduced.addEventListener('change', motionChange);
    const fontsDone = document.fonts?.ready.then(update);
    motionChange();

    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onResize);
      reduced.removeEventListener('change', motionChange);
      controlHandlers.forEach((off) => off());
      jumpHandlers.forEach((off) => off());
      $('orderButton').removeEventListener('click', orderHandler);
      $('backToMenu').removeEventListener('click', backHandler);
      cancelAnimationFrame(raf);
      document.body.classList.remove('preview', 'reduced');
      fontsDone?.cancel?.();
    };
  }, []);

  const products = [
    {
      category: 'drink', name: 'Spritz', price: '€ 6,00',
      art: '<ellipse cx="60" cy="74" rx="23" ry="6" fill="#bd7848" opacity=".14"/><path d="M46 26H75L72 44Q69 55 60 55Q50 55 47 44Z" fill="#ee7d28" stroke="#fff9e8" stroke-width="2"/><path d="M49 28H72L70 38H50Z" fill="#ffbc6b"/><path d="M60 55V72M48 73H72" stroke="#ad7350" stroke-width="2" stroke-linecap="round"/><circle cx="75" cy="28" r="9" fill="#f6ae36" stroke="#ffda85" stroke-width="2"/><path d="M75 20V36M68 28H83M69 23L81 33M69 33L81 23" stroke="#ffda85" stroke-width="1"/><path d="M55 20L61 40" stroke="#fff" stroke-width="2" opacity=".75"/>',
    },
    {
      category: 'food', name: 'Toast', price: '€ 7,50',
      art: '<ellipse cx="60" cy="73" rx="31" ry="6" fill="#b27e38" opacity=".15"/><path d="M31 38L57 22L89 40L61 61Z" fill="#e9ad59"/><path d="M31 43L61 67L89 47V58L61 76L31 53Z" fill="#d39042"/><path d="M31 41L61 61L89 44L86 53L61 70L34 50Z" fill="#f5cd68"/><path d="M32 42L60 62L87 45" stroke="#658345" stroke-width="5" stroke-linecap="round"/><path d="M31 36L58 20L90 38L61 57Z" fill="#efc37f" stroke="#d89743" stroke-width="3"/><path d="M47 34L67 47M53 30L74 43M60 27L81 40" stroke="#c98c43" stroke-width="2" stroke-linecap="round"/>',
    },
    {
      category: 'drink', name: 'Acqua', price: '€ 2,00',
      art: '<ellipse cx="60" cy="76" rx="20" ry="5" fill="#679ba6" opacity=".13"/><path d="M52 25H68V35L74 43V70Q60 76 46 70V43L52 35Z" fill="#b3dfe9" stroke="#77b6c5" stroke-width="2"/><rect x="51" y="18" width="18" height="9" rx="3" fill="#246184"/><path d="M46 49H74V63H46Z" fill="#fffaf0"/><path d="M52 56H68" stroke="#88bdcb" stroke-width="2"/><path d="M51 42V46M51 66V69" stroke="white" stroke-width="3" stroke-linecap="round"/>',
    },
    {
      category: 'drink', name: 'Cola', price: '€ 3,00',
      art: '<ellipse cx="60" cy="76" rx="21" ry="5" fill="#a7533b" opacity=".13"/><rect x="43" y="22" width="34" height="53" rx="7" fill="#cb5a3b"/><ellipse cx="60" cy="23" rx="17" ry="4" fill="#c6c6bc"/><ellipse cx="60" cy="23" rx="7" ry="2" fill="#7e898c"/><path d="M50 29V65" stroke="#f69d77" stroke-width="3" stroke-linecap="round"/><path d="M48 54Q55 42 69 48" stroke="#fff5e9" stroke-width="3" stroke-linecap="round"/>',
    },
  ];

  return (
    <section className="story" id="story" aria-label="Come funziona BeachBox, in cinque passaggi" ref={root}>
      <div className="stage" id="stage">
        <div className="photo" id="photo">
          <img id="photoImg" src="/assets/scroll-premium/spiaggia.png" alt="" width="1536" height="1024" fetchpriority="high" />
        </div>
        <div className="copy" id="copy">
          <div className="step" id="step">01 · Scansiona</div>
          <h2 id="title">Un QR per ogni ombrellone.</h2>
          <p id="text">Il cliente resta comodamente al proprio posto e inquadra il QR associato alla sua postazione.</p>
        </div>
        <div className="umbrella" id="umbrella">
          <img className="umbrella-art" src="/assets/scroll-premium/ombrellone.svg" alt="Ombrellone blu e crema con una targhetta BeachBox fissata al palo" width="700" height="740" />
          <Link className="qr-sign" href={DEMO_HREF} aria-label="Apri il menu demo dell’ombrellone 24">
            <img className="sign-logo" src="/assets/beachbox-brand/svg/beachbox-logo-horizontal-no-payoff.svg" alt="BeachBox" width="110" height="31" />
            <strong>Ombrellone 24</strong>
            <QrImage className="qr-image" alt="QR per aprire il menu demo dell’ombrellone 24" width={110} height={110} />
            <span className="scanbar" id="scanbar" aria-hidden="true"></span>
            <span>Scansiona<br />per ordinare</span>
          </Link>
        </div>
        <div id="sceneNote"></div>
        <div className="phone is-camera" id="phone" aria-label="Anteprima del menu BeachBox">
          <div className="screen">
            <div className="island" aria-hidden="true"></div>
            <div className="status-bar" aria-hidden="true"><span>9:41</span><span className="signal">▮▮▮ ▰</span></div>
            <div className="screen-view camera-view is-active" id="camera" ref={setView('camera')}>
              <div className="camera-target">
                <img className="mini-logo" src="/assets/beachbox-brand/svg/beachbox-logo-horizontal-no-payoff.svg" alt="" width="120" height="34" />
                <strong>Ombrellone 24</strong>
                <QrImage className="qr-image" alt="QR inquadrato dalla fotocamera" width={160} height={160} />
              </div>
              <div className="focus-box" aria-hidden="true"></div>
              <div className="camera-label">Inquadra. Il menu è qui.</div>
              <div className="camera-shutter" aria-hidden="true"></div>
            </div>
            <div className="screen-view app-view" id="menuView" aria-hidden="true" ref={setView('menuView')}>
              <div className="app-top">
                <img className="app-logo" src="/assets/beachbox-brand/svg/beachbox-logo-horizontal-no-payoff.svg" alt="BeachBox" width="114" height="32" />
                <span className="pill">Ombrellone 24</span>
              </div>
              <h3>Cosa ti portiamo?</h3>
              <p className="app-caption">Il tuo momento di pausa, servito al mare.</p>
              <div className="categories" aria-label="Categorie del menu">
                <button className="cat active" data-category="all" type="button" aria-pressed="true">Tutti</button>
                <button className="cat" data-category="drink" type="button" aria-pressed="false">Drink</button>
                <button className="cat" data-category="food" type="button" aria-pressed="false">Food</button>
              </div>
              <div className="products">
                {products.map((product) => (
                  <article className="product" data-category={product.category} key={product.name}>
                    <svg className="product-visual" viewBox="0 0 120 90" aria-hidden="true" dangerouslySetInnerHTML={{ __html: product.art }} />
                    <h4>
                      {product.name}
                      <button type="button" className="add" aria-label="Vedi il carrello di esempio">+</button>
                    </h4>
                    <div className="price">{product.price}</div>
                  </article>
                ))}
              </div>
              <button type="button" className="phone-cart">Vedi ordine di esempio <span>€ 16,50 →</span></button>
            </div>
            <div className="screen-view cart-view" id="cartView" aria-hidden="true" ref={setView('cartView')}>
              <div className="app-top">
                <img className="app-logo" src="/assets/beachbox-brand/svg/beachbox-logo-horizontal-no-payoff.svg" alt="BeachBox" width="114" height="32" />
                <span className="pill">Ombrellone 24</span>
              </div>
              <h3>Il tuo ordine</h3>
              <p className="cart-sub">Un ultimo sguardo, poi puoi rilassarti.</p>
              <div className="cart-row"><span>1× Spritz<small>Fresco, con arancia</small></span><strong>€ 6,00</strong></div>
              <div className="cart-row"><span>1× Toast<small>Una pausa che sa di estate</small></span><strong>€ 7,50</strong></div>
              <div className="cart-row"><span>1× Cola<small>Servita fresca</small></span><strong>€ 3,00</strong></div>
              <div className="total"><span>Totale</span><strong>€ 16,50</strong></div>
              <button type="button" className="cta" id="orderButton">Conferma ordine demo →</button>
              <div className="note">Consegna all’ombrellone <strong>24</strong>.<br />Questa è una simulazione: nessun pagamento.</div>
              <button type="button" className="back-to-menu" id="backToMenu">Torna al menu</button>
            </div>
            <div className="screen-view success-view" id="successView" aria-hidden="true" ref={setView('successView')}>
              <div>
                <div className="success-icon" aria-hidden="true">✓</div>
                <h3>Ordine ricevuto!</h3>
                <p>Lo staff sa già dove trovarti.<br />Ombrellone <strong>24</strong>.</p>
                <span className="mini-badge">Rilassati, ci pensiamo noi.</span>
                <p>Ordine dimostrativo</p>
              </div>
            </div>
            <div className="home-line" aria-hidden="true"></div>
          </div>
        </div>
        <nav className="timeline" aria-label="Passaggi della dimostrazione">
          <button type="button" data-step="0" aria-current="step"><b>01</b> Scansiona</button>
          <button type="button" data-step="1" tabIndex={-1}><b>02</b> Accedi</button>
          <button type="button" data-step="2" tabIndex={-1}><b>03</b> Scegli</button>
          <button type="button" data-step="3" tabIndex={-1}><b>04</b> Ordina</button>
          <button type="button" data-step="4" tabIndex={-1}><b>05</b> Rilassati</button>
          <div className="track" aria-hidden="true"><span id="track"></span></div>
          <span className="counter" id="counter" aria-hidden="true">01 / 05</span>
        </nav>
      </div>
    </section>
  );
}
