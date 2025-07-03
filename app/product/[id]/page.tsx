"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Heart, Share2, Minus, Plus, ShoppingBag, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ProductCard } from "@/components/product/ProductCard"
import { useApp } from "@/contexts/AppContext"
import { mockProducts } from "@/lib/mock-data"
import type { Product } from "@/contexts/AppContext"

export default function ProductPage() {
  const params = useParams()
  const { dispatch } = useApp()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState("")

  useEffect(() => {
    const foundProduct = mockProducts.find((p) => p.id === params.id)
    if (foundProduct) {
      setProduct(foundProduct)
      setSelectedColor(foundProduct.colors[0])
      setSelectedSize(foundProduct.sizes[0])
    }
  }, [params.id])

  if (!product) {
    return <div>Loading...</div>
  }

  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  const relatedProducts = mockProducts.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)

  const addToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select size and color",
        variant: "destructive",
      })
      return
    }

    const cartItem = {
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      product,
      size: selectedSize,
      color: selectedColor,
      quantity,
    }

    dispatch({ type: "ADD_TO_CART", payload: cartItem })
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const shareProduct = async () => {
    const productUrl = `${window.location.origin}/product/${product.id}`

    try {
      await navigator.clipboard.writeText(productUrl)
      toast({
        title: "Product link copied to clipboard!",
        description: "Share this product with your friends",
      })
    } catch (err) {
      toast({
        title: "Failed to copy link",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleReviewSubmit = () => {
    if (reviewRating === 0) {
      toast({
        title: "Please select a rating",
        variant: "destructive",
      })
      return
    }

    if (reviewText.trim().length < 10) {
      toast({
        title: "Please write a detailed review",
        description: "Review must be at least 10 characters long",
        variant: "destructive",
      })
      return
    }

    // Simulate review submission
    toast({
      title: "Thank you for your feedback!",
      description: "Your review has been submitted and will be published soon.",
    })

    // Reset form and close modal
    setReviewRating(0)
    setReviewText("")
    setIsReviewModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() =>
                      setSelectedImage(selectedImage === 0 ? product.images.length - 1 : selectedImage - 1)
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() =>
                      setSelectedImage(selectedImage === product.images.length - 1 ? 0 : selectedImage + 1)
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNewArrival && <Badge className="bg-rose-600 text-white">New Arrival</Badge>}
                {discountPercentage > 0 && (
                  <Badge className="bg-green-600 text-white">-{discountPercentage}% OFF</Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                      selectedImage === index ? "border-rose-600" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.brand}</p>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-4">
                {product.salePrice ? (
                  <>
                    <span className="text-3xl font-bold text-gray-900">৳{product.salePrice.toLocaleString()}</span>
                    <span className="text-xl text-gray-500 line-through">৳{product.price.toLocaleString()}</span>
                    <Badge className="bg-green-600 text-white">
                      Save ৳{(product.price - product.salePrice).toLocaleString()}
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">৳{product.price.toLocaleString()}</span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.8) • 124 reviews</span>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-medium mb-3">Color: {selectedColor}</h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color ? "border-gray-900 ring-2 ring-gray-300" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Size: {selectedSize}</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-sm text-rose-600 p-0">
                      Size Guide
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Size Guide</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">Please refer to our size chart below:</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Size</th>
                              <th className="text-left py-2">Chest (inches)</th>
                              <th className="text-left py-2">Waist (inches)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-2">XS</td>
                              <td className="py-2">32-34</td>
                              <td className="py-2">26-28</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">S</td>
                              <td className="py-2">34-36</td>
                              <td className="py-2">28-30</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">M</td>
                              <td className="py-2">36-38</td>
                              <td className="py-2">30-32</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">L</td>
                              <td className="py-2">38-40</td>
                              <td className="py-2">32-34</td>
                            </tr>
                            <tr>
                              <td className="py-2">XL</td>
                              <td className="py-2">40-42</td>
                              <td className="py-2">34-36</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`py-3 px-4 text-sm border rounded-md transition-colors ${
                      selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3"
                onClick={addToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>

              <div className="flex space-x-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsLiked(!isLiked)}>
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-rose-600 text-rose-600" : ""}`} />
                  {isLiked ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={shareProduct}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6">
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Free shipping on orders over ৳2000</li>
                <li>• 30-day easy returns</li>
                <li>• Authentic products guaranteed</li>
                <li>• Secure payment options</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="care">Care Instructions</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="reviews">Reviews (124)</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
                <h4 className="font-semibold mb-2">Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Premium quality materials</li>
                  <li>Comfortable fit for all-day wear</li>
                  <li>Durable construction</li>
                  <li>Easy to care for</li>
                </ul>
                <h4 className="font-semibold mt-4 mb-2">Materials:</h4>
                <p className="text-gray-700">Made from sustainable and high-quality materials sourced responsibly.</p>
              </div>
            </TabsContent>

            <TabsContent value="care" className="mt-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Care Instructions:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Machine wash cold with like colors</li>
                  <li>Do not bleach</li>
                  <li>Tumble dry low heat</li>
                  <li>Iron on low temperature if needed</li>
                  <li>Do not dry clean</li>
                </ul>
                <p className="text-sm text-gray-600 mt-4">
                  Following these care instructions will help maintain the quality and longevity of your garment.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Shipping Information:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-2">Standard Delivery</h5>
                    <p className="text-gray-700 text-sm">3-5 business days</p>
                    <p className="text-gray-700 text-sm">৳60 (Free on orders over ৳2000)</p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Express Delivery</h5>
                    <p className="text-gray-700 text-sm">1-2 business days</p>
                    <p className="text-gray-700 text-sm">৳120</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Orders placed before 2 PM are processed the same day. Weekend orders are processed on Monday.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">4.8 out of 5</span>
                    <span className="text-gray-600">(124 reviews)</span>
                  </div>
                  <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Write a Review</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Write a Review</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Rating *</Label>
                          <div className="flex items-center space-x-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`h-6 w-6 transition-colors ${
                                    star <= reviewRating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300 hover:text-yellow-400"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="review-text" className="text-sm font-medium">
                            Your Review *
                          </Label>
                          <Textarea
                            id="review-text"
                            placeholder="Share your experience with this product..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={4}
                            className="mt-2"
                          />
                          <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                          <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleReviewSubmit} className="bg-rose-600 hover:bg-rose-700">
                            Submit Review
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b pb-6">
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="font-medium">Sarah M.</span>
                        <span className="text-sm text-gray-600">Verified Purchase</span>
                      </div>
                      <p className="text-gray-700 mb-2">
                        "Amazing quality and perfect fit! The material feels premium and the color is exactly as shown.
                        Highly recommend!"
                      </p>
                      <p className="text-sm text-gray-600">Posted 2 weeks ago</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
