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

  return httpServer;
}
