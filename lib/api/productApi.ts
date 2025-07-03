import api from "./axiosInstance";

class ProductAPI {
  getAll() {
    return api.get("/products");
  }

  getFeaturedProducts() {
    return api.get("/products?isFeatured=true&limit=8");
  }

  getBestSellerProducts() {
    return api.get("/products?isBestSeller=true&limit=12");
  }

  getById(id: string) {
    return api.get(`/products/${id}`);
  }

  create(data: any) {
    return api.post("/products", data);
  }

  update(id: string, data: any) {
    return api.patch(`/products/${id}`, data);
  }

  delete(id: string) {
    return api.delete(`/products/${id}`);
  }
}

export const productAPI = new ProductAPI();
