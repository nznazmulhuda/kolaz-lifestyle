"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Search, Filter, Edit, Trash2, Eye, Upload, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { ProductCard } from "@/components/product/ProductCard"
import { mockProducts } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/contexts/AppContext"

export default function AdminProductsPage() {
  const [products, setProducts] = useState(mockProducts)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [isEditingProduct, setIsEditingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { toast } = useToast()

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    category: "",
    subcategory: "",
    brand: "KoLaz",
    colors: [] as string[],
    sizes: [] as string[],
    stock: "",
    tags: "",
    isNewArrival: false,
    isBestSeller: false,
    isFeatured: false,
  })

  // Edit product form state
  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    category: "",
    subcategory: "",
    brand: "KoLaz",
    colors: [] as string[],
    sizes: [] as string[],
    stock: "",
    tags: "",
    isNewArrival: false,
    isBestSeller: false,
    isFeatured: false,
  })

  const categories = ["Women", "Men", "Unisex", "Accessories"]
  const subcategories = ["Jeans", "Hoodies", "Dresses", "Shoes", "T-Shirts", "Jackets"]
  const availableColors = ["Black", "White", "Blue", "Red", "Gray", "Navy", "Burgundy", "Green"]
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleColorToggle = (color: string, isEdit = false) => {
    if (isEdit) {
      setEditProduct((prev) => ({
        ...prev,
        colors: prev.colors.includes(color) ? prev.colors.filter((c) => c !== color) : [...prev.colors, color],
      }))
    } else {
      setNewProduct((prev) => ({
        ...prev,
        colors: prev.colors.includes(color) ? prev.colors.filter((c) => c !== color) : [...prev.colors, color],
      }))
    }
  }

  const handleSizeToggle = (size: string, isEdit = false) => {
    if (isEdit) {
      setEditProduct((prev) => ({
        ...prev,
        sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
      }))
    } else {
      setNewProduct((prev) => ({
        ...prev,
        sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const product = {
      id: `product-${Date.now()}`,
      name: newProduct.name,
      description: newProduct.description,
      price: Number(newProduct.price),
      salePrice: newProduct.salePrice ? Number(newProduct.salePrice) : undefined,
      image: "/placeholder.svg?height=400&width=300",
      images: ["/placeholder.svg?height=400&width=300"],
      category: newProduct.category,
      subcategory: newProduct.subcategory,
      brand: newProduct.brand,
      colors: newProduct.colors,
      sizes: newProduct.sizes,
      stock: Number(newProduct.stock),
      isNewArrival: newProduct.isNewArrival,
      isBestSeller: newProduct.isBestSeller,
      isFeatured: newProduct.isFeatured,
      tags: newProduct.tags.split(",").map((tag) => tag.trim()),
    }

    setProducts([...products, product])
    setIsAddingProduct(false)
    setNewProduct({
      name: "",
      description: "",
      price: "",
      salePrice: "",
      category: "",
      subcategory: "",
      brand: "KoLaz",
      colors: [],
      sizes: [],
      stock: "",
      tags: "",
      isNewArrival: false,
      isBestSeller: false,
      isFeatured: false,
    })

    toast({
      title: "Product added successfully!",
      description: "The new product has been added to your catalog.",
    })
  }

  // View Product - Opens in new tab
  const handleViewProduct = (productId: string) => {
    const url = `/product/${productId}`
    window.open(url, "_blank")
  }

  // Edit Product - Opens modal with full form
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setEditProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      salePrice: product.salePrice?.toString() || "",
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      colors: [...product.colors],
      sizes: [...product.sizes],
      stock: product.stock.toString(),
      tags: product.tags.join(", "),
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
      isFeatured: product.isFeatured,
    })
    setIsEditingProduct(true)
  }

  // Delete Product - Shows confirmation dialog
  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId))
    toast({
      title: "Product deleted",
      description: "The product has been removed from your catalog.",
      variant: "destructive",
    })
  }

  // Update Product
  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    const updatedProduct = {
      ...editingProduct,
      name: editProduct.name,
      description: editProduct.description,
      price: Number(editProduct.price),
      salePrice: editProduct.salePrice ? Number(editProduct.salePrice) : undefined,
      category: editProduct.category,
      subcategory: editProduct.subcategory,
      brand: editProduct.brand,
      colors: editProduct.colors,
      sizes: editProduct.sizes,
      stock: Number(editProduct.stock),
      tags: editProduct.tags.split(",").map((tag) => tag.trim()),
      isNewArrival: editProduct.isNewArrival,
      isBestSeller: editProduct.isBestSeller,
      isFeatured: editProduct.isFeatured,
    }

    setProducts(products.map((p) => (p.id === editingProduct.id ? updatedProduct : p)))
    setIsEditingProduct(false)
    setEditingProduct(null)

    toast({
      title: "Product updated successfully!",
      description: "The product details have been saved.",
    })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600 mt-2">Manage your product catalog</p>
            </div>
            <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
              <DialogTrigger asChild>
                <Button className="bg-rose-600 hover:bg-rose-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="media">Media</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Product Name *</Label>
                          <Input
                            id="name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            placeholder="Enter product name"
                            required
                            minLength={3}
                            maxLength={100}
                          />
                        </div>

                        <div>
                          <Label htmlFor="brand">Brand *</Label>
                          <Select
                            value={newProduct.brand}
                            onValueChange={(value) => setNewProduct({ ...newProduct, brand: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="KoLaz">KoLaz</SelectItem>
                              <SelectItem value="Premium">Premium</SelectItem>
                              <SelectItem value="Luxury">Luxury</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          placeholder="Enter product description"
                          rows={4}
                          required
                          minLength={10}
                          maxLength={500}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="price">Regular Price (৳) *</Label>
                          <Input
                            id="price"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            placeholder="0"
                            required
                            min="1"
                            max="100000"
                          />
                        </div>

                        <div>
                          <Label htmlFor="salePrice">Sale Price (৳)</Label>
                          <Input
                            id="salePrice"
                            type="number"
                            value={newProduct.salePrice}
                            onChange={(e) => setNewProduct({ ...newProduct, salePrice: e.target.value })}
                            placeholder="Optional"
                            min="1"
                            max="100000"
                          />
                        </div>

                        <div>
                          <Label htmlFor="stock">Stock Quantity *</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                            placeholder="0"
                            required
                            min="0"
                            max="1000"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <Select
                            value={newProduct.category}
                            onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="subcategory">Subcategory *</Label>
                          <Select
                            value={newProduct.subcategory}
                            onValueChange={(value) => setNewProduct({ ...newProduct, subcategory: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                              {subcategories.map((subcat) => (
                                <SelectItem key={subcat} value={subcat}>
                                  {subcat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Available Colors *</Label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {availableColors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`flex items-center space-x-2 p-2 border rounded ${
                                newProduct.colors.includes(color) ? "border-rose-600 bg-rose-50" : "border-gray-300"
                              }`}
                              onClick={() => handleColorToggle(color)}
                            >
                              <div
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: color.toLowerCase() }}
                              />
                              <span className="text-sm">{color}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Available Sizes *</Label>
                        <div className="grid grid-cols-6 gap-2 mt-2">
                          {availableSizes.map((size) => (
                            <button
                              key={size}
                              type="button"
                              className={`p-2 border rounded text-sm ${
                                newProduct.sizes.includes(size) ? "border-rose-600 bg-rose-50" : "border-gray-300"
                              }`}
                              onClick={() => handleSizeToggle(size)}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input
                          id="tags"
                          value={newProduct.tags}
                          onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })}
                          placeholder="e.g., premium, cotton, comfortable"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="newArrival"
                            checked={newProduct.isNewArrival}
                            onCheckedChange={(checked) => setNewProduct({ ...newProduct, isNewArrival: checked })}
                          />
                          <Label htmlFor="newArrival">Mark as New Arrival</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="bestSeller"
                            checked={newProduct.isBestSeller}
                            onCheckedChange={(checked) => setNewProduct({ ...newProduct, isBestSeller: checked })}
                          />
                          <Label htmlFor="bestSeller">Mark as Best Seller</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="featured"
                            checked={newProduct.isFeatured}
                            onCheckedChange={(checked) => setNewProduct({ ...newProduct, isFeatured: checked })}
                          />
                          <Label htmlFor="featured">Mark as Featured</Label>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="media" className="space-y-4">
                      <div>
                        <Label>Product Images</Label>
                        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">Drag and drop images here, or click to browse</p>
                          <p className="text-sm text-gray-500">Supports: JPG, PNG, WebP (Max 5MB each)</p>
                          <Button type="button" variant="outline" className="mt-4 bg-transparent">
                            Choose Files
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="preview" className="space-y-4">
                      <div>
                        <Label>Product Preview</Label>
                        <div className="mt-4 max-w-sm">
                          {newProduct.name && (
                            <div className="border rounded-lg p-4 bg-white">
                              <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                                <span className="text-gray-400">Product Image</span>
                              </div>
                              <h3 className="font-medium mb-2">{newProduct.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{newProduct.brand}</p>
                              <div className="flex items-center space-x-2">
                                {newProduct.salePrice ? (
                                  <>
                                    <span className="font-semibold">
                                      ৳{Number(newProduct.salePrice).toLocaleString()}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      ৳{Number(newProduct.price).toLocaleString()}
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-semibold">
                                    ৳{Number(newProduct.price || 0).toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {newProduct.isNewArrival && (
                                  <Badge className="bg-rose-600 text-white text-xs">New</Badge>
                                )}
                                {newProduct.isBestSeller && (
                                  <Badge className="bg-gray-900 text-white text-xs">Best Seller</Badge>
                                )}
                                {newProduct.isFeatured && (
                                  <Badge className="bg-blue-600 text-white text-xs">Featured</Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setIsAddingProduct(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
                      Add Product
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} hideQuickAdd={true} />

                {/* Admin Actions Overlay */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col space-y-1">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => handleViewProduct(product.id)}
                      title="View Product"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => handleEditProduct(product)}
                      title="Edit Product"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="destructive" className="h-8 w-8" title="Delete Product">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product "{product.name}" from
                            your catalog.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Product Modal - Matches Add Product UI exactly */}
          <Dialog open={isEditingProduct} onOpenChange={setIsEditingProduct}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleUpdateProduct} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-name">Product Name *</Label>
                        <Input
                          id="edit-name"
                          value={editProduct.name}
                          onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                          placeholder="Enter product name"
                          required
                          minLength={3}
                          maxLength={100}
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit-brand">Brand *</Label>
                        <Select
                          value={editProduct.brand}
                          onValueChange={(value) => setEditProduct({ ...editProduct, brand: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="KoLaz">KoLaz</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                            <SelectItem value="Luxury">Luxury</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="edit-description">Description *</Label>
                      <Textarea
                        id="edit-description"
                        value={editProduct.description}
                        onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                        placeholder="Enter product description"
                        rows={4}
                        required
                        minLength={10}
                        maxLength={500}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="edit-price">Regular Price (৳) *</Label>
                        <Input
                          id="edit-price"
                          type="number"
                          value={editProduct.price}
                          onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                          placeholder="0"
                          required
                          min="1"
                          max="100000"
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit-salePrice">Sale Price (৳)</Label>
                        <Input
                          id="edit-salePrice"
                          type="number"
                          value={editProduct.salePrice}
                          onChange={(e) => setEditProduct({ ...editProduct, salePrice: e.target.value })}
                          placeholder="Optional"
                          min="1"
                          max="100000"
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit-stock">Stock Quantity *</Label>
                        <Input
                          id="edit-stock"
                          type="number"
                          value={editProduct.stock}
                          onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                          placeholder="0"
                          required
                          min="0"
                          max="1000"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-category">Category *</Label>
                        <Select
                          value={editProduct.category}
                          onValueChange={(value) => setEditProduct({ ...editProduct, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="edit-subcategory">Subcategory *</Label>
                        <Select
                          value={editProduct.subcategory}
                          onValueChange={(value) => setEditProduct({ ...editProduct, subcategory: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {subcategories.map((subcat) => (
                              <SelectItem key={subcat} value={subcat}>
                                {subcat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Available Colors *</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {availableColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`flex items-center space-x-2 p-2 border rounded ${
                              editProduct.colors.includes(color) ? "border-rose-600 bg-rose-50" : "border-gray-300"
                            }`}
                            onClick={() => handleColorToggle(color, true)}
                          >
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: color.toLowerCase() }}
                            />
                            <span className="text-sm">{color}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Available Sizes *</Label>
                      <div className="grid grid-cols-6 gap-2 mt-2">
                        {availableSizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            className={`p-2 border rounded text-sm ${
                              editProduct.sizes.includes(size) ? "border-rose-600 bg-rose-50" : "border-gray-300"
                            }`}
                            onClick={() => handleSizeToggle(size, true)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                      <Input
                        id="edit-tags"
                        value={editProduct.tags}
                        onChange={(e) => setEditProduct({ ...editProduct, tags: e.target.value })}
                        placeholder="e.g., premium, cotton, comfortable"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="edit-newArrival"
                          checked={editProduct.isNewArrival}
                          onCheckedChange={(checked) => setEditProduct({ ...editProduct, isNewArrival: checked })}
                        />
                        <Label htmlFor="edit-newArrival">Mark as New Arrival</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="edit-bestSeller"
                          checked={editProduct.isBestSeller}
                          onCheckedChange={(checked) => setEditProduct({ ...editProduct, isBestSeller: checked })}
                        />
                        <Label htmlFor="edit-bestSeller">Mark as Best Seller</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="edit-featured"
                          checked={editProduct.isFeatured}
                          onCheckedChange={(checked) => setEditProduct({ ...editProduct, isFeatured: checked })}
                        />
                        <Label htmlFor="edit-featured">Mark as Featured</Label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-4">
                    <div>
                      <Label>Product Images</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Drag and drop images here, or click to browse</p>
                        <p className="text-sm text-gray-500">Supports: JPG, PNG, WebP (Max 5MB each)</p>
                        <Button type="button" variant="outline" className="mt-4 bg-transparent">
                          Choose Files
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="space-y-4">
                    <div>
                      <Label>Product Preview</Label>
                      <div className="mt-4 max-w-sm">
                        {editProduct.name && (
                          <div className="border rounded-lg p-4 bg-white">
                            <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                              <span className="text-gray-400">Product Image</span>
                            </div>
                            <h3 className="font-medium mb-2">{editProduct.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{editProduct.brand}</p>
                            <div className="flex items-center space-x-2">
                              {editProduct.salePrice ? (
                                <>
                                  <span className="font-semibold">
                                    ৳{Number(editProduct.salePrice).toLocaleString()}
                                  </span>
                                  <span className="text-sm text-gray-500 line-through">
                                    ৳{Number(editProduct.price).toLocaleString()}
                                  </span>
                                </>
                              ) : (
                                <span className="font-semibold">
                                  ৳{Number(editProduct.price || 0).toLocaleString()}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {editProduct.isNewArrival && (
                                <Badge className="bg-rose-600 text-white text-xs">New</Badge>
                              )}
                              {editProduct.isBestSeller && (
                                <Badge className="bg-gray-900 text-white text-xs">Best Seller</Badge>
                              )}
                              {editProduct.isFeatured && (
                                <Badge className="bg-blue-600 text-white text-xs">Featured</Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsEditingProduct(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
                    Update Product
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
