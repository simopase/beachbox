# BeachBox — QR Ordering per Stabilimenti Balneari

## Identità e lavoro grafico

Il nome ufficiale del progetto è **BeachBox** (confermato dall’utente). Il payoff del marchio è «Ordina. Rilassati. Arriviamo noi.».

- Asset ufficiali: `assets/beachbox-brand/`; master vettoriali in `svg/`, esportazioni in `png/`, palette in `palette.json`.
- Conservare il logo fornito: due toast illustrati, tre raggi e wordmark originale. Non ridisegnarlo.
- Palette: blu `#0D2D4A`, arancio `#F28B2A`, sabbia `#FFE6C7`, arancio scuro `#D46A1F`, crema `#FFF9F1`.
- Le proposte grafiche devono partire da zero: la precedente direzione «Il Chiosco» è superata e non va usata come riferimento.
- Homepage scelta più recentemente dall’utente: `beachbox-scroll-premium.html`, con intro e scena scroll Premium approvate, dashboard, simulatore, configurazione, piani e FAQ. `index.html` è il riferimento precedente da cui provengono le sezioni per il gestore. Usare Premium come base; dettagli in `DESIGN.md`.
- Usare la skill `frontend-design` disponibile per composizione e verifica visiva; non ereditare i contratti della vecchia landing.
- Non inventare clienti, testimonianze o risultati commerciali. Menu, ordini e calcoli sono esempi dichiarati.

## 1. Panoramica

Il progetto consiste nella realizzazione di un software dedicato a **stabilimenti balneari, chioschi e bar sulla spiaggia** che consente ai clienti di ordinare direttamente dal proprio ombrellone tramite un **QR code univoco associato a ogni postazione**.

Il cliente non deve installare un'app e non deve registrarsi. Il flusso ideale è:

1. scansione del QR code;
2. riconoscimento automatico di stabilimento e ombrellone;
3. apertura del menu;
4. aggiunta dei prodotti al carrello;
5. pagamento online;
6. invio dell'ordine al bar/chiosco;
7. preparazione;
8. consegna all'ombrellone.

L'obiettivo non è creare un semplice menu digitale, ma **ridurre al minimo la distanza tra il cliente e il punto vendita**, aumentando comodità, velocità e potenziale fatturato.

---

## 2. Problema da risolvere

Oggi, in molti stabilimenti balneari, il processo di ordinazione è ancora molto tradizionale.

Il cliente deve:

- alzarsi dall'ombrellone;
- raggiungere il bar;
- fare eventualmente la fila;
- ordinare;
- aspettare;
- tornare alla propria postazione.

In alternativa, lo stabilimento deve impiegare personale che passi tra gli ombrelloni per raccogliere gli ordini.

Questo può generare:

- code al bar;
- tempi di attesa;
- errori nella presa dell'ordine;
- confusione sul numero dell'ombrellone;
- costi operativi;
- minore propensione a effettuare ordini aggiuntivi;
- scarsa visibilità sui dati di vendita.

Il vero problema da risolvere è quindi:

> **rendere l'ordine dall'ombrellone immediato, semplice e conveniente per entrambe le parti.**

---

## 3. Soluzione

Ogni ombrellone riceve un QR code univoco.

```text
Ombrellone 37
      ↓
QR CODE
      ↓
Menu digitale
      ↓
Ordine
      ↓
Pagamento
      ↓
Dashboard del bar
      ↓
Preparazione
      ↓
Consegna all'ombrellone 37
```

Il QR dovrebbe usare un token non facilmente prevedibile, ad esempio:

```text
https://app.example.it/o/8df7sK2p
```

che internamente identifica:

```text
business_id = 12
umbrella_id = 37
```

È preferibile evitare URL come:

```text
/umbrella/37
```

perché permetterebbero di modificare facilmente il numero della postazione.

---

## 4. Proposta di valore

### Per il cliente

Il cliente può:

- ordinare senza lasciare l'ombrellone;
- evitare code;
- consultare prezzi e disponibilità;
- pagare dallo smartphone;
- ricevere il servizio direttamente alla propria postazione.

