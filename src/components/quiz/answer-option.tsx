"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnswerOptionProps {
  optionText: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  reduceMotion: boolean;
}

export function AnswerOption({ optionText, isSelected, onClick, disabled, reduceMotion }: AnswerOptionProps) {
  // Basic animation classes, can be expanded for mood-based animations
  const animationClasses = !reduceMotion ? "transition-all duration-300 ease-out transform hover:scale-105" : "";
  const selectedClasses = isSelected ? "ring-4 ring-accent ring-offset-2 ring-offset-background scale-105 shadow-lg" : "hover:bg-primary/80";

  return (
    <Button
      variant="outline"
      size="lg"
      className={cn(
        "w-full h-auto justify-start text-left py-4 px-6 text-base leading-tight whitespace-normal break-words shadow-md hover:shadow-lg focus:shadow-lg",
        "bg-card hover:border-primary border-2",
        animationClasses,
        selectedClasses,
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isSelected}
    >
      {optionText}
    </Button>
  );
}
