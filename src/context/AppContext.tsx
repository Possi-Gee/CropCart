
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Crop, CartItem, User, Order, OrderStatus } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, writeBatch, serverTimestamp, query, where, orderBy } from 'firebase/firestore';

interface AppContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (role: 'farmer' | 'buyer') => void; // This will be removed, login is handled by auth pages
  logout: () => void;
  updateUser: (user: Partial<User>) => Promise<void>;
  crops: Crop[];
  addCrop: (crop: Omit<Crop, 'id' | 'farmerId'>) => Promise<void>;
  updateCrop: (crop: Crop) => Promise<void>;
  deleteCrop: (cropId: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (crop: Crop, quantity?: number) => void;
  removeFromCart: (cropId: string) => void;
  updateCartQuantity: (cropId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  placeOrder: () => Promise<void>;
  wishlist: Crop[];
  addToWishlist: (crop: Crop) => void;
  removeFromWishlist: (cropId: string) => void;
  isItemInWishlist: (cropId: string) => boolean;
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  farmers: User[];
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Crop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [farmers, setFarmers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();

  // Effect for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        const userDocRef = doc(db, "users", fbUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = { id: userDocSnap.id, ...userDocSnap.data() } as User;
            setUser(userData);
            // Redirect only when moving from a non-app page to an app page
            if (pathname === '/login' || pathname === '/register' || pathname === '/') {
              router.push(`/${userData.role}/dashboard`);
            }
          } else {
             // If user exists in Auth but not Firestore, sign them out.
            console.log("User not found in Firestore. Signing out.");
            await auth.signOut();
            setUser(null);
            setFirebaseUser(null);
          }
        } catch (error) {
           console.error("Failed to fetch user document:", error);
           await auth.signOut();
           setUser(null);
           setFirebaseUser(null);
        }
      } else {
        setUser(null);
        setFirebaseUser(null);
        setCart([]);
        setWishlist([]);
        setCrops([]);
        setOrders([]);
        setFarmers([]);
        // Only redirect if user is not on a public page
        if (!['/login', '/register', '/'].some(p => pathname.startsWith(p))) {
            router.push('/');
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Effect for fetching data once user is loaded
   useEffect(() => {
    async function fetchData() {
      if (!user) {
        setCrops([]);
        setOrders([]);
        setFarmers([]);
        return;
      }

      setLoading(true);
      try {
        const cropsCollectionRef = collection(db, "crops");
        const cropsSnapshot = await getDocs(query(cropsCollectionRef, orderBy("name")));
        const cropsList = cropsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Crop));
        setCrops(cropsList);
        
        const farmersCollectionRef = collection(db, "users");
        const farmersSnapshot = await getDocs(query(farmersCollectionRef, where("role", "==", "farmer")));
        const farmersList = farmersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setFarmers(farmersList);

        let ordersQuery;
        if (user.role === 'buyer') {
            // Remove orderBy to avoid composite index, will sort client-side
            ordersQuery = query(collection(db, "orders"), where("buyer.id", "==", user.id));
        } else {
            // Remove orderby to avoid composite index requirement
            ordersQuery = query(collection(db, "orders"), where("farmerIds", "array-contains", user.id));
        }
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        
        // Sort client-side
        ordersList.sort((a, b) => {
            const dateA = a.date && (a.date as any).seconds ? (a.date as any).seconds : 0;
            const dateB = b.date && (b.date as any).seconds ? (b.date as any).seconds : 0;
            return dateB - dateA;
        });

        setOrders(ordersList);

        const storedCart = localStorage.getItem(`cropcart-cart-${user.id}`);
        if (storedCart) setCart(JSON.parse(storedCart));
        const storedWishlist = localStorage.getItem(`cropcart-wishlist-${user.id}`);
        if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      } catch (error) {
          console.error("Error fetching data:", error)
      } finally {
          setLoading(false);
      }
    }
    fetchData();
  }, [user]);

   // Effect for persisting cart and wishlist to localStorage
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`cropcart-cart-${user.id}`, JSON.stringify(cart));
      localStorage.setItem(`cropcart-wishlist-${user.id}`, JSON.stringify(wishlist));
    }
  }, [cart, wishlist, user]);


  const login = (role: 'farmer' | 'buyer') => {
    console.log("Login function called, but auth is handled by Firebase pages.");
  };

  const logout = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error("Error signing out:", error);
    }
  };

  const updateUser = async (updatedUserData: Partial<User>) => {
    if (!user) return;
    try {
        const userDocRef = doc(db, "users", user.id);
        await updateDoc(userDocRef, updatedUserData);
        setUser(prev => ({ ...prev!, ...updatedUserData }));
    } catch (error) {
        console.error("Error updating user:", error);
    }
  };

  const addCrop = async (crop: Omit<Crop, 'id' | 'farmerId'>) => {
    if (user?.role !== 'farmer') return;
    try {
        const newCropData = { ...crop, farmerId: user.id };
        const docRef = await addDoc(collection(db, "crops"), newCropData);
        setCrops(prev => [...prev, { ...newCropData, id: docRef.id }]);
    } catch (error) {
        console.error("Error adding crop:", error);
    }
  };

  const updateCrop = async (updatedCrop: Crop) => {
    try {
        const cropDocRef = doc(db, "crops", updatedCrop.id);
        await updateDoc(cropDocRef, updatedCrop);
        setCrops(prev => prev.map(c => c.id === updatedCrop.id ? updatedCrop : c));
    } catch(error) {
        console.error("Error updating crop:", error);
    }
  };

  const deleteCrop = async (cropId: string) => {
    try {
        const cropDocRef = doc(db, "crops", cropId);
        await deleteDoc(cropDocRef);
        setCrops(prev => prev.filter(c => c.id !== cropId));
    } catch(error) {
        console.error("Error deleting crop:", error);
    }
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
    if (user) {
      localStorage.removeItem(`cropcart-cart-${user.id}`);
    }
  };

  const placeOrder = async () => {
    if (!user || cart.length === 0) return;
    try {
        const farmerIds = [...new Set(cart.map(item => item.farmerId))];
        const newOrder: Omit<Order, 'id'> = {
            date: serverTimestamp(),
            buyer: {
                id: user.id,
                name: user.name,
                role: 'buyer',
                contact: user.contact,
                avatarUrl: user.avatarUrl,
            },
            items: cart,
            total: cartTotal,
            status: 'Pending',
            farmerIds,
        };
        
        const docRef = await addDoc(collection(db, "orders"), newOrder);
        setOrders(prev => [{ ...newOrder, id: docRef.id, date: new Date().toISOString() }, ...prev]);
        clearCart();
    } catch (error) {
        console.error("Error placing order:", error);
        throw error;
    }
  };

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

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
        const orderDocRef = doc(db, "orders", orderId);
        await updateDoc(orderDocRef, { status });
        setOrders(prev => prev.map(o => o.id === orderId ? {...o, status} : o));
    } catch (error) {
        console.error("Error updating order status:", error);
    }
  }

  return (
    <AppContext.Provider value={{
      user,
      firebaseUser,
      login,
      logout,
      updateUser,
      crops,
      addCrop,
      updateCrop,
      deleteCrop,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      placeOrder,
      cartTotal,
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isItemInWishlist,
      orders,
      updateOrderStatus,
      farmers,
      loading,
    }}>
      {children}
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