Il sistema non deve richiedere:

- download;
- registrazione;
- login;
- inserimento manuale del numero dell'ombrellone.

La UX deve essere estremamente semplice:

```text
SCANSIONA → ORDINA → PAGA → RICEVI
```

### Per il gestore

Il gestore può ottenere:

- più ordini;
- maggiore scontrino medio;
- meno code al bar;
- meno errori;
- migliore gestione dei picchi;
- ordini già associati alla postazione corretta;
- disponibilità prodotti aggiornata;
- storico degli ordini;
- dati sulle vendite;
- migliore organizzazione del personale.

Il prodotto non dovrebbe essere venduto come:

> "Un menu digitale con QR code."

Ma come:

> **"Un sistema che permette ai tuoi clienti di ordinare e pagare direttamente dall'ombrellone, aumentando le vendite e riducendo le code al bar."**

---

## 5. Flusso cliente

### 5.1 Scansione

Sul supporto fisico dell'ombrellone:

```text
ORDINA DAL TUO OMBRELLONE

Scansiona il QR
Ordina
Paga
Ricevi qui
```

### 5.2 Menu

La pagina mostra:

- nome dello stabilimento;
- numero dell'ombrellone;
- categorie;
- prodotti;
- prezzi;
- immagini;
- disponibilità.

Esempio:

```text
Bagno Paradiso
Ombrellone 37

Bevande
Cocktail
Panini
Piadine
Gelati
Snack
```

### 5.3 Carrello

```text
2x Coca Cola        6,00 €
1x Piadina          8,50 €
1x Acqua            1,50 €

Totale             16,00 €
```

### 5.4 Pagamento

Per l'MVP è consigliabile privilegiare il **pagamento anticipato**:

- carta;
- Apple Pay;
- Google Pay.

Questo riduce drasticamente il problema degli ordini falsi.

### 5.5 Conferma

Dopo il pagamento:

```text
Ordine #A123

Pagamento ricevuto.
Stiamo preparando il tuo ordine.

Consegna:
Ombrellone 37
```

In futuro si potrà mostrare lo stato:

```text
Ricevuto
↓
In preparazione
↓
Pronto
↓
In consegna
↓
Consegnato
```

---

## 6. Flusso del gestore

Il personale utilizza una dashboard, idealmente ottimizzata per tablet.

Esempio ordine:

```text
Ombrellone 37

2x Coca Cola
1x Piadina
1x Acqua

Totale: 16,00 €

PAGATO
```

Stati ordine:

```text
NUOVO
↓
IN PREPARAZIONE
↓
PRONTO
↓
CONSEGNATO
```

Gli ordini devono comparire in tempo reale, senza refresh manuale.

---

## 7. Dashboard operativa

Possibile struttura:

```text
NUOVI        PREPARAZIONE        PRONTI

37           54                  12
21           68                  31
43
```

Funzioni principali:

- visualizzazione nuovi ordini;
- dettaglio prodotti;
- numero ombrellone;
- totale;
- stato pagamento;
- orario ordine;
- cambio stato;
- filtri;
- storico ordini.

---

## 8. MVP

La prima versione deve restare semplice.

### Stabilimento

- account;
- configurazione business;
- nome;
- logo;
- dati principali.

### Ombrelloni

- creazione ombrelloni;
- numero;
- token QR;
- generazione QR;
- possibilità di rigenerazione.

### Menu

- categorie;
- prodotti;
- descrizione;
- prezzo;
- immagine;
- disponibilità.

### Ordini

- ordine associato automaticamente all'ombrellone;
- pagamento;
- stato ordine;
- storico.

### Dashboard

- ordini realtime;
- evidenza nuovi ordini;
- cambio stato.

### Pagamenti

- Stripe;
- carte;
- Apple Pay;
- Google Pay dove disponibile.

---

## 9. Cosa NON inserire subito

Per evitare un MVP troppo complesso:

- loyalty;
- punti;
- coupon complessi;
- CRM;
- prenotazione ombrelloni;
- prenotazione parcheggi;
- prenotazione tavoli;
- gestionale completo dello stabilimento;
- AI;
- chatbot;
- POS completo;
- fatturazione;
- marketplace.

