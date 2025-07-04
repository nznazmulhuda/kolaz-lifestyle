import { Product } from "@/contexts/AppContext";
import { TDenimProduct } from "@/interfaces/product.interface";

export const transformToFrontendProduct = (product: TDenimProduct): Product => {
  return {
    id: product.sku,
    name: product.name,
    price: product.pricing.basePrice,
    salePrice: product.pricing.salePrice,
    image: product.media.coverImage,
    images: product.media.images,
    category: product.category.main,
    subcategory: product.category.subCategories?.[0] || "",
    brand: product.brand.name,
    colors: product.color.map((c) => ({ name: c.name, hex: c.hex })),
    sizes: product.sizes.map((s) => s.size),
    stock: product.stock,
    isNewArrival: product.isNewArrival,
    isBestSeller: product.isBestSeller,
    isFeatured: product.isFeatured,
    description: product.description,
    rating: product.rating.average,
    review: product.rating.count,
    tags: [
      ...(product.tags.style || []),
      ...(product.tags.occasion || []),
      ...(product.tags.features || []),
    ],
  };
};
