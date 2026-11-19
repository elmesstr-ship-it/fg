"use client";

import React, { useEffect, useRef } from "react";
import { useSeasonalVisualStore } from "@/store/seasonalVisualStore";
import { useAppStore } from "@/store/useAppStore";

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  pulseSpeed?: number;
  angle?: number;
  color?: string;
  type?: "dot" | "snow" | "sparkle" | "sunMote";
}

export function SeasonalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { festiveSubMode } = useSeasonalVisualStore();
  const { seasonalTheme } = useAppStore();
  const currentMode = seasonalTheme || "default";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: Particle[] = [];
    const count =
      currentMode === "default"
        ? 18 // Minimal luxury floating motes
        : currentMode === "winter" || currentMode === "christmas"
        ? festiveSubMode === "festive"
          ? 55
          : 30
        : 22; // Ramadan, Eid, Summer

    for (let i = 0; i < count; i++) {
      if (currentMode === "default") {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 1,
          speedY: -(Math.random() * 0.3 + 0.1),
          speedX: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.25 + 0.08,
          type: "dot",
        });
      } else if (currentMode === "winter" || currentMode === "christmas") {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.8 + 1.2,
          speedY: Math.random() * 0.7 + 0.3,
          speedX: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.5 + 0.2,
          type: "snow",
        });
      } else if (currentMode === "ramadan" || currentMode === "eid_fitr" || currentMode === "eid_adha") {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.5 + 1,
          speedY: -(Math.random() * 0.35 + 0.1),
          speedX: (Math.random() - 0.5) * 0.25,
          opacity: Math.random() * 0.4 + 0.15,
          color: Math.random() > 0.4 ? "#D4AF37" : "#F59E0B",
          type: "sparkle",
        });
      } else if (currentMode === "summer") {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3 + 1,
          speedY: -(Math.random() * 0.25 + 0.08),
          speedX: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.3 + 0.1,
          color: "#38BDF8",
          type: "sunMote",
        });
      }
    }

    const drawSparkle = (cx: number, cy: number, size: number, opacity: number, color: string) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      // 4-point subtle star
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(0, 0, size, 0);
      ctx.quadraticCurveTo(0, 0, 0, size);
      ctx.quadraticCurveTo(0, 0, -size, 0);
      ctx.quadraticCurveTo(0, 0, 0, -size);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      if (document.visibilityState === "hidden") {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (p.type === "sparkle") {
          drawSparkle(p.x, p.y, p.radius * 2, p.opacity, p.color || "#D4AF37");
        } else if (p.type === "snow") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
          ctx.fill();
        } else if (p.type === "sunMote") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(56, 189, 248, 0.4)";
          ctx.fill();
        } else {
          // Minimal luxury dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
          ctx.fill();
        }

        p.y += p.speedY;
        p.x += p.speedX;

        if (p.speedY < 0 && p.y < -15) {
          p.y = height + 10;
          p.x = Math.random() * width;
        } else if (p.speedY > 0 && p.y > height + 15) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentMode, festiveSubMode]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30 h-full w-full opacity-60"
      aria-hidden="true"
    />
  );
}
