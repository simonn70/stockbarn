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
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Simulating API call to fetch orders
    const fetchOrders = async () => {
      // Replace this with actual API call
      const response = await new Promise<Order[]>((resolve) =>
        setTimeout(() => resolve([
          { id: 1, customerName: "John Doe", date: "2023-06-01", total: 100.00, status: "delivered", items: [
            { id: 1, name: "Product A", quantity: 2, price: 25.00 },
            { id: 2, name: "Product B", quantity: 1, price: 50.00 },
          ] },
          { id: 2, customerName: "Jane Smith", date: "2023-06-15", total: 150.00, status: "processing", items: [
            { id: 3, name: "Product C", quantity: 3, price: 50.00 },
          ] },
          { id: 3, customerName: "Bob Johnson", date: "2023-06-30", total: 200.00, status: "shipped", items: [
            { id: 4, name: "Product D", quantity: 1, price: 100.00 },
            { id: 5, name: "Product E", quantity: 2, price: 50.00 },
          ] },
        ]), 1000)
      )
      setOrders(response)
    }

    fetchOrders()
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
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
                  <p>{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="font-semibold">Customer:</p>
                  <p>{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="font-semibold">Date:</p>
                  <p>{selectedOrder.date}</p>
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
                  {selectedOrder.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-right">
                <p className="font-semibold">Total: ${selectedOrder.total.toFixed(2)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

