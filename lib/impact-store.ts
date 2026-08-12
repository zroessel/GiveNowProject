import { useSyncExternalStore } from "react";

// v3: adds a per-charity breakdown alongside the CAD total, so the impact
// page can show what was actually funded per cause. Bumped from v2 so old
// sessions don't reinterpret a bare number as this shape.
const STORAGE_KEY = "givenow:impact-total-cad:v3";

interface ImpactSnapshot {
  total: number;
  byCharity: Record<string, number>;
}

const EMPTY_SNAPSHOT: ImpactSnapshot = { total: 0, byCharity: {} };

let snapshot: ImpactSnapshot = { total: 0, byCharity: {} };
let initialized = false;
const listeners = new Set<() => void>();

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed.total === "number" && parsed.byCharity) {
        snapshot = { total: parsed.total, byCharity: parsed.byCharity };
      }
    }
  } catch {
    // localStorage unavailable (private mode, etc.) — keep in-memory total.
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
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
  return snapshot;
}

function getServerSnapshot() {
  return EMPTY_SNAPSHOT;
}

export function addContribution(amountCad: number, charityId: string) {
  ensureInitialized();
  snapshot = {
    total: snapshot.total + amountCad,
    byCharity: {
      ...snapshot.byCharity,
      [charityId]: (snapshot.byCharity[charityId] ?? 0) + amountCad,
    },
  };
  persist();
}

/** Running CAD total and per-charity breakdown, shared across Home, the impact page, and Settings. */
export function useImpact() {
  const { total, byCharity } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { totalDonatedCad: total, contributionsByCharity: byCharity, addContribution };
}
