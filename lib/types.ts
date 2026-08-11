export interface OutcomeTier {
  amountCad: number;
  impact: string;
}

export interface Charity {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  /** Solid hex used for the donate button + small UI accents */
  accent: string;
  /** Soft hex wash used behind the cause card */
  tint: string;
  outcomes: OutcomeTier[];
}
