
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { X, Send, Bot, Loader2, Sparkles, Music, ListMusic } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import type { ChatMessage, MusicChatOutput } from '@/lib/types';
import { getMusicRecommendation } from '@/ai/flows/music-chat-flow';
import { ChatBubble } from '@/components/chat/chat-bubble';
import { cn } from '@/lib/utils';

interface ChatSectionProps {
  onExitChat: () => void;
}

const suggestions = [
  "Music for a rainy day",
  "Upbeat songs for a road trip",
  "Chill vibes for relaxing",
];

// Helper icon for Spotify
const SpotifyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 496 512"
    {...props}
  >
    {/* <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
    <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"/>
  </svg>
);

const createSpotifySearchUrl = (playlist: {song: string, artist: string}[]) => {
    const query = encodeURIComponent(playlist.map(p => `${p.song} ${p.artist}`).join(' '));
    return `https://open.spotify.com/search/${query}`;
}


export function ChatSection({ onExitChat }: ChatSectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: { response: "Hey there! I'm VibeBot. What kind of music are you in the mood for? Tell me about your day, your favorite genre, or what you're doing right now." } }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [songQueue, setSongQueue] = useState<{song: string, artist: string}[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    const chatHistory = messages.map(msg => {
      const content = typeof msg.content === 'string' ? msg.content : (msg.content as MusicChatOutput);
      return { role: msg.role, content };
    });

    try {
      const result: MusicChatOutput = await getMusicRecommendation({ history: chatHistory, message: messageText });
      const modelMessage: ChatMessage = { role: 'model', content: result };
      setMessages(prev => [...prev, modelMessage]);

      // Add new songs to the queue
      if (result.playlist && result.playlist.length > 0) {
        setSongQueue(prevQueue => {
            const newSongs = result.playlist!.filter(p => 
                !prevQueue.some(queuedSong => queuedSong.song === p.song && queuedSong.artist === p.artist)
            );
            return [...prevQueue, ...newSongs];
        });
      }

    } catch (err) {
      console.error("Failed to get music recommendation:", err);
      setError("Sorry, I'm having a little trouble connecting. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-4 gradient-background">
      <Card className="w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500">
        <CardHeader className="flex flex-row items-start justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-full">
              <Bot className="h-7 w-7 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">VibeBot</CardTitle>
              <CardDescription>Your personal music recommender</CardDescription>
            </div>
          </div>
           <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={songQueue.length === 0}>
                  <ListMusic className="mr-2 h-4 w-4" /> View Queue ({songQueue.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Your VibeBot Song Queue</AlertDialogTitle>
                  <AlertDialogDescription>
                    Here are all the songs VibeBot has recommended in this session.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="max-h-60 overflow-y-auto pr-4 -mr-4">
                  <ul className="space-y-2">
                    {songQueue.map((item, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm p-2 rounded-md bg-black/5 dark:bg-white/5">
                        <Music className="h-4 w-4 text-primary/80 flex-shrink-0" />
                        <div>
                          <span className="font-medium">{item.song}</span>
                          <span className="text-muted-foreground"> by {item.artist}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <AlertDialogFooter>
                  <AlertDialogAction asChild>
                     <Button 
                      onClick={() => window.open(createSpotifySearchUrl(songQueue), '_blank')} 
                      className="w-full"
                    >
                        <SpotifyIcon className="h-5 w-5 fill-current mr-2" /> Find on Spotify
                    </Button>
                  </AlertDialogAction>
                   <AlertDialogAction asChild>
                    <Button variant="secondary">Close</Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="ghost" size="icon" onClick={onExitChat}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close Chat</span>
            </Button>
           </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto p-6 space-y-6">
          <div className="flex flex-col items-start gap-4">
             {messages.map((msg, index) => (
                <ChatBubble key={index} role={msg.role} content={msg.content} />
             ))}
          </div>

          {messages.length === 1 && !isLoading && (
              <div className="flex flex-col items-start gap-2 animate-in fade-in-0 duration-500">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> Not sure what to ask? Try one of these:</p>
                  <div className="flex flex-wrap gap-2">
                      {suggestions.map((s, i) => (
                          <Button key={i} variant="outline" size="sm" onClick={() => handleSuggestionClick(s)}>
                              {s}
                          </Button>
                      ))}
                  </div>
              </div>
          )}
          
          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary/20">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="p-4 rounded-lg bg-card text-card-foreground flex items-center gap-2">
                 <Loader2 className="w-5 h-5 animate-spin" />
                 <span>VibeBot is thinking...</span>
              </div>
            </div>
          )}
           {error && (
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-destructive/20">
                    <Bot className="w-5 h-5 text-destructive" />
                </div>
                <div className="p-4 rounded-lg bg-destructive text-destructive-foreground">
                    {error}
                </div>
              </div>
            )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="border-t pt-6">
          <form ref={formRef} onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me what you're looking for..."
              disabled={isLoading}
              className="flex-grow"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </section>
  );
}

    