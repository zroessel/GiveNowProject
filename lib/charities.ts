import { BookOpen, Droplet, Home, TreePine, Wheat } from "lucide-react";
import type { Charity } from "./types";

// Illustrative, fictional causes for demo purposes — not real nonprofits.
// Cost-per-unit figures are calibrated to be realistic (large food banks
// commonly cite roughly $0.10–$0.25 per meal), not pulled from any real org.
export const charities: Charity[] = [
  {
    id: "steady-ground",
    name: "Steady Ground Housing Fund",
    tagline: "Moves people from emergency shelters into stable, permanent housing.",
    icon: Home,
    accent: "#A65B3F",
    tint: "#F3E4DC",
    costPerUnitCad: 3.0,
    unitSingular: "night of shelter",
    unitPlural: "nights of shelter",
    describeImpact: (n) => `${n} night${n === 1 ? "" : "s"} of safe shelter funded`,
  },
  {
    id: "baobab-relief",
    name: "Baobab Relief Fund",
    tagline: "Delivers emergency food aid to communities facing hunger across East Africa.",
    icon: Wheat,
    accent: "#E2703A",
    tint: "#FBEAE0",
    costPerUnitCad: 0.2,
    unitSingular: "meal",
    unitPlural: "meals",
    describeImpact: (n) => `${n} meal${n === 1 ? "" : "s"} delivered to families facing hunger`,
  },
  {
    id: "wellspring-water",
    name: "Wellspring Water Alliance",
    tagline: "Drills and maintains clean water wells across rural West Africa.",
    icon: Droplet,
    accent: "#3C9D8F",
    tint: "#E3F3F0",
    costPerUnitCad: 0.2,
    unitSingular: "litre",
    unitPlural: "litres",
    describeImpact: (n) => `${n} litre${n === 1 ? "" : "s"} of clean water provided`,
  },
  {
    id: "rootline-reforestation",
    name: "Rootline Reforestation Fund",
    tagline: "Plants native trees to restore forests degraded by wildfire and logging.",
    icon: TreePine,
    accent: "#6B8F55",
    tint: "#EAF1E3",
    costPerUnitCad: 0.5,
    unitSingular: "tree",
    unitPlural: "trees",
    describeImpact: (n) => `${n} native tree${n === 1 ? "" : "s"} planted`,
  },
  {
    id: "chalkline-education",
    name: "Chalkline Education Fund",
    tagline: "Supplies classrooms and pays local teachers in under-resourced schools.",
    icon: BookOpen,
    accent: "#D9A441",
    tint: "#FBF1DD",
    costPerUnitCad: 1.5,
    unitSingular: "textbook",
    unitPlural: "textbooks",
    describeImpact: (n) => `${n} textbook${n === 1 ? "" : "s"} placed in a classroom`,
  },
];

export function getCharityById(id: string): Charity {
  return charities.find((c) => c.id === id) ?? charities[0];
}
