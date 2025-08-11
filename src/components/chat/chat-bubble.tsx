
"use client";

import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  role: 'user' | 'model';
  content: string;
}

export function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === 'user';
  const bubbleClasses = cn(
    "flex items-start gap-4 p-4 rounded-lg max-w-lg",
    isUser ? "bg-primary/90 text-primary-foreground self-end rounded-br-none" : "bg-card text-card-foreground self-start rounded-bl-none"
  );
  
  const formattedContent = content.split('\n').map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));

  return (
    <div className={bubbleClasses}>
      <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", isUser ? "bg-primary-foreground/20" : "bg-primary/20")}>
        {isUser ? <User className="w-5 h-5 text-primary-foreground" /> : <Bot className="w-5 h-5 text-primary" />}
      </div>
      <div className="flex-grow whitespace-pre-wrap">{formattedContent}</div>
    </div>
  );
}
