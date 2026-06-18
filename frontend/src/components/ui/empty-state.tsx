import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border bg-card p-12 text-center",
        className
      )}
    >
      <div className="mb-4 text-muted-foreground">{icon}</div>
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {description}
      </p>
      {action}
    </div>
  );
}
