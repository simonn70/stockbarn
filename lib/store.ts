import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

type UserType = "admin" | "customer" | null;
interface Product {
  name: string; // Name of the product
  category: string; // Category the product belongs to
  description: string; // Description of the product
  price: number; // Price of the product
  stock: number; // Available stock of the product
  unit: number;
  quantity: number; // Quantity selected or purchased
  images: string[]; // Array of image URLs for the product
}
interface TokenState {
  token: string | null;
  userType: UserType;
  name: string;
  product: Product;
  setToken: (token: string, userType: UserType, name, datas) => void;
  clearToken: () => void;
  setDatas: (datas) => void;
}

const localStorageWrapper = {
  getItem: (name: string) => {
    const storedValue = localStorage.getItem(name);
    return storedValue ? JSON.parse(storedValue) : null;
  },
  setItem: (name: string, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

const useTokenStore = create<TokenState>()(
  persist<TokenState>(
    (set) => ({
      token: null,
      userType: null,
      name: null,
      product: null,
      setToken: (token: string) =>
        set({ token }),
      clearToken: () => set({ token: null, userType: null, name: null, product: null }),
      setDatas: (product) => set({ product }),
    }),
    {
      name: "token-storage", // Name of the item in storage
      getStorage: localStorageWrapper as unknown as Storage, // Custom wrapper for localStorage
    } as PersistOptions<TokenState> // Explicitly type as PersistOptions
  )
);

export default useTokenStore;
