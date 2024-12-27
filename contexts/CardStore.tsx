import { create } from 'zustand'
import { persist } from 'zustand/middleware'



interface CartStore {
  cartItems: any
  cartCount: number
  addToCart: (product: any, quantity: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
}

export const useCartStore = create<any>()(
  persist(
    (set) => ({
      cartItems: [],
      cartCount: 0,
      addToCart: (product, quantity) =>
        set((state) => {
          const existingItem = state.cartItems.find((item) => item._id === product._id)
          let newCartItems:any

          if (existingItem) {
            newCartItems = state.cartItems.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
            )
          } else {
            newCartItems = [...state.cartItems, { ...product, quantity }]
          }

          return {
            cartItems: newCartItems,
            cartCount: newCartItems.reduce((sum, item) => sum + item.quantity, 0),
          }
        }),
      removeFromCart: (id) =>
        set((state) => {
          const newCartItems = state.cartItems.filter((item) => item._id !== id)
          return {
            cartItems: newCartItems,
            cartCount: newCartItems.reduce((sum, item) => sum + item.quantity, 0),
          }
        }),
      clearCart: () => set({ cartItems: [], cartCount: 0 }),
    }),
    {
      name: 'cart-storage', // unique name for the localStorage key
      partialize: (state) => ({ cartItems: state.cartItems, cartCount: state.cartCount }), // optionally store only part of the state
    }
  )
)
