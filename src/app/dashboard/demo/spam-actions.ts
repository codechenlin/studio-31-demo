'use server';
/**
 * @fileOverview Server action to trigger the SpamAssassin flow.
 */
import { scanWithSpamAssassin, SpamAssassinInputSchema, type SpamAssassinInput } from '@/ai/flows/spam-assassin-flow';

export async function scanEmailForSpamAction(input: SpamAssassinInput): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const validatedInput = SpamAssassinInputSchema.parse(input);
    const result = await scanWithSpamAssassin(validatedInput);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Spam scan action error:', error);
    return { success: false, error: error.message };
  }
}
