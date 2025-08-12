
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Crop, CartItem, User } from '@/lib/types';
import { mockUsers, mockCropsData } from '@/lib/mock-data';
import { useRouter, usePathname } from 'next/navigation';

interface AppContextType {
  user: User | null;
  login: (role: 'farmer' | 'buyer') => void;
  logout: () => void;
  crops: Crop[];
  addCrop: (crop: Omit<Crop, 'id' | 'farmerId'>) => void;
  updateCrop: (crop: Crop) => void;
  deleteCrop: (cropId: string) => void;
  cart: CartItem[];
  addToCart: (crop: Crop, quantity?: number) => void;
  removeFromCart: (cropId: string) => void;
  updateCartQuantity: (cropId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  wishlist: Crop[];
  addToWishlist: (crop: Crop) => void;
  removeFromWishlist: (cropId: string) => void;
  isItemInWishlist: (cropId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Crop[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate loading from localStorage to persist state
    const storedUser = localStorage.getItem('cropcart-user');
    const storedCrops = localStorage.getItem('cropcart-crops');
    const storedCart = localStorage.getItem('cropcart-cart');
    const storedWishlist = localStorage.getItem('cropcart-wishlist');
    
    if (storedUser) setUser(JSON.parse(storedUser));
    setCrops(storedCrops ? JSON.parse(storedCrops) : mockCropsData);
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('cropcart-user', JSON.stringify(user));
    localStorage.setItem('cropcart-crops', JSON.stringify(crops));
    localStorage.setItem('cropcart-cart', JSON.stringify(cart));
    localStorage.setItem('cropcart-wishlist', JSON.stringify(wishlist));
  }, [user, crops, cart, wishlist, isLoaded]);

  useEffect(() => {
    if (isLoaded && !user && !pathname.startsWith('/login') && !pathname.startsWith('/register') && pathname !== '/') {
      router.push('/');
    }
  }, [user, pathname, router, isLoaded]);

  const login = (role: 'farmer' | 'buyer') => {
    const mockUser = role === 'farmer' ? mockUsers[0] : mockUsers[1];
    setUser(mockUser);
    router.push(`/${role}/dashboard`);
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('cropcart-user');
    localStorage.removeItem('cropcart-cart');
    localStorage.removeItem('cropcart-wishlist');
    router.push('/');
  };

  const addCrop = (crop: Omit<Crop, 'id' | 'farmerId'>) => {
    if (user?.role !== 'farmer') return;
    const newCrop: Crop = {
      ...crop,
      id: `crop-${Date.now()}`,
      farmerId: user.id,
    };
    setCrops(prev => [...prev, newCrop]);
  };

  const updateCrop = (updatedCrop: Crop) => {
    setCrops(prev => prev.map(c => c.id === updatedCrop.id ? updatedCrop : c));
  };

  const deleteCrop = (cropId: string) => {
    setCrops(prev => prev.filter(c => c.id !== cropId));
  };

  const addToCart = (crop: Crop, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === crop.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === crop.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...crop, quantity }];
    });
  };

  const removeFromCart = (cropId: string) => {
    setCart(prev => prev.filter(item => item.id !== cropId));
  };
  
  const updateCartQuantity = (cropId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cropId);
      return;
    }
    setCart(prev => prev.map(item => item.id === cropId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  }

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const addToWishlist = (crop: Crop) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === crop.id)) {
        return prev;
      }
      return [...prev, crop];
    });
  };

  const removeFromWishlist = (cropId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== cropId));
  }

  const isItemInWishlist = (cropId: string) => {
    return wishlist.some(item => item.id === cropId);
  }

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      crops,
      addCrop,
      updateCrop,
      deleteCrop,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartTotal,
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isItemInWishlist
    }}>
      {isLoaded ? children : null}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
