import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@lura_music:favorites';

export async function saveFavorite(music: any) {
  try {
    const favorites = await getFavorites();
    // Verifica se já existe para não duplicar
    const exists = favorites.find((item: any) => item.trackTitle === music.trackTitle);
    
    if (!exists) {
      const newFavorites = [...favorites, music];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    }
  } catch (error) {
    console.error("Erro ao salvar favorito:", error);
  }
}

export async function getFavorites() {
  const data = await AsyncStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

export async function removeFavorite(musicTitle: string) {
  const favorites = await getFavorites();
  const filtered = favorites.filter((item: any) => item.trackTitle !== musicTitle);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
}