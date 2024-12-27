'use client'

import { useState } from 'react'


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
 const colors = {
  primary: '#4CAF50',
  secondary: '#FFC107',
  background: '#F5F5F5',
  text: '#333333',
  lightText: '#666666',
  white: '#FFFFFF',
}


import { Plus, Minus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/contexts/CardStore'
import { Header } from '@/components/Header'
import axios from 'axios'
import useTokenStore from '@/lib/store'


export default function CartPage() {
  // const router = useRouter()
  const { cartItems, addToCart, removeFromCart } = useCartStore()
  const {token} = useTokenStore()
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
  })
// const token = localStorage.getItem('token');
  const updateQuantity = (id: number, newQuantity: number) => {
    const item = cartItems.find(item => item.id === id)
    if (item) {
      if (newQuantity > item.quantity) {
        addToCart(item, newQuantity - item.quantity)
      } else if (newQuantity < item.quantity) {
        for (let i = 0; i < item.quantity - newQuantity; i++) {
          removeFromCart(id)
        }
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserDetails(prev => ({ ...prev, [name]: value }))
  }

 
const handleCheckout = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // Gather data for the order
    const data = {
      products: cartItems,
      email: userDetails.email,
      contactNumber: userDetails.zipCode,
      paymentMethod: "card",
      deliveryLocation:userDetails.address
    };
    
    // Retrieve the token
    
    if (!token) {
      throw new Error('User not authenticated. Please log in.');
    }

    // Send the order to the backend
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/create`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      }
    );

    // Extract the Paystack URL from the response
  
    if (response.data) {
    window.location.href = response.data.paymentUrl
   }

    // Route to the Paystack payment URL
    // window.location.href = response.data.paystactUrl; // Redirects to the Paystack payment page
  } catch (error) {
    console.error('Error during checkout:', error);
    alert('Something went wrong. Please try again.');
  }
};

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Header />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8" style={{ color: colors.text }}>Your Cart</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cartItems.length === 0 ? (
              <p className="text-center" style={{ color: colors.lightText }}>Your cart is empty</p>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {cartItems.map(item => (
                    <div key={item._id} className="flex items-center justify-between py-4 border-b">
                      <div className="flex items-center">
                        <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                        <div>
                          <h3 className="font-semibold" style={{ color: colors.text }}>{item.name}</h3>
                          <p style={{ color: colors.lightText }}>₵{item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          style={{ borderColor: colors.primary, color: colors.primary }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ borderColor: colors.primary, color: colors.primary }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item._id)}
                          className="ml-4"
                        >
                          <Trash2 className="h-4 w-4" style={{ color: colors.primary }} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between items-center w-full">
                    <span className="font-semibold" style={{ color: colors.text }}>Total:</span>
                    <span className="font-bold text-xl" style={{ color: colors.primary }}>₵{total.toFixed(2)}</span>
                  </div>
                </CardFooter>
              </Card>
            )}
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Checkout</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckout}>
                  <div className="space-y-4">
                    {/* <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" value={userDetails.name} onChange={handleInputChange} required />
                    </div> */}
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={userDetails.email} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="address">Delvery Address</Label>
                      <Input id="address" name="address" value={userDetails.address} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" value={userDetails.city} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Phone Number</Label>
                      <Input id="zipCode" name="zipCode" value={userDetails.zipCode} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-6" style={{ backgroundColor: colors.primary, color: colors.white }}>
                    Place Order
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

