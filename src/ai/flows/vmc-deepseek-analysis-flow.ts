
'use server';
/**
 * @fileOverview A flow to validate a domain's BIMI/VMC records and then use an AI to analyze the results.
 * 
 * - validateAndAnalyzeDomain: Fetches validation data from an external API and sends it to DeepSeek for analysis.
 */

import { z } from 'genkit';
import { deepseekChat } from '@/ai/deepseek';
import { getAiConfigForFlows } from '@/ai/genkit';

const EXTERNAL_API_BASE = "https://8b3i4m6i39303g2k432u.fanton.cloud:9090";
const EXTERNAL_API_KEY = "6783434hfsnjd7942074nofsbs6472930nfns629df0983jvnmkd32";

// Input schema for our main flow
export const VmcAnalysisInputSchema = z.object({
  domain: z.string().describe('The domain to validate and analyze.'),
});
export type VmcAnalysisInput = z.infer<typeof VmcAnalysisInputSchema>;


// Output schema for the AI's analysis
export const VmcAnalysisOutputSchema = z.object({
    bimi_is_valid: z.boolean().describe("Determina si el registro BIMI es válido. Debe tener 'exists: true' y 'dmarc_enforced: true' para ser válido."),
    bimi_description: z.string().describe("Descripción corta de por qué el registro BIMI se considera válido o falso."),
    svg_is_valid: z.boolean().describe("Determina si la imagen SVG es válida y segura. Debe tener 'compliant: true'."),
    svg_description: z.string().describe("Descripción corta de por qué el SVG es correcto o falso."),
    vmc_is_authentic: z.boolean().describe("Determina si el certificado VMC es auténtico. Debe tener 'authentic: true', 'chain_ok: true' y 'revocation_ok: true'."),
    vmc_description: z.string().describe("Descripción corta de por qué el VMC es auténtico o falso.")
});
export type VmcAnalysisOutput = z.infer<typeof VmcAnalysisOutputSchema>;


/**
 * Fetches validation data from the external API.
 * @param domain The domain to validate.
 * @returns The full JSON response from the external API.
 */
async function fetchDomainValidation(domain: string): Promise<any> {
  const url = `${EXTERNAL_API_BASE}/validate?domain=${encodeURIComponent(domain)}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': EXTERNAL_API_KEY,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'No se pudo leer el cuerpo del error.');
      throw new Error(`La API externa devolvió un error: ${response.status} ${response.statusText}. Cuerpo: ${errorBody}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Fallo al conectar con la API externa:', error);
    throw new Error(`No se pudo conectar con la API de validación: ${error.message}`);
  }
}

/**
 * Main flow that validates a domain and then sends the result to an AI for analysis.
 * @param input The domain to be processed.
 * @returns An analysis object from the AI.
 */
export async function validateAndAnalyzeDomain(input: VmcAnalysisInput): Promise<VmcAnalysisOutput> {
  const aiConfig = getAiConfigForFlows();

  if (!aiConfig?.enabled || !aiConfig.functions?.vmcVerification) {
    throw new Error('El análisis VMC con IA está deshabilitado por el administrador.');
  }

  if (aiConfig.provider !== 'deepseek' || !aiConfig.apiKey) {
      throw new Error('La IA de Deepseek no está configurada o habilitada.');
  }

  // 1. Fetch data from the external API
  const validationData = await fetchDomainValidation(input.domain);

  // 2. Prepare and send data to DeepSeek AI
  const prompt = `
    Eres un experto en seguridad de correo electrónico y autenticación de marca. Analiza el siguiente objeto JSON, que contiene los resultados de una validación de BIMI, SVG y VMC para el dominio '${input.domain}'. Tu tarea es determinar la validez de cada componente y proporcionar una justificación clara y concisa.

    Tu respuesta DEBE ser un objeto JSON válido que cumpla con este esquema Zod:
    \`\`\`json
    {
        "type": "object",
        "properties": {
            "bimi_is_valid": { "type": "boolean" },
            "bimi_description": { "type": "string" },
            "svg_is_valid": { "type": "boolean" },
            "svg_description": { "type": "string" },
            "vmc_is_authentic": { "type": "boolean" },
            "vmc_description": { "type": "string" }
        },
        "required": ["bimi_is_valid", "bimi_description", "svg_is_valid", "svg_description", "vmc_is_authentic", "vmc_description"]
    }
    \`\`\`

    **Datos a analizar:**
    \`\`\`json
    ${JSON.stringify(validationData, null, 2)}
    \`\`\`

    **Reglas de Análisis:**

    1.  **Registro BIMI (bimi_is_valid):**
        *   **VÁLIDO (true):** Solo si \`bimi.exists\` es \`true\` Y \`bimi.dmarc_enforced\` es \`true\`.
        *   **FALSO (false):** En cualquier otro caso.
        *   **Descripción (bimi_description):** Si es falso, explica por qué (ej. "No existe el registro BIMI." o "DMARC no está en modo 'reject' o 'quarantine'."). Si es válido, di "El registro BIMI está presente y la política DMARC es segura.".

    2.  **Imagen SVG (svg_is_valid):**
        *   **VÁLIDO (true):** Solo si \`svg.exists\` es \`true\` Y \`svg.compliant\` es \`true\`.
        *   **FALSO (false):** Si no existe o no es compatible.
        *   **Descripción (svg_description):** Si es falso, explica por qué (ej. "El archivo SVG no se encontró en la URL." o "El SVG no cumple con las reglas BIMI-safe."). Si es válido, di "El logo SVG es compatible con BIMI.".

    3.  **Certificado VMC (vmc_is_authentic):**
        *   **AUTÉNTICO (true):** Solo si \`vmc.exists\` es \`true\`, \`vmc.authentic\` es \`true\`, \`vmc.chain_ok\` es \`true\`, Y \`vmc.revocation_ok\` es \`true\`.
        *   **FALSO (false):** En cualquier otro caso (incluyendo si \`revocation_ok\` es \`false\` o \`null\`).
        *   **Descripción (vmc_description):** Si es falso, explica la razón principal (ej. "No se encontró un certificado VMC.", "La cadena de confianza del certificado está rota.", "El certificado ha sido revocado.", "No se pudo verificar el estado de revocación."). Si es auténtico, di "El certificado VMC es auténtico y fue verificado por una autoridad oficial.".

    **Instrucciones Adicionales:**
    - Sé directo y conciso en tus descripciones.
    - No inventes información. Basa tu análisis únicamente en los datos JSON proporcionados.
  `;
  
  try {
    const rawResponse = await deepseekChat(prompt, {
      apiKey: aiConfig.apiKey,
      model: aiConfig.modelName,
    });
    
    // Extract JSON from the response
    const jsonMatch = rawResponse.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error("La IA no devolvió un objeto JSON válido en su respuesta.");
    }
    
    const parsedJson = JSON.parse(jsonMatch[1]);
    const validatedOutput = VmcAnalysisOutputSchema.parse(parsedJson);

    return validatedOutput;
  } catch (error: any) {
    console.error('Error durante el análisis con Deepseek:', error);
    throw new Error(`Error al analizar los datos con la IA: ${error.message}`);
  }
}
