import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface MusicProps {
  title: string;
  artist: string;
  cover: string;
  onPress?: () => void; // Adicionamos a prop de clique aqui
}

export function MusicCard({ title, artist, cover, onPress }: MusicProps) {
  return (
    // Passamos o onPress para o TouchableOpacity
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: cover }} style={styles.cover} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.artist}>{artist}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cover: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  info: {
    marginLeft: 15,
    flex: 1, // Adicionei isso para o texto não vazar se for muito longo
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  artist: {
    color: '#A1A1AA',
    fontSize: 14,
  },
});