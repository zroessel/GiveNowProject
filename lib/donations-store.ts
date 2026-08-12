import { useSyncExternalStore } from "react";
import { charities } from "./charities";

const STORAGE_KEY = "givenow:donations-by-charity:v1";

type UnitsByCharity = Record<string, number>;

// A stable reference — useSyncExternalStore requires getServerSnapshot to
// return the same object every call, not a freshly built one each time.
const EMPTY_BREAKDOWN: UnitsByCharity = Object.fromEntries(charities.map((c) => [c.id, 0]));

let breakdown: UnitsByCharity = EMPTY_BREAKDOWN;
let initialized = false;
const listeners = new Set<() => void>();

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) breakdown = { ...EMPTY_BREAKDOWN, ...JSON.parse(stored) };
  } catch {
    // localStorage unavailable or corrupt — keep an empty breakdown.
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(breakdown));
  } catch {
    // ignore write failures, breakdown still updates for this session
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
  return breakdown;
}

function getServerSnapshot() {
  return EMPTY_BREAKDOWN;
}

export function addCharityUnits(charityId: string, units: number) {
  ensureInitialized();
  breakdown = { ...breakdown, [charityId]: (breakdown[charityId] ?? 0) + units };
  persist();
}

export function resetDonations() {
  ensureInitialized();
  breakdown = EMPTY_BREAKDOWN;
  persist();
}

/** Units funded per charity (e.g. meals, litres, trees) — feeds the 3D impact map. */
export function useDonationsByCharity() {
  const unitsByCharity = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { unitsByCharity, addCharityUnits, resetDonations };
}
