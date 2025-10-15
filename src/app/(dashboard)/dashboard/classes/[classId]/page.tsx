'use client';

import * as React from 'react';
import { notFound } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PupilsDataTable } from '@/components/dashboard/PupilsDataTable';
import { getClassById, getPupilsByClass, Pupil } from '@/lib/data';
import { AddEditPupilDialog } from '@/components/dashboard/AddEditPupilDialog';

export default function ClassDetailsPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = React.use(params);
  const [pupils, setPupils] = React.useState<Pupil[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedPupil, setSelectedPupil] = React.useState<Pupil | null>(null);

  const schoolClass = getClassById(classId);

  React.useEffect(() => {
    if (schoolClass) {
      setPupils(getPupilsByClass(schoolClass.id));
    }
  }, [schoolClass]);

  if (!schoolClass) {
    notFound();
  }

  const handleAddPupil = () => {
    setSelectedPupil(null);
    setIsDialogOpen(true);
  };

  const handleEditPupil = (pupil: Pupil) => {
    setSelectedPupil(pupil);
    setIsDialogOpen(true);
  };

  const handleDeletePupil = (pupilId: string) => {
    // In a real app, you would have an API call here.
    // For now, we just update the local state.
    setPupils((prev) => prev.filter((p) => p.id !== pupilId));
  };
  
  const handleDialogSave = (pupilData: Omit<Pupil, 'id'> | Pupil) => {
    // In a real app, you would have an API call here.
    // For now, we just update the local state.
    if ('id' in pupilData) {
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            {schoolClass.name}
          </h1>
          <p className="text-muted-foreground">
            Manage pupils in {schoolClass.name}.
          </p>
        </div>
        <Button onClick={handleAddPupil}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Pupil
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pupil List</CardTitle>
        </CardHeader>
        <CardContent>
          <PupilsDataTable
            data={pupils}
            onEdit={handleEditPupil}
            onDelete={handleDeletePupil}
          />
        </CardContent>
      </Card>

      <AddEditPupilDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleDialogSave}
        pupil={selectedPupil}
        classId={schoolClass.id}
      />
    </div>
  );
}
