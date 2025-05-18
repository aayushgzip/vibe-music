
"use client";

import type { SoundtrackGenerationOutput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, RotateCcw, Music, ListMusic, Network, BarChart3 } from "lucide-react";
import { MusicNoteIcon } from "@/components/icons/music-note-icon";
import { cn } from "@/lib/utils";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import Link from 'next/link';


// Helper icon for Spotify
const SpotifyIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current mr-2">
    <title>Spotify</title>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.635 17.405c-.23.36-.705.494-1.065.263-2.902-1.728-6.55-2.106-10.788-1.15-.404.09-.802-.16-.892-.563-.09-.404.16-.802.564-.892C9.21 13.19 13.28 13.604 16.53 15.53c.352.228.476.702.257 1.065H16.635zm1.08-2.41c-.28.433-.85.587-1.28.307-3.23-1.96-7.98-2.52-11.708-1.376-.48.147-.996-.124-1.142-.603s.124-.996.603-1.142c4.26-1.29 9.43-0.67 13.128 1.55.433.266.587.832.307 1.28v-.016zm.12-2.73C13.11 10.04 8.02 9.77 4.68 10.89c-.56.19-.94.06-1.13-.5-.19-.56.06-.94.5-1.13C7.91 8.08 13.72 8.38 18.21 10.6c.47.23.64.81.41 1.28-.23.47-.81.64-1.28.41z"/>
  </svg>
);


interface ResultsSectionProps {
  result: SoundtrackGenerationOutput;
  onRetakeQuiz: () => void;
  reduceMotion: boolean;
}

const chartConfig = {
  vibeScore: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export function ResultsSection({ result, onRetakeQuiz, reduceMotion }: ResultsSectionProps) {
  const { soundtrackTitle, soundtrackDescription, spotifyPlaylistTheme, emojiTone, suggestedSongs, vibeDimensions } = result;

  const cardAnimation = !reduceMotion ? "animate-in fade-in-0 zoom-in-95 duration-700 ease-out" : "";
  
  const chartData = vibeDimensions ? [
    { subject: 'Energy', score: vibeDimensions.energy, fullMark: 100 },
    { subject: 'Focus', score: vibeDimensions.focus, fullMark: 100 },
    { subject: 'Creativity', score: vibeDimensions.creativity, fullMark: 100 },
    { subject: 'Social', score: vibeDimensions.social, fullMark: 100 },
    { subject: 'Emotion', score: vibeDimensions.emotion, fullMark: 100 },
  ] : [];

  const handleShare = async () => {
    const shareText = `My VibeTune is: ${soundtrackTitle}! ${emojiTone || ''}\n${soundtrackDescription}\nMy Spotify playlist theme: ${spotifyPlaylistTheme}\nFind your vibe: ${window.location.href}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My VibeTune Result!',
          text: shareText,
          url: window.location.href,
        });
        // You could add a success message here if needed, e.g., using a toast notification
      } catch (error) {
        console.error("Sharing failed:", error);
        alert(`Sharing failed. This can happen on non-HTTPS sites or if permissions are denied. You can copy this text instead:\n\n${shareText}`);
      }
    } else {
      alert(`Sharing is not supported by your browser. You can copy this text:\n\n${shareText}`);
    }
  };

  const createSpotifySearchUrl = () => {
    const query = encodeURIComponent(`${spotifyPlaylistTheme} ${suggestedSongs ? suggestedSongs.join(' ') : ''}`);
    return `https://open.spotify.com/search/${query}`;
  }

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

          {vibeDimensions && chartData.length > 0 && (
            <div className="p-4 bg-card-foreground/5 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2 text-primary">
                <Network className="w-6 h-6"/> Your Vibe Profile
              </h3>
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px] w-full sm:max-h-[350px]">
                <RadarChart
                  data={chartData}
                  cx="50%" 
                  cy="50%" 
                  outerRadius="70%" // Adjusted for better fit
                >
                  <ChartTooltip
                    cursor={{ fill: "hsl(var(--muted))", fillOpacity: 0.3 }}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <PolarGrid gridType="polygon" stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }} />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tickCount={5} 
                    tickFormatter={(value) => `${value}`} 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                  />
                  <Radar
                    name="Vibe Score" // Legend name
                    dataKey="score" // Data key for values
                    fill="var(--color-vibeScore)"
                    fillOpacity={0.6}
                    stroke="var(--color-vibeScore)"
                  />
                </RadarChart>
              </ChartContainer>
            </div>
          )}
          
          <div className="p-4 bg-accent/10 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2 text-primary"><ListMusic className="w-5 h-5"/>Spotify Playlist Theme:</h3>
            <p className="text-primary text-lg font-medium">{spotifyPlaylistTheme}</p>
            
            {suggestedSongs && suggestedSongs.length > 0 && (
              <div className="mt-4 text-left">
                <h4 className="text-md font-semibold mb-2 text-primary/90">Suggested Tracks:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-primary/80">
                  {suggestedSongs.map((song, index) => (
                    <li key={index}>{song}</li>
                  ))}
                </ul>
                 <Button 
                    onClick={() => window.open(createSpotifySearchUrl(), '_blank')} 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 w-full sm:w-auto border-primary text-primary hover:bg-primary/10 hover:text-primary"
                  >
                  <SpotifyIcon /> Open theme in Spotify
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 p-6 border-t">
          <Button onClick={handleShare} size="lg" className="w-full sm:w-auto">
            <Share2 className="mr-2 h-5 w-5" /> Share
          </Button>
          <Button onClick={onRetakeQuiz} variant="secondary" size="lg" className="w-full sm:w-auto">
            <RotateCcw className="mr-2 h-5 w-5" /> Retake Quiz
          </Button>
           <Link href="/leaderboard" passHref>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <BarChart3 className="mr-2 h-5 w-5" /> View Leaderboard
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}

