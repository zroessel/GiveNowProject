"use client";

import Link from "next/link";
import { getCharityById } from "@/lib/charities";
import { useImpact } from "@/lib/impact-store";
import AppHeader from "@/components/AppHeader";
import ImpactCategoryCard from "@/components/ImpactCategoryCard";

// Display order matches how givers tend to think about causes: essentials
// first (water, food, shelter), then longer-horizon giving (trees, books).
const CATEGORY_ORDER = [
  "wellspring-water",
  "baobab-relief",
  "rootline-reforestation",
  "chalkline-education",
  "steady-ground",
] as const;

// Friendlier, visual-page nouns in place of the charity's own unit labels
// (e.g. "litres" reads better here as "water bottles").
const NOUN_OVERRIDES: Partial<Record<(typeof CATEGORY_ORDER)[number], [string, string]>> = {
  "wellspring-water": ["water bottle", "water bottles"],
};

export default function ImpactPage() {
  const { contributionsByCharity } = useImpact();

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

        <div className="flex flex-col gap-3 pb-2">
          {CATEGORY_ORDER.map((id) => {
            const charity = getCharityById(id);
            const contributed = contributionsByCharity[id] ?? 0;
            // Nudge past floating-point drift (e.g. 0.6 / 0.2 === 2.9999999999999996)
            // so a fully-paid-for unit doesn't get floored down to the one before it.
            const count = Math.floor(contributed / charity.costPerUnitCad + 1e-6);
            const [singular, plural] = NOUN_OVERRIDES[id] ?? [charity.unitSingular, charity.unitPlural];
            return (
              <ImpactCategoryCard
                key={id}
                icon={charity.icon}
                count={count}
                noun={count === 1 ? singular : plural}
                tint={charity.tint}
                accent={charity.accent}
              />
            );
          })}
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
