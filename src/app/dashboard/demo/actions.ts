
'use server';

import { checkSpam, type SpamCheckerInput } from '@/ai/flows/spam-checker-flow';
import { scanFileForVirus, type VirusScanInput } from '@/ai/flows/virus-scan-flow';
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

const VirusScanInputSchema = z.object({
  file: z.instanceof(File),
});

export async function scanFileForVirusAction(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: 'No file provided.' };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    
    const result = await scanFileForVirus({
      fileName: file.name,
      fileBuffer: fileBuffer,
    });
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Virus scan action error:', error);
    return { success: false, error: error.message };
  }
}
