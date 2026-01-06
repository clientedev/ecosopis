import { Product } from "@shared/schema";
import { Link } from "wouter";
import { ShoppingCart, ExternalLink, Leaf } from "lucide-react";
import { useCart } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price / 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="group bg-white rounded-xl overflow-hidden border border-border/40 hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
        {/* Placeholder image logic - in production use real images */}
        <div className="w-full h-full bg-secondary flex items-center justify-center text-primary/20">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <Leaf className="w-20 h-20" />
          )}
        </div>
        
        {product.isSubscription && (
          <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Subscription
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            {product.category}
          </span>
        </div>
        
        <Link href={`/product/${product.id}`} className="block mb-2">
          <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
          {product.description}
        </p>

        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">{formattedPrice}</span>
          </div>

          <div className="flex flex-col gap-2">
            {product.channels.site && (
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => addItem(product)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            )}
            
            <div className="flex gap-2">
              {product.channels.ml && (
                <a href={product.channels.ml} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full text-xs h-9" title="Mercado Livre">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    ML
                  </Button>
                </a>
              )}
              {product.channels.shopee && (
                <a href={product.channels.shopee} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full text-xs h-9" title="Shopee">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Shopee
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
