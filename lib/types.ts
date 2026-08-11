import type { LucideIcon } from "lucide-react";

export interface Charity {
  id: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  /** Solid hex used for the donate button + small UI accents */
  accent: string;
  /** Soft hex wash used behind the cause banner */
  tint: string;
  /** Cost in CAD to fund one unit of impact (e.g. $0.20 per meal) */
  costPerUnitCad: number;
  unitSingular: string;
  unitPlural: string;
  /** Full impact sentence fragment for a given unit count, e.g. "12 hot meals delivered this week" */
  describeImpact: (units: number) => string;
}
