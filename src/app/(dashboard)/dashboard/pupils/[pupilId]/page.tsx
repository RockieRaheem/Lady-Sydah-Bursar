'use client';

import * as React from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useGlobalState } from '@/lib/global-state';
import { type Payment, type Pupil } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Phone, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { type EnrichedPayment } from '@/app/(dashboard)/dashboard/payments/page';

type EnrichedPupil = Pupil & {
    className: string;
};

export default function PupilDetailsPage({ params }: { params: { pupilId: string } }) {
  const router = useRouter();
  const { pupilId } = params;
  const { pupils, payments, getClassById } = useGlobalState();

  const [pupil, setPupil] = React.useState<EnrichedPupil | null>(null);
  const [pupilPayments, setPupilPayments] = React.useState<EnrichedPayment[]>([]);

  React.useEffect(() => {
    const foundPupil = pupils.find(p => p.id === pupilId);
    if (foundPupil) {
        const schoolClass = getClassById(foundPupil.classId);
        setPupil({ ...foundPupil, className: schoolClass?.name || 'N/A' });

        const relatedPayments = payments
            .filter(p => p.pupilId === pupilId)
            .map(payment => ({
                ...payment,
                pupilName: foundPupil.name,
                className: schoolClass?.name || 'N/A',
                classId: foundPupil.classId,
            }));
        setPupilPayments(relatedPayments);
    }
  }, [pupilId, pupils, payments, getClassById]);

  if (!pupil) {
    // Gracefully handle the case where the pupil might not be found immediately
    // You could show a loader here
    const pupilExists = pupils.some(p => p.id === pupilId);
    if (!pupilExists) {
        notFound();
    }
     return (
      <div className="flex items-center justify-center p-8">
        <p>Loading pupil data...</p>
      </div>
    );
  }
  
  const getBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case 'tuition':
        return 'default';
      case 'lunch':
        return 'secondary';
      case 'uniform':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            {pupil.name}
          </h1>
          <p className="text-muted-foreground">
            Payment history and details for {pupil.name}.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pupil Information</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <User className="h-5 w-5 text-muted-foreground"/>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Class</p>
                        <p className="font-medium">{pupil.className}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <User className="h-5 w-5 text-muted-foreground"/>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Guardian</p>
                        <p className="font-medium">{pupil.guardianName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Phone className="h-5 w-5 text-muted-foreground"/>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Guardian Contact</p>
                        <p className="font-medium">{pupil.guardianContact}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Wallet className="h-5 w-5 text-muted-foreground"/>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Balance Due</p>
                        <p className="font-medium">{formatCurrency(pupil.totalDue)}</p>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>A complete record of all payments made by this pupil.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pupilPayments.length > 0 ? (
                            pupilPayments.map(payment => (
                                <TableRow key={payment.id}>
                                    <TableCell>
                                        {new Date(payment.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getBadgeVariant(payment.type)}>{payment.type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {formatCurrency(payment.amount)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    No payments recorded for this pupil yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
