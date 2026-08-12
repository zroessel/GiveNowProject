"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useAccount } from "@/lib/account-store";
import AppHeader from "@/components/AppHeader";

export default function AccountPage() {
  const { account, updateDisplayName } = useAccount();
  const [name, setName] = useState(account.displayName);
  const [syncedName, setSyncedName] = useState(account.displayName);
  const [justSaved, setJustSaved] = useState(false);

  // Pick up the persisted name once it hydrates from localStorage, without
  // clobbering in-progress typing on later unrelated re-renders.
  if (account.displayName !== syncedName) {
    setSyncedName(account.displayName);
    setName(account.displayName);
  }

  const handleSave = () => {
    updateDisplayName(name);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  };

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-y-auto">
      <AppHeader />

      <main className="flex flex-1 flex-col gap-6 px-5 pt-7">
        <Link href="/settings" className="inline-flex items-center gap-1 text-[13px] font-bold text-clay/45">
          <ChevronLeft size={16} strokeWidth={2.5} aria-hidden />
          Settings
        </Link>

        <h1 className="text-2xl font-extrabold text-clay">Account</h1>

        <div>
          <label htmlFor="display-name" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-clay/40">
            Display name
          </label>
          <input
            id="display-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            placeholder="Guest Donor"
            className="w-full border-b-2 border-clay/15 bg-transparent py-2 text-[16px] font-bold text-clay outline-none focus:border-terracotta"
          />
        </div>

        <button
          onClick={handleSave}
          className="self-start rounded-full bg-terracotta px-6 py-3 text-[14px] font-extrabold text-white shadow-md transition-transform active:scale-[0.97]"
        >
          {justSaved ? "Saved" : "Save changes"}
        </button>
      </main>

      <footer className="px-6 pb-6 pt-4">
        <p className="text-center text-[11px] font-medium text-clay/35">
          This is a local, demo-only profile — there&apos;s no real account system or
          sign-in behind it.
        </p>
      </footer>
    </div>
  );
}
