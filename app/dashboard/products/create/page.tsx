"use client"

import { useState } from "react";
// import { useRouter } from "next/router";
import axios from "axios";
// import uploadFile from '@/lib/upload'

const page = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>(""); // Number or string to handle empty value
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [nutrition, setNutrition] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const router = useRouter();

  // Function to handle file upload to Cloudinary
  const uploadToCloudinary = async (file: File) => {
    const url = `https://api.cloudinary.com/v1_1/dacotr4pz/auto/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "dev-2-win");
    formData.append("resource_type", "image");

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.secure_url;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Upload images to Cloudinary
      const uploadedImageUrls = await Promise.all(
        images.map(async (image) => await uploadToCloudinary(image))
      );

      console.log(uploadedImageUrls)

      // Prepare the product data to send to the backend
      const productData = {
        name,
        description,
        price,
        unit,
        category,
        images: uploadedImageUrls,
        nutrition,
      };

      // Send product data to the backend using axios
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/product/create`,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Redirect to another page after successful creation
        // router.push("/products"); // Or any other page
      } else {
        setError(response.data.msg || "Error creating product");
      }
    } catch (err) {
      setError("An error occurred while creating the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center">Create a New Product</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="unit">Unit</label>
          <input
            type="text"
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="images">Product Images</label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files || []))}
            required
          />
        </div>

        <div>
          <label htmlFor="nutrition">Nutrition Info</label>
          <textarea
            id="nutrition"
            value={nutrition}
            onChange={(e) => setNutrition(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default page;