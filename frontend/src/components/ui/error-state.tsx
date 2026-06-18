import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red/20 bg-red/5 p-8 text-center">
      <AlertCircle className="h-8 w-8 text-red mb-3" />
      <p className="text-sm font-medium text-red mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red px-3 py-1.5 text-xs font-medium text-white hover:bg-red/90 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reintentar
        </button>
      )}
    </div>
  );
}
