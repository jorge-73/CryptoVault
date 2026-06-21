import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';

const mockGetMarkets = vi.hoisted(() => vi.fn());
const mockGetCategories = vi.hoisted(() => vi.fn());
const mockGetPricesByIds = vi.hoisted(() => vi.fn());
const mockGetChart = vi.hoisted(() => vi.fn());
const mockGetGlobal = vi.hoisted(() => vi.fn());
const mockGetCoinDetail = vi.hoisted(() => vi.fn());

vi.mock('../services/coingecko.js', () => ({
  coingeckoService: {
    getMarkets: mockGetMarkets,
    getCategories: mockGetCategories,
    getPricesByIds: mockGetPricesByIds,
    getChart: mockGetChart,
    getGlobal: mockGetGlobal,
    getCoinDetail: mockGetCoinDetail,
  },
}));

const mockMarkets = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://example.com/btc.png',
    current_price: 50000,
    market_cap: 1_000_000_000_000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.5,
    total_volume: 50_000_000_000,
    circulating_supply: 19_000_000,
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://example.com/eth.png',
    current_price: 3000,
    market_cap: 360_000_000_000,
    market_cap_rank: 2,
    price_change_percentage_24h: -1.2,
    total_volume: 20_000_000_000,
    circulating_supply: 120_000_000,
  },
];

const mockCategories = [
  {
    id: 'defi',
    name: 'DeFi',
    market_cap: 50_000_000_000,
    market_cap_change_24h: 3.1,
    content: 'Decentralized finance sector',
    volume_24h: 2_000_000_000,
    top_3_coins: [
      { id: 'uniswap', image: 'https://example.com/uni.png' },
      { id: 'aave', image: 'https://example.com/aave.png' },
      { id: 'maker', image: 'https://example.com/mkr.png' },
    ],
  },
  {
    id: 'meme',
    name: 'Meme',
    market_cap: 10_000_000_000,
    market_cap_change_24h: -5.2,
    content: 'Meme coin sector',
    volume_24h: 500_000_000,
    top_3_coins: [
      { id: 'dogecoin', image: null },
    ],
  },
];

const mockPrices = [
  { id: 'uniswap', image: 'https://example.com/uni.png', symbol: 'uni', name: 'Uniswap' },
  { id: 'aave', image: 'https://example.com/aave.png', symbol: 'aave', name: 'Aave' },
  { id: 'maker', image: 'https://example.com/mkr.png', symbol: 'mkr', name: 'Maker' },
  { id: 'dogecoin', image: null, symbol: 'doge', name: 'Dogecoin' },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/crypto/markets', () => {
  it('should return market data', async () => {
    mockGetMarkets.mockResolvedValue(mockMarkets);

    const res = await request(app).get('/api/crypto/markets');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].id).toBe('bitcoin');
    expect(res.body[0].current_price).toBe(50000);
    expect(mockGetMarkets).toHaveBeenCalledWith('usd', 50);
  });

  it('should respect currency and per_page params', async () => {
    mockGetMarkets.mockResolvedValue([mockMarkets[0]]);

    const res = await request(app)
      .get('/api/crypto/markets')
      .query({ currency: 'eur', per_page: '1' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(mockGetMarkets).toHaveBeenCalledWith('eur', 1);
  });

  it('should return 503 on CoinGecko error', async () => {
    mockGetMarkets.mockRejectedValue(new Error('API error'));

    const res = await request(app).get('/api/crypto/markets');

    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Datos del mercado temporalmente no disponibles. Intente de nuevo más tarde.');
  });
});

