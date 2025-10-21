
'use server';

import { checkApiHealth, type ApiHealthOutput } from '@/ai/flows/api-health-check-flow';
import { 
    validateAndAnalyzeDomain, 
    type VmcAnalysisInput, 
    type VmcAnalysisOutput 
} from '@/ai/flows/vmc-deepseek-analysis-flow';


export async function checkApiHealthAction() {
  try {
    const result = await checkApiHealth();
    if (result.status === 'ok') {
        return { success: true, data: result };
    }
    return { success: false, error: `API returned status: ${result.status}` };
  } catch (error: any) {
    console.error('API health check action error:', error);
    return { success: false, error: error.message };
  }
}

export async function validateDomainWithAI(input: VmcAnalysisInput): Promise<{ success: boolean; data?: VmcAnalysisOutput; error?: string }> {
  try {
    const result = await validateAndAnalyzeDomain(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('VMC validation with AI action error:', error);
    return { success: false, error: error.message };
  }
}
