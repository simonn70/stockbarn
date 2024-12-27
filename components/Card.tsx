import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../hook/useAuth"; // Importing the useAuth hook
import useTokenStore from "@/lib/store";
import { useRouter } from "next/navigation";



// interface Product {
//   _id: string; // Use _id here to match the Home component's Product interface
//   name: string;
//   price: number;
//   stock: number;
//   images: string[];
//   unit: string;
//   category: string;
//   description: string;
// }

export function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false); // State to show the login modal
  const { isLoggedIn } = useAuth(); // Using the useAuth hook to check if the user is logged in
  const router = useRouter()
const {setDatas}= useTokenStore()
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
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % product.images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + product.images.length) % product.images.length
    );
  };

  const handleClick = () => {
    setDatas(product)
    router.push("/product")
  }

  return (
    <Card className="w-full overflow-hidden transition-shadow hover:shadow-xl rounded-lg">
      <CardContent className="p-4">
        
          <div  onClick={handleClick} className="relative w-full h-48 mb-4">
            {product.images.length > 0 ? (
              <Image
                src={product.images[currentImageIndex]}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200 rounded-lg">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
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
        
        <p className="text-sm mb-2">{product.unit}</p>
        <p className="text-xl font-bold mb-4">₵{product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-600 mb-2">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
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
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={quantity === 0}
            className={`bg-green-500 text-white ${
              quantity === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">
              You need to log in to add items to your cart
            </h2>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => (window.location.href = "/sign-in")}
                className="bg-blue-500 text-white"
              >
                Go to Login
              </Button>
              <Button
                onClick={() => setShowLoginModal(false)}
                className="bg-gray-300 text-black"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
