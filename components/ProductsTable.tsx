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
import axios from "axios"

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
  images: string[]
}

export default function ProductsTable() {
  const [products, setProducts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // fetcch

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/product/`)
        setProducts(response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  const handleEdit = async(product: Product) => {
    
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/product/${id}`,
        
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    // Replace this with actual API call
    
    setProducts(products.filter((product) => product._id !== id))
  }

  const handleSave = async (product: Product) => {

    // send request to backend 
    
      // Send product data to the backend using axios
       await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/product/create`,
        product,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    // Replace this with actual API call
   
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
                <TableCell>₵{product.price.toFixed(2)}</TableCell>
                <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product._id)}>
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

