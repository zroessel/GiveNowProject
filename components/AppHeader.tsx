import ImpactMeter from "@/components/ImpactMeter";
import Logo from "@/components/Logo";

export default function AppHeader() {
  return (
    <header className="relative z-10 mx-4 mt-[calc(0.75rem+env(safe-area-inset-top))] flex items-center justify-between rounded-full bg-white/90 px-4 py-2.5 shadow-md ring-1 ring-black/5 backdrop-blur-md">
      <Logo />
      <ImpactMeter />
    </header>
  );
}
