import { useProduct } from "@/hooks/use-products";
import { useRoute } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-store";
import { Loader2, Check, Star } from "lucide-react";
import { useState } from "react";

export default function ProductDetails() {
  const [, params] = useRoute("/product/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: product, isLoading, error } = useProduct(id);
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "benefits">("description");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price / 100);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <div className="container-width py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-secondary rounded-2xl overflow-hidden border border-border/50">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/20">
                  <span className="text-lg font-medium">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                {product.isSubscription && (
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Subscription
                  </span>
                )}
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">{formattedPrice}</span>
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  <span className="text-muted-foreground ml-2 text-sm text-gray-500">(24 reviews)</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 max-w-sm">
                <Button size="lg" className="w-full h-12 text-base" onClick={() => addItem(product)}>
                  Add to Cart - {formattedPrice}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Secure checkout • Free shipping over R$200
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <div className="flex gap-6 border-b border-border mb-6">
                {(["description", "ingredients", "benefits"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium uppercase tracking-wider transition-colors ${
                      activeTab === tab 
                        ? "text-primary border-b-2 border-primary" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="min-h-[150px] text-muted-foreground leading-relaxed">
                {activeTab === "description" && <p>{product.description}</p>}
                {activeTab === "ingredients" && <p>{product.ingredients}</p>}
                {activeTab === "benefits" && (
                  <ul className="space-y-2">
                    {product.benefits.split('.').filter(Boolean).map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{benefit.trim()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
