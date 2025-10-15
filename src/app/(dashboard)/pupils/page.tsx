'use client';

import * as React from 'react';
import { UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PupilsDataTable } from '@/components/dashboard/PupilsDataTable';
import { pupils as allPupils, type Pupil, schoolClasses } from '@/lib/data';
import { AddEditPupilDialog } from '@/components/dashboard/AddEditPupilDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PupilsPage() {
  const [pupils, setPupils] = React.useState<Pupil[]>(allPupils);
  const [filteredPupils, setFilteredPupils] = React.useState<Pupil[]>(allPupils);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedPupil, setSelectedPupil] = React.useState<Pupil | null>(null);
  const [selectedClass, setSelectedClass] = React.useState<string>('all');

  React.useEffect(() => {
    if (selectedClass === 'all') {
      setFilteredPupils(pupils);
    } else {
      setFilteredPupils(pupils.filter((p) => p.classId === selectedClass));
    }
  }, [selectedClass, pupils]);

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
  
  const handleDialogSave = (pupilData: Omit<Pupil, 'id'> | Pupil) => {
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
          <h1 className="font-headline text-3xl font-bold tracking-tight">Pupils</h1>
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
          <div className="flex items-center justify-between">
            <CardTitle>All Pupils</CardTitle>
            <div className="w-[200px]">
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
        </CardHeader>
        <CardContent>
          <PupilsDataTable
            data={filteredPupils}
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
        classId={selectedPupil?.classId || schoolClasses[0]?.id}
      />
    </div>
  );
}
