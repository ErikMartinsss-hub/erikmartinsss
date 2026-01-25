import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { Play, Pause, SkipBack, SkipForward, ChevronDown, Repeat, Shuffle, Heart } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export function Player({ route, navigation }: any) {
  const { trackTitle, artistName, cover } = route.params;
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);

  // 1. Verifica favoritos ao carregar
  useEffect(() => {
    async function checkFavorite() {
      const data = await AsyncStorage.getItem('@lura_music:favorites');
      const favorites = data ? JSON.parse(data) : [];
      const exists = favorites.find((f: any) => f.trackTitle === trackTitle);
      setIsFavorite(!!exists);
    }
    checkFavorite();
  }, [trackTitle]);

  // 2. Lógica de Áudio Principal conectada ao seu Back-end (.ts)
  useEffect(() => {
    async function setupAudio() {
      try {
        setLoading(true);
        setError(false);

        // Altere para o seu IP real da rede de Suzano para testar no celular
        const response = await fetch(`http://192.168.1.15:3000/search-music?query=${encodeURIComponent(trackTitle + ' ' + artistName)}`);
        const data = await response.json();

        if (data.url) {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });

          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: data.url },
            { shouldPlay: true, volume: 1.0 }
          );

          soundRef.current = newSound;
          setSound(newSound);
          setIsPlaying(true);

          newSound.setOnPlaybackStatusUpdate((status: any) => {
            if (status.didJustFinish) setIsPlaying(false);
          });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Erro no Player:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    setupAudio();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [trackTitle]);

  async function handlePlayPause() {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  }

  async function toggleFavorite() {
    try {
      const data = await AsyncStorage.getItem('@lura_music:favorites');
      let favorites = data ? JSON.parse(data) : [];

      if (isFavorite) {
        favorites = favorites.filter((f: any) => f.trackTitle !== trackTitle);
      } else {
        favorites.push({ trackTitle, artistName, cover });
      }

      await AsyncStorage.setItem('@lura_music:favorites', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
        <ChevronDown size={30} color="#FFF" />
      </TouchableOpacity>

      <View style={styles.albumArtContainer}>
        <Image source={{ uri: cover }} style={styles.albumArt} />
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{trackTitle}</Text>
          <Text style={styles.artist}>{artistName}</Text>
        </View>
        <TouchableOpacity onPress={toggleFavorite}>
          <Heart 
            size={30} 
            color={isFavorite ? "#A855F7" : "#FFF"} 
            fill={isFavorite ? "#A855F7" : "transparent"} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressIndicator, { width: isPlaying ? '35%' : '0%' }]} />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>0:00</Text>
          <Text style={styles.timeText}>-:-</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity><Shuffle size={24} color="#71717A" /></TouchableOpacity>
        <TouchableOpacity><SkipBack size={35} color="#FFF" fill="#FFF" /></TouchableOpacity>
        
        <TouchableOpacity onPress={handlePlayPause} style={styles.playButton} disabled={loading || error}>
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            isPlaying ? <Pause size={40} color="#000" fill="#000" /> : <Play size={40} color="#000" fill="#000" />
          )}
        </TouchableOpacity>

        <TouchableOpacity><SkipForward size={35} color="#FFF" fill="#FFF" /></TouchableOpacity>
        <TouchableOpacity><Repeat size={24} color="#71717A" /></TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>Erro ao carregar áudio do servidor.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#09090B', 
    padding: 25, 
    justifyContent: 'space-between' 
  },
  header: { 
    marginTop: 20, 
    alignItems: 'center' 
  },
  albumArtContainer: {
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
  },
  albumArt: { 
    width: width * 0.85, 
    height: width * 0.85, 
    borderRadius: 12 
  },
  infoContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 40,
    justifyContent: 'space-between'
  },
  textContainer: { 
    flex: 1,
    marginRight: 20 
  },
  title: { 
    color: '#FFF', 
    fontSize: 28, 
    fontWeight: 'bold' 
  },
  artist: { 
    color: '#A1A1AA', 
    fontSize: 18, 
    marginTop: 5 
  },
  progressContainer: { 
    marginTop: 30 
  },
  progressBar: { 
    height: 4, 
    backgroundColor: '#27272A', 
    borderRadius: 2, 
    overflow: 'hidden' 
  },
  progressIndicator: { 
    height: '100%', 
    backgroundColor: '#A855F7' 
  },
  timeContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10 
  },
  timeText: { 
    color: '#71717A', 
    fontSize: 12 
  },
  controls: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 40 
  },
  playButton: { 
    backgroundColor: '#FFF', 
    padding: 18, 
    borderRadius: 50 
  },
  errorText: { 
    color: '#EF4444', 
    textAlign: 'center', 
    marginBottom: 20, 
    fontWeight: 'bold' 
  }
});