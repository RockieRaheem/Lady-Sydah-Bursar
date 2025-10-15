import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, DollarSign, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

type ClassCardProps = {
  name: string;
  pupilCount: number;
  totalCollected: number;
  href: string;
};

export function ClassCard({ name, pupilCount, totalCollected, href }: ClassCardProps) {
  return (
    <Link href={href} legacyBehavior={false} className="group block h-full">
        <Card className="h-full transition-all duration-200 ease-in-out group-hover:border-primary group-hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-headline text-xl">{name}</CardTitle>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm">{pupilCount} Pupils</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(totalCollected)}
              </span>
            </div>
            <CardDescription>Total collected</CardDescription>
          </CardContent>
        </Card>
    </Link>
  );
}
