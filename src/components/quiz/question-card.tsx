"use client";

import type { AppQuizQuestion } from "@/lib/types";
import { AnswerOption } from "./answer-option";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: AppQuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onSelectAnswer: (optionText: string) => void;
  selectedAnswer?: string;
  onSkip?: () => void; // Optional skip functionality
  isSkipping?: boolean; // To disable options while skipping
  reduceMotion: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onSelectAnswer,
  selectedAnswer,
  onSkip,
  isSkipping,
  reduceMotion,
}: QuestionCardProps) {
  
  const cardAnimationClass = !reduceMotion ? "animate-in fade-in-0 slide-in-from-bottom-10 duration-500 ease-out" : "";

  return (
    <Card className={cn("w-full max-w-2xl mx-auto shadow-xl overflow-hidden", cardAnimationClass, !reduceMotion && "hover:shadow-2xl transition-shadow duration-300")}>
      <CardHeader className="bg-primary/10 p-6">
        <CardDescription className="text-primary font-semibold">
          Question {questionNumber} / {totalQuestions}
        </CardDescription>
        <CardTitle className="text-2xl md:text-3xl !mt-1">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {question.options.map((option, index) => (
          <AnswerOption
            key={index}
            optionText={option}
            isSelected={selectedAnswer === option}
            onClick={() => onSelectAnswer(option)}
            disabled={isSkipping}
            reduceMotion={reduceMotion}
          />
        ))}
        {onSkip && (
          <div className="pt-4 text-center">
            <Button variant="ghost" onClick={onSkip} disabled={isSkipping} className="text-muted-foreground hover:text-foreground">
              {isSkipping ? "Skipping..." : "Skip this question"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
