"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import React from "react";

// Standard Easing Curves for Sacred/Editorial feel
export const sacredEase = [0.16, 1, 0.3, 1] as const;

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: sacredEase },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: sacredEase },
  },
  exit: { opacity: 0, y: 16, transition: { duration: 0.3 } },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const cardHoverVariants: Variants = {
  initial: { y: 0 },
  hover: {
    y: -6,
    transition: { duration: 0.4, ease: sacredEase },
  },
};

export const goldShimmerVariants: Variants = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      repeat: Infinity,
      duration: 3.5,
      ease: "linear",
    },
  },
};

export interface MotionWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeUp({ children, className, delay = 0 }: MotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: sacredEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGrid({ children, className }: MotionWrapperProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionCard({ children, className, onClick }: MotionWrapperProps & { onClick?: () => void }) {
  return (
    <motion.div
      variants={cardHoverVariants}
      initial="initial"
      whileHover="hover"
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
}
