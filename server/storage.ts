
import { type Salary, type InsertSalary, type UpdateSalary, type Expense, type InsertExpense } from "@shared/schema";

export interface IStorage {
  // Salary operations
  getSalaries(): Promise<Salary[]>;
  createSalary(salary: InsertSalary): Promise<Salary>;
  updateSalary(salary: UpdateSalary): Promise<Salary>;

  // Expense operations
  getExpenses(): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
}

export class InMemoryStorage implements IStorage {
  private salaries: Salary[] = [];
  private expenses: Expense[] = [];
  private salaryIdCounter = 1;
  private expenseIdCounter = 1;

  async getSalaries(): Promise<Salary[]> {
    return [...this.salaries].sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }

  async createSalary(insertSalary: InsertSalary): Promise<Salary> {
    const salary: Salary = {
      id: this.salaryIdCounter++,
      ...insertSalary,
      createdAt: new Date()
    };
    this.salaries.push(salary);
    return salary;
  }

  async updateSalary(updateSalary: UpdateSalary): Promise<Salary> {
    const { id, ...values } = updateSalary;
    const salaryIndex = this.salaries.findIndex(s => s.id === id);
    
    if (salaryIndex === -1) {
      throw new Error(`Salary with id ${id} not found`);
    }
    
    const updatedSalary: Salary = {
      ...this.salaries[salaryIndex],
      ...values,
    };
    
    this.salaries[salaryIndex] = updatedSalary;
    return updatedSalary;
  }

  async getExpenses(): Promise<Expense[]> {
    return [...this.expenses].sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const expense: Expense = {
      id: this.expenseIdCounter++,
      ...insertExpense,
      createdAt: new Date()
    };
    this.expenses.push(expense);
    return expense;
  }
}

// Export a single instance of the storage for use throughout the application
export const storage = new InMemoryStorage();
