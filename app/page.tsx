import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Search, ShoppingCart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const { data: valueDeals } = trpc.products.getValueDeals.useQuery();
  const { data: bestsellers } = trpc.products.getBestsellers.useQuery();
  const { data: newArrivals } = trpc.products.getNewArrivals.useQuery();
  const { data: categories } = trpc.categories.list.useQuery();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Authentic South Asian Groceries
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Best prices on Shan, National, Mehran • Free shipping over €35
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-green-800 hover:bg-gray-100">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
              View Value Deals
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories?.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`}>
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-20 h-20 mx-auto mb-4 object-contain"
                    />
                  )}
                  <h3 className="font-medium">{cat.name}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value Deals Slider */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Wallet-Friendly Value Deals</h2>
            <Button variant="outline" asChild>
              <Link href="/products?filter=value-deals">
                View All <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueDeals?.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Our Bestsellers</h2>
            <Button variant="outline" asChild>
              <Link href="/products?filter=bestsellers">
                View All <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers?.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Button variant="outline" asChild>
              <Link href="/products?filter=new">
                View All <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals?.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-green-800 text-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Shop?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Thousands of authentic products. Lightning-fast delivery across Europe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="bg-white text-green-800 hover:bg-gray-100">
              <Link href="/products">Browse All Products</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/20">
              <Link href="/resources/programmatic-seo">Read Programmatic SEO Guide</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
