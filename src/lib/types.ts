
// From generateQuizContent AI flow
export interface AIQuizQuestion {
  question: string; // This is questionText
  options: string[]; // These are option texts
}

// Used internally by the app after processing AIQuizQuestion
export interface AppQuizQuestion extends AIQuizQuestion {
  id: string; // question index as string or hash
  // For mapping to soundtrack generator categories
  category: 'energyLevel' | 'emotionalState' | 'socialVibes' | 'innerMonologue' | 'aestheticPreference' | 'movieSceneSoundtrack';
}

// From generateQuizSoundtrack AI flow (matches its QuizInput and QuizOutput types)
// We re-export to ensure SoundtrackGenerationOutput includes the new vibeDimensions
import type { QuizInput as GI, QuizOutput as GO } from '@/ai/flows/soundtrack-generator';
export type SoundtrackGenerationInput = GI;
export type SoundtrackGenerationOutput = GO;

import type { MusicChatOutput as MCO } from '@/ai/flows/music-chat-flow';
export type MusicChatOutput = MCO;


// Storing user's selections. Key is question category, value is the selected option string.
export type UserSelections = Partial<SoundtrackGenerationInput>;

export type QuizStage = 'loading' | 'intro' | 'quiz' | 'generating_results' | 'results' | 'chat';

// For the chatbot
export interface ChatMessage {
  role: 'user' | 'model';
  content: string | MusicChatOutput;
}
