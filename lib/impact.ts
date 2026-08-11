import type { Charity } from "./types";

/** Stepper bounds for the Home donate flow, in whole units of impact (e.g. meals). */
export const MIN_UNITS = 5;
export const MAX_UNITS = 30;
export const DEFAULT_UNITS = 5;

/** Simulated sponsor-funded micro-donation per animal tap, in CAD. */
export const TAP_DONATION_AMOUNT_CAD = 0.5;

/**
 * Every cause reports its own outcome (litres, books, vaccines...), but the
 * running total needs one universal unit. $2 CAD converts to 1 "meal" so the
 * impact meter can add contributions from any cause together.
 */
export const MEALS_PER_CAD = 0.5;
export const UNIVERSAL_UNIT_LABEL = "meals";

export function cadToMeals(amountCad: number): number {
  return amountCad * MEALS_PER_CAD;
}

export function clampUnits(units: number): number {
  const rounded = Math.round(units);
  return Math.min(MAX_UNITS, Math.max(MIN_UNITS, rounded));
}

export function unitsToAmountCad(charity: Charity, units: number): number {
  return Math.round(charity.costPerUnitCad * clampUnits(units) * 100) / 100;
}

export function formatMeals(meals: number): string {
  const rounded = Math.round(meals * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
