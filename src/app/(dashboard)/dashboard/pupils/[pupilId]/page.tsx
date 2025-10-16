"use client";

import * as React from "react";
import { notFound, useRouter } from "next/navigation";
import { useGlobalState } from "@/lib/global-state";
import {
  type Payment,
  type Pupil,
  calculateExpectedFee,
  getPaymentStatus,
} from "@/lib/data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  Phone,
  Wallet,
  Gift,
  DollarSign,
  FileText,
  Receipt,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { type EnrichedPayment } from "@/app/(dashboard)/dashboard/payments/page";
import { ReceiptDialog } from "@/components/dashboard/ReceiptDialog";
import { StudentReportDialog } from "@/components/dashboard/StudentReportDialog";
import { PaymentHistoryCard } from "@/components/dashboard/PaymentHistoryCard";

type EnrichedPupil = Pupil & {
  className: string;
  expectedFee: number;
};

export default function PupilDetailsPage({
  params,
}: {
  params: { pupilId: string };
}) {
  const router = useRouter();
  const { pupilId } = params;
  const { pupils, payments, getClassById, schoolClasses } = useGlobalState();

  const [pupil, setPupil] = React.useState<EnrichedPupil | null>(null);
  const [pupilPayments, setPupilPayments] = React.useState<EnrichedPayment[]>(
    []
  );
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(
    null
  );
  const [showReceipt, setShowReceipt] = React.useState(false);
  const [showReport, setShowReport] = React.useState(false);

  React.useEffect(() => {
    const foundPupil = pupils.find((p) => p.id === pupilId);
    if (foundPupil) {
      const schoolClass = getClassById(foundPupil.classId);
      const expectedFee = schoolClass
        ? calculateExpectedFee(foundPupil, schoolClass)
        : 0;
      setPupil({
        ...foundPupil,
        className: schoolClass?.name || "N/A",
        expectedFee,
      });

      const relatedPayments = payments
        .filter((p) => p.pupilId === pupilId)
        .map((payment) => ({
          ...payment,
          pupilName: foundPupil.name,
          className: schoolClass?.name || "N/A",
          classId: foundPupil.classId,
        }))
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      setPupilPayments(relatedPayments);
    }
  }, [pupilId, pupils, payments, getClassById, schoolClasses]);

  if (!pupil) {
    // Gracefully handle the case where the pupil might not be found immediately
    // You could show a loader here
    const pupilExists = pupils.some((p) => p.id === pupilId);
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

  const paymentStatus = getPaymentStatus(pupil);
  const statusColor =
    paymentStatus === "Paid"
      ? "text-green-600"
      : paymentStatus === "Pending"
      ? "text-destructive"
      : "text-orange-600";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex-1">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            {pupil.name}
          </h1>
          <p className="text-muted-foreground">
            Payment history and details for {pupil.name}.
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowReport(true)}>
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Fee</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(pupil.expectedFee)}
            </div>
            {pupil.bursaryType !== "None" && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Gift className="h-3 w-3 text-green-600" />
                {pupil.bursaryPercentage}% bursary applied
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(pupil.totalPaid)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {pupilPayments.length} payment
              {pupilPayments.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                pupil.balance > 0 ? "text-destructive" : "text-green-600"
              }`}
            >
              {formatCurrency(pupil.balance)}
            </div>
            <p className={`text-xs ${statusColor} mt-1 font-medium`}>
              {paymentStatus}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pupil.className}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pupil Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Guardian</p>
                <p className="font-medium">{pupil.guardianName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Phone className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Guardian Contact
                </p>
                <p className="font-medium">{pupil.guardianContact}</p>
              </div>
            </div>
            {pupil.bursaryType !== "None" && (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Gift className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Bursary Type
                    </p>
                    <p className="font-medium">
                      {pupil.bursaryType} ({pupil.bursaryPercentage}%)
                    </p>
                  </div>
                </div>
                {pupil.bursaryReason && (
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                      <Gift className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Bursary Reason
                      </p>
                      <p className="font-medium">{pupil.bursaryReason}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              Complete record of all {pupilPayments.length} payment
              {pupilPayments.length !== 1 ? "s" : ""} made by this pupil
            </CardDescription>
          </div>
          {pupilPayments.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Payments</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  pupilPayments.reduce((sum, p) => sum + p.amount, 0)
                )}
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Receipt #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right w-[100px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pupilPayments.length > 0 ? (
                  pupilPayments.map((payment, index) => (
                    <TableRow key={payment.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">
                        {payment.receiptNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {new Date(payment.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Payment #{pupilPayments.length - index}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(payment.type)}>
                          {payment.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {payment.paymentMethod || "Cash"}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        {payment.notes ? (
                          <span className="text-sm text-muted-foreground truncate block">
                            {payment.notes}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            No notes
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowReceipt(true);
                          }}
                        >
                          <Receipt className="mr-2 h-4 w-4" />
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No payments recorded for this pupil yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Payment History with Full Details */}
      <PaymentHistoryCard
        payments={pupilPayments}
        pupil={pupil}
        schoolClass={getClassById(pupil.classId)!}
        onViewReceipt={(payment) => {
          setSelectedPayment(payment);
          setShowReceipt(true);
        }}
      />

      {/* Receipt Dialog */}
      {selectedPayment && (
        <ReceiptDialog
          isOpen={showReceipt}
          onClose={() => {
            setShowReceipt(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
          pupil={pupil}
          schoolClass={getClassById(pupil.classId)!}
        />
      )}

      {/* Student Report Dialog */}
      <StudentReportDialog
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        pupil={pupil}
        schoolClass={getClassById(pupil.classId)!}
        payments={pupilPayments}
      />
    </div>
  );
}
