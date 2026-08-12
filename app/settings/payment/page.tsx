"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { useCards } from "@/lib/cards-store";
import AppHeader from "@/components/AppHeader";

const BRANDS = ["Visa", "Mastercard", "Amex"] as const;

export default function PaymentPage() {
  const { cards, addCard, removeCard, setDefaultCard } = useCards();
  const [showForm, setShowForm] = useState(false);
  const [brand, setBrand] = useState<(typeof BRANDS)[number]>("Visa");
  const [last4, setLast4] = useState("");
  const [expiry, setExpiry] = useState("");

  const canAdd = last4.length === 4 && /^\d{2}\/\d{2}$/.test(expiry);

  const handleAdd = () => {
    if (!canAdd) return;
    addCard({ brand, last4, expiry });
    setLast4("");
    setExpiry("");
    setBrand("Visa");
    setShowForm(false);
  };

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-y-auto">
      <AppHeader />

      <main className="flex flex-1 flex-col gap-6 px-5 pt-7">
        <Link href="/settings" className="inline-flex items-center gap-1 text-[13px] font-bold text-clay/45">
          <ChevronLeft size={16} strokeWidth={2.5} aria-hidden />
          Settings
        </Link>

        <h1 className="text-2xl font-extrabold text-clay">Payment details</h1>

        <div>
          {cards.length === 0 && (
            <p className="border-b border-clay/8 py-3.5 text-[13px] font-medium text-clay/50">
              No cards on file
            </p>
          )}
          {cards.map((card) => (
            <div key={card.id} className="flex items-center gap-3 border-b border-clay/8 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold text-clay">
                  {card.brand} •••• {card.last4}
                </p>
                <p className="text-[12px] text-clay/50">
                  Expires {card.expiry}
                  {card.isDefault ? " · Default" : ""}
                </p>
              </div>
              {!card.isDefault && (
                <button
                  onClick={() => setDefaultCard(card.id)}
                  className="shrink-0 text-[11px] font-bold text-terracotta-deep"
                >
                  Set default
                </button>
              )}
              <button
                onClick={() => removeCard(card.id)}
                aria-label={`Remove ${card.brand} ending ${card.last4}`}
                className="shrink-0 text-clay/30"
              >
                <Trash2 size={16} strokeWidth={2} aria-hidden />
              </button>
            </div>
          ))}
        </div>

        {showForm ? (
          <div className="flex flex-col gap-4 border-t border-clay/8 pt-5">
            <div className="flex gap-4">
              {BRANDS.map((b) => (
                <button
                  key={b}
                  onClick={() => setBrand(b)}
                  className={`text-[13px] font-bold ${
                    brand === b ? "text-terracotta-deep underline underline-offset-4" : "text-clay/40"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="last4" className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-clay/40">
                  Last 4 digits
                </label>
                <input
                  id="last4"
                  value={last4}
                  onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="4242"
                  inputMode="numeric"
                  className="w-full border-b-2 border-clay/15 bg-transparent py-2 text-[15px] font-bold text-clay outline-none focus:border-terracotta"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="expiry" className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-clay/40">
                  Expiry
                </label>
                <input
                  id="expiry"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value.slice(0, 5))}
                  placeholder="MM/YY"
                  className="w-full border-b-2 border-clay/15 bg-transparent py-2 text-[15px] font-bold text-clay outline-none focus:border-terracotta"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-full py-3 text-[13px] font-bold text-clay/50 ring-1 ring-clay/15"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!canAdd}
                className="flex-1 rounded-full bg-terracotta py-3 text-[13px] font-extrabold text-white transition-opacity disabled:opacity-30"
              >
                Add card
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 self-start text-[13px] font-bold text-terracotta-deep"
          >
            <Plus size={15} strokeWidth={2.5} aria-hidden />
            Add new card
          </button>
        )}
      </main>

      <footer className="px-6 pb-6 pt-4">
        <p className="text-center text-[11px] font-medium text-clay/35">
          Demo cards only — no full card numbers are ever collected, and nothing
          here reaches a real payment processor.
        </p>
      </footer>
    </div>
  );
}
