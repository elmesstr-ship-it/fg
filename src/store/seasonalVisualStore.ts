import { create } from "zustand";

export type SeasonalVisualMode = "default" | "christmas" | "halloween";
export type ChristmasSubMode = "subtle" | "festive";

interface SeasonalVisualState {
  currentMode: SeasonalVisualMode;
  christmasSubMode: ChristmasSubMode;
  setMode: (mode: SeasonalVisualMode) => void;
  setChristmasSubMode: (subMode: ChristmasSubMode) => void;
}

export const useSeasonalVisualStore = create<SeasonalVisualState>((set) => ({
  currentMode: "default",
  christmasSubMode: "subtle",
  setMode: (mode) => {
    set({ currentMode: mode });
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-seasonal-mode", mode);
    }
  },
  setChristmasSubMode: (subMode) => set({ christmasSubMode: subMode }),
}));
