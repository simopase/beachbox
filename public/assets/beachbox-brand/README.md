# BeachBox — vettorializzazione del logo approvato

Riferimento: BeachBox_schemaGraphics.png, fornito dall’utente. Questa versione sostituisce il precedente pacchetto con le due B geometriche, che non rappresentava il logo approvato.

Il marchio conserva due toast illustrati sfalsati, crosta arancione, mollica chiara, separazione crema, tre raggi e wordmark arrotondato. Le sagome dei toast sono ricostruite con curve Bézier; wordmark e payoff sono ricalcati dal logo principale della tavola. Le irregolarità microscopiche e la texture raster non sono riprodotte: colori, luci e ombra sono forme e gradienti vettoriali.

## File SVG
- primary: logo principale verticale con payoff.
- icon: simbolo illustrato con ombra vettoriale.
- horizontal: versione orizzontale con payoff.
- dark: versione con wordmark crema e contorno chiaro, per fondi blu/scuri.
- light: versione originale a colori, per fondi chiari.
- monochrome / monochrome-white: versione a un colore, con controforme aperte.
- icon-monochrome / icon-dark: simboli per un colore e fondi scuri.
- wordmark: solo BeachBox, dal riferimento.
- horizontal-no-payoff: composizione per formati ridotti.
- favicon: simbolo in riquadro crema.
- icon-small: favicon con dettagli minimi rimossi per piccoli formati.

Tutti gli SVG sono trasparenti, salvo i due favicon. Nessun raster incorporato, nessuna risorsa esterna, nessun font necessario. Le lettere sono tracciati. Figma e Illustrator possono importare curve, gruppi e gradienti.

## Palette della tavola
Blu #0D2D4A · Arancio #F28B2A · Sabbia #FFE6C7 · Arancio scuro #D46A1F · Crema #FFF9F1. Le sfumature del simbolo utilizzano tonalità intermedie per conservare l’effetto illustrato.

## Uso
Usare il logo principale per dimensioni sufficienti a leggere il payoff; la versione senza payoff per formati più piccoli. Come riferimento, il payoff deve essere visualizzato almeno a circa 12 px di altezza sul web o 2,5 mm in stampa. Lasciare attorno al logo almeno uno spazio pari alla larghezza del raggio centrale.

Le esportazioni a 16, 32 e 48 px utilizzano icon-small. A 16 px il marchio si legge come un simbolo toast: il dettaglio delle singole B emerge da 32 px. Verificare sempre sul supporto finale.

Per QR sugli ombrelloni: affiancare l’icona al codice e mantenerne libera la zona di rispetto. Il pacchetto non genera un QR. Se inserito dentro un QR, il codice finale deve essere verificato con prove di scansione.

SVG in RGB/sRGB. Per stampa definire conversione CMYK o tinte piatte con la tipografia, in base al materiale. Nessun Pantone assegnato. Il marchio monocromatico è adatto a una sola tinta.

Le anteprime sono in preview; i PNG sono esportazioni derivate; i master sono gli SVG. La fonte nomina Nunito Rounded, ma il wordmark è ricalcato in tracciati e nessun file font è incluso.
