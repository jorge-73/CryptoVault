import { env } from '../config/env.js';
import { getCache, setCache } from './cache.js';

const BASE = env.COINGECKO_API_URL;

const MARKETS_TTL = 60_000;
const CATEGORIES_TTL = 300_000;

async function fetchFromCoinGecko<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE}${endpoint}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function cachedFetch<T>(endpoint: string, ttl: number): Promise<T> {
  const cached = getCache<T>(endpoint);
  if (cached) return Promise.resolve(cached);

  return fetchFromCoinGecko<T>(endpoint).then((data) => {
    setCache(endpoint, data, ttl);
    return data;
  });
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
  total_volume: number;
  circulating_supply: number;
}

export interface CoinCategory {
  id: string;
  name: string;
  market_cap: number | null;
  market_cap_change_24h: number | null;
  top_3_coins: string[];
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
  async getMarkets(currency: string = 'usd', perPage: number = 50): Promise<CoinMarket[]> {
    const endpoint = `/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false`;
    return cachedFetch<CoinMarket[]>(endpoint, MARKETS_TTL);
  },

  async getCategories(): Promise<CoinCategory[]> {
    return cachedFetch<CoinCategory[]>('/coins/categories', CATEGORIES_TTL);
  },

  async getPricesByIds(ids: string[], currency: string = 'usd'): Promise<CoinMarket[]> {
    const endpoint = `/coins/markets?vs_currency=${currency}&ids=${ids.join(',')}&order=market_cap_desc&per_page=${ids.length}&page=1&sparkline=false`;
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
