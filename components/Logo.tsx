import { Heart } from "lucide-react";

export default function Logo() {
  return (
    <span className="flex items-center gap-1.5 text-sm font-extrabold tracking-tight text-clay/70">
      <Heart size={16} strokeWidth={2.5} className="text-terracotta" fill="currentColor" />
      GiveNow
    </span>
  );
}
