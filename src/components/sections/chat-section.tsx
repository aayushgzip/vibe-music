
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { X, Send, Bot, Loader2 } from 'lucide-react';
import type { ChatMessage, MusicChatOutput } from '@/lib/types';
import { getMusicRecommendation } from '@/ai/flows/music-chat-flow';
import { ChatBubble } from '@/components/chat/chat-bubble';
import { cn } from '@/lib/utils';

interface ChatSectionProps {
  onExitChat: () => void;
}

export function ChatSection({ onExitChat }: ChatSectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: { response: "Hey there! I'm VibeBot. What kind of music are you in the mood for? Tell me about your day, your favorite genre, or what you're doing right now." } }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Prepare history for the AI, handling both string and object content
    const chatHistory = messages.map(msg => {
      const content = typeof msg.content === 'string' ? msg.content : msg.content.response;
      return { role: msg.role, content };
    });

    try {
      const result: MusicChatOutput = await getMusicRecommendation({ history: chatHistory, message: input });
      const modelMessage: ChatMessage = { role: 'model', content: result };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      console.error("Failed to get music recommendation:", err);
      setError("Sorry, I'm having a little trouble connecting. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-4 gradient-background">
      <Card className="w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-full">
              <Bot className="h-7 w-7 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">VibeBot</CardTitle>
              <CardDescription>Your personal music recommender</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onExitChat}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close Chat</span>
          </Button>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto p-6 space-y-6">
          <div className="flex flex-col items-start gap-4">
             {messages.map((msg, index) => (
                <ChatBubble key={index} role={msg.role} content={msg.content} />
             ))}
          </div>
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
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
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
