'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pupil } from '@/lib/data';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  guardianName: z.string().min(2, "Guardian's name is required."),
  guardianContact: z.string().min(10, 'Enter a valid contact number.'),
  totalDue: z.coerce.number().min(0, 'Amount must be a positive number.'),
  classId: z.string(),
});

type PupilFormValues = z.infer<typeof formSchema>;

type AddEditPupilDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Pupil, 'id'> | Pupil) => void;
  pupil: Pupil | null;
  classId: string;
};

export function AddEditPupilDialog({
  isOpen,
  onClose,
  onSave,
  pupil,
  classId,
}: AddEditPupilDialogProps) {
  const form = useForm<PupilFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '',
        guardianName: '',
        guardianContact: '',
        totalDue: 0,
        classId: classId,
    },
  });

  React.useEffect(() => {
    if (isOpen && pupil) {
      form.reset({
        name: pupil.name,
        guardianName: pupil.guardianName,
        guardianContact: pupil.guardianContact,
        totalDue: pupil.totalDue,
        classId: pupil.classId,
      });
    } else if (isOpen) {
      form.reset({
        name: '',
        guardianName: '',
        guardianContact: '',
        totalDue: 0,
        classId: classId,
      });
    }
  }, [isOpen, pupil, classId, form]);

  const onSubmit = (data: PupilFormValues) => {
    if (pupil) {
      onSave({ ...pupil, ...data });
    } else {
      onSave(data);
    }
  };

  const dialogTitle = pupil ? 'Edit Pupil' : 'Add New Pupil';
  const dialogDescription = pupil
    ? "Update the pupil's information below."
    : 'Enter the details for the new pupil.';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pupil Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="guardianName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guardian&apos;s Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="guardianContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guardian&apos;s Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 123-456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="totalDue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance Due</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 500000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Pupil</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
