'use client';

/* Piani stagionali a tab, con navigazione da tastiera. */
import { useRef, useState } from 'react';
import { useDemo } from './DemoProvider';

const plans = {
  starter: {
    title: 'Starter, per iniziare.',
    description: 'La tua presenza digitale, dall’ombrellone al menu.',
    features: ['QR per ogni ombrellone', 'Menu digitale e categorie', 'Gestione di prodotti e disponibilità', 'Dashboard ordini di base'],
  },
  pro: {
    title: 'Pro, dall’ordine alla consegna.',
    description: 'Tutto Starter, con il percorso completo per il tuo bar.',
    features: ['Pagamenti online anticipati', 'Ordini in tempo reale', 'Stati di preparazione e consegna', 'Storico degli ordini'],
  },
  premium: {
    title: 'Premium, con un avvio guidato.',
    description: 'Tutto Pro, con attenzione alla tua configurazione.',
    features: ['Personalizzazione del servizio', 'Configurazione iniziale', 'Onboarding accompagnato', 'Supporto prioritario'],
  },
};
const order = ['starter', 'pro', 'premium'];

export default function Pricing() {
  const [selected, setSelected] = useState('pro');
  const rows = useRef(null);
  const { openDemo } = useDemo();
  const plan = plans[selected];

  const setPlan = (key) => setSelected(key);

  const onKeyDown = (event) => {
    const current = order.indexOf(event.target.dataset.plan);
    if (current < 0) return;
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (current + 1) % order.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (current + order.length - 1) % order.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = order.length - 1;
    else return;
    event.preventDefault();
    setPlan(order[next]);
    rows.current?.querySelector(`[data-plan="${order[next]}"]`)?.focus({ preventScroll: true });
  };

  return (
    <section className="wrap pricing" id="piani">
      <p className="section-label">A OGNUNO LA SUA ESTATE</p>
      <div className="section-heading">
        <h2>Una formula<br />per la tua stagione.</h2>
        <p>Dal menu digitale al servizio completo.<br />Seleziona un piano per vedere cosa include.</p>
      </div>
      <div className="pricing-layout">
        <div className="plan-rows" role="tablist" aria-label="Piani stagionali" aria-orientation="vertical" onKeyDown={onKeyDown} ref={rows}>
          <button
            className="plan-row" role="tab" id="plan-starter" data-plan="starter"
            aria-selected={selected === 'starter'} aria-controls="plan-detail" tabIndex={selected === 'starter' ? 0 : -1}
            onClick={() => setPlan('starter')}
          >
            <span><strong>Starter</strong><small>Le basi per cominciare.</small></span>
            <span className="plan-price">399 €<span>per stagione</span></span>
          </button>
          <button
            className="plan-row" role="tab" id="plan-pro" data-plan="pro"
            aria-selected={selected === 'pro'} aria-controls="plan-detail" tabIndex={selected === 'pro' ? 0 : -1}
            onClick={() => setPlan('pro')}
          >
            <span><strong>Pro</strong><small>Il flusso completo di ordinazione.</small></span>
            <span className="plan-price">599 €<span>per stagione</span></span>
          </button>
          <button
            className="plan-row" role="tab" id="plan-premium" data-plan="premium"
            aria-selected={selected === 'premium'} aria-controls="plan-detail" tabIndex={selected === 'premium' ? 0 : -1}
            onClick={() => setPlan('premium')}
          >
            <span><strong>Premium</strong><small>Un avvio accompagnato.</small></span>
            <span className="plan-price">899 €<span>per stagione</span></span>
          </button>
        </div>
        <div className="plan-detail" id="plan-detail" role="tabpanel" aria-labelledby={`plan-${selected}`} tabIndex={0} key={selected}>
          <h3>{plan.title}</h3>
          <p>{plan.description}</p>
          <ul>
            {plan.features.map((feature) => (
              <li key={feature}><svg aria-hidden="true"><use href="#business-check" /></svg>{feature}</li>
            ))}
          </ul>
          <button className="text-link" type="button" onClick={openDemo}>Esplora la demo del prodotto</button>
        </div>
      </div>
      <p className="fine">Proposte di prezzo da validare per il lancio. Nessun acquisto attivato su questa pagina.</p>
    </section>
  );
}
