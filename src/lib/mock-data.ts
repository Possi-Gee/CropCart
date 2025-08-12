import type { Crop, User } from '@/lib/types';

export const mockUsers: User[] = [
  { id: 'farmer-1', name: 'John Doe', role: 'farmer' },
  { id: 'buyer-1', name: 'Jane Smith', role: 'buyer' },
];

export const mockCropsData: Crop[] = [
  {
    id: 'crop-1',
    name: 'Organic Tomatoes',
    image: 'https://placehold.co/600x400.png',
    price: 2.99,
    description: 'Fresh, juicy organic tomatoes, grown locally without pesticides.',
    farmerId: 'farmer-1',
  },
  {
    id: 'crop-2',
    name: 'Crisp Lettuce',
    image: 'https://placehold.co/600x400.png',
    price: 1.49,
    description: 'Crisp and refreshing lettuce, perfect for salads and sandwiches.',
    farmerId: 'farmer-1',
  },
  {
    id: 'crop-3',
    name: 'Sweet Corn',
    image: 'https://placehold.co/600x400.png',
    price: 0.75,
    description: 'Sweet and tender corn on the cob, harvested at peak freshness.',
    farmerId: 'farmer-1',
  },
   {
    id: 'crop-4',
    name: 'Red Bell Peppers',
    image: 'https://placehold.co/600x400.png',
    price: 1.20,
    description: 'Vibrant red bell peppers, great for stir-fries, salads, or roasting.',
    farmerId: 'farmer-1',
  },
   {
    id: 'crop-5',
    name: 'Carrots',
    image: 'https://placehold.co/600x400.png',
    price: 1.00,
    description: 'Sweet and crunchy carrots, packed with vitamins.',
    farmerId: 'farmer-1',
  },
   {
    id: 'crop-6',
    name: 'Cucumbers',
    image: 'https://placehold.co/600x400.png',
    price: 0.90,
    description: 'Cool and crisp cucumbers, ideal for salads or a healthy snack.',
    farmerId: 'farmer-1',
  }
];
