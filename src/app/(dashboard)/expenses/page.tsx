import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpensesDataTable } from '@/components/dashboard/ExpensesDataTable';
import { expenses, getTotalExpenses } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { PlusCircle, Wallet } from 'lucide-react';

export default function ExpensesPage() {
  const totalExpenses = getTotalExpenses();

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
        <Button>
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
          <ExpensesDataTable data={expenses} />
        </CardContent>
      </Card>
    </div>
  );
}
