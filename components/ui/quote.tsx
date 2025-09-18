import type React from "react";
import { cn } from "@/lib/utils";

interface QuoteProps {
  author?: string;
  children: React.ReactNode;
  className?: string;
}

export const Quote = ({ author, children, className }: QuoteProps) => {
  return (
    <div className={cn("relative my-8", className)}>
      {/* Decorative left border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary to-primary/20 rounded-full" />
      
      {/* Quote content */}
      <div className="pl-8">
        <blockquote className="text-lg font-medium text-foreground/90 leading-relaxed italic">
          "{children}"
        </blockquote>
        
        {author && (
          <div className="mt-4 flex items-center">
            <div className="h-px bg-border flex-1" />
            <cite className="ml-4 text-sm font-medium text-muted-foreground not-italic">
              — {author}
            </cite>
          </div>
        )}
      </div>
    </div>
  );
};
