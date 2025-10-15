import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function PupilsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Pupils</h1>
        <p className="text-muted-foreground">Manage pupil registration and information.</p>
      </div>
      <Card className="flex flex-1 items-center justify-center border-dashed">
        <CardContent className="p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          <CardTitle className="font-headline">Pupil Management</CardTitle>
          <p className="text-muted-foreground mt-2">This section is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
