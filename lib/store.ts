import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserType = "admin" | "customer" | null;

interface TokenState {
  token: string | null;
  userType: UserType;
  name: any;
  datas: any;
  setToken: (token: string, userType: UserType, name: any, datas: any) => void;
  clearToken: () => void;
  setDatas: (datas: any) => void;
 // Added function to set datas
}

const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      token: null,
      userType: null,
      name: null,
      datas: [],
      setToken: (token: string, userType: UserType, name: any, datas: any) =>
        set({ token, userType, name, datas }),
      clearToken: () => set({ token: null, userType: null, name: null, datas: [] }),
      setDatas: (datas: any) => set({ datas }), // Implementation of setDatas
    }),
    {
      name: "token-storage", // name of the item in localStorage
      getStorage: () => localStorage, // use localStorage
    }
  )
);

export default useTokenStore;
