'use client';

import * as React from 'react';
import { PlusCircle, Search, CalendarIcon } from 'lucide-react';
import { PaymentsDataTable } from '@/components/dashboard/PaymentsDataTable';
import {
  schoolClasses,
  pupils,
  payments as allPayments,
  type Payment,
  type Pupil,
  type SchoolClass,
} from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Wallet } from 'lucide-react';
import { AddEditPaymentDialog } from '@/components/dashboard/AddEditPaymentDialog';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

export type EnrichedPayment = Payment & {
  pupilName: string;
  className: string;
  classId: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = React.useState<Payment[]>(() =>
    allPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedClass, setSelectedClass] = React.useState('all');
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<EnrichedPayment | null>(null);

  const enrichedPayments = React.useMemo(() => {
    return payments.map((payment) => {
      const pupil = pupils.find((p) => p.id === payment.pupilId) as Pupil;
      const schoolClass = schoolClasses.find((c) => c.id === pupil.classId) as SchoolClass;
      return {
        ...payment,
        pupilName: pupil.name,
        className: schoolClass.name,
        classId: schoolClass.id,
      };
    });
  }, [payments]);

  const filteredPayments = React.useMemo(() => {
    return enrichedPayments.filter((payment) => {
      const paymentDate = new Date(payment.date);
      paymentDate.setHours(0, 0, 0, 0);

      const from = dateRange?.from;
      if (from) from.setHours(0, 0, 0, 0);

      const to = dateRange?.to;
      if (to) to.setHours(0, 0, 0, 0);

      const matchesSearch = payment.pupilName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = selectedClass === 'all' || payment.classId === selectedClass;
      const matchesDate =
        !dateRange ||
        !dateRange.from ||
        (paymentDate >= from! && (!dateRange.to || paymentDate <= to!));
      
      return matchesSearch && matchesClass && matchesDate;
    });
  }, [enrichedPayments, searchTerm, selectedClass, dateRange]);
  
  const totalIncome = React.useMemo(() => {
      return filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  }, [filteredPayments]);

  const handleAddPayment = () => {
    setSelectedPayment(null);
    setIsDialogOpen(true);
  };

  const handleEditPayment = (payment: EnrichedPayment) => {
    setSelectedPayment(payment);
    setIsDialogOpen(true);
  };

  const handleDeletePayment = (paymentId: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== paymentId));
  };

  const handleDialogSave = (paymentData: Omit<Payment, 'id'> | Payment) => {
     if ('id' in paymentData) {
      setPayments((prev) =>
        prev.map((p) => (p.id === paymentData.id ? paymentData : p))
      );
    } else {
      const newPayment = { ...paymentData, id: `payment-${Date.now()}` };
      setPayments((prev) => [newPayment, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    setIsDialogOpen(false);
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">View and manage all pupil payments.</p>
        </div>
        <Button onClick={handleAddPayment}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Payment
        </Button>
      </div>

       <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Filtered Income</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total payments received in the selected period and filters
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Payment History</CardTitle>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by pupil name..."
                  className="w-full rounded-lg bg-background pl-8 sm:w-[250px] lg:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-auto">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={'outline'}
                      className={cn(
                        "w-full sm:w-[300px] justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="w-full sm:w-[200px]">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by class..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {schoolClasses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <PaymentsDataTable 
              data={filteredPayments}
              onEdit={handleEditPayment}
              onDelete={handleDeletePayment}
            />
        </CardContent>
      </Card>

      <AddEditPaymentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleDialogSave}
        payment={selectedPayment}
      />
    </div>
  );
}
