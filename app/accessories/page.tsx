"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ProductCard } from "@/components/product/ProductCard"
import { useApp } from "@/contexts/AppContext"
import { mockProducts } from "@/lib/mock-data"

export default function AccessoriesPage() {
  const { dispatch } = useApp()
  const [products, setProducts] = useState(mockProducts.filter((p) => p.category === "Accessories"))

  useEffect(() => {
    dispatch({ type: "SET_PRODUCTS", payload: mockProducts })
  }, [dispatch])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accessories</h1>
          <p className="text-gray-600">Complete your look with our accessories</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
