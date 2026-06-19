"use client";

import { motion } from "framer-motion";

interface AnimatedMountProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedMount({ children, className }: AnimatedMountProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
