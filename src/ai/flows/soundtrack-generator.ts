// src/ai/flows/soundtrack-generator.ts
'use server';

/**
 * @fileOverview Generates a unique soundtrack based on quiz responses.
 *
 * - generateQuizSoundtrack - A function that generates the soundtrack.
 * - QuizInput - The input type for the generateQuizSoundtrack function.
 * - QuizOutput - The return type for the generateQuizSoundtrack function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizInputSchema = z.object({
  energyLevel: z
    .string()
    .describe('The user\'s energy level (e.g., high, low, medium).'),
  emotionalState: z
    .string()
    .describe('The user\'s current emotional state (e.g., happy, sad, angry).'),
  socialVibes: z
    .string()
    .describe('The user\'s social preferences (e.g., extroverted, introverted).'),
  innerMonologue: z
    .string()
    .describe('Description of the user\'s inner monologue (e.g., chaotic, calm, reflective).'),
  aestheticPreference: z
    .string()
    .describe('The user\'s aesthetic preferences (e.g., dark academia, cottagecore, cyberpunk).'),
  movieSceneSoundtrack: z
    .string()
    .describe('How the user would soundtrack a movie scene about today.'),
});

export type QuizInput = z.infer<typeof QuizInputSchema>;

const QuizOutputSchema = z.object({
  soundtrackTitle: z.string().describe('A fun title for the soundtrack (e.g., Lo-fi Sad Boi).'),
  soundtrackDescription: z
    .string()
    .describe('A 2-3 sentence description of the vibe.'),
  spotifyPlaylistTheme: z
    .string()
    .describe('A suggested Spotify playlist theme (e.g., rainy window vibes).'),
  suggestedSongs: z.array(z.string()).describe('An array of 5 suggested song titles with artists (e.g., "Song Title - Artist Name") that fit the playlist theme.'),
  emojiTone: z.string().optional().describe('Optional emoji tone (e.g., ✨🔥😭).'),
});

export type QuizOutput = z.infer<typeof QuizOutputSchema>;

export async function generateQuizSoundtrack(input: QuizInput): Promise<QuizOutput> {
  return generateQuizSoundtrackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'quizSoundtrackPrompt',
  input: {schema: QuizInputSchema},
  output: {schema: QuizOutputSchema},
  prompt: `Based on the quiz responses, generate a unique soundtrack.

  Energy Level: {{{energyLevel}}}
  Emotional State: {{{emotionalState}}}
  Social Vibes: {{{socialVibes}}}
  Inner Monologue: {{{innerMonologue}}}
  Aesthetic Preference: {{{aestheticPreference}}}
  Movie Scene Soundtrack: {{{movieSceneSoundtrack}}}

  Create a fun title (e.g., Lo-fi Sad Boi), a 2-3 sentence description of the vibe, and a suggested Spotify playlist theme (e.g., rainy window vibes).
  Also, provide an array of 5 specific song suggestions, including artist and title (e.g., "Bohemian Rhapsody - Queen"), that perfectly fit this playlist theme. These songs should be actual, well-known or fitting indie songs.
  Include an optional emoji tone.
  `,
});

const generateQuizSoundtrackFlow = ai.defineFlow(
  {
    name: 'generateQuizSoundtrackFlow',
    inputSchema: QuizInputSchema,
    outputSchema: QuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
