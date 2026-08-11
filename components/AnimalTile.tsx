"use client";

import { useRef, useState } from "react";
import type { Animal } from "@/lib/animals";

const SPARKLES = ["✨", "💛", "⭐"];

interface Particle {
  id: number;
  left: number;
  symbol: string;
}

export default function AnimalTile({ animal, onFeed }: { animal: Animal; onFeed: () => void }) {
  const [bounceKey, setBounceKey] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [feedCount, setFeedCount] = useState(0);
  const nextParticleId = useRef(0);

  const handleTap = () => {
    setBounceKey((k) => k + 1);
    setFeedCount((c) => c + 1);

    const newParticles: Particle[] = Array.from({ length: 3 }, () => ({
      id: nextParticleId.current++,
      left: 28 + Math.random() * 44,
      symbol: SPARKLES[Math.floor(Math.random() * SPARKLES.length)],
    }));
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
        <span key={bounceKey} className="block text-5xl animate-bounce-tap" aria-hidden>
          {animal.emoji}
        </span>
        {particles.map((p) => (
          <span
            key={p.id}
            className="pointer-events-none absolute top-0 text-lg animate-sparkle-rise"
            style={{ left: `${p.left}%` }}
            aria-hidden
          >
            {p.symbol}
          </span>
        ))}
      </div>
      <span className="text-sm font-bold text-clay">{animal.name}</span>
      <span className="h-4 text-[11px] font-semibold text-clay/45">
        {feedCount > 0 ? `Fed ${feedCount}×` : ""}
      </span>
    </button>
  );
}
