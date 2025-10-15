'use client';

import * as React from 'react';
import Link from 'next/link';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { Pupil } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type PupilsDataTableProps = {
  data: Pupil[];
  onEdit: (pupil: Pupil) => void;
  onDelete: (pupilId: string) => void;
};

export function PupilsDataTable({
  data,
  onEdit,
  onDelete,
}: PupilsDataTableProps) {
  const [deleteTarget, setDeleteTarget] = React.useState<Pupil | null>(null);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Guardian</TableHead>
              <TableHead>Guardian Contact</TableHead>
              <TableHead className="text-right">Balance Due</TableHead>
              <TableHead className="w-[50px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((pupil) => (
                <TableRow key={pupil.id}>
                  <TableCell className="font-medium">
                     <Link href={`/dashboard/pupils/${pupil.id}`} className="hover:underline text-primary">
                        {pupil.name}
                    </Link>
                  </TableCell>
                  <TableCell>{pupil.guardianName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {pupil.guardianContact}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(pupil.totalDue)}
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
                <TableCell colSpan={5} className="h-24 text-center">
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
              This action cannot be undone. This will permanently delete the pupil record for{' '}
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
