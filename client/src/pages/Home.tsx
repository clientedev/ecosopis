import { Navigation } from "@/components/Navigation";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Leaf, FlaskConical, Heart } from "lucide-react";
import { motion } from "framer-motion";

// Placeholder import for hero background if needed, 
// but using CSS gradient for cleaner scientific look.

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary/30 pt-16 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <div className="container-width relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">
                Scientific Skincare
              </span>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 leading-[1.1]">
                Nature's Formula <br />
                <span className="text-primary">Refined by Science</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
                Experience high-performance formulas derived from sustainable botanicals. 
                Clinically proven to restore your skin's natural balance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="h-12 px-8 text-base">
                    Shop Collection
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    Take Skin Quiz
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-white">
        <div className="container-width">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                icon: Leaf, 
                title: "100% Organic Sources", 
                desc: "Sourced directly from sustainable farms with full traceability." 
              },
              { 
                icon: FlaskConical, 
                title: "Clinically Proven", 
                desc: "Formulas tested in labs for efficacy and safety on all skin types." 
              },
              { 
                icon: Heart, 
                title: "Cruelty Free", 
                desc: "Never tested on animals. Vegan certified and planet friendly." 
              },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-secondary/20">
        <div className="container-width">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary font-bold uppercase tracking-wider text-sm">Selections</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Best Sellers</h2>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="hidden sm:flex group">
                View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center sm:hidden">
            <Link href="/products">
              <Button variant="outline" className="w-full">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Subscription Banner */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        
        <div className="container-width relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">The Eco Box Subscription</h2>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Get a curated selection of full-size products delivered to your door every month. 
            Save up to 40% on retail prices.
          </p>
          <Link href="/box">
            <Button size="lg" variant="secondary" className="text-primary font-bold h-14 px-8">
              Explore Subscription
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
