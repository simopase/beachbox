# BeachBox — L’estate, servita meglio, con scroll story

Conservare la homepage che piace all’utente: titolo arrotondato, fotografia estiva, marchio originale e palette blu/arancio/sabbia. Le proposte precedenti sono state eliminate dall’utente.

La firma della nuova versione è un racconto illustrato animato con GSAP + ScrollTrigger:

1. Una persona si rilassa sul lettino, sotto l’ombrellone.
2. Alza il telefono e inquadra il QR fisico della postazione 37.
3. Il QR viene riconosciuto; il telefono passa al primo piano e si apre il menu BeachBox nel browser.
4. Compare la conferma dell’ordine al bar, associato all’ombrellone.

Lo scroll controlla la timeline in entrambe le direzioni. Il pannello resta visibile per il tempo della sequenza, poi lascia spazio alla dashboard. Quattro controlli permettono di saltare ai passaggi anche da tastiera. Reduced motion e assenza di GSAP mostrano pose statiche selezionabili.

SVG nativo per animare separatamente persona, braccio, QR e telefono; UI del menu in HTML dentro SVG. Nessun logo ridisegnato. Dimensioni del telefono calcolate dal viewport della scena per mantenerlo interamente visibile. Runtime salvato localmente per l’uso offline.

Il resto della pagina acquista un movimento leggero: entrata dei testi iniziali, foto con piccolo zoom, disco arancio che ruota, benefici e sezioni che compaiono durante lo scroll. Il percorso illustrato resta il protagonista.

Tutte le comande e i pagamenti sono simulati. La demo interattiva originale, il simulatore economico e i piani restano funzionanti.
