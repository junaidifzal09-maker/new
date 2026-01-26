"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth"; // adjust if your auth hook is different
import Image from "next/image";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);

  const { data: product, isLoading, error } = trpc.products.getById.useQuery(productId);
  const addToCart = trpc.cart.addItem.useMutation({
    onSuccess: () => toast.success("Added to cart!"),
    onError: (err) => toast.error(err.message || "Failed to add item"),
  });

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    const newQty = Math.max(1, quantity + delta);
    setQuantity(newQty);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart.mutate({ productId: product.id, quantity });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const salePrice = parseFloat(product.salePrice);
  const originalPrice = parseFloat(product.originalPrice);
  const discountPercent = originalPrice > salePrice
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                No image available
              </div>
            )}

            {/* Badges overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {product.isValueDeal && (
                <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  VALUE DEAL
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  BESTSELLER
                </span>
              )}
              {product.isNew && (
                <span className="bg-orange-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  NEW
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {product.brand && (
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
            )}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

            {product.weight && (
              <p className="text-lg text-gray-600 mb-6">{product.weight}</p>
            )}

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl md:text-5xl font-bold text-gray-900">
                €{salePrice.toFixed(2)}
              </span>
              {originalPrice > salePrice && (
                <span className="text-xl text-gray-500 line-through">
                  €{originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={addToCart.isLoading || !product.stock}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
              >
                {addToCart.isLoading ? "Adding..." : "Add to Cart"}
                <ShoppingCart className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose max-w-none mb-8">
                <h3 className="text-xl font-semibold mb-3">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}

            {/* Stock indicator */}
            {product.stock <= 10 && product.stock > 0 && (
              <p className="text-orange-600 font-medium mb-6">
                Only {product.stock} left in stock — order soon!
              </p>
            )}
            {product.stock === 0 && (
              <p className="text-red-600 font-medium mb-6">Out of stock</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
