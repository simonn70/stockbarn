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
import axios from "axios"

interface Customer {
  id: number
  name: string
  email: string
  totalOrders: number
  totalSpent: number
}

interface Order {
  id: number
  date: string
  total: number
  status: string
}

export default function CustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerOrders, setCustomerOrders] = useState<Order[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

   useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/`)
        setCustomers(response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  const handleViewOrders = async (customer: Customer) => {
    setSelectedCustomer(customer)
    // Simulating API call to fetch customer orders
    const response = await new Promise<Order[]>((resolve) =>
      setTimeout(() => resolve([
        { id: 1, date: "2023-06-01", total: 100.00, status: "Delivered" },
        { id: 2, date: "2023-06-15", total: 150.00, status: "Processing" },
        { id: 3, date: "2023-06-30", total: 200.00, status: "Shipped" },
      ]), 1000)
    )
    setCustomerOrders(response)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Total Orders</TableHead>
              {/* <TableHead className="hidden md:table-cell">Total Spent</TableHead> */}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                {/* <TableCell className="hidden md:table-cell">{customer.totalOrders}</TableCell> */}
                {/* <TableCell className="hidden md:table-cell">${customer.totalSpent.toFixed(2)}</TableCell> */}
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleViewOrders(customer)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Orders
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
            <DialogTitle>{selectedCustomer?.name} Orders</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>{order.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

