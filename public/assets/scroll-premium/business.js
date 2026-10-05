(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const store = window.BeachBoxOrders;
  const euro = cents => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const icon = name => `<svg aria-hidden="true"><use href="#business-${name}"/></svg>`;
  let toastTimer;
  function notify(message) { const toast = $('#toast'); toast.textContent = message; toast.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.hidden = true; }, 5500); }
  const states = ['Nuovi', 'In preparazione', 'Pronti'];
  const actions = ['Inizia preparazione', 'Segna come pronto', 'Segna come consegnato'];
  function renderOrders(orders = store.read()) {
    $('#kanban').innerHTML = states.map((state, index) => {
      const visible = orders.filter(order => order.status === index);
      return `<section class="kanban-col" aria-label="${state}"><div class="col-name"><span>${state}</span><span class="col-count">${visible.length}</span></div>${visible.length ? visible.map(order => `<article class="order-card"><div class="order-top"><span class="order-place">Ombrellone ${order.place}</span><span class="order-paid">✓ Pagamento demo</span></div><div class="order-items">${order.items.map(([name, quantity]) => `${quantity} × ${escape(name)}`).join('<br>')}</div><div class="order-bottom"><span>#${order.id} · ${escape(order.time)}</span><strong>${euro(order.cents)}</strong></div><button type="button" data-advance="${order.id}" aria-label="${actions[index]}, ordine ${order.id}, ombrellone ${order.place}">${actions[index]}</button></article>`).join('') : '<p class="empty-column">Nessun ordine in questa fase.</p>'}</section>`;
    }).join('');
    const count = orders.filter(order => order.status === 3).length;
    $('#delivered').textContent = count ? `${count} ${count === 1 ? 'ordine consegnato' : 'ordini consegnati'} nella demo.` : 'Stabilimento, pagamenti e ordini mostrati sono dimostrativi.';
  }
  store.subscribe(renderOrders);
  renderOrders();
  $('#kanban').addEventListener('click', event => {
    const button = event.target.closest('[data-advance]'); if (!button) return;
    const order = store.advance(Number(button.dataset.advance)); if (!order) return;
    const next = $(`[data-advance="${order.id}"]`) || $('#reset-orders');
    next.focus({ preventScroll: true });
    notify(`Ordine #${order.id}: ${['ricevuto', 'in preparazione', 'pronto', 'consegnato'][order.status]}.`);
  });
  $('#reset-orders').addEventListener('click', () => { store.reset(); notify('Ordini demo ripristinati.'); });

  const products = [{ name: 'Spritz', cents: 600 }, { name: 'Toast', cents: 750 }, { name: 'Acqua', cents: 200 }, { name: 'Cola', cents: 300 }];
  let quantities = [1, 1, 0, 1], demoOpener, focusAfterClose;
  const dialog = $('#order-dialog');
  const total = () => quantities.reduce((sum, quantity, index) => sum + quantity * products[index].cents, 0);
  function renderCart() {
    $('#dialog-content').innerHTML = `<div class="dialog-top"><img src="assets/beachbox-brand/svg/beachbox-logo-horizontal-no-payoff.svg" alt="BeachBox"><button class="dialog-close" type="button" data-close-dialog aria-label="Chiudi demo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" stroke="currentColor" stroke-width="1.8"/></svg></button></div><h2 id="dialog-title">La tua pausa,<br>all’ombrellone 24.</h2><p>Componi un ordine e guardalo arrivare alla dashboard. È una demo: nessun pagamento reale.</p><div class="demo-cart">${products.map((product, index) => `<div class="demo-row"><div><strong>${product.name}</strong><small>${euro(product.cents)}</small></div><div class="stepper"><button type="button" data-change="${index}" data-delta="-1" aria-label="Rimuovi ${product.name}">−</button><output data-quantity="${index}" aria-label="Quantità ${product.name}">${quantities[index]}</output><button type="button" data-change="${index}" data-delta="1" aria-label="Aggiungi ${product.name}">+</button></div></div>`).join('')}</div><div class="demo-total"><span>Totale demo</span><output id="demo-total" aria-live="polite">${euro(total())}</output></div><p class="demo-error" id="demo-error" role="alert" hidden></p><button class="button" type="button" id="submit-demo">Simula pagamento e invia al bar ${icon('arrow')}</button><p class="fine" style="margin-top:15px">La comanda arriva solo alla dashboard dimostrativa di questa pagina.</p>`;
  }
  document.addEventListener('click', event => {
    const opener = event.target.closest('[data-open-demo]'); if (!opener) return;
    event.preventDefault(); demoOpener = opener; focusAfterClose = null; quantities = [1, 1, 0, 1]; renderCart(); dialog.showModal();
  });
  dialog.addEventListener('close', () => { (focusAfterClose || demoOpener)?.focus({ preventScroll: true }); focusAfterClose = null; });
  dialog.addEventListener('click', event => {
    if (event.target.closest('[data-close-dialog]')) dialog.close();
    const button = event.target.closest('[data-change]');
    if (button) {
      const index = Number(button.dataset.change);
      quantities[index] = Math.min(10, Math.max(0, quantities[index] + Number(button.dataset.delta)));
      $(`[data-quantity="${index}"]`).textContent = quantities[index]; $('#demo-total').textContent = euro(total()); $('#demo-error').hidden = true;
    }
    if (event.target.closest('#submit-demo')) submitOrder();
    if (event.target.closest('[data-view-dashboard]')) {
      focusAfterClose = $('#reset-orders'); dialog.close();
      $('#per-il-bar').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
    if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); }
  });
  function submitOrder() {
    if (total() === 0) { $('#demo-error').textContent = 'Aggiungi almeno un prodotto per provare l’ordine.'; $('#demo-error').hidden = false; return; }
    let order;
    try { order = store.submit({ items: products.map((p, i) => [p.name, quantities[i]]).filter(([, q]) => q > 0), cents: total() }); }
    catch (error) { $('#demo-error').textContent = error.message; $('#demo-error').hidden = false; return; }
    $('#dialog-content').innerHTML = `<div class="dialog-success"><div class="status-circle">${icon('check')}</div><h2 id="dialog-title">Il bar ha il tuo ordine.</h2><p>Ordine demo #${order.id} · Ombrellone 24<br>Pagamento simulato: ${euro(order.cents)}.<br>La comanda è ora nella colonna “Nuovi”.</p><button class="button" type="button" data-view-dashboard>Guarda la tua comanda ${icon('arrow')}</button><button class="text-link" type="button" data-close-dialog>Continua a esplorare</button></div>`;
    $('[data-view-dashboard]').focus();
  }

  const ranges = [$('#extra-orders'), $('#average-ticket'), $('#opening-days')];
  function calculate() {
    const [extras, ticket, days] = ranges.map(input => Number(input.value));
    $('#orders-value').textContent = extras; $('#ticket-value').textContent = `${ticket} €`; $('#days-value').textContent = days;
    ranges[0].setAttribute('aria-valuetext', `${extras} ordini extra al giorno`); ranges[1].setAttribute('aria-valuetext', `${ticket} euro`); ranges[2].setAttribute('aria-valuetext', `${days} giorni`);
    $('#revenue').textContent = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(extras * ticket * days);
    $('#calc-formula').textContent = `${extras} ${extras === 1 ? 'ordine' : 'ordini'} × ${ticket} € × ${days} giorni`;
  }
  ranges.forEach(input => input.addEventListener('input', calculate)); calculate();
  const plans = {
    starter: { title: 'Starter, per iniziare.', description: 'La tua presenza digitale, dall’ombrellone al menu.', features: ['QR per ogni ombrellone', 'Menu digitale e categorie', 'Gestione di prodotti e disponibilità', 'Dashboard ordini di base'] },
    pro: { title: 'Pro, dall’ordine alla consegna.', description: 'Tutto Starter, con il percorso completo per il tuo bar.', features: ['Pagamenti online anticipati', 'Ordini in tempo reale', 'Stati di preparazione e consegna', 'Storico degli ordini'] },
    premium: { title: 'Premium, con un avvio guidato.', description: 'Tutto Pro, con attenzione alla tua configurazione.', features: ['Personalizzazione del servizio', 'Configurazione iniziale', 'Onboarding accompagnato', 'Supporto prioritario'] }
  };
  const planButtons = [...document.querySelectorAll('[data-plan]')];
  function setPlan(key) {
    planButtons.forEach(button => { const selected = button.dataset.plan === key; button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1; });
    const plan = plans[key]; $('#plan-detail').setAttribute('aria-labelledby', 'plan-' + key);
    $('#plan-detail').innerHTML = `<h3>${plan.title}</h3><p>${plan.description}</p><ul>${plan.features.map(feature => `<li>${icon('check')}${feature}</li>`).join('')}</ul><button class="text-link" type="button" data-open-demo>Esplora la demo del prodotto</button>`;
  }
  planButtons.forEach(button => button.addEventListener('click', () => setPlan(button.dataset.plan)));
  $('.plan-rows').addEventListener('keydown', event => {
    const current = planButtons.indexOf(event.target); if (current < 0) return;
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (current + 1) % planButtons.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (current + planButtons.length - 1) % planButtons.length;
    else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = planButtons.length - 1; else return;
    event.preventDefault(); setPlan(planButtons[next].dataset.plan); planButtons[next].focus({ preventScroll: true });
  });
  setPlan('pro');
})();
