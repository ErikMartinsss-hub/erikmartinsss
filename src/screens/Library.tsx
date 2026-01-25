import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Vibration 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MusicCard } from '../components/MusicCard';

export function Library({ navigation }: any) {
  const [favorites, setFavorites] = useState<any[]>([]);

  // Função para carregar os dados do AsyncStorage
  const loadFavorites = async () => {
    try {
      const data = await AsyncStorage.getItem('@lura_music:favorites');
      const favoritesList = data ? JSON.parse(data) : [];
      setFavorites(favoritesList);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  };

  // hook que dispara sempre que a aba ganha foco
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleRemoveFavorite = (trackTitle: string) => {
    Vibration.vibrate(50); // Feedback tátil padrão Android/iOS

    Alert.alert(
      "Remover dos Favoritos",
      `Deseja remover "${trackTitle}" da sua biblioteca?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Remover", 
          style: "destructive", 
          onPress: async () => {
            const newFavorites = favorites.filter(item => item.trackTitle !== trackTitle);
            await AsyncStorage.setItem('@lura_music:favorites', JSON.stringify(newFavorites));
            setFavorites(newFavorites);
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sua Biblioteca</Text>
      
      <FlatList
        data={favorites}
        keyExtractor={(item: any) => item.trackTitle}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onLongPress={() => handleRemoveFavorite(item.trackTitle)}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Player', {
              trackTitle: item.trackTitle,
              artistName: item.artistName,
              cover: item.cover
            })}
          >
            <MusicCard 
              title={item.trackTitle} 
              artist={item.artistName} 
              cover={item.cover}
              onPress={() => {}} // Desativado pois o pai TouchableOpacity assume
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Você ainda não salvou nenhuma música.</Text>
            <TouchableOpacity 
              style={styles.btnGoHome} 
              onPress={() => navigation.navigate('Início')}
            >
              <Text style={styles.btnText}>Explorar Artistas</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#09090B', 
    paddingHorizontal: 20 
  },
  title: { 
    color: '#FFF', 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginTop: 60, // Espaço para a StatusBar
    marginBottom: 20 
  },
  listContent: { 
    paddingBottom: 100 // Garante que a TabBar não cubra o último item
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 150 
  },
  emptyText: { 
    color: '#71717A', 
    fontSize: 16, 
    textAlign: 'center',
    lineHeight: 24
  },
  btnGoHome: { 
    marginTop: 24, 
    backgroundColor: '#A855F7', 
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30 // Estilo botão pílula do Spotify
  },
  btnText: { 
    color: '#FFF', 
    fontWeight: 'bold',
    fontSize: 16
  }
});