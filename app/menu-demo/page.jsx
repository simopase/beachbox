'use client';

/* Menu demo dell'ombrellone (port di menu-demo.js): carrello, filtri e conferma. */
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ordersStore } from '@/lib/orders';

const products = [
  {
    id: 'spritz', name: 'Spritz', cents: 600, category: 'drink', description: 'Aperitivo fresco con arancia e ghiaccio.',
    art: '<path d="M46 26H75L72 44Q69 55 60 55Q50 55 47 44Z" fill="#ee7d28" stroke="#fff9e8" stroke-width="2"/><path d="M49 28H72L70 38H50Z" fill="#ffbc6b"/><path d="M60 55V72M48 73H72" stroke="#ad7350" stroke-width="2"/><circle cx="75" cy="28" r="9" fill="#f6ae36" stroke="#ffda85" stroke-width="2"/>',
  },
  {
    id: 'toast', name: 'Toast', cents: 750, category: 'food', description: 'Pane tostato, prosciutto e formaggio.',
    art: '<path d="M31 43L61 67L89 47V58L61 76L31 53Z" fill="#d39042"/><path d="M31 41L61 61L89 44L86 53L61 70L34 50Z" fill="#f5cd68"/><path d="M32 42L60 62L87 45" stroke="#658345" stroke-width="5"/><path d="M31 36L58 20L90 38L61 57Z" fill="#efc37f" stroke="#d89743" stroke-width="3"/><path d="M47 34L67 47M53 30L74 43M60 27L81 40" stroke="#c98c43" stroke-width="2"/>',
  },
  {
    id: 'water', name: 'Acqua', cents: 200, category: 'drink', description: 'Acqua naturale, bottiglia da 50 cl.',
    art: '<path d="M52 25H68V35L74 43V70Q60 76 46 70V43L52 35Z" fill="#b3dfe9" stroke="#77b6c5" stroke-width="2"/><rect x="51" y="18" width="18" height="9" rx="3" fill="#246184"/><path d="M46 49H74V63H46Z" fill="#fffaf0"/><path d="M52 56H68" stroke="#88bdcb" stroke-width="2"/>',
  },
  {
    id: 'cola', name: 'Cola', cents: 300, category: 'drink', description: 'Bibita fresca in lattina da 33 cl.',
    art: '<rect x="43" y="22" width="34" height="53" rx="7" fill="#cb5a3b"/><ellipse cx="60" cy="23" rx="17" ry="4" fill="#c6c6bc"/><ellipse cx="60" cy="23" rx="7" ry="2" fill="#7e898c"/><path d="M50 29V65" stroke="#f69d77" stroke-width="3"/><path d="M48 54Q55 42 69 48" stroke="#fff5e9" stroke-width="3"/>',
  },
];

const money = (cents) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);
const filters = [
  { id: 'all', label: 'Tutti' },
  { id: 'drink', label: 'Drink' },
  { id: 'food', label: 'Food' },
];

