'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { type Payment, pupils } from '@/lib/data';
import { type EnrichedPayment } from '@/app/(dashboard)/payments/page';

const paymentTypes = ['Tuition', 'Lunch', 'Uniform', 'Other'] as const;

const formSchema = z.object({
  pupilId: z.string().min(1, 'A pupil is required.'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0.'),
  date: z.date({ required_error: 'A date is required.' }),
  type: z.enum(paymentTypes),
});

type PaymentFormValues = z.infer<typeof formSchema>;

type AddEditPaymentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Payment, 'id'> | Payment) => void;
  payment: EnrichedPayment | null;
};

export function AddEditPaymentDialog({
  isOpen,
  onClose,
  onSave,
  payment,
}: AddEditPaymentDialogProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      type: 'Tuition',
    },
  });

  React.useEffect(() => {
    if (isOpen && payment) {
      form.reset({
        pupilId: payment.pupilId,
        amount: payment.amount,
        date: new Date(payment.date),
        type: payment.type,
      });
    } else if (isOpen) {
      form.reset({
        pupilId: '',
        amount: 0,
        date: new Date(),
        type: 'Tuition',
      });
    }
  }, [isOpen, payment, form]);

  const onSubmit = (data: PaymentFormValues) => {
    const dataToSave = {
      ...data,
      date: data.date.toISOString().split('T')[0], // format to YYYY-MM-DD
    };
    if (payment) {
      onSave({ ...payment, ...dataToSave });
    } else {
      onSave(dataToSave);
    }
  };

  const dialogTitle = payment ? 'Edit Payment' : 'Add New Payment';
  const dialogDescription = payment
    ? 'Update the payment details below.'
    : 'Enter the details for the new payment.';

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
              name="pupilId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pupil</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a pupil" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pupils.map((pupil) => (
                        <SelectItem key={pupil.id} value={pupil.id}>
                          {pupil.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 300000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Type</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Payment</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Payment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
