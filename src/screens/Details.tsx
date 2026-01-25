import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import { ChevronLeft, Play } from 'lucide-react-native';
import { getArtistAlbums } from '../services/api';

export function Details({ route, navigation }: any) {
  const { artistId, artistName, artistImage } = route.params;
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArtistDetails() {
      try {
        const data = await getArtistAlbums(artistId);
        setAlbums(data || []);
      } catch (error) {
        console.error("Erro ao carregar álbuns:", error);
      } finally {
        setLoading(false);
      }
    }

    loadArtistDetails();
  }, [artistId]);

  return (
    <View style={styles.container}>
      {/* Header com a imagem do artista */}
      <ImageBackground 
        source={{ uri: artistImage }} 
        style={styles.headerImage}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color="#FFF" size={30} />
        </TouchableOpacity>
        
        <View style={styles.overlay}>
          <Text style={styles.artistName}>{artistName}</Text>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Álbuns populares</Text>

        {loading ? (
          <ActivityIndicator color="#A855F7" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={albums}
            keyExtractor={(item) => item.idAlbum}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.albumCard}
                onPress={() => navigation.navigate('Player', {
                  trackTitle: item.strAlbum, // O Player buscará essa "track" no seu server.ts
                  artistName: artistName,
                  cover: item.strAlbumThumb
                })}
              >
                <Image 
                  source={{ uri: item.strAlbumThumb + '/preview' }} 
                  style={styles.albumCover} 
                />
                <View style={styles.albumInfo}>
                  <Text style={styles.albumTitle} numberOfLines={1}>{item.strAlbum}</Text>
                  <Text style={styles.albumYear}>{item.intYearReleased || 'N/A'}</Text>
                </View>
                <View style={styles.playIconCircle}>
                  <Play size={16} color="#000" fill="#000" />
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090B' },
  headerImage: { width: '100%', height: 300, justifyContent: 'flex-end' },
  backButton: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    borderRadius: 20, 
    padding: 5 
  },
  overlay: { 
    padding: 20, 
    backgroundColor: 'rgba(9, 9, 11, 0.4)', // Efeito de sombra para o nome
  },
  artistName: { color: '#FFF', fontSize: 40, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  albumCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#18181B', 
    marginBottom: 12, 
    borderRadius: 8, 
    padding: 10 
  },
  albumCover: { width: 60, height: 60, borderRadius: 4 },
  albumInfo: { flex: 1, marginLeft: 15 },
  albumTitle: { color: '#FFF', fontSize: 16, fontWeight: '500' },
  albumYear: { color: '#71717A', fontSize: 13, marginTop: 4 },
  playIconCircle: { 
    backgroundColor: '#A855F7', 
    padding: 8, 
    borderRadius: 20, 
    marginRight: 5 
  }
});