"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type Pupil, type BursaryType, calculateExpectedFee } from "@/lib/data";
import { useGlobalState } from "@/lib/global-state";
import { formatCurrency } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  guardianName: z.string().min(2, "Guardian's name is required."),
  guardianContact: z.string().min(10, "Enter a valid contact number."),
  classId: z.string(),
  bursaryType: z.enum(["None", "Partial", "Full"] as const),
  bursaryPercentage: z.coerce.number().min(0).max(100),
  bursaryReason: z.string().optional(),
});

type PupilFormValues = z.infer<typeof formSchema>;

type AddEditPupilDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Pupil, "id"> | Pupil) => void;
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
  const { schoolClasses } = useGlobalState();

  const form = useForm<PupilFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      guardianName: "",
      guardianContact: "",
      classId: classId,
      bursaryType: "None",
      bursaryPercentage: 0,
      bursaryReason: "",
    },
  });

  const watchBursaryType = form.watch("bursaryType");
  const watchClassId = form.watch("classId");
  const watchBursaryPercentage = form.watch("bursaryPercentage");

  React.useEffect(() => {
    if (watchBursaryType === "None") {
      form.setValue("bursaryPercentage", 0);
    } else if (watchBursaryType === "Full") {
      form.setValue("bursaryPercentage", 100);
    }
  }, [watchBursaryType, form]);

  React.useEffect(() => {
    if (isOpen && pupil) {
      form.reset({
        name: pupil.name,
        guardianName: pupil.guardianName,
        guardianContact: pupil.guardianContact,
        classId: pupil.classId,
        bursaryType: pupil.bursaryType,
        bursaryPercentage: pupil.bursaryPercentage,
        bursaryReason: pupil.bursaryReason || "",
      });
    } else if (isOpen) {
      form.reset({
        name: "",
        guardianName: "",
        guardianContact: "",
        classId: classId,
        bursaryType: "None",
        bursaryPercentage: 0,
        bursaryReason: "",
      });
    }
  }, [isOpen, pupil, classId, form]);

  const selectedClass = schoolClasses.find((c) => c.id === watchClassId);
  const baseFee = selectedClass?.termlyFee || 0;
  const discount = (baseFee * watchBursaryPercentage) / 100;
  const expectedFee = baseFee - discount;

  const onSubmit = (data: PupilFormValues) => {
    const selectedClass = schoolClasses.find((c) => c.id === data.classId);
    const expectedFee = calculateExpectedFee(
      {
        ...data,
        id: "",
        totalPaid: 0,
        balance: 0,
        bursaryType: data.bursaryType,
        bursaryPercentage: data.bursaryPercentage,
      } as Pupil,
      selectedClass!
    );

    if (pupil) {
      // Keep existing payment history
      onSave({
        ...pupil,
        ...data,
        // Recalculate balance based on new expected fee
        balance: expectedFee - pupil.totalPaid,
      });
    } else {
      // New pupil starts with no payments
      onSave({
        ...data,
        totalPaid: 0,
        balance: expectedFee,
      });
    }
  };

  const dialogTitle = pupil ? "Edit Pupil" : "Add New Pupil";
  const dialogDescription = pupil
    ? "Update the pupil's information below."
    : "Enter the details for the new pupil.";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
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
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {schoolClasses.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name} - {formatCurrency(cls.termlyFee)}
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
                    <Input placeholder="e.g. 0712345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
              <h4 className="font-medium text-sm">Bursary/Financial Aid</h4>

              <FormField
                control={form.control}
                name="bursaryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bursary Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Partial">Partial Bursary</SelectItem>
                        <SelectItem value="Full">Full Bursary</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchBursaryType === "Partial" && (
                <FormField
                  control={form.control}
                  name="bursaryPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Percentage</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter percentage (0-100)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {watchBursaryType !== "None" && (
                <FormField
                  control={form.control}
                  name="bursaryReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Bursary</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. Single parent household, Sibling discount, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Fee:</span>
                  <span className="font-medium">{formatCurrency(baseFee)}</span>
                </div>
                {watchBursaryPercentage > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({watchBursaryPercentage}%):</span>
                    <span className="font-medium">
                      -{formatCurrency(discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-1">
                  <span className="font-medium">Expected Fee:</span>
                  <span className="font-bold">
                    {formatCurrency(expectedFee)}
                  </span>
                </div>
              </div>
            </div>

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
