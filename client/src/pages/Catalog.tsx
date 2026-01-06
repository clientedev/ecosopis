import { Navigation } from "@/components/Navigation";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const CATEGORIES = ["All", "Cleansers", "Serums", "Moisturizers", "Sunscreen", "Bundles"];

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  
  // Debounce search in production, simplified here
  const { data: products, isLoading } = useProducts({ 
    search: search || undefined,
    category: category === "All" ? undefined : category.toLowerCase()
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="bg-secondary/30 py-12 border-b border-border/50">
        <div className="container-width">
          <h1 className="font-display text-4xl font-bold mb-4">Shop Formulas</h1>
          <p className="text-muted-foreground max-w-2xl">
            Explore our range of scientifically formulated skincare products designed 
            to enhance your natural radiance.
          </p>
        </div>
      </div>

      <div className="container-width py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-8 flex-shrink-0">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-9 bg-white" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">Categories</h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? "default" : "ghost"}
                    className={`justify-start ${category === cat ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 bg-muted animate-pulse rounded-xl" />
                ))}
              </div>
            ) : products?.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 rounded-xl">
                <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
                <Button 
                  variant="link" 
                  onClick={() => { setSearch(""); setCategory("All"); }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <motion.div 
                layout 
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
