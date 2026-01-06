import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  // Produtos
  app.get(api.products.list.path, async (req, res) => {
    const category = req.query.category as string;
    const search = req.query.search as string;
    const products = await storage.getProducts(category, search);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Produto não encontrado" });
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') return res.sendStatus(403);
    const product = await storage.createProduct(req.body);
    res.status(201).json(product);
  });

  app.put(api.products.update.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') return res.sendStatus(403);
    const product = await storage.updateProduct(Number(req.params.id), req.body);
    res.json(product);
  });

  app.delete(api.products.delete.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') return res.sendStatus(403);
    await storage.deleteProduct(Number(req.params.id));
    res.sendStatus(204);
  });

  // Pedidos
  app.post(api.orders.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { items } = req.body;
    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await storage.getProduct(item.productId);
      if (!product) return res.status(400).json({ message: `Produto ${item.productId} não encontrado` });
      
      const price = product.price;
      total += price * item.quantity;
      
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: price,
        orderId: 0
      });
    }

    const order = await storage.createOrder({
      userId: req.user.id,
      total,
      status: "pendente"
    }, orderItemsData);

    res.status(201).json(order);
  });

  app.get(api.orders.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const orders = await storage.getOrders(req.user.id);
    res.json(orders);
  });

  // Chatbot de Beleza AI
  app.post(api.chat.send.path, async (req, res) => {
    const { message } = req.body;
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "Você é um consultor de beleza prestativo da Ecosopis, uma marca de cosméticos naturais e veganos. Você dá conselhos sobre tipos de pele e recomenda produtos Ecosopis. Seja amigável, profissional e conciso. Responda sempre em Português do Brasil." },
          { role: "user", content: message }
        ],
        model: "gpt-4o",
      });
      res.json({ response: completion.choices[0].message.content });
    } catch (e) {
      res.status(500).json({ message: "Falha ao gerar resposta" });
    }
  });

  // Seed Data (Traduzido)
  if (process.env.NODE_ENV !== "production") {
    const existing = await storage.getProducts();
    if (existing.length === 0) {
      console.log("Semeando banco de dados...");
      await storage.createProduct({
        name: "Sabonete de Argila Verde",
        description: "Limpeza profunda para peles oleosas. Remove impurezas e toxinas.",
        ingredients: "Argila Verde, Óleo de Melaleuca, Óleo de Coco",
        benefits: "Controle de oleosidade, Detox, Anti-acne",
        tags: ["oleosa", "acne", "detox"],
        price: 2990,
        category: "Sabonetes",
        channels: { site: true, ml: "https://mercadolivre.com.br", shopee: "https://shopee.com.br" },
        imageUrl: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800",
        isSubscription: false,
      });
      
      await storage.createProduct({
        name: "Sérum Vitamina C 20%",
        description: "Sérum iluminador e anti-idade para todos os tipos de pele.",
        ingredients: "Vitamina C, Ácido Hialurônico, Vitamina E",
        benefits: "Iluminador, Anti-idade, Hidratação",
        tags: ["todos", "anti-idade", "iluminador"],
        price: 8990,
        category: "Séruns",
        channels: { site: true },
        imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
        isSubscription: false,
      });

      await storage.createProduct({
        name: "Box Surpresa Ecosopis",
        description: "Caixa de assinatura mensal com 3 produtos selecionados para o seu tipo de pele.",
        ingredients: "Variados",
        benefits: "Descoberta, Economia, Praticidade",
        tags: ["assinatura", "box"],
        price: 9990,
        category: "Assinatura",
        channels: { site: true },
        imageUrl: "https://images.unsplash.com/photo-1616401784845-180886ba9ca2?w=800",
        isSubscription: true,
      });
    }
  }

  return httpServer;
}
