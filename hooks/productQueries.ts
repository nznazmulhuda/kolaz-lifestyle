import { productAPI } from "@/lib/api/productApi";
import { useQuery } from "@tanstack/react-query";

// ✅ 1. All Products
export const useAllProducts = () =>
  useQuery({
    queryKey: ["products", "all"],
    queryFn: () => productAPI.getAll(),
    staleTime: 1000 * 60 * 5, // 5 min
  });

// ✅ 2. Featured
export const useFeaturedProducts = () =>
  useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productAPI.getFeaturedProducts(),
    staleTime: 1000 * 60 * 10, // 10 min
  });

// ✅ 3. Best Sellers
export const useBestSellerProducts = () =>
  useQuery({
    queryKey: ["products", "best-sellers"],
    queryFn: () => productAPI.getBestSellerProducts(),
    staleTime: 1000 * 60 * 10,
  });

// ✅ 4. Colors
export const useColors = () =>
  useQuery({
    queryKey: ["products", "colors"],
    queryFn: () => productAPI.getColors(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

// ✅ 5. Categories
export const useCategories = () =>
  useQuery({
    queryKey: ["products", "categories"],
    queryFn: () => productAPI.getCategory(),
    staleTime: 1000 * 60 * 60,
  });

// ✅ 6. Product by ID
export const useProductById = (id: string) =>
  useQuery({
    queryKey: ["products", "single", id],
    queryFn: () => productAPI.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

// ✅ 7. Categorywise
export const useProductsByCategory = (category: string) =>
  useQuery({
    queryKey: ["products", "by-category", category],
    queryFn: () => productAPI.getCategoryProduct(category),
    enabled: !!category,
    staleTime: 1000 * 60 * 10,
  });
