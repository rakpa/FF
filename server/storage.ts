import { type Salary, type InsertSalary, type Expense, type InsertExpense } from "@shared/schema";

export interface IStorage {
  // Salary operations
  getSalaries(): Promise<Salary[]>;
  createSalary(salary: InsertSalary): Promise<Salary>;
  
  // Expense operations
  getExpenses(): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
}

export class MemStorage implements IStorage {
  private salaries: Map<number, Salary>;
  private expenses: Map<number, Expense>;
  private salaryId: number;
  private expenseId: number;

  constructor() {
    this.salaries = new Map();
    this.expenses = new Map();
    this.salaryId = 1;
    this.expenseId = 1;
  }

  async getSalaries(): Promise<Salary[]> {
    return Array.from(this.salaries.values());
  }

  async createSalary(insertSalary: InsertSalary): Promise<Salary> {
    const id = this.salaryId++;
    const salary: Salary = {
      ...insertSalary,
      id,
      createdAt: new Date(),
    };
    this.salaries.set(id, salary);
    return salary;
  }

  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values());
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.expenseId++;
    const expense: Expense = {
      ...insertExpense,
      id,
      createdAt: new Date(),
    };
    this.expenses.set(id, expense);
    return expense;
  }
}

export const storage = new MemStorage();
