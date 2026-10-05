'use client';

/* Dashboard demo: comande condivise con il menu QR (lib/orders). */
import { useSyncExternalStore } from 'react';
import { ordersStore } from '@/lib/orders';
import { useDemo } from './DemoProvider';

const euro = (cents) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);
const states = ['Nuovi', 'In preparazione', 'Pronti'];
const actions = ['Inizia preparazione', 'Segna come pronto', 'Segna come consegnato'];
const statusLabels = ['ricevuto', 'in preparazione', 'pronto', 'consegnato'];

export default function Dashboard() {
  const orders = useSyncExternalStore(ordersStore.subscribe, ordersStore.read, () => []);
  const { notify } = useDemo();

  const advance = (id) => {
    const order = ordersStore.advance(id);
    if (!order) return;
    notify(`Ordine #${order.id}: ${statusLabels[order.status]}.`);
    requestAnimationFrame(() => {
      const next = document.querySelector(`[data-advance="${order.id}"]`) || document.querySelector('#reset-orders');
      next?.focus({ preventScroll: true });
    });
  };

  const reset = () => {
    ordersStore.reset();
    notify('Ordini demo ripristinati.');
  };

  const delivered = orders.filter((order) => order.status === 3).length;

  return (
    <section className="wrap operations dark" id="per-il-bar">
      <div className="operations-heading">
        <h2>Fuori, il mare.<br />Dentro, <em>l’ordine.</em></h2>
        <div>
          <p>Nuovi ordini, preparazioni e consegne in un’unica vista. Anche quando il bar è nel pieno della giornata.</p>
          <OrderDemoButton />
        </div>
      </div>
      <div className="dashboard">
        <aside className="dash-sidebar" aria-label="Esempio navigazione dashboard">
          <img src="/assets/beachbox-brand/svg/beachbox-logo-horizontal-no-payoff.svg" alt="BeachBox" />
          <span className="active">Ordini</span>
          <span>Menu</span>
          <span>Ombrelloni</span>
          <span>Storico</span>
        </aside>
        <div className="dash-body">
          <div className="dash-header">
            <div>
              <h3>La tua giornata, in ordine.</h3>
              <p>Stabilimento di esempio · Vista operativa</p>
            </div>
            <span className="demo-badge">Demo interattiva</span>
          </div>
          <div className="kanban" id="kanban" aria-label="Ordini dimostrativi">
            {states.map((state, index) => {
              const visible = orders.filter((order) => order.status === index);
              return (
                <section className="kanban-col" aria-label={state} key={state}>
                  <div className="col-name">
                    <span>{state}</span>
                    <span className="col-count">{visible.length}</span>
                  </div>
                  {visible.length ? (
                    visible.map((order) => (
                      <article className="order-card" key={order.id}>
                        <div className="order-top">
                          <span className="order-place">Ombrellone {order.place}</span>
                          <span className="order-paid">✓ Pagamento demo</span>
                        </div>
                        <div className="order-items">
                          {order.items.map(([name, quantity]) => `${quantity} × ${name}`).join('\n').split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
                        </div>
                        <div className="order-bottom">
                          <span>#{order.id} · {order.time}</span>
                          <strong>{euro(order.cents)}</strong>
                        </div>
                        <button
                          type="button"
                          data-advance={order.id}
                          aria-label={`${actions[index]}, ordine ${order.id}, ombrellone ${order.place}`}
                          onClick={() => advance(order.id)}
                        >
                          {actions[index]}
                        </button>
                      </article>
                    ))
                  ) : (
                    <p className="empty-column">Nessun ordine in questa fase.</p>
                  )}
                </section>
              );
            })}
          </div>
          <p className="delivered-summary" id="delivered" aria-live="polite">
            {delivered
              ? `${delivered} ${delivered === 1 ? 'ordine consegnato' : 'ordini consegnati'} nella demo.`
              : 'Stabilimento, pagamenti e ordini mostrati sono dimostrativi.'}
          </p>
        </div>
      </div>
      <div className="dashboard-footer">
        <span>Prova i pulsanti sulle comande per avanzare fino alla consegna.</span>
        <button type="button" id="reset-orders" onClick={reset}>Ripristina gli ordini demo</button>
      </div>
    </section>
  );
}

function OrderDemoButton() {
  const { openDemo } = useDemo();
  return (
    <button className="button orange" type="button" onClick={openDemo}>
      Aggiungi un ordine demo <svg aria-hidden="true"><use href="#business-arrow" /></svg>
    </button>
  );
}
