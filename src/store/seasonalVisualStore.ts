import { create } from "zustand";
import { SeasonalThemeId } from "@/types/theme";

export type SeasonalVisualMode = 
  | "default" 
  | "summer" 
  | "winter" 
  | "ramadan" 
  | "eid_fitr" 
  | "eid_adha" 
  | "christmas";

export type FestiveSubMode = "subtle" | "festive";

interface SeasonalVisualState {
  currentMode: SeasonalVisualMode;
  festiveSubMode: FestiveSubMode;
  setMode: (mode: SeasonalVisualMode) => void;
  setFestiveSubMode: (subMode: FestiveSubMode) => void;
}

export const useSeasonalVisualStore = create<SeasonalVisualState>((set) => ({
  currentMode: "default",
  festiveSubMode: "subtle",
  setMode: (mode) => {
    set({ currentMode: mode });
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-seasonal-mode", mode);
    }
  },
  setFestiveSubMode: (subMode) => set({ festiveSubMode: subMode }),
}));
