"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; // adjust path if needed

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const { data: orders = [], isLoading } = trpc.orders.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-lg mb-4">Please sign in to view your orders</p>
          <Button onClick={() => router.push("/login")}>Sign In</Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center max-w-md mx-auto">
          <Package className="h-16 w-16 mx-auto mb-6 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-8">
            When you place your first order, it will appear here.
          </p>
          <Button size="lg" onClick={() => router.push("/products")}>
            Start Shopping
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => {
            const orderDate = new Date(order.createdAt).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            const statusColors: Record<string, string> = {
              pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
              confirmed: "bg-blue-100 text-blue-800 border-blue-300",
              shipped: "bg-purple-100 text-purple-800 border-purple-300",
              delivered: "bg-green-100 text-green-800 border-green-300",
              cancelled: "bg-red-100 text-red-800 border-red-300",
            };

            return (
              <Card key={order.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-bold text-lg">{order.orderNumber}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{orderDate}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-bold text-green-600">€{parseFloat(order.total).toFixed(2)}</p>
                  </div>

                  <div>
                    <span
                      className={`inline-block px-4 py-1 rounded-full text-sm font-medium border ${statusColors[order.status]}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => router.push(`/order/${order.id}`)}
                  >
                    View Details <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                  Shipping to: {order.shippingAddress}, {order.shippingCity} {order.shippingPostalCode}, {order.shippingCountry}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
