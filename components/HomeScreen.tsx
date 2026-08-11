"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { charities, getCharityById } from "@/lib/charities";
import { DEFAULT_UNITS, MAX_UNITS, MIN_UNITS, clampUnits, unitsToAmountCad } from "@/lib/impact";
import { useImpact } from "@/lib/impact-store";
import CauseCard from "@/components/CauseCard";
import ImpactMeter from "@/components/ImpactMeter";
import ImpactRevealSheet from "@/components/ImpactRevealSheet";
import Logo from "@/components/Logo";

interface RevealState {
  charityId: string;
  units: number;
  amountCad: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { totalMeals, addContribution } = useImpact();

  const [charityId, setCharityId] = useState(charities[0].id);
  const [units, setUnits] = useState(DEFAULT_UNITS);
  const [donating, setDonating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reveal, setReveal] = useState<RevealState | null>(null);
  const processedSessionRef = useRef<string | null>(null);

  const charity = getCharityById(charityId);
  const amountCad = useMemo(() => unitsToAmountCad(charity, units), [charity, units]);

  const handleDecrement = useCallback(() => {
    setUnits((u) => clampUnits(u - 1));
  }, []);

  const handleIncrement = useCallback(() => {
    setUnits((u) => clampUnits(u + 1));
  }, []);

  const handleDonate = useCallback(async () => {
    setDonating(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ causeId: charity.id, units }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      if (data.simulated) {
        await new Promise((r) => setTimeout(r, 450));
        addContribution(amountCad);
        setReveal({ charityId: charity.id, units, amountCad });
        setDonating(false);
        return;
      }

      throw new Error(data.error ?? "Checkout failed");
    } catch {
      setError("Couldn't start checkout. Please try again.");
      setDonating(false);
    }
  }, [charity.id, units, amountCad, addContribution]);

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
          if (data.paid && data.causeId && data.units && data.amountCad) {
            const paidCharity = getCharityById(data.causeId);
            addContribution(data.amountCad);
            setReveal({ charityId: paidCharity.id, units: data.units, amountCad: data.amountCad });
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

  const revealCharity = reveal ? getCharityById(reveal.charityId) : null;
  const unitLabel = units === 1 ? charity.unitSingular : charity.unitPlural;

  return (
    <div className="relative flex h-full flex-1 flex-col">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 -z-10 transition-colors duration-500"
        style={{ backgroundImage: `linear-gradient(to bottom, ${charity.tint}, transparent)` }}
      />

      <header className="flex items-center justify-between px-5 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <Logo />
        <ImpactMeter />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-7 px-5">
        <CauseCard charity={charity} />

        <div className="flex items-center justify-center gap-5">
          <button
            onClick={handleDecrement}
            disabled={units <= MIN_UNITS}
            aria-label={`Fewer ${charity.unitPlural}`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-clay/10 transition-transform active:scale-90 disabled:opacity-30"
            style={{ color: charity.accent }}
          >
            <Minus size={20} strokeWidth={3} />
          </button>

          <div className="flex w-36 flex-col items-center">
            <span className="text-[34px] font-extrabold leading-none text-clay">
              ${amountCad.toFixed(2)}
            </span>
            <span
              className="mt-1.5 text-[13px] font-bold leading-none"
              style={{ color: charity.accent }}
            >
              = {units} {unitLabel}
            </span>
          </div>

          <button
            onClick={handleIncrement}
            disabled={units >= MAX_UNITS}
            aria-label={`More ${charity.unitPlural}`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-clay/10 transition-transform active:scale-90 disabled:opacity-30"
            style={{ color: charity.accent }}
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="relative w-full max-w-[240px]">
          <select
            value={charity.id}
            onChange={(e) => setCharityId(e.target.value)}
            aria-label="Change charity"
            className="w-full appearance-none rounded-full border border-clay/15 bg-white/70 py-2.5 pl-4 pr-9 text-center text-[13px] font-bold text-clay/70"
          >
            {charities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            strokeWidth={2.5}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-clay/40"
          />
        </div>
      </main>

      <footer className="flex flex-col items-center gap-2.5 px-6 pb-6">
        {error && <p className="text-[13px] font-semibold text-terracotta-deep">{error}</p>}
        <button
          onClick={handleDonate}
          disabled={donating}
          className="w-full max-w-sm rounded-full py-5 text-[17px] font-extrabold text-white shadow-xl transition-transform active:scale-[0.97] disabled:opacity-70"
          style={{ backgroundColor: charity.accent }}
        >
          {donating ? "Sending your gift…" : `Donate $${amountCad.toFixed(2)} CAD`}
        </button>
        <p className="text-[11px] font-medium text-clay/35">Concept demo · no real charge</p>
      </footer>

      {reveal && revealCharity && (
        <ImpactRevealSheet
          charity={revealCharity}
          units={reveal.units}
          amountCad={reveal.amountCad}
          totalMeals={totalMeals}
          onClose={() => setReveal(null)}
        />
      )}
    </div>
  );
}
