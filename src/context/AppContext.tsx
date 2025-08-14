
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Crop, CartItem, User, Order, OrderStatus } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, writeBatch, serverTimestamp, query, where, orderBy, Timestamp } from 'firebase/firestore';

interface AppContextType {
  user: (User & { email?: string }) | null;
  firebaseUser: FirebaseUser | null;
  login: (role: 'farmer' | 'buyer') => void; // This will be removed, login is handled by auth pages
  logout: () => void;
  updateUser: (user: Partial<User>) => Promise<void>;
  crops: Crop[];
  addCrop: (crop: Omit<Crop, 'id'>) => Promise<void>;
  updateCrop: (crop: Crop) => Promise<void>;
  deleteCrop: (cropId: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (crop: Crop, quantity?: number) => void;
  removeFromCart: (cropId: string) => void;
  updateCartQuantity: (cropId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  placeOrder: () => Promise<Order | null>;
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

const getInitialState = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') {
        return fallback;
    }
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
        try {
            return JSON.parse(storedValue);
        } catch (e) {
            console.error(`Error parsing localStorage key "${key}":`, e);
            return fallback;
        }
    }
    return fallback;
};


export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<(User & { email?: string }) | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => getInitialState<CartItem[]>('cropcart-cart', []));
  const [wishlist, setWishlist] = useState<Crop[]>(() => getInitialState<Crop[]>('cropcart-wishlist', []));
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
            const userData = { id: userDocSnap.id, ...userDocSnap.data(), email: fbUser.email } as (User & { email?: string });
            setUser(userData);

            // Load cart and wishlist from localStorage upon login
            const storedCart = getInitialState<CartItem[]>(`cropcart-cart-${fbUser.uid}`, []);
            const storedWishlist = getInitialState<Crop[]>(`cropcart-wishlist-${fbUser.uid}`, []);
            setCart(storedCart);
            setWishlist(storedWishlist);
            
            const publicRoutes = ['/login', '/register', '/'];
            const isPublicRoute = publicRoutes.some(p => pathname.startsWith(p));

            if (isPublicRoute) {
               router.push(`/${userData.role}/dashboard`);
            }
          } else {
             // If user exists in Auth but not Firestore, sign them out.
            console.log("User not found in Firestore. Signing out.");
            await auth.signOut();
          }
        } catch (error) {
           console.error("Failed to fetch user document:", error);
           await auth.signOut();
        }
      } else {
        // User logged out
        setUser(null);
        setFirebaseUser(null);
        setCart([]);
        setWishlist([]);
        setOrders([]);
        // Keep crops and farmers loaded for public pages
        const isAuthPage = ['/login', '/register'].some(p => pathname.startsWith(p));
        const isProductPage = pathname.startsWith('/products');
        if (!isAuthPage && !isProductPage && pathname !== '/') {
            router.push('/');
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Effect for fetching data once on initial load
   useEffect(() => {
    async function fetchPublicData() {
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
        } catch (error) {
            console.error("Error fetching public data:", error);
        } finally {
            setLoading(false);
        }
   }
   fetchPublicData();
  }, []);


  // Effect for fetching user-specific data (orders)
  useEffect(() => {
    async function fetchUserOrders() {
      if (!user) {
        setOrders([]);
        return;
      }
      setLoading(true);
      try {
        let ordersQuery;
        if (user.role === 'buyer') {
             ordersQuery = query(collection(db, "orders"), where("buyer.id", "==", user.id), orderBy("date", "desc"));
        } else {
            // Firestore requires a composite index for this query.
            // As a workaround, we fetch and then sort client-side.
            ordersQuery = query(collection(db, "orders"), where("farmerIds", "array-contains", user.id));
        }
        const ordersSnapshot = await getDocs(ordersQuery);
        let ordersList = ordersSnapshot.docs.map(doc => {
          const data = doc.data();
          // Safely handle date conversion
          const date = data.date ? (data.date as Timestamp).toDate() : new Date();
          return { id: doc.id, ...data, date } as Order;
        });

        // Sort orders by date client-side if they are for a farmer
        if (user.role === 'farmer') {
            ordersList.sort((a, b) => (b.date as Date).getTime() - (a.date as Date).getTime());
        }

        setOrders(ordersList);

      } catch (error) {
          console.error("Error fetching orders:", error)
      } finally {
          setLoading(false);
      }
    }
    fetchUserOrders();
  }, [user]);


   // Effect for persisting cart and wishlist to localStorage
  useEffect(() => {
    if(!loading && user?.id) {
      localStorage.setItem(`cropcart-cart-${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user, loading]);

  useEffect(() => {
    if(!loading && user?.id) {
      localStorage.setItem(`cropcart-wishlist-${user.id}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user, loading]);


  const login = (role: 'farmer' | 'buyer') => {
    console.log("Login function called, but auth is handled by Firebase pages.");
  };

  const logout = async () => {
    try {
        const userId = user?.id;
        await auth.signOut();
        // Clear local storage for the logged-out user
        if (userId) {
            localStorage.removeItem(`cropcart-cart-${userId}`);
            localStorage.removeItem(`cropcart-wishlist-${userId}`);
        }
        router.push('/');
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

  const addCrop = async (cropData: Omit<Crop, 'id'>) => {
    if (user?.role !== 'farmer') return;
    try {
        const docRef = await addDoc(collection(db, "crops"), cropData);
        setCrops(prev => [...prev, { ...cropData, id: docRef.id }]);
    } catch (error) {
        console.error("Error adding crop:", error);
    }
  };

  const updateCrop = async (updatedCrop: Crop) => {
    try {
        const { id, ...cropData } = updatedCrop;
        const cropDocRef = doc(db, "crops", id);
        await updateDoc(cropDocRef, cropData);
        setCrops(prev => prev.map(c => c.id === id ? updatedCrop : c));
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
    if (!user) {
        router.push('/login?role=buyer');
        return;
    }
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
  };

  const placeOrder = async (): Promise<Order | null> => {
    if (!user || cart.length === 0) {
      throw new Error("User not logged in or cart is empty");
    }
    try {
        const farmerIds = [...new Set(cart.map(item => item.farmerId))];
        const newOrderData: Omit<Order, 'id'> = {
            date: serverTimestamp(),
            buyer: {
                id: user.id,
                name: user.name,
                role: 'buyer',
                contact: user.contact || '', // Ensure contact is not undefined
                avatarUrl: user.avatarUrl,
            },
            items: cart,
            total: cartTotal,
            status: 'Pending',
            farmerIds,
        };
        
        const docRef = await addDoc(collection(db, "orders"), newOrderData);
        
        const newOrderForState: Order = { ...newOrderData, id: docRef.id, date: new Date() };
        setOrders(prev => [newOrderForState, ...prev]);
        
        return newOrderForState;
    } catch (error) {
        console.error("Error placing order:", error);
        throw error;
    }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const addToWishlist = (crop: Crop) => {
     if (!user) {
        router.push('/login?role=buyer');
        return;
    }
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

    