import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";

type PriceSize = "xs" | "sm" | "md" | "lg" | "xl";

interface PriceDisplayProps {
  value: number | null | undefined;
  size?: PriceSize;
  className?: string;
  as?: "span" | "p" | "div";
  color?: "default" | "positive" | "negative";
}

const sizeStyles: Record<PriceSize, string> = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-lg",
  xl: "text-xl sm:text-2xl",
};

const colorStyles = {
  default: "",
  positive: "text-green",
  negative: "text-red",
};

export function PriceDisplay({
  value,
  size = "md",
  className,
  as: Tag = "span",
  color = "default",
}: PriceDisplayProps) {
  return (
    <Tag
      className={cn(
        "tabular-nums font-mono",
        "font-semibold",
        sizeStyles[size],
        colorStyles[color],
        className,
      )}
    >
      {formatPrice(value)}
    </Tag>
  );
}
