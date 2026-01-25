import React, { createContext, useState, useContext, useRef } from 'react';
import { Audio } from 'expo-av';

const AudioContext = createContext({} as any);

export function AudioProvider({ children }: any) {
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  async function playTrack(track: any) {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: track.url },
      { shouldPlay: true }
    );

    soundRef.current = sound;
    setCurrentTrack(track);
    setIsPlaying(true);

    sound.setOnPlaybackStatusUpdate((status: any) => {
      if (status.didJustFinish) setIsPlaying(false);
    });
  }

  async function togglePlayPause() {
    if (!soundRef.current) return;
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  }

  return (
    <AudioContext.Provider value={{ currentTrack, isPlaying, playTrack, togglePlayPause }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);