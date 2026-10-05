# Design — BeachBox

## Homepage attuale

L’utente ha scelto `beachbox-scroll-premium.html` come direzione definitiva. La pagina mantiene l’intro e la storia scroll approvate e ora include le sezioni operative di `index.html`: dashboard interattiva, simulatore del fatturato aggiuntivo, configurazione, piani e FAQ. Layout e tipografia seguono Premium; CSS e logica delle nuove sezioni sono in `assets/scroll-premium/business.css` e `business.js`. La demo usa ombrellone 24 e gli stessi prodotti/prezzi del telefono e del menu QR. `demo-orders.js` conserva e sincronizza le comande dimostrative tra pagine/schede sulla stessa origine nello stesso browser, con fallback in memoria se lo storage non è disponibile. È una simulazione locale, senza backend o sincronizzazione tra dispositivi. `index.html` resta il riferimento precedente.

`index.html` mantiene la direzione «L’estate, servita meglio» scelta come base dall’utente. Le preview precedenti sono state eliminate dall’utente: non ripristinarle. La direzione «Il Chiosco» è superata.

La homepage ora comprende una sequenza GSAP legata allo scroll: una persona sul lettino, sotto l’ombrellone, alza il telefono, inquadra il QR e apre il menu BeachBox. Il telefono passa dalla mano al primo piano; la storia termina con la conferma dell’ordine al bar.

## Identità

Conservare il marchio originale: due toast illustrati, tre raggi e wordmark BeachBox. Master in `assets/beachbox-brand/svg/`, esportazioni in `png/`. Payoff: «Ordina. Rilassati. Arriviamo noi.».

Palette: blu `#0D2D4A`, arancio `#F28B2A`, sabbia `#FFE6C7`, crema `#FFF9F1`. Azzurro `#EAF4F7` per il mare e il simulatore. Testo secondario chiaro su blu `#C3D1DC`.

Tipografia: display `Arial Rounded MT Bold`, `ui-rounded`, Archivo 800 come fallback; Archivo locale per testo e UI. Titoli arrotondati, misura breve e spaziatura stretta, coerenti con il logo. Italiano in tutta la pagina.

## Composizione e movimento

1. Hero asimmetrica con titolo e spiegazione, fotografia panoramica, menu dimostrativo e disco arancio. Entrata leggera dei testi, piccolo zoom della foto e rotazione del disco durante lo scroll.
2. Fascia arancio con benefici che entrano con un breve movimento.
3. Percorso cliente in una scena illustrata a piena larghezza. Pannello fissato temporaneamente durante lo scroll; progressione reversibile, senza intercettare rotella o touch. Quattro passaggi: Relax → Inquadra → Ordina → Arriviamo. Pulsanti e tastiera permettono anche la selezione diretta.
4. Dashboard blu con ordini modificabili, simulatore economico azzurro, configurazione, piani, FAQ e invito finale. Entrate discrete dei contenuti principali.

L’illustrazione è SVG nativo incorporato in `index.html`: ombrellone, persona, lettino, QR, braccio e telefono sono elementi separati. Il menu illustrativo usa HTML in `foreignObject` per restare nitido. Il logo utilizza sempre gli asset ufficiali. Il QR identifica soltanto una demo, non un servizio attivo.

Il telefono ha trasformazioni SVG esplicite calcolate dalla timeline per evitare che il contenuto HTML alteri l’origine delle trasformazioni. La posa finale si adatta alle dimensioni reali della scena, anche dopo un ridimensionamento. La scena completa resta visibile sui tablet verticali; i testi dei passaggi occupano uno spazio costante su mobile.

## File e runtime

- `index.html`: homepage, SVG della scena e logica della demo originale.
- `assets/homepage/scroll-story.css`: composizione e UI della scena responsive.
- `assets/homepage/scroll-story.js`: timeline, ScrollTrigger, controlli e movimento delle altre sezioni.
- `assets/vendor/gsap.min.js` e `ScrollTrigger.min.js`: GSAP 3.14.2, copie locali con intestazioni di licenza originali. Provenienza in `assets/vendor/README.md`.

Nessuna richiesta a CDN durante l’uso. La pagina continua a essere statica e apribile offline con doppio clic, mantenendo la cartella assets. Se GSAP non si carica o è attiva la preferenza `prefers-reduced-motion`, non si fissa la sezione: i quattro pulsanti mostrano le pose statiche. Non nascondere i contenuti essenziali quando l’animazione non è disponibile.

## Demo e accessibilità

La demo originale resta attiva: aggiunta/rimozione prodotti, totale, blocco del carrello vuoto, invio simulato alla dashboard, preparazione, pronto, consegnato e ripristino. Simulatore: ordini extra × scontrino medio × giorni; importo lordo ipotetico, non utile o risultato commerciale. Piani a tab e FAQ native.

Focus visibile, navigazione mobile, dialog nativo, tab con `aria-selected` e roving tabindex. I tasti freccia, Home ed End selezionano i passaggi. Lo scroll non sposta il focus. Il menu nella scena SVG è illustrativo; «Ora prova tu» apre la vera demo interattiva della pagina.

Nessun pagamento reale, invio esterno, raccolta dati, cliente, testimonianza o risultato inventato. I prezzi stagionali sono ipotesi da validare.

## Asset e verifiche

Fotografia principale generata con ImageGen: `assets/homepage/beachbox-summer-hero.png`; provenienza e prompt nella stessa cartella. Il footer ne dichiara l’origine. L’illustrazione animata è costruita in SVG, senza generare una nuova fotografia.

Verificati i quattro passaggi avanti e indietro, scroll con rotella, selezione diretta e da tastiera, vista menu senza tagli, desktop 1440 px, tablet 1024 e 768 px, mobile 390 e 320 px e viewport basso 390 × 600. Nessun overflow orizzontale. Verificati anche reduced motion, assenza del runtime GSAP, carrello, ordine alla dashboard, consegna, simulatore e piani.

La verifica visiva usa una copia temporanea della pagina con asset incorporati; solo la foto della copia QA è ridotta per il trasferimento al browser. Gli asset consegnati restano originali. Screenshot QA in `/private/tmp/beachbox-motion-*.png`; nessuna cartella preview ricreata.
