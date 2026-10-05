# BeachBox — Premium e versioni di confronto

Premium è la versione scelta dall’utente. Ora contiene le sezioni di `index.html` per il gestore: dashboard, simulatore del fatturato aggiuntivo, configurazione, piani e FAQ. La navigazione porta alle sezioni della pagina e la chiusura invita a provare menu e dashboard.

`business.css` e `business.js` gestiscono le sezioni aggiunte, con stili limitati a `.business` e al dialog della demo. `demo-orders.js` gestisce le comande condivise tra il menu QR e la dashboard. I dati sono salvati soltanto nel browser; le schede sulla stessa origine vengono aggiornate tramite l’evento storage. Browser/dispositivi diversi non condividono la demo. Se lo storage è bloccato, le funzioni sulla singola pagina restano disponibili in memoria. «Ripristina gli ordini demo» ripristina tre comande iniziali.

Prodotti coerenti in telefono, menu e dialog: Spritz 6 €, Toast 7,50 €, Acqua 2 €, Cola 3 €. L’ordine demo iniziale Spritz + Toast + Cola vale 16,50 € ed è associato all’ombrellone 24. Il simulatore conserva la formula del riferimento: ordini extra × scontrino medio × giorni di apertura, fatturato lordo ipotetico.

- `beachbox-scroll-premium.html`: versione fedele, fotografia a pieno schermo e SVG in primo piano.
- `beachbox-scroll-riviera.html`: direzione fotografica/editoriale, composizione asimmetrica e tipografia serif.
- `beachbox-scroll-illustrata.html`: scena completamente vettoriale, colori del marchio e dettagli illustrati.
- `beachbox-scroll-confronto.html`: confronto e accesso alle tre versioni.
- `beachbox-menu-demo.html`: menu interattivo dell’ombrellone 24, carrello e invio simulato.

Tutti gli asset e i runtime sono locali. Le pagine si aprono anche da file. Il QR codifica l’URL del menu sulla stessa origine HTTP della pagina; da file codifica `http://localhost:8765/beachbox-menu-demo.html?ombrellone=24`. Per una scansione da telefono serve aprire il sito sul relativo indirizzo di rete, raggiungibile da quel telefono. Nessun dominio di produzione è stato inventato. Nessun pagamento o ordine esterno.

La foto `spiaggia.png` è stata generata con il tool integrato ImageGen il 5 ottobre 2026. Prompt completo in `imagegen-prompt.txt`. È uno sfondo continuo, senza i cinque pannelli dell’immagine originale, ed è mostrata con object-fit: cover e un massimo di 4,5% di zoom. Dimensioni originali: 1536 × 1024. Gli SVG di spiaggia e ombrellone sono asset nativi, indipendenti dalla fotografia. Marchio ufficiale in `assets/beachbox-brand/`.

Generazione QR tramite [qrcode-generator, repository ufficiale](https://github.com/kazuhikoarase/qrcode-generator/tree/master/js), copia locale in `assets/vendor/qrcode.js`, con intestazione e licenza MIT originali conservate. Correzione errori M, quiet zone bianca di quattro moduli, stesso QR nella targhetta e nella fotocamera. Nessuna richiesta a CDN durante l’uso.

La timeline non intercetta rotella o touch. Cinque pulsanti, frecce, Home ed End permettono la selezione diretta. Con reduced motion, scena statica e pulsanti per ogni passaggio. Il telefono della storia è un’anteprima narrativa; la demo completa è nella pagina menu dedicata.

Verifica finale: cinque passaggi e assenza di sovrapposizioni/overflow su tutte e tre le versioni a 320 × 600; Premium a 390 × 844; Illustrata a 768 × 900; controllo visivo desktop a 1440 px. Tastiera Home/End, QR delle tre versioni sullo stesso URL di rete, asset locali senza riferimenti mancanti e sintassi JavaScript verificati. Demo: carrello vuoto bloccato, ordine Spritz + Toast + Cola = 16,50 €, quantità a 22,50 € e ritorno a 16,50 €, conferma, ripristino, filtro Food, focus conservato e vista mobile senza overflow. Il QR non è stato scansionato da un telefono fisico.

Verifica dell’integrazione business: ordine locale di 16,50 € e carrello vuoto bloccato; avanzamento Nuovi → In preparazione → Pronti → Consegnato e ripristino; menu QR in una seconda scheda con aggiornamento della dashboard senza ricarica e persistenza al ritorno alla pagina; simulatore 8 × 14 × 90 = 10.080 €, 9 × 14 × 90 = 11.340 €, minimo 1 × 3 × 30 = 90 € e massimo 40 × 40 × 180 = 288.000 €; selezione piani da tastiera, FAQ, Escape e ripristino focus del dialog; nessun overflow a 320 × 600, 390 × 844 e 768 × 900; controllo visivo desktop a 1440 px e nessun errore console. Screenshot finali in /private/tmp/beachbox-premium-dashboard.png e /private/tmp/beachbox-premium-simulatore.png.
