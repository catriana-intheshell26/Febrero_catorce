
import { Milestone, LyricLine } from './types';

export const AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; 
export const YOUTUBE_ID = "qctGJg5YGjE";

export const INTRO_GALLERY = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1516589174184-c68526614af0?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1494972308845-d171197eaa97?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1511733849282-589d29a6b28a?auto=format&fit=crop&q=80&w=800'
];

export const MILESTONES: Milestone[] = [
  {
    id: 'intro',
    stage: 'Inicio',
    date: 'Bitácora de Inicio',
    title: 'Our love to Admire',
    description: 'Dicen que la vida es un viaje sin mapa, pero yo encontré mi norte en tus ojos. Abre este diario y descubre cómo nuestro amor comenzó a florecer en primavera.',
    phrase: "If the world was ending, I'd wanna be next to you...",
    imageUrl: INTRO_GALLERY[0],
    theme: {
      bg: '#F7FBF2', 
      accent: '#82A078', 
      text: '#2D2926',
      wave: '#A8C69F'
    }
  },
  {
    id: 'encuentro',
    stage: 'Encuentro',
    date: 'Primavera',
    title: 'El Choque de Dos Mundos',
    description: 'Navegamos océanos distintos hasta que el destino nos atrajo. Como el primer brote de la estación, nuestra historia rompió el suelo con fuerza.',
    phrase: "If the party was over and our time on Earth was through...",
    imageUrl: 'https://images.unsplash.com/photo-1518107616985-bd48230d3b20?auto=format&fit=crop&q=80&w=800', 
    theme: {
      bg: '#FDF2F7', 
      accent: '#D97B93', 
      text: '#1A1C1E',
      wave: '#D97B93'
    }
  },
  {
    id: 'crecimiento',
    stage: 'Crecimiento',
    date: 'Verano',
    title: 'Navegando Juntos',
    description: 'El calor de nuestras risas bajo un sol eterno. Crecimos como las olas en agosto, imparables, llenos de luz y energía dorada.',
    phrase: "I'd wanna hold you just for a while...",
    imageUrl: 'https://images.unsplash.com/photo-1516589174184-c68526614af0?auto=format&fit=crop&q=80&w=800',
    theme: {
      bg: '#FFFDF0', 
      accent: '#D4A017', 
      text: '#2D2926',
      wave: '#E9C46A'
    }
  },
  {
    id: 'consolidacion',
    stage: 'Consolidación',
    date: '',
    title: 'Juntos en cada paso...',
    description: 'Planear una vida juntos fue el paso más natural. Decidimos unir nuestros manos bajo un mismo cielo y empezamos a soñar en grande.',
    phrase: "And die with a smile...",
    imageUrl: 'https://images.unsplash.com/photo-1494972308845-d171197eaa97?auto=format&fit=crop&q=80&w=800',
    theme: {
      bg: '#ece0fa', 
      accent: '#9643f5', 
      text: '#1A1C1E',
      wave: '#b95edd'
    }
  },
  {
    id: 'presente',
    stage: 'Presente',
    date: 'Invierno',
    title: 'Amor hecho Vida',
    description: 'Lo soñamos, lo planeamos y finalmente llegó. Nuestra hija es el reflejo de nuestro amor. Hoy, ser sus padres es nuestra misión más importante.',
    phrase: "Right next to you...",
    imageUrl: 'https://images.unsplash.com/photo-1511733849282-589d29a6b28a?auto=format&fit=crop&q=80&w=800',
    theme: {
      bg: '#F0F7FA', 
      accent: '#2A9D8F', 
      text: '#1A1C1E',
      wave: '#A8DADC'
    }
  },
  {
    id: 'futuro',
    stage: 'Futuro',
    date: 'Eternidad',
    title: 'Nuevos Horizontes',
    description: 'Aquí no termina la historia. Seguimos construyendo nuestro hogar, levantando nuestro negocio y soñando con el día en que digamos "si" frente al altar. Lo mejor está por venir.',
    phrase: "Wherever you go, that's where I'll be.",
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800',
    theme: {
      bg: '#4e0632', 
      accent: '#b75274', 
      text: '#FDF8F1',
      wave: '#E8F3E8'
    }
  }
];

export const LYRICS: LyricLine[] = [
  { text: "If the world was ending", timestamp: 0.5 },
  { text: "I'd wanna be next to you", timestamp: 3.2 },
  { text: "If the party was over", timestamp: 6.8 },
  { text: "And our time on Earth was through", timestamp: 9.5 },
  { text: "I'd wanna hold you just for a while", timestamp: 13.8 },
  { text: "And die with a smile", timestamp: 18.2 },
  { text: "If the world was ending", timestamp: 22.5 },
  { text: "I'd wanna be next to you", timestamp: 25.1 },
  { text: "Ooh, lost in your light", timestamp: 30.4 },
  { text: "Baby, I'm yours tonight", timestamp: 34.8 },
  { text: "And I just wanna hold you", timestamp: 39.2 },
  { text: "For the rest of my life", timestamp: 44.5 },
  { text: "Die with a smile...", timestamp: 50.0 }
];
