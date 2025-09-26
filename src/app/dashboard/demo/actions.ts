
'use server';

import { checkSpam, type SpamCheckerInput } from '@/ai/flows/spam-checker-flow';
import { z } from 'zod';

const SpamCheckerInputSchema = z.object({
  text: z.string().describe('The text content to be analyzed for spam.'),
  threshold: z.number().min(1).max(10).optional().default(5.0).describe('The spam score threshold. Default is 5.0.'),
});

/**
 * Server action to run the spam check flow.
 */
export async function checkSpamAction(input: SpamCheckerInput) {
  try {
    const validatedInput = SpamCheckerInputSchema.parse(input);
    const result = await checkSpam(validatedInput);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Spam check action error:', error);
    return { success: false, error: error.message };
  }
}
