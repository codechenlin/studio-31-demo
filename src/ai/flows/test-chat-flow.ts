
'use server';

/**
 * @fileoverview A simple Genkit flow for testing chat functionality.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TestChatInputSchema = z.string();
const TestChatOutputSchema = z.string();

export async function testChat(input: string): Promise<string> {
  return testChatFlow(input);
}

const testChatFlow = ai.defineFlow(
  {
    name: 'testChatFlow',
    inputSchema: TestChatInputSchema,
    outputSchema: TestChatOutputSchema,
  },
  async (prompt) => {
    const llmResponse = await ai.generate({
      prompt: prompt,
      history: [
        {
          role: 'system',
          content: [{ text: 'You are a helpful assistant. Respond concisely.' }],
        },
      ],
    });

    return llmResponse.text;
  }
);
