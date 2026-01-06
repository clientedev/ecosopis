import { Link, useLocation } from "wouter";
import { ShoppingBag, User, Menu, Leaf, Search, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function Navbar() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const [location] = useLocation();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const links = [
    { name: "Produtos", href: "/produtos" },
    { name: "Assinatura", href: "/assinatura" },
    { name: "Sustentabilidade", href: "/sustentabilidade" },
    { name: "Sobre", href: "/sobre" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-black/[0.03]">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
            <Leaf className="h-5 w-5 text-primary group-hover:text-white transition-colors duration-500" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-foreground group-hover:text-primary transition-colors duration-500" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            ECOSOPIS
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="relative group">
              <span className={`text-[13px] font-bold uppercase tracking-widest transition-colors ${
                location === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}>
                {link.name}
              </span>
              <motion.div 
                className="absolute -bottom-1 left-0 h-0.5 bg-primary"
                initial={ { width: 0 } }
                whileHover={ { width: "100%" } }
                transition={ { duration: 0.3 } }
              />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
            <Search className="h-5 w-5" />
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5 relative group">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                    {itemCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 rounded-l-[40px] border-none shadow-2xl">
              <SheetHeader className="p-8 border-b">
                <SheetTitle className="text-2xl font-display font-bold flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                  Seu Carrinho
                </SheetTitle>
              </SheetHeader>
              
              <ScrollArea className="flex-1 px-8">
                {items.length === 0 ? (
                  <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center">
                      <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">Seu carrinho está vazio.</p>
                    <Button variant="outline" className="rounded-full px-8">Começar a Comprar</Button>
                  </div>
                ) : (
                  <div className="py-8 space-y-8">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="h-24 w-24 rounded-2xl overflow-hidden bg-muted shrink-0">
                          <img src={item.imagem_url} alt={item.nome} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-sm leading-tight">{item.nome}</h4>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-full"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 capitalize">{item.categoria}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center bg-muted rounded-full p-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 rounded-full"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 rounded-full"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="font-bold text-sm">R$ {((item.preco * item.quantity) / 100).toFixed(2).replace('.', ',')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {items.length > 0 && (
                <div className="p-8 bg-[#FDFDFD] border-t space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span>R$ {(total / 100).toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Frete</span>
                      <span className="text-primary font-bold">Grátis</span>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between text-xl font-display font-bold">
                      <span>Total</span>
                      <span>R$ {(total / 100).toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                  <Button className="w-full h-14 rounded-full text-lg font-bold shadow-xl shadow-primary/20">
                    Finalizar Compra
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>

          <div className="h-6 w-[1px] bg-black/5 mx-2" />
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
