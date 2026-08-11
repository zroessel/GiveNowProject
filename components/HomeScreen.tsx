"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { charities, getCauseOfTheDayIndex } from "@/lib/charities";
import { DONATION_AMOUNT_CAD } from "@/lib/impact";
import { useImpact } from "@/lib/impact-store";
import CauseCard from "@/components/CauseCard";
import ImpactMeter from "@/components/ImpactMeter";
import ImpactRevealSheet from "@/components/ImpactRevealSheet";

interface RevealState {
  charityId: string;
  amountCad: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { totalMeals, addContribution } = useImpact();

  const [causeIndex, setCauseIndex] = useState(() => getCauseOfTheDayIndex());
  const [donating, setDonating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reveal, setReveal] = useState<RevealState | null>(null);
  const processedSessionRef = useRef<string | null>(null);

  const charity = charities[causeIndex];

  const handleNextCause = useCallback(() => {
    setCauseIndex((i) => (i + 1) % charities.length);
  }, []);

  const handleDonate = useCallback(async () => {
    setDonating(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ causeId: charity.id }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      if (data.simulated) {
        await new Promise((r) => setTimeout(r, 450));
        addContribution(DONATION_AMOUNT_CAD);
        setReveal({ charityId: charity.id, amountCad: DONATION_AMOUNT_CAD });
        setDonating(false);
        return;
      }

      throw new Error(data.error ?? "Checkout failed");
    } catch {
      setError("Couldn't start checkout. Please try again.");
      setDonating(false);
    }
  }, [charity.id, addContribution]);

  // Handle the redirect back from Stripe Checkout.
  useEffect(() => {
    const donated = searchParams.get("donated");
    const sessionId = searchParams.get("session_id");
    const cancelled = searchParams.get("donation") === "cancelled";

    if (!donated && !cancelled) return;
    if (donated && sessionId && processedSessionRef.current === sessionId) return;

    if (cancelled) {
      router.replace("/", { scroll: false });
      return;
    }

    if (donated && sessionId) {
      processedSessionRef.current = sessionId;
      (async () => {
        try {
          const res = await fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`);
          const data = await res.json();
          if (data.paid) {
            const amountCad = data.amountCad ?? DONATION_AMOUNT_CAD;
            const paidCharity = charities.find((c) => c.id === data.causeId) ?? charity;
            addContribution(amountCad);
            setReveal({ charityId: paidCharity.id, amountCad });
          } else {
            setError("Payment wasn't completed.");
          }
        } catch {
          setError("Couldn't confirm your donation.");
        } finally {
          router.replace("/", { scroll: false });
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const revealCharity = reveal ? charities.find((c) => c.id === reveal.charityId) : null;

  return (
    <div className="relative flex h-full flex-1 flex-col">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 -z-10 transition-colors duration-500"
        style={{ backgroundImage: `linear-gradient(to bottom, ${charity.tint}, transparent)` }}
      />

      <header className="flex items-center justify-between px-5 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <span className="text-sm font-extrabold tracking-tight text-clay/70">GiveNow</span>
        <ImpactMeter />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
        <CauseCard charity={charity} />

        <button
          onClick={handleNextCause}
          className="text-[13px] font-bold text-clay/45 underline decoration-clay/25 underline-offset-4 active:text-clay/70"
        >
          Not this one? Try another cause →
        </button>
      </main>

      <footer className="flex flex-col items-center gap-2.5 px-6 pb-6">
        {error && <p className="text-[13px] font-semibold text-terracotta-deep">{error}</p>}
        <button
          onClick={handleDonate}
          disabled={donating}
          className="w-full max-w-sm rounded-full py-5 text-[17px] font-extrabold text-white shadow-xl transition-transform active:scale-[0.97] disabled:opacity-70"
          style={{ backgroundColor: charity.accent }}
        >
          {donating ? "Sending your gift…" : `Donate $${DONATION_AMOUNT_CAD} CAD`}
        </button>
        <p className="text-[11px] font-medium text-clay/35">
          Concept demo · no real charge
        </p>
      </footer>

      {reveal && revealCharity && (
        <ImpactRevealSheet
          charity={revealCharity}
          amountCad={reveal.amountCad}
          totalMeals={totalMeals}
          onClose={() => setReveal(null)}
        />
      )}
    </div>
  );
}
