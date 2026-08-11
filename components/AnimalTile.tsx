"use client";

import { useRef, useState } from "react";
import { Heart, Sparkle, Star, type LucideIcon } from "lucide-react";
import type { Animal } from "@/lib/animals";

const SPARKLE_ICONS: { icon: LucideIcon; color: string }[] = [
  { icon: Sparkle, color: "#F2B84B" },
  { icon: Star, color: "#E2703A" },
  { icon: Heart, color: "#C1666B" },
];

interface Particle {
  id: number;
  left: number;
  icon: LucideIcon;
  color: string;
}

export default function AnimalTile({ animal, onFeed }: { animal: Animal; onFeed: () => void }) {
  const [bounceKey, setBounceKey] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [feedCount, setFeedCount] = useState(0);
  const nextParticleId = useRef(0);
  const Icon = animal.icon;

  const handleTap = () => {
    setBounceKey((k) => k + 1);
    setFeedCount((c) => c + 1);

    const newParticles: Particle[] = Array.from({ length: 3 }, () => {
      const choice = SPARKLE_ICONS[Math.floor(Math.random() * SPARKLE_ICONS.length)];
      return {
        id: nextParticleId.current++,
        left: 28 + Math.random() * 44,
        icon: choice.icon,
        color: choice.color,
      };
    });
    const idsToRemove = new Set(newParticles.map((p) => p.id));
    setParticles((p) => [...p, ...newParticles]);
    setTimeout(() => {
      setParticles((p) => p.filter((particle) => !idsToRemove.has(particle.id)));
    }, 700);

    onFeed();
  };

  return (
    <button
      onClick={handleTap}
      className="flex flex-col items-center gap-1.5 rounded-3xl py-6 shadow-sm ring-1 ring-clay/5 transition-transform active:scale-95"
      style={{ backgroundColor: animal.tint }}
    >
      <div className="relative flex h-14 items-center justify-center">
        <Icon
          key={bounceKey}
          size={40}
          strokeWidth={1.75}
          className="animate-bounce-tap"
          style={{ color: animal.accent }}
          aria-hidden
        />
        {particles.map((p) => {
          const ParticleIcon = p.icon;
          return (
            <ParticleIcon
              key={p.id}
              size={15}
              strokeWidth={2}
              fill={p.color}
              className="pointer-events-none absolute top-0 animate-sparkle-rise"
              style={{ left: `${p.left}%`, color: p.color }}
              aria-hidden
            />
          );
        })}
      </div>
      <span className="text-sm font-bold text-clay">{animal.name}</span>
      <span className="h-4 text-[11px] font-semibold text-clay/45">
        {feedCount > 0 ? `Fed ${feedCount}×` : ""}
      </span>
    </button>
  );
}
