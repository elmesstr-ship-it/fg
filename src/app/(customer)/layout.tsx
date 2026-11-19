import React from "react";
import { SanctuaryNavbar } from "@/components/navigation/SanctuaryNavbar";
import { SanctuaryMobileBottomBar } from "@/components/navigation/SanctuaryMobileBottomBar";
import { SeasonalCanvas } from "@/components/seasonal/SeasonalCanvas";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
      <SeasonalCanvas />
      <SanctuaryNavbar />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      <SanctuaryMobileBottomBar />
    </div>
  );
}
