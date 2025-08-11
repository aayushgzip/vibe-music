
"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

type LoopingAudioState = {
  src: string;
  isPlaying: boolean;
} | null;

interface AudioContextType {
  sfxEnabled: boolean;
  toggleSfx: () => void;
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
  loopingAudio: LoopingAudioState;
  toggleLoopingAudio: (src: string) => void;
  stopLoopingAudio: () => void;
  playHoverSound: (src: string) => void;
  stopHoverSound: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [loopingAudio, setLoopingAudio] = useState<LoopingAudioState>(null);
  
  const loopAudioRef = useRef<HTMLAudioElement | null>(null);
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reduceMotion]);

  useEffect(() => {
    const audioElement = loopAudioRef.current;
    if (loopingAudio && audioElement) {
      if (loopingAudio.isPlaying) {
        audioElement.play().catch(e => console.error("Error playing looping audio:", e));
      } else {
        audioElement.pause();
      }
    }
  }, [loopingAudio]);

  const toggleSfx = () => setSfxEnabled(prev => !prev);
  const toggleReduceMotion = () => setReduceMotion(prev => !prev);
  
  const stopLoopingAudio = useCallback(() => {
    if (loopAudioRef.current) {
      loopAudioRef.current.pause();
    }
    setLoopingAudio(null);
  }, []);

  const toggleLoopingAudio = useCallback((audioSrc: string) => {
    stopHoverSound();
    
    if (loopAudioRef.current && loopAudioRef.current.src !== new URL(audioSrc, window.location.origin).toString()) {
        loopAudioRef.current.pause();
        loopAudioRef.current = null;
    }

    if (loopingAudio && loopingAudio.src === audioSrc) {
        const shouldPlay = !loopingAudio.isPlaying;
        setLoopingAudio({ src: audioSrc, isPlaying: shouldPlay });
    } else {
        if(!loopAudioRef.current) {
            loopAudioRef.current = new Audio(audioSrc);
            loopAudioRef.current.loop = true;
            loopAudioRef.current.volume = 0.4;
        } else {
            if(loopAudioRef.current.src !== new URL(audioSrc, window.location.origin).toString()) {
                loopAudioRef.current.src = audioSrc;
            }
        }
        setLoopingAudio({ src: audioSrc, isPlaying: true });
    }
  }, [loopingAudio]);
  
  const playHoverSound = useCallback((audioSrc: string) => {
      if (reduceMotion || !sfxEnabled || (loopingAudio && loopingAudio.isPlaying)) return;

      if (hoverAudioRef.current && hoverAudioRef.current.src !== new URL(audioSrc, window.location.origin).toString()) {
          hoverAudioRef.current.pause();
          hoverAudioRef.current = null;
      }
      
      if (!hoverAudioRef.current) {
          hoverAudioRef.current = new Audio(audioSrc);
          hoverAudioRef.current.volume = 0.3;
      }
      
      hoverAudioRef.current.currentTime = 0;
      hoverAudioRef.current.play().catch(e => {
          if ((e as DOMException).name !== 'AbortError') {
              console.error("Audio play error", e);
          }
      });
  }, [reduceMotion, sfxEnabled, loopingAudio]);

  const stopHoverSound = useCallback(() => {
    if (hoverAudioRef.current) {
      hoverAudioRef.current.pause();
      hoverAudioRef.current = null;
    }
  }, []);


  const value = {
    sfxEnabled,
    toggleSfx,
    reduceMotion,
    toggleReduceMotion,
    loopingAudio,
    toggleLoopingAudio,
    stopLoopingAudio,
    playHoverSound,
    stopHoverSound,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
