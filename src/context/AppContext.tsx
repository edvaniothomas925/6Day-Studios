import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc, getDoc, addDoc, where, query } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { Project, Service, Settings, AppContextType, Product, AppNotification, ClientProject } from '../types';
import { PROJECTS, SERVICES, PRODUCTS } from '../constants';
import { toast } from 'sonner';

const DEFAULT_SETTINGS: Settings = {
  logoUrl: '/Logo.png',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4676.225045842936!2d13.324142779345703!3d-8.861308799999986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f72454cf91d5%3A0x426b2c5d72b38e02!2s6Day%20Studios!5e1!3m2!1spt-PT!2sao!4v1774517180253!5m2!1spt-PT!2sao',
  whatsapp: '+244 945 986 037',
  email: '6daystudio26@gmail.com',
  address: 'Viana Bela Vista, Rua da Escolinha, Luanda, Angola',
  instagram: 'https://instagram.com/6daystudios_',
  youtube: 'https://youtube.com/6daystudios',
  facebook: 'https://facebook.com/6daystudios',
  tiktok: 'https://tiktok.com/@6daystudios'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const stored = localStorage.getItem('user_notifications');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('user_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(() => {
    // Check if running in standalone mode or already marked as installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const isAlreadyInstalled = localStorage.getItem('pwa_installed') === 'true';
    if (isStandalone || isAlreadyInstalled) {
      return false;
    }
    return true; // Make it visible to anyone not already installed so they can trigger instructions/prompts!
  });

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const isAlreadyInstalled = localStorage.getItem('pwa_installed') === 'true';
    
    if (isStandalone || isAlreadyInstalled) {
      setShowInstallButton(false);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      if (isStandalone || isAlreadyInstalled) {
        return;
      }
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      console.log('O aplicativo foi instalado com sucesso!');
      localStorage.setItem('pwa_installed', 'true');
      setShowInstallButton(false);
      setDeferredPrompt(null);
      toast.success("Instalação concluída com sucesso!", {
        description: "Obrigado por instalar o aplicativo da 6Day Studios no seu dispositivo.",
        duration: 8000,
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstall = async () => {
    // Check if inside Google AI Studio Preview Iframe
    const isInIframe = window.self !== window.top;

    if (isInIframe) {
      toast.info("Aviso de Compatibilidade PWA", {
        duration: 12000,
        description: "Os navegadores bloqueiam instalações nativas dentro de painéis de pré-visualização (iframes). Clique no botão 'Abrir numa nova aba' no canto superior direito para poder instalar diretamente da barra de endereço!",
        action: {
          label: "Instruções",
          onClick: () => {
            alert(
              "Para Instalar o Aplicativo (PWA):\n\n" +
              "1. Abra a aplicação numa aba separada fora do painel de desenvolvimento.\n" +
              "2. No Computador: Clique no ícone de instalação (computador com seta para baixo) na barra de endereço (URL) do seu navegador.\n" +
              "3. No Celular (Android): Clique no banner de instalação ou escolha 'Adicionar ao ecrã principal' no menu do Chrome.\n" +
              "4. No iOS (iPhone): Clique em 'Partilhar/Enviar' e selecione 'Adicionar ao ecrã inicial'."
            );
          }
        }
      });
      return;
    }

    if (!deferredPrompt) {
      toast.info("Suporte de Instalação", {
        duration: 10000,
        description: "Pode instalar diretamente escolhendo 'Adicionar ao ecrã principal' ou clicando no ícone de computador/instalação na barra de endereço do seu navegador.",
        action: {
          label: "Como instalar?",
          onClick: () => {
            alert(
              "Como Instalar o 6Day Studios:\n\n" +
              "- Google Chrome (Desktop): Clique no ícone de monitor na barra de URL (direita).\n" +
              "- Android (Chrome): Clique nos três pontos (...) e depois em 'Adicionar ao ecrã principal' / 'Instalar aplicativo'.\n" +
              "- iOS / iPhone (Safari): Toque no botão 'Partilhar' (seta apontando para cima) e selecione 'Adicionar ao ecrã principal'."
            );
          }
        }
      });
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA install option was: ${outcome}`);
      if (outcome === 'accepted') {
        localStorage.setItem('pwa_installed', 'true');
        setShowInstallButton(false);
        setDeferredPrompt(null);
        toast.success("Instalação concluída com sucesso!", {
          description: "Obrigado por instalar o aplicativo da 6Day Studios no seu dispositivo.",
          duration: 8000,
        });
      }
    } catch (err) {
      console.error("Falha ao abrir prompt de instalação:", err);
    }
  };

  // Real-time listener for client project status transitions
  useEffect(() => {
    if (!user?.email) return;

    const q = query(
      collection(db, 'client_projects'),
      where('clientEmail', '==', user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const storedStatesStr = localStorage.getItem('last_project_states');
      const storedStates = storedStatesStr ? JSON.parse(storedStatesStr) : {};
      const newStates: Record<string, { status: string; progress: number; title: string }> = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data() as ClientProject;
        const projectId = doc.id;
        const projectTitle = data.title || 'Projeto';
        const currentStatus = data.status || 'planeamento';
        const currentProgress = data.progress || 0;

        newStates[projectId] = {
          status: currentStatus,
          progress: currentProgress,
          title: projectTitle
        };

        const previous = storedStates[projectId];
        if (previous) {
          const statusChanged = previous.status !== currentStatus;
          const progressChanged = previous.progress !== currentProgress;

          if (statusChanged || progressChanged) {
            // New transition detected
            const timestamp = new Date().toISOString();
            const STATUS_LABELS: Record<string, string> = {
              planeamento: 'Planeamento & Guião',
              producao: 'Pré-Produção & Recursos',
              gravacao: 'Captação & Gravação',
              edicao: 'Edição & Mistura',
              revisao: 'Fase de Revisão (Draft)',
              concluido: 'Concluido'
            };

            const newStatusLabel = STATUS_LABELS[currentStatus] || currentStatus;
            let msg = '';
            
            if (statusChanged && progressChanged) {
              msg = `O seu projeto "${projectTitle}" avançou para ${newStatusLabel} (${currentProgress}% progress).`;
            } else if (statusChanged) {
              msg = `O seu projeto "${projectTitle}" está agora na fase de: ${newStatusLabel}.`;
            } else {
              msg = `O progresso do seu projeto "${projectTitle}" subiu para ${currentProgress}%.`;
            }

            const newNotif: AppNotification = {
              id: `${projectId}_${Date.now()}`,
              projectId,
              projectTitle,
              oldStatus: previous.status,
              newStatus: currentStatus,
              oldProgress: previous.progress,
              newProgress: currentProgress,
              timestamp,
              read: false
            };

            setNotifications(prev => [newNotif, ...prev]);

            toast.success(msg, {
              duration: 8000,
              description: 'Consulte as atualizações na área "Acompanhar".',
              action: {
                label: 'Ver Painel',
                onClick: () => {
                  window.location.href = '/acompanhar';
                }
              }
            });
          }
        }
      });

      // Update local storage reference index
      localStorage.setItem('last_project_states', JSON.stringify(newStates));
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    // Auth Listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const isDefaultAdmin = currentUser.email === 'edvaniothomas925@gmail.com';
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (isDefaultAdmin && userData.role !== 'admin') {
            await setDoc(userRef, { ...userData, role: 'admin' }, { merge: true });
            setIsAdmin(true);
          } else {
            setIsAdmin(userData.role === 'admin');
          }
        } else {
          setIsAdmin(isDefaultAdmin);
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            role: isDefaultAdmin ? 'admin' : 'client'
          });
        }
      } else {
        setIsAdmin(false);
      }
    });

    // Settings Listener
    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings({ ...DEFAULT_SETTINGS, ...snapshot.data() } as Settings);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/main');
    });

    // Projects Listener
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(projectsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
    });

    // Services Listener
    const unsubServices = onSnapshot(collection(db, 'services'), (snapshot) => {
      const servicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
      setServices(servicesData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'services');
    });

    // Products Listener
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => {
      unsubscribeAuth();
      unsubProjects();
      unsubServices();
      unsubProducts();
      unsubSettings();
    };
  }, []);

  // Seeding logic for Admin
  useEffect(() => {
    if (!isAdmin || loading) return;

    const seedData = async () => {
      if (projects.length === 0) {
        for (const p of PROJECTS) {
          const { id, ...rest } = p;
          await addDoc(collection(db, 'projects'), rest);
        }
      }
      if (services.length === 0) {
        for (const s of SERVICES) {
          const { id, ...rest } = s;
          await addDoc(collection(db, 'services'), rest);
        }
      }
      if (products.length === 0) {
        for (const prod of PRODUCTS) {
          const { id, ...rest } = prod;
          await addDoc(collection(db, 'products'), rest);
        }
      }
      const settingsSnap = await getDoc(doc(db, 'settings', 'main'));
      if (!settingsSnap.exists()) {
        await setDoc(doc(db, 'settings', 'main'), DEFAULT_SETTINGS);
      } else {
        const currentData = settingsSnap.data();
        if (currentData && (currentData.whatsapp === '244927937226' || !currentData.whatsapp)) {
          await setDoc(doc(db, 'settings', 'main'), { whatsapp: '+244 945 986 037' }, { merge: true });
        }
      }
    };

    seedData();
  }, [isAdmin, loading, projects.length, services.length, products.length]);

  const setIsAdminOpenCallback = React.useCallback((open: boolean) => {
    setIsAdminOpen(open);
  }, []);

  const setIsMobileMenuOpenCallback = React.useCallback((open: boolean) => {
    setIsMobileMenuOpen(open);
  }, []);

  const contextValue = React.useMemo(() => ({
    projects,
    services,
    products,
    settings,
    user,
    isAdmin,
    loading,
    isAdminOpen,
    isMobileMenuOpen,
    setIsAdminOpen: setIsAdminOpenCallback,
    setIsMobileMenuOpen: setIsMobileMenuOpenCallback,
    // Notifications
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    // PWA
    showInstallButton,
    triggerInstall
  }), [
    projects, services, products, settings, user, isAdmin, loading, isAdminOpen, isMobileMenuOpen, 
    setIsAdminOpenCallback, setIsMobileMenuOpenCallback,
    notifications, unreadNotificationsCount, showInstallButton
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
