export const MOCK_USER_ID = 'e2e-mock-user-id';
export const MOCK_USER_EMAIL = 'e2e@test.com';
export const MOCK_USER_NAME = 'Test User';

const FAKE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMmUtbW9jay11c2VyLWlkIiwiZW1haWwiOiJlMmVAdGVzdC5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.test';
const AUTH_COOKIES = [
  `access_token=${FAKE_TOKEN}; HttpOnly; Path=/; Max-Age=900`,
  `refresh_token=${FAKE_TOKEN}; HttpOnly; Path=/; Max-Age=604800`,
];
const CLEAR_COOKIES = [
  'access_token=; HttpOnly; Path=/; Max-Age=0',
  'refresh_token=; HttpOnly; Path=/; Max-Age=0',
];

export const authConfig = { authenticated: true };
export const mockFavorites: string[] = [];

export const mockMarkets = [
  {
    id: 'bitcoin', symbol: 'btc', name: 'Bitcoin',
    image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 67500, market_cap: 1_330_000_000_000, market_cap_rank: 1,
    price_change_percentage_24h: 2.45, total_volume: 45_000_000_000, circulating_supply: 19_700_000,
  },
  {
    id: 'ethereum', symbol: 'eth', name: 'Ethereum',
    image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 3450, market_cap: 415_000_000_000, market_cap_rank: 2,
    price_change_percentage_24h: -1.23, total_volume: 22_000_000_000, circulating_supply: 120_200_000,
  },
  {
    id: 'solana', symbol: 'sol', name: 'Solana',
    image: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 148, market_cap: 68_000_000_000, market_cap_rank: 5,
    price_change_percentage_24h: 5.67, total_volume: 4_500_000_000, circulating_supply: 460_000_000,
  },
  {
    id: 'cardano', symbol: 'ada', name: 'Cardano',
    image: 'https://coin-images.coingecko.com/coins/images/975/large/cardano.png',
    current_price: 0.45, market_cap: 16_000_000_000, market_cap_rank: 9,
    price_change_percentage_24h: -0.89, total_volume: 800_000_000, circulating_supply: 35_000_000_000,
  },
  {
    id: 'ripple', symbol: 'xrp', name: 'XRP',
    image: 'https://coin-images.coingecko.com/coins/images/44/large/xrp.png',
    current_price: 0.62, market_cap: 34_000_000_000, market_cap_rank: 7,
    price_change_percentage_24h: 1.12, total_volume: 2_100_000_000, circulating_supply: 54_000_000_000,
  },
  {
    id: 'polkadot', symbol: 'dot', name: 'Polkadot',
    image: 'https://coin-images.coingecko.com/coins/images/12171/large/polkadot.png',
    current_price: 7.25, market_cap: 10_500_000_000, market_cap_rank: 13,
    price_change_percentage_24h: 3.4, total_volume: 650_000_000, circulating_supply: 1_450_000_000,
  },
  {
    id: 'avalanche', symbol: 'avax', name: 'Avalanche',
    image: 'https://coin-images.coingecko.com/coins/images/12559/large/avalanche.png',
    current_price: 35.80, market_cap: 14_000_000_000, market_cap_rank: 11,
    price_change_percentage_24h: -2.1, total_volume: 900_000_000, circulating_supply: 392_000_000,
  },
  {
    id: 'chainlink', symbol: 'link', name: 'Chainlink',
    image: null,
    current_price: 14.50, market_cap: 8_500_000_000, market_cap_rank: 15,
    price_change_percentage_24h: 0.75, total_volume: 520_000_000, circulating_supply: 587_000_000,
  },
  {
    id: 'polygon', symbol: 'matic', name: 'Polygon',
    image: null,
    current_price: 0.72, market_cap: 6_700_000_000, market_cap_rank: 18,
    price_change_percentage_24h: -3.5, total_volume: 410_000_000, circulating_supply: 9_300_000_000,
  },
  {
    id: 'dogecoin', symbol: 'doge', name: 'Dogecoin',
    image: 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png',
    current_price: 0.12, market_cap: 17_200_000_000, market_cap_rank: 8,
    price_change_percentage_24h: 8.2, total_volume: 3_100_000_000, circulating_supply: 143_000_000_000,
  },
];

