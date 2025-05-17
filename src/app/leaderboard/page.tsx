
// src/app/leaderboard/page.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Trophy, Sparkles, CloudRain, Zap, Leaf, Ghost } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MockVibe {
  id: string;
  rank: number;
  title: string;
  emoji?: string; // Optional emoji from AI output
  icon?: React.ElementType; // Optional Lucide icon
  popularityScore: number;
  description: string;
}

const mockLeaderboardData: MockVibe[] = [
  { id: 'vibe1', rank: 1, title: 'Cosmic Jazz Explorer', emoji: '🎷✨', icon: Sparkles, popularityScore: 1250, description: "Cruising the galaxies with a smooth sax solo." },
  { id: 'vibe2', rank: 2, title: 'Rainy Day Reader', emoji: '📖🌧️', icon: CloudRain, popularityScore: 1100, description: "Lost in a good book while the storm rages." },
  { id: 'vibe3', rank: 3, title: 'Cyberpunk Night Drive', emoji: '🌃👾', icon: Zap, popularityScore: 980, description: "Neon lights, synth waves, and high-speed chases." },
  { id: 'vibe4', rank: 4, title: 'Enchanted Forest Wanderer', emoji: '🌲🍄', icon: Leaf, popularityScore: 850, description: "Discovering ancient secrets among whispering trees." },
  { id: 'vibe5', rank: 5, title: 'Lo-fi Ghost Beats', emoji: '👻🎧', icon: Ghost, popularityScore: 720, description: "Chill, ethereal tunes for late-night contemplation." },
  { id: 'vibe6', rank: 6, title: 'Sunset Beach Bonfire', emoji: '🔥🌅', popularityScore: 650, description: "Warm vibes, acoustic guitars, and good company." },
  { id: 'vibe7', rank: 7, title: 'Arcade Champion High Score', emoji: '🕹️🏆', popularityScore: 580, description: "Pixelated glory and chiptune anthems." },
  { id: 'vibe8', rank: 8, title: 'Mystic Mountain Meditation', emoji: '🧘🏔️', popularityScore: 510, description: "Finding inner peace at the summit of serenity." },
];

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-6 gradient-background">
      <div className="w-full max-w-4xl my-8">
        <Link href="/" passHref>
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to VibeTune
          </Button>
        </Link>

        <Card className="shadow-xl">
          <CardHeader className="text-center bg-primary/10">
            <div className="flex items-center justify-center gap-3">
              <Trophy className="h-10 w-10 text-primary" />
              <CardTitle className="text-4xl md:text-5xl font-extrabold text-primary">
                Vibe Leaderboard
              </CardTitle>
            </div>
            <CardDescription className="text-lg text-foreground/80 pt-2">
              Discover the most popular vibes!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] text-center">Rank</TableHead>
                    <TableHead>Vibe Title</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="text-right">Popularity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeaderboardData.map((vibe) => (
                    <TableRow key={vibe.id} className={cn(vibe.rank <=3 && "bg-accent/10")}>
                      <TableCell className="font-bold text-xl text-center text-primary">
                        {vibe.rank === 1 && '🥇'}
                        {vibe.rank === 2 && '🥈'}
                        {vibe.rank === 3 && '🥉'}
                        {vibe.rank > 3 && vibe.rank}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           {vibe.icon && <vibe.icon className="h-5 w-5 text-muted-foreground" />}
                           <span className="font-semibold">{vibe.title}</span>
                           {vibe.emoji && <span className="ml-1">{vibe.emoji}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                        {vibe.description}
                      </TableCell>
                      <TableCell className="text-right font-medium">{vibe.popularityScore.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Note: This leaderboard shows example data. A real leaderboard would require a backend connection.
        </p>
      </div>
    </main>
  );
}
