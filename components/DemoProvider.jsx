'use client';

/* Port di business.js: dialog ordine, toast e contesto demo condiviso. */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ordersStore } from '@/lib/orders';

const euro = (cents) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);
const ArrowIcon = () => <svg aria-hidden="true"><use href="#business-arrow" /></svg>;
const CheckIcon = () => <svg aria-hidden="true"><use href="#business-check" /></svg>;

const DemoContext = createContext(null);
export const useDemo = () => useContext(DemoContext);

const PRODUCTS = [
  { name: 'Spritz', cents: 600 },
  { name: 'Toast', cents: 750 },
  { name: 'Acqua', cents: 200 },
  { name: 'Cola', cents: 300 },
];
const INITIAL_QUANTITIES = [1, 1, 0, 1];

export default function DemoProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const [quantities, setQuantities] = useState(INITIAL_QUANTITIES);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const dialog = useRef(null);
  const opener = useRef(null);
  const focusAfterClose = useRef(null);
  const toastTimer = useRef(0);

  const notify = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 5500);
  }, []);

  const openDemo = useCallback(() => {
    opener.current = document.activeElement;
    focusAfterClose.current = null;
    setQuantities(INITIAL_QUANTITIES);
    setError('');
    setSuccess(null);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (open) dialog.current?.showModal();
  }, [open]);

  const closeDialog = () => dialog.current?.close();

  const total = quantities.reduce((sum, quantity, index) => sum + quantity * PRODUCTS[index].cents, 0);

  const change = (index, delta) => {
    setQuantities((previous) => {
      const next = [...previous];
      next[index] = Math.min(10, Math.max(0, next[index] + delta));
      return next;
    });
    setError('');
  };

  const submitOrder = () => {
    if (total === 0) {
      setError('Aggiungi almeno un prodotto per provare l’ordine.');
      return;
    }
    let order;
    try {
      order = ordersStore.submit({
        items: PRODUCTS.map((product, index) => [product.name, quantities[index]]).filter(([, quantity]) => quantity > 0),
        cents: total,
      });
    } catch (submitError) {
      setError(submitError.message);
      return;
    }
    setSuccess(order);
  };

  const viewDashboard = () => {
    focusAfterClose.current = document.querySelector('#reset-orders');
    closeDialog();
    const section = document.querySelector('#per-il-bar');
    section?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  const onDialogClick = (event) => {
    if (event.target.closest('[data-close-dialog]')) closeDialog();
    if (event.target === dialog.current) {
      const rect = dialog.current.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
    }
  };

  return (
    <DemoContext.Provider value={{ openDemo, notify }}>
      {children}
      <dialog
        className="business-dialog"
        id="order-dialog"
        aria-labelledby="dialog-title"
        ref={dialog}
        onClick={onDialogClick}
        onClose={() => {
          setOpen(false);
          setSuccess(null);
          (focusAfterClose.current || opener.current)?.focus({ preventScroll: true });
          focusAfterClose.current = null;
        }}
      >
        <div className="dialog-inner" id="dialog-content">
          {success ? (
            <div className="dialog-success">
              <div className="status-circle"><CheckIcon /></div>
              <h2 id="dialog-title">Il bar ha il tuo ordine.</h2>
              <p>
                Ordine demo #{success.id} · Ombrellone 24<br />
                Pagamento simulato: {euro(success.cents)}.<br />
                La comanda è ora nella colonna “Nuovi”.
              </p>
              <button className="button" type="button" onClick={viewDashboard} autoFocus>
                Guarda la tua comanda <ArrowIcon />
              </button>
              <button className="text-link" type="button" onClick={closeDialog}>Continua a esplorare</button>
            </div>
          ) : (
            <>
              <div className="dialog-top">
                <img src="/assets/beachbox-brand/svg/beachbox-logo-horizontal-no-payoff.svg" alt="BeachBox" />
                <button className="dialog-close" type="button" data-close-dialog aria-label="Chiudi demo">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.8" /></svg>
                </button>
              </div>
              <h2 id="dialog-title">La tua pausa,<br />all’ombrellone 24.</h2>
              <p>Componi un ordine e guardalo arrivare alla dashboard. È una demo: nessun pagamento reale.</p>
              <div className="demo-cart">
                {PRODUCTS.map((product, index) => (
                  <div className="demo-row" key={product.name}>
                    <div>
                      <strong>{product.name}</strong>
                      <small>{euro(product.cents)}</small>
                    </div>
                    <div className="stepper">
                      <button type="button" onClick={() => change(index, -1)} aria-label={`Rimuovi ${product.name}`}>−</button>
                      <output aria-label={`Quantità ${product.name}`}>{quantities[index]}</output>
                      <button type="button" onClick={() => change(index, 1)} aria-label={`Aggiungi ${product.name}`}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="demo-total">
                <span>Totale demo</span>
                <output aria-live="polite">{euro(total)}</output>
              </div>
              {error ? <p className="demo-error" role="alert">{error}</p> : null}
              <button className="button" type="button" onClick={submitOrder}>
                Simula pagamento e invia al bar <ArrowIcon />
              </button>
              <p className="fine" style={{ marginTop: 15 }}>La comanda arriva solo alla dashboard dimostrativa di questa pagina.</p>
            </>
          )}
        </div>
      </dialog>
      <div className="business-toast" id="toast" role="status" hidden={!toast}>{toast || ' '}</div>
    </DemoContext.Provider>
  );
}
