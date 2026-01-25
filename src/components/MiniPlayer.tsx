// src/components/MiniPlayer.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import { useAudio } from '../context/AudioContext';

export function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlayPause } = useAudio();

  if (!currentTrack) return null;

  return (
    <View style={styles.container}>
      <Image source={{ uri: currentTrack.cover }} style={styles.cover} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
        <Text style={styles.artist}>{currentTrack.artistName}</Text>
      </View>
      <TouchableOpacity onPress={togglePlayPause} style={styles.button}>
        {isPlaying ? <Pause color="#FFF" fill="#FFF" /> : <Play color="#FFF" fill="#FFF" />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#27272A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 60, // Fica exatamente acima da TabBar
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#3F3F46'
  },
  cover: { width: 40, height: 40, borderRadius: 4 },
  info: { flex: 1, marginLeft: 10 },
  title: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  artist: { color: '#A1A1AA', fontSize: 12 },
  button: { padding: 10 }
});