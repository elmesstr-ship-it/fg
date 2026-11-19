"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
  variantId?: string;
  variantName?: string;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity?: number,
    variantId?: string,
    variantName?: string,
    selectedSize?: string,
    selectedColor?: string
  ) => void;
  removeItem: (productId: string, variantId?: string, selectedSize?: string, selectedColor?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    variantId?: string,
    selectedSize?: string,
    selectedColor?: string
  ) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, variantId, variantName, selectedSize, selectedColor) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.variantId === variantId &&
              item.selectedSize === selectedSize &&
              item.selectedColor === selectedColor
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems };
          }

          return {
            items: [
              ...state.items,
              { product, quantity, variantId, variantName, selectedSize, selectedColor },
            ],
          };
        });
      },
      removeItem: (productId, variantId, selectedSize, selectedColor) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.variantId === variantId &&
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor
              )
          ),
        }));
      },
      updateQuantity: (productId, quantity, variantId, selectedSize, selectedColor) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId, selectedSize, selectedColor);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId &&
            item.variantId === variantId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
              ? { ...item, quantity }
              : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },
    }),
    {
      name: "fg-collective-cart",
    }
  )
);
