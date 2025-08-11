
"use client";

import { Bot, User, Music, ListMusic } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage, MusicChatOutput } from '@/lib/types';
import { Button } from '@/components/ui/button';


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


export function ChatBubble({ role, content }: ChatMessage) {
  const isUser = role === 'user';
  
  const bubbleClasses = cn(
    "flex items-start gap-3 p-4 rounded-lg max-w-lg w-fit",
    "shadow-md",
    isUser ? "bg-primary/90 text-primary-foreground self-end rounded-br-none" : "bg-card text-card-foreground self-start rounded-bl-none"
  );
  
  const iconContainerClasses = cn(
    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
    isUser ? "bg-primary-foreground/20" : "bg-primary/20"
  );

  const renderContent = () => {
    if (typeof content === 'string') {
        return content.split('\n').map((line, index) => (
            <span key={index}>{line}<br /></span>
        ));
    }
    
    // It's a model response with a potential playlist
    const { response, playlist } = content as MusicChatOutput;
    
    return (
        <div className="space-y-4">
            <p className="whitespace-pre-wrap">{response}</p>
            {playlist && playlist.length > 0 && (
                <div className="border-t border-primary/20 pt-4 mt-4 space-y-3">
                    <h4 className="font-semibold text-md flex items-center gap-2"><ListMusic className="h-5 w-5"/> Here's a playlist for you:</h4>
                    <ul className="space-y-2">
                        {playlist.map((item, index) => (
                            <li key={index} className="flex items-center gap-3 text-sm p-2 rounded-md bg-black/5 dark:bg-white/5">
                                <Music className="h-4 w-4 text-primary/80" />
                                <div>
                                    <span className="font-medium">{item.song}</span>
                                    <span className="text-muted-foreground"> by {item.artist}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Button 
                      onClick={() => window.open(createSpotifySearchUrl(playlist), '_blank')} 
                      variant="outline" 
                      size="sm" 
                      className="mt-3 w-full border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
                    >
                        <SpotifyIcon className="h-5 w-5 fill-current mr-2" /> Find on Spotify
                    </Button>
                </div>
            )}
        </div>
    );
  };

  return (
    <div className={bubbleClasses}>
      <div className={iconContainerClasses}>
        {isUser ? <User className="w-5 h-5 text-primary-foreground" /> : <Bot className="w-5 h-5 text-primary" />}
      </div>
      <div className="flex-grow">{renderContent()}</div>
    </div>
  );
}
