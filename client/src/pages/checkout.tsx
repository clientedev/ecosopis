import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Truck, CheckCircle2, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function Checkout() {
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("pix");

  const handleFinish = () => {
    toast({ title: "Pedido Realizado!", description: "Você receberá a confirmação por e-mail." });
    clearCart();
    setLocation("/");
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h2>
        <Button onClick={() => setLocation("/produtos")} className="rounded-full">Ir para a Loja</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-4">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>1</div>
          <div className="h-px w-12 bg-muted" />
          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>2</div>
          <div className="h-px w-12 bg-muted" />
          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>3</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold">Informações de Entrega</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CEP</Label>
                  <Input placeholder="00000-000" className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Número</Label>
                  <Input placeholder="123" className="rounded-xl h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Endereço Completo</Label>
                <Input placeholder="Rua, Bairro, Cidade" className="rounded-xl h-12" />
              </div>
              <Button onClick={() => setStep(2)} className="w-full h-14 rounded-full text-lg">Ir para Pagamento</Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold">Forma de Pagamento</h2>
              <RadioGroup value={method} onValueChange={setMethod} className="grid gap-4">
                <div className={`flex items-center space-x-4 border p-6 rounded-2xl cursor-pointer transition-all ${method === 'pix' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex items-center gap-3 cursor-pointer">
                    <QrCode className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-bold">Pix</p>
                      <p className="text-sm text-muted-foreground">Aprovação imediata e 5% de desconto</p>
                    </div>
                  </Label>
                </div>
                <div className={`flex items-center space-x-4 border p-6 rounded-2xl cursor-pointer transition-all ${method === 'card' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-bold">Cartão de Crédito</p>
                      <p className="text-sm text-muted-foreground">Até 10x sem juros</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
              <Button onClick={handleFinish} className="w-full h-14 rounded-full text-lg">Finalizar Pedido</Button>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="rounded-[32px] border-none shadow-xl bg-muted/30 sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-h-[300px] overflow-y-auto space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.imagem_url} className="h-16 w-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="font-bold text-sm leading-tight">{item.nome}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity}x R$ {(item.preco / 100).toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">R$ {(total / 100).toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-primary font-bold">Grátis</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-3">
                  <span>Total</span>
                  <span className="text-primary">R$ {(total / 100).toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
