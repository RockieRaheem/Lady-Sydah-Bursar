'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Receipt, Download, Calendar, CreditCard, FileText } from 'lucide-react';
import { type Payment, type Pupil, type SchoolClass } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type PaymentHistoryCardProps = {
  payments: Payment[];
  pupil: Pupil;
  schoolClass: SchoolClass;
  onViewReceipt: (payment: Payment) => void;
};

export function PaymentHistoryCard({
  payments,
  pupil,
  schoolClass,
  onViewReceipt,
}: PaymentHistoryCardProps) {
  const [expandedPaymentId, setExpandedPaymentId] = React.useState<string | null>(null);

  // Sort payments by date (most recent first)
  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate running balance after each payment
  const paymentsWithBalance = sortedPayments.map((payment, index) => {
    const previousPayments = sortedPayments.slice(0, index);
    const totalPaidBefore = previousPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalPaidAfter = totalPaidBefore + payment.amount;
    
    return {
      ...payment,
      balanceBefore: pupil.balance + (pupil.totalPaid - totalPaidBefore),
      balanceAfter: pupil.balance + (pupil.totalPaid - totalPaidAfter),
      paymentNumber: sortedPayments.length - index,
    };
  });

  const getBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fees':
        return 'default';
      case 'lunch':
        return 'secondary';
      case 'uniform':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const feePayments = payments.filter(p => p.type === 'Fees');
  const otherPayments = payments.filter(p => p.type !== 'Fees');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Complete Payment History
            </CardTitle>
            <CardDescription>
              Detailed record of all {payments.length} transaction{payments.length !== 1 ? 's' : ''} for {pupil.name}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {payments.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total Payments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalPaid)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total Amount Paid
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">
                {feePayments.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                School Fees Payments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">
                {otherPayments.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Other Payments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Timeline */}
        {payments.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Payment Timeline</h3>
              <p className="text-sm text-muted-foreground">
                Most recent payments first
              </p>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">#</TableHead>
                    <TableHead className="w-[120px]">Receipt</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Balance After</TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentsWithBalance.map((payment) => (
                    <React.Fragment key={payment.id}>
                      <TableRow 
                        className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                          expandedPaymentId === payment.id ? 'bg-muted/30' : ''
                        }`}
                        onClick={() => setExpandedPaymentId(
                          expandedPaymentId === payment.id ? null : payment.id
                        )}
                      >
                        <TableCell className="font-semibold text-primary">
                          #{payment.paymentNumber}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {payment.receiptNumber}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">
                              {format(new Date(payment.date), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getBadgeVariant(payment.type)}>
                            {payment.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {payment.paymentMethod || 'Cash'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-mono font-bold text-green-600">
                            +{formatCurrency(payment.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`font-mono font-medium ${
                            payment.balanceAfter > 0 ? 'text-destructive' : 'text-green-600'
                          }`}>
                            {formatCurrency(payment.balanceAfter)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewReceipt(payment);
                            }}
                          >
                            <Receipt className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Details Row */}
                      {expandedPaymentId === payment.id && (
                        <TableRow className="bg-muted/30">
                          <TableCell colSpan={8} className="py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm">Payment Details</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Received By:</span>
                                    <span className="font-medium">{payment.receivedBy || 'Bursar'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Balance Before:</span>
                                    <span className={`font-medium ${
                                      payment.balanceBefore > 0 ? 'text-destructive' : 'text-green-600'
                                    }`}>
                                      {formatCurrency(payment.balanceBefore)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Payment Made:</span>
                                    <span className="font-medium text-green-600">
                                      -{formatCurrency(payment.amount)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between pt-2 border-t">
                                    <span className="text-muted-foreground font-semibold">Balance After:</span>
                                    <span className={`font-bold ${
                                      payment.balanceAfter > 0 ? 'text-destructive' : 'text-green-600'
                                    }`}>
                                      {formatCurrency(payment.balanceAfter)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm">Additional Information</h4>
                                <div className="space-y-1 text-sm">
                                  {payment.notes ? (
                                    <div>
                                      <span className="text-muted-foreground">Notes:</span>
                                      <p className="mt-1 p-2 bg-background rounded border">
                                        {payment.notes}
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="text-muted-foreground italic">No additional notes</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Click on any payment to see more details
              </p>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total Paid</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Payment History</h3>
            <p className="text-sm text-muted-foreground">
              This student has not made any payments yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
