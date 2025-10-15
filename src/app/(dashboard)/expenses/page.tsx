'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpensesDataTable } from '@/components/dashboard/ExpensesDataTable';
import { expenses as allExpenses, getTotalExpenses, type Expense } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { PlusCircle, Wallet } from 'lucide-react';
import { AddEditExpenseDialog } from '@/components/dashboard/AddEditExpenseDialog';

export default function ExpensesPage() {
  const [expenses, setExpenses] = React.useState<Expense[]>(allExpenses);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedExpense, setSelectedExpense] = React.useState<Expense | null>(null);

  const totalExpenses = React.useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setIsDialogOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDialogOpen(true);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  };

  const handleDialogSave = (expenseData: Omit<Expense, 'id'> | Expense) => {
    if ('id' in expenseData) {
      setExpenses((prev) =>
        prev.map((e) => (e.id === expenseData.id ? expenseData : e))
      );
    } else {
      const newExpense = { ...expenseData, id: `expense-${Date.now()}` };
      setExpenses((prev) => [...prev, newExpense]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Expenses
          </h1>
          <p className="text-muted-foreground">
            Track and manage all school expenditures.
          </p>
        </div>
        <Button onClick={handleAddExpense}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total recorded expenditures
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpensesDataTable 
            data={expenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        </CardContent>
      </Card>

      <AddEditExpenseDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleDialogSave}
        expense={selectedExpense}
      />
    </div>
  );
}
