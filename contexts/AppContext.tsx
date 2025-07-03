"use client";

import { FlatColor } from "@/lib/api/productApi";
import type React from "react";
import { createContext, useContext, useReducer, type ReactNode } from "react";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  images: string[];
  category: string;
  subcategory: string;
  brand: string;
  colors: string[];
  sizes: string[];
  stock: number;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  description: string;
  tags: string[];
}

interface CartItem {
  id: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "cod" | "sslcommerz";
  shippingAddress: Address;
  createdAt: string;
  trackingId?: string;
}

// Add to the AppState interface
interface AppState {
  user: User | null;
  cart: CartItem[];
  isCartOpen: boolean;
  products: Product[];
  featuredProducts: Product[];
  bestSellerProducts: Product[];
  orders: Order[];
  colors: FlatColor[];
  categorys: string[];
  isLoading: boolean;
  appliedCoupon: string | null;
  couponDiscount: number;
}

// Add to AppAction type
type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_CART_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_COLORS"; payload: FlatColor[] }
  | { type: "SET_CATEGORYS"; payload: string[] }
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "SET_FEATURED_PRODUCTS"; payload: Product[] }
  | { type: "SET_BESTSELLER_PRODUCTS"; payload: Product[] }
  | { type: "SET_ORDERS"; payload: Order[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "APPLY_COUPON"; payload: { code: string; discount: number } }
  | { type: "REMOVE_COUPON" };

// Update initialState
const initialState: AppState = {
  user: null,
  cart: [],
  isCartOpen: false,
  products: [],
  featuredProducts: [],
  bestSellerProducts: [],
  colors: [],
  categorys: [],
  orders: [],
  isLoading: false,
  appliedCoupon: null,
  couponDiscount: 0,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "ADD_TO_CART":
      const existingItem = state.cart.find(
        (item) =>
          item.product.id === action.payload.product.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, action.payload] };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_CART_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "CLEAR_CART":
      return { ...state, cart: [] };

    case "TOGGLE_CART":
      return { ...state, isCartOpen: !state.isCartOpen };

    case "SET_CATEGORYS":
      return { ...state, categorys: action.payload };

    case "SET_COLORS":
      return { ...state, colors: action.payload };

    case "SET_PRODUCTS":
      return { ...state, products: action.payload };

    case "SET_FEATURED_PRODUCTS":
      return { ...state, featuredProducts: action.payload };

    case "SET_BESTSELLER_PRODUCTS":
      return { ...state, bestSellerProducts: action.payload };

    case "SET_ORDERS":
      return { ...state, orders: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "APPLY_COUPON":
      return {
        ...state,
        appliedCoupon: action.payload.code,
        couponDiscount: action.payload.discount,
      };

    case "REMOVE_COUPON":
      return {
        ...state,
        appliedCoupon: null,
        couponDiscount: 0,
      };

    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

// Add coupon validation function
export const validateCoupon = (
  code: string
): { isValid: boolean; discount: number; message: string } => {
  const validCoupons = {
    KOLAZ10: { discount: 0.1, message: "10% discount applied!" },
    WELCOME20: { discount: 0.2, message: "20% welcome discount applied!" },
    SAVE15: { discount: 0.15, message: "15% discount applied!" },
  };

  if (validCoupons[code as keyof typeof validCoupons]) {
    const coupon = validCoupons[code as keyof typeof validCoupons];
    return {
      isValid: true,
      discount: coupon.discount,
      message: coupon.message,
    };
  }

  return {
    isValid: false,
    discount: 0,
    message: "Invalid or expired coupon code",
  };
};

export type { Product, CartItem, User, Address, Order };
