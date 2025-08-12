
import type { Crop, User, Order } from '@/lib/types';

export const mockUsers: User[] = [
  { id: 'farmer-1', name: 'John Doe', role: 'farmer', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'buyer-1', name: 'Jane Smith', role: 'buyer', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'buyer-2', name: 'Michael Ofori', role: 'buyer', avatarUrl: 'https://placehold.co/100x100.png', contact: '0509349675' },
  { id: 'buyer-3', name: 'Micheal k', role: 'buyer', avatarUrl: 'https://placehold.co/100x100.png', contact: '0530066891' },
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
    quantity: 50,
    unit: 'kg',
    location: 'Accra',
    contact: '0241234567'
  },
  {
    id: 'crop-2',
    name: 'Crisp Lettuce',
    image: 'https://placehold.co/600x400.png',
    price: 1.49,
    description: 'Crisp and refreshing lettuce, perfect for salads and sandwiches.',
    farmerId: 'farmer-1',
    category: 'Vegetable',
    quantity: 100,
    unit: 'head',
    location: 'Accra',
    contact: '0241234567'
  },
  {
    id: 'crop-3',
    name: 'Sweet Corn',
    image: 'https://placehold.co/600x400.png',
    price: 0.75,
    description: 'Sweet and tender corn on the cob, harvested at peak freshness.',
    farmerId: 'farmer-1',
    category: 'Grain',
    quantity: 200,
    unit: 'ear',
    location: 'Accra',
    contact: '0241234567'
  },
   {
    id: 'crop-4',
    name: 'Red Bell Peppers',
    image: 'https://placehold.co/600x400.png',
    price: 1.20,
    description: 'Vibrant red bell peppers, great for stir-fries, salads, or roasting.',
    farmerId: 'farmer-1',
    category: 'Vegetable',
    quantity: 80,
    unit: 'kg',
    location: 'Accra',
    contact: '0241234567'
  },
   {
    id: 'crop-5',
    name: 'Carrots',
    image: 'https://placehold.co/600x400.png',
    price: 1.00,
    description: 'Sweet and crunchy carrots, packed with vitamins.',
    farmerId: 'farmer-1',
    category: 'Vegetable',
    quantity: 120,
    unit: 'kg',
    location: 'Accra',
    contact: '0241234567'
  },
   {
    id: 'crop-6',
    name: 'Cucumbers',
    image: 'https://placehold.co/600x400.png',
    price: 0.90,
    description: 'Cool and crisp cucumbers, ideal for salads or a healthy snack.',
    farmerId: 'farmer-1',
    category: 'Vegetable',
    quantity: 150,
    unit: 'piece',
    location: 'Accra',
    contact: '0241234567'
  },
  {
    id: 'crop-7',
    name: 'Apples',
    image: 'https://placehold.co/600x400.png',
    price: 1.99,
    description: 'Crisp and sweet apples, perfect for a healthy snack.',
    farmerId: 'farmer-1',
    category: 'Fruit',
    quantity: 100,
    unit: 'kg',
    location: 'Accra',
    contact: '0241234567'
  },
  {
    id: 'crop-8',
    name: 'Sweet Banana',
    image: 'https://placehold.co/600x400.png',
    price: 3.50,
    description: 'Juicy and sweet strawberries, fresh from the farm.',
    farmerId: 'farmer-1',
    category: 'Fruit',
    quantity: 70,
    unit: 'bunch',
    location: 'Accra',
    contact: '0241234567'
  },
  {
    id: 'crop-9',
    name: 'Blueberries',
    image: 'https://placehold.co/600x400.png',
    price: 4.50,
    description: 'Sweet and tangy blueberries, packed with antioxidants.',
    farmerId: 'farmer-1',
    category: 'Berries',
    quantity: 40,
    unit: 'pint',
    location: 'Accra',
    contact: '0241234567'
  },
  {
    id: 'crop-10',
    name: 'Basil',
    image: 'https://placehold.co/600x400.png',
    price: 2.00,
    description: 'Fresh basil, perfect for pesto or garnishing.',
    farmerId: 'farmer-1',
    category: 'Herbs',
    quantity: 30,
    unit: 'bunch',
    location: 'Accra',
    contact: '0241234567'
  },
  {
    id: 'crop-11',
    name: 'Mint',
    image: 'https://placehold.co/600x400.png',
    price: 1.75,
    description: 'Cool and refreshing mint, great for drinks and desserts.',
    farmerId: 'farmer-1',
    category: 'Herbs',
    quantity: 50,
    unit: 'bunch',
    location: 'Accra',
    contact: '0241234567'
  },
  {
    id: 'crop-12',
    name: 'Shiitake Mushrooms',
    image: 'https://placehold.co/600x400.png',
    price: 5.00,
    description: 'Earthy and flavorful shiitake mushrooms.',
    farmerId: 'farmer-1',
    category: 'Fungi',
    quantity: 25,
    unit: 'lb',
    location: 'Accra',
    contact: '0241234567'
  }
];

export const mockOrders: Order[] = [
    {
        id: 'order-1-Ykmlup',
        date: '2025-08-05',
        buyer: mockUsers[2],
        items: [
            { ...mockCropsData[0], quantity: 2 },
            { ...mockCropsData[2], quantity: 4 },
        ],
        total: (2.99 * 2) + (0.75 * 4),
        status: 'Shipped'
    },
    {
        id: 'order-2-bXp1kL',
        date: '2025-08-05',
        buyer: mockUsers[3],
        items: [
            { ...mockCropsData[7], quantity: 1 },
        ],
        total: 3.50,
        status: 'Pending'
    },
     {
        id: 'order-3-aahRYi',
        date: '2025-08-04',
        buyer: {id: 'buyer-4', name: 'JOSHUA Dankwa', role: 'buyer', contact: '0546476432'},
        items: [
            { ...mockCropsData[0], quantity: 1 },
        ],
        total: 2.99,
        status: 'Pending'
    },
      {
        id: 'order-4-T5PhbB',
        date: '2025-08-04',
        buyer: {id: 'buyer-5', name: 'Exceltrine Abena Ntewusu', role: 'buyer', contact: '0598500298'},
        items: [
            { ...mockCropsData[0], quantity: 1 },
        ],
        total: 2.99,
        status: 'Shipped'
    },
     {
        id: 'order-5-Ph6MVu',
        date: '2025-08-04',
        buyer: {id: 'buyer-6', name: 'Possi Gee', role: 'buyer', contact: '0509349675'},
        items: [
            { ...mockCropsData[0], quantity: 3 },
        ],
        total: 2.99 * 3,
        status: 'Delivered'
    }
]
