import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { es } from "@/translations/es";

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
        <Button variant="danger" size="sm" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" />
          {es.error.retry}
        </Button>
      )}
    </div>
  );
}
