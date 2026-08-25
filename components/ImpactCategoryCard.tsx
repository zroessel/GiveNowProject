"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Charity } from "@/lib/types";

const SWARM_CAP = 18;
const THUMB_OFFSET_CLASS = "pl-[70px]";

export default function ImpactCategoryCard({ charity, units }: { charity: Charity; units: number }) {
  const Icon = charity.icon;
  const prevUnits = useRef(units);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (units > prevUnits.current) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 500);
      prevUnits.current = units;
      return () => clearTimeout(timer);
    }
    prevUnits.current = units;
  }, [units]);

  const funded = units > 0;
  const noun = units === 1 ? charity.unitSingular : charity.unitPlural;
  const shown = Math.min(units, SWARM_CAP);
  const overflow = units - shown;

  return (
    <div
      className={`rounded-3xl bg-white/70 p-4 shadow-sm ring-1 ring-clay/8 ${pulse ? "animate-meter-pulse" : ""}`}
    >
      <div className="flex items-center gap-3.5">
        <div className="relative h-14 w-14 shrink-0">
          {charity.photo ? (
            <Image
              src={charity.photo}
              alt=""
              fill
              sizes="56px"
              className={`rounded-2xl object-cover transition-[filter,opacity] duration-300 ${
                funded ? "opacity-100" : "opacity-40 grayscale"
              }`}
            />
          ) : (
            <div className="h-full w-full rounded-2xl" style={{ backgroundColor: charity.tint }} />
          )}
          <div
            className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-cream"
            style={{ backgroundColor: charity.tint }}
          >
            <Icon size={14} strokeWidth={2.25} style={{ color: charity.accent }} aria-hidden />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-bold uppercase tracking-wide text-clay/40">
            {charity.name}
          </p>
          <p className="text-[19px] font-extrabold leading-tight text-clay">
            {units} <span className="text-[14px] font-bold text-clay/60">{noun}</span>
          </p>
        </div>
      </div>

      {funded ? (
        <div className={`mt-3 flex flex-wrap items-center gap-1.5 ${THUMB_OFFSET_CLASS}`}>
          {Array.from({ length: shown }, (_, i) => (
            <Icon key={i} size={13} strokeWidth={2.25} style={{ color: charity.accent }} aria-hidden />
          ))}
          {overflow > 0 && (
            <span className="text-[11px] font-bold" style={{ color: charity.accent }}>
              +{overflow}
            </span>
          )}
        </div>
      ) : (
        <p className={`mt-3 text-[12px] font-medium text-clay/40 ${THUMB_OFFSET_CLASS}`}>
          Give to start filling this in
        </p>
      )}
    </div>
  );
}
