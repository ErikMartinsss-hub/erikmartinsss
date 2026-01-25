import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Interface para as músicas
interface Song {
  id: string;
  name: string;
  image: Array<{ quality: string; link: string }>;
  downloadUrl: Array<{ quality: string; link: string }>;
}

interface SongResponse {
  data: {
    results: Song[];
  };
}

// ROTA 1: Busca música específica para o Player
app.get('/search-music', async (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Faltou o nome!' });

  try {
    const response = await fetch(`https://saavn.me/search/songs?query=${encodeURIComponent(query as string)}`);
    const data: SongResponse = await response.json();

    if (data.data.results.length > 0) {
      const track = data.data.results[0];
      return res.json({
        title: track.name,
        url: track.downloadUrl.slice(-1)[0].link // Melhor qualidade
      });
    }
    res.status(404).json({ message: 'Não encontrada' });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// ROTA 2: Sugestões para a Home (Playlists Estilo ListenFree)
app.get('/trending', async (_req: Request, res: Response) => {
  try {
    const response = await fetch(`https://saavn.me/search/songs?query=Top%20Hits%202026`);
    const data: SongResponse = await response.json();

    const trending = data.data.results.map(song => ({
      id: song.id,
      title: song.name,
      cover: song.image.slice(-1)[0].link 
    }));

    return res.json(trending);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar destaques' });
  }
});

// AJUSTE PARA PRODUÇÃO:
// process.env.PORT permite que o serviço de nuvem (Render/Railway) defina a porta.
// O '0.0.0.0' é fundamental para aceitar conexões externas ao servidor.
const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Lura Music Backend online na porta ${PORT}`);
});