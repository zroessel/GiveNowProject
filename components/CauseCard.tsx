import type { Charity } from "@/lib/types";

export default function CauseCard({ charity }: { charity: Charity }) {
  return (
    <div
      key={charity.id}
      className="animate-pop-in flex items-center gap-3.5 rounded-3xl px-4 py-3.5 text-left shadow-sm"
      style={{ backgroundColor: charity.tint }}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/60 text-2xl">
        <span aria-hidden>{charity.emoji}</span>
      </div>

      <div className="min-w-0">
        <p className="truncate text-[15px] font-extrabold leading-tight text-clay">{charity.name}</p>
        <p className="truncate text-[12.5px] leading-snug text-clay/60">{charity.tagline}</p>
      </div>
    </div>
  );
}
