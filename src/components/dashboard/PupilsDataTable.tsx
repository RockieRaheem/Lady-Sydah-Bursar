"use client";

import * as React from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2, Gift, DollarSign } from "lucide-react";
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
import type { Pupil } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getPaymentStatus } from "@/lib/data";

type PupilsDataTableProps = {
  data: Pupil[];
  onEdit: (pupil: Pupil) => void;
  onDelete: (pupilId: string) => void;
  onMakePayment: (pupil: Pupil) => void;
};

export function PupilsDataTable({
  data,
  onEdit,
  onDelete,
  onMakePayment,
}: PupilsDataTableProps) {
  const [deleteTarget, setDeleteTarget] = React.useState<Pupil | null>(null);

  const getStatusBadge = (pupil: Pupil) => {
    const status = getPaymentStatus(pupil);
    const variants: Record<
      typeof status,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      Paid: "default",
      Partial: "secondary",
      Pending: "destructive",
      Overpaid: "outline",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Guardian</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Quick Action</TableHead>
              <TableHead className="w-[50px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((pupil) => (
                <TableRow key={pupil.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/pupils/${pupil.id}`}
                      legacyBehavior={false}
                      className="hover:underline text-primary"
                    >
                      {pupil.name}
                      {pupil.bursaryType !== "None" && (
                        <Gift className="inline-block ml-2 h-3 w-3 text-green-600" />
                      )}
                    </Link>
                  </TableCell>
                  <TableCell>{pupil.guardianName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {pupil.guardianContact}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(pupil.totalPaid)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-mono ${
                      pupil.balance > 0 ? "text-destructive" : "text-green-600"
                    }`}
                  >
                    {formatCurrency(pupil.balance)}
                  </TableCell>
                  <TableCell>{getStatusBadge(pupil)}</TableCell>
                  <TableCell className="text-center">
                    {pupil.balance > 0 ? (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onMakePayment(pupil)}
                        className="gap-1"
                      >
                        <DollarSign className="h-3 w-3" />
                        Make Payment
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-green-600">
                        Paid
                      </Badge>
                    )}
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
                        <DropdownMenuItem onClick={() => onEdit(pupil)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteTarget(pupil)}
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
                <TableCell colSpan={8} className="h-24 text-center">
                  No pupils found for this class.
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
              pupil record for{" "}
              <span className="font-bold">{deleteTarget?.name}</span>.
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
    </>
  );
}
