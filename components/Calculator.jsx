'use client';

/* Simulatore: ordini extra × scontrino medio × giorni di apertura. */
import { useState } from 'react';

const roundedEuro = (amount) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);

export default function Calculator() {
  const [extras, setExtras] = useState(8);
  const [ticket, setTicket] = useState(14);
  const [days, setDays] = useState(90);
  const revenue = extras * ticket * days;

  return (
    <section className="wrap calculator" id="simulatore">
      <div>
        <p className="section-label">FACCIAMO DUE CONTI</p>
        <h2>Piccole pause.<br />Nuove possibilità.</h2>
        <p className="calculator-intro">
          Quanto possono valere qualche ordine in più e un servizio più comodo? Metti alla prova la tua stagione.
        </p>
        <div className="calc-result">
          <p>Fatturato aggiuntivo ipotetico per stagione</p>
          <output id="revenue" aria-live="polite">{roundedEuro(revenue)}</output>
          <p className="fine">
            Una simulazione, non una promessa. L’importo è fatturato lordo: non considera costi, imposte o commissioni.
          </p>
        </div>
      </div>
      <div className="calc-controls">
        <div className="calc-controls-top">
          <span>DISEGNA LA TUA STAGIONE</span>
          <svg aria-hidden="true"><use href="#business-arrow" /></svg>
        </div>
        <label>
          <span>Ordini extra al giorno <b id="orders-value">{extras}</b></span>
          <input
            type="range" id="extra-orders" min="1" max="40" value={extras}
            aria-label="Ordini extra al giorno" aria-valuetext={`${extras} ordini extra al giorno`}
            onChange={(event) => setExtras(Number(event.target.value))}
          />
        </label>
        <label>
          <span>Scontrino medio <b id="ticket-value">{ticket} €</b></span>
          <input
            type="range" id="average-ticket" min="3" max="40" value={ticket}
            aria-label="Scontrino medio in euro" aria-valuetext={`${ticket} euro`}
            onChange={(event) => setTicket(Number(event.target.value))}
          />
        </label>
        <label>
          <span>Giorni di apertura <b id="days-value">{days}</b></span>
          <input
            type="range" id="opening-days" min="30" max="180" value={days}
            aria-label="Giorni di apertura" aria-valuetext={`${days} giorni`}
            onChange={(event) => setDays(Number(event.target.value))}
          />
        </label>
        <div className="calc-formula" id="calc-formula">
          {extras} {extras === 1 ? 'ordine' : 'ordini'} × {ticket} € × {days} giorni
        </div>
      </div>
    </section>
  );
}
