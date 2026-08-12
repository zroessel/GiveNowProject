# GiveNow

A concept donation app built around one idea: **donating should be one button away.**

No account creation, no scrolling through charity lists, no friction. Pick a cause,
dial in an amount with a simple stepper, tap Donate, and instantly see a concrete
impact statement — not a generic thank-you. A running dollar total and a growing 3D
town — houses, market stalls, wells, trees, schools — tie it all together as a
physical stand-in for what you've funded.

This is a portfolio/demo project. All charities and impact numbers are fictional, and
no real money ever moves — by default the donate flow is fully simulated. A real
[Stripe test-mode](https://stripe.com/docs/testing) Checkout integration is built in
and ready to go (see below) if you want to demo the actual payment flow.

## How it works

- **Give (Home)** — a charity banner fills the screen behind a floating header, with a
  price + unit-count stepper (`-`/`+`) and a change-charity dropdown underneath. Each
  charity has its own real-world-plausible cost per unit (e.g. $0.20/meal, $3.00/night
  of shelter). Tapping Donate instantly shows a specific impact statement (e.g. *"$3.00
  CAD = 15 hot meals delivered"*). If Stripe test keys are configured (see below), it
  routes through a real Stripe Checkout session first — the server always recomputes
  the charge amount itself from the charity + unit count, never trusting a client-sent
  dollar figure.
- **Map** — a 3D scene (React Three Fiber / Three.js) you can drag to rotate and pinch
  to zoom: a little town that grows as you give, along two real streets meeting at a
  central well. A house per night of shelter, a market stall per meal, a well per litre
  of water, a tree per sapling, a school per textbook — one building per unit funded, up
  to 12 per cause, interleaved so neighboring buildings are usually different types
  rather than grouped by cause. Buildings line both sides of the main street first, then
  spill onto a cross street once it fills up. The ground is a large low-poly terrain —
  flat where the town sits, gently faceted further out. Built from a curated subset of
  Kenney's CC0-licensed [Fantasy Town Kit](https://kenney.nl/assets/fantasy-town-kit)
  (`public/models/town/`) rather than hand-rolled primitives.
- **Settings** — a mock Account (editable display name) and Payment page (add/remove
  demo cards — brand, last 4 digits, and expiry only; never a full card number), both
  local and `localStorage`-backed. There's no real sign-in system behind either.

## Tech stack

- Next.js (App Router) + TypeScript + React
- Tailwind CSS v4
- React Three Fiber + Three.js + drei for the 3D impact map
- Stripe Checkout (test mode, optional) for the donate flow
- No backend/database — local component state + `localStorage` for everything that
  persists (impact totals, per-charity breakdown, account, cards)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No configuration needed — the
Donate button runs a simulated instant success out of the box.

### Optional: enable real Stripe test-mode checkout

To demo the actual Stripe Checkout page instead of the simulated flow:

1. Grab **test mode** keys from the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys).
2. `cp .env.local.example .env.local` and fill in:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
3. Restart `npm run dev`. On the Stripe Checkout page, pay with a
   [test card](https://stripe.com/docs/testing#cards) such as `4242 4242 4242 4242`,
   any future expiry, any CVC.

Without these keys, the Donate button falls back to the simulated instant success —
this is the default, intended experience for this concept, not a broken state.

## Project structure

```
app/
  page.tsx                    Home route (renders HomeScreen)
  map/page.tsx                 3D impact map
  settings/page.tsx            Settings list
  settings/account/page.tsx    Mock editable profile
  settings/payment/page.tsx    Mock cards on file
  api/checkout/route.ts        Creates a Stripe Checkout Session
  api/checkout/verify/         Confirms a session after redirect back
  layout.tsx, globals.css      Shell, fonts, warm color theme, phone frame on desktop
components/
  HomeScreen.tsx                Donate flow: banner, stepper, dropdown, reveal sheet
  CauseCard.tsx                 Full-height hero banner (photo or icon) behind the header
  AppHeader.tsx                 Shared floating header bar (Give / Map / Settings)
  ImpactRevealSheet.tsx         Post-donation impact statement
  ImpactScene3D.tsx              The 3D map itself (client-only, dynamically imported)
  ImpactMeter.tsx                Running dollar total, shown in the header
  BottomNav.tsx                  Give / Map / Settings tab bar
lib/
  charities.ts                  Mock charity data (name, cost/unit, icon, photo)
  impact.ts                     Stepper bounds + amount/unit conversion helpers
  impact-store.ts               Running CAD total (localStorage-backed)
  donations-store.ts            Units funded per charity, feeds the 3D map
  account-store.ts              Mock editable display name
  cards-store.ts                Mock cards on file
  stripe.ts                     Server-side Stripe client
public/
  models/town/                  CC0 GLB models used by the 3D town (see LICENSE.txt there)
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. (Optional) Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in the
   Vercel project settings if you want the deployed demo to use real Stripe test-mode
   checkout instead of the simulated flow.
4. Deploy — no other configuration needed.

## Out of scope (v1)

Real payment processing beyond Stripe test mode, a real account/auth system, a
database, real charity or sponsor integrations, and native mobile builds. This is a
responsive web app.

## Possible future direction

Wiring the deployed demo up to real Stripe test-mode checkout by default (it's already
built and just needs keys — see above).
