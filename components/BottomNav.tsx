"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, PawPrint, Settings } from "lucide-react";

const TABS = [
  { href: "/", label: "Give", icon: Heart },
  { href: "/tap-and-feed", label: "Tap & Feed", icon: PawPrint },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="absolute bottom-0 inset-x-0 z-40 border-t border-clay/10 bg-cream/90 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 text-center"
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 2}
                fill={active ? "currentColor" : "none"}
                fillOpacity={active ? 0.15 : 0}
                className={`transition-transform ${
                  active ? "scale-110 text-terracotta-deep" : "scale-100 text-clay/40"
                }`}
              />
              <span
                className={`text-[11px] font-bold tracking-tight transition-colors ${
                  active ? "text-terracotta-deep" : "text-clay/45"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
