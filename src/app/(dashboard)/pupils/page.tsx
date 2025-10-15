'use client';

import * as React from 'react';
import { UserPlus, Search } from 'lucide-react';

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
import { Input } from '@/components/ui/input';

export default function PupilsPage() {
  const [pupils, setPupils] = React.useState<Pupil[]>(allPupils);
  const [filteredPupils, setFilteredPupils] = React.useState<Pupil[]>(allPupils);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedPupil, setSelectedPupil] = React.useState<Pupil | null>(null);
  const [selectedClass, setSelectedClass] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    let filtered = pupils;

    if (selectedClass !== 'all') {
      filtered = filtered.filter((p) => p.classId === selectedClass);
    }

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPupils(filtered);
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Pupils</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name..."
                  className="w-full rounded-lg bg-background pl-8 sm:w-[200px] lg:w-[250px]"
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
