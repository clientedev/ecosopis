import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, ArrowRight, MessageSquare, Sparkles } from "lucide-react";
import { useCart, type Product } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { SkinQuiz } from "@/components/skin-quiz";

export function Home() {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot', content: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/produtos"],
  });

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'bot', content: data.response }]);
    } catch (e) {
      toast({ title: "Erro", description: "Falha ao enviar mensagem.", variant: "destructive" });
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast({
      title: "Adicionado ao carrinho",
      description: `${product.nome} foi adicionado com sucesso.`,
    });
  };

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center bg-[#F9FBF9]">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-primary/10 text-primary rounded-full">
              Pura • Vegana • Científica
            </span>
            <h1 className="text-6xl md:text-7xl font-bold leading-[1.1] text-foreground mb-6" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              A ciência da <span className="text-primary italic">natureza</span> na sua pele.
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed">
              Fórmulas minimalistas com ativos botânicos de alta performance para resultados reais e duradouros.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="h-14 px-10 rounded-full text-lg shadow-xl shadow-primary/20">
                Ver Produtos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-full text-lg bg-white/50 backdrop-blur-sm">
                Descobrir sua Pele
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative lg:h-full flex justify-center items-center"
          >
            <div className="absolute w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl -z-10" />
            <img
              src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000"
              alt="Ecosopis Serum"
              className="w-full max-w-md object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Essenciais Ecosopis</h2>
              <p className="text-muted-foreground">Os favoritos da nossa comunidade.</p>
            </div>
            <Button variant="link" className="text-primary font-bold">Ver todos <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {isLoading ? (
              [1, 2, 3].map((i) => <div key={i} className="h-96 bg-muted animate-pulse rounded-3xl" />)
            ) : (
              products?.slice(0, 3).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="group overflow-hidden border-none bg-[#FDFDFD] hover-elevate rounded-3xl">
                    <CardContent className="p-0">
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <img
                          src={product.imagem_url}
                          alt={product.nome}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <Button
                          size="icon"
                          className="absolute bottom-6 right-6 h-12 w-12 rounded-full opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 shadow-lg"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingBag className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="p-8">
                        <span className="text-xs font-bold text-primary tracking-widest uppercase mb-2 block">{product.categoria}</span>
                        <h3 className="text-xl font-bold mb-3">{product.nome}</h3>
                        <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{product.descricao}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>R$ {(product.preco / 100).toFixed(2).replace('.', ',')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Skin Quiz Section */}
      <SkinQuiz />

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          size="icon"
          className="h-16 w-16 rounded-full shadow-2xl hover-elevate active-elevate-2"
          onClick={() => setShowChat(!showChat)}
        >
          {showChat ? <ArrowRight className="h-6 w-6 rotate-90" /> : <MessageSquare className="h-6 w-6" />}
        </Button>
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 right-0 w-96 glass-morphism rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
            >
              <div className="p-6 bg-primary text-primary-foreground flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">Consultor AI</p>
                  <p className="text-xs opacity-80">Especialista em Pele Ecosopis</p>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-white/30">
                <div className="bg-muted p-4 rounded-2xl rounded-tl-none text-sm leading-relaxed max-w-[85%]">
                  Olá! Como posso ajudar você a descobrir a melhor rotina para sua pele hoje?
                </div>
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[85%] ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="bg-muted p-3 rounded-2xl rounded-tl-none text-xs w-16 text-center animate-pulse">
                    ...
                  </div>
                )}
              </div>
              <div className="p-4 border-t bg-white/80">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Sua dúvida..." 
                    className="flex-1 bg-[#F5F5F5] border-none rounded-full px-4 text-sm h-10 focus:ring-2 focus:ring-primary outline-none"
                  />
                  <Button size="icon" className="rounded-full h-10 w-10 shrink-0" onClick={handleSendMessage}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
