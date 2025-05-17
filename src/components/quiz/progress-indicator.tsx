"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

export function ProgressIndicator({ currentQuestionIndex, totalQuestions }: ProgressIndicatorProps) {
  if (totalQuestions === 0) return null;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="w-full px-4 md:px-8 py-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 shadow-sm">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-2 text-sm font-medium text-primary">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          {/* Optional: Cassette tape icon or animation could go here */}
        </div>
        <Progress value={progressPercentage} aria-label={`Quiz progress: ${currentQuestionIndex + 1} of ${totalQuestions} questions answered`} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-primary transition-all duration-500 ease-out" />
      </div>
    </div>
  );
}
