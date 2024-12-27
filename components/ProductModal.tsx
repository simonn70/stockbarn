"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import axios from "axios";

// interface Product {
//   id?: number;
//   name: string;
//   price: number;
//   category: string;
//   stock: number;
//   images: string[];
//   description: string;
// }

// interface ProductModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (product: Product) => void;
//   product?: Product | null;
// }

const url = `https://api.cloudinary.com/v1_1/dacotr4pz/auto/upload`;

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "dev-2-win");

  const response = await fetch(url, {
    method: "post",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file to Cloudinary.");
  }

  const responseData = await response.json();
  return responseData.secure_url; // Returning the uploaded file's URL
};

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
}) {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    category: "",
    stock: 0,
    images: [],
    description: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: "",
        price: 0,
        category: "",
        stock: 0,
        images: [],
        description: "",
      });
    }
  }, [product]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    try {
      setUploading(true);
      const uploadedUrls = await Promise.all(
        Array.from(files).map((file) => uploadFile(file))
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      handleFileUpload(files);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "price" || name === "stock" ? parseFloat(value) : value,
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
   const handleEdit = async(e: React.FormEvent) => {
    e.preventDefault();
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/product/${product._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
     );
     if (response) {
       alert("successfully edited")
     }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
             <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              className="w-full border border-gray-300 rounded-md p-2"
              
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          </div>
          <div>
            <Label htmlFor="images">Product Images</Label>
            <Input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              onChange={handleChange}
              multiple
            />
            {uploading && <p>Uploading...</p>}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    width={100}
                    height={100}
                    className="rounded-md w-full h-auto"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0 h-6 w-6"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {product ? <Button  onClick={handleEdit}>Edit</Button> : <Button type="submit">Save</Button>}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
