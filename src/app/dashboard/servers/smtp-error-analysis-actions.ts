
'use server';

import { 
    analyzeSmtpError, 
    type SmtpErrorAnalysisInput 
} from '@/ai/flows/smtp-error-analysis-flow';
import { z } from 'zod';

const SmtpErrorAnalysisSchema = z.object({
  error: z.string(),
});

export async function analyzeSmtpErrorAction(input: SmtpErrorAnalysisInput) {
  try {
    const validatedInput = SmtpErrorAnalysisSchema.parse(input);
    const result = await analyzeSmtpError(validatedInput);
    return { success: true, data: result };
  } catch (error) {
    console.error('SMTP error analysis action error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}

    