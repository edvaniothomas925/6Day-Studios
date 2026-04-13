import { User } from 'firebase/auth';

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  type: 'video' | 'audio';
  category: string;
  videoUrl?: string;
  audioUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  features: string[];
  category: string;
  type: 'video' | 'audio';
}

export interface Settings {
  logoUrl?: string;
  mapEmbedUrl?: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  youtube: string;
  facebook: string;
  tiktok?: string;
}

export interface AppContextType {
  projects: Project[];
  services: Service[];
  settings: Settings;
  user: User | null;
  isAdmin: boolean;
  isAdminOpen: boolean;
  isMobileMenuOpen: boolean;
  loading: boolean;
  setIsAdminOpen: (open: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
}
