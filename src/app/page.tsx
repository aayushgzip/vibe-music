"use client";

import { useState, useEffect } from 'react';
import type { SoundtrackGenerationInput, SoundtrackGenerationOutput, QuizStage } from '@/lib/types';
import { HeaderSection } from '@/components/sections/header-section';
import { QuizSection } from '@/components/sections/quiz-section';
import { ResultsSection } from '@/components/sections/results-section';
import { AudioControl } from '@/components/audio/audio-control';
import { generateQuizSoundtrack } from '@/ai/flows/soundtrack-generator';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Optional: Add a placeholder background audio URL
// const BACKGROUND_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // Replace with a real or placeholder URL

export default function VibeTunePage() {
  const [quizStage, setQuizStage] = useState<QuizStage>('intro');
  const [soundtrackResult, setSoundtrackResult] = useState<SoundtrackGenerationOutput | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reduceMotion]);
  
  const handleStartQuiz = () => {
    setQuizStage('loading'); // Transition to loading for quiz questions
    // playStartSound(); // Placeholder
    // Simulate a small delay if needed before QuizSection fetches questions
    setTimeout(() => setQuizStage('quiz'), 100); 
  };

  const handleQuizComplete = async (answers: SoundtrackGenerationInput) => {
    setQuizStage('generating_results');
    setAiError(null);
    try {
      // Ensure all categories are present, provide defaults if necessary
      const completeAnswers: SoundtrackGenerationInput = {
        energyLevel: answers.energyLevel || "neutral",
        emotionalState: answers.emotionalState || "calm",
        socialVibes: answers.socialVibes || "balanced",
        innerMonologue: answers.innerMonologue || "quiet",
        aestheticPreference: answers.aestheticPreference || "minimalist",
        movieSceneSoundtrack: answers.movieSceneSoundtrack || "ambient",
      };
      const result = await generateQuizSoundtrack(completeAnswers);
      setSoundtrackResult(result);
      setQuizStage('results');
      // playSuccessSound(); // Placeholder
    } catch (error) {
      console.error("Failed to generate soundtrack:", error);
      setAiError("Oh no! Our vibe-o-meter is a bit fuzzy. Couldn't generate your soundtrack. Please try again!");
      // playErrorSound(); // Placeholder
      setQuizStage('results'); // Still go to results to show error
    }
  };

  const handleRetakeQuiz = () => {
    setSoundtrackResult(null);
    setAiError(null);
    setQuizStage('intro');
    // playRetakeSound(); // Placeholder
  };

  const renderContent = () => {
    switch (quizStage) {
      case 'intro':
        return <HeaderSection onStartQuiz={handleStartQuiz} reduceMotion={reduceMotion} />;
      case 'loading': // This state is very brief, QuizSection has its own loading for questions
      case 'quiz':
        return <QuizSection onQuizComplete={handleQuizComplete} sfxEnabled={sfxEnabled} reduceMotion={reduceMotion}/>;
      case 'generating_results':
        return (
          <section className="min-h-screen flex flex-col items-center justify-center p-6 text-center gradient-background">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-6 text-2xl font-semibold text-foreground">Tuning into your vibe...</p>
            <p className="text-lg text-foreground/80">Crafting your unique soundtrack!</p>
          </section>
        );
      case 'results':
        if (aiError && !soundtrackResult) {
          return (
            <section className="min-h-screen flex flex-col items-center justify-center text-center p-6 gradient-background">
              <p className="text-xl text-destructive-foreground bg-destructive p-6 rounded-lg shadow-lg">{aiError}</p>
              <Button onClick={handleRetakeQuiz} className="mt-8" size="lg">Try Again</Button>
            </section>
          );
        }
        if (soundtrackResult) {
          return <ResultsSection result={soundtrackResult} onRetakeQuiz={handleRetakeQuiz} reduceMotion={reduceMotion}/>;
        }
        // Fallback if something went wrong but no specific AI error message
        return (
           <section className="min-h-screen flex flex-col items-center justify-center text-center p-6 gradient-background">
              <p className="text-xl text-destructive-foreground bg-destructive p-6 rounded-lg shadow-lg">An unexpected error occurred. Please try again.</p>
              <Button onClick={handleRetakeQuiz} className="mt-8" size="lg">Try Again</Button>
            </section>
        );
      default:
        return <HeaderSection onStartQuiz={handleStartQuiz} reduceMotion={reduceMotion} />;
    }
  };

  return (
    <main className={cn("min-h-screen w-full", reduceMotion && "reduce-motion-active")}>
      {renderContent()}
      <AudioControl 
        // backgroundAudioSrc={BACKGROUND_AUDIO_URL} // Uncomment and provide a URL to enable background audio
        sfxEnabled={sfxEnabled} 
        onSfxToggle={setSfxEnabled}
        reduceMotion={reduceMotion}
        onReduceMotionToggle={setReduceMotion}
      />
    </main>
  );
}
