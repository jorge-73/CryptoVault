import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-red/20 bg-red/5 p-8 text-center", className)}>
      <AlertCircle className="h-8 w-8 text-red mb-3" />
      <p className="text-sm font-medium text-red mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red px-3 py-1.5 text-xs font-medium text-white hover:bg-red/90 transition-colors active:scale-95 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reintentar
        </button>
      )}
    </div>
  );
}
