import { env } from '../config/env.js';

const BASE = env.COINGECKO_API_URL;

async function fetchFromCoinGecko<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE}${endpoint}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number | null;
  price_change_percentage_24h: number;
  total_volume: number;
  circulating_supply: number;
}

export interface CoinCategory {
  id: string;
  name: string;
  market_cap: number;
  market_cap_change_24h: number;
  top_3_coins: string[];
}

export const coingeckoService = {
  async getMarkets(currency: string = 'usd', perPage: number = 50): Promise<CoinMarket[]> {
    return fetchFromCoinGecko<CoinMarket[]>(
      `/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false`
    );
  },

  async getCategories(): Promise<CoinCategory[]> {
    return fetchFromCoinGecko<CoinCategory[]>('/coins/categories');
  },

  async getPricesByIds(ids: string[], currency: string = 'usd'): Promise<CoinMarket[]> {
    return fetchFromCoinGecko<CoinMarket[]>(
      `/coins/markets?vs_currency=${currency}&ids=${ids.join(',')}&order=market_cap_desc&per_page=${ids.length}&page=1&sparkline=false`
    );
  },
};