export const mockCategories = [
  {
    id: 'defi', name: 'DeFi',
    market_cap: 45_000_000_000, market_cap_change_24h: 2.3,
    content: 'Decentralized finance protocols enabling lending, borrowing, and trading without intermediaries.',
    volume_24h: 2_100_000_000,
    top_3_coins: [
      { id: 'uniswap', image: 'https://coin-images.coingecko.com/coins/images/12504/large/uniswap.png' },
      { id: 'aave', image: 'https://coin-images.coingecko.com/coins/images/12645/large/aave.png' },
      { id: 'maker', image: 'https://coin-images.coingecko.com/coins/images/1364/large/maker.png' },
    ],
  },
  {
    id: 'meme', name: 'Meme',
    market_cap: 25_000_000_000, market_cap_change_24h: 5.1,
    content: 'Community-driven cryptocurrencies inspired by internet memes and viral culture.',
    volume_24h: 3_500_000_000,
    top_3_coins: [
      { id: 'dogecoin', image: 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png' },
      { id: 'shiba-inu', image: null },
      { id: 'pepe', image: null },
    ],
  },
  {
    id: 'layer-1', name: 'Layer 1',
    market_cap: 800_000_000_000, market_cap_change_24h: 1.2,
    content: 'Base blockchain networks that serve as the foundation for decentralized applications and smart contracts.',
    volume_24h: 55_000_000_000,
    top_3_coins: [
      { id: 'bitcoin', image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png' },
      { id: 'ethereum', image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png' },
      { id: 'solana', image: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png' },
    ],
  },
  {
    id: 'layer-2', name: 'Layer 2',
    market_cap: 30_000_000_000, market_cap_change_24h: -0.8,
    content: 'Scaling solutions built on top of Layer 1 blockchains to improve transaction speed and reduce costs.',
    volume_24h: 2_000_000_000,
    top_3_coins: [
      { id: 'polygon', image: null },
      { id: 'optimism', image: null },
      { id: 'arbitrum', image: null },
    ],
  },
  {
    id: 'gaming', name: 'Gaming',
    market_cap: 12_000_000_000, market_cap_change_24h: -3.2,
    content: 'Blockchain-based gaming projects and virtual worlds with play-to-earn mechanics.',
    volume_24h: 800_000_000,
    top_3_coins: [
      { id: 'axie-infinity', image: null },
      { id: 'sandbox', image: null },
      { id: 'decentraland', image: null },
    ],
  },
  {
    id: 'ai', name: 'AI',
    market_cap: 8_000_000_000, market_cap_change_24h: 10.5,
    content: 'Artificial intelligence projects leveraging blockchain for decentralized compute and data markets.',
    volume_24h: 1_200_000_000,
    top_3_coins: [
      { id: 'fetch-ai', image: null },
      { id: 'render-token', image: null },
      { id: 'bittensor', image: null },
    ],
  },
];

export function generateChartPrices(count = 100, basePrice = 67000) {
  const now = Date.now();
  const interval = (7 * 24 * 60 * 60 * 1000) / count;
  const prices: { timestamp: number; price: number }[] = [];
  let price = basePrice;
  for (let i = 0; i < count; i++) {
    price += (Math.random() - 0.48) * price * 0.02;
    prices.push({ timestamp: now - (count - i) * interval, price: Math.round(price * 100) / 100 });
  }
  return prices;
}

export const mockPricesByIds = [
  { id: 'uniswap', image: 'https://coin-images.coingecko.com/coins/images/12504/large/uniswap.png', symbol: 'uni', name: 'Uniswap' },
  { id: 'aave', image: 'https://coin-images.coingecko.com/coins/images/12645/large/aave.png', symbol: 'aave', name: 'Aave' },
  { id: 'maker', image: 'https://coin-images.coingecko.com/coins/images/1364/large/maker.png', symbol: 'mkr', name: 'Maker' },
  { id: 'dogecoin', image: 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png', symbol: 'doge', name: 'Dogecoin' },
  { id: 'shiba-inu', image: null, symbol: 'shib', name: 'Shiba Inu' },
  { id: 'pepe', image: null, symbol: 'pepe', name: 'Pepe' },
  { id: 'bitcoin', image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png', symbol: 'btc', name: 'Bitcoin' },
  { id: 'ethereum', image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png', symbol: 'eth', name: 'Ethereum' },
  { id: 'solana', image: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png', symbol: 'sol', name: 'Solana' },
  { id: 'polygon', image: null, symbol: 'matic', name: 'Polygon' },
  { id: 'optimism', image: null, symbol: 'op', name: 'Optimism' },
  { id: 'arbitrum', image: null, symbol: 'arb', name: 'Arbitrum' },
  { id: 'axie-infinity', image: null, symbol: 'axs', name: 'Axie Infinity' },
  { id: 'sandbox', image: null, symbol: 'sand', name: 'The Sandbox' },
  { id: 'decentraland', image: null, symbol: 'mana', name: 'Decentraland' },
  { id: 'fetch-ai', image: null, symbol: 'fet', name: 'Fetch.ai' },
  { id: 'render-token', image: null, symbol: 'render', name: 'Render Token' },
  { id: 'bittensor', image: null, symbol: 'tao', name: 'Bittensor' },
];

function userResponse() {
  return { user: { id: MOCK_USER_ID, email: MOCK_USER_EMAIL, name: MOCK_USER_NAME } };
}

export const mockGlobalData = {
  total_market_cap: 2_400_000_000_000,
  total_volume_24h: 85_000_000_000,
  btc_dominance: 54.2,
  market_cap_change_24h: 2.35,
  active_cryptocurrencies: 12345,
};

export function setupCryptoMocks(page: any) {
  const mockChart = generateChartPrices(100, 67500);

  page.route('**/api/crypto/global', async (route: any) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockGlobalData) });
  });

  page.route('**/api/crypto/markets**', async (route: any) => {
    const url = new URL(route.request().url());
    const ids = url.searchParams.get('ids');
    if (ids) {
      const coinIds = ids.split(',');
      const filtered = mockPricesByIds.filter((c) => coinIds.includes(c.id));
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(filtered) });
      return;
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockMarkets) });
  });

  page.route('**/api/crypto/categories/*/coins**', async (route: any) => {
    const url = new URL(route.request().url());
    const categoryId = url.pathname.split('/').filter(Boolean).slice(-2)[0];
    const categoryMap: Record<string, number[]> = {
      defi: [0, 1, 2, 6, 7],
      meme: [8, 9, 10],
      'layer-1': [3, 4, 5, 11],
      'layer-2': [6, 7, 12],
      gaming: [13, 14, 15],
      ai: [16, 17, 18],
    };
    const indices = categoryMap[categoryId] ?? [0, 1, 2];
    const coins = indices.map((i) => mockMarkets[i]).filter(Boolean);
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(coins) });
  });

  page.route('**/api/crypto/categories', async (route: any) => {
    const enriched = mockCategories.map((cat) => ({
      ...cat,
      top_3_coins: cat.top_3_coins.map((coin: { id: string; image: string | null }) => {
        const pricesCoin = mockPricesByIds.find((c) => c.id === coin.id);
        const marketCoin = mockMarkets.find((m) => m.id === coin.id);
        return { id: coin.id, image: coin.image ?? pricesCoin?.image ?? marketCoin?.image ?? null };
      }),
    }));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(enriched) });
  });

  page.route('**/api/crypto/chart/**', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ coinId: 'bitcoin', currency: 'usd', days: 7, prices: mockChart }),
    });
  });
}

