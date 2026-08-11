"use client";

import type { Charity } from "@/lib/types";
import { formatMeals, getImpactStatement, UNIVERSAL_UNIT_LABEL } from "@/lib/impact";

interface Props {
  charity: Charity;
  amountCad: number;
  totalMeals: number;
  onClose: () => void;
}

export default function ImpactRevealSheet({ charity, amountCad, totalMeals, onClose }: Props) {
  const impact = getImpactStatement(charity, amountCad);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-clay/40 backdrop-blur-[2px]">
      <div className="animate-pop-in w-full max-w-md rounded-t-[2rem] bg-cream px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-7 shadow-2xl">
        <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-clay/15" />

        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
          style={{ backgroundColor: charity.tint }}
        >
          <span aria-hidden>✅</span>
        </div>

        <p className="text-center text-sm font-bold uppercase tracking-wide text-terracotta-deep">
          Donation sent
        </p>
        <h2 className="mt-1.5 text-center text-2xl font-extrabold leading-snug text-clay">
          ${amountCad} CAD ={" "}
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
