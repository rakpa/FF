import { useQuery } from "@tanstack/react-query";
import { type Salary, type Expense } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default function Dashboard() {
  const { data: salaries } = useQuery<Salary[]>({ 
    queryKey: ["/api/salaries"]
  });
  
  const { data: expenses } = useQuery<Expense[]>({ 
    queryKey: ["/api/expenses"]
  });

  const totalSalary = salaries?.reduce((sum, salary) => sum + salary.amount, 0) || 0;
  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const netSavings = totalSalary - totalExpenses;

  // Monthly data for chart
  const monthlyData = Array.from({ length: 12 }, (_, month) => {
    const monthSalary = salaries?.filter(s => s.month === month + 1).reduce((sum, s) => sum + s.amount, 0) || 0;
    const monthExpenses = expenses?.filter(e => e.month === month + 1).reduce((sum, e) => sum + e.amount, 0) || 0;
    return {
      month: new Date(2025, month).toLocaleString('default', { month: 'short' }),
      salary: monthSalary,
      expenses: monthExpenses,
    };
  });

  // Category data for pie chart
  const categoryData = expenses?.reduce((acc, curr) => {
    const existing = acc.find(item => item.category === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ category: curr.category, value: curr.amount });
    }
    return acc;
  }, [] as { category: string; value: number }[]) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Total Income</h3>
          <p className="text-2xl font-bold text-primary">{totalSalary.toLocaleString()} PLN</p>
        </Card>
        <Card className="p-6">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Total Expenses</h3>
          <p className="text-2xl font-bold text-destructive">{totalExpenses.toLocaleString()} PLN</p>
        </Card>
        <Card className="p-6">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Net Savings</h3>
          <p className={`text-2xl font-bold ${netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {netSavings.toLocaleString()} PLN
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-bold">Monthly Overview</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="salary" name="Income" fill="#0088FE" />
              <Bar dataKey="expenses" name="Expenses" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-bold">Expense Distribution</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={(entry) => `${entry.category}: ${entry.value.toLocaleString()} PLN`}
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}