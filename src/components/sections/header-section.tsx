"use client";

import { Button } from "@/components/ui/button";
import { MusicNoteIcon } from "@/components/icons/music-note-icon";
import { SoundwaveIcon } from "@/components/icons/soundwave-icon";
import { ChevronsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderSectionProps {
  onStartQuiz: () => void;
  reduceMotion: boolean;
}

export function HeaderSection({ onStartQuiz, reduceMotion }: HeaderSectionProps) {
  const titleAnimation = !reduceMotion ? "animate-in fade-in-0 slide-in-from-top-10 duration-700 ease-out" : "";
  const subtitleAnimation = !reduceMotion ? "animate-in fade-in-0 slide-in-from-top-10 delay-200 duration-700 ease-out" : "";
  const buttonAnimation = !reduceMotion ? "animate-in fade-in-0 zoom-in-90 delay-500 duration-500 ease-out" : "";
  const scrollCueAnimation = !reduceMotion ? "animate-bounce delay-1000" : "";

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative overflow-hidden gradient-background">
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        {[...Array(5)].map((_, i) => (
          <MusicNoteIcon
            key={i}
            className={cn(
              "absolute text-accent",
              !reduceMotion && "animate-pulse",
              i === 0 && "w-16 h-16 top-1/4 left-1/4",
              i === 1 && "w-12 h-12 top-1/2 right-1/4",
              i === 2 && "w-20 h-20 bottom-1/4 left-1/3",
              i === 3 && "w-10 h-10 top-1/3 right-1/3",
              i === 4 && "w-14 h-14 bottom-1/3 left-1/2",
            )}
            style={{ animationDelay: !reduceMotion ? `${i * 0.3}s` : undefined }}
          />
        ))}
      </div>
      
      <div className="relative z-10 space-y-8 max-w-3xl">
        <div className={cn("flex items-center justify-center space-x-4", titleAnimation)}>
          <SoundwaveIcon className="w-16 h-16 md:w-24 md:h-24 text-primary" />
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            VibeTune
          </h1>
        </div>
        
        <h2 className={cn("text-3xl md:text-5xl font-bold text-primary", titleAnimation, !reduceMotion && "delay-100")}>
          🎧 What’s Your Life Soundtrack?
        </h2>
        <p className={cn("text-lg md:text-xl text-foreground/80", subtitleAnimation)}>
          Because your vibe deserves a theme song ✨🎶 Dive in and discover the unique sound that defines your current moment!
        </p>
        <Button
          size="lg"
          onClick={onStartQuiz}
          className={cn(
            "px-10 py-6 text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out bg-accent hover:bg-accent/90 text-accent-foreground",
            buttonAnimation
          )}
        >
          Start Your Vibe Check!
        </Button>
      </div>

      {!reduceMotion && (
        <div className={cn("absolute bottom-10 left-1/2 -translate-x-1/2 text-primary", scrollCueAnimation)}>
          <ChevronsDown className="w-10 h-10" />
        </div>
      )}
    </section>
  );
}
