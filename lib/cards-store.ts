import { useSyncExternalStore } from "react";

export interface Card {
  id: string;
  brand: string;
  /** Last 4 digits only — this app never collects a full card number. */
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const STORAGE_KEY = "givenow:cards:v1";
const DEFAULT_CARDS: Card[] = [
  { id: "seed-visa", brand: "Visa", last4: "4242", expiry: "12/34", isDefault: true },
];

let cards: Card[] = DEFAULT_CARDS;
let initialized = false;
const listeners = new Set<() => void>();

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) cards = JSON.parse(stored);
  } catch {
    // localStorage unavailable or corrupt — keep the seed card.
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch {
    // ignore write failures, list still updates for this session
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  ensureInitialized();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  ensureInitialized();
  return cards;
}

function getServerSnapshot() {
  return DEFAULT_CARDS;
}

export function addCard(input: { brand: string; last4: string; expiry: string }) {
  ensureInitialized();
  const newCard: Card = {
    id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    brand: input.brand,
    last4: input.last4,
    expiry: input.expiry,
    isDefault: cards.length === 0,
  };
  cards = [...cards, newCard];
  persist();
}

export function removeCard(id: string) {
  ensureInitialized();
  const wasDefault = cards.find((c) => c.id === id)?.isDefault ?? false;
  cards = cards.filter((c) => c.id !== id);
  if (wasDefault && cards.length > 0) {
    cards = cards.map((c, i) => (i === 0 ? { ...c, isDefault: true } : c));
  }
  persist();
}

export function setDefaultCard(id: string) {
  ensureInitialized();
  cards = cards.map((c) => ({ ...c, isDefault: c.id === id }));
  persist();
}

/** Mock, local-only cards on file — this app never processes real payment methods. */
export function useCards() {
  const cardList = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { cards: cardList, addCard, removeCard, setDefaultCard };
}
