import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "GiveNow — Donating is one tap away",
  description:
    "A concept donation app: one curated cause, one big button, instant real-world impact.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fff8f0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${nunito.variable} h-dvh antialiased`}>
      <body className="h-dvh overflow-hidden bg-black text-clay sm:flex sm:items-center sm:justify-center sm:p-6">
        {/* On phones this is edge-to-edge, matching the real app. From `sm` up it becomes
            a phone-shaped frame centered on the page — the app is designed mobile-first
            and should still *read* as mobile on a laptop, not stretch full-bleed. */}
        <div className="relative mx-auto flex h-dvh w-full flex-col overflow-hidden bg-cream sm:h-[min(852px,100dvh-3rem)] sm:w-auto sm:aspect-[393/852] sm:max-w-[92vw] sm:rounded-[2.75rem] sm:shadow-2xl sm:ring-1 sm:ring-clay/10">
          <div className="flex min-h-0 flex-1 flex-col pb-[calc(4.25rem+env(safe-area-inset-bottom))]">
            {children}
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
