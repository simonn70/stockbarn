import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/contexts/CardStore';
import { useAuth } from '../hook/useAuth'; // Importing the useAuth hook

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

interface Product {
  _id: string; // Use _id here to match the Home component's Product interface
  name: string;
  price: number;
  images: string[];
  unit: string;
  category: string;
  description: string;
  nutrition: string;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false); // State to show the login modal
  const { isLoggedIn } = useAuth(); // Using the useAuth hook to check if the user is logged in

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true); // Show modal if not logged in
      return;
    }
    if (quantity > 0) {
      onAddToCart(product, quantity);
      setQuantity(0);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  return (
    <Card className="w-full overflow-hidden transition-shadow hover:shadow-lg">
      <CardContent className="p-4">
        <Link href={`/product/${product._id}`}> {/* Use _id here */}
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
                  e.preventDefault();
                  prevImage();
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
                  e.preventDefault();
                  nextImage();
                }}
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next image</span>
              </Button>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        </Link>
        <p className="text-sm mb-2">{product.unit}</p>
        <p className="text-xl font-bold mb-4">${product.price.toFixed(2)}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setQuantity(Math.max(0, quantity - 1))}
              disabled={quantity === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={quantity === 0}
            className="bg-green-500 text-white"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl">You need to log in to add items to your cart</h2>
            <Button onClick={() => window.location.href = '/sign-in'}>Go to Login</Button>
            <Button onClick={() => setShowLoginModal(false)}>Close</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
