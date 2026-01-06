import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/theme-provider";
import { Home } from "@/pages/home";
import { Catalog } from "@/pages/catalog";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/hooks/use-cart";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/produtos" component={Catalog} />
          <Route path="/assinatura" component={() => <div className="p-20 text-center"><h1 className="text-4xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Assinatura Ecosopis</h1><p className="mt-4 text-muted-foreground">Em breve uma experiência personalizada na sua porta.</p></div>} />
          <Route path="/sustentabilidade" component={() => <div className="p-20 text-center"><h1 className="text-4xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Nossa Missão</h1><p className="mt-4 text-muted-foreground">Compromisso total com o planeta e com você.</p></div>} />
          <Route path="/sobre" component={() => <div className="p-20 text-center"><h1 className="text-4xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Sobre a Ecosopis</h1><p className="mt-4 text-muted-foreground">Ciência natural e ética desde o primeiro dia.</p></div>} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ecosopis-theme">
        <TooltipProvider>
          <CartProvider>
            <Router />
            <Toaster />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
