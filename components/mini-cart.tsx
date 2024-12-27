import { ShoppingCart, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '../hook/useAuth'; // Importing the useAuth hook
import Link from 'next/link';
import { useCartStore } from '@/contexts/CardStore';
import { useState } from 'react';

export const colors = {
  primary: '#4CAF50',
  secondary: '#FFC107',
  background: '#F5F5F5',
  text: '#333333',
  lightText: '#666666',
  white: '#FFFFFF',
};

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
// }

export function MiniCart() {
  const { cartItems, removeFromCart } = useCartStore();
  const { isLoggedIn } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false); // State to track if the cart is expanded

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const toggleCart = () => setIsExpanded((prev) => !prev);

  if (!isLoggedIn) {
    return (
      <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold">You need to log in to view your cart</h3>
        <Button onClick={() => (window.location.href = '/sign-in')}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg"
      style={{ borderColor: colors.primary, borderWidth: '2px' }}
    >
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <ShoppingCart className="h-6 w-6 mr-2" style={{ color: colors.primary }} />
          <h3 className="text-lg font-semibold" style={{ color: colors.primary }}>
            Your Cart
          </h3>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleCart}>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" style={{ color: colors.primary }} />
          ) : (
            <ChevronDown className="h-4 w-4" style={{ color: colors.primary }} />
          )}
        </Button>
      </div>
      {isExpanded && (
        <div className="p-4">
          {cartItems.length === 0 ? (
            <p className="text-center" style={{ color: colors.lightText }}>
              Your cart is empty
            </p>
          ) : (
            <>
              <ul className="max-h-60 overflow-auto mb-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium" style={{ color: colors.text }}>
                        {item.name}
                      </p>
                      <p className="text-sm" style={{ color: colors.lightText }}>
                        {item.quantity} x ₵{item.price.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="h-4 w-4" style={{ color: colors.primary }} />
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold" style={{ color: colors.text }}>
                  Total:
                </p>
                <p className="font-bold" style={{ color: colors.primary }}>
                  ₵{total.toFixed(2)}
                </p>
              </div>
              <Link href="/cart" passHref>
                <Button
                  className="w-full"
                  style={{ backgroundColor: colors.primary, color: colors.white }}
                >
                  View Cart & Checkout
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
