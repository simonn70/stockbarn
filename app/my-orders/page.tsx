"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { Header } from "@/components/Header"

interface Order {
  id: number
  customerName: string
  date: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered"
  items: OrderItem[]
}

interface OrderItem {
  id: number
  name: string
  quantity: number
  price: number
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<any>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
const token = localStorage.getItem('token');
   useEffect(() => {
    const fetchProducts = async () => {
      try {
         const response = await axios.get(
  `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/customers`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
        setOrders(response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const getStatusBadge = (status: Order['status']) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
    }
    return <Badge className={statusStyles[status]}>{status}</Badge>
  }

  return (
      <div className="space-y-4">
          <Header/>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">My Orders</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              {/* <TableHead>Total</TableHead> */}
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order._id}</TableCell>
                <TableCell>{order.customer.name}</TableCell>
                <TableCell className="hidden md:table-cell">{order.createdAt}</TableCell>
                {/* <TableCell>${order.total.toFixed(2)}</TableCell> */}
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Order ID:</p>
                  <p>{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="font-semibold">Customer:</p>
                  <p>{selectedOrder.customer.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Date:</p>
                  <p>{selectedOrder.cratedAt}</p>
                </div>
                <div>
                  <p className="font-semibold">Status:</p>
                  <p>{getStatusBadge(selectedOrder.status)}</p>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder.products.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₵{item?.product.price?.toFixed(2)}</TableCell>
                      <TableCell> ₵{(item.quantity * item.product.price)?.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-right">
                <p className="font-semibold">Total: ${selectedOrder?.total?.toFixed(2)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

