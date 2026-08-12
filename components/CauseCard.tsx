import Image from "next/image";
import type { Charity } from "@/lib/types";

/** Shared with HomeScreen's spacer so content below the hero lines up exactly. */
export const HERO_HEIGHT_CLASS = "h-60";

export default function CauseCard({ charity }: { charity: Charity }) {
  const Icon = charity.icon;

  return (
    <div
      key={charity.id}
      className={`animate-pop-in absolute inset-x-0 top-0 w-full overflow-hidden ${HERO_HEIGHT_CLASS}`}
    >
      {charity.photo ? (
        <>
          <Image
            src={charity.photo}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/35" />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: charity.tint }}>
          <Icon size={72} strokeWidth={1.5} style={{ color: charity.accent }} aria-hidden />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 px-5 pb-4">
        <p
          className={`text-[17px] font-extrabold leading-tight ${
            charity.photo ? "text-white" : "text-clay"
          }`}
        >
          {charity.name}
        </p>
        <p
          className={`mt-0.5 text-[13px] leading-snug ${
            charity.photo ? "text-white/85" : "text-clay/60"
          }`}
        >
          {charity.tagline}
        </p>
      </div>
    </div>
  );
}
