import type { Charity } from "./types";

/** Fixed one-tap donation amount for the Home flow, in CAD. */
export const DONATION_AMOUNT_CAD = 5;

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

/** Picks the impact line for the amount donated, falling back to the nearest lower tier. */
export function getImpactStatement(charity: Charity, amountCad: number): string {
  const exact = charity.outcomes.find((o) => o.amountCad === amountCad);
  if (exact) return exact.impact;

  const sorted = [...charity.outcomes].sort((a, b) => a.amountCad - b.amountCad);
  const nearestBelow = [...sorted].reverse().find((o) => o.amountCad <= amountCad);
  return (nearestBelow ?? sorted[0]).impact;
}

export function formatMeals(meals: number): string {
  const rounded = Math.round(meals * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
