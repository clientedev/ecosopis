import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";

export function LoginPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      setLocation("/");
    } catch (e) {}
  };

  return (
    <div className="container mx-auto px-6 py-20 flex justify-center">
      <Card className="w-full max-w-md rounded-[40px] border-none shadow-2xl p-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Entrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Usuário</Label>
              <Input 
                className="rounded-xl h-12" 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Senha</Label>
              <Input 
                type="password" 
                className="rounded-xl h-12"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full h-14 rounded-full text-lg">Entrar</Button>
            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta? <Button variant="link" onClick={() => setLocation("/cadastro")}>Cadastre-se</Button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ username: "", password: "", email: "", telefone: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      setLocation("/login");
    } catch (e) {}
  };

  return (
    <div className="container mx-auto px-6 py-20 flex justify-center">
      <Card className="w-full max-w-md rounded-[40px] border-none shadow-2xl p-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Cadastro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Usuário</Label>
              <Input 
                className="rounded-xl h-12" 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input 
                type="email" 
                className="rounded-xl h-12"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Senha</Label>
              <Input 
                type="password" 
                className="rounded-xl h-12"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full h-14 rounded-full text-lg">Criar Conta</Button>
            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta? <Button variant="link" onClick={() => setLocation("/login")}>Entrar</Button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
