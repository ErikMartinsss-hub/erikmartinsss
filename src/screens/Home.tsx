import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ActivityIndicator, ScrollView, FlatList, Image, Keyboard 
} from 'react-native';
import { Search } from 'lucide-react-native';
import { getArtistData } from '../services/api';
import { MusicCard } from '../components/MusicCard';
import { useAudio } from '../context/AudioContext'; // Importe o seu contexto

export function Home({ navigation }: any) {
  const { playTrack } = useAudio(); // Pega a função de tocar do contexto
  const [searchText, setSearchText] = useState('');
  const [artist, setArtist] = useState<any>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  
  const [sections, setSections] = useState<any[]>([]);
  const [loadingHome, setLoadingHome] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const response = await fetch('http://192.168.1.15:3000/trending');
        const data = await response.json();
        setSections(data);
      } catch (error) {
        console.error("Erro ao carregar vitrine:", error);
      } finally {
        setLoadingHome(false);
      }
    }
    fetchHomeData();
  }, []);

  const handleSearch = async () => {
    if (!searchText) return;
    setLoadingSearch(true);
    Keyboard.dismiss();
    const data = await getArtistData(searchText);
    setArtist(data);
    setLoadingSearch(false);
  };

  // Função para tocar e navegar
  const handlePlaySong = async (item: any) => {
    // 1. Inicia o áudio globalmente (isso ativa o MiniPlayer)
    await playTrack({
      id: item.id,
      title: item.title,
      artistName: "ListenFree Mix",
      cover: item.cover,
      // A URL será buscada pelo contexto usando o título
    });

    // 2. Opcional: Navega para a tela do Player
    navigation.navigate('Player', { 
      trackTitle: item.title, 
      artistName: "ListenFree Mix", 
      cover: item.cover 
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Lura Music</Text>

      {/* Barra de Busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="O que você quer ouvir?"
          placeholderTextColor="#71717A"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Search color="#A855F7" size={20} />
        </TouchableOpacity>
      </View>

      {/* Busca ... (mantenha seu código de busca aqui) */}

      {/* Playlists Dinâmicas */}
      {loadingHome ? (
        <ActivityIndicator size="large" color="#A855F7" style={{ marginTop: 50 }} />
      ) : (
        sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <FlatList
              data={section.items}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.card}
                  onPress={() => handlePlaySong(item)} // Usa a nova função
                >
                  <Image source={{ uri: item.cover }} style={styles.cover} />
                  <Text style={styles.artistName} numberOfLines={1}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        ))
      )}
      <View style={{ height: 100 }} /> 
    </ScrollView>
  );
}

// ... manter os styles (adicione o padding inferior maior no ScrollView para o MiniPlayer não cobrir)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090B', paddingHorizontal: 20 },
  header: { fontSize: 26, fontWeight: 'bold', color: '#FFF', marginTop: 50, marginBottom: 20 },
  searchContainer: { 
    flexDirection: 'row', backgroundColor: '#1E1E1E', 
    borderRadius: 8, alignItems: 'center', paddingHorizontal: 15, marginBottom: 30 
  },
  input: { flex: 1, height: 45, color: '#FFF' },
  section: { marginBottom: 30 },
  sectionTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  card: { marginRight: 15, width: 140 },
  cover: { width: 140, height: 140, borderRadius: 8 },
  artistName: { color: '#FFF', marginTop: 8, fontSize: 14, fontWeight: '500' }
});