'use client';

import Link from 'next/link';
import DemoProvider, { useDemo } from '@/components/DemoProvider';
import StoryStage, { DEMO_HREF } from '@/components/StoryStage';
import Dashboard from '@/components/Dashboard';
import Calculator from '@/components/Calculator';
import Pricing from '@/components/Pricing';

function Topbar() {
  const { openDemo } = useDemo();
  return (
    <header className="topbar">
      <Link href="#hero-title" aria-label="BeachBox, torna all’inizio">
        <img className="logo" src="/assets/beachbox-brand/svg/beachbox-logo-horizontal-no-payoff.svg" alt="BeachBox" width="162" height="46" />
      </Link>
      <nav className="premium-nav" aria-label="Navigazione principale">
        <Link href="#story">Come funziona</Link>
        <Link href="#per-il-bar">Per il chiosco</Link>
        <Link href="#simulatore">Simulatore</Link>
        <Link href="#piani">Piani</Link>
        <button type="button" className="nav-demo" onClick={openDemo}>Prova la demo ↗</button>
      </nav>
    </header>
  );
}

function After() {
  const { openDemo } = useDemo();
  return (
    <section className="after">
      <div>
        <div className="eyebrow">Ordina. Rilassati. Arriviamo noi.</div>
        <h2>Scansiona. Ordina.<br />Goditi il mare.</h2>
        <p>Ogni ombrellone diventa un punto d’ordine. Il cliente sceglie, il bar riceve tutto e lo staff sa dove consegnare.</p>
        <div className="after-actions">
          <Link className="button-link" href={DEMO_HREF}>Prova il menu demo ↗</Link>
          <button className="button-link secondary" type="button" onClick={openDemo}>Prova la dashboard</button>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <DemoProvider>
      <Link href="#story" className="skip" replace={false}>Vai alla dimostrazione</Link>
      <Topbar />
      <main>
        <section className="intro" aria-labelledby="hero-title">
          <div className="intro-inner">
            <h1 id="hero-title">Il bar arriva<br />sotto <em>l’ombrellone.</em></h1>
            <p>Scansiona il QR, scegli quello che ti va e ordina.<br />Al resto pensiamo noi. Tu goditi il mare.</p>
            <Link className="hint" href="#story"><span className="arrow" aria-hidden="true">↓</span>Scorri per vedere come funziona</Link>
          </div>
        </section>
        <StoryStage />
        <div className="business">
          <Dashboard />
          <Calculator />
          <section className="wrap setup">
            <div>
              <p className="section-label">PRONTI PER LA BELLA STAGIONE</p>
              <h2>Il tuo menu.<br />La tua spiaggia.<br />Si parte da qui.</h2>
              <p>BeachBox si inserisce nel tuo servizio. Un QR per ogni postazione e una dashboard per il personale: l’essenziale per iniziare.</p>
              <Link href="#piani" className="button outline">Scopri i piani <svg aria-hidden="true"><use href="#business-arrow" /></svg></Link>
            </div>
            <div className="setup-list">
              <div>
                <span className="step-num">1</span>
                <div>
                  <strong>Portiamo online il tuo menu.</strong>
                  <p>Prodotti, categorie, immagini, prezzi e disponibilità.</p>
                </div>
              </div>
              <div>
                <span className="step-num">2</span>
                <div>
                  <strong>Ogni ombrellone ha il suo QR.</strong>
                  <p>Una postazione riconosciuta automaticamente, ordine dopo ordine.</p>
                </div>
              </div>
              <div>
                <span className="step-num">3</span>
                <div>
                  <strong>Il tuo staff apre la dashboard.</strong>
                  <p>Preparazione e consegna si gestiscono da una sola schermata.</p>
                </div>
              </div>
            </div>
          </section>
          <Pricing />
          <section className="wrap faq" id="faq">
            <div>
              <p className="section-label">ULTIME CURIOSITÀ</p>
              <h2>Le cose che<br />vuoi sapere.</h2>
              <p className="faq-intro">Dal telefono del cliente al bancone.<br />Qualche risposta prima di partire.</p>
            </div>
            <div>
              <details>
                <summary>Serve scaricare un’app?</summary>
                <p>No. Il cliente scansiona il QR e apre il menu nel browser del telefono. Non deve registrarsi o creare un account.</p>
              </details>
              <details>
                <summary>Come viene riconosciuto l’ombrellone?</summary>
                <p>Ogni postazione ha il proprio QR univoco. Il menu e l’ordine sono associati automaticamente allo stabilimento e all’ombrellone corretto.</p>
              </details>
              <details>
                <summary>Quando paga il cliente?</summary>
                <p>Il flusso BeachBox prevede il pagamento online prima della preparazione. La dashboard riceve la comanda quando il pagamento è confermato. La demo di questa pagina non effettua addebiti.</p>
              </details>
              <details>
                <summary>Posso aggiornare il menu durante la giornata?</summary>
                <p>Il prodotto prevede la gestione di prezzi e disponibilità: puoi indicare i prodotti non disponibili per evitare ordini che non puoi preparare.</p>
              </details>
              <details>
                <summary>La demo invia ordini a un bar reale?</summary>
                <p>No. Menu, stabilimento e comande sono dimostrativi. Puoi provare l’intero percorso senza effettuare acquisti, inviare dati o contattare uno stabilimento.</p>
              </details>
            </div>
          </section>
        </div>
        <After />
      </main>
      <footer className="business-footer">
        <div className="footer-top">
          <div>
            <Link href="#hero-title" aria-label="BeachBox, torna all’inizio">
              <img className="footer-logo" src="/assets/beachbox-brand/svg/beachbox-logo-horizontal-no-payoff.svg" alt="BeachBox" width="160" height="46" />
            </Link>
            <p className="payoff">Ordina. Rilassati. Arriviamo noi.</p>
          </div>
          <nav className="footer-links" aria-label="Navigazione footer">
            <Link href="#per-il-bar">Per il tuo bar</Link>
            <Link href="#simulatore">Simulatore</Link>
            <Link href="#piani">I piani</Link>
            <Link href="#faq">FAQ</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© 2026 BeachBox</span>
          <p>Homepage dimostrativa. Ordini, menu e prezzi sono esempi; la fotografia principale è generata con AI. Pagamenti e contatti commerciali non sono attivi.</p>
        </div>
      </footer>
    </DemoProvider>
  );
}
