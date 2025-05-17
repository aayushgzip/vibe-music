"use client";

import type { SoundtrackGenerationOutput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, RotateCcw, Download, Music, ListMusic, Star } from "lucide-react";
import { MusicNoteIcon } from "@/components/icons/music-note-icon";
import { cn } from "@/lib/utils";

interface ResultsSectionProps {
  result: SoundtrackGenerationOutput;
  onRetakeQuiz: () => void;
  reduceMotion: boolean;
}

export function ResultsSection({ result, onRetakeQuiz, reduceMotion }: ResultsSectionProps) {
  const { soundtrackTitle, soundtrackDescription, spotifyPlaylistTheme, emojiTone } = result;

  const cardAnimation = !reduceMotion ? "animate-in fade-in-0 zoom-in-95 duration-700 ease-out" : "";
  
  // Basic share functionality (can be expanded with navigator.share or specific platform links)
  const handleShare = () => {
    const shareText = `My VibeTune is: ${soundtrackTitle}! ${emojiTone || ''}\n${soundtrackDescription}\nFind your vibe: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'My VibeTune Result!',
        text: shareText,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support navigator.share
      alert(`Share this with your friends!\n\n${shareText}`);
    }
  };

  // Placeholder for download actions
  const handleDownload = (format: string) => {
    alert(`Download as ${format} feature coming soon!`);
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden gradient-background">
       {!reduceMotion && (
        <div className="absolute inset-0 z-0">
          {[...Array(10)].map((_, i) => (
            <MusicNoteIcon
              key={`note-${i}`}
              className={cn(
                "absolute text-accent/30 animate-pulse",
                `w-${Math.floor(Math.random() * 8) + 8} h-${Math.floor(Math.random() * 8) + 8}`
              )}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <Card className={cn("w-full max-w-2xl text-center shadow-2xl z-10", cardAnimation)}>
        <CardHeader className="bg-primary/10 p-6">
           {emojiTone && <p className="text-4xl mb-2">{emojiTone}</p>}
          <CardTitle className="text-4xl md:text-5xl font-extrabold text-primary">
            {soundtrackTitle}
          </CardTitle>
          <CardDescription className="text-lg text-foreground/80 pt-2">
            This is your current life soundtrack!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="p-4 bg-card-foreground/5 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2"><Music className="w-5 h-5 text-accent"/>The Vibe:</h3>
            <p className="text-foreground/90 text-left md:text-center leading-relaxed">{soundtrackDescription}</p>
          </div>
          
          <div className="p-4 bg-accent/10 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2"><ListMusic className="w-5 h-5 text-primary"/>Spotify Playlist Theme:</h3>
            <p className="text-accent-foreground text-lg font-medium">{spotifyPlaylistTheme}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 p-6 border-t">
          <Button onClick={handleShare} size="lg" className="w-full sm:w-auto">
            <Share2 className="mr-2 h-5 w-5" /> Share
          </Button>
          <Button onClick={onRetakeQuiz} variant="outline" size="lg" className="w-full sm:w-auto">
            <RotateCcw className="mr-2 h-5 w-5" /> Retake Quiz
          </Button>
        </CardFooter>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 p-6 border-t bg-muted/50">
            <Button onClick={() => handleDownload("Poster")} variant="secondary" size="sm">
                <Download className="mr-2 h-4 w-4" /> Save as Poster
            </Button>
            <Button onClick={() => handleDownload("Insta Story")} variant="secondary" size="sm">
                <Star className="mr-2 h-4 w-4" /> Insta Story
            </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
