import { QueryClient } from "@tanstack/react-query";
import { productAPI } from "./api/productApi";

export const prefetchInitialData = async (queryClient: QueryClient) => {
  await Promise.allSettled([
    // ✅ All products (for shop/all listing)
    queryClient.prefetchQuery({
      queryKey: ["products", "all"],
      queryFn: () => productAPI.getAll(),
    }),

    // ✅ Featured Products (for home page)
    queryClient.prefetchQuery({
      queryKey: ["products", "featured"],
      queryFn: () => productAPI.getFeaturedProducts(),
    }),

    // ✅ Best Sellers (home/landing)
    queryClient.prefetchQuery({
      queryKey: ["products", "best-sellers"],
      queryFn: () => productAPI.getBestSellerProducts(),
    }),

    // ✅ Colors (for filtering, color selector, etc.)
    queryClient.prefetchQuery({
      queryKey: ["products", "colors"],
      queryFn: () => productAPI.getColors(),
    }),

    // ✅ Categories (used in navigation/filtering)
    queryClient.prefetchQuery({
      queryKey: ["products", "categories"],
      queryFn: () => productAPI.getCategory(),
    }),

    // ✅ Preload specific category-wise data (e.g. for homepage sections)
    queryClient.prefetchQuery({
      queryKey: ["products", "by-category", "Jeans"],
      queryFn: () => productAPI.getCategoryProduct("Jeans"),
    }),

    // ✅ Preload related products (can be placeholder category for now)
    queryClient.prefetchQuery({
      queryKey: ["products", "related", "IRT-DJ-001"], // placeholder SKU
      queryFn: () => productAPI.getRelatedProducts("IRT-DJ-001"),
    }),
  ]);
};
