"use client";

import { motion, useReducedMotion } from "framer-motion";
import { durations, easings, staggerContainer, fadeSlideUpItem } from "@/lib/motion";

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerGrid({ children, className }: StaggerGridProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={staggerContainer(0.04)}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={fadeSlideUpItem(16, durations.normal, easings.default)}
      className={className}
    >
      {children}
    </motion.div>
  );
}
