import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

interface DoubleBezelCardProps extends ComponentPropsWithoutRef<"div"> {
  hover?: boolean;
  padded?: "sm" | "md" | "lg";
}

const paddingMap = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function DoubleBezelCard({
  children,
  className,
  hover = false,
  padded = "md",
  ...props
}: DoubleBezelCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-1.5",
        hover &&
          "transition-all duration-300 hover:border-accent/30 hover:-translate-y-0.5",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "rounded-lg bg-surface border border-border/40 h-full",
          paddingMap[padded],
        )}
      >
        {children}
      </div>
    </div>
  );
}
