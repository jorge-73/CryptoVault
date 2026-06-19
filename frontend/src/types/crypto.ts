export interface TopCoin {
  id: string;
  image: string | null;
}

export interface CoinCategory {
  id: string;
  name: string;
  market_cap: number | null;
  market_cap_change_24h: number | null;
  content: string | null;
  volume_24h: number | null;
  top_3_coins: TopCoin[];
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
