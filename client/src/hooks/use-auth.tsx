import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  email: string;
  perfil: 'admin' | 'cliente';
  telefone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);

  const { isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me/");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          return data;
        }
      } catch (e) {}
      return null;
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/auth/entrar/", data),
    onSuccess: async (res) => {
      const data = await res.json();
      setUser(data);
      queryClient.setQueryData(["/api/auth/me"], data);
      toast({ title: "Bem-vindo!", description: "Login realizado com sucesso." });
    },
    onError: () => {
      toast({ title: "Erro", description: "Credenciais inválidas.", variant: "destructive" });
    }
  });

  const registerMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/auth/registrar/", data),
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Conta criada. Faça login para continuar." });
    },
    onError: (err: any) => {
      toast({ title: "Erro", description: "Falha ao criar conta.", variant: "destructive" });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/sair/", {}),
    onSuccess: () => {
      setUser(null);
      queryClient.setQueryData(["/api/auth/me"], null);
      toast({ title: "Até logo!", description: "Você saiu da sua conta." });
    }
  });

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login: async (data) => { await loginMutation.mutateAsync(data) },
      register: async (data) => { await registerMutation.mutateAsync(data) },
      logout: async () => { await logoutMutation.mutateAsync() }
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
