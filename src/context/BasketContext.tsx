import React, { createContext, useContext, useState } from 'react';

export interface BasketItem {
  id: string; // unique item instance id in cart
  foodId: string;
  foodName: string;
  price: number;
  establishmentId: string;
  establishmentName: string;
  establishmentAddress: string;
  image: string;
  quantity: number;
  selectedNote?: string;
}

export interface PreOrder {
  id: string;
  orderNumber: string;
  establishmentId: string;
  establishmentName: string;
  establishmentAddress: string;
  items: BasketItem[];
  subtotal: number;
  fee: number;
  total: number;
  pickupTimeSlot: string;
  specialInstructions?: string;
  status: 'received' | 'preparing' | 'ready' | 'completed';
  createdAt: string;
  estimatedMinutesRemaining: number;
}

interface BasketContextType {
  items: BasketItem[];
  activePreOrders: PreOrder[];
  pickupTimeSlot: string;
  setPickupTimeSlot: (slot: string) => void;
  specialInstructions: string;
  setSpecialInstructions: (text: string) => void;
  addToBasket: (item: Omit<BasketItem, 'id'>) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromBasket: (id: string) => void;
  clearBasket: () => void;
  placePreOrder: () => PreOrder | null;
  getBasketCount: () => number;
  getBasketSubtotal: () => number;
  activeTabSection: 'current' | 'history';
  setActiveTabSection: (tab: 'current' | 'history') => void;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

// Default initial basket item for smooth demo experience
const INITIAL_BASKET_ITEMS: BasketItem[] = [
  {
    id: 'b-init-1',
    foodId: 'kinalas',
    foodName: 'Kinalas Special (with Egg & Extra Brain Gravy)',
    price: 85,
    establishmentId: 'cha-chas-kinalas',
    establishmentName: 'Cha Cha’s Kinalas & Sinanglay',
    establishmentAddress: 'Barlin Street, Barangay Santa Cruz, Naga City',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',
    quantity: 1,
    selectedNote: 'Extra spicy chili paste, broth on the side',
  },
  {
    id: 'b-init-2',
    foodId: 'sinanglay',
    foodName: 'Sinanglay na Tilapia',
    price: 150,
    establishmentId: 'cha-chas-kinalas',
    establishmentName: 'Cha Cha’s Kinalas & Sinanglay',
    establishmentAddress: 'Barlin Street, Barangay Santa Cruz, Naga City',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    quantity: 1,
  },
];

// Default initial active pre-order ticket for testing active orders
const INITIAL_PRE_ORDERS: PreOrder[] = [
  {
    id: 'ord-8492',
    orderNumber: '#NG-8492',
    establishmentId: 'bakers-plaza-naga',
    establishmentName: 'Baker’s Plaza Bakery & Cafe',
    establishmentAddress: 'Panganiban Drive corner Balintawak St., Naga City',
    items: [
      {
        id: 'po-1',
        foodId: 'toasted-siopao',
        foodName: 'Fresh Baked Toasted Siopao (Box of 10)',
        price: 280,
        establishmentId: 'bakers-plaza-naga',
        establishmentName: 'Baker’s Plaza Bakery & Cafe',
        establishmentAddress: 'Panganiban Drive corner Balintawak St., Naga City',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
        quantity: 1,
        selectedNote: 'Oven fresh, hot batch',
      },
    ],
    subtotal: 280,
    fee: 0,
    total: 280,
    pickupTimeSlot: 'ASAP (15–20 mins)',
    specialInstructions: 'Please pack in insulated box for travel',
    status: 'preparing',
    createdAt: '12 minutes ago',
    estimatedMinutesRemaining: 8,
  },
];

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<BasketItem[]>(INITIAL_BASKET_ITEMS);
  const [activePreOrders, setActivePreOrders] = useState<PreOrder[]>(INITIAL_PRE_ORDERS);
  const [pickupTimeSlot, setPickupTimeSlot] = useState<string>('ASAP (15–20 mins)');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [activeTabSection, setActiveTabSection] = useState<'current' | 'history'>('current');

  const addToBasket = (newItem: Omit<BasketItem, 'id'>) => {
    setItems((prev) => {
      // Check if item from same establishment and same foodId exists
      const existingIndex = prev.findIndex(
        (i) => i.foodId === newItem.foodId && i.establishmentId === newItem.establishmentId
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (newItem.quantity || 1),
        };
        return updated;
      }

      const id = `b-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      return [...prev, { ...newItem, id }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is BasketItem => item !== null)
    );
  };

  const removeFromBasket = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearBasket = () => {
    setItems([]);
  };

  const getBasketSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getBasketCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const placePreOrder = (): PreOrder | null => {
    if (items.length === 0) return null;

    const subtotal = getBasketSubtotal();
    const fee = 0; // Free pre-order service
    const total = subtotal + fee;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const firstItem = items[0];

    const newOrder: PreOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `#NG-${randomNum}`,
      establishmentId: firstItem.establishmentId,
      establishmentName: firstItem.establishmentName,
      establishmentAddress: firstItem.establishmentAddress,
      items: [...items],
      subtotal,
      fee,
      total,
      pickupTimeSlot,
      specialInstructions: specialInstructions.trim() || undefined,
      status: 'received',
      createdAt: 'Just now',
      estimatedMinutesRemaining: 15,
    };

    setActivePreOrders((prev) => [newOrder, ...prev]);
    setItems([]);
    setSpecialInstructions('');
    setActiveTabSection('history'); // auto switch to order status view
    return newOrder;
  };

  return (
    <BasketContext.Provider
      value={{
        items,
        activePreOrders,
        pickupTimeSlot,
        setPickupTimeSlot,
        specialInstructions,
        setSpecialInstructions,
        addToBasket,
        updateQuantity,
        removeFromBasket,
        clearBasket,
        placePreOrder,
        getBasketCount,
        getBasketSubtotal,
        activeTabSection,
        setActiveTabSection,
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
