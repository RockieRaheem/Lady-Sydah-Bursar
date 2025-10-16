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
import { type Payment, type Pupil, type SchoolClass } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

type ReceiptDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment;
  pupil: Pupil;
  schoolClass: SchoolClass;
};

export function ReceiptDialog({
  isOpen,
  onClose,
  payment,
  pupil,
  schoolClass,
}: ReceiptDialogProps) {
  const receiptRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (receiptRef.current) {
      const printContent = receiptRef.current.innerHTML;
      const originalContent = document.body.innerHTML;

      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload to restore event listeners
    }
  };

  const handleDownload = () => {
    // In a real app, you would generate a PDF here
    // For now, we'll just print
    handlePrint();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Receipt</DialogTitle>
        </DialogHeader>

        <div ref={receiptRef} className="bg-white p-8 space-y-6">
          {/* School Header */}
          <div className="text-center border-b-2 border-primary pb-4">
            <h1 className="font-headline text-3xl font-bold text-primary">
              Lady Sydah Junior School
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Excellence in Education | Building Future Leaders
            </p>
            <p className="text-xs text-muted-foreground">
              P.O. Box 12345, Kampala, Uganda | Tel: +256 123 456 789
            </p>
          </div>

          {/* Receipt Title */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">PAYMENT RECEIPT</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Official Receipt for School Fees Payment
            </p>
          </div>

          {/* Receipt Details */}
          <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Receipt Number</p>
              <p className="font-bold text-lg">{payment.receiptNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Date of Payment</p>
              <p className="font-bold text-lg">
                {format(new Date(payment.date), "PPP")}
              </p>
            </div>
          </div>

          {/* Student Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">
              Student Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Student Name</p>
                <p className="font-medium">{pupil.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-medium">{schoolClass.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Guardian Name</p>
                <p className="font-medium">{pupil.guardianName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Guardian Contact
                </p>
                <p className="font-medium">{pupil.guardianContact}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">
              Payment Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Type:</span>
                <span className="font-medium">{payment.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium">
                  {payment.paymentMethod || "Cash"}
                </span>
              </div>
              {payment.notes && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Notes:</span>
                  <span className="font-medium">{payment.notes}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Received By:</span>
                <span className="font-medium">
                  {payment.receivedBy || "Bursar Office"}
                </span>
              </div>
            </div>
          </div>

          {/* Amount Summary */}
          <div className="bg-primary/10 p-6 rounded-lg space-y-3">
            <div className="flex justify-between text-lg">
              <span className="font-medium">Amount Paid:</span>
              <span className="font-bold text-2xl text-primary">
                {formatCurrency(payment.amount)}
              </span>
            </div>
            <div className="pt-3 border-t border-primary/20">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Total Paid to Date:
                </span>
                <span className="font-medium">
                  {formatCurrency(pupil.totalPaid)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Remaining Balance:
                </span>
                <span
                  className={`font-medium ${
                    pupil.balance > 0 ? "text-destructive" : "text-green-600"
                  }`}
                >
                  {formatCurrency(pupil.balance)}
                </span>
              </div>
              {pupil.bursaryType !== "None" && (
                <div className="flex justify-between text-sm mt-2 pt-2 border-t border-primary/20">
                  <span className="text-muted-foreground">
                    Bursary Applied:
                  </span>
                  <span className="font-medium text-green-600">
                    {pupil.bursaryPercentage}% ({pupil.bursaryType})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground space-y-2 pt-6 border-t">
            <p>
              This is an official receipt issued by Lady Sydah Junior School
            </p>
            <p>Please keep this receipt for your records</p>
            <p className="font-medium">Thank you for your payment!</p>
          </div>

          {/* Signature Section */}
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="text-center">
              <div className="border-t border-gray-400 pt-2 mt-12">
                <p className="text-sm font-medium">Bursar Signature</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(payment.date), "dd/MM/yyyy")}
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
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Receipt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
