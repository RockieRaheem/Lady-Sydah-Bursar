'use client';

import { useState } from 'react';
import { Bot, Loader2, Sparkles } from 'lucide-react';

import {
  prioritizeFinancialSummaries,
  type FinancialDataInput,
} from '@/ai/flows/financial-report-ai-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function AiReport({ initialData }: { initialData: FinancialDataInput }) {
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setLoading(true);
    setSummaries([]);
    try {
      const result = await prioritizeFinancialSummaries(initialData);
      if (result?.prioritizedSummaries) {
        setSummaries(result.prioritizedSummaries);
      }
    } catch (error) {
      console.error('AI report generation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate AI insights. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="font-headline flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Financial Advisor
            </CardTitle>
            <CardDescription>
              Let AI analyze the data and provide prioritized insights.
            </CardDescription>
          </div>
          <Button onClick={handleGenerateReport} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Bot className="mr-2 h-4 w-4" />
            )}
            Get Insights
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center rounded-md border border-dashed p-8">
            <div className="text-center text-muted-foreground">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
              <p className="mt-2">Analyzing financial data...</p>
            </div>
          </div>
        )}
        {!loading && summaries.length === 0 && (
          <div className="flex items-center justify-center rounded-md border border-dashed p-8">
            <div className="text-center text-muted-foreground">
              <Bot className="mx-auto h-8 w-8" />
              <p className="mt-2">Click "Get Insights" to generate a report.</p>
            </div>
          </div>
        )}
        {!loading && summaries.length > 0 && (
          <div className="space-y-4 rounded-md border bg-muted/30 p-4">
            <ul className="space-y-3">
              {summaries.map((summary, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm">{summary}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