describe('GET /api/crypto/categories', () => {
  it('should return categories with enriched coin images', async () => {
    mockGetCategories.mockResolvedValue(mockCategories);
    mockGetPricesByIds.mockResolvedValue(
      mockPrices as any,
    );

    const res = await request(app).get('/api/crypto/categories');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe('DeFi');
    expect(res.body[0].top_3_coins).toEqual([
      { id: 'uniswap', image: 'https://example.com/uni.png' },
      { id: 'aave', image: 'https://example.com/aave.png' },
      { id: 'maker', image: 'https://example.com/mkr.png' },
    ]);
    expect(res.body[1].top_3_coins).toEqual([
      { id: 'dogecoin', image: null },
    ]);
  });

  it('should return categories with description and volume', async () => {
    mockGetCategories.mockResolvedValue(mockCategories);

    const res = await request(app).get('/api/crypto/categories');

    expect(res.status).toBe(200);
    expect(res.body[0].content).toBe('Decentralized finance sector');
    expect(res.body[0].volume_24h).toBe(2_000_000_000);
  });

  it('should return 503 on CoinGecko error', async () => {
    mockGetCategories.mockRejectedValue(
      new Error('Categories API error'),
    );

    const res = await request(app).get('/api/crypto/categories');

    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Datos del mercado temporalmente no disponibles. Intente de nuevo más tarde.');
  });

  it('should handle empty categories gracefully', async () => {
    mockGetCategories.mockResolvedValue([]);

    const res = await request(app).get('/api/crypto/categories');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /api/crypto/global', () => {
  const mockGlobal = {
    total_market_cap: 2_400_000_000_000,
    total_volume_24h: 85_000_000_000,
    btc_dominance: 54.2,
    market_cap_change_24h: 2.3,
    active_cryptocurrencies: 12000,
  };

  it('should return global market data', async () => {
    mockGetGlobal.mockResolvedValue(mockGlobal);

    const res = await request(app).get('/api/crypto/global');

    expect(res.status).toBe(200);
    expect(res.body.total_market_cap).toBe(2_400_000_000_000);
    expect(res.body.total_volume_24h).toBe(85_000_000_000);
    expect(res.body.btc_dominance).toBe(54.2);
    expect(res.body.market_cap_change_24h).toBe(2.3);
    expect(res.body.active_cryptocurrencies).toBe(12000);
    expect(mockGetGlobal).toHaveBeenCalledOnce();
  });

  it('should return 503 on CoinGecko error', async () => {
    mockGetGlobal.mockRejectedValue(new Error('Global API error'));

    const res = await request(app).get('/api/crypto/global');

    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Datos del mercado temporalmente no disponibles. Intente de nuevo más tarde.');
  });
});

describe('GET /api/crypto/chart/:coinId', () => {
  const mockChartResponse = {
    prices: [
      [1700000000000, 42000],
      [1700086400000, 43000],
      [1700172800000, 41500],
    ],
  };

  it('should return chart data for a coin', async () => {
    mockGetChart.mockResolvedValue({
      coinId: 'bitcoin',
      currency: 'usd',
      days: 7,
      prices: mockChartResponse.prices.map(([ts, price]) => ({
        timestamp: ts,
        price,
      })),
    });

    const res = await request(app).get('/api/crypto/chart/bitcoin');

    expect(res.status).toBe(200);
    expect(res.body.coinId).toBe('bitcoin');
    expect(res.body.prices).toHaveLength(3);
    expect(res.body.prices[0]).toHaveProperty('timestamp');
    expect(res.body.prices[0]).toHaveProperty('price');
  });

  it('should respect currency and days params', async () => {
    mockGetChart.mockResolvedValue({
      coinId: 'ethereum',
      currency: 'eur',
      days: 30,
      prices: [],
    });

    const res = await request(app)
      .get('/api/crypto/chart/ethereum')
      .query({ currency: 'eur', days: '30' });

    expect(res.status).toBe(200);
    expect(res.body.currency).toBe('eur');
    expect(res.body.days).toBe(30);
  });

  it('should return 503 on CoinGecko error', async () => {
    mockGetChart.mockRejectedValue(
      new Error('Chart API error'),
    );

    const res = await request(app).get('/api/crypto/chart/unknown');

    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Datos del mercado temporalmente no disponibles. Intente de nuevo más tarde.');
  });
});

describe('GET /api/crypto/categories/:id/coins', () => {
  it('should return coins for a category', async () => {
    const mockCoins = [
      { id: 'uniswap', symbol: 'uni', name: 'Uniswap', current_price: 7.5, market_cap: 4_500_000_000, market_cap_rank: 30, price_change_percentage_24h: 3.1, total_volume: 500_000_000, circulating_supply: 600_000_000, image: 'https://example.com/uni.png' },
    ];
    mockGetMarkets.mockResolvedValue(mockCoins);

    const res = await request(app).get('/api/crypto/categories/defi/coins');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe('uniswap');
    expect(mockGetMarkets).toHaveBeenCalledWith('usd', 100, 'defi');
  });

  it('should return 503 on CoinGecko error', async () => {
    mockGetMarkets.mockRejectedValue(new Error('Coins API error'));

    const res = await request(app).get('/api/crypto/categories/defi/coins');

    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Datos del mercado temporalmente no disponibles. Intente de nuevo más tarde.');
  });
});

describe('GET /api/crypto/coin/:id', () => {
  const mockDetail = {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://example.com/btc.png',
    description: 'Bitcoin is a cryptocurrency.',
    homepage: 'https://bitcoin.org',
    explorer: 'https://blockchain.info',
    current_price: 50000,
    market_cap: 1_000_000_000_000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.5,
    price_change_percentage_7d_in_currency: 3.1,
    total_volume: 50_000_000_000,
    circulating_supply: 19_000_000,
    total_supply: 21_000_000,
    max_supply: 21_000_000,
  };

  it('should return coin detail', async () => {
    mockGetCoinDetail.mockResolvedValue(mockDetail);

    const res = await request(app).get('/api/crypto/coin/bitcoin');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe('bitcoin');
    expect(res.body.name).toBe('Bitcoin');
    expect(res.body.description).toBe('Bitcoin is a cryptocurrency.');
    expect(res.body.max_supply).toBe(21_000_000);
  });

  it('should return 503 on CoinGecko error', async () => {
    mockGetCoinDetail.mockRejectedValue(new Error('Coin detail API error'));

    const res = await request(app).get('/api/crypto/coin/unknown');

    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Datos del mercado temporalmente no disponibles. Intente de nuevo más tarde.');
  });
});
