'use client';

import * as React from 'react';
import { useGlobalState } from '@/lib/global-state';
import { ClassCard } from '@/components/dashboard/ClassCard';
import { BookOpen, Users, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { schoolClasses, pupils, payments } = useGlobalState();

  const classData = React.useMemo(() => {
    return schoolClasses.map((c) => {
      const classPupils = pupils.filter(p => p.classId === c.id);
      const pupilCount = classPupils.length;
      const totalCollected = payments
        .filter(p => classPupils.some(cp => cp.id === p.pupilId))
        .reduce((sum, payment) => sum + payment.amount, 0);

      return {
        ...c,
        pupilCount,
        totalCollected,
      };
    });
  }, [schoolClasses, pupils, payments]);

  const totalPupils = pupils.length;
  const totalIncome = payments.reduce((sum, c) => sum + c.amount, 0);


  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of Lady Sydah Junior School finances.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{schoolClasses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pupils</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPupils}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
            </CardContent>
          </Card>
      </div>


      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {classData.map((c) => (
          <ClassCard
            key={c.id}
            name={c.name}
            pupilCount={c.pupilCount}
            totalCollected={c.totalCollected}
            href={`/classes/${c.id}`}
          />
        ))}
      </div>
    </div>
  );
}
