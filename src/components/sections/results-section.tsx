
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
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current">
    <title>Spotify</title>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0M8.022 17.124c-.328.24-.76.3-1.104.156-.344-.14-.57-.48-.57-.936 0-3.816 3.582-4.524 8.724-2.952.36.108.588.456.588.828.012.408-.228.756-.6.888-4.02 1.212-7.74 1.008-9.036 2.004zm-.144-2.856c-.384.288-.912.348-1.344.168-.432-.18-.708-.6-.708-1.116 0-3.192 3.06-4.056 8.028-2.316.444.156.732.588.732 1.068.012.516-.276.948-.732 1.116-4.32 1.452-6.972 1.224-7.98.276zm.156-3.036C4.392 9.6 1.104 10.14 0 11.508c-.456.228-.732.708-.624 1.188.108.48.552.792 1.044.684 3.852-1.332 8.484-1.68 11.736.324.48.288.996.132 1.212-.348.216-.48.06-.996-.396-1.248-3.384-2.556-8.94-2.892-11.976-1.356z"/>
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

