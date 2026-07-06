export type Package = {
  id: string;
  amount: number;
  price: number;
};

export type Game = {
  id: string;
  name: string;
  developer: string;
  currency: string;
  image: string;
  logo: string;
  requiresZoneId?: boolean;
  packages: Package[];
};

export type PaymentMethod = {
  id: string;
  name: string;
  type: 'ewallet' | 'bank' | 'qris';
  fee: number;
};

export const games: Game[] = [
  {
    id: 'mlbb',
    name: 'Mobile Legends',
    developer: 'Moonton',
    currency: 'Diamonds',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070',
    logo: '/logos/mlbb.png',
    requiresZoneId: true,
    packages: [
      { id: 'ml_1', amount: 5, price: 1500 },
      { id: 'ml_2', amount: 12, price: 3500 },
      { id: 'ml_3', amount: 28, price: 8000 },
      { id: 'ml_4', amount: 36, price: 10000 },
      { id: 'ml_5', amount: 50, price: 14000 },
      { id: 'ml_6', amount: 74, price: 21000 },
      { id: 'ml_7', amount: 86, price: 24000 },
      { id: 'ml_8', amount: 140, price: 40000 },
      { id: 'ml_9', amount: 284, price: 80000 },
      { id: 'ml_10', amount: 429, price: 120000 },
      { id: 'ml_11', amount: 716, price: 200000 },
      { id: 'ml_12', amount: 875, price: 240000 },
      { id: 'ml_13', amount: 1120, price: 300000 },
      { id: 'ml_14', amount: 1446, price: 400000 },
      { id: 'ml_15', amount: 2976, price: 800000 },
    ]
  },
  {
    id: 'roblox',
    name: 'Roblox',
    developer: 'Roblox Corporation',
    currency: 'Robux',
    image: 'https://images.unsplash.com/photo-1603190287605-e6ade3cb4a00?auto=format&fit=crop&q=80&w=2070',
    logo: '/logos/roblox.svg',
    requiresZoneId: false,
    packages: [
      { id: 'rbx_1', amount: 40, price: 9000 },
      { id: 'rbx_2', amount: 80, price: 18000 },
      { id: 'rbx_3', amount: 160, price: 36000 },
      { id: 'rbx_4', amount: 400, price: 90000 },
      { id: 'rbx_5', amount: 800, price: 180000 },
      { id: 'rbx_6', amount: 1200, price: 270000 },
      { id: 'rbx_7', amount: 1700, price: 360000 },
      { id: 'rbx_8', amount: 2000, price: 450000 },
      { id: 'rbx_9', amount: 4500, price: 900000 },
      { id: 'rbx_10', amount: 10000, price: 2000000 },
      { id: 'rbx_11', amount: 22500, price: 4500000 },
    ]
  },
  {
    id: 'ff',
    name: 'Free Fire',
    developer: 'Garena',
    currency: 'Diamonds',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=2070',
    logo: '/logos/ff.png',
    requiresZoneId: false,
    packages: [
      { id: 'ff_1', amount: 5, price: 1000 },
      { id: 'ff_2', amount: 12, price: 2000 },
      { id: 'ff_3', amount: 50, price: 8000 },
      { id: 'ff_4', amount: 70, price: 10000 },
      { id: 'ff_5', amount: 140, price: 20000 },
      { id: 'ff_6', amount: 355, price: 50000 },
      { id: 'ff_7', amount: 720, price: 100000 },
      { id: 'ff_8', amount: 1450, price: 200000 },
      { id: 'ff_9', amount: 2180, price: 300000 },
      { id: 'ff_10', amount: 3640, price: 500000 },
      { id: 'ff_11', amount: 7290, price: 1000000 },
      { id: 'ff_12', amount: 36500, price: 5000000 },
    ]
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    developer: 'Tencent Games',
    currency: 'UC',
    image: 'https://images.unsplash.com/photo-1593305841991-0537e691678b?auto=format&fit=crop&q=80&w=2070',
    logo: '/logos/pubg.png',
    requiresZoneId: false,
    packages: [
      { id: 'pubg_1', amount: 30, price: 7500 },
      { id: 'pubg_2', amount: 60, price: 15000 },
      { id: 'pubg_3', amount: 150, price: 37500 },
      { id: 'pubg_4', amount: 325, price: 75000 },
      { id: 'pubg_5', amount: 660, price: 150000 },
      { id: 'pubg_6', amount: 1800, price: 400000 },
      { id: 'pubg_7', amount: 3850, price: 800000 },
      { id: 'pubg_8', amount: 8100, price: 1600000 },
      { id: 'pubg_9', amount: 16200, price: 3200000 },
    ]
  },
];

export const paymentMethods: PaymentMethod[] = [
  { id: 'qris', name: 'QRIS', type: 'qris', fee: 0 },
  { id: 'gopay', name: 'GoPay', type: 'ewallet', fee: 1000 },
  { id: 'dana', name: 'DANA', type: 'ewallet', fee: 1000 },
  { id: 'ovo', name: 'OVO', type: 'ewallet', fee: 1000 },
  { id: 'bca', name: 'BCA Virtual Account', type: 'bank', fee: 2500 },
  { id: 'mandiri', name: 'Mandiri Virtual Account', type: 'bank', fee: 2500 },
];
