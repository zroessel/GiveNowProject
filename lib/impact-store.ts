import { useSyncExternalStore } from "react";

// v2: stores a raw CAD total (previously a converted "meals" unit) — bumped
// so old sessions don't reinterpret a meals figure as a dollar amount.
const STORAGE_KEY = "givenow:impact-total-cad:v2";

let total = 0;
let initialized = false;
const listeners = new Set<() => void>();

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? Number(stored) : 0;
    if (!Number.isNaN(parsed)) total = parsed;
  } catch {
    // localStorage unavailable (private mode, etc.) — keep in-memory total.
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(total));
  } catch {
    // ignore write failures, total still updates for this session
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
  return total;
}

function getServerSnapshot() {
  return 0;
}

export function addContribution(amountCad: number) {
  ensureInitialized();
  total += amountCad;
  persist();
}

export function resetImpact() {
  ensureInitialized();
  total = 0;
  persist();
}

/** Total CAD donated, shared across Home, Tap & Feed, and Settings. */
export function useImpact() {
  const totalDonatedCad = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { totalDonatedCad, addContribution, resetImpact };
}
