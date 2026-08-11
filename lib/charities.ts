import type { Charity } from "./types";

// Illustrative, fictional causes for demo purposes — not real nonprofits.
export const charities: Charity[] = [
  {
    id: "harvest-table",
    name: "Harvest Table",
    tagline: "Cooks and delivers hot meals to families facing food insecurity.",
    emoji: "🍲",
    accent: "#E2703A",
    tint: "#FBEAE0",
    outcomes: [
      { amountCad: 5, impact: "2 hot meals delivered this week" },
      { amountCad: 10, impact: "4 hot meals delivered this week" },
    ],
  },
  {
    id: "clearwell-project",
    name: "Clearwell Project",
    tagline: "Builds and repairs wells so villages get clean drinking water.",
    emoji: "💧",
    accent: "#3C9D8F",
    tint: "#E3F3F0",
    outcomes: [
      { amountCad: 5, impact: "50 litres of clean water pumped" },
      { amountCad: 10, impact: "100 litres of clean water pumped" },
    ],
  },
  {
    id: "bright-page",
    name: "Bright Page Library",
    tagline: "Fills classroom shelves with books kids actually want to read.",
    emoji: "📚",
    accent: "#D9A441",
    tint: "#FBF1DD",
    outcomes: [
      { amountCad: 5, impact: "3 storybooks placed in a classroom" },
      { amountCad: 10, impact: "6 storybooks placed in a classroom" },
    ],
  },
  {
    id: "small-paws",
    name: "Small Paws Shelter",
    tagline: "Feeds and cares for rescued dogs and cats until they're adopted.",
    emoji: "🐾",
    accent: "#C1666B",
    tint: "#FAE7E8",
    outcomes: [
      { amountCad: 5, impact: "5 days of shelter meals for a rescued dog" },
      { amountCad: 10, impact: "10 days of shelter meals for a rescued dog" },
    ],
  },
  {
    id: "warm-nights",
    name: "Warm Nights Fund",
    tagline: "Hands out blankets and hot meals on cold city nights.",
    emoji: "🧣",
    accent: "#A65B3F",
    tint: "#F3E4DC",
    outcomes: [
      { amountCad: 5, impact: "1 warm blanket + hot meal given out tonight" },
      { amountCad: 10, impact: "2 warm blankets + hot meals given out tonight" },
    ],
  },
  {
    id: "seedling-forest",
    name: "Seedling Forest Co.",
    tagline: "Plants native trees to help rebuild forests after wildfires.",
    emoji: "🌱",
    accent: "#6B8F55",
    tint: "#EAF1E3",
    outcomes: [
      { amountCad: 5, impact: "10 native trees planted" },
      { amountCad: 10, impact: "20 native trees planted" },
    ],
  },
  {
    id: "first-light-health",
    name: "First Light Health",
    tagline: "Runs mobile clinics that vaccinate kids in remote communities.",
    emoji: "🩺",
    accent: "#D98555",
    tint: "#FBEDE1",
    outcomes: [
      { amountCad: 5, impact: "1 child vaccinated against measles" },
      { amountCad: 10, impact: "2 children vaccinated against measles" },
    ],
  },
];

/** Deterministic "cause of the day" — rotates once every 24 hours. */
export function getCauseOfTheDayIndex(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diffMs = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diffMs / 86_400_000);
  return dayOfYear % charities.length;
}
