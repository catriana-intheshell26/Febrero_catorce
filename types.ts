
export interface Milestone {
  id: string;
  stage: 'Inicio' | 'Encuentro' | 'Crecimiento' | 'Consolidación' | 'Presente' | 'Futuro';
  date: string;
  title: string;
  description: string;
  phrase: string;
  imageUrl: string;
  theme: {
    bg: string;
    accent: string;
    text: string;
    wave: string;
  };
}

export interface LyricLine {
  text: string;
  timestamp: number;
}
