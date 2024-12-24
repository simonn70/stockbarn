// import { create } from "zustand";
// interface TokenState {
//   token: string | null;
//   userType: any;
//   name: any;
//   setToken: (token: string, userType: any, name: any) => void;
//   clearToken: () => void;
// }

// const useTokenStore = create<TokenState>((set) => ({
//   token: localStorage.getItem("token") || null,
//   name: localStorage.getItem("name") || null,
//   userType: localStorage.getItem("userType") || null,
//   setToken: (token: string, userType: any, name: any) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("userType", userType);
//     localStorage.setItem("name", name);
//     set({ token, userType, name });
//   },
//   clearToken: () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userType");
//     set({ token: null, userType: null });
//   },
// }));

// export default useTokenStore;

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
      clearToken: () => set({ token: null }),
      setUserType: (userType: UserType) => {
        // Ensure non-null values
        set({ userType });
      },
      setNames: (name: any) => {
        // Ensure non-null values
        set({ name });
      },
    }),
    {
      name: "token-storage", // name of the item in localStorage
      getStorage: () => localStorage, // use localStorage
    }
  )
);

export default useTokenStore;
