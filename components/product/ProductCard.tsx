"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/contexts/AppContext";
import { useApp } from "@/contexts/AppContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  hideQuickAdd?: boolean;
}

export function ProductCard({
  product,
  hideQuickAdd = false,
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { dispatch } = useApp();
  const { toast } = useToast();

  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const shareProduct = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const productUrl = `${window.location.origin}/product/${product.id}`;

    try {
      await navigator.clipboard.writeText(productUrl);
      toast({
        title: "Product link copied to clipboard!",
        description: "Share this product with your friends",
      });
    } catch (err) {
      toast({
        title: "Failed to copy link",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const quickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) {
      toast({
        title: "Out of stock",
        description: "This product is currently unavailable",
        variant: "destructive",
      });
      return;
    }

    // Add to cart with default selections (first available color and size)
    const cartItem = {
      id: `${product.id}-${product.sizes[0]}-${product.colors[0].name}`,
      product,
      size: product.sizes[0],
      color: product.colors[0].name,
      quantity: 1,
    };

    dispatch({ type: "ADD_TO_CART", payload: cartItem });
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <div
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNewArrival && (
            <Badge className="bg-rose-600 text-white">New</Badge>
          )}
          {product.isBestSeller && (
            <Badge className="bg-gray-900 text-white">Best Seller</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-green-600 text-white">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div
          className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart
              className={`h-4 w-4 ${
                isLiked ? "fill-rose-600 text-rose-600" : "text-gray-600"
              }`}
            />
          </Button>
        </div>

        {/* Quick Add to Cart - Only show if not hidden */}
        {!hideQuickAdd && (
          <div
            className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            }`}
          >
            <div className="flex space-x-2">
              <Button
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                onClick={quickAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {product.stock === 0 ? "Out of Stock" : "Quick Add"}
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-white/90 hover:bg-white"
                onClick={shareProduct}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Stock Status */}
        {product.stock <= 5 && product.stock > 0 && (
          <div
            className={`absolute top-3 right-3  transition-all duration-300 ${
              isHovered
                ? "translate-y-2 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            <Badge variant="destructive">Only {product.stock} left</Badge>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 hover:text-rose-600 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 mb-2">{product.brand}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {product.salePrice ? (
              <>
                <span className="text-lg font-semibold text-gray-900">
                  ৳{product.salePrice.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ৳{product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold text-gray-900">
                ৳{product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Color Options */}
          <div className="flex space-x-1">
            {product.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 3 && (
              <div className="w-4 h-4 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  +{product.colors.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
