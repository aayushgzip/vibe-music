
'use server';

/**
 * @fileOverview A music recommendation chatbot AI agent.
 *
 * - getMusicRecommendation - A function that handles the chatbot conversation.
 * - MusicChatInput - The input type for the getMusicRecommendation function.
 * - MusicChatOutput - The return type for the getMusicRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MusicChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The chat history between the user and the model.'),
  message: z.string().describe('The latest message from the user.'),
});
export type MusicChatInput = z.infer<typeof MusicChatInputSchema>;

const MusicChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
});
export type MusicChatOutput = z.infer<typeof MusicChatOutputSchema>;


export async function getMusicRecommendation(input: MusicChatInput): Promise<MusicChatOutput> {
  return getMusicRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'musicChatPrompt',
  input: {schema: MusicChatInputSchema},
  output: {schema: MusicChatOutputSchema},
  prompt: `You are a friendly and knowledgeable music recommendation chatbot named VibeBot.
Your goal is to help users discover new music based on their mood, preferences, and what they are currently doing.
Keep your responses concise, friendly, and helpful.

Here is the conversation history:
{{#each history}}
{{#if isUser}}
User: {{{content}}}
{{/if}}
{{#if isModel}}
VibeBot: {{{content}}}
{{/if}}
{{/each}}

Here is the new message from the user:
User: {{{message}}}

Provide a helpful and engaging response as VibeBot.
`,
});

const getMusicRecommendationFlow = ai.defineFlow(
  {
    name: 'getMusicRecommendationFlow',
    inputSchema: MusicChatInputSchema,
    outputSchema: MusicChatOutputSchema,
  },
  async input => {
    // Restructure history for Handlebars `if` helper
    const historyWithRoles = input.history.map(item => ({
      ...item,
      isUser: item.role === 'user',
      isModel: item.role === 'model'
    }));
    
    const {output} = await prompt({...input, history: historyWithRoles});
    return output!;
  }
);
