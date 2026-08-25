"use client";

import Link from "next/link";
import { charities } from "@/lib/charities";
import { useDonationsByCharity } from "@/lib/donations-store";
import AppHeader from "@/components/AppHeader";
import ImpactCategoryCard from "@/components/ImpactCategoryCard";

export default function ImpactPage() {
  const { unitsByCharity } = useDonationsByCharity();
  const totalUnits = Object.values(unitsByCharity).reduce((sum, n) => sum + n, 0);

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-y-auto">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 -z-10"
        style={{ backgroundImage: "linear-gradient(to bottom, #EAF1E3, transparent)" }}
      />

      <AppHeader />

      <main className="flex flex-1 flex-col gap-4 px-5 pt-7">
        <div className="max-w-xs">
          <h1 className="text-2xl font-extrabold leading-tight text-clay">Your impact, visualized</h1>
          <p className="mt-1.5 text-[14px] leading-snug text-clay/60">
            Every gift adds up. Here&apos;s what your giving has funded so far.
          </p>
        </div>

        <div
          className={`animate-pop-in rounded-3xl px-5 py-4 text-center shadow-lg ${
            totalUnits > 0 ? "bg-terracotta-deep text-white" : "bg-white/70 text-clay/50 ring-1 ring-clay/10"
          }`}
        >
          <p className="text-[28px] font-extrabold leading-none">{totalUnits}</p>
          <p
            className={`mt-1 text-[12px] font-bold uppercase tracking-wide ${
              totalUnits > 0 ? "text-white/75" : "text-clay/40"
            }`}
          >
            {totalUnits > 0 ? `things funded across ${charities.length} causes` : "give to start funding real impact"}
          </p>
        </div>

        <div className="flex flex-col gap-3 pb-2">
          {charities.map((charity, i) => (
            <div key={charity.id} className="animate-pop-in" style={{ animationDelay: `${i * 60}ms` }}>
              <ImpactCategoryCard charity={charity} units={unitsByCharity[charity.id] ?? 0} />
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="mb-2 rounded-full bg-terracotta-deep py-4 text-center text-[15px] font-extrabold text-white shadow-lg transition-transform active:scale-95"
        >
          Give to grow your impact
        </Link>
      </main>

      <footer className="px-6 pb-6 pt-2">
        <p className="text-center text-[11px] font-medium text-clay/35">
          Figures are illustrative, based on each cause&apos;s simulated cost per unit.
        </p>
      </footer>
    </div>
  );
}
