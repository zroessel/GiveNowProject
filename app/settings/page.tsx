"use client";

import { useState } from "react";
import { CreditCard, RotateCcw, UserRound } from "lucide-react";
import { useImpact } from "@/lib/impact-store";
import { formatCad } from "@/lib/impact";
import ImpactMeter from "@/components/ImpactMeter";
import Logo from "@/components/Logo";

export default function SettingsPage() {
  const { totalDonatedCad, resetImpact } = useImpact();
  const [confirmingReset, setConfirmingReset] = useState(false);

  const handleResetClick = () => {
    if (!confirmingReset) {
      setConfirmingReset(true);
      setTimeout(() => setConfirmingReset(false), 3000);
      return;
    }
    resetImpact();
    setConfirmingReset(false);
  };

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-y-auto">
      <header className="flex items-center justify-between px-5 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <Logo />
        <ImpactMeter />
      </header>

      <main className="flex flex-1 flex-col gap-6 px-5 pt-6">
        <section>
          <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-clay/40">
            Account
          </p>
          <div className="flex items-center gap-3.5 rounded-2xl bg-white/70 px-4 py-3.5 ring-1 ring-clay/10">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta/15">
              <UserRound size={20} strokeWidth={2} className="text-terracotta-deep" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-extrabold text-clay">Guest Donor</p>
              <p className="truncate text-[12px] text-clay/55">
                No sign-in required to give in this concept
              </p>
            </div>
          </div>
        </section>

        <section>
          <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-clay/40">
            Payment method
          </p>
          <div className="flex items-center gap-3.5 rounded-2xl bg-white/70 px-4 py-3.5 ring-1 ring-clay/10">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta/15">
              <CreditCard size={20} strokeWidth={2} className="text-terracotta-deep" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-extrabold text-clay">Visa •••• 4242</p>
              <p className="text-[12px] text-clay/55">Expires 12/34 · demo card, not real</p>
            </div>
          </div>
        </section>

        <section>
          <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-clay/40">
            General
          </p>
          <div className="rounded-2xl bg-white/70 ring-1 ring-clay/10">
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-[14px] font-bold text-clay">Total donated</span>
              <span className="text-[14px] font-extrabold text-clay">{formatCad(totalDonatedCad)}</span>
            </div>
            <div className="h-px bg-clay/10" />
            <button
              onClick={handleResetClick}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
            >
              <RotateCcw
                size={18}
                strokeWidth={2}
                className={confirmingReset ? "text-terracotta-deep" : "text-clay/50"}
                aria-hidden
              />
              <span
                className={`text-[14px] font-bold ${
                  confirmingReset ? "text-terracotta-deep" : "text-clay"
                }`}
              >
                {confirmingReset ? "Tap again to confirm" : "Reset impact meter"}
              </span>
            </button>
          </div>
        </section>
      </main>

      <footer className="px-6 pb-6 pt-4">
        <p className="text-center text-[11px] font-medium text-clay/35">
          Account and payment details on this screen are for demo purposes only — no
          sign-in is required to give.
        </p>
      </footer>
    </div>
  );
}
