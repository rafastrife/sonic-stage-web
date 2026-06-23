export interface MusicaRepertorio {
  id?: string;
  ordem: number;
  nome: string;
  artista: string;
  tom: string;
  bpm?: number;
  instrumento_inicio: string;
  observacoes?: string;
}

export interface Repertorio {
  id?: string;
  nome: string;
  banda: string;
  criado_em?: string;
  atualizado_em?: string;
  evento_id?: number | null;
  musicas: MusicaRepertorio[];
}
