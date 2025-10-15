'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpensesDataTable } from '@/components/dashboard/ExpensesDataTable';
import { type Expense } from '@/lib/data';
import { formatCurrency, cn } from '@/lib/utils';
import { PlusCircle, Wallet, CalendarIcon } from 'lucide-react';
import { AddEditExpenseDialog } from '@/components/dashboard/AddEditExpenseDialog';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useGlobalState } from '@/lib/global-state';

export default function ExpensesPage() {
  const { expenses, setExpenses } = useGlobalState();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedExpense, setSelectedExpense] = React.useState<Expense | null>(null);

  const filteredExpenses = React.useMemo(() => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      expenseDate.setHours(0, 0, 0, 0);
      
      const from = dateRange?.from;
      if (from) from.setHours(0, 0, 0, 0);

      const to = dateRange?.to;
      if (to) to.setHours(0, 0, 0, 0);

      const matchesDate =
        !dateRange ||
        !dateRange.from ||
        (expenseDate >= from! && (!dateRange.to || expenseDate <= to!));
      
      return matchesDate;
    });
  }, [expenses, dateRange]);


  const totalExpenses = React.useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

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
      setExpenses((prev) => [...prev, newExpense].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
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
            <CardTitle className="text-sm font-medium">Total Filtered Expenses</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total expenditures in the selected period
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Expense History</CardTitle>
               <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={'outline'}
                      className={cn(
                        "w-full sm:w-[300px] justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
           </div>
        </CardHeader>
        <CardContent>
          <ExpensesDataTable 
            data={filteredExpenses}
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
