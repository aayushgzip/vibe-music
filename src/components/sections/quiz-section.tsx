"use client";

import { useState, useEffect } from 'react';
import type { AppQuizQuestion, UserSelections, SoundtrackGenerationInput } from '@/lib/types';
import { QuestionCard } from '@/components/quiz/question-card';
import { ProgressIndicator } from '@/components/quiz/progress-indicator';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { generateQuizContent } from '@/ai/flows/quiz-content-generator';
import { cn } from "@/lib/utils";

interface QuizSectionProps {
  onQuizComplete: (answers: SoundtrackGenerationInput) => void;
  sfxEnabled: boolean;
  reduceMotion: boolean;
}

const QUIZ_CATEGORIES: Array<AppQuizQuestion['category']> = [
  'energyLevel', 'emotionalState', 'socialVibes', 'innerMonologue', 'aestheticPreference', 'movieSceneSoundtrack'
];

export function QuizSection({ onQuizComplete, sfxEnabled, reduceMotion }: QuizSectionProps) {
  const [questions, setQuestions] = useState<AppQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userSelections, setUserSelections] = useState<UserSelections>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSkipping, setIsSkipping] = useState(false);

  // Placeholder for click sound effect
  // const [playClickSound] = useSound("/sounds/click.mp3", { soundEnabled: sfxEnabled });

  useEffect(() => {
    async function fetchQuizQuestions() {
      setIsLoading(true);
      setError(null);
      try {
        // This prompt aims to get one question for each category.
        const prompt = `Generate a quiz with exactly ${QUIZ_CATEGORIES.length} questions. Each question should explore one of the following aspects of a person's current vibe, in this specific order:
1. Energy level (e.g., "How charged up are you feeling today?")
2. Current emotional state (e.g., "What's the main emotion painting your day?")
3. Social vibes (e.g., "Are you feeling more like a solo act or a group jam today?")
4. Inner monologue (e.g., "What's the chatter like in your head right now?")
5. Aesthetic or fantasy preference (e.g., "If your life was a movie genre today, what would it be?")
6. How they’d soundtrack a movie scene about today (e.g., "If today was a movie scene, what kind of music would be playing?")
Each question should have 4-5 distinct options.`;
        
        const quizData = await generateQuizContent({ prompt });

        if (quizData.questions.length !== QUIZ_CATEGORIES.length) {
          console.warn(`AI generated ${quizData.questions.length} questions, expected ${QUIZ_CATEGORIES.length}. Adapting...`);
           // Fallback: use what we got, or handle error more gracefully
        }

        const formattedQuestions: AppQuizQuestion[] = quizData.questions.slice(0, QUIZ_CATEGORIES.length).map((q, index) => ({
          ...q,
          id: `q-${index}`,
          category: QUIZ_CATEGORIES[index], // Assign category based on order
        }));
        setQuestions(formattedQuestions);
      } catch (err) {
        console.error("Failed to generate quiz content:", err);
        setError("Oops! We couldn't cook up the quiz questions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchQuizQuestions();
  }, []);

  const handleSelectAnswer = (optionText: string) => {
    // playClickSound();
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    setUserSelections(prev => ({
      ...prev,
      [currentQuestion.category]: optionText,
    }));

    // Automatically move to next question after a short delay for visual feedback
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // All questions answered
        onQuizComplete(userSelections as SoundtrackGenerationInput); // Assert type, ensure all categories are filled
      }
    }, 300); // Short delay
  };
  
  const handleSkipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setIsSkipping(true);
      // playClickSound(); // Placeholder
      // Potentially mark as skipped or assign a neutral default if required by AI
      const currentQuestion = questions[currentQuestionIndex];
       setUserSelections(prev => ({
        ...prev,
        [currentQuestion.category]: "Not sure", // Or some other neutral value
      }));
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsSkipping(false);
      }, 300);
    } else {
      // Skipping the last question, effectively completing the quiz
      onQuizComplete(userSelections as SoundtrackGenerationInput);
    }
  };


  if (isLoading) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center p-6 gradient-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-xl text-foreground">Brewing your vibe questions...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center text-center p-6 gradient-background">
        <p className="text-xl text-destructive-foreground bg-destructive p-4 rounded-md">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-6">Try Again</Button>
      </section>
    );
  }

  if (questions.length === 0) {
     return (
      <section className="min-h-screen flex flex-col items-center justify-center text-center p-6 gradient-background">
        <p className="text-xl text-foreground">No questions available at the moment. Please try again later.</p>
         <Button onClick={() => window.location.reload()} className="mt-6">Try Again</Button>
      </section>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <section className="min-h-screen flex flex-col items-center py-8 md:py-12 px-4 gradient-background">
      <ProgressIndicator
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
      />
      <div className={cn("flex-grow flex items-center justify-center w-full mt-8", !reduceMotion && "animate-in fade-in-0 duration-500")}>
        {currentQuestion && (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onSelectAnswer={handleSelectAnswer}
            selectedAnswer={userSelections[currentQuestion.category]}
            onSkip={currentQuestionIndex < questions.length -1 ? handleSkipQuestion : undefined} // Only allow skip if not last question
            isSkipping={isSkipping}
            reduceMotion={reduceMotion}
          />
        )}
      </div>
    </section>
  );
}
