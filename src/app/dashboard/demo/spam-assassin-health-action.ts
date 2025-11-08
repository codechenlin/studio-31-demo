'use server';
/**
 * @fileOverview Server action to trigger the SpamAssassin health check flow.
 */
import { checkSpamAssassinHealth } from '@/ai/flows/spam-assassin-health-check-flow';

export async function checkSpamAssassinHealthAction(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const result = await checkSpamAssassinHealth();
    return { success: true, data: result };
  } catch (error: any) {
    console.error('SpamAssassin health check action error:', error);
    return { success: false, error: error.message };
  }
}