export function setupAuthMocks(page: any) {
  page.route('**/api/auth/register', async (route: any) => {
    const body = JSON.parse(route.request().postData() || '{}');
    if (body.email && !body.email.includes('@')) {
      return route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ error: 'Invalid email format' }) });
    }
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      headers: { 'set-cookie': AUTH_COOKIES as any },
      body: JSON.stringify(userResponse()),
    });
  });

  page.route('**/api/auth/login', async (route: any) => {
    const body = JSON.parse(route.request().postData() || '{}');
    if (body.password === 'wrongpassword') {
      return route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: 'Invalid credentials' }) });
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'set-cookie': AUTH_COOKIES as any },
      body: JSON.stringify(userResponse()),
    });
  });

  page.route('**/api/auth/logout', async (route: any) => {
    authConfig.authenticated = false;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'set-cookie': CLEAR_COOKIES as any },
      body: JSON.stringify({ message: 'Logged out successfully' }),
    });
  });

  page.route('**/api/auth/me', async (route: any) => {
    if (authConfig.authenticated) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(userResponse()) });
    } else {
      await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: 'Unauthorized' }) });
    }
  });

  page.route('**/api/auth/refresh', async (route: any) => {
    if (authConfig.authenticated) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'set-cookie': AUTH_COOKIES as any },
        body: JSON.stringify(userResponse()),
      });
    } else {
      await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: 'Unauthorized' }) });
    }
  });
}

export function setupFavoritesMocks(page: any) {
  page.route('**/api/favorites', async (route: any) => {
    if (route.request().method() === 'GET') {
      const favData = mockFavorites.map((id) => {
        const coin = mockMarkets.find((m) => m.id === id);
        return coin ? { id: coin.id, name: coin.name, symbol: coin.symbol, image: coin.image, current_price: coin.current_price, price_change_percentage_24h: coin.price_change_percentage_24h } : null;
      }).filter(Boolean);
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(favData) });
    } else if (route.request().method() === 'POST') {
      const body = JSON.parse(route.request().postData() || '{}');
      if (body.coinId && !mockFavorites.includes(body.coinId)) {
        mockFavorites.push(body.coinId);
      }
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ message: 'Añadido a favoritos' }) });
    }
  });

  page.route('**/api/favorites/*', async (route: any) => {
    const urlParts = route.request().url().split('/');
    const coinId = urlParts[urlParts.length - 1];
    const idx = mockFavorites.indexOf(coinId);
    if (idx > -1) mockFavorites.splice(idx, 1);
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'Eliminado de favoritos' }) });
  });
}

export function setupAllMocks(page: any) {
  setupCryptoMocks(page);
  setupAuthMocks(page);
  setupFavoritesMocks(page);
}
