(() => {
  const products = [
    { id: 'spritz', name: 'Spritz', cents: 600, category: 'drink', description: 'Aperitivo fresco con arancia e ghiaccio.', art: '<path d="M46 26H75L72 44Q69 55 60 55Q50 55 47 44Z" fill="#ee7d28" stroke="#fff9e8" stroke-width="2"/><path d="M49 28H72L70 38H50Z" fill="#ffbc6b"/><path d="M60 55V72M48 73H72" stroke="#ad7350" stroke-width="2"/><circle cx="75" cy="28" r="9" fill="#f6ae36" stroke="#ffda85" stroke-width="2"/>' },
    { id: 'toast', name: 'Toast', cents: 750, category: 'food', description: 'Pane tostato, prosciutto e formaggio.', art: '<path d="M31 43L61 67L89 47V58L61 76L31 53Z" fill="#d39042"/><path d="M31 41L61 61L89 44L86 53L61 70L34 50Z" fill="#f5cd68"/><path d="M32 42L60 62L87 45" stroke="#658345" stroke-width="5"/><path d="M31 36L58 20L90 38L61 57Z" fill="#efc37f" stroke="#d89743" stroke-width="3"/><path d="M47 34L67 47M53 30L74 43M60 27L81 40" stroke="#c98c43" stroke-width="2"/>' },
    { id: 'water', name: 'Acqua', cents: 200, category: 'drink', description: 'Acqua naturale, bottiglia da 50 cl.', art: '<path d="M52 25H68V35L74 43V70Q60 76 46 70V43L52 35Z" fill="#b3dfe9" stroke="#77b6c5" stroke-width="2"/><rect x="51" y="18" width="18" height="9" rx="3" fill="#246184"/><path d="M46 49H74V63H46Z" fill="#fffaf0"/><path d="M52 56H68" stroke="#88bdcb" stroke-width="2"/>' },
    { id: 'cola', name: 'Cola', cents: 300, category: 'drink', description: 'Bibita fresca in lattina da 33 cl.', art: '<rect x="43" y="22" width="34" height="53" rx="7" fill="#cb5a3b"/><ellipse cx="60" cy="23" rx="17" ry="4" fill="#c6c6bc"/><ellipse cx="60" cy="23" rx="7" ry="2" fill="#7e898c"/><path d="M50 29V65" stroke="#f69d77" stroke-width="3"/><path d="M48 54Q55 42 69 48" stroke="#fff5e9" stroke-width="3"/>' }
  ];
  const money = cents => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);
  const cart = new Map();
  const $ = id => document.getElementById(id);
  $('products').innerHTML = products.map(p => `<article class="demo-product" data-category="${p.category}"><svg class="product-visual" viewBox="0 0 120 90" aria-hidden="true">${p.art}</svg><h2>${p.name}</h2><p>${p.description}</p><div class="demo-product-footer"><span class="demo-price">${money(p.cents)}</span><button type="button" class="demo-add" data-add="${p.id}" aria-label="Aggiungi ${p.name}">Aggiungi +</button></div></article>`).join('');
  function total() { return products.reduce((sum, p) => sum + p.cents * (cart.get(p.id) || 0), 0); }
  function render(focusId, focusAction) {
    const selected = products.filter(p => cart.has(p.id));
    $('cartItems').innerHTML = selected.length ? selected.map(p => `<div class="cart-row"><div><strong>${p.name}</strong><div class="quantity"><button type="button" data-change="${p.id}" data-delta="-1" aria-label="Rimuovi un ${p.name}">−</button><span aria-label="Quantità ${p.name}">${cart.get(p.id)}</span><button type="button" data-change="${p.id}" data-delta="1" aria-label="Aggiungi un ${p.name}">+</button></div></div><strong>${money(p.cents * cart.get(p.id))}</strong></div>`).join('') : '<p class="empty">Qui c’è ancora spazio.<br>Aggiungi qualcosa dal menu.</p>';
    $('total').textContent = money(total()); $('confirm').disabled = selected.length === 0;
    if (focusId) {
      const button = $('cartItems').querySelector(`[data-change="${focusId}"][data-delta="${focusAction}"]`) || $('cartItems').querySelector('button') || document.querySelector(`[data-add="${focusId}"]`);
      button?.focus({ preventScroll: true });
    }
  }
  $('products').addEventListener('click', event => {
    const button = event.target.closest('[data-add]'); if (!button) return;
    const id = button.dataset.add; cart.set(id, (cart.get(id) || 0) + 1); render();
    $('status').textContent = `${products.find(p => p.id === id).name} aggiunto. Totale ${money(total())}.`;
  });
  $('cartItems').addEventListener('click', event => {
    const button = event.target.closest('[data-change]'); if (!button) return;
    const id = button.dataset.change, next = (cart.get(id) || 0) + Number(button.dataset.delta);
    if (next > 0) cart.set(id, next); else cart.delete(id);
    render(id, button.dataset.delta); $('status').textContent = `Ordine aggiornato. Totale ${money(total())}.`;
  });
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
    document.querySelectorAll('.demo-product').forEach(el => { el.hidden = button.dataset.filter !== 'all' && el.dataset.category !== button.dataset.filter; });
  }));
  $('confirm').addEventListener('click', () => {
    if (!cart.size) return;
    let order;
    try { order = window.BeachBoxOrders.submit({ items: products.filter(p => cart.has(p.id)).map(p => [p.name, cart.get(p.id)]), cents: total() }); }
    catch (error) { $('status').textContent = error.message; return; }
    $('demoOrderReference').textContent = `Ordine demo #${order.id}`;
    $('orderSummary').innerHTML = products.filter(p => cart.has(p.id)).map(p => `<div>${cart.get(p.id)}× ${p.name} · ${money(p.cents * cart.get(p.id))}</div>`).join('') + `<div><strong>Totale ${money(total())}</strong></div>`;
    $('confirmation').showModal();
  });
  $('closeConfirmation').addEventListener('click', () => { $('confirmation').close(); cart.clear(); render(); $('status').textContent = 'Demo completata. Puoi creare un nuovo ordine.'; document.querySelector('[data-add]').focus(); });
})();
