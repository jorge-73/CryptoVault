const LOCALE = "es-AR";

export function formatPrice(price: number | null | undefined): string {
  if (price == null || Number.isNaN(price)) return "—";
  if (price >= 1) {
    return price.toLocaleString(LOCALE, { style: "currency", currency: "USD" });
  }
  return price.toLocaleString(LOCALE, {
    style: "currency",
    currency: "USD",
    minimumSignificantDigits: 4,
  });
}

export function formatPercentage(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toLocaleString(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

export function formatMarketCap(value: number | null | undefined): string {
  if (value == null) return "—";
  if (value >= 1e12) return `$${(value / 1e12).toLocaleString(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}T`;
  if (value >= 1e9) return `$${(value / 1e9).toLocaleString(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}B`;
  if (value >= 1e6) return `$${(value / 1e6).toLocaleString(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`;
  return `$${value.toLocaleString(LOCALE)}`;
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return "—";
  return value.toLocaleString(LOCALE);
}
