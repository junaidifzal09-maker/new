"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth"; // assuming you have this hook

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    brand?: string | null;
    image?: string | null;
    weight?: string | null;
    originalPrice: string;
    salePrice: string;
    isValueDeal: boolean;
    isBestseller: boolean;
    isNew: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const addToCart = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      toast.success("Added to cart!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add to cart");
    },
  });

  const salePriceNum = parseFloat(product.salePrice);
  const originalPriceNum = parseFloat(product.originalPrice);
  const discountPercent = originalPriceNum > salePriceNum
    ? Math.round(((originalPriceNum - salePriceNum) / originalPriceNum) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info("Please sign in to add items to cart");
      router.push("/login");
      return;
    }
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}

        {/* Badges - top right stack */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.isValueDeal && (
            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
              VALUE DEAL
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              BESTSELLER
            </span>
          )}
          {product.isNew && (
            <span className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">
              NEW
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercent}%
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {product.brand && (
          <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        )}

        <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {product.weight && (
          <p className="text-xs text-gray-600 mb-2">{product.weight}</p>
        )}

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            €{salePriceNum.toFixed(2)}
          </span>
          {originalPriceNum > salePriceNum && (
            <span className="text-sm text-gray-500 line-through">
              €{originalPriceNum.toFixed(2)}
            </span>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={addToCart.isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          {addToCart.isLoading ? "Adding..." : "Add to Cart"}
          <ShoppingCart className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
