export interface Project {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  videoUrl?: string;
  audioUrl?: string;
  type: 'video' | 'audio';
  description: string;
}

export interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  basePrice: number;
  features: string[];
  type: 'video' | 'audio';
}

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Neon Nights - Music Video',
    category: 'Rap',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Produção cinematográfica com iluminação neon e estética cyberpunk.'
  },
  {
    id: '2',
    title: 'Luxury Wedding - Santorini',
    category: 'Evento',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Cobertura completa de evento premium com drones e câmeras 4K.'
  },
  {
    id: '3',
    title: 'Tech Launch 2024',
    category: 'Comercial',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Comercial dinâmico para lançamento de produto tecnológico.'
  },
  {
    id: '4',
    title: 'Urban Beats - Street Session',
    category: 'Kuduro',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a2?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Sessão de performance urbana com edição rítmica e efeitos visuais.'
  },
  {
    id: '5',
    title: 'Acoustic Sessions - EP Production',
    category: 'Acoustic',
    type: 'audio',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    description: 'Produção completa de EP acústico, desde o arranjo até a masterização final.'
  },
  {
    id: '6',
    title: 'Voice Over - Global Campaign',
    category: 'Locução',
    type: 'audio',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    description: 'Engenharia de som e locução profissional para campanha publicitária internacional.'
  },
  {
    id: '7',
    title: 'Urban Flow - Rap Beat',
    category: 'Rap',
    type: 'audio',
    thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    description: 'Beat de rap pesado com influências de trap e boom bap.'
  },
  {
    id: '8',
    title: 'Summer Vibes - House Mix',
    category: 'House',
    type: 'audio',
    thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&q=80&w=800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    description: 'Mixagem de House music para pistas de dança e festivais.'
  },
  {
    id: '9',
    title: 'Kuduro Energy - Street Beat',
    category: 'Kuduro',
    type: 'audio',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    description: 'Produção de Kuduro com ritmos frenéticos e energia contagiante.'
  }
];

export const SERVICES: Service[] = [
  {
    id: 'videoclipes',
    title: 'Videoclipes',
    category: 'Rap/Kuduro',
    type: 'video',
    description: 'Transformamos sua música em uma obra de arte visual.',
    basePrice: 1500,
    features: ['Roteiro Criativo', 'Direção de Fotografia', 'Edição Avançada', 'Color Grading']
  },
  {
    id: 'eventos',
    title: 'Eventos',
    category: 'Social',
    type: 'video',
    description: 'Eternizamos momentos especiais com olhar cinematográfico.',
    basePrice: 800,
    features: ['Cobertura Multi-câmera', 'Imagens de Drone', 'Highlight Reel', 'Entrega em 4K']
  },
  {
    id: 'comerciais',
    title: 'Comerciais',
    category: 'Business',
    type: 'video',
    description: 'Impulsione sua marca com vídeos que convertem.',
    basePrice: 2500,
    features: ['Storytelling Estratégico', 'Motion Graphics', 'Locução Profissional', 'Formatos para Social Ads']
  },
  {
    id: 'musica',
    title: 'Produção Musical',
    category: 'Rap/Kuduro',
    type: 'audio',
    description: 'Produção, mixagem e masterização de alta qualidade.',
    basePrice: 1200,
    features: ['Arranjo Musical', 'Gravação de Voz', 'Mixagem & Masterização', 'Direção Artística']
  },
  {
    id: 'podcast',
    title: 'Podcasts & Locução',
    category: 'Podcast',
    type: 'audio',
    description: 'Captação e edição de áudio para podcasts e publicidade.',
    basePrice: 400,
    features: ['Captação em Estúdio', 'Edição de Diálogos', 'Sound Design', 'Trilha Sonora Original']
  }
];
