"use client";

import { useState, useEffect, useCallback } from 'react';

interface SoundOptions {
  volume?: number;
  playbackRate?: number;
  soundEnabled?: boolean;
}

const useSound = (
  url: string,
  { volume = 1, playbackRate = 1, soundEnabled = true }: SoundOptions = {}
): [() => void, { sound: HTMLAudioElement | null; error: Error | null }] => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!soundEnabled || typeof window === 'undefined') {
      return;
    }

    const newAudio = new Audio(url);
    newAudio.volume = volume;
    newAudio.playbackRate = playbackRate;

    newAudio.addEventListener('error', (e) => {
      console.error('Error loading audio:', e);
      // HTMLMediaElement error events don't provide rich error objects directly
      // We'll create a generic error
      setError(new Error(`Failed to load audio from ${url}`));
    });
    
    setAudio(newAudio);
    
    return () => {
      if (newAudio) {
        newAudio.pause();
        setAudio(null);
      }
    };
  }, [url, volume, playbackRate, soundEnabled]);

  const play = useCallback(() => {
    if (soundEnabled && audio) {
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.error("Error playing sound:", err);
        setError(err as Error);
      });
    }
  }, [audio, soundEnabled]);

  return [play, { sound: audio, error }];
};

export default useSound;
