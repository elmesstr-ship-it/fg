"use client";

import React, { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { SEASONAL_THEMES } from "@/config/themes";

interface FloatingGlyph {
  id: number;
  type: "fg-monogram" | "star-4" | "cross-diamond" | "street-crest" | "crescent" | "snowflake";
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  initialRotate: number;
  opacity: number;
  mobileHidden?: boolean;
}

export function SeasonalCanvas() {
  const { seasonalTheme, themeMode } = useAppStore();
  const currentMode = seasonalTheme || "default";
  const activeTheme = SEASONAL_THEMES[currentMode] || SEASONAL_THEMES.default;
  const colors = themeMode === "dark" ? activeTheme.dark : activeTheme.light;

  // Curated floating luxury streetwear icons positioned elegantly across the viewport
  const glyphs: FloatingGlyph[] = useMemo(() => {
    return [
      {
        id: 1,
        type: "fg-monogram",
        left: "8%",
        top: "15%",
        size: 34,
        duration: 22,
        delay: 0,
        initialRotate: -8,
        opacity: 0.18,
      },
      {
        id: 2,
        type: "star-4",
        left: "88%",
        top: "12%",
        size: 24,
        duration: 18,
        delay: 2,
        initialRotate: 12,
        opacity: 0.22,
      },
      {
        id: 3,
        type: "cross-diamond",
        left: "78%",
        top: "35%",
        size: 28,
        duration: 26,
        delay: 4,
        initialRotate: 45,
        opacity: 0.16,
      },
      {
        id: 4,
        type: "street-crest",
        left: "14%",
        top: "48%",
        size: 32,
        duration: 24,
        delay: 1,
        initialRotate: 0,
        opacity: 0.15,
      },
      {
        id: 5,
        type: "fg-monogram",
        left: "90%",
        top: "65%",
        size: 36,
        duration: 20,
        delay: 3,
        initialRotate: 6,
        opacity: 0.16,
      },
      {
        id: 6,
        type: "star-4",
        left: "6%",
        top: "78%",
        size: 22,
        duration: 19,
        delay: 5,
        initialRotate: -15,
        opacity: 0.2,
      },
      // Desktop-only extra atmospheric glyphs (hidden on mobile for zero performance impact)
      {
        id: 7,
        type: "cross-diamond",
        left: "30%",
        top: "8%",
        size: 20,
        duration: 28,
        delay: 6,
        initialRotate: 30,
        opacity: 0.14,
        mobileHidden: true,
      },
      {
        id: 8,
        type: "street-crest",
        left: "70%",
        top: "82%",
        size: 30,
        duration: 25,
        delay: 7,
        initialRotate: -10,
        opacity: 0.15,
        mobileHidden: true,
      },
      {
        id: 9,
        type: "fg-monogram",
        left: "48%",
        top: "92%",
        size: 30,
        duration: 23,
        delay: 2,
        initialRotate: 4,
        opacity: 0.14,
        mobileHidden: true,
      },
      {
        id: 10,
        type: "star-4",
        left: "22%",
        top: "30%",
        size: 18,
        duration: 21,
        delay: 8,
        initialRotate: 20,
        opacity: 0.18,
        mobileHidden: true,
      },
    ];
  }, []);

  // Determine seasonal iconography & primary accent color
  const accentColor = colors.gold || "#D4AF37";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      <style jsx global>{`
        @keyframes fgFloat0 {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(12px, -24px, 0) rotate(6deg);
          }
        }
        @keyframes fgFloat1 {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(-14px, -30px, 0) rotate(-8deg);
          }
        }
        @keyframes fgFloat2 {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(16px, -18px, 0) rotate(10deg);
          }
        }
        .fg-ambient-glyph {
          will-change: transform;
          backface-visibility: hidden;
        }
      `}</style>

      {/* 1. Subtle Editorial Atmospheric Glow (Hardware-accelerated) */}
      <div
        className="absolute top-0 right-1/4 w-[420px] sm:w-[650px] h-[350px] sm:h-[450px] rounded-full blur-[110px] sm:blur-[140px] opacity-[0.06] dark:opacity-[0.14] transition-colors duration-1000"
        style={{ backgroundColor: colors.primary }}
      />
      <div
        className="absolute bottom-1/4 left-1/6 w-[350px] sm:w-[500px] h-[300px] sm:h-[400px] rounded-full blur-[100px] sm:blur-[130px] opacity-[0.04] dark:opacity-[0.10] transition-colors duration-1000"
        style={{ backgroundColor: accentColor }}
      />

      {/* 2. Floating Streetwear Glyphs & FG Monograms */}
      {glyphs.map((g, index) => {
        const animName = `fgFloat${index % 3}`;

        // Select specific seasonal glyph variation if in specialized theme
        let glyphType = g.type;
        if (currentMode === "winter" || currentMode === "christmas") {
          glyphType = index % 2 === 0 ? "snowflake" : g.type;
        } else if (currentMode === "ramadan" || currentMode === "eid_fitr" || currentMode === "eid_adha") {
          glyphType = index % 3 === 0 ? "crescent" : g.type;
        }

        return (
          <div
            key={g.id}
            className={`absolute fg-ambient-glyph transition-opacity duration-700 ${
              g.mobileHidden ? "hidden sm:block" : "block"
            }`}
            style={{
              left: g.left,
              top: g.top,
              width: `${g.size}px`,
              height: `${g.size}px`,
              opacity: g.opacity,
              animation: `${animName} ${g.duration}s ease-in-out infinite`,
              animationDelay: `${g.delay}s`,
              transform: `rotate(${g.initialRotate}deg)`,
              color: accentColor,
            }}
          >
            {/* FG Monogram Badge */}
            {glyphType === "fg-monogram" && (
              <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                <rect
                  x="1.5"
                  y="1.5"
                  width="37"
                  height="37"
                  rx="9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.75"
                />
                <text
                  x="50%"
                  y="55%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="currentColor"
                  fontFamily="'Space Grotesk', sans-serif"
                  fontWeight="900"
                  fontSize="15"
                  letterSpacing="1"
                >
                  FG
                </text>
              </svg>
            )}

            {/* 4-Point Luxury Streetwear Star (✦) */}
            {glyphType === "star-4" && (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 0C12.5 6.5 17.5 11.5 24 12C17.5 12.5 12.5 17.5 12 24C11.5 17.5 6.5 12.5 0 12C6.5 11.5 11.5 6.5 12 0Z" />
              </svg>
            )}

            {/* Cross Diamond Emblem (❖) */}
            {glyphType === "cross-diamond" && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-full h-full">
                <rect x="5" y="5" width="14" height="14" rx="2" transform="rotate(45 12 12)" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              </svg>
            )}

            {/* Streetwear Hexagon Shield Crest */}
            {glyphType === "street-crest" && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-full h-full">
                <path d="M12 2L20 6.5V13.5C20 18 16.5 21.5 12 22C7.5 21.5 4 18 4 13.5V6.5L12 2Z" />
                <path d="M12 6L16 8.5V12C16 14.5 14 16.5 12 17C10 16.5 8 14.5 8 12V8.5L12 6Z" fill="currentColor" fillOpacity="0.3" />
              </svg>
            )}

            {/* Islamic Crescent & Star (for Ramadan / Eid themes) */}
            {glyphType === "crescent" && (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C14.83 21 17.36 19.69 19 17.65C14.58 17.38 11.08 13.88 10.81 9.46C10.93 6.84 12.18 4.54 14 3.05C13.36 3.02 12.69 3 12 3Z" />
                <polygon points="17.5,5.5 18.5,8 21,8.5 19,10.5 19.5,13 17.5,11.5 15.5,13 16,10.5 14,8.5 16.5,8" />
              </svg>
            )}

            {/* Snowflake (for Winter / Holiday theme) */}
            {glyphType === "snowflake" && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.4" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}
