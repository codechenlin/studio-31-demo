
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { deepseekPlugin } from './deepseek';
import fs from 'fs';
import path from 'path';

interface AiConfig {
    provider: 'google' | 'deepseek';
    apiKey: string;
    modelName: string;
    enabled: boolean;
    functions: {
        dnsAnalysis: boolean;
    };
}

let aiConfig: AiConfig | null = null;

try {
    const configPath = path.join(process.cwd(), 'src', 'app', 'lib', 'ai-config.json');
    if (fs.existsSync(configPath)) {
        const configFile = fs.readFileSync(configPath, 'utf-8');
        aiConfig = JSON.parse(configFile);
    }
} catch (error) {
    console.warn("Could not read or parse ai-config.json. AI features will be disabled.", error);
}

const plugins = [];

if (aiConfig?.enabled) {
    if (aiConfig.provider === 'deepseek' && aiConfig.apiKey) {
        plugins.push(deepseekPlugin({ apiKey: aiConfig.apiKey }));
    } else if (aiConfig.provider === 'google' && process.env.GEMINI_API_KEY) {
        plugins.push(googleAI());
    }
}

// Fallback to Google AI if no config or if provider is Google but no specific API key is in config
if (plugins.length === 0 && process.env.GEMINI_API_KEY) {
    plugins.push(googleAI());
}

let model = 'googleai/gemini-1.5-flash-latest'; // Default model

if (aiConfig?.enabled && aiConfig.modelName) {
    if (aiConfig.provider === 'deepseek') {
        model = `deepseek/${aiConfig.modelName}`;
    } else {
        model = `googleai/${aiConfig.modelName}`;
    }
}

export const ai = genkit({
  plugins,
  model,
});

export function isDnsAnalysisEnabled() {
    return aiConfig?.enabled && aiConfig.functions?.dnsAnalysis;
}
