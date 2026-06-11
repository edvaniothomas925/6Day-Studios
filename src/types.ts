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

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  type?: 'digital' | 'physical';
  externalUrl?: string;
}

export interface ClientProject {
  id: string;
  title: string;
  description: string;
  clientEmail: string;
  clientName: string;
  status: 'planeamento' | 'producao' | 'gravacao' | 'edicao' | 'revisao' | 'concluido';
  progress: number;
  notes?: string;
  previewUrl?: string;
  deliveryUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  projectId: string;
  projectTitle: string;
  oldStatus?: string;
  newStatus: string;
  oldProgress?: number;
  newProgress: number;
  timestamp: string;
  read: boolean;
}

export interface AppContextType {
  projects: Project[];
  services: Service[];
  products: Product[];
  settings: Settings;
  user: User | null;
  isAdmin: boolean;
  isAdminOpen: boolean;
  isMobileMenuOpen: boolean;
  loading: boolean;
  setIsAdminOpen: (open: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  // Notifications
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  // PWA triggers
  showInstallButton: boolean;
  triggerInstall: () => Promise<void>;
}
