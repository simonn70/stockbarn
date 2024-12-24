'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/contexts/CardStore'
export const colors = {
  primary: '#4CAF50',
  secondary: '#FFC107',
  background: '#F5F5F5',
  text: '#333333',
  lightText: '#666666',
  white: '#FFFFFF',
}




export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleAddToCart = () => {
    if (quantity > 0) {
      onAddToCart(product, quantity)
      setQuantity(0)
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length)
  }

  return (
    <Card className="w-full overflow-hidden transition-shadow hover:shadow-lg">
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <div className="relative w-full h-48 mb-4">
            <Image
              src={product.images[currentImageIndex]}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
            <div className="absolute inset-0 flex items-center justify-between">
              <Button
                size="sm"
                variant="ghost"
                className="text-white bg-black bg-opacity-50 hover:bg-opacity-75"
                onClick={(e) => {
                  e.preventDefault()
                  prevImage()
                }}
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous image</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white bg-black bg-opacity-50 hover:bg-opacity-75"
                onClick={(e) => {
                  e.preventDefault()
                  nextImage()
                }}
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next image</span>
              </Button>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>{product.name}</h3>
        </Link>
        <p className="text-sm mb-2" style={{ color: colors.lightText }}>{product.unit}</p>
        <p className="text-xl font-bold mb-4" style={{ color: colors.primary }}>${product.price.toFixed(2)}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setQuantity(Math.max(0, quantity - 1))}
              disabled={quantity === 0}
              style={{ borderColor: colors.primary, color: colors.primary }}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setQuantity(quantity + 1)}
              style={{ borderColor: colors.primary, color: colors.primary }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={quantity === 0}
            style={{ backgroundColor: colors.primary, color: colors.white }}
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

