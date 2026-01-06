import { useUser } from "@/hooks/use-auth";
import { useProducts, useCreateProduct, useDeleteProduct } from "@/hooks/use-products";
import { useOrders } from "@/hooks/use-orders";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { insertProductSchema } from "@shared/schema";

const productSchema = insertProductSchema.extend({
  price: z.coerce.number(),
});

type ProductForm = z.infer<typeof productSchema>;

export default function AdminDashboard() {
  const { data: user, isLoading: isUserLoading } = useUser();
  const [, setLocation] = useLocation();

  if (isUserLoading) return <div className="p-10">Loading...</div>;
  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container-width py-12">
        <h1 className="font-display text-4xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="products">
          <TabsList className="mb-8">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProductsManager() {
  const { data: products, isLoading } = useProducts();
  const { mutate: deleteProduct } = useDeleteProduct();

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Inventory</h2>
        <CreateProductDialog />
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              <th className="p-4 font-bold text-sm">Name</th>
              <th className="p-4 font-bold text-sm">Category</th>
              <th className="p-4 font-bold text-sm">Price</th>
              <th className="p-4 font-bold text-sm">Channels</th>
              <th className="p-4 font-bold text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id} className="border-b border-border hover:bg-muted/10">
                <td className="p-4">{product.name}</td>
                <td className="p-4">
                  <span className="bg-secondary px-2 py-1 rounded text-xs font-bold uppercase">
                    {product.category}
                  </span>
                </td>
                <td className="p-4">{(product.price / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                <td className="p-4 text-xs text-muted-foreground space-x-1">
                  {product.channels.site && <span>Site</span>}
                  {product.channels.ml && <span>| ML</span>}
                  {product.channels.shopee && <span>| Shopee</span>}
                </td>
                <td className="p-4 text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive/80"
                    onClick={() => {
                      if (confirm("Are you sure?")) deleteProduct(product.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateProductDialog() {
  const { mutate: createProduct, isPending } = useCreateProduct();
  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      ingredients: "",
      benefits: "",
      price: 0,
      category: "Serums",
      imageUrl: "",
      channels: { site: true },
      isSubscription: false,
      tags: [],
    }
  });

  const onSubmit = (data: ProductForm) => {
    createProduct(data, { onSuccess: () => {
      // In a real app we'd close the dialog here
      form.reset();
    }});
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input {...form.register("name")} placeholder="Vitamin C Serum" />
              {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (cents)</label>
              <Input type="number" {...form.register("price")} />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input {...form.register("description")} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <Input {...form.register("imageUrl")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ingredients</label>
              <Input {...form.register("ingredients")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Benefits</label>
              <Input {...form.register("benefits")} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Input {...form.register("category")} />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function OrdersManager() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-secondary/50 border-b border-border">
          <tr>
            <th className="p-4 font-bold text-sm">Order ID</th>
            <th className="p-4 font-bold text-sm">Status</th>
            <th className="p-4 font-bold text-sm">Total</th>
            <th className="p-4 font-bold text-sm">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders?.length === 0 ? (
            <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No orders found</td></tr>
          ) : (
            orders?.map((order) => (
              <tr key={order.id} className="border-b border-border hover:bg-muted/10">
                <td className="p-4">#{order.id}</td>
                <td className="p-4">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold uppercase">
                    {order.status}
                  </span>
                </td>
                <td className="p-4">{(order.total / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                <td className="p-4 text-sm text-muted-foreground">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
