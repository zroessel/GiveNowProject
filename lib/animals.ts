import { Bird, Cat, Dog, Rabbit, type LucideIcon } from "lucide-react";

export interface Animal {
  id: string;
  name: string;
  icon: LucideIcon;
  tint: string;
  accent: string;
}

export const animals: Animal[] = [
  { id: "chick", name: "Chick", icon: Bird, tint: "#FBF1DD", accent: "#D9A441" },
  { id: "bunny", name: "Bunny", icon: Rabbit, tint: "#E3F3F0", accent: "#3C9D8F" },
  { id: "cat", name: "Cat", icon: Cat, tint: "#FAE7E8", accent: "#C1666B" },
  { id: "dog", name: "Dog", icon: Dog, tint: "#EAF1E3", accent: "#6B8F55" },
];
