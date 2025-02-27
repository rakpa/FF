
import { z } from "zod";

// Define types directly without using drizzle's pgTable
export type Salary = {
  id: number;
  amount: number;
  month: number;
  year: number;
  createdAt: Date;
};

export type Expense = {
  id: number;
  amount: number;
  category: string;
  month: number;
  year: number;
  createdAt: Date;
};

// Zod schemas for validation
export const insertSalarySchema = z.object({
  amount: z.number(),
  month: z.number(),
  year: z.number(),
});

export const updateSalarySchema = insertSalarySchema.extend({
  id: z.number(),
});

export const insertExpenseSchema = z.object({
  amount: z.number(),
  category: z.string(),
  month: z.number(),
  year: z.number(),
});

export const categories = [
  "Rent",
  "School Fees",
  "City Transport",
  "Vacation",
  "Shopping",
  "Food",
  "Grocery",
] as const;

export type Category = typeof categories[number];
export type InsertSalary = z.infer<typeof insertSalarySchema>;
export type UpdateSalary = z.infer<typeof updateSalarySchema>;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
