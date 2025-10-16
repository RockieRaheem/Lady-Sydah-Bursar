"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Receipt, Calendar, CreditCard, DollarSign } from "lucide-react";
import { type Payment, type Pupil, type SchoolClass } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

type StudentPaymentHistoryDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  pupil: Pupil;
  schoolClass: SchoolClass;
  payments: Payment[];
  onViewReceipt: (payment: Payment) => void;
};

export function StudentPaymentHistoryDialog({
  isOpen,
  onClose,
  pupil,
  schoolClass,
  payments,
  onViewReceipt,
}: StudentPaymentHistoryDialogProps) {
  // Sort payments by date (most recent first)
  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case "fees":
        return "default";
      case "lunch":
        return "secondary";
      case "uniform":
        return "outline";
      default:
        return "destructive";
    }
  };

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const feePayments = payments.filter((p) => p.type === "Fees");
  const otherPayments = payments.filter((p) => p.type !== "Fees");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment History - {pupil.name}
          </DialogTitle>
          <DialogDescription>
            Complete payment records for {pupil.name} in {schoolClass.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">
                    {payments.length}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total Payments
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalPaid)}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total Amount
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">
                    {feePayments.length}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Fees Payments
                </p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-orange-600" />
                  <div className="text-2xl font-bold text-orange-600">
                    {otherPayments.length}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Other Payments
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Student</p>
              <p className="font-medium">{pupil.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Class</p>
              <p className="font-medium">{schoolClass.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Guardian</p>
              <p className="font-medium">{pupil.guardianName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Balance</p>
              <p
                className={`font-medium ${
                  pupil.balance > 0 ? "text-destructive" : "text-green-600"
                }`}
              >
                {formatCurrency(pupil.balance)}
              </p>
            </div>
          </div>

          {/* Payment History Table */}
          {sortedPayments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">#</TableHead>
                    <TableHead>Receipt No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right w-[80px]">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPayments.map((payment, index) => (
                    <TableRow key={payment.id} className="hover:bg-muted/50">
                      <TableCell className="font-semibold text-primary">
                        #{sortedPayments.length - index}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {payment.receiptNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(payment.date), "MMM dd, yyyy")}
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
                            {payment.paymentMethod || "Cash"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[150px]">
                        {payment.notes ? (
                          <span className="text-sm text-muted-foreground truncate block">
                            {payment.notes}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-green-600">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewReceipt(payment)}
                        >
                          <Receipt className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Payments Yet</h3>
              <p className="text-sm text-muted-foreground">
                This student has not made any payments.
              </p>
            </div>
          )}

          {/* Footer Summary */}
          {sortedPayments.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing all {sortedPayments.length} payment
                {sortedPayments.length !== 1 ? "s" : ""}
              </p>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total Paid</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
