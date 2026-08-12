import type { LucideIcon } from "lucide-react";

const SWARM_CAP = 24;

interface Props {
  icon: LucideIcon;
  count: number;
  noun: string;
  tint: string;
  accent: string;
}

export default function ImpactCategoryCard({ icon: Icon, count, noun, tint, accent }: Props) {
  const shown = Math.min(count, SWARM_CAP);
  const overflow = count - shown;

  return (
    <div className="rounded-3xl bg-white/70 p-4 shadow-sm ring-1 ring-clay/8">
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: tint }}
        >
          <Icon size={22} strokeWidth={2} style={{ color: accent }} aria-hidden />
        </div>
        <p className="text-[15px] font-extrabold leading-tight text-clay">
          {count} {noun}
        </p>
      </div>

      {count > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {Array.from({ length: shown }, (_, i) => (
            <Icon key={i} size={14} strokeWidth={2} style={{ color: accent }} aria-hidden />
          ))}
          {overflow > 0 && (
            <span className="text-[12px] font-bold" style={{ color: accent }}>
              +{overflow}
            </span>
          )}
        </div>
      ) : (
        <p className="mt-3 text-[12px] font-medium text-clay/40">Give to start filling this up</p>
      )}
    </div>
  );
}
