import Image from "next/image";
import type { Charity } from "@/lib/types";

export default function CauseCard({ charity }: { charity: Charity }) {
  const Icon = charity.icon;

  if (charity.photo) {
    return (
      <div key={charity.id} className="animate-pop-in relative w-full">
        <div className="relative h-40 w-full">
          <Image
            src={charity.photo}
            alt=""
            fill
            priority
            sizes="(max-width: 640px) 100vw, 420px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 px-4 pb-3">
          <p className="truncate text-[15px] font-extrabold leading-tight text-white">{charity.name}</p>
          <p className="truncate text-[12.5px] leading-snug text-white/80">{charity.tagline}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      key={charity.id}
      className="animate-pop-in flex items-center gap-3.5 rounded-3xl px-4 py-3.5 text-left shadow-sm"
      style={{ backgroundColor: charity.tint }}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/60">
        <Icon size={24} strokeWidth={2} style={{ color: charity.accent }} aria-hidden />
      </div>

      <div className="min-w-0">
        <p className="truncate text-[15px] font-extrabold leading-tight text-clay">{charity.name}</p>
        <p className="truncate text-[12.5px] leading-snug text-clay/60">{charity.tagline}</p>
      </div>
    </div>
  );
}
