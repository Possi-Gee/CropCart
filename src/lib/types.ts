
import { FieldValue } from "firebase/firestore";

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
  location?: string;
  contact?: string;
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

// This is what's stored in Firestore
export interface Order {
    id: string;
    date: FieldValue | string; // serverTimestamp on write, string on read
    items: CartItem[];
    total: number;
    status: OrderStatus;
    buyer: Pick<User, 'id' | 'name' | 'role' | 'contact' | 'avatarUrl'>;
    farmerIds: string[]; // To easily query orders for farmers
}
