
import { z } from 'zod';

// Input schema for our main flow
export const VmcAnalysisInputSchema = z.object({
  domain: z.string().describe('The domain to validate and analyze.'),
});
export type VmcAnalysisInput = z.infer<typeof VmcAnalysisInputSchema>;


// Output schema for the AI's analysis, matching the detailed prompt
export const VmcAnalysisOutputSchema = z.object({
    verdict: z.string().describe("Resumen general del resultado BIMI/VMC para el dominio."),
    bimi_is_valid: z.boolean().describe("Determina si el registro BIMI es válido."),
    bimi_description: z.string().describe("Análisis técnico detallado de por qué el registro BIMI se considera válido o falso.").optional(),
    vmc_is_authentic: z.boolean().describe("Determina si el certificado VMC es auténtico (refleja si vmc_status es VALID)."),
    vmc_description: z.string().describe("Lista de viñetas separadas por '; ' con evidencia técnica concreta que justifica el veredicto del VMC.").optional(),
    dmarc_policy: z.enum(["reject", "quarantine", "none", "unknown"]).describe("Política DMARC encontrada.").optional(),
    openssl_verify_ok: z.boolean().optional().describe("Resultado de 'verify.ok' del método OpenSSL.").nullable(),
    ocsp_status: z.enum(["GOOD", "REVOKED", "UNKNOWN", "NOT_CHECKED"]).describe("Estado de la verificación OCSP.").optional(),
    svg_hash_match: z.boolean().optional().describe("Indica si el hash del SVG coincide con el declarado en el certificado.").nullable(),
    chain_summary: z.array(z.record(z.any())).optional().describe("Resumen de la cadena de certificados.").nullable(),
    method_consistency: z.enum(["CONSISTENT", "MIXED", "DIVERGENT"]).describe("Consistencia entre los métodos de validación.").optional(),
    svg_is_valid: z.boolean().optional().describe("Determina si el SVG cumple con los requisitos de BIMI.").nullable(),
    svg_description: z.string().optional().describe("Análisis detallado de la validez del SVG.").nullable(),
    detailed_analysis: z.string().describe("El análisis completo en texto plano para revisión humana.").optional(),
    validation_score: z.number().describe("Un puntaje de 0 a 100 que representa el porcentaje de autenticidad global.").optional(),
    mx_is_valid: z.boolean().describe("Determina si el registro MX es válido.").optional(),
    mx_priority: z.number().optional().describe("La prioridad del registro MX encontrado."),
    mx_points_to_daybuu: z.boolean().optional().describe("Indica si el registro MX apunta a daybuu.com.")
});
export type VmcAnalysisOutput = z.infer<typeof VmcAnalysisOutputSchema>;

    
