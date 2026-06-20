import { env } from '../config/env.js';
import { getCache, setCache, getStaleCache, getPending, setPending } from './cache.js';

const BASE = env.COINGECKO_API_URL;
const FETCH_TIMEOUT = 5000;

const MARKETS_TTL = 60_000;
const CATEGORIES_TTL = 300_000;

async function fetchWithTimeout(endpoint: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${BASE}${endpoint}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchFromCoinGecko<T>(endpoint: string, attempt = 1): Promise<T> {
  let response: Response;

  try {
    response = await fetchWithTimeout(endpoint, FETCH_TIMEOUT);
  } catch (err) {
    const isTimeout = err instanceof DOMException && err.name === 'AbortError';
    if (isTimeout && attempt < 2) {
      console.warn(`[COINGECKO] Timeout on ${endpoint}, retrying (attempt ${attempt + 1})...`);
      await new Promise((r) => setTimeout(r, 500 * attempt));
      return fetchFromCoinGecko<T>(endpoint, attempt + 1);
    }
    throw new Error(isTimeout
      ? `CoinGecko timeout after ${FETCH_TIMEOUT}ms`
      : `CoinGecko network error: ${err instanceof Error ? err.message : 'Unknown error'}`
    );
  }

  if (response.status === 429 && attempt < 2) {
    console.warn(`[COINGECKO] Rate limited on ${endpoint}, retrying (attempt ${attempt + 1})...`);
    await new Promise((r) => setTimeout(r, 500 * attempt));
    return fetchFromCoinGecko<T>(endpoint, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function cachedFetch<T>(endpoint: string, ttl: number): Promise<T> {
  const cached = getCache<T>(endpoint);
  if (cached) return Promise.resolve(cached);

  const pending = getPending<T>(endpoint);
  if (pending) return pending;

  const promise = fetchFromCoinGecko<T>(endpoint).then((data) => {
    setCache(endpoint, data, ttl);
    return data;
  }).catch((err) => {
    const stale = getStaleCache<T>(endpoint);
    if (stale) {
      console.warn(`[COINGECKO] Serving stale cache for ${endpoint}: ${err.message}`);
      return stale;
    }
    throw err;
  });

  setPending(endpoint, promise);
  return promise;
}

export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number;
  market_cap_rank: number | null;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d_in_currency: number | null;
  total_volume: number;
  circulating_supply: number;
}

export interface CoinCategory {
  id: string;
  name: string;
  market_cap: number | null;
  market_cap_change_24h: number | null;
  content: string | null;
  volume_24h: number | null;
  top_3_coins: { id: string; image: string | null }[];
}

export interface ChartDataPoint {
  timestamp: number;
  price: number;
}

export interface CoinChartData {
  coinId: string;
  currency: string;
  days: number;
  prices: ChartDataPoint[];
}

const CHART_TTL = 300_000;
const COIN_DETAIL_TTL = 300_000;

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: string;
  description: string | null;
  homepage: string | null;
  explorer: string | null;
  current_price: number | null;
  market_cap: number;
  market_cap_rank: number | null;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d_in_currency: number | null;
  total_volume: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
}

export interface GlobalData {
  total_market_cap: number;
  total_volume_24h: number;
  btc_dominance: number;
  market_cap_change_24h: number;
  active_cryptocurrencies: number;
}

const GLOBAL_TTL = 120_000;

export const coingeckoService = {
  async getMarkets(currency: string = 'usd', perPage: number = 50, category?: string): Promise<CoinMarket[]> {
    let endpoint = `/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false&price_change_percentage=7d`;
    if (category) endpoint += `&category=${category}`;
    return cachedFetch<CoinMarket[]>(endpoint, MARKETS_TTL);
  },

  async getCategories(): Promise<CoinCategory[]> {
    interface RawCategory {
      id: string;
      name: string;
      market_cap: number | null;
      market_cap_change_24h: number | null;
      content: string | null;
      volume_24h: number | null;
      top_3_coins_id: string[];
      top_3_coins: string[];
    }

    const raw = await cachedFetch<RawCategory[]>('/coins/categories', CATEGORIES_TTL);

    return raw.map((cat) => ({
      id: cat.id,
      name: cat.name,
      market_cap: cat.market_cap,
      market_cap_change_24h: cat.market_cap_change_24h,
      content: cat.content,
      volume_24h: cat.volume_24h,
      top_3_coins: cat.top_3_coins_id.map((id, i) => ({
        id,
        image: cat.top_3_coins[i] ?? null,
      })),
    }));
  },

  async getPricesByIds(ids: string[], currency: string = 'usd'): Promise<CoinMarket[]> {
    const endpoint = `/coins/markets?vs_currency=${currency}&ids=${ids.join(',')}&order=market_cap_desc&per_page=${ids.length}&page=1&sparkline=false&price_change_percentage=7d`;
    return cachedFetch<CoinMarket[]>(endpoint, MARKETS_TTL);
  },

  async getChart(coinId: string, currency: string = 'usd', days: number = 7): Promise<CoinChartData> {
    const endpoint = `/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`;
    const raw = await cachedFetch<{ prices: [number, number][] }>(endpoint, CHART_TTL);

    const prices: ChartDataPoint[] = raw.prices.map(([timestamp, price]) => ({
      timestamp,
      price,
    }));

    return { coinId, currency, days, prices };
  },

  async getGlobal(): Promise<GlobalData> {
    const raw = await cachedFetch<{
      data: {
        total_market_cap: { usd: number };
        total_volume: { usd: number };
        market_cap_percentage: { btc: number };
        market_cap_change_percentage_24h_usd: number;
        active_cryptocurrencies: number;
      };
    }>('/global', GLOBAL_TTL);

    return {
      total_market_cap: raw.data.total_market_cap.usd,
      total_volume_24h: raw.data.total_volume.usd,
      btc_dominance: raw.data.market_cap_percentage.btc,
      market_cap_change_24h: raw.data.market_cap_change_percentage_24h_usd,
      active_cryptocurrencies: raw.data.active_cryptocurrencies,
    };
  },

  async getCoinDetail(id: string): Promise<CoinDetail> {
    const endpoint = `/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`;
    const raw = await cachedFetch<{
      id: string;
      symbol: string;
      name: string;
      image: { large: string };
      description: { en: string | null };
      links: { homepage: string[]; blockchain_site: string[] };
      market_data: {
        current_price: { usd: number | null };
        market_cap: { usd: number };
        market_cap_rank: number | null;
        price_change_percentage_24h: number | null;
        price_change_percentage_7d: number | null;
        total_volume: { usd: number };
        circulating_supply: number;
        total_supply: number | null;
        max_supply: number | null;
      };
    }>(endpoint, COIN_DETAIL_TTL);

    return {
      id: raw.id,
      symbol: raw.symbol,
      name: raw.name,
      image: raw.image.large,
      description: raw.description.en ?? null,
      homepage: raw.links.homepage[0] ?? null,
      explorer: raw.links.blockchain_site[0] ?? null,
      current_price: raw.market_data.current_price.usd,
      market_cap: raw.market_data.market_cap.usd,
      market_cap_rank: raw.market_data.market_cap_rank,
      price_change_percentage_24h: raw.market_data.price_change_percentage_24h,
      price_change_percentage_7d_in_currency: raw.market_data.price_change_percentage_7d,
      total_volume: raw.market_data.total_volume.usd,
      circulating_supply: raw.market_data.circulating_supply,
      total_supply: raw.market_data.total_supply,
      max_supply: raw.market_data.max_supply,
    };
  },
};
