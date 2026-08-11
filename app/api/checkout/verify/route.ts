import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return NextResponse.json({ paid: false });
  }

  return NextResponse.json({
    paid: true,
    causeId: session.metadata?.causeId ?? null,
    units: session.metadata?.units ? Number(session.metadata.units) : null,
    amountCad: session.metadata?.amountCad ? Number(session.metadata.amountCad) : null,
  });
}
