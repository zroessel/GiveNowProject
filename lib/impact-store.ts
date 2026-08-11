import { useSyncExternalStore } from "react";
import { cadToMeals } from "./impact";

const STORAGE_KEY = "givenow:impact-meter:v1";

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
  total += cadToMeals(amountCad);
  try {
    window.localStorage.setItem(STORAGE_KEY, String(total));
  } catch {
    // ignore write failures, meter still updates for this session
  }
  listeners.forEach((listener) => listener());
}

/** Total impact (in the universal "meals" unit) shared across Home and Tap & Feed. */
export function useImpact() {
  const totalMeals = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { totalMeals, addContribution };
}
