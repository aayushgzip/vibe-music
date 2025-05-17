"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Music, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';

interface AudioControlProps {
  backgroundAudioSrc?: string; // Optional: if not provided, controls are for SFX only
  sfxEnabled: boolean;
  onSfxToggle: (enabled: boolean) => void;
  reduceMotion: boolean;
  onReduceMotionToggle: (enabled: boolean) => void;
}

export function AudioControl({ 
  backgroundAudioSrc, 
  sfxEnabled, 
  onSfxToggle,
  reduceMotion,
  onReduceMotionToggle
}: AudioControlProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.1); // Start with low volume
  const [isMuted, setIsMuted] = useState(true); // Start muted
  const [showControls, setShowControls] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (backgroundAudioSrc && typeof window !== "undefined") {
      if (!audioRef.current) {
        audioRef.current = new Audio(backgroundAudioSrc);
        audioRef.current.loop = true;
      }
      
      const currentAudio = audioRef.current;
      
      currentAudio.volume = volume;
      currentAudio.muted = isMuted;

      if (isPlaying && !isMuted) {
        currentAudio.play().catch(error => console.error("Error playing audio:", error));
      } else {
        currentAudio.pause();
      }
      // Cleanup function
      return () => {
        if (currentAudio) {
           currentAudio.pause();
        }
      };
    }
  }, [isPlaying, volume, isMuted, backgroundAudioSrc]);
  
  // Auto-play attempt on mount, but muted. User must interact to unmute.
  useEffect(() => {
    if (backgroundAudioSrc) {
      setIsPlaying(true); // Attempt to play, but will be silent if isMuted is true
    }
  }, [backgroundAudioSrc]);


  const togglePlayPause = useCallback(() => {
    if (!backgroundAudioSrc) return;
    if (isMuted) {
      setIsMuted(false); // Unmute first
      if (!isPlaying) setIsPlaying(true); // Then play if not already
    } else {
      setIsPlaying(prev => !prev);
    }
  }, [isMuted, isPlaying, backgroundAudioSrc]);

  const toggleMute = useCallback(() => {
    if (!backgroundAudioSrc) return;
    setIsMuted(prev => !prev);
    if (isMuted && !isPlaying) { // If unmuting and was paused, play
      setIsPlaying(true);
    }
  }, [isMuted, isPlaying, backgroundAudioSrc]);

  const handleVolumeChange = (newVolume: number[]) => {
    if (!backgroundAudioSrc) return;
    setVolume(newVolume[0]);
    if (isMuted && newVolume[0] > 0) {
      setIsMuted(false); // Unmute if volume is increased from mute
    }
  };
  
  // Placeholder for an actual audio file
  const hasBackgroundAudio = !!backgroundAudioSrc;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <Popover open={showControls} onOpenChange={setShowControls}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full shadow-lg">
            <Settings2 className="h-5 w-5" />
            <span className="sr-only">Audio and App Settings</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60" align="end">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Settings</h4>
              <p className="text-sm text-muted-foreground">
                Adjust your experience.
              </p>
            </div>
            <div className="grid gap-2">
              {hasBackgroundAudio && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bgm-volume" className="flex items-center gap-2">
                      <Music className="h-4 w-4" /> Background Music
                    </Label>
                    <Button variant="ghost" size="icon" onClick={toggleMute} className="h-7 w-7">
                      {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Slider
                    id="bgm-volume"
                    min={0}
                    max={1}
                    step={0.01}
                    defaultValue={[volume]}
                    onValueChange={handleVolumeChange}
                    disabled={!hasBackgroundAudio || isMuted}
                    aria-label="Background music volume"
                  />
                </>
              )}
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="sfx-toggle" className="flex items-center">
                  Sound Effects
                </Label>
                <Switch
                  id="sfx-toggle"
                  checked={sfxEnabled}
                  onCheckedChange={onSfxToggle}
                  aria-label="Toggle sound effects"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode-toggle" className="flex items-center">
                  Dark Mode
                </Label>
                <Switch
                  id="dark-mode-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  aria-label="Toggle dark mode"
                />
              </div>
               <div className="flex items-center justify-between">
                <Label htmlFor="reduce-motion-toggle" className="flex items-center">
                  Reduce Motion
                </Label>
                <Switch
                  id="reduce-motion-toggle"
                  checked={reduceMotion}
                  onCheckedChange={onReduceMotionToggle}
                  aria-label="Toggle reduce motion"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
