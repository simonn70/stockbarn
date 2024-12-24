import { create } from 'zustand'
import { Product } from '../types/product'

interface CartItem extends Product {
  quantity: number
}

interface CartStore {
  cartItems: CartItem[]
  cartCount: number
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  cartItems: [],
  cartCount: 0,
  addToCart: (product, quantity) => set((state) => {
    const existingItem = state.cartItems.find(item => item.id === product.id)
    let newCartItems: CartItem[]

    if (existingItem) {
      newCartItems = state.cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      )
    } else {
      newCartItems = [...state.cartItems, { ...product, quantity }]
    }

    return {
      cartItems: newCartItems,
      cartCount: newCartItems.reduce((sum, item) => sum + item.quantity, 0)
    }
  }),
  removeFromCart: (id) => set((state) => {
    const newCartItems = state.cartItems.filter(item => item.id !== id)
    return {
      cartItems: newCartItems,
      cartCount: newCartItems.reduce((sum, item) => sum + item.quantity, 0)
    }
  }),
  clearCart: () => set({ cartItems: [], cartCount: 0 }),
}))

