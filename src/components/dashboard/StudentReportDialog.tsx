"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import {
  type Pupil,
  type SchoolClass,
  type Payment,
  calculateExpectedFee,
  getPaymentStatus,
} from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

type StudentReportDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  pupil: Pupil;
  schoolClass: SchoolClass;
  payments: Payment[];
};

export function StudentReportDialog({
  isOpen,
  onClose,
  pupil,
  schoolClass,
  payments,
}: StudentReportDialogProps) {
  const reportRef = React.useRef<HTMLDivElement>(null);

  const expectedFee = calculateExpectedFee(pupil, schoolClass);
  const paymentStatus = getPaymentStatus(pupil);

  // Group payments by type
  const paymentsByType = payments.reduce((acc, payment) => {
    if (!acc[payment.type]) {
      acc[payment.type] = [];
    }
    acc[payment.type].push(payment);
    return acc;
  }, {} as Record<string, Payment[]>);

  const totalByType = Object.entries(paymentsByType).map(
    ([type, payments]) => ({
      type,
      total: payments.reduce((sum, p) => sum + p.amount, 0),
      count: payments.length,
    })
  );

  const handlePrint = () => {
    if (reportRef.current) {
      const printContent = reportRef.current.innerHTML;
      const originalContent = document.body.innerHTML;

      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Financial Report</DialogTitle>
        </DialogHeader>

        <div ref={reportRef} className="bg-white p-8 space-y-6">
          {/* School Header */}
          <div className="text-center border-b-2 border-primary pb-4">
            <h1 className="font-headline text-3xl font-bold text-primary">
              Lady Sydah Junior School
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Excellence in Education | Building Future Leaders
            </p>
          </div>

          {/* Report Title */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">STUDENT FINANCIAL REPORT</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Generated on {format(new Date(), "PPP")}
            </p>
          </div>

          {/* Student Information */}
          <div className="bg-muted/30 p-6 rounded-lg space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Student Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Student Name</p>
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
                <p className="text-xs text-muted-foreground">Contact</p>
                <p className="font-medium">{pupil.guardianContact}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payment Status</p>
                <p
                  className={`font-medium ${
                    paymentStatus === "Paid"
                      ? "text-green-600"
                      : paymentStatus === "Pending"
                      ? "text-destructive"
                      : "text-orange-600"
                  }`}
                >
                  {paymentStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Fee Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Fee Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-muted-foreground">Base Class Fee</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(schoolClass.termlyFee)}
                </p>
              </div>
              {pupil.bursaryType !== "None" && (
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-sm text-muted-foreground">
                    Bursary ({pupil.bursaryPercentage}%)
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    -
                    {formatCurrency(
                      (schoolClass.termlyFee * pupil.bursaryPercentage) / 100
                    )}
                  </p>
                  {pupil.bursaryReason && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {pupil.bursaryReason}
                    </p>
                  )}
                </div>
              )}
              <div className="bg-purple-50 p-4 rounded">
                <p className="text-sm text-muted-foreground">Expected Fee</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(expectedFee)}
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded">
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-amber-600">
                  {formatCurrency(pupil.totalPaid)}
                </p>
              </div>
              <div
                className={`p-4 rounded ${
                  pupil.balance > 0 ? "bg-red-50" : "bg-green-50"
                }`}
              >
                <p className="text-sm text-muted-foreground">Balance</p>
                <p
                  className={`text-2xl font-bold ${
                    pupil.balance > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {formatCurrency(pupil.balance)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Breakdown by Type */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">
              Payment Breakdown by Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {totalByType.map(({ type, total, count }) => (
                <div key={type} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{type}</p>
                      <p className="text-xs text-muted-foreground">
                        {count} payment{count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <p className="text-lg font-bold">{formatCurrency(total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">
              Payment History ({payments.length} transactions)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Receipt #</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Method</th>
                    <th className="p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="p-2 font-mono text-xs">
                        {payment.receiptNumber}
                      </td>
                      <td className="p-2">
                        {format(new Date(payment.date), "dd/MM/yyyy")}
                      </td>
                      <td className="p-2">{payment.type}</td>
                      <td className="p-2 text-xs">
                        {payment.paymentMethod || "Cash"}
                      </td>
                      <td className="p-2 text-right font-medium">
                        {formatCurrency(payment.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted font-bold">
                  <tr>
                    <td colSpan={4} className="p-2 text-right">
                      Total:
                    </td>
                    <td className="p-2 text-right">
                      {formatCurrency(pupil.totalPaid)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground space-y-2 pt-6 border-t">
            <p>
              This is an official financial report issued by Lady Sydah Junior
              School
            </p>
            <p>For any queries, please contact the Bursar's Office</p>
          </div>

          {/* Signature Section */}
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="text-center">
              <div className="border-t border-gray-400 pt-2 mt-12">
                <p className="text-sm font-medium">Bursar Signature</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 pt-2 mt-12">
                <p className="text-sm font-medium">School Stamp</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t print:hidden">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
