'use server';

/**
 * @fileOverview This file defines a Genkit flow for prioritizing financial summaries using AI.
 *
 * - prioritizeFinancialSummaries - A function that takes financial data as input and returns a prioritized list of summaries.
 * - FinancialDataInput - The input type for the prioritizeFinancialSummaries function.
 * - PrioritizedSummariesOutput - The return type for the prioritizeFinancialSummaries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialDataInputSchema = z.object({
  totalIncome: z.number().describe('Total income from all sources.'),
  totalExpenses: z.number().describe('Total expenses incurred.'),
  netBalance: z.number().describe('Net balance (income - expenses).'),
  classWiseIncome: z.record(z.string(), z.number()).describe('Income breakdown for each class.'),
});
export type FinancialDataInput = z.infer<typeof FinancialDataInputSchema>;

const PrioritizedSummariesOutputSchema = z.object({
  prioritizedSummaries: z.array(
    z.string().describe('A prioritized list of financial summaries.')
  ).describe('The prioritized financial summaries based on relevance.'),
});
export type PrioritizedSummariesOutput = z.infer<typeof PrioritizedSummariesOutputSchema>;

export async function prioritizeFinancialSummaries(
  input: FinancialDataInput
): Promise<PrioritizedSummariesOutput> {
  return prioritizeFinancialSummariesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeFinancialSummariesPrompt',
  input: {schema: FinancialDataInputSchema},
  output: {schema: PrioritizedSummariesOutputSchema},
  prompt: `You are an expert financial analyst for Lady Sydah Junior School. Your task is to prioritize the following financial summaries based on their relevance and potential anomalies, helping the bursar quickly understand the school's financial status. Highlight any significant trends or unusual data points.

Financial Data:
Total Income: {{{totalIncome}}}
Total Expenses: {{{totalExpenses}}}
Net Balance: {{{netBalance}}}
Class-wise Income: {{{classWiseIncome}}}

Prioritize the summaries in a numbered list, starting with the most important. Each summary should be a concise sentence.
Consider these factors when prioritizing:
- Significant changes compared to previous periods.
- Unexpected income or expense fluctuations.
- Classes with notably high or low income.
- Overall financial health of the school.

Output:
`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const prioritizeFinancialSummariesFlow = ai.defineFlow(
  {
    name: 'prioritizeFinancialSummariesFlow',
    inputSchema: FinancialDataInputSchema,
    outputSchema: PrioritizedSummariesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
