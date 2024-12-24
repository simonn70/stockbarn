'use client'

import { ProductCard } from '@/components/Card'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { MiniCart } from '@/components/mini-cart'
import { useCartStore } from '@/contexts/CardStore'
import { useState } from 'react'


export const colors = {
  primary: '#4CAF50',
  secondary: '#FFC107',
  background: '#F5F5F5',
  text: '#333333',
  lightText: '#666666',
  white: '#FFFFFF',
}



const products: Product[] = [
  { 
    id: 1, 
    name: 'Organic Apples', 
    price: 1.99, 
    images: [
      '/placeholder.svg?height=400&width=400&text=Apple+1',
      '/placeholder.svg?height=400&width=400&text=Apple+2',
      '/placeholder.svg?height=400&width=400&text=Apple+3'
    ],
    unit: 'per lb', 
    category: 'Fruits & Veggies',
    description: 'Fresh, crisp organic apples. Perfect for snacking, baking, or adding to your favorite recipes.',
    nutrition: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 }
  },
  { 
    id: 2, 
    name: 'Ripe Bananas', 
    price: 0.99, 
    images: [
      '/placeholder.svg?height=400&width=400&text=Banana+1',
      '/placeholder.svg?height=400&width=400&text=Banana+2',
      '/placeholder.svg?height=400&width=400&text=Banana+3'
    ],
    unit: 'per lb', 
    category: 'Fruits & Veggies',
    description: 'Sweet and creamy bananas, rich in potassium and perfect for smoothies or as a quick snack.',
    nutrition: { calories: 105, protein: 1.3, carbs: 27, fat: 0.3 }
  },
  { 
    id: 3, 
    name: 'Fresh Milk', 
    price: 2.49, 
    images: [
      '/placeholder.svg?height=400&width=400&text=Milk+1',
      '/placeholder.svg?height=400&width=400&text=Milk+2',
      '/placeholder.svg?height=400&width=400&text=Milk+3'
    ],
    unit: 'per gallon', 
    category: 'Dairy & Eggs',
    description: 'Creamy, farm-fresh milk. Rich in calcium and perfect for drinking, cooking, or baking.',
    nutrition: { calories: 103, protein: 8, carbs: 12, fat: 2.4 }
  },
]

export default function Home() {
  const { addToCart } = useCartStore()

  const categories = Array.from(new Set(products.map(p => p.category)))

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Header />
      <Hero />
      <main className="container mx-auto py-8 px-4">
        {categories.map(category => (
          <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')} className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products
                .filter(product => product.category === category)
                .map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
            </div>
          </section>
        ))}
      </main>
      <MiniCart />
    </div>
  )
}

