import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
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

  // Products
  app.get(api.products.list.path, async (req, res) => {
    const category = req.query.category as string;
    const search = req.query.search as string;
    const products = await storage.getProducts(category, search);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
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

  // Orders
  app.post(api.orders.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { items } = req.body;
    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await storage.getProduct(item.productId);
      if (!product) return res.status(400).json({ message: `Product ${item.productId} not found` });
      
      const price = product.price;
      total += price * item.quantity;
      
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: price,
        orderId: 0 // Will be set in storage
      });
    }

    const order = await storage.createOrder({
      userId: req.user.id,
      total,
      status: "pending"
    }, orderItemsData);

    res.status(201).json(order);
  });

  app.get(api.orders.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const orders = await storage.getOrders(req.user.id);
    res.json(orders);
  });

  // Chat
  app.post(api.chat.send.path, async (req, res) => {
    const { message } = req.body;
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful beauty consultant for Ecosopis, a natural and vegan cosmetics brand. You give advice on skin types and recommend Ecosopis products. Be friendly, professional, and concise." },
          { role: "user", content: message }
        ],
        model: "gpt-4o",
      });
      res.json({ response: completion.choices[0].message.content });
    } catch (e) {
      res.status(500).json({ message: "Failed to generate response" });
    }
  });

  // Seed Data
  if (process.env.NODE_ENV !== "production") {
    const existing = await storage.getProducts();
    if (existing.length === 0) {
      console.log("Seeding database...");
      await storage.createProduct({
        name: "Sabonete de Argila Verde",
        description: "Deep cleansing for oily skin. Removes impurities and toxins.",
        ingredients: "Green Clay, Tea Tree Oil, Coconut Oil",
        benefits: "Oil control, Detox, Anti-acne",
        tags: ["oily", "acne", "detox"],
        price: 2990, // 29.90
        category: "Soaps",
        channels: { site: true, ml: "https://mercadolivre.com.br", shopee: "https://shopee.com.br" },
        imageUrl: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800",
        isSubscription: false,
      });
      
      await storage.createProduct({
        name: "Sérum Vitamina C 20%",
        description: "Brightening and anti-aging serum for all skin types.",
        ingredients: "Vitamin C, Hyaluronic Acid, Vitamin E",
        benefits: "Brightening, Anti-aging, Hydration",
        tags: ["all", "anti-aging", "brightening"],
        price: 8990,
        category: "Serums",
        channels: { site: true },
        imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
        isSubscription: false,
      });

      await storage.createProduct({
        name: "Box Surpresa Ecosopis",
        description: "Monthly subscription box with 3 curated products for your skin type.",
        ingredients: "Various",
        benefits: "Discovery, Savings, Convenience",
        tags: ["subscription", "box"],
        price: 9990,
        category: "Subscription",
        channels: { site: true },
        imageUrl: "https://images.unsplash.com/photo-1616401784845-180886ba9ca2?w=800",
        isSubscription: true,
      });
    }
  }

  return httpServer;
}
