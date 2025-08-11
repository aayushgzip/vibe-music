
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface MoodGradientBarProps {
  onMoodChange: (color: string) => void;
}

const moodColors = [
  { h: 240, s: 80, l: 60 }, // Calm Blue
  { h: 180, s: 70, l: 65 }, // Hopeful Teal
  { h: 60, s: 90, l: 70 }, // Joyful Yellow
  { h: 40, s: 95, l: 65 }, // Energetic Orange
  { h: 0, s: 100, l: 60 },  // Passionate Red
];

// Function to interpolate between two HSL colors
const interpolateHsl = (color1: {h:number, s:number, l:number}, color2: {h:number, s:number, l:number}, factor: number) => {
  const h = color1.h + factor * (color2.h - color1.h);
  const s = color1.s + factor * (color2.s - color1.s);
  const l = color1.l + factor * (color2.l - color1.l);
  return { h, s, l };
};

export function MoodGradientBar({ onMoodChange }: MoodGradientBarProps) {
  const [sliderValue, setSliderValue] = useState([50]);

  const handleValueChange = (value: number[]) => {
    setSliderValue(value);
    const position = value[0] / 100;
    
    const numSegments = moodColors.length - 1;
    const segmentIndex = Math.min(Math.floor(position * numSegments), numSegments - 1);
    const segmentFactor = (position * numSegments) - segmentIndex;

    const startColor = moodColors[segmentIndex];
    const endColor = moodColors[segmentIndex + 1];

    const interpolated = interpolateHsl(startColor, endColor, segmentFactor);
    
    onMoodChange(`hsl(${interpolated.h}, ${interpolated.s}%, ${interpolated.l}%)`);
  };

  useEffect(() => {
    // Set initial color on mount
    handleValueChange(sliderValue);
  }, []);

  const gradient = `linear-gradient(to right, ${moodColors.map(c => `hsl(${c.h}, ${c.s}%, ${c.l}%)`).join(', ')})`;

  return (
    <div className="w-full max-w-md mx-auto space-y-3 p-4 bg-background/50 rounded-lg shadow-inner">
        <label className="text-sm font-medium text-center block text-foreground/80">
            Slide to explore the mood spectrum
        </label>
        <Slider
            defaultValue={[50]}
            max={100}
            step={0.5}
            onValueChange={handleValueChange}
            className="mood-slider"
            style={{ '--gradient': gradient } as React.CSSProperties}
        />
        <style jsx>{`
            .mood-slider :global(.relative.flex.w-full.touch-none.select-none.items-center .bg-secondary) {
                background: var(--gradient);
            }
            .mood-slider :global(.block.h-5.w-5.rounded-full) {
                border-width: 3px;
                box-shadow: 0 0 10px rgba(0,0,0,0.2);
            }
        `}</style>
    </div>
  );
}
