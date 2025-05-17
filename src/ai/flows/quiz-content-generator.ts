// src/ai/flows/quiz-content-generator.ts
'use server';

/**
 * @fileOverview Generates quiz questions and answers based on a text prompt.
 *
 * - generateQuizContent - A function that generates quiz questions and answers.
 * - GenerateQuizContentInput - The input type for the generateQuizContent function.
 * - GenerateQuizContentOutput - The return type for the generateQuizContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizContentInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired quiz content.'),
});
export type GenerateQuizContentInput = z.infer<typeof GenerateQuizContentInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('The possible answer options for the question.'),
});

const GenerateQuizContentOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).describe('The generated quiz questions and answers.'),
});
export type GenerateQuizContentOutput = z.infer<typeof GenerateQuizContentOutputSchema>;

export async function generateQuizContent(input: GenerateQuizContentInput): Promise<GenerateQuizContentOutput> {
  return generateQuizContentFlow(input);
}

const generateQuizContentPrompt = ai.definePrompt({
  name: 'generateQuizContentPrompt',
  input: {schema: GenerateQuizContentInputSchema},
  output: {schema: GenerateQuizContentOutputSchema},
  prompt: `You are an expert quiz generator. Please generate quiz questions and answer options based on the following prompt:

Prompt: {{{prompt}}}

Please ensure that the questions and answers are relevant to the prompt and are engaging for the user. Provide 8-10 questions with 4-5 options each.

Output the result as a JSON array of question objects, where each question object has a "question" field (string) and an "options" field (string array).`,
});

const generateQuizContentFlow = ai.defineFlow(
  {
    name: 'generateQuizContentFlow',
    inputSchema: GenerateQuizContentInputSchema,
    outputSchema: GenerateQuizContentOutputSchema,
  },
  async input => {
    const {output} = await generateQuizContentPrompt(input);
    return output!;
  }
);
