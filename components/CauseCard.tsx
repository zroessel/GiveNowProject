import type { Charity } from "@/lib/types";

export default function CauseCard({ charity }: { charity: Charity }) {
  return (
    <div key={charity.id} className="animate-pop-in flex flex-col items-center gap-5 text-center">
      <div
        className="flex h-36 w-36 items-center justify-center rounded-[2.5rem] text-6xl shadow-inner"
        style={{ backgroundColor: charity.tint }}
      >
        <span aria-hidden>{charity.emoji}</span>
      </div>

      <div className="flex flex-col gap-2 px-6">
        <h1 className="text-[26px] font-extrabold leading-tight text-clay">{charity.name}</h1>
        <p className="text-[15px] leading-snug text-clay/65">{charity.tagline}</p>
      </div>
    </div>
  );
}
