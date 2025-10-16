"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Trash2, Receipt } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { type EnrichedPayment } from "@/app/(dashboard)/dashboard/payments/page";
import { ReceiptDialog } from "./ReceiptDialog";
import { useGlobalState } from "@/lib/global-state";

type PaymentsDataTableProps = {
  data: EnrichedPayment[];
  onEdit: (payment: EnrichedPayment) => void;
  onDelete: (paymentId: string) => void;
};

export function PaymentsDataTable({
  data,
  onEdit,
  onDelete,
}: PaymentsDataTableProps) {
  const { pupils, schoolClasses } = useGlobalState();
  const [deleteTarget, setDeleteTarget] =
    React.useState<EnrichedPayment | null>(null);
  const [receiptTarget, setReceiptTarget] =
    React.useState<EnrichedPayment | null>(null);
  const [showReceipt, setShowReceipt] = React.useState(false);

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

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pupil Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.pupilName}
                  </TableCell>
                  <TableCell>{payment.className}</TableCell>
                  <TableCell>
                    {new Date(payment.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(payment.type)}>
                      {payment.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setReceiptTarget(payment);
                            setShowReceipt(true);
                          }}
                        >
                          <Receipt className="mr-2 h-4 w-4" />
                          View Receipt
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(payment)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteTarget(payment)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              payment record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) {
                  onDelete(deleteTarget.id);
                  setDeleteTarget(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Receipt Dialog */}
      {receiptTarget && (
        <ReceiptDialog
          isOpen={showReceipt}
          onClose={() => {
            setShowReceipt(false);
            setReceiptTarget(null);
          }}
          payment={receiptTarget}
          pupil={pupils.find((p) => p.id === receiptTarget.pupilId)!}
          schoolClass={
            schoolClasses.find((c) => c.id === receiptTarget.classId)!
          }
        />
      )}
    </>
  );
}
