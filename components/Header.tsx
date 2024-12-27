import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, LogOut } from "lucide-react"; // Import LogOut icon
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCartStore } from "@/contexts/CardStore";
import useTokenStore from "@/lib/store";

export const colors = {
  primary: "#4CAF50",
  secondary: "#FFC107",
  background: "#F5F5F5",
  text: "#333333",
  lightText: "#666666",
  white: "#FFFFFF",
};

const categories = ["Fruits & Veggies", "Dairy & Eggs", "Bakery", "Meat & Fish", "Pantry"];

export function Header() {
  const cartCount = useCartStore((state) => state.cartCount);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {clearToken,token} = useTokenStore()

  useEffect(() => {
    // Check if there's a token in localStorage
    
    setIsAuthenticated(!!token); // Set the authenticated state based on the presence of a token
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // Remove the token from localStorage on logout
    clearToken()
    setIsAuthenticated(false); // Update the state to reflect the user is logged out
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold" style={{ color: colors.primary }}>
            StockBarns
          </Link>
          {isAuthenticated && <Link href="/my-orders"> <h1 className=" text-gray-500 cursor-pointer">My Orders</h1></Link>}
          <div className="flex items-center space-x-4 lg:hidden">
            <Button variant="ghost" onClick={toggleMenu}>
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
           
          </div>
          <div className=" lg:flex items-center space-x-4">
            {!isAuthenticated ? (
              <div className=" space-x-2">
                <Link href="/sign-in">
                  <Button variant="outline" style={{ borderColor: colors.primary, color: colors.primary }}>
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button style={{ backgroundColor: colors.primary, color: colors.white }}>
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/cart" passHref>
                  <Button variant="outline" className="relative" style={{ borderColor: colors.primary, color: colors.primary }}>
                    <ShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Button onClick={handleLogout} className="hidden sm:block" variant="outline" style={{ borderColor: colors.primary, color: colors.primary }}>
                  <LogOut className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden bg-white shadow-lg rounded-md mt-2 p-4 space-y-4">
            <nav className="flex flex-col space-y-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`#${category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  {category}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col space-y-2">
              {!isAuthenticated ? (
                <>
                  <Link href="/sign-in">
                    <Button variant="outline" style={{ borderColor: colors.primary, color: colors.primary }} className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button style={{ backgroundColor: colors.primary, color: colors.white }} className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                <Button onClick={handleLogout} variant="outline" className="w-full" style={{ borderColor: colors.primary, color: colors.primary }}>
                  Log Out
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
