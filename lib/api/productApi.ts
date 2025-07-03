// lib/api/ProductAPI.ts

import { Product } from "@/contexts/AppContext";
import api from "./axiosInstance";
import { transformToFrontendProduct } from "@/lib/mappers/productMapper";
import { TDenimProduct } from "@/interfaces/product.interface";

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
}

export const productAPI = new ProductAPI();
