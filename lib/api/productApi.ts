// lib/api/ProductAPI.ts

import { Product } from "@/contexts/AppContext";
import api from "./axiosInstance";
import { transformToFrontendProduct } from "@/lib/mappers/productMapper";
import { TDenimProduct } from "@/interfaces/product.interface";

export interface FlatColor {
  hex: string;
  name: string;
}

interface Color {
  color: {
    hex: string;
    name: string;
  }[];
}

class ProductAPI {
  /**
   * Fetch all products and transform to frontend schema
   */
  async getAll(): Promise<Product[]> {
    const res = await api.get<{ data: TDenimProduct[] }>("/products?limit=0");
    return res?.data?.data?.map(transformToFrontendProduct);
  }

  /**
   * Fetch featured products for homepage
   */
  async getFeaturedProducts(): Promise<Product[]> {
    const res = await api.get<{ data: TDenimProduct[] }>(
      "/products?isFeatured=true&limit=8"
    );
    return res?.data?.data?.map(transformToFrontendProduct);
  }

  /**
   * Fetch best seller products
   */
  async getBestSellerProducts(): Promise<Product[]> {
    const res = await api.get<{ data: TDenimProduct[] }>(
      "/products?isBestSeller=true&limit=12"
    );
    return res?.data?.data?.map(transformToFrontendProduct);
  }

  /**
   * Fetch single product by ID
   */
  async getById(id: string): Promise<Product> {
    const res = await api.get<{ data: TDenimProduct }>(`/products/${id}`);
    return transformToFrontendProduct(res?.data?.data);
  }

  /**
   * Get categorywise product
   */
  async getCategoryProduct(category: string) {
    const { data } = await api.get(
      `/products?limit=40&category.main=${category}`
    );

    return data?.data?.map(transformToFrontendProduct);
  }

  /**
   * Get related data
   */
  async getRelatedProducts(category: string) {
    const { data } = await api.get(
      `/products?limit=4&category.main=${category}`
    );

    return data.data.map(transformToFrontendProduct);
  }

  /**
   * Create new product (admin panel)
   */
  async create(data: any) {
    return await api.post("/products", data);
  }

  /**
   * Update product by ID (admin panel)
   */
  async update(id: string, data: any) {
    return await api.patch(`/products/${id}`, data);
  }

  /**
   * Delete product by ID (admin panel)
   */
  async delete(id: string) {
    return await api.delete(`/products/${id}`);
  }

  /**
   * Get all color data
   */
  async getColors(): Promise<FlatColor[]> {
    const { data } = await api.get(`/products?fields=color.name,color.hex`);

    const rawColors: Color[] = data?.data;

    const seen = new Set<string>();

    const uniqueColors = rawColors
      .flatMap((item) => item.color) // Flatten nested array
      .filter((c) => {
        const key = `${c.hex.toLowerCase()}|${c.name.toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name)); // optional sort by name

    return uniqueColors;
  }

  /**
   * Get category data
   */

  async getCategory(): Promise<string[]> {
    const res = await api.get(`/products?fields=category.main`);
    const data: { category: { main: string } }[] = res?.data?.data || [];

    const seen = new Set<string>();

    const uniqueCategories = data
      .map((item: { category: { main: string } }) => item.category.main)
      .filter((cat) => {
        if (seen.has(cat)) return false;
        seen.add(cat);
        return true;
      });

    return uniqueCategories;
  }
}

export const productAPI = new ProductAPI();
