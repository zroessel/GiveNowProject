import { NextResponse } from "next/server";
import { charities } from "@/lib/charities";
import { clampUnits, unitsToAmountCad } from "@/lib/impact";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const causeId = body?.causeId;
  const charity = charities.find((c) => c.id === causeId);

  if (!charity) {
    return NextResponse.json({ error: "Unknown cause" }, { status: 400 });
  }

  // The charge amount is always derived here from the charity's own
  // cost-per-unit and a clamped unit count — never trust a dollar amount
  // sent by the client, or a tampered request could under-pay for the
  // impact statement it gets shown.
  const units = clampUnits(Number(body?.units));
  const amountCad = unitsToAmountCad(charity, units);

  const stripe = getStripeClient();
  if (!stripe) {
    // No Stripe test keys configured — let the client fall back to a
    // simulated instant success so the demo still runs with zero setup.
    return NextResponse.json({ simulated: true });
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "cad",
          unit_amount: Math.round(amountCad * 100),
          product_data: {
            name: `Donation to ${charity.name}`,
            description: `${units} ${units === 1 ? charity.unitSingular : charity.unitPlural} — ${charity.tagline}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      causeId: charity.id,
      units: String(units),
      amountCad: String(amountCad),
    },
    success_url: `${origin}/?donated=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/?donation=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
