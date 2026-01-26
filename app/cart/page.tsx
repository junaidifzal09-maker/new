"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth"; // adjust if your auth hook path is different

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const { data: cartItems = [], isLoading, refetch } = trpc.cart.getCart.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const removeItem = trpc.cart.removeItem.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Item removed from cart");
    },
    onError: () => toast.error("Failed to remove item"),
  });

  const updateQuantity = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => refetch(),
    onError: () => toast.error("Failed to update quantity"),
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-lg mb-4">Please sign in to view your cart</p>
          <Button onClick={() => router.push("/login")}>Sign In</Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center max-w-md mx-auto">
          <ShoppingCart className="h-16 w-16 mx-auto mb-6 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything yet. Start shopping!
          </p>
          <Button size="lg" onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </Card>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.salePrice) * item.quantity,
    0
  );
  const shippingCost = subtotal > 35 ? 0 : 5;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingCost + tax;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <p className="text-gray-600">{cartItems.length} items</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const product = item.product;
              const itemTotal = parseFloat(product.salePrice) * item.quantity;

              return (
                <Card key={item.id} className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      {product.brand && <p className="text-sm text-gray-500 mb-1">{product.brand}</p>}
                      {product.weight && <p className="text-sm text-gray-600 mb-3">{product.weight}</p>}

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity.mutate({
                                cartItemId: item.id,
                                quantity: Math.max(1, item.quantity - 1),
                              })
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity.mutate({
                                cartItemId: item.id,
                                quantity: item.quantity + 1,
                              })
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right flex-1">
                          <p className="font-bold text-lg">
                            €{itemTotal.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            €{parseFloat(product.salePrice).toFixed(2)} each
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem.mutate(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Shipping {subtotal > 35 ? "(Free)" : ""}
                  </span>
                  <span>€{shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>€{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-4">
                  <span>Total</span>
                  <span className="text-green-600">€{total.toFixed(2)}</span>
                </div>
              </div>

              {subtotal <= 35 && (
                <p className="text-sm text-blue-600 mb-6">
                  Add €{(35 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}

              <Button
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white mb-4"
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/products")}
              >
                Continue Shopping
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
