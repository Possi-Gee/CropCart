
export interface Crop {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  farmerId: string;
  category: string;
  quantity: number;
  unit: string;
}

export interface CartItem extends Crop {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  role: 'farmer' | 'buyer';
  avatarUrl?: string;
  contact?: string;
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered';

export interface Order {
    id: string;
    date: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    buyer: User;
}