Queste funzionalità vanno aggiunte solo dopo aver raccolto esigenze reali.

---

## 10. Evoluzione futura

Dal semplice food ordering il prodotto potrebbe espandersi verso:

```text
Prenota ombrellone
Ordina cibo
Ordina bevande
Prenota pedalò
Prenota SUP
Prenota beach volley
Prenota massaggio
Richiedi assistenza
Prenota parcheggio
Acquista eventi
```

La visione di lungo periodo può essere quella di diventare un vero **sistema operativo digitale dello stabilimento balneare**.

---

## 11. Architettura tecnica

Stack suggerito:

```text
Frontend
Next.js
TypeScript

Backend / BaaS
Supabase

Database
PostgreSQL

Auth
Supabase Auth

Realtime
Supabase Realtime

Storage
Supabase Storage

Payments
Stripe

Hosting
Vercel
```

Schema:

```text
Cliente
   ↓
Next.js
   ↓
API / Server Actions
   ↓
Supabase / PostgreSQL
   ↓
Realtime
   ↓
Dashboard
```

---

## 12. Pagamenti e ordine

Flusso consigliato:

```text
Carrello
↓
Stripe
↓
Pagamento confermato
↓
Ordine creato/confermato
↓
Evento realtime
↓
Dashboard aggiornata
```

Da gestire correttamente:

- pagamento riuscito;
- pagamento fallito;
- duplicati;
- webhook;
- retry;
- idempotenza.

---

## 13. Modello dati concettuale

### businesses

```text
id
name
slug
logo
created_at
```

### umbrellas

```text
id
business_id
number
qr_token
active
created_at
```

### categories

```text
id
business_id
name
position
active
```

### products

```text
id
business_id
category_id
name
description
price
image_url
available
```

### orders

```text
id
business_id
umbrella_id
status
payment_status
total
created_at
```

### order_items

```text
id
order_id
product_id
product_name
unit_price
quantity
```

È utile salvare nome e prezzo del prodotto nell'ordine per mantenere uno storico corretto anche quando il menu cambia.

---

## 14. Multi-tenant e sicurezza

Il sistema dovrebbe nascere come SaaS multi-tenant.

Ogni stabilimento vede esclusivamente:

- i propri ombrelloni;
- i propri prodotti;
- i propri ordini;
- le proprie categorie;
- i propri dati.

```text
Business A
├── Ombrelloni
├── Menu
└── Ordini

Business B
├── Ombrelloni
├── Menu
└── Ordini
```

Le policy RLS del database devono garantire isolamento tra i tenant.

---

## 15. Sicurezza dei QR

Usare token casuali:

```text
/o/g7Hd92Kls
```

invece di identificativi sequenziali.

Rimane comunque possibile che qualcuno fotografi il QR e lo utilizzi successivamente.

La difesa più semplice nell'MVP è:

> **nessun ordine entra in lavorazione senza pagamento confermato.**

---

## 16. Business model

Il settore è stagionale, quindi un prezzo per stagione può essere più intuitivo di un SaaS mensile.

Esempio iniziale da validare:

### Starter

**399 € / stagione**

- QR;
- menu;
- dashboard ordini;
- gestione prodotti.

### Pro

**599 € / stagione**

- tutto Starter;
- pagamenti online;
- realtime;
- storico;
- analytics.

### Premium

**899 € / stagione**

- tutto Pro;
- personalizzazione;
- onboarding;
- supporto prioritario;
- configurazione iniziale.

Questi prezzi sono ipotesi da validare sul mercato.

---

## 17. Kit fisico

Per aumentare il valore percepito si può vendere il servizio come kit:

```text
BEACH ORDERING KIT

✓ configurazione stabilimento
✓ configurazione menu
✓ QR per ogni ombrellone
✓ dashboard
✓ pagamenti
✓ onboarding
✓ assistenza
```

Possibili supporti:

- adesivi resistenti;
- targhette;
- plastificati;
- supporti rigidi;
- grafiche personalizzate.

