"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { durations } from "@/lib/motion";

interface AnimatedMountProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedMount({ children, className }: AnimatedMountProps) {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className={className} suppressHydrationWarning>{children}</div>;
  }

  if (prefersReduced) {
    return <div className={className} suppressHydrationWarning>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.normal, ease: "easeOut" }}
      className={className}
      suppressHydrationWarning
    >
      {children}
    </motion.div>
  );
}
