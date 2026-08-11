"use client";

import { animals } from "@/lib/animals";
import { TAP_DONATION_AMOUNT_CAD } from "@/lib/impact";
import { useImpact } from "@/lib/impact-store";
import AnimalTile from "@/components/AnimalTile";
import ImpactMeter from "@/components/ImpactMeter";
import Logo from "@/components/Logo";

export default function TapAndFeedPage() {
  const { addContribution } = useImpact();

  return (
    <div className="relative flex h-full flex-1 flex-col">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 -z-10"
        style={{ backgroundImage: "linear-gradient(to bottom, #EAF1E3, transparent)" }}
      />

      <header className="flex items-center justify-between px-5 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <Logo />
        <ImpactMeter />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-7 px-6">
        <div className="max-w-xs text-center">
          <h1 className="text-2xl font-extrabold leading-tight text-clay">
            Feed the shelter friends
          </h1>
          <p className="mt-1.5 text-[14px] leading-snug text-clay/60">
            Tap an animal for a sponsor-funded treat — every tap adds to your impact meter.
          </p>
        </div>

        <div className="grid w-full max-w-sm grid-cols-2 gap-4">
          {animals.map((animal) => (
            <AnimalTile
              key={animal.id}
              animal={animal}
              onFeed={() => addContribution(TAP_DONATION_AMOUNT_CAD)}
            />
          ))}
        </div>
      </main>

      <footer className="px-6 pb-6">
        <p className="text-center text-[11px] font-medium text-clay/35">
          Sponsor funding is simulated for this demo — no real transactions occur.
        </p>
      </footer>
    </div>
  );
}
