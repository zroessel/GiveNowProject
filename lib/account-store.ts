import { useSyncExternalStore } from "react";

export interface AccountProfile {
  displayName: string;
}

const STORAGE_KEY = "givenow:account:v1";
const DEFAULT_PROFILE: AccountProfile = { displayName: "Guest Donor" };

let profile: AccountProfile = DEFAULT_PROFILE;
let initialized = false;
const listeners = new Set<() => void>();

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) profile = JSON.parse(stored);
  } catch {
    // localStorage unavailable or corrupt — keep the default profile.
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore write failures, profile still updates for this session
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
  return profile;
}

function getServerSnapshot() {
  return DEFAULT_PROFILE;
}

export function updateDisplayName(name: string) {
  ensureInitialized();
  const trimmed = name.trim();
  profile = { ...profile, displayName: trimmed || "Guest Donor" };
  persist();
}

/** Mock, local-only account profile — this app has no real sign-in. */
export function useAccount() {
  const account = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { account, updateDisplayName };
}
