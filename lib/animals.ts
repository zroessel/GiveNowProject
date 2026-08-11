export interface Animal {
  id: string;
  name: string;
  emoji: string;
  tint: string;
}

export const animals: Animal[] = [
  { id: "chick", name: "Chick", emoji: "🐥", tint: "#FBF1DD" },
  { id: "pig", name: "Pig", emoji: "🐷", tint: "#FAE7E8" },
  { id: "goat", name: "Goat", emoji: "🐐", tint: "#EAF1E3" },
  { id: "bunny", name: "Bunny", emoji: "🐰", tint: "#E3F3F0" },
];
