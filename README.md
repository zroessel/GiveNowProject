# GiveNow

A concept donation app built around one idea: **donating should be one button away.**

No account creation, no scrolling through charity lists, no friction. You see a single
curated cause, tap one big button, and instantly see exactly what your donation did —
then watch a running impact meter grow across everything you do in the app.

This is a portfolio/demo project. All charities, sponsors, and impact numbers are
fictional, and no real money ever moves — by default the donate flow is fully
simulated. A real [Stripe test-mode](https://stripe.com/docs/testing) Checkout
integration is built in and ready to go (see below) if you want to demo the actual
payment flow; wiring up live payments is a deliberate future step, not part of this
concept.

## How it works

- **Give (Home)** — one curated "cause of the day," one description, one Donate button.
  Tapping Donate instantly shows a specific impact statement pulled from that charity's
  cost-per-outcome data (e.g. *"$5 CAD = 2 hot meals delivered this week"*), not a
  generic thank-you. If Stripe test keys are configured (see below), it routes through a
  real Stripe Checkout session first.
- **Tap & Feed** — a small tap-to-feed mini-game. Tapping an animal simulates a
  sponsor-funded micro-donation with a little bounce/sparkle animation. No losing, no
  timer, just a satisfying loop.
- **Impact meter** — every cause reports its own unit (litres, books, vaccines...), so to
  keep one running total the app converts every dollar donated — from either screen —
  into a shared universal unit ("meals provided") and persists it in `localStorage`.

## Tech stack

- Next.js (App Router) + TypeScript + React
- Tailwind CSS v4
- Stripe Checkout (test mode, optional) for the donate flow
- No backend/database — local component state + `localStorage` for the impact meter

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
  page.tsx                  Home route (renders HomeScreen)
  tap-and-feed/page.tsx     Tap & Feed route
  api/checkout/route.ts     Creates a Stripe Checkout Session
  api/checkout/verify/      Confirms a session after redirect back
  layout.tsx, globals.css   Shell, fonts, warm color theme
components/
  HomeScreen.tsx            Donate flow: cause card, donate button, reveal sheet
  CauseCard.tsx              Cause of the day display
  ImpactRevealSheet.tsx      Post-donation impact statement
  AnimalTile.tsx             Tap & Feed animal + animation
  ImpactMeter.tsx            Shared running total, shown on both screens
  BottomNav.tsx               Give / Tap & Feed tab bar
lib/
  charities.ts               Mock charity data + cause-of-the-day rotation
  animals.ts                  Tap & Feed animal data
  impact.ts                   Universal-unit conversion + impact statement logic
  impact-store.ts             Shared impact meter (localStorage-backed)
  stripe.ts                   Server-side Stripe client
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. (Optional) Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in the
   Vercel project settings if you want the deployed demo to use real Stripe test-mode
   checkout instead of the simulated flow.
4. Deploy — no other configuration needed.

## Out of scope (v1)

Real payment processing beyond Stripe test mode, user accounts/auth, a database, real
charity or sponsor integrations, and native mobile builds. This is a responsive web app.

## Possible future direction

Wiring the deployed demo up to real Stripe test-mode checkout by default (it's already
built and just needs keys — see above).
