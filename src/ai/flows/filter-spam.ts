'use server';

/**
 * @fileOverview Filters out potential spam emails using an LLM.
 *
 * - filterSpam - A function that filters an email to determine if it is spam.
 * - FilterSpamInput - The input type for the filterSpam function.
 * - FilterSpamOutput - The return type for the filterSpam function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FilterSpamInputSchema = z.object({
  sender: z.string().email().describe('The email address of the sender.'),
  subject: z.string().describe('The subject line of the email.'),
  body: z.string().describe('The content of the email.'),
});
export type FilterSpamInput = z.infer<typeof FilterSpamInputSchema>;

const FilterSpamOutputSchema = z.object({
  isSpam: z.boolean().describe('Whether the email is likely to be spam.'),
  reason: z.string().optional().describe('The reason the email is considered spam.'),
});
export type FilterSpamOutput = z.infer<typeof FilterSpamOutputSchema>;

export async function filterSpam(input: FilterSpamInput): Promise<FilterSpamOutput> {
  return filterSpamFlow(input);
}

const filterSpamPrompt = ai.definePrompt({
  name: 'filterSpamPrompt',
  input: {schema: FilterSpamInputSchema},
  output: {schema: FilterSpamOutputSchema},
  prompt: `You are an email spam filter.  You will receive the sender, subject, and body of an email.  You will respond with whether or not the email is spam.

Sender: {{{sender}}}
Subject: {{{subject}}}
Body: {{{body}}}

Is this email spam? Provide a reason.`,
});

const filterSpamFlow = ai.defineFlow(
  {
    name: 'filterSpamFlow',
    inputSchema: FilterSpamInputSchema,
    outputSchema: FilterSpamOutputSchema,
  },
  async input => {
    const {output} = await filterSpamPrompt(input);
    return output!;
  }
);
