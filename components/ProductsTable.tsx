"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Trash } from 'lucide-react'
import { useState, useEffect } from "react"
import ProductModal from "./ProductModal"
import Image from "next/image"

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
  images: string[]
}

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    // Simulating API call
    const fetchProducts = async () => {
      // Replace this with actual API call
      const response = await new Promise<Product[]>((resolve) =>
        setTimeout(() => resolve([
          { id: 1, name: "Product 1", price: 19.99, category: "Category A", stock: 100, images: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"] },
          { id: 2, name: "Product 2", price: 29.99, category: "Category B", stock: 50, images: ["/placeholder.svg?height=100&width=100"] },
          { id: 3, name: "Product 3", price: 39.99, category: "Category A", stock: 75, images: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"] },
        ]), 1000)
      )
      setProducts(response)
    }

    fetchProducts()
  }, [])

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    // Replace this with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setProducts(products.filter((product) => product.id !== id))
  }

  const handleSave = async (product: Product) => {
    // Replace this with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (product.id) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)))
    } else {
      setProducts([...products, { ...product, id: Date.now() }])
    }
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add Product</Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Images</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex space-x-2">
                    {product.images.slice(0, 2).map((image, index) => (
                      <Image key={index} src={image} alt={`${product.name} - Image ${index + 1}`} width={50} height={50} className="rounded-md" />
                    ))}
                    {product.images.length > 2 && (
                      <div className="w-[50px] h-[50px] bg-gray-200 rounded-md flex items-center justify-center text-sm font-medium">
                        +{product.images.length - 2}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProduct(null)
        }}
        onSave={handleSave}
        product={editingProduct}
      />
    </div>
  )
}

