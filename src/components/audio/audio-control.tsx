
"use client";

import { useState } from 'react';
import { Volume2, VolumeX, Music, Settings2, Ban, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { useAudio } from '@/context/audio-provider';

export function AudioControl() {
  const {
    sfxEnabled,
    toggleSfx,
    reduceMotion,
    toggleReduceMotion,
  } = useAudio();
  const [showControls, setShowControls] = useState(false);
  const { theme, setTheme } = useTheme();

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
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="sfx-toggle" className="flex items-center">
                  Sound Effects
                </Label>
                <Switch
                  id="sfx-toggle"
                  checked={sfxEnabled}
                  onCheckedChange={toggleSfx}
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
                  onCheckedChange={toggleReduceMotion}
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
