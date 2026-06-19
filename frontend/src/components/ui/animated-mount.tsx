"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedMountProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedMount({ children, className }: AnimatedMountProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

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
