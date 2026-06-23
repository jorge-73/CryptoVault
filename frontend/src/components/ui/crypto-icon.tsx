import Image from "next/image";
import { cn } from "@/lib/utils";

interface CryptoIconProps {
  src: string | null;
  alt: string;
  symbol: string;
  size?: number;
  className?: string;
}

export function CryptoIcon({ src, alt, symbol, size = 24, className }: CryptoIconProps) {
  if (src) {
    return (
      <div
        className={cn("relative flex-shrink-0", className)}
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          className="rounded-full object-contain"
          sizes={`${size}px`}
        />
      </div>
    );
  }

  const fontSize = Math.max(8, Math.round(size * 0.35));
  return (
    <div
      className={cn("flex-shrink-0 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground", className)}
      style={{ width: size, height: size, fontSize }}
    >
      {symbol[0]?.toUpperCase()}
    </div>
  );
}
