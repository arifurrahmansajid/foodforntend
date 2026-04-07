"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, OrderItem } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User | null, token: string | null) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'foodhub-auth' }
  )
);

interface CartState {
  items: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.mealId === item.mealId);
        if (existing) {
          return {
            items: state.items.map((i) => 
              i.mealId === item.mealId ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (mealId) => set((state) => ({
        items: state.items.filter((i) => i.mealId !== mealId),
      })),
      updateQuantity: (mealId, quantity) => set((state) => ({
        items: state.items.map((i) => 
          i.mealId === mealId ? { ...i, quantity: Math.max(1, quantity) } : i
        ),
      })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'foodhub-cart' }
  )
);
