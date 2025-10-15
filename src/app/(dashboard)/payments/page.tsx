import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">View and manage all pupil payments.</p>
      </div>
      <Card className="flex flex-1 items-center justify-center border-dashed">
        <CardContent className="p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
          <CardTitle className="font-headline">Payments Page</CardTitle>
          <p className="text-muted-foreground mt-2">This section is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
