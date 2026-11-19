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
    <div className="flex flex-col min-h-screen relative selection:bg-[#c5a059]/30 selection:text-[#781d22]">
      <SeasonalCanvas />
      <SanctuaryNavbar />
      <main className="flex-1">{children}</main>
      <SanctuaryMobileBottomBar />
    </div>
  );
}
