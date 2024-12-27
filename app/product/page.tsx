'use client'

import { useState} from 'react'


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
 const colors = {
  primary: '#4CAF50',
  secondary: '#FFC107',
  background: '#F5F5F5',
  text: '#333333',
  lightText: '#666666',
  white: '#FFFFFF',
}


import Image from 'next/image'
import {  Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Header } from '@/components/Header'
import { useCartStore } from '@/contexts/CardStore'
import useTokenStore from '@/lib/store'



// const products = [
//   { 
//     id: 1, 
//     name: 'Organic Apples', 
//     price: 1.99, 
//     images: [
//       '/placeholder.svg?height=400&width=400&text=Apple+1',
//       '/placeholder.svg?height=400&width=400&text=Apple+2',
//       '/placeholder.svg?height=400&width=400&text=Apple+3'
//     ],
//     unit: 'per lb', 
//     category: 'Fruits & Veggies',
//     description: 'Fresh, crisp organic apples. Perfect for snacking, baking, or adding to your favorite recipes.',
//     nutrition: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 }
//   },
//   { 
//     id: 2, 
//     name: 'Ripe Bananas', 
//     price: 0.99, 
//     images: [
//       '/placeholder.svg?height=400&width=400&text=Banana+1',
//       '/placeholder.svg?height=400&width=400&text=Banana+2',
//       '/placeholder.svg?height=400&width=400&text=Banana+3'
//     ],
//     unit: 'per lb', 
//     category: 'Fruits & Veggies',
//     description: 'Sweet and creamy bananas, rich in potassium and perfect for smoothies or as a quick snack.',
//     nutrition: { calories: 105, protein: 1.3, carbs: 27, fat: 0.3 }
//   },
//   { 
//     id: 3, 
//     name: 'Fresh Milk', 
//     price: 2.49, 
//     images: [
//       '/placeholder.svg?height=400&width=400&text=Milk+1',
//       '/placeholder.svg?height=400&width=400&text=Milk+2',
//       '/placeholder.svg?height=400&width=400&text=Milk+3'
//     ],
//     unit: 'per gallon', 
//     category: 'Dairy & Eggs',
//     description: 'Creamy, farm-fresh milk. Rich in calcium and perfect for drinking, cooking, or baking.',
//     nutrition: { calories: 103, protein: 8, carbs: 12, fat: 2.4 }
//   },
// ]


export default function ProductPage() {
  const {product}= useTokenStore()
  // const params = useParams()

// Use `datas` if available, otherwise fall back to `defaultProduct`
// const [product] = useState<Product>(datas );
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addToCart } = useCartStore()

 
  // if (!product) {
  //   return <div>Product not found</div>
  // }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      console.log(`Added ${quantity} ${product.name} to cart`)
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Header />
      <main className="container mx-auto py-8 px-4">
        <Card className="md:flex">
          <div className="md:w-1/2">
            <div className="relative">
              <Image
                src={product?.images[currentImageIndex]}
                alt={`${product?.name} - Image ${currentImageIndex + 1}`}
                width={400}
                height={400}
                layout="responsive"
                className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
              />
              <div className="absolute inset-0 flex items-center justify-between">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white bg-black bg-opacity-50 hover:bg-opacity-75"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                  <span className="sr-only">Previous image</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white bg-black bg-opacity-50 hover:bg-opacity-75"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                  <span className="sr-only">Next image</span>
                </Button>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              {product?.images?.map((image, index) => (
                <button
                  key={index}
                  className={`w-16 h-16 mx-1 rounded-md overflow-hidden ${
                  index === currentImageIndex ? 'border-2 border-primary' : 'border-2 border-transparent'
                }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`${product?.name} - Thumbnail ${index + 1}`}
                    width={64}
                    height={64}
                    objectFit="cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <CardContent className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>{product?.name}</h1>
            <p className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>₵{product?.price?.toFixed(2)} {product?.unit}</p>
            {/* <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" style={{ color: colors.secondary }} />
              ))}
              <span className="ml-2" style={{ color: colors.lightText }}>4.5 (123 reviews)</span>
            </div> */}
            <p className="mb-4" style={{ color: colors.text }}>{product?.description}</p>
            {/*  */}
            <div className="flex items-center mb-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ borderColor: colors.primary, color: colors.primary }}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-4 text-xl" style={{ color: colors.text }}>{quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuantity(quantity + 1)}
                style={{ borderColor: colors.primary, color: colors.primary }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="p-6">
            <Button 
              className="w-full" 
              onClick={handleAddToCart}
              style={{ backgroundColor: colors.primary, color: colors.white }}
            >
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

