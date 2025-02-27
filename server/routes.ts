import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSalarySchema, insertExpenseSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Salary routes
  app.get("/api/salaries", async (_req, res) => {
    const salaries = await storage.getSalaries();
    res.json(salaries);
  });

  app.post("/api/salaries", async (req, res) => {
    const result = insertSalarySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const salary = await storage.createSalary(result.data);
    res.json(salary);
  });

  // Expense routes
  app.get("/api/expenses", async (_req, res) => {
    const expenses = await storage.getExpenses();
    res.json(expenses);
  });

  app.post("/api/expenses", async (req, res) => {
    const result = insertExpenseSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const expense = await storage.createExpense(result.data);
    res.json(expense);
  });

  const httpServer = createServer(app);
  return httpServer;
}
