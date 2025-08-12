export interface Crop {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  farmerId: string;
}

export interface CartItem extends Crop {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  role: 'farmer' | 'buyer';
}
