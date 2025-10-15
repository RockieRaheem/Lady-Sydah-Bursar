'use client';

import * as React from 'react';
import { FinancialSummary } from '@/components/dashboard/FinancialSummary';
import { AiReport } from '@/components/dashboard/AiReport';
import { useGlobalState } from '@/lib/global-state';

export default function ReportsPage() {
  const { payments, expenses, schoolClasses, pupils } = useGlobalState();
  
  const totalIncome = React.useMemo(() => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  }, [payments]);
  
  const totalExpenses = React.useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);
  
  const netBalance = totalIncome - totalExpenses;

  const classWiseIncomeData = React.useMemo(() => {
    return schoolClasses.map((c) => {
      const classPupils = pupils.filter(p => p.classId === c.id);
      const total = payments
        .filter(p => classPupils.some(cp => cp.id === p.pupilId))
        .reduce((sum, payment) => sum + payment.amount, 0);
      return {
        name: c.name,
        total: total,
      };
    });
  }, [schoolClasses, pupils, payments]);

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
