"use client";

import { CheckCircle2 } from "lucide-react";
import type { Charity } from "@/lib/types";
import { formatMeals, UNIVERSAL_UNIT_LABEL } from "@/lib/impact";

interface Props {
  charity: Charity;
  units: number;
  amountCad: number;
  totalMeals: number;
  onClose: () => void;
}

export default function ImpactRevealSheet({ charity, units, amountCad, totalMeals, onClose }: Props) {
  const impact = charity.describeImpact(units);

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-clay/40 backdrop-blur-[2px]">
      <div className="animate-pop-in w-full rounded-t-[2rem] bg-cream px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-7 shadow-2xl">
        <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-clay/15" />

        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: charity.tint }}
        >
          <CheckCircle2 size={32} strokeWidth={2} style={{ color: charity.accent }} aria-hidden />
        </div>

        <p className="text-center text-sm font-bold uppercase tracking-wide text-terracotta-deep">
          Donation sent
        </p>
        <h2 className="mt-1.5 text-center text-2xl font-extrabold leading-snug text-clay">
          ${amountCad.toFixed(2)} CAD ={" "}
          <span style={{ color: charity.accent }}>{impact}</span>
        </h2>
        <p className="mt-2 text-center text-[13px] text-clay/55">
          Thanks to your gift to {charity.name}.
        </p>

        <div className="mt-6 rounded-2xl bg-white/70 px-4 py-3 text-center ring-1 ring-clay/10">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-clay/45">
            Your running impact
          </p>
          <p className="mt-0.5 text-lg font-extrabold text-clay">
            {formatMeals(totalMeals)} {UNIVERSAL_UNIT_LABEL} provided so far
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-full py-4 text-[15px] font-extrabold text-white shadow-lg transition-transform active:scale-95"
          style={{ backgroundColor: charity.accent }}
        >
          Keep giving
        </button>
      </div>
    </div>
  );
}
