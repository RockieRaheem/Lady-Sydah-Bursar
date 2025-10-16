"use client";

import * as React from "react";
import { UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PupilsDataTable } from "@/components/dashboard/PupilsDataTable";
import { type Pupil, type Payment } from "@/lib/data";
import { AddEditPupilDialog } from "@/components/dashboard/AddEditPupilDialog";
import { AddEditPaymentDialog } from "@/components/dashboard/AddEditPaymentDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useGlobalState } from "@/lib/global-state";
import { useRouter } from "next/navigation";

export default function PupilsPage() {
  const router = useRouter();
  const { pupils, setPupils, schoolClasses, payments, setPayments } =
    useGlobalState();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
  const [selectedPupil, setSelectedPupil] = React.useState<Pupil | null>(null);
  const [selectedClass, setSelectedClass] = React.useState<string>("all");
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredPupils = React.useMemo(() => {
    let filtered = pupils;

    if (selectedClass !== "all") {
      filtered = filtered.filter((p) => p.classId === selectedClass);
    }

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [selectedClass, pupils, searchTerm]);

  const handleAddPupil = () => {
    setSelectedPupil(null);
    setIsDialogOpen(true);
  };

  const handleEditPupil = (pupil: Pupil) => {
    setSelectedPupil(pupil);
    setIsDialogOpen(true);
  };

  const handleDeletePupil = (pupilId: string) => {
    setPupils((prev) => prev.filter((p) => p.id !== pupilId));
  };

  const handleMakePayment = (pupil: Pupil) => {
    setSelectedPupil(pupil);
    setIsPaymentDialogOpen(true);
  };

  const handleDialogSave = (pupilData: Omit<Pupil, "id"> | Pupil) => {
    if ("id" in pupilData) {
      // Editing existing pupil
      setPupils((prev) =>
        prev.map((p) => (p.id === pupilData.id ? pupilData : p))
      );
    } else {
      // Adding new pupil
      const newPupil = { ...pupilData, id: `pupil-${Date.now()}` };
      setPupils((prev) => [...prev, newPupil]);
    }
    setIsDialogOpen(false);
  };

  const handlePaymentSave = (paymentData: Omit<Payment, "id"> | Payment) => {
    if (!("id" in paymentData)) {
      // Adding new payment
      const receiptNumber = `RCP-${new Date().getFullYear()}-${String(
        payments.length + 1
      ).padStart(3, "0")}`;
      const newPayment = {
        ...paymentData,
        id: `payment-${Date.now()}`,
        receiptNumber,
      };
      setPayments((prev) =>
        [newPayment, ...prev].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );

      // Update pupil balance
      setPupils((prevPupils) =>
        prevPupils.map((p) =>
          p.id === newPayment.pupilId
            ? {
                ...p,
                totalPaid: p.totalPaid + newPayment.amount,
                balance: p.balance - newPayment.amount,
              }
            : p
        )
      );
    }
    setIsPaymentDialogOpen(false);
    setSelectedPupil(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Pupils
          </h1>
          <p className="text-muted-foreground">
            Manage all pupils across the school.
          </p>
        </div>
        <Button onClick={handleAddPupil}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Pupil
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Pupils</CardTitle>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name..."
                  className="w-full rounded-lg bg-background pl-8 sm:w-[250px] lg:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
          <PupilsDataTable
            data={filteredPupils}
            onEdit={handleEditPupil}
            onDelete={handleDeletePupil}
            onMakePayment={handleMakePayment}
          />
        </CardContent>
      </Card>

      <AddEditPupilDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleDialogSave}
        pupil={selectedPupil}
        classId={
          selectedClass !== "all"
            ? selectedClass
            : selectedPupil?.classId || schoolClasses[0]?.id
        }
      />

      {selectedPupil && (
        <AddEditPaymentDialog
          isOpen={isPaymentDialogOpen}
          onClose={() => {
            setIsPaymentDialogOpen(false);
            setSelectedPupil(null);
          }}
          onSave={handlePaymentSave}
          payment={
            {
              pupilId: selectedPupil.id,
              pupilName: selectedPupil.name,
              className:
                schoolClasses.find((c) => c.id === selectedPupil.classId)
                  ?.name || "",
              classId: selectedPupil.classId,
            } as any
          }
        />
      )}
    </div>
  );
}
