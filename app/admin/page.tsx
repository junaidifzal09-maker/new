"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, DollarSign, ShoppingCart, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; // adjust path if needed
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Only allow admins
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            This area is for administrators only.
          </p>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </Card>
      </div>
    );
  }

  const { data: stats, isLoading } = trpc.admin.getStats.useQuery(); // we'll add this procedure later
  const { data: recentOrders = [] } = trpc.orders.listRecent.useQuery({ limit: 5 });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || "Admin"}</p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-3xl font-bold">{stats?.totalProducts ?? 0}</p>
              </div>
              <Package className="h-10 w-10 text-green-600 opacity-80" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-3xl font-bold">{stats?.totalOrders ?? 0}</p>
              </div>
              <ShoppingCart className="h-10 w-10 text-blue-600 opacity-80" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(stats?.totalRevenue ?? 0)}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-green-600 opacity-80" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-3xl font-bold">{stats?.activeUsers ?? 0}</p>
              </div>
              <Users className="h-10 w-10 text-purple-600 opacity-80" />
            </div>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Recent Orders</h2>
            <Button variant="outline" size="sm" asChild>
              <a href="/admin/orders">View All Orders</a>
            </Button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No recent orders</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Order #</th>
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Total</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium">{order.orderNumber}</td>
                      <td className="py-4 px-4">{order.customerEmail}</td>
                      <td className="py-4 px-4 font-medium">
                        €{parseFloat(order.total).toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "shipped"
                              ? "bg-purple-100 text-purple-800"
                              : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/admin/order/${order.id}`}>View</a>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Package className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-semibold mb-2">Manage Products</h3>
            <p className="text-gray-600 mb-4">Add, edit or remove products</p>
            <Button variant="outline" asChild>
              <a href="/admin/products">Go to Products</a>
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">Manage Orders</h3>
            <p className="text-gray-600 mb-4">View & update order status</p>
            <Button variant="outline" asChild>
              <a href="/admin/orders">Go to Orders</a>
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Users className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="text-xl font-semibold mb-2">User Management</h3>
            <p className="text-gray-600 mb-4">View customers & roles</p>
            <Button variant="outline" asChild>
              <a href="/admin/users">Go to Users</a>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
