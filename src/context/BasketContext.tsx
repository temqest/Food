import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ImageSourcePropType } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { OrderService } from '@/services/orderService';

export interface BasketItem {
  id: string; // unique item instance id in cart
  foodId: string;
  foodName: string;
  price: number;
  establishmentId: string;
  establishmentName: string;
  establishmentAddress: string;
  image: string | ImageSourcePropType;
  quantity: number;
  selectedNote?: string;
}

export interface PreOrder {
  id: string;
  orderNumber: string;
  establishmentId: string;
  establishmentName: string;
  establishmentAddress: string;
  customerName?: string;
  customerPhone?: string;
  items: BasketItem[];
  subtotal: number;
  fee: number;
  total: number;
  diningOption: 'dine_in' | 'takeout';
  pickupTimeSlot: string;
  specialInstructions?: string;
  paymentMethod: 'cash' | 'gcash' | 'maya';
  paymentStatus: 'pending_counter' | 'paid';
  paymentRefNumber?: string;
  status: 'received' | 'preparing' | 'ready' | 'completed';
  createdAt: string;
  estimatedMinutesRemaining: number;
}

const BASKET_FOOD_IMAGES: Record<string, ImageSourcePropType> = {
  kinalas: require('../../Food Images/kinalas1.webp'),
  sinanglay: require('../../Food Images/sinanglayTilapia1.jpg'),
  baduya: require('../../Food Images/Baduya1.jpg'),
  toastedSiopao: require('../../Food Images/toastedSiopao1.jpg'),
};

export const getBasketFoodImage = (foodId: string): ImageSourcePropType | undefined =>
  BASKET_FOOD_IMAGES[foodId === 'toasted-siopao' ? 'toastedSiopao' : foodId];

export const normalizeOrderImages = (order: PreOrder): PreOrder => ({
  ...order,
  items: order.items.map((item) => ({
    ...item,
    image: getBasketFoodImage(item.foodId) || item.image,
  })),
});

