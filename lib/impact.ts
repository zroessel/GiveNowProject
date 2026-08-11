import type { Charity } from "./types";

/** Stepper bounds for the Home donate flow, in whole units of impact (e.g. meals). */
export const MIN_UNITS = 1;
export const MAX_UNITS = 30;

/** Simulated sponsor-funded micro-donation per animal tap, in CAD. */
export const TAP_DONATION_AMOUNT_CAD = 0.5;

/**
 * Stripe won't process a charge below this amount. The stepper itself can go
 * as low as one unit (e.g. $0.20), but if that's ever below what a real
 * Stripe charge can process, the checkout route bumps the unit count up to
 * the smallest amount that clears this floor rather than letting the
 * payment API call fail.
 */
export const STRIPE_MIN_CHARGE_CAD = 0.5;

export function clampUnits(units: number): number {
  const rounded = Math.round(units);
  return Math.min(MAX_UNITS, Math.max(MIN_UNITS, rounded));
}

export function unitsToAmountCad(charity: Charity, units: number): number {
  return Math.round(charity.costPerUnitCad * clampUnits(units) * 100) / 100;
}

export function formatCad(amountCad: number): string {
  return `$${amountCad.toFixed(2)}`;
}
