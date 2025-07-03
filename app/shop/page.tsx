"use client";

import { useState, useEffect } from "react";
import { Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { Product, useApp } from "@/contexts/AppContext";
import { mockProducts } from "@/lib/mock-data";
import { productAPI } from "@/lib/api/productApi";

export default function ShopPage() {
  const { state, dispatch } = useApp();
  const [filteredProducts, setFilteredProducts] = useState<Product[] | []>(
    state.products
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedGender, setSelectedGender] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await productAPI.getAll();
      const colors = await productAPI.getColors();
      const categorys = await productAPI.getCategory();

      dispatch({ type: "SET_PRODUCTS", payload: data });
      dispatch({ type: "SET_COLORS", payload: colors });
      dispatch({ type: "SET_CATEGORYS", payload: categorys });

      setFilteredProducts(data);
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    let filtered = [...state.products];

    // Apply filters
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter((p) =>
        p.colors.some((color) => selectedColors.includes(color))
      );
    }

    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.sizes.some((size) => selectedSizes.includes(size))
      );
    }

    filtered = filtered.filter((p) => {
      const price = p.salePrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)
        );
        break;
      case "newest":
        filtered.sort(
          (a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0)
        );
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [
    selectedCategories,
    selectedColors,
    selectedSizes,
    priceRange,
    selectedGender,
    sortBy,
  ]);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceRange([0, 50000]);
    setSelectedGender([]);
    setFilteredProducts(state.products);
  };

  const activeFiltersCount =
    selectedCategories.length +
    selectedColors.length +
    selectedSizes.length +
    selectedGender.length;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shop All Products
          </h1>
          <p className="text-gray-600">
            Discover our complete collection of premium fashion
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div
            className={`lg:w-64 ${isFilterOpen ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All ({activeFiltersCount})
                  </Button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Category</h3>
                <div className="space-y-2">
                  {state?.categorys?.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategories([
                              ...selectedCategories,
                              category,
                            ]);
                          } else {
                            setSelectedCategories(
                              selectedCategories.filter((c) => c !== category)
                            );
                          }
                        }}
                      />
                      <label
                        htmlFor={category}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50000}
                    min={0}
                    step={100}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>৳{priceRange[0]}</span>
                    <span>৳{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Colors</h3>
                <div className="grid grid-cols-4 gap-2">
                  {state?.colors?.map((color, id) => (
                    <button
                      key={id}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColors.includes(color.name)
                          ? "border-gray-900 ring-2 ring-gray-300"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => {
                        if (selectedColors.includes(color.name)) {
                          setSelectedColors(
                            selectedColors.filter((c) => c !== color.name)
                          );
                        } else {
                          setSelectedColors([...selectedColors, color.name]);
                        }
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Sizes</h3>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`py-2 px-3 text-sm border rounded ${
                        selectedSizes.includes(size)
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() => {
                        if (selectedSizes.includes(size)) {
                          setSelectedSizes(
                            selectedSizes.filter((s) => s !== size)
                          );
                        } else {
                          setSelectedSizes([...selectedSizes, size]);
                        }
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden bg-transparent"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Button>

                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1}-
                  {Math.min(startIndex + itemsPerPage, filteredProducts.length)}{" "}
                  of {filteredProducts.length} products
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* View Mode */}
                <div className="flex border border-gray-300 rounded">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Items per page */}
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => (
                    setCurrentPage(1), setItemsPerPage(Number(value))
                  )}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedCategories(
                        selectedCategories.filter((c) => c !== category)
                      )
                    }
                  >
                    {category} ×
                  </Badge>
                ))}
                {selectedColors.map((color) => (
                  <Badge
                    key={color}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedColors(
                        selectedColors.filter((c) => c !== color)
                      )
                    }
                  >
                    {color} ×
                  </Badge>
                ))}
                {selectedSizes.map((size) => (
                  <Badge
                    key={size}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedSizes(selectedSizes.filter((s) => s !== size))
                    }
                  >
                    {size} ×
                  </Badge>
                ))}
              </div>
            )}

            {/* Products Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
