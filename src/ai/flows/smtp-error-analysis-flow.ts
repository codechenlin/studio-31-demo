
'use server';
/**
 * @fileOverview An AI agent to analyze and diagnose SMTP connection errors.
 *
 * - analyzeSmtpError - A function that uses AI to analyze SMTP errors.
 * - SmtpErrorAnalysisInput - The input type for the analyzeSmtpError function.
 * - SmtpErrorAnalysisOutput - The return type for the analyzeSmtpError function.
 */

import { ai, isDnsAnalysisEnabled } from '@/ai/genkit';
import { z } from 'genkit';

export type SmtpErrorAnalysisInput = z.infer<typeof SmtpErrorAnalysisInputSchema>;
const SmtpErrorAnalysisInputSchema = z.object({
  error: z.string().describe('The SMTP error message returned by the server.'),
});

export type SmtpErrorAnalysisOutput = z.infer<typeof SmtpErrorAnalysisOutputSchema>;
const SmtpErrorAnalysisOutputSchema = z.object({
  analysis: z.string().describe('A natural language analysis of the SMTP error, explaining the likely cause and providing clear, actionable steps for the user to resolve it. Be concise, direct, and use emojis. Respond in Spanish.'),
});

export async function analyzeSmtpError(
  input: SmtpErrorAnalysisInput
): Promise<SmtpErrorAnalysisOutput | null> {
  if (!isDnsAnalysisEnabled()) {
    throw new Error('SMTP error analysis with AI is disabled by the administrator.');
  }
  
  try {
    return await smtpErrorAnalysisFlow(input);
  } catch (error) {
    console.error("SMTP error analysis flow failed:", error);
    throw error;
  }
}

const smtpErrorAnalysisFlow = ai.defineFlow(
  {
    name: 'smtpErrorAnalysisFlow',
    inputSchema: SmtpErrorAnalysisInputSchema,
    outputSchema: SmtpErrorAnalysisOutputSchema,
  },
  async ({ error }) => {

    const expertPrompt = ai.definePrompt({
        name: 'smtpErrorExpertPrompt',
        output: { schema: SmtpErrorAnalysisOutputSchema },
        prompt: `Eres un experto en administración de servidores de correo. Analiza el siguiente error de conexión SMTP y proporciona un diagnóstico claro y pasos para solucionarlo. Responde en español y usa emojis.

        Error SMTP: {{{error}}}

        Reglas de Análisis:
        - Si el error contiene "EAUTH" o "Authentication failed", el problema es de usuario/contraseña. ✅
        - Si el error contiene "ECONNREFUSED" o "Connection refused", el problema es de host, puerto o firewall. 🖥️
        - Si el error contiene "wrong version number" o "TLS", es un problema de configuración SSL/TLS. 🛡️
        - Si el error contiene "Timeout", es un problema de red o el servidor no responde. ⏳

        Proporciona una explicación del problema y una lista de pasos numerados que el usuario debe seguir.`
    });

    const { output } = await expertPrompt({ error });

    if (!output) {
      throw new Error("La IA no pudo generar un análisis para el error SMTP.");
    }
    
    return output;
  }
);
