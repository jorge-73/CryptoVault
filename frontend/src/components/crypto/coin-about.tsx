import { Globe, ExternalLink } from "lucide-react";

interface CoinAboutProps {
  description: string | null;
  homepage: string | null;
  explorer: string | null;
}

export function CoinAbout({ description, homepage, explorer }: CoinAboutProps) {
  if (!description && !homepage && !explorer) return null;

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-6 space-y-4">
      <h2 className="text-lg font-semibold">Acerca de</h2>

      {description && (
        <div
          className="text-sm text-muted-foreground leading-relaxed [&_a]:text-accent [&_a]:underline"
          dangerouslySetInnerHTML={{
            __html: description.length > 1000
              ? description.slice(0, 1000) + "..."
              : description,
          }}
        />
      )}

      <div className="flex flex-wrap gap-4 pt-2">
        {homepage && (
          <a
            href={homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            <Globe className="h-4 w-4" />
            Sitio web
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {explorer && (
          <a
            href={explorer}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Explorador
          </a>
        )}
      </div>
    </div>
  );
}
