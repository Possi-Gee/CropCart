export interface Crop {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  farmerId: string;
  category: string;
}

export interface CartItem extends Crop {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  role: 'farmer' | 'buyer';
}

export interface Order {
    id: string;
    date: string;
    items: CartItem[];
    total: number;
    status: 'Pending' | 'Shipped' | 'Delivered';
}
