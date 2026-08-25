"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAccount } from "@/lib/account-store";
import { useCards } from "@/lib/cards-store";
import { useImpact } from "@/lib/impact-store";
import { formatCad } from "@/lib/impact";
import AppHeader from "@/components/AppHeader";

export default function SettingsPage() {
  const { account } = useAccount();
  const { cards } = useCards();
  const { totalDonatedCad } = useImpact();

  const defaultCard = cards.find((c) => c.isDefault) ?? cards[0];

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-y-auto">
      <AppHeader />

      <main className="flex flex-1 flex-col px-5 pt-7">
        <p className="mb-1 px-1 text-[11px] font-bold uppercase tracking-wide text-clay/40">
          Account
        </p>
        <Link
          href="/settings/account"
          className="flex items-center gap-3 border-b border-clay/8 py-3.5 active:opacity-60"
        >
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold text-clay">{account.displayName}</p>
            <p className="truncate text-[12px] text-clay/50">
              No sign-in required to give in this concept
            </p>
          </div>
          <ChevronRight size={16} strokeWidth={2.5} className="shrink-0 text-clay/30" aria-hidden />
        </Link>

        <p className="mb-1 mt-7 px-1 text-[11px] font-bold uppercase tracking-wide text-clay/40">
          Payment
        </p>
        <Link
          href="/settings/payment"
          className="flex items-center gap-3 border-b border-clay/8 py-3.5 active:opacity-60"
        >
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold text-clay">
              {defaultCard ? `${defaultCard.brand} •••• ${defaultCard.last4}` : "No cards on file"}
            </p>
            <p className="truncate text-[12px] text-clay/50">
              {defaultCard ? `Expires ${defaultCard.expiry} · demo card` : "Add a demo card"}
            </p>
          </div>
          <ChevronRight size={16} strokeWidth={2.5} className="shrink-0 text-clay/30" aria-hidden />
        </Link>

        <p className="mb-1 mt-7 px-1 text-[11px] font-bold uppercase tracking-wide text-clay/40">
          General
        </p>
        <div className="flex items-center justify-between border-b border-clay/8 py-3.5">
          <span className="text-[14px] font-bold text-clay">Total donated</span>
          <span className="text-[14px] font-extrabold text-clay">{formatCad(totalDonatedCad)}</span>
        </div>
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
