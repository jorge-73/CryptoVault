const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (res.status === 401 && !endpoint.includes("/auth/refresh") && !endpoint.includes("/auth/me")) {
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (refreshRes.ok) {
      const retryRes = await fetch(url, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        ...options,
      });

      if (retryRes.ok) {
        return retryRes.json();
      }

      const retryBody = await retryRes.json().catch(() => ({ error: "Request failed" }));
      throw new ApiError(retryBody.error || "Request failed", retryRes.status);
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new ApiError(body.error || "Request failed", res.status);
  }

  return res.json();
}

export const api = {
  auth: {
    register: (data: { email: string; password: string; name?: string }) =>
      request<{ user: { id: string; email: string; name: string | null } }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    login: (data: { email: string; password: string }) =>
      request<{ user: { id: string; email: string; name: string | null } }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),
    refresh: () =>
      request<{ user: { id: string; email: string; name: string | null } }>("/auth/refresh", {
        method: "POST",
      }),
    me: () => request<{ user: { id: string; email: string; name: string | null } }>("/auth/me"),
  },
  crypto: {
    getMarkets: (currency = "usd", perPage = 50) =>
      request<any[]>(`/crypto/markets?currency=${currency}&per_page=${perPage}`),
    getCategories: () => request<any[]>("/crypto/categories"),
    getChart: (coinId: string, currency = "usd", days = 7) =>
      request<{ coinId: string; currency: string; days: number; prices: { timestamp: number; price: number }[] }>(
        `/crypto/chart/${coinId}?currency=${currency}&days=${days}`
      ),
  },
  favorites: {
    getAll: () => request<any[]>("/favorites"),
    add: (cryptoId: string) =>
      request<{ message: string }>("/favorites", {
        method: "POST",
        body: JSON.stringify({ cryptoId }),
      }),
    remove: (cryptoId: string) =>
      request<{ message: string }>(`/favorites/${cryptoId}`, { method: "DELETE" }),
  },
};
