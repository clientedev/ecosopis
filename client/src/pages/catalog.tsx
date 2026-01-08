import { motion } from "framer-motion";
import { useCart, type Product } from "@/hooks/use-cart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function Catalog() {
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/produtos"],
  });

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast({
      title: "Adicionado ao carrinho",
      description: `${product.nome} foi adicionado com sucesso.`,
    });
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Nossos Produtos</h1>
          <p className="text-muted-foreground">Fórmulas puras para todos os tipos de pele.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-full px-6">
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => <div key={i} className="h-96 bg-muted animate-pulse rounded-3xl" />)
        ) : (
          products?.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group border-none bg-white hover-elevate rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <img
                      src={product.imagem_url}
                      alt={product.nome}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                      {product.categoria}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3 w-3 fill-primary text-primary" />
                      ))}
                      <span className="text-[10px] text-muted-foreground ml-1">(4.9)</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 leading-tight h-12 line-clamp-2">{product.nome}</h3>
                    
                    <div className="flex flex-col gap-2 mt-4">
                      {product.canais?.site && (
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                            R$ {(product.preco / 100).toFixed(2).replace('.', ',')}
                          </span>
                          <Button
                            size="icon"
                            className="rounded-full h-10 w-10"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingBag className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {product.canais?.ml && (
                          <Button variant="outline" size="sm" className="rounded-full text-[10px] h-8" asChild>
                            <a href={product.canais.ml} target="_blank" rel="noopener noreferrer">Mercado Livre</a>
                          </Button>
                        )}
                        {product.canais?.shopee && (
                          <Button variant="outline" size="sm" className="rounded-full text-[10px] h-8" asChild>
                            <a href={product.canais.shopee} target="_blank" rel="noopener noreferrer">Shopee</a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
