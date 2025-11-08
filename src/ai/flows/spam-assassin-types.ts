/**
 * @fileOverview Type definitions for the SpamAssassin flow.
 */
import { z } from 'genkit';

export const SpamAssassinInputSchema = z.object({
  raw: z.string().describe('El mensaje de correo electrónico completo en formato RFC822.'),
  sensitivity: z.number().min(0.1).max(20.0).optional().default(5.0).describe('El umbral de sensibilidad de spam. Por defecto es 5.0.'),
});
export type SpamAssassinInput = z.infer<typeof SpamAssassinInputSchema>;

export const SpamAssassinOutputSchema = z.object({
  status: z.string(),
  score: z.number(),
  threshold: z.number(),
  is_spam: z.boolean(),
  details: z.string(),
});
export type SpamAssassinOutput = z.infer<typeof SpamAssassinOutputSchema>;
