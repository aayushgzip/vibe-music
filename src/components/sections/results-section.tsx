
"use client";

import type { SoundtrackGenerationOutput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, RotateCcw, Download, Music, ListMusic, Star, Network } from "lucide-react";
import { MusicNoteIcon } from "@/components/icons/music-note-icon";
import { cn } from "@/lib/utils";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";


// Helper icon for Spotify, as lucide-react might not have it directly or consistently
const SpotifyIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current">
    <title>Spotify</title>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.363 17.404c-.21.323-.623.42-.946.21-.26-.172-4.284-2.623-7.184-2.623-2.9 0-4.925 2.451-7.184 2.623-.324.21-.736.113-.946-.21-.21-.324-.113-.736.21-.946C4.765 15.017 8.35 13.7 12 13.7s7.235 1.317 9.153 2.758c.323.21.42.623.21.946zm1.13-3.045c-.252.388-.75.505-1.137.253-3.255-2.002-7.158-2.92-11.037-1.658-.41.135-.84-.097-.976-.507-.135-.41.097-.84.507-.976C6.908 10.27 11.74 11.073 15.83 13.44c.388.252.505.75.253 1.137zm.1-3.377C15.56 8.203 10.01 7.92 6.014 9.13c-.456.14-.93-.117-1.07-.573-.14-.456.117-.93.573-1.07C10.29 6.073 16.49 6.417 19.87 8.98c.413.313.525.87.213 1.283s-.87.525-1.283.213z"/>
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

  const handleShare = () => {
    const shareText = `My VibeTune is: ${soundtrackTitle}! ${emojiTone || ''}\n${soundtrackDescription}\nMy Spotify playlist theme: ${spotifyPlaylistTheme}\nFind your vibe: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'My VibeTune Result!',
        text: shareText,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert(`Share this with your friends!\n\n${shareText}`);
    }
  };

  const handleDownload = (format: string) => {
    alert(`Download as ${format} feature coming soon!`);
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