---

## 18. Convenienza economica

Esempio:

```text
100 ombrelloni
10 ordini aggiuntivi/giorno
15 € scontrino medio
90 giorni
```

Calcolo:

```text
10 × 15 € = 150 € / giorno
150 × 90 = 13.500 €
```

Non significa che tutto il fatturato sia attribuibile al software, ma dimostra quanto poco incremento serva per giustificare un costo di alcune centinaia di euro a stagione.

---

## 19. Simulatore commerciale

La landing può includere un simulatore con:

- numero ombrelloni;
- ordini extra/giorno;
- scontrino medio;
- giorni di apertura.

Output:

```text
Potenziale fatturato aggiuntivo
```

Esempio:

```text
80 ombrelloni
8 ordini extra
14 € scontrino medio
90 giorni

= 10.080 €
```

È utile durante una presentazione commerciale perché rende immediatamente concreto il valore.

---

## 20. Posizionamento

Messaggi deboli:

> Menu digitale per stabilimenti.

> QR code per ombrelloni.

Messaggi più efficaci:

> **Il bar arriva sotto l'ombrellone.**

> **Più ordini. Meno code. Nessuna app.**

> **Il cliente ordina dall'ombrellone. Tu ricevi l'ordine direttamente al bar.**

---

## 21. Landing page commerciale

La landing è pensata soprattutto per:

- proprietari di stabilimenti;
- gestori di chioschi;
- gestori di bar.

Deve rispondere a quattro domande:

```text
Cos'è?
Perché mi serve?
Quanto posso guadagnarci?
Quanto è difficile installarlo?
```

Struttura consigliata:

1. Hero;
2. problema attuale;
3. soluzione;
4. come funziona;
5. vantaggi;
6. demo dashboard;
7. simulatore economico;
8. pricing o richiesta demo;
9. FAQ;
10. CTA finale.

---

## 22. Strategia di validazione

### Fase 1 — 1 stabilimento pilota

Obiettivi:

- osservare il flusso reale;
- raccogliere feedback;
- trovare problemi operativi;
- capire il comportamento del personale.

### Fase 2 — 5/10 stabilimenti

Obiettivi:

- validare pricing;
- capire le feature davvero usate;
- migliorare onboarding;
- raccogliere casi d'uso.

### Fase 3 — 20/50 stabilimenti

Obiettivi:

- standardizzare onboarding;
- automatizzare configurazioni;
- creare case study;
- strutturare supporto.

---

## 23. Primo cliente e case study

Il primo cliente vale soprattutto per i dati che può generare.

Esempio di case study futuro:

```text
4.200 ordini
67.000 € transati
+18% ordini pomeridiani
6 min tempo medio di preparazione
```

Un caso reale del genere rende molto più semplice vendere agli stabilimenti successivi.

---

## 24. KPI

### Commerciali

- lead;
- demo richieste;
- demo effettuate;
- conversion rate;
- costo acquisizione cliente.

### Utilizzo

- scansioni QR;
- sessioni;
- ordini;
- conversione menu → ordine.

### Economiche

- GMV;
- scontrino medio;
- ordini medi/giorno;
- ricavo per stabilimento.

### Operative

- tempo ordine → preparazione;
- tempo ordine → consegna;
- ordini annullati;
- prodotti indisponibili.

---

## 25. Rischi principali

### Resistenza dei gestori

Possibile risposta:

> "Abbiamo sempre fatto così."

Contromisure:

- demo semplice;
- installazione guidata;
- pricing chiaro;
- pilot;
- case study.

### Sovraccarico operativo

Più ordini possono significare più pressione sul bar.

Servono:

- coda chiara;
- possibilità di sospendere temporaneamente gli ordini;
- gestione disponibilità;
- eventuali limiti.

### Connessione instabile

La dashboard dovrebbe:

- essere leggera;
- riconnettersi automaticamente;
- gestire bene disconnessioni temporanee.

### Ordini falsi

Pagamento anticipato come difesa principale.

---

## 26. Vantaggio competitivo

Il codice da solo non è un moat.

