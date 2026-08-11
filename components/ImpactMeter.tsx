"use client";

import { useEffect, useState } from "react";
import { Utensils } from "lucide-react";
import { useImpact } from "@/lib/impact-store";
import { formatMeals, UNIVERSAL_UNIT_LABEL } from "@/lib/impact";

export default function ImpactMeter() {
  const { totalMeals } = useImpact();
  const [prevTotal, setPrevTotal] = useState(totalMeals);
  const [pulse, setPulse] = useState(false);

  if (totalMeals !== prevTotal) {
    setPrevTotal(totalMeals);
    setPulse(true);
  }

  useEffect(() => {
    if (!pulse) return;
    const timer = setTimeout(() => setPulse(false), 400);
    return () => clearTimeout(timer);
  }, [pulse]);

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 shadow-sm ring-1 ring-clay/10 backdrop-blur-sm ${
        pulse ? "animate-meter-pulse" : ""
      }`}
      aria-live="polite"
    >
      <Utensils size={15} strokeWidth={2.25} className="text-terracotta-deep" aria-hidden />
      <span className="text-[13px] font-bold text-clay">
        {formatMeals(totalMeals)} <span className="font-semibold text-clay/60">{UNIVERSAL_UNIT_LABEL} given</span>
      </span>
    </div>
  );
}
