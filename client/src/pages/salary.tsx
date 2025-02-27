import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { insertSalarySchema, type InsertSalary, type Salary } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const months = Array.from({ length: 12 }, (_, i) => i + 1);
const years = [2025];

export default function Salary() {
  const { toast } = useToast();
  const form = useForm<InsertSalary>({
    resolver: zodResolver(insertSalarySchema),
    defaultValues: {
      amount: 0,
      month: new Date().getMonth() + 1,
      year: 2025,
    },
  });

  const { data: salaries } = useQuery<Salary[]>({ 
    queryKey: ["/api/salaries"]
  });

  const mutation = useMutation({
    mutationFn: async (values: InsertSalary) => {
      await apiRequest("POST", "/api/salaries", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/salaries"] });
      toast({ title: "Success", description: "Salary saved successfully" });
      form.reset();
    },
  });

  const totalSalary = salaries?.reduce((sum, salary) => sum + salary.amount, 0) || 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h2 className="mb-4 text-2xl font-bold">Add Salary</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {new Date(2025, month - 1).toLocaleString('default', { month: 'long' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (PLN)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              Save Salary
            </Button>
          </form>
        </Form>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-2xl font-bold">Total Salary 2025</h2>
        <div className="text-4xl font-bold text-primary">
          {totalSalary.toLocaleString()} PLN
        </div>
      </Card>
    </div>
  );
}
