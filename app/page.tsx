"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { Product, useApp } from "@/contexts/AppContext";
import { mockProducts, categories, benefits } from "@/lib/mock-data";
import bannerImage from "@/assets/banner.jpg";
import { productAPI } from "@/lib/api/productApi";
import {
  useBestSellerProducts,
  useFeaturedProducts,
} from "@/hooks/productQueries";

export default function HomePage() {
  const { state, dispatch } = useApp();
  const { data: featuredProducts } = useFeaturedProducts();
  const { data: bestSellerProducts } = useBestSellerProducts();

  useEffect(() => {
    dispatch({
      type: "SET_FEATURED_PRODUCTS",
      payload: featuredProducts as Product[],
    });
    dispatch({
      type: "SET_BESTSELLER_PRODUCTS",
      payload: bestSellerProducts as Product[],
    });
  }, [dispatch, featuredProducts, bestSellerProducts]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] bg-gradient-to-r from-gray-900 to-gray-700 flex items-center">
          <div className="absolute inset-0">
            <Image
              src={bannerImage}
              alt="Hero Banner"
              fill
              className="object-cover opacity-50"
            />
          </div>

          <div className="relative container mx-auto px-4 text-white">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Unleash Your Style with
                <span className="text-rose-400 ml-3">KoLaz</span>
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Premium fashion collection with sustainable practices and modern
                designs
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop">
                  <Button
                    size="lg"
                    className="bg-rose-600 hover:bg-rose-700 text-white px-8"
                  >
                    Shop Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/jeans">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-gray-900 px-8 bg-transparent"
                  >
                    Jeans Collection
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Shop by Category
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our curated collections designed for every style and
                occasion
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.name.toLowerCase()}`}
                >
                  <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="relative aspect-square">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h3 className="text-white text-xl font-semibold">
                            {category.name}
                          </h3>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Featured Products
                </h2>
                <p className="text-gray-600">
                  Handpicked items from our latest collection
                </p>
              </div>
              <Link href="/shop">
                <Button
                  variant="outline"
                  className="hidden md:flex bg-transparent"
                >
                  View All
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {state?.featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Best Selling Products */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Best Sellers
              </h2>
              <p className="text-gray-600">Most loved items by our customers</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {state?.bestSellerProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Shop with KoLaz */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Shop with KoLaz
              </h2>
              <p className="text-gray-600">
                Experience the difference with our premium service
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="text-center p-8 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-0">
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-rose-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay in Style
            </h2>
            <p className="text-rose-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new
              arrivals, exclusive offers, and fashion tips
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:outline-none focus:ring-2 focus:ring-rose-300"
                required
                minLength={5}
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 rounded-l-none h-full py-4">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
