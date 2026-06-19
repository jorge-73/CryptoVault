import { env } from '../config/env.js';
import { getCache, setCache, getPending, setPending } from './cache.js';

const BASE = env.COINGECKO_API_URL;

const MARKETS_TTL = 60_000;
const CATEGORIES_TTL = 300_000;

async function fetchFromCoinGecko<T>(endpoint: string, retried = false): Promise<T> {
  const response = await fetch(`${BASE}${endpoint}`, {
    headers: { Accept: 'application/json' },
  });

  if (response.status === 429 && !retried) {
    await new Promise((r) => setTimeout(r, 500));
    return fetchFromCoinGecko<T>(endpoint, true);
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
};
