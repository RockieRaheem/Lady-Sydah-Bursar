import { FinancialSummary } from '@/components/dashboard/FinancialSummary';
import { AiReport } from '@/components/dashboard/AiReport';
import {
  schoolClasses,
  getTotalIncome,
  getTotalExpenses,
  getTotalCollectedByClass,
} from '@/lib/data';

export default function ReportsPage() {
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const netBalance = totalIncome - totalExpenses;

  const classWiseIncomeData = schoolClasses.map((c) => ({
    name: c.name,
    total: getTotalCollectedByClass(c.id),
  }));

  const aiInputData = {
    totalIncome,
    totalExpenses,
    netBalance,
    classWiseIncome: classWiseIncomeData.reduce((acc, item) => {
        acc[item.name] = item.total;
        return acc;
    }, {} as Record<string, number>)
  };


  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground">
          Detailed financial summaries and insights.
        </p>
      </div>

      <FinancialSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        netBalance={netBalance}
        classWiseIncome={classWiseIncomeData}
      />
      
      <AiReport initialData={aiInputData} />

    </div>
  );
}
