import { ShoppingCart, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useCartStore } from '@/contexts/CardStore'

export const colors = {
  primary: '#4CAF50',
  secondary: '#FFC107',
  background: '#F5F5F5',
  text: '#333333',
  lightText: '#666666',
  white: '#FFFFFF',
}



const categories = ['Fruits & Veggies', 'Dairy & Eggs', 'Bakery', 'Meat & Fish', 'Pantry']

export function Header() {
  const cartCount = useCartStore(state => state.cartCount)

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <Link href="/" className="text-2xl font-bold" style={{ color: colors.primary }}>
            Fresh Groceries
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">
              <Menu className="h-6 w-6" />
            </Button>
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
          </div>
        </div>
        <nav className="flex justify-between items-center overflow-x-auto">
          {categories.map((category) => (
            <Link
              key={category}
              href={`#${category.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium whitespace-nowrap px-3 py-2 rounded-full transition-colors"
              style={{ color: colors.text, backgroundColor: colors.background }}
            >
              {category}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

