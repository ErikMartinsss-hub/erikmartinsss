const BASE_URL = "https://www.theaudiodb.com/api/v1/json/123";

/**
 * Busca dados básicos de um artista pelo nome
 */
export async function getArtistData(artistName: string) {
  try {
    // Tratamento para nomes com espaço (ex: "Jorge e Mateus" vira "Jorge_e_Mateus")
    const formattedName = artistName.trim().replace(/\s+/g, '_');
    
    const response = await fetch(`${BASE_URL}/search.php?s=${formattedName}`);
    const data = await response.json();
    
    return data.artists ? data.artists[0] : null;
  } catch (error) {
    console.error("Erro ao buscar artista:", error);
    return null;
  }
}

/**
 * Busca todos os álbuns de um artista usando o ID dele
 */
export async function getArtistAlbums(artistId: string) {
  try {
    const response = await fetch(`${BASE_URL}/album.php?i=${artistId}`);
    const data = await response.json();
    return data.album || [];
  } catch (error) {
    console.error("Erro ao buscar álbuns:", error);
    return [];
  }
}

/**
 * Busca as faixas (músicas) de um álbum específico
 */
export async function getAlbumTracks(albumId: string) {
  try {
    const response = await fetch(`${BASE_URL}/track.php?m=${albumId}`);
    const data = await response.json();
    return data.track || [];
  } catch (error) {
    console.error("Erro ao buscar músicas:", error);
    return [];
  }
}

/**
 * Função utilitária para formatar milissegundos em mm:ss
 */
export function formatDuration(ms: string) {
  const totalSeconds = Math.floor(parseInt(ms) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}