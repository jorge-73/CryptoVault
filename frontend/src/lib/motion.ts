import type { Easing } from "framer-motion";

export const durations = {
  fast: 0.25,
  normal: 0.35,
  medium: 0.5,
  slow: 0.6,
} as const;

export const easings = {
  out: [0.32, 0.72, 0, 1] as const,
  default: "easeOut" as const,
};

export const viewport = {
  once: true as const,
  margin: "-80px" as const,
};

export const fadeSlideUp = (y = 16) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0 },
});

export const fadeSlideUpItem = (y = 16, dur?: number, easing?: Easing) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: dur ?? durations.slow, ease: easing ?? easings.out } },
});

export const staggerContainer = (stagger = 0.12) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: stagger } },
});

export const rowItem = (y = 8, dur?: number) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: dur ?? durations.fast } },
});
