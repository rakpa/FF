import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const salaries = pgTable("salaries", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  category: text("category").notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSalarySchema = createInsertSchema(salaries).omit({
  id: true,
  createdAt: true,
});

export const updateSalarySchema = insertSalarySchema.extend({
  id: z.number(),
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  createdAt: true,
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
export type Salary = typeof salaries.$inferSelect;
export type Expense = typeof expenses.$inferSelect;