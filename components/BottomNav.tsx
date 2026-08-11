"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Give", icon: "💛" },
  { href: "/tap-and-feed", label: "Tap & Feed", icon: "🐣" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-clay/10 bg-cream/90 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-center"
            >
              <span
                className={`text-xl leading-none transition-transform ${active ? "scale-110" : "opacity-50"}`}
              >
                {tab.icon}
              </span>
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
