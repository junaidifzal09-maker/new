"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const checkoutSchema = z.object({
  shippingAddress: z.string().min(5, "Address must be at least 5 characters"),
  shippingCity: z.string().min(2, "City is required"),
  shippingPostalCode: z.string().min(2, "Postal code is required"),
  shippingCountry: z.string().min(2, "Country is required"),
  customerEmail: z.string().email("Invalid email"),
  customerPhone: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cartItems = [], isLoading } = trpc.cart.getCart.useQuery();
  const createOrder = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      toast.success("Order placed successfully!");
      router.push(`/order/${data.orderId}`);
    },
    onError: (err) => toast.error(err.message || "Order failed"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { shippingCountry: "France" },
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.salePrice) * item.quantity,
    0
  );
  const shippingCost = subtotal > 35 ? 0 : 5;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingCost + tax;

  const onSubmit = (data: CheckoutForm) => {
    createOrder.mutate(data);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading cart...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-lg mb-4">Your cart is empty</p>
          <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="customerEmail">Email Address</Label>
                  <Input id="customerEmail" {...register("customerEmail")} />
                  {errors.customerEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerEmail.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="customerPhone">Phone Number (optional)</Label>
                  <Input id="customerPhone" {...register("customerPhone")} />
                </div>

                <div>
                  <Label htmlFor="shippingAddress">Street Address</Label>
                  <Input id="shippingAddress" {...register("shippingAddress")} />
                  {errors.shippingAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="shippingCity">City</Label>
                    <Input id="shippingCity" {...register("shippingCity")} />
                    {errors.shippingCity && (
                      <p className="text-red-500 text-sm mt-1">{errors.shippingCity.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="shippingPostalCode">Postal Code</Label>
                    <Input id="shippingPostalCode" {...register("shippingPostalCode")} />
                    {errors.shippingPostalCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.shippingPostalCode.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="shippingCountry">Country</Label>
                    <Input id="shippingCountry" {...register("shippingCountry")} />
                    {errors.shippingCountry && (
                      <p className="text-red-500 text-sm mt-1">{errors.shippingCountry.message}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || createOrder.isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
                >
                  {createOrder.isLoading ? "Placing Order..." : "Place Order"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>€{(parseFloat(item.product.salePrice) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping {subtotal > 35 ? "(Free)" : ""}</span>
                  <span>€{shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>€{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-4">
                  <span>Total</span>
                  <span className="text-green-600">€{total.toFixed(2)}</span>
                </div>
              </div>

              {subtotal <= 35 && (
                <p className="mt-4 text-sm text-blue-600">
                  Add €{(35 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
