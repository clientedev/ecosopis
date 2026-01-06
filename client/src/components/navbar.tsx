import { Link } from "wouter";
import { ShoppingCart, User, Menu, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

export function Navbar() {
  const { items } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-primary" />
          <span className="font-display text-2xl font-bold tracking-tight text-primary">ECOSOPIS</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/produtos" className="text-sm font-medium hover:text-primary transition-colors">Produtos</Link>
          <Link href="/sobre" className="text-sm font-medium hover:text-primary transition-colors">Sobre</Link>
          <Link href="/sustentabilidade" className="text-sm font-medium hover:text-primary transition-colors">Sustentabilidade</Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
