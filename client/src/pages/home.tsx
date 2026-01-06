import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ShieldCheck, Sparkles } from "lucide-react";

export function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecee?q=80&w=2070" 
            alt="Natural Cosmetics" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={ { opacity: 0, x: -50 } }
            animate={ { opacity: 1, x: 0 } }
            transition={ { duration: 0.8 } }
            className="max-w-2xl"
          >
            <h1 className="text-6xl md:text-8xl font-display font-bold leading-tight">
              Beleza <span className="text-primary">Consciente</span>, Natureza Pura.
            </h1>
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
              Cosméticos veganos e naturais, formulados com ingredientes botânicos de alta performance para uma pele radiante e saudável.
            </p>
            <div className="mt-10 flex gap-4">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                Comprar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full">
                Fazer Quiz da Pele
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        {[
          { icon: ShieldCheck, title: "100% Vegano", desc: "Sem ingredientes de origem animal ou testes em animais." },
          { icon: Star, title: "Qualidade Premium", desc: "Ingredientes selecionados com rigor científico e natural." },
          { icon: Sparkles, title: "Resultados Reais", desc: "Fórmulas eficazes que respeitam o equilíbrio da sua pele." }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            initial={ { opacity: 0, y: 20 } }
            whileInView={ { opacity: 1, y: 0 } }
            viewport={ { once: true } }
            transition={ { delay: i * 0.2 } }
            className="p-8 rounded-2xl bg-card border hover-elevate"
          >
            <feat.icon className="h-10 w-10 text-primary mb-6" />
            <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
