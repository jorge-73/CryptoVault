export const MOCK_GLOBAL = {
  total_market_cap: 3_520_000_000_000,
  total_volume_24h: 125_000_000_000,
  btc_dominance: 52.3,
  market_cap_change_24h: 2.4,
  active_cryptocurrencies: 10_500,
};

export const MOCK_BTC_SPARKLINE = [65200, 64800, 66100, 65800, 67000, 66500, 67200, 66900, 67450];

export const MOCK_ALERT = {
  message: "Bitcoin supera los USD 67.000",
  subtitle: "Nueva marca del año — volumen récord en las últimas 24h",
};

export const MOCK_TICKER = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", image: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png", price: 67450, change24h: 2.34 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", image: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png", price: 3450, change24h: 1.56 },
  { id: "solana", name: "Solana", symbol: "SOL", image: "https://coin-images.coingecko.com/coins/images/4128/large/solana.png", price: 172, change24h: -0.82 },
  { id: "ripple", name: "XRP", symbol: "XRP", image: "https://coin-images.coingecko.com/coins/images/44/large/xrp.png", price: 0.62, change24h: 0.15 },
  { id: "cardano", name: "Cardano", symbol: "ADA", image: "https://coin-images.coingecko.com/coins/images/975/large/cardano.png", price: 0.45, change24h: 3.21 },
];

export const MOCK_CATEGORIES = [
  {
    id: "defi",
    name: "DeFi",
    market_cap: 85_000_000_000,
    market_cap_change_24h: 3.2,
    volume_24h: 12_000_000_000,
    top_3_coins: [
      { id: "uniswap", name: "Uniswap", symbol: "UNI", image: "https://coin-images.coingecko.com/coins/images/12504/large/uniswap.png" },
      { id: "aave", name: "Aave", symbol: "AAVE", image: "https://coin-images.coingecko.com/coins/images/12645/large/aave.png" },
      { id: "maker", name: "Maker", symbol: "MKR", image: "https://coin-images.coingecko.com/coins/images/1364/large/maker.png" },
    ],
  },
  {
    id: "artificial-intelligence",
    name: "AI",
    market_cap: 42_000_000_000,
    market_cap_change_24h: 5.1,
    volume_24h: 6_500_000_000,
    top_3_coins: [
      { id: "near", name: "NEAR Protocol", symbol: "NEAR", image: "https://coin-images.coingecko.com/coins/images/10365/large/near.png" },
      { id: "fetch", name: "Fetch.ai", symbol: "FET", image: "https://coin-images.coingecko.com/coins/images/13076/large/fetch.png" },
      { id: "injective", name: "Injective", symbol: "INJ", image: "https://coin-images.coingecko.com/coins/images/19554/large/injective.png" },
    ],
  },
  {
    id: "gaming",
    name: "Gaming",
    market_cap: 28_000_000_000,
    market_cap_change_24h: -1.2,
    volume_24h: 4_200_000_000,
    top_3_coins: [
      { id: "immutable", name: "Immutable", symbol: "IMX", image: "https://coin-images.coingecko.com/coins/images/17233/large/immutable.png" },
      { id: "gala", name: "Gala", symbol: "GALA", image: "https://coin-images.coingecko.com/coins/images/12493/large/gala.png" },
      { id: "sandbox", name: "The Sandbox", symbol: "SAND", image: "https://coin-images.coingecko.com/coins/images/12129/large/sandbox.png" },
    ],
  },
  {
    id: "layer-2",
    name: "Layer 2",
    market_cap: 35_000_000_000,
    market_cap_change_24h: 4.0,
    volume_24h: 5_800_000_000,
    top_3_coins: [
      { id: "arbitrum", name: "Arbitrum", symbol: "ARB", image: "https://coin-images.coingecko.com/coins/images/16547/large/arbitrum.png" },
      { id: "optimism", name: "Optimism", symbol: "OP", image: "https://coin-images.coingecko.com/coins/images/25244/large/optimism.png" },
      { id: "polygon", name: "Polygon", symbol: "MATIC", image: "https://coin-images.coingecko.com/coins/images/4713/large/polygon.png" },
    ],
  },
];

export const MOCK_COINS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", image: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png", current_price: 67450, market_cap: 1320000000000, market_cap_rank: 1, price_change_percentage_24h: 2.34, total_volume: 45000000000 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", image: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png", current_price: 3450, market_cap: 415000000000, market_cap_rank: 2, price_change_percentage_24h: 1.56, total_volume: 22000000000 },
  { id: "solana", name: "Solana", symbol: "SOL", image: "https://coin-images.coingecko.com/coins/images/4128/large/solana.png", current_price: 172, market_cap: 78000000000, market_cap_rank: 5, price_change_percentage_24h: -0.82, total_volume: 5800000000 },
  { id: "ripple", name: "XRP", symbol: "XRP", image: "https://coin-images.coingecko.com/coins/images/44/large/xrp.png", current_price: 0.62, market_cap: 34000000000, market_cap_rank: 7, price_change_percentage_24h: 0.15, total_volume: 2100000000 },
  { id: "cardano", name: "Cardano", symbol: "ADA", image: "https://coin-images.coingecko.com/coins/images/975/large/cardano.png", current_price: 0.45, market_cap: 16000000000, market_cap_rank: 9, price_change_percentage_24h: 3.21, total_volume: 1200000000 },
];
