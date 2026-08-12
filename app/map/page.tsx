"use client";

import dynamic from "next/dynamic";
import { charities } from "@/lib/charities";
import { useDonationsByCharity } from "@/lib/donations-store";
import AppHeader from "@/components/AppHeader";

const ImpactScene3D = dynamic(() => import("@/components/ImpactScene3D"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-[13px] font-bold text-clay/40">Building your town…</p>
    </div>
  ),
});

export default function MapPage() {
  const { unitsByCharity } = useDonationsByCharity();
  const hasAnyDonations = Object.values(unitsByCharity).some((n) => n > 0);

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-hidden">
      <div className="absolute inset-x-0 top-0 z-10">
        <AppHeader />
      </div>

      <div className="flex flex-1 flex-col pt-[calc(4.5rem+env(safe-area-inset-top))]">
        {!hasAnyDonations && (
          <p className="px-6 pb-2 text-center text-[12px] font-medium text-clay/45">
            Drag to look around — donate on Give to start building the town.
          </p>
        )}
        <div className="relative flex-1">
          <ImpactScene3D charities={charities} unitsByCharity={unitsByCharity} />
        </div>
      </div>

      <footer className="px-6 pb-6 pt-3">
        <p className="text-center text-[11px] font-medium text-clay/35">
          A physical stand-in for your giving — a house per night of shelter, a stall
          per meal, a well per litre, a tree per sapling, a school per textbook. Up to
          12 buildings shown per cause.
        </p>
      </footer>
    </div>
  );
}
