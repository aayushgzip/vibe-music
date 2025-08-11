
"use client";

import type { SoundtrackGenerationOutput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, RotateCcw, Music, ListMusic, Network, BarChart3, Home } from "lucide-react";
import { MusicNoteIcon } from "@/components/icons/music-note-icon";
import { cn } from "@/lib/utils";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import Link from 'next/link';


// Helper icon for Spotify
const SpotifyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 496 512"
    {...props} // Pass down props like className
  >
    {/* <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
    <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"/>
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
      
      <div className="relative w-full max-w-2xl my-8 z-10">
        <div className="w-full flex justify-start mb-6">
            <Link href="/" passHref>
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" /> Home
              </Button>
            </Link>
        </div>

        <Card className={cn("w-full text-center shadow-2xl", cardAnimation)}>
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
                    <SpotifyIcon className="h-5 w-5 fill-current mr-2" /> Find theme on Spotify
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
                  <BarChart3 className="mr-2 h-5 w-5" /> Leaderboard
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
