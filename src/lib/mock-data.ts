import type { Crop, User, Order } from '@/lib/types';

export const mockUsers: User[] = [
  { id: 'farmer-1', name: 'John Doe', role: 'farmer', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'buyer-1', name: 'Jane Smith', role: 'buyer', avatarUrl: 'https://placehold.co/100x100.png' },
];

export const mockCropsData: Crop[] = [
  {
    id: 'crop-1',
    name: 'Organic Tomatoes',
    image: 'https://placehold.co/600x400.png',
    price: 2.99,
    description: 'Fresh, juicy organic tomatoes, grown locally without pesticides.',
    farmerId: 'farmer-1',
    category: 'Vegetable',
  },
  {
    id: 'crop-2',
    name: 'Crisp Lettuce',
    image: 'https://placehold.co/600x400.png',
    price: 1.49,
    description: 'Crisp and refreshing lettuce, perfect for salads and sandwiches.',
    farmerId: 'farmer-1',
    category: 'Vegetable',
  },
  {
    id: 'crop-3',
    name: 'Sweet Corn',
    image: 'https://placehold.co/600x400.png',
    price: 0.75,
    description: 'Sweet and tender corn on the cob, harvested at peak freshness.',
    farmerId: 'farmer-1',
    category: 'Grain',
  },
   {
    id: 'crop-4',
    name: 'Red Bell Peppers',
    image: 'https://placehold.co/600x400.png',
    price: 1.20,
    description: 'Vibrant red bell peppers, great for stir-fries, salads, or roasting.',
    farmerId: 'farmer-1',
    category: 'Vegetable',
  },
   {
    id: 'crop-5',
    name: 'Carrots',
    image: 'https://placehold.co/600x400.png',
    price: 1.00,
    description: 'Sweet and crunchy carrots, packed with vitamins.',
    farmerId: 'farmer-1',
    category: 'Vegetable',
  },
   {
    id: 'crop-6',
    name: 'Cucumbers',
    image: 'https://placehold.co/600x400.png',
    price: 0.90,
    description: 'Cool and crisp cucumbers, ideal for salads or a healthy snack.',
    farmerId: 'farmer-1',
    category: 'Vegetable',
  },
  {
    id: 'crop-7',
    name: 'Apples',
    image: 'https://placehold.co/600x400.png',
    price: 1.99,
    description: 'Crisp and sweet apples, perfect for a healthy snack.',
    farmerId: 'farmer-1',
    category: 'Fruit',
  },
  {
    id: 'crop-8',
    name: 'Strawberries',
    image: 'https://placehold.co/600x400.png',
    price: 3.50,
    description: 'Juicy and sweet strawberries, fresh from the farm.',
    farmerId: 'farmer-1',
    category: 'Berries',
  },
  {
    id: 'crop-9',
    name: 'Blueberries',
    image: 'https://placehold.co/600x400.png',
    price: 4.50,
    description: 'Sweet and tangy blueberries, packed with antioxidants.',
    farmerId: 'farmer-1',
    category: 'Berries',
  },
  {
    id: 'crop-10',
    name: 'Basil',
    image: 'https://placehold.co/600x400.png',
    price: 2.00,
    description: 'Fresh basil, perfect for pesto or garnishing.',
    farmerId: 'farmer-1',
    category: 'Herbs',
  },
  {
    id: 'crop-11',
    name: 'Mint',
    image: 'https://placehold.co/600x400.png',
    price: 1.75,
    description: 'Cool and refreshing mint, great for drinks and desserts.',
    farmerId: 'farmer-1',
    category: 'Herbs',
  },
  {
    id: 'crop-12',
    name: 'Shiitake Mushrooms',
    image: 'https://placehold.co/600x400.png',
    price: 5.00,
    description: 'Earthy and flavorful shiitake mushrooms.',
    farmerId: 'farmer-1',
    category: 'Fungi',
  }
];

export const mockOrders: Order[] = [
    {
        id: 'order-1',
        date: '2024-07-20',
        items: [
            { ...mockCropsData[0], quantity: 2 },
            { ...mockCropsData[2], quantity: 4 },
        ],
        total: (2.99 * 2) + (0.75 * 4),
        status: 'Delivered'
    },
    {
        id: 'order-2',
        date: '2024-07-22',
        items: [
            { ...mockCropsData[7], quantity: 1 },
        ],
        total: 3.50,
        status: 'Shipped'
    }
]
