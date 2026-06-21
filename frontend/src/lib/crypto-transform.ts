const ALLOWED_TAGS = /<\/?(p|a|strong|em|br|b|i|ul|ol|li|code|pre)\s*\/?>/gi;

export function stripHtml(html: string | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > 0) return truncated.slice(0, lastSpace) + "…";
  return truncated + "…";
}

export function sanitizeHtml(html: string | null): string {
  if (!html) return "";
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export function formatCategoryDescription(html: string | null, maxLength = 100): string {
  const text = stripHtml(html);
  return truncate(text, maxLength);
}
