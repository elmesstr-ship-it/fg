"use client";

import React, { useEffect, useRef } from "react";
import { useSeasonalVisualStore } from "@/store/seasonalVisualStore";

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
  type?: "goldCross" | "censerSmoke" | "snow" | "goldStar" | "leaf" | "candleGlow";
}

export function SeasonalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { currentMode, christmasSubMode } = useSeasonalVisualStore();

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
        ? 22 // Elegant floating gold liturgical crosses and radiant sparkles
        : currentMode === "christmas"
        ? christmasSubMode === "festive"
          ? 65
          : 32
        : 28; // Halloween / Autumn

    for (let i = 0; i < count; i++) {
      if (currentMode === "default") {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 4 + 2,
          speedY: -(Math.random() * 0.4 + 0.15), // Ascends gently like evening incense
          speedX: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.4 + 0.15,
          angle: Math.random() * 360,
          type: Math.random() > 0.5 ? "goldCross" : "censerSmoke",
        });
      } else if (currentMode === "christmas") {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3 + 1.5,
          speedY: Math.random() * 0.8 + 0.4,
          speedX: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.6 + 0.3,
          angle: Math.random() * 360,
          type: Math.random() > 0.75 ? "goldStar" : "snow",
        });
      } else if (currentMode === "halloween") {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3.5 + 2,
          speedY: Math.random() * 0.6 + 0.3,
          speedX: Math.sin(Math.random() * 3) * 0.7,
          opacity: Math.random() * 0.4 + 0.2,
          angle: Math.random() * 360,
          color: Math.random() > 0.5 ? "#E65100" : "#752092",
          type: Math.random() > 0.7 ? "candleGlow" : "leaf",
        });
      }
    }

    const drawCross = (x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = `rgba(197, 160, 89, ${opacity})`;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "#C5A059";

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(0, size);
      ctx.stroke();

      // Horizontal line (placed at 1/3 from top for classic liturgical cross)
      ctx.beginPath();
      ctx.moveTo(-size * 0.65, -size * 0.35);
      ctx.lineTo(size * 0.65, -size * 0.35);
      ctx.stroke();

      ctx.restore();
    };

    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, opacity: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fillStyle = `rgba(212, 175, 55, ${opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#FFD700";
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      if (document.visibilityState === "hidden") {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. DEFAULT THEME: Floating Byzantine Crosses & Sacred Incense Spores
      if (currentMode === "default") {
        for (const p of particles) {
          if (p.type === "goldCross") {
            drawCross(p.x, p.y, p.radius * 2, p.opacity);
          } else {
            // Incense glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(197, 160, 89, ${p.opacity * 0.6})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = "rgba(197, 160, 89, 0.4)";
            ctx.fill();
          }

          p.y += p.speedY;
          p.x += p.speedX;

          if (p.y < -20) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x > width) p.x = 0;
          if (p.x < 0) p.x = width;
        }
      }

      // 2. CHRISTMAS THEME: Bethlehem Stars & Dancing Snowflakes
      if (currentMode === "christmas") {
        for (const p of particles) {
          if (p.type === "goldStar") {
            drawStar(p.x, p.y, 4, p.radius * 2.5, p.radius * 1.2, p.opacity);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
            ctx.fill();
          }

          p.y += p.speedY;
          p.x += p.speedX;

          if (p.y > height + 10) {
            p.y = -10;
            p.x = Math.random() * width;
          }
          if (p.x > width) p.x = 0;
          if (p.x < 0) p.x = width;
        }
      }

      // 3. HALLOWEEN THEME: Autumn Leaves & Warm Amber Candle Spores
      if (currentMode === "halloween") {
        for (const p of particles) {
          ctx.save();
          ctx.translate(p.x, p.y);
          if (p.angle !== undefined) ctx.rotate((p.angle * Math.PI) / 180);

          if (p.type === "leaf") {
            ctx.fillStyle = p.color || "#E65100";
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.radius * 2, p.radius, 0, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(230, 81, 0, 0.7)";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#FF6F00";
            ctx.fill();
          }
          ctx.restore();

          p.y += p.speedY;
          p.x += p.speedX;
          if (p.angle !== undefined) p.angle += 0.4;

          if (p.y > height + 10) {
            p.y = -10;
            p.x = Math.random() * width;
          }
          if (p.x > width) p.x = 0;
          if (p.x < 0) p.x = width;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentMode, christmasSubMode]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30 h-full w-full opacity-80"
      aria-hidden="true"
    />
  );
}
