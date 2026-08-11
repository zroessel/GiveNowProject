# GiveNow

A concept donation app built around one idea: **donating should be one button away.**

No account creation, no scrolling through charity lists, no friction. You see a single
curated cause, tap one big button, and instantly see exactly what your donation did —
then watch a running impact meter grow across everything you do in the app.

This is a portfolio/demo project. All charities, sponsors, and impact numbers are
fictional. Payments run through [Stripe in test mode](https://stripe.com/docs/testing)
only — no real money ever moves.

## How it works

- **Give (Home)** — one curated "cause of the day," one description, one Donate button.
  Tapping Donate kicks off a real Stripe Checkout session (test mode) for a fixed $5 CAD.
  On success you immediately see a specific impact statement pulled from that charity's
  cost-per-outcome data (e.g. *"$5 CAD = 2 hot meals delivered this week"*), not a
  generic thank-you.
- **Tap & Feed** — a small tap-to-feed mini-game. Tapping an animal simulates a
  sponsor-funded micro-donation with a little bounce/sparkle animation. No losing, no
  timer, just a satisfying loop.
- **Impact meter** — every cause reports its own unit (litres, books, vaccines...), so to
  keep one running total the app converts every dollar donated — from either screen —
  into a shared universal unit ("meals provided") and persists it in `localStorage`.

## Tech stack

- Next.js (App Router) + TypeScript + React
- Tailwind CSS v4
- Stripe Checkout (test mode) for the donate flow
- No backend/database — local component state + `localStorage` for the impact meter

## Getting started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Stripe test mode setup

The donate flow calls a real Stripe Checkout Session. To exercise it end to end:

1. Grab **test mode** keys from the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys).
2. Fill in `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
3. On the Stripe Checkout page, pay with a [test card](https://stripe.com/docs/testing#cards)
   such as `4242 4242 4242 4242`, any future expiry, any CVC.

If `STRIPE_SECRET_KEY` isn't set, the Donate button falls back to a simulated instant
success (clearly a demo shortcut, not a substitute) so the app is still runnable with
zero configuration.

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
3. Add the same environment variables from `.env.local` in the Vercel project settings
   (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).
4. Deploy — no other configuration needed.

## Out of scope (v1)

Real payment processing beyond Stripe test mode, user accounts/auth, a database, real
charity or sponsor integrations, and native mobile builds. This is a responsive web app.