interface BasketContextType {
  items: BasketItem[];
  activePreOrders: PreOrder[];
  diningOption: 'dine_in' | 'takeout';
  setDiningOption: (option: 'dine_in' | 'takeout') => void;
  pickupTimeSlot: string;
  setPickupTimeSlot: (slot: string) => void;
  specialInstructions: string;
  setSpecialInstructions: (text: string) => void;
  paymentMethod: 'cash' | 'gcash' | 'maya';
  setPaymentMethod: (method: 'cash' | 'gcash' | 'maya') => void;
  addToBasket: (item: Omit<BasketItem, 'id'>) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateItemNote: (id: string, note: string) => void;
  removeFromBasket: (id: string) => void;
  clearBasket: () => void;
  placePreOrder: (paymentDetails?: { method?: 'cash' | 'gcash' | 'maya'; refNumber?: string }) => PreOrder | null;
  updateOrderStatus: (orderId: string, status: PreOrder['status']) => void;
  advanceOrderStatusDemo: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  addDemoOrder: (customOrder?: Partial<PreOrder>) => PreOrder;
  resetDemoOrders: () => void;
  getBasketCount: () => number;
  getBasketSubtotal: () => number;
  activeTabSection: 'current' | 'history';
  setActiveTabSection: (tab: 'current' | 'history') => void;
  isLoading: boolean;
  refreshOrders: () => Promise<void>;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

const BASKET_STORAGE_KEY = '@naga_food_basket_items_v1';

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const [items, setItems] = useState<BasketItem[]>([]);
  const [activePreOrders, setActivePreOrders] = useState<PreOrder[]>([]);
  const [diningOption, setDiningOption] = useState<'dine_in' | 'takeout'>('dine_in');
  const [pickupTimeSlot, setPickupTimeSlot] = useState<string>('ASAP (15–20 mins)');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'gcash' | 'maya'>('cash');
  const [activeTabSection, setActiveTabSection] = useState<'current' | 'history'>('current');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Load persisted cart items from local storage on launch
  useEffect(() => {
    let isMounted = true;
    async function loadStoredCart() {
      try {
        const stored = await AsyncStorage.getItem(BASKET_STORAGE_KEY);
        if (stored && isMounted) {
          const parsed: BasketItem[] = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setItems(
              parsed.map((item) => ({
                ...item,
                image: getBasketFoodImage(item.foodId) || item.image,
              }))
            );
          }
        }
      } catch (err) {
        console.warn('[BasketContext] Error loading cached basket items:', err);
      }
    }
    loadStoredCart();
    return () => {
      isMounted = false;
    };
  }, []);

  // Persist cart changes to AsyncStorage
  const saveCartToStorage = useCallback(async (newItems: BasketItem[]) => {
    try {
      // Store string images only to avoid circular reference or crash on local requires
      const serialized = newItems.map((item) => ({
        ...item,
        image: typeof item.image === 'string' ? item.image : '',
      }));
      await AsyncStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(serialized));
    } catch (err) {
      console.warn('[BasketContext] Error saving basket items:', err);
    }
  }, []);

  // 2. Fetch active orders from Supabase user_orders whenever user logs in or changes
  const fetchOrders = useCallback(async () => {
    if (!user?.id || isGuest) {
      setActivePreOrders([]);
      return;
    }

    try {
      setIsLoading(true);
      const orders = await OrderService.getUserOrders(user.id);
      setActivePreOrders(orders.map(normalizeOrderImages));
    } catch (err) {
      console.warn('[BasketContext] Error fetching user orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, isGuest]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addToBasket = (newItem: Omit<BasketItem, 'id'>) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.foodId === newItem.foodId && i.establishmentId === newItem.establishmentId
      );

      let updated: BasketItem[];
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (newItem.quantity || 1),
        };
      } else {
        const id = `b-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        updated = [...prev, { ...newItem, id }];
      }

      saveCartToStorage(updated);
      return updated;
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) => {
      const updated = prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is BasketItem => item !== null);

      saveCartToStorage(updated);
      return updated;
    });
  };

  const updateItemNote = (id: string, note: string) => {
    setItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, selectedNote: note } : item));
      saveCartToStorage(updated);
      return updated;
    });
  };

  const removeFromBasket = (id: string) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveCartToStorage(updated);
      return updated;
    });
  };

  const clearBasket = () => {
    setItems([]);
    saveCartToStorage([]);
  };

  const getBasketSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getBasketCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const placePreOrder = (paymentDetails?: { method?: 'cash' | 'gcash' | 'maya'; refNumber?: string }): PreOrder | null => {
    if (items.length === 0) return null;

    const subtotal = getBasketSubtotal();
    const fee = 0; // Free pre-order service
    const total = subtotal + fee;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const firstItem = items[0];
    const chosenMethod = paymentDetails?.method || paymentMethod;
    const paymentStatus: PreOrder['paymentStatus'] = chosenMethod === 'cash' ? 'pending_counter' : 'paid';
    const paymentRefNumber =
      paymentDetails?.refNumber ||
      (chosenMethod !== 'cash' ? `REF-${Math.floor(100000000 + Math.random() * 900000000)}` : undefined);

    const newOrder: PreOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `#NG-${randomNum}`,
      establishmentId: firstItem.establishmentId,
      establishmentName: firstItem.establishmentName,
      establishmentAddress: firstItem.establishmentAddress,
      customerName: user?.name,
      customerPhone: user?.phone,
      items: [...items],
      subtotal,
      fee,
      total,
      diningOption,
      pickupTimeSlot,
      specialInstructions: specialInstructions.trim() || undefined,
      paymentMethod: chosenMethod,
      paymentStatus,
      paymentRefNumber,
      status: 'received',
      createdAt: 'Just now',
      estimatedMinutesRemaining: 15,
    };

    setActivePreOrders((prev) => [newOrder, ...prev]);
    clearBasket();
    setSpecialInstructions('');
    setActiveTabSection('history'); // auto switch to order status view

    // Persist to Supabase if authenticated
    if (user?.id && !isGuest) {
      OrderService.createOrder(user.id, newOrder).catch((err) => {
        console.warn('[BasketContext] Failed to save order to database:', err);
      });
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: PreOrder['status']) => {
    setActivePreOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const estimatedMinutesRemaining =
            status === 'received' ? 20 : status === 'preparing' ? 10 : 0;
          return {
            ...order,
            status,
            estimatedMinutesRemaining,
          };
        }
        return order;
      })
    );

    OrderService.updateOrderStatus(orderId, status).catch((err) => {
      console.warn('[BasketContext] Failed to update order status in DB:', err);
    });
  };

  const advanceOrderStatusDemo = (orderId: string) => {
    setActivePreOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const cycle: Record<PreOrder['status'], PreOrder['status']> = {
            received: 'preparing',
            preparing: 'ready',
            ready: 'completed',
            completed: 'received',
          };
          const nextStatus = cycle[order.status];
          const estimatedMinutesRemaining =
            nextStatus === 'received' ? 20 : nextStatus === 'preparing' ? 10 : 0;

          OrderService.updateOrderStatus(orderId, nextStatus).catch((err) => {
            console.warn('[BasketContext] Failed to advance order status in DB:', err);
          });

          return {
            ...order,
            status: nextStatus,
            estimatedMinutesRemaining,
          };
        }
        return order;
      })
    );
  };

  const cancelOrder = (orderId: string) => {
    setActivePreOrders((prev) => prev.filter((order) => order.id !== orderId));
    OrderService.cancelOrder(orderId).catch((err) => {
      console.warn('[BasketContext] Failed to cancel order in DB:', err);
    });
  };

  const addDemoOrder = (customOrder?: Partial<PreOrder>): PreOrder => {
    const orderNumber = `#NG-${Math.floor(9100 + Math.random() * 800)}`;
    const newOrder: PreOrder = {
      id: `ord-gen-${Date.now()}`,
      orderNumber,
      establishmentId: 'cha-chas-kinalas',
      establishmentName: 'Cha Cha’s Kinalas & Sinanglay',
      establishmentAddress: 'Barlin Street, Barangay Santa Cruz, Naga City',
      customerName: user?.name || 'Explorer',
      customerPhone: user?.phone || '+63 917 000 0000',
      items: [],
      subtotal: 0,
      fee: 0,
      total: 0,
      diningOption: 'dine_in',
      pickupTimeSlot: 'ASAP (10–15 mins)',
      paymentMethod: 'cash',
      paymentStatus: 'pending_counter',
      status: 'received',
      createdAt: 'Just now',
      estimatedMinutesRemaining: 15,
      ...customOrder,
    };

    setActivePreOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const resetDemoOrders = () => {
    fetchOrders();
  };

  return (
    <BasketContext.Provider
      value={{
        items,
        activePreOrders,
        diningOption,
        setDiningOption,
        pickupTimeSlot,
        setPickupTimeSlot,
        specialInstructions,
        setSpecialInstructions,
        paymentMethod,
        setPaymentMethod,
        addToBasket,
        updateQuantity,
        updateItemNote,
        removeFromBasket,
        clearBasket,
        placePreOrder,
        updateOrderStatus,
        advanceOrderStatusDemo,
        cancelOrder,
        addDemoOrder,
        resetDemoOrders,
        getBasketCount,
        getBasketSubtotal,
        activeTabSection,
        setActiveTabSection,
        isLoading,
        refreshOrders: fetchOrders,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
};
