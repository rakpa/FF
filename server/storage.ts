import { type Salary, type InsertSalary, type Expense, type InsertExpense } from "@shared/schema";
import { db } from "./db";
import { salaries, expenses } from "@shared/schema";

export interface IStorage {
  // Salary operations
  getSalaries(): Promise<Salary[]>;
  createSalary(salary: InsertSalary): Promise<Salary>;

  // Expense operations
  getExpenses(): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
}

export class DatabaseStorage implements IStorage {
  async getSalaries(): Promise<Salary[]> {
    return await db.select().from(salaries).orderBy(salaries.createdAt);
  }

  async createSalary(insertSalary: InsertSalary): Promise<Salary> {
    const [salary] = await db
      .insert(salaries)
      .values(insertSalary)
      .returning();
    return salary;
  }

  async getExpenses(): Promise<Expense[]> {
    return await db.select().from(expenses).orderBy(expenses.createdAt);
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const [expense] = await db
      .insert(expenses)
      .values(insertExpense)
      .returning();
    return expense;
  }
}

export const storage = new DatabaseStorage();