/* Shared, local-only orders for the Premium dashboard and the QR menu demo. */
(() => {
  const key = 'beachbox.premium.orders.v1';
  const seed = [
    { id: 101, place: 21, items: [['Acqua', 2]], cents: 400, status: 0, time: '12:24' },
    { id: 102, place: 12, items: [['Toast', 2], ['Spritz', 1]], cents: 2100, status: 1, time: '12:20' },
    { id: 103, place: 8, items: [['Spritz', 1]], cents: 600, status: 2, time: '12:18' }
  ];
  const clone = data => JSON.parse(JSON.stringify(data));
  function valid(orders) {
    return Array.isArray(orders) && orders.length <= 30 && orders.every(o =>
      o && Number.isInteger(o.id) && o.id > 0 && Number.isInteger(o.place) && o.place > 0 &&
      Number.isInteger(o.cents) && o.cents > 0 && Number.isInteger(o.status) && o.status >= 0 && o.status <= 3 &&
      typeof o.time === 'string' && Array.isArray(o.items) && o.items.length > 0 &&
      o.items.every(item => Array.isArray(item) && typeof item[0] === 'string' && Number.isInteger(item[1]) && item[1] > 0));
  }
  let memory = clone(seed);
  const listeners = new Set();
  function read() {
    try { const stored = JSON.parse(localStorage.getItem(key)); if (valid(stored)) memory = stored; }
    catch (_) { /* File mode or blocked storage: the in-memory demo still works. */ }
    return clone(memory);
  }
  function publish(orders) {
    memory = clone(orders);
    try { localStorage.setItem(key, JSON.stringify(memory)); } catch (_) { /* Local-only fallback. */ }
    listeners.forEach(listener => listener(clone(memory)));
  }
  window.addEventListener('storage', event => {
    if (event.key !== key) return;
    if (event.newValue === null) memory = clone(seed);
    const orders = read(); listeners.forEach(listener => listener(orders));
  });
  window.BeachBoxOrders = Object.freeze({
    read,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    submit({ items, cents }) {
      const orders = read();
      if (orders.length >= 30) throw new Error('La demo contiene già 30 ordini. Ripristina la dashboard per continuare.');
      const order = { id: Math.max(103, ...orders.map(o => o.id)) + 1, place: 24, items: clone(items), cents, status: 0, time: 'Demo' };
      if (!valid([order])) throw new Error('Aggiungi almeno un prodotto per provare l’ordine.');
      publish([...orders, order]); return clone(order);
    },
    advance(id) { const orders = read(), order = orders.find(o => o.id === id); if (!order) return null; order.status = Math.min(3, order.status + 1); publish(orders); return clone(order); },
    reset() { publish(clone(seed)); }
  });
})();
