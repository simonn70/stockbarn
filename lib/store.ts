import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

type UserType = "admin" | "customer" | null;

interface TokenState {
  token: string | null;
  userType: UserType;
  name: string;
  datas: string[];
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
      datas: [],
      setToken: (token: string, userType: UserType, name, datas) =>
        set({ token, userType, name, datas }),
      clearToken: () => set({ token: null, userType: null, name: null, datas: [] }),
      setDatas: (datas) => set({ datas }),
    }),
    {
      name: "token-storage", // Name of the item in storage
      getStorage: localStorageWrapper as unknown as Storage, // Custom wrapper for localStorage
    } as PersistOptions<TokenState> // Explicitly type as PersistOptions
  )
);

export default useTokenStore;
