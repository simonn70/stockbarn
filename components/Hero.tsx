import { Button } from "@/components/ui/button"
export const colors = {
  primary: '#4CAF50',
  secondary: '#FFC107',
  background: '#F5F5F5',
  text: '#333333',
  lightText: '#666666',
  white: '#FFFFFF',
}



export function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-green-400 to-blue-500 text-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">Fresh Groceries Delivered to Your Door</h1>
        <p className="text-xl mb-8">Get 20% off your first order with code: FRESH20</p>
        <Button
          size="lg"
          style={{ backgroundColor: colors.secondary, color: colors.text }}
        >
          Shop Now
        </Button>
      </div>
    </div>
  )
}

