'use client'

import { ProductCard } from '@/components/Card'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { MiniCart } from '@/components/mini-cart'
import { useCartStore } from '@/contexts/CardStore'
import { useState, useEffect } from 'react'
import axios from 'axios'

 const colors = {
  primary: '#4CAF50',
  secondary: '#FFC107',
  background: '#F5F5F5',
  text: '#333333',
  lightText: '#666666',
  white: '#FFFFFF',
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  unit: string;
  category: string;
  description: string;
  nutrition: string;
}

export default function Home() {
  const { addToCart } = useCartStore()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/product/`)
        setProducts(response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  // Extract unique categories
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
                  <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
                ))}
            </div>
          </section>
        ))}
      </main>
      <MiniCart />
    </div>
  )
}
