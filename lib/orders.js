/* Shared, local-only demo orders (port di demo-orders.js). Nessun dato inviato. */
import { cloneSeed, seed, valid } from './seed';

const key = 'beachbox.premium.orders.v1';
const listeners = new Set();
let memory = null;

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function load() {
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    if (valid(stored)) return stored;
  } catch (_) {
    /* storage non disponibile: la demo resta in memoria */
  }
  return clone(seed);
}

function ensure() {
  if (memory === null) memory = load();
  return memory;
}

function publish(next) {
  memory = next;
  try {
    localStorage.setItem(key, JSON.stringify(memory));
  } catch (_) {
    /* fallback solo in memoria */
  }
  listeners.forEach((listener) => listener());
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== key) return;
    try {
      const parsed = event.newValue === null ? null : JSON.parse(event.newValue);
      memory = valid(parsed) ? parsed : event.newValue === null ? clone(seed) : ensure();
    } catch (_) {
      return;
    }
    listeners.forEach((listener) => listener());
  });
}

export const ordersStore = Object.freeze({
  read() {
    return ensure();
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  submit({ items, cents }) {
    const current = ensure();
    if (current.length >= 30) throw new Error('La demo contiene già 30 ordini. Ripristina la dashboard per continuare.');
    const order = {
      id: Math.max(103, ...current.map((o) => o.id)) + 1,
      place: 24,
      items: clone(items),
      cents,
      status: 0,
      time: 'Demo',
    };
    if (!valid([order])) throw new Error('Aggiungi almeno un prodotto per provare l’ordine.');
    publish([...current, order]);
    return clone(order);
  },
  advance(id) {
    const current = ensure();
    const order = current.find((o) => o.id === id);
    if (!order) return null;
    const next = current.map((o) => (o.id === id ? { ...o, status: Math.min(3, o.status + 1) } : o));
    publish(next);
    return next.find((o) => o.id === id);
  },
  reset() {
    publish(cloneSeed());
  },
});
