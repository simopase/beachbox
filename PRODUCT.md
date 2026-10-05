# Product — BeachBox

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated and confirmed by user: static HTML homepage (main CSS/JS embedded, scroll-story CSS/JS and GSAP runtime stored locally, assets downloaded locally so the page opens offline with a double-click and hosts anywhere: Vercel, Netlify, GitHub Pages).

## Users

Primary audience of this surface: Italian owners/managers of stabilimenti balneari, chioschi and beach bars (decision: "Will this make me money and is it easy?"). Often non-technical, seasonal-minded, met in person during commercial presentations. End users of the product (not this page's audience): bathers ordering from their ombrellone.

## Product Purpose

BeachBox lets beach clients order food & drinks from their umbrella by scanning a unique QR code tied to that postazione: menu → cart → online payment → order lands in realtime on the establishment's dashboard → staff delivers to the right umbrella. Success = more orders, higher average ticket, shorter bar queues, zero wrong-umbrella deliveries.

## Positioning

Not a digital menu: "Il bar arriva sotto l'ombrellone." No app download, no registration, no manual umbrella number entry; every order is prepaid and pre-addressed to the postazione. The landing must answer: Cos'è? Perché mi serve? Quanto posso guadagnarci? Quanto è difficile installarlo?

## Operating Context

Seasonal business (estate, ~90+ giorni). Owners think in ombrelloni, scontrino medio, code ai picchi, personale. Landing is shown live in sales meetings and on laptops/phones: must work offline-ish (local assets), be in Italian, and include the interactive economic simulator (AGENT.md §19) as the concrete value demonstration.

## Capabilities and Constraints

MVP per AGENT.md: per-ombrellone QR with non-guessable token, menu with categories/prices/availability, cart, prepaid checkout (card/Apple Pay/Google Pay via Stripe), realtime order dashboard (NUOVI → IN PREPARAZIONE → PRONTI → CONSEGNATI) tablet-first, order history. No app, no login for clients. Explicitly out: loyalty, coupons, bookings, AI, POS replacement. Pricing hypothesis to validate: Starter 399 €, Pro 599 €, Premium 899 € per stagione (AGENT.md §16).

## Brand Commitments

La direzione confermata più recente è Premium in `beachbox-scroll-premium.html`, con la storia scroll e le sezioni commerciali/operative trasferite da `index.html`. Per gli interventi successivi usare Premium come base. Il menu QR della postazione 24 e la dashboard condividono ordini dimostrativi solo nello stesso browser e sulla stessa origine; non esiste un backend attivo.

Name: BeachBox (confirmed by the user; do not propose alternative names). Official logo and palette: assets/beachbox-brand/. All prior previews were removed by the user. The current homepage in index.html, “L’estate, servita meglio”, is the preferred base and now includes a GSAP scroll story: a guest under an umbrella scans the QR and opens the BeachBox menu. Keep developing this homepage; do not recreate the deleted previews. The former “Il Chiosco” direction is superseded and must not guide new designs. Language: Italian only. Contacts: intentionally left empty/placeholder for now (user will fill later). No invented customers, testimonials, or case studies — product has no pilot client yet.

## Evidence on Hand

AGENT.md (project brief, complete: structure §21, messages §20, simulator §19, pricing §16). User-provided brand assets (PNG and SVG), approved logo reference and palette in assets/beachbox-brand/. Current homepage: dedicated AI-generated beach lifestyle hero in assets/homepage/ (prompt and provenance recorded there). Local photographs in assets/img/ belong to previous explorations. No real customer results yet. Dashboard/phone previews on the landing are synthetic demo material (fictional stabilimento "Bagno Paradiso", umbrella 37) and must stay clearly demonstrative.

## Product Principles

1. Ridurre la distanza tra cliente e punto vendita: ogni attrito eliminato è un ordine guadagnato.
2. Zero attrito per il bagnante: scansiona → ordina → paga → ricevi.
3. Ogni ordine è pagato e associato alla postazione prima di entrare in cucina.
4. Il valore si dimostra in euro, non in feature: il simulatore è il cuore della vendita.
5. Semplicità operativa per personale non tecnico, anche sotto picco.

## Accessibility & Inclusion

Visible focus, skip link, native modal dialog and FAQ, keyboard-operated vertical tabs, labelled sliders, polite status announcements, reduced motion, responsive layout to 320 px.
