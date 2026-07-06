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
        "rounded-2xl border border-border/40 bg-card/30 p-1.5 backdrop-blur-sm",
        hover &&
          "transition-all duration-500 hover:shadow-lg hover:border-accent/20 hover:-translate-y-0.5",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "rounded-[calc(1.5rem-0.375rem)] bg-card border border-border/20 h-full",
          paddingMap[padded],
        )}
      >
        {children}
      </div>
    </div>
  );
}