Il vantaggio deve essere costruito tramite:

```text
Distribuzione
+
Clienti
+
Brand
+
Integrazioni
+
Workflow
+
Dati
+
Case study
```

Più il prodotto entra nei processi dello stabilimento, maggiore diventa il costo di cambiare piattaforma.

---

## 27. Integrazioni future

Possibili integrazioni:

- POS;
- stampanti cucina;
- gestionali;
- casse;
- sistemi di prenotazione;
- CRM;
- software per stabilimenti;
- loyalty;
- contabilità.

---

## 28. Roadmap

### Versione 0.1

```text
Business
Umbrellas
QR
Menu
Cart
Stripe
Orders
Dashboard
Realtime
```

### Versione 0.2

```text
Analytics
Storico
Disponibilità
Notifiche
Migliore gestione stati
```

### Versione 0.3

```text
Multiutente
Ruoli dipendenti
Stampante cucina
Configurazioni avanzate
```

### Versione 1.0

```text
Onboarding automatizzato
Billing SaaS
Analytics completi
Gestione multi-area
Supporto strutturato
```

### Versione 2.0

```text
Prenotazioni
Servizi
Pedalò
SUP
Campi
Eventi
Parcheggi
Loyalty
```

---

## 29. Pitch sintetico

> Stiamo creando una piattaforma per stabilimenti balneari che permette ai clienti di ordinare cibo e bevande direttamente dall'ombrellone.
>
> Ogni ombrellone ha un QR code univoco: il cliente lo scansiona, apre il menu, ordina e paga dal telefono.
>
> Il bar riceve immediatamente l'ordine su una dashboard e sa già dove consegnarlo.
>
> Per il cliente significa niente code e nessuna app.
>
> Per lo stabilimento significa più ordini, meno errori e un servizio più efficiente.

Versione ultra breve:

```text
Un QR su ogni ombrellone.

Il cliente scansiona, ordina e paga.

Il bar riceve l'ordine.

Il personale lo porta direttamente sotto l'ombrellone.
```

---

## 30. Visione

Il QR rappresenta il punto di accesso digitale alla postazione del cliente.

In futuro:

```text
Ombrellone
    ↓
QR
    ↓
───────────────
Ordina
Prenota
Richiedi
Paga
Scopri
───────────────
```

La visione è evolvere da sistema di ordinazione a **piattaforma digitale per l'intera esperienza nello stabilimento balneare**.

---

## 31. Prossimi step

1. Nome definito: BeachBox. Valutare la nuova homepage in `index.html`.
2. Finalizzare la landing commerciale.
3. Preparare una demo completa:
   ```text
   QR → menu → carrello → pagamento demo → dashboard
   ```
4. Parlare con 3-5 stabilimenti.
5. Fare domande sul processo attuale.
6. Trovare uno stabilimento pilota.
7. Installare il sistema.
8. Misurare utilizzo e risultati.
9. Creare un case study.
10. Usare il case study per acquisire i clienti successivi.

Domande utili ai gestori:

- Come gestite oggi gli ordini dagli ombrelloni?
- Avete camerieri dedicati?
- Quanti ordini fate mediamente?
- In quali momenti si creano più code?
- Quali sono gli errori più frequenti?
- Quanto vi costa il personale dedicato?
- Usereste un sistema del genere?
- Quale sarebbe il principale ostacolo?
- Quanto sareste disposti a pagare?

---

# Conclusione

Il progetto è tecnicamente realizzabile con una complessità relativamente contenuta.

La sfida principale non è il codice, ma la **validazione commerciale** e l'integrazione del prodotto nel flusso operativo reale dello stabilimento.

Il valore deve essere dimostrato attraverso una combinazione di:

```text
più ordini
+
maggiore scontrino medio
+
meno code
+
meno errori
+
migliore esperienza cliente
```

Il punto di partenza ideale è quindi un MVP semplice e un singolo stabilimento pilota.

Se il prodotto riesce a dimostrare numericamente di generare valore per il primo cliente, il modello può essere replicato su decine o centinaia di stabilimenti.
