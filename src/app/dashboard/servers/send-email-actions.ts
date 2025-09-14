
'use server';

import { 
    sendTestEmail, 
    type SendTestEmailInput 
} from '@/ai/flows/send-test-email-flow';
import { SendTestEmailInputSchema } from '@/ai/flows/send-test-email-flow';


export async function sendTestEmailAction(input: SendTestEmailInput) {
  try {
    const validatedInput = SendTestEmailInputSchema.parse(input);
    const result = await sendTestEmail(validatedInput);
    if (result.success) {
      return { success: true, data: result.messageId };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Send test email action error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}
