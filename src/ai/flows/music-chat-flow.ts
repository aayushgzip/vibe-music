
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
    // The content for the model can now be a structured object, so we use z.any()
    content: z.any(),
  })).describe('The chat history between the user and the model.'),
  message: z.string().describe('The latest message from the user.'),
});
export type MusicChatInput = z.infer<typeof MusicChatInputSchema>;

const SongSchema = z.object({
    song: z.string().describe("The title of the song."),
    artist: z.string().describe("The name of the artist."),
});

const MusicChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s text response. This should be a friendly message introducing the playlist if one is generated.'),
  playlist: z.array(SongSchema).optional().describe('An optional playlist of 5-8 songs based on the user\'s request. Only generate a playlist if the user explicitly asks for music or seems to be looking for recommendations.'),
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

If the user asks for music, a playlist, or specific recommendations, you should generate a playlist of 5-8 songs. If you generate a playlist, also provide a short, friendly text response introducing it.
If the user is just chatting, you don't need to generate a playlist; just provide a text response.

Here is the conversation history:
{{#each history}}
{{#if isUser}}
User: {{{content}}}
{{else}}
VibeBot: {{{content.response}}}{{#if content.playlist}} (VibeBot then shared a playlist){{/if}}
{{/if}}
{{/each}}

Here is the new message from the user:
User: {{{message}}}

Provide a helpful and engaging response as VibeBot. Create a playlist if it seems appropriate.
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
    }));
    
    const {output} = await prompt({...input, history: historyWithRoles});
    return output!;
  }
);