function MenuDemo() {
  const params = useSearchParams();
  const umbrella = params.get('ombrellone') || '24';
  const [cart, setCart] = useState(new Map());
  const [filter, setFilter] = useState('all');
  const [status, setStatus] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const dialog = useRef(null);
  const firstAdd = useRef(null);

  const total = products.reduce((sum, product) => sum + product.cents * (cart.get(product.id) || 0), 0);
  const selected = useMemo(() => products.filter((product) => cart.has(product.id)), [cart]);

  useEffect(() => {
    if (confirmation) dialog.current?.showModal();
  }, [confirmation]);

  const add = (id) => {
    setCart((previous) => new Map(previous).set(id, (previous.get(id) || 0) + 1));
    const product = products.find((item) => item.id === id);
    setStatus(`${product.name} aggiunto. Totale ${money(total + product.cents)}.`);
  };

  const change = (id, delta) => {
    setCart((previous) => {
      const next = new Map(previous);
      const value = (next.get(id) || 0) + delta;
      if (value > 0) next.set(id, value);
      else next.delete(id);
      return next;
    });
    setStatus('Ordine aggiornato.');
  };

  const confirm = () => {
    if (!cart.size) return;
    let order;
    try {
      order = ordersStore.submit({
        items: products.filter((product) => cart.has(product.id)).map((product) => [product.name, cart.get(product.id)]),
        cents: total,
      });
    } catch (error) {
      setStatus(error.message);
      return;
    }
    setConfirmation(order);
  };

  const closeConfirmation = () => {
    dialog.current?.close();
    setConfirmation(null);
    setCart(new Map());
    setStatus('Demo completata. Puoi creare un nuovo ordine.');
    firstAdd.current?.focus();
  };

  return (
    <div className="menu-page">
      <div className="menu-shell">
        <div className="menu-head">
          <img src="/assets/beachbox-brand/svg/beachbox-logo-horizontal-no-payoff.svg" alt="BeachBox" />
          <span className="menu-pill">Ombrellone {umbrella}</span>
        </div>
        <h1 className="menu-title">Cosa ti portiamo?</h1>
        <p className="menu-caption">Il tuo momento di pausa, servito al mare. Menu dimostrativo, nessun pagamento.</p>
        <div className="menu-filters" role="group" aria-label="Filtra il menu">
          {filters.map((item) => (
            <button
              key={item.id} type="button" aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="menu-products" id="products">
          {products
            .filter((product) => filter === 'all' || product.category === filter)
            .map((product, index) => (
              <article className="demo-product" data-category={product.category} key={product.id}>
                <svg className="product-visual" viewBox="0 0 120 90" aria-hidden="true" dangerouslySetInnerHTML={{ __html: product.art }} />
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <div className="demo-product-footer">
                  <span className="demo-price">{money(product.cents)}</span>
                  <button
                    type="button" className="demo-add" ref={index === 0 ? firstAdd : null}
                    onClick={() => add(product.id)} aria-label={`Aggiungi ${product.name}`}
                  >
                    Aggiungi +
                  </button>
                </div>
              </article>
            ))}
        </div>
        <div className="menu-cart">
          <h2>Il tuo ordine</h2>
          {selected.length ? (
            selected.map((product) => (
              <div className="cart-row" key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  <div className="quantity">
                    <button type="button" onClick={() => change(product.id, -1)} aria-label={`Rimuovi un ${product.name}`}>−</button>
                    <span aria-label={`Quantità ${product.name}`}>{cart.get(product.id)}</span>
                    <button type="button" onClick={() => change(product.id, 1)} aria-label={`Aggiungi un ${product.name}`}>+</button>
                  </div>
                </div>
                <strong>{money(product.cents * cart.get(product.id))}</strong>
              </div>
            ))
          ) : (
            <p className="empty">Qui c’è ancora spazio.<br />Aggiungi qualcosa dal menu.</p>
          )}
          <div className="menu-total">
            <span>Totale</span>
            <strong>{money(total)}</strong>
          </div>
          <button className="menu-confirm" type="button" id="confirm" onClick={confirm} disabled={!selected.length}>
            Conferma ordine demo →
          </button>
          <p className="menu-note">
            Consegna all’ombrellone <strong>{umbrella}</strong>. Simulazione locale: nessun pagamento.
            <br />L’ordine arriva alla <Link href="/#per-il-bar">dashboard demo</Link> di questo browser.
          </p>
        </div>
      </div>
      <dialog className="menu-dialog" aria-labelledby="demoOrderReference" ref={dialog}>
        {confirmation ? (
          <div className="menu-dialog-inner">
            <div className="success-icon" aria-hidden="true">✓</div>
            <h2>Ordine ricevuto!</h2>
            <p id="demoOrderReference">Ordine demo #{confirmation.id}</p>
            <div className="order-lines" id="orderSummary">
              {products
                .filter((product) => cart.has(product.id))
                .map((product) => (
                  <div key={product.id}>{cart.get(product.id)}× {product.name} · {money(product.cents * cart.get(product.id))}</div>
                ))}
              <div><strong>Totale {money(total)}</strong></div>
            </div>
            <p>Lo staff sa già dove trovarti. Ombrellone <strong>{umbrella}</strong>.</p>
            <button type="button" onClick={closeConfirmation}>Perfetto, torno al sole</button>
          </div>
        ) : null}
      </dialog>
      <p className="menu-status" role="status" aria-live="polite">{status || ' '}</p>
    </div>
  );
}

export default function MenuDemoPage() {
  return (
    <Suspense fallback={<div className="menu-page" />}>
      <MenuDemo />
    </Suspense>
  );
}
