import Stripe from "stripe";

let cachedClient: Stripe | null = null;

/** Returns null when no test secret key is configured (see .env.local.example). */
export function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  if (!cachedClient) {
    cachedClient = new Stripe(secretKey);
  }
  return cachedClient;
}
