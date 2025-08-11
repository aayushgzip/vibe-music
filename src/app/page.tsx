
"use client";

import { useState } from 'react';
import type { SoundtrackGenerationInput, SoundtrackGenerationOutput, QuizStage } from '@/lib/types';
import { HeaderSection } from '@/components/sections/header-section';
import { QuizSection } from '@/components/sections/quiz-section';
import { ResultsSection } from '@/components/sections/results-section';
import { ChatSection } from '@/components/sections/chat-section';
import { AudioControl } from '@/components/audio/audio-control';
import { generateQuizSoundtrack } from '@/ai/flows/soundtrack-generator';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAudio } from '@/context/audio-provider';

export default function VibeTunePage() {
  const [quizStage, setQuizStage] = useState<QuizStage>('intro');
  const [soundtrackResult, setSoundtrackResult] = useState<SoundtrackGenerationOutput | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const { stopLoopingAudio } = useAudio();

  
  const handleStartQuiz = () => {
    setQuizStage('loading');
    setTimeout(() => setQuizStage('quiz'), 100); 
  };
  
  const handleStartChat = () => {
    setQuizStage('chat');
  }

  const handleQuizComplete = async (answers: SoundtrackGenerationInput) => {
    setQuizStage('generating_results');
    setAiError(null);
    try {
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
    } catch (error) {
      console.error("Failed to generate soundtrack:", error);
      setAiError("Oh no! Our vibe-o-meter is a bit fuzzy. Couldn't generate your soundtrack. Please try again!");
      setQuizStage('results');
    }
  };

  const handleRetakeQuiz = () => {
    setSoundtrackResult(null);
    setAiError(null);
    stopLoopingAudio();
    setQuizStage('intro');
  };
  
  const handleExitChat = () => {
    setQuizStage('intro');
  }

  const renderContent = () => {
    switch (quizStage) {
      case 'intro':
        return (
          <HeaderSection 
            onStartQuiz={handleStartQuiz} 
            onStartChat={handleStartChat} 
          />
        );
      case 'chat':
        return <ChatSection onExitChat={handleExitChat} />;
      case 'loading':
      case 'quiz':
        return <QuizSection onQuizComplete={handleQuizComplete} />;
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
          return <ResultsSection result={soundtrackResult} onRetakeQuiz={handleRetakeQuiz} />;
        }
        return (
           <section className="min-h-screen flex flex-col items-center justify-center text-center p-6 gradient-background">
              <p className="text-xl text-destructive-foreground bg-destructive p-6 rounded-lg shadow-lg">An unexpected error occurred. Please try again.</p>
              <Button onClick={handleRetakeQuiz} className="mt-8" size="lg">Try Again</Button>
            </section>
        );
      default:
        return <HeaderSection onStartQuiz={handleStartQuiz} onStartChat={handleStartChat} />;
    }
  };

  return (
    <main className={cn("min-h-screen w-full", quizStage !== 'intro' && 'gradient-background')}>
      {renderContent()}
      <AudioControl />
    </main>
  );
}
