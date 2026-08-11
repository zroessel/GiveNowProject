import { Suspense } from "react";
import HomeScreen from "@/components/HomeScreen";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeScreen />
    </Suspense>
  );
}
