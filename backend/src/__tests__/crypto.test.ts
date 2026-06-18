import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';

vi.mock('../services/coingecko.js', () => ({
  coingeckoService: {
    getMarkets: vi.fn(),
    getCategories: vi.fn(),
    getPricesByIds: vi.fn(),
  },
}));

const { coingeckoService } = await import('../services/coingecko.js');

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
    top_3_coins: ['uniswap', 'aave', 'maker'],
  },
  {
    id: 'meme',
    name: 'Meme',
    market_cap: 10_000_000_000,
    market_cap_change_24h: -5.2,
    top_3_coins: ['dogecoin'],
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
    vi.mocked(coingeckoService.getMarkets).mockResolvedValue(mockMarkets);

    const res = await request(app).get('/api/crypto/markets');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].id).toBe('bitcoin');
    expect(res.body[0].current_price).toBe(50000);
    expect(coingeckoService.getMarkets).toHaveBeenCalledWith('usd', 50);
  });

  it('should respect currency and per_page params', async () => {
    vi.mocked(coingeckoService.getMarkets).mockResolvedValue([mockMarkets[0]]);

    const res = await request(app)
      .get('/api/crypto/markets')
      .query({ currency: 'eur', per_page: '1' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(coingeckoService.getMarkets).toHaveBeenCalledWith('eur', 1);
  });

  it('should return 502 on CoinGecko error', async () => {
    vi.mocked(coingeckoService.getMarkets).mockRejectedValue(new Error('API error'));

    const res = await request(app).get('/api/crypto/markets');

    expect(res.status).toBe(502);
    expect(res.body.error).toBe('API error');
  });
});

describe('GET /api/crypto/categories', () => {
  it('should return categories with enriched coin images', async () => {
    vi.mocked(coingeckoService.getCategories).mockResolvedValue(mockCategories);
    vi.mocked(coingeckoService.getPricesByIds).mockResolvedValue(
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

  it('should return categories with null images when enrichment fails', async () => {
    vi.mocked(coingeckoService.getCategories).mockResolvedValue(mockCategories);
    vi.mocked(coingeckoService.getPricesByIds).mockRejectedValue(
      new Error('Enrichment failed'),
    );

    const res = await request(app).get('/api/crypto/categories');

    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe('DeFi');
    expect(res.body[0].top_3_coins).toEqual([
      { id: 'uniswap', image: null },
      { id: 'aave', image: null },
      { id: 'maker', image: null },
    ]);
  });

  it('should return 502 on CoinGecko error', async () => {
    vi.mocked(coingeckoService.getCategories).mockRejectedValue(
      new Error('Categories API error'),
    );

    const res = await request(app).get('/api/crypto/categories');

    expect(res.status).toBe(502);
    expect(res.body.error).toBe('Categories API error');
  });

  it('should handle empty categories gracefully', async () => {
    vi.mocked(coingeckoService.getCategories).mockResolvedValue([]);

    const res = await request(app).get('/api/crypto/categories');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
