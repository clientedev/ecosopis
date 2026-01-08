import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit, LayoutDashboard, Package, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Product } from "@/hooks/use-cart";

export function AdminDashboard() {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nome: "",
    descricao: "",
    preco: 0,
    imagem_url: "",
    categoria: "",
    ingredientes: "",
    beneficios: "",
    canais: { site: true }
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/produtos"],
  });

  const createMutation = useMutation({
    mutationFn: async (product: any) => {
      const res = await apiRequest("POST", "/api/produtos/", product);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/produtos"] });
      setIsAdding(false);
      toast({ title: "Sucesso", description: "Produto adicionado com sucesso." });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/produtos/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/produtos"] });
      toast({ title: "Sucesso", description: "Produto removido." });
    }
  });

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-12">
        <LayoutDashboard className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Painel Administrativo</h1>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <Button variant="default" className="w-full justify-start rounded-xl h-12 gap-3 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
            <Package className="h-5 w-5" /> Produtos
          </Button>
          <Button variant="ghost" className="w-full justify-start rounded-xl h-12 gap-3 text-muted-foreground">
            <ShoppingCart className="h-5 w-5" /> Pedidos
          </Button>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="rounded-2xl border-none shadow-sm p-6 bg-white">
              <p className="text-sm text-muted-foreground mb-1">Total de Vendas</p>
              <h3 className="text-2xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>R$ 12.450,00</h3>
            </Card>
            <Card className="rounded-2xl border-none shadow-sm p-6 bg-white">
              <p className="text-sm text-muted-foreground mb-1">Pedidos Ativos</p>
              <h3 className="text-2xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>24</h3>
            </Card>
            <Card className="rounded-2xl border-none shadow-sm p-6 bg-white">
              <p className="text-sm text-muted-foreground mb-1">Novos Clientes</p>
              <h3 className="text-2xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>12</h3>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
            <Button onClick={() => setIsAdding(true)} className="rounded-full gap-2">
              <Plus className="h-4 w-4" /> Novo Produto
            </Button>
          </div>

          {isAdding && (
            <Card className="rounded-3xl border-none shadow-xl bg-muted/30 p-8">
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="Nome do Produto" value={newProduct.nome} onChange={e => setNewProduct({...newProduct, nome: e.target.value})} className="rounded-xl h-12" />
                  <Input placeholder="Categoria" value={newProduct.categoria} onChange={e => setNewProduct({...newProduct, categoria: e.target.value})} className="rounded-xl h-12" />
                </div>
                <Textarea placeholder="Descrição" value={newProduct.descricao} onChange={e => setNewProduct({...newProduct, descricao: e.target.value})} className="rounded-xl min-h-[100px]" />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input type="number" placeholder="Preço (em centavos)" value={newProduct.preco} onChange={e => setNewProduct({...newProduct, preco: parseInt(e.target.value)})} className="rounded-xl h-12" />
                  <Input placeholder="URL da Imagem" value={newProduct.imagem_url} onChange={e => setNewProduct({...newProduct, imagem_url: e.target.value})} className="rounded-xl h-12" />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <Input placeholder="Mercado Livre URL" value={newProduct.canais.ml || ""} onChange={e => setNewProduct({...newProduct, canais: {...newProduct.canais, ml: e.target.value}})} className="rounded-xl h-12" />
                  <Input placeholder="Shopee URL" value={newProduct.canais.shopee || ""} onChange={e => setNewProduct({...newProduct, canais: {...newProduct.canais, shopee: e.target.value}})} className="rounded-xl h-12" />
                  <Input placeholder="Tags (sep. vírgula)" value={newProduct.tags.join(', ')} onChange={e => setNewProduct({...newProduct, tags: e.target.value.split(',').map(s => s.trim())})} className="rounded-xl h-12" />
                </div>
                <div className="flex gap-4">
                  <Button onClick={() => createMutation.mutate(newProduct)} className="rounded-full px-8">Salvar Produto</Button>
                  <Button variant="ghost" onClick={() => setIsAdding(false)} className="rounded-full px-8">Cancelar</Button>
                </div>
              </div>
            </Card>
          )}

          <div className="grid gap-4">
            {isLoading ? (
              <div className="h-20 bg-muted animate-pulse rounded-2xl" />
            ) : (
              products?.map((product) => (
                <Card key={product.id} className="rounded-2xl border-none shadow-sm hover:shadow-md transition-all p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={product.imagem_url} className="h-16 w-16 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold">{product.nome}</h4>
                      <p className="text-sm text-muted-foreground">R$ {(product.preco / 100).toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(product.id)} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
