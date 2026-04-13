import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc, getDoc, addDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { Project, Service, Settings, AppContextType } from '../types';
import { PROJECTS, SERVICES } from '../constants';

const DEFAULT_SETTINGS: Settings = {
  logoUrl: '/Logo.png',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4676.225045842936!2d13.324142779345703!3d-8.861308799999986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f72454cf91d5%3A0x426b2c5d72b38e02!2s6Day%20Studios!5e1!3m2!1spt-PT!2sao!4v1774517180253!5m2!1spt-PT!2sao',
  whatsapp: '244927937226',
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
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'services');
    });

    return () => {
      unsubscribeAuth();
      unsubProjects();
      unsubServices();
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
      const settingsSnap = await getDoc(doc(db, 'settings', 'main'));
      if (!settingsSnap.exists()) {
        await setDoc(doc(db, 'settings', 'main'), DEFAULT_SETTINGS);
      }
    };

    seedData();
  }, [isAdmin, loading, projects.length, services.length]);

  const setIsAdminOpenCallback = React.useCallback((open: boolean) => {
    setIsAdminOpen(open);
  }, []);

  const setIsMobileMenuOpenCallback = React.useCallback((open: boolean) => {
    setIsMobileMenuOpen(open);
  }, []);

  const contextValue = React.useMemo(() => ({
    projects,
    services,
    settings,
    user,
    isAdmin,
    loading,
    isAdminOpen,
    isMobileMenuOpen,
    setIsAdminOpen: setIsAdminOpenCallback,
    setIsMobileMenuOpen: setIsMobileMenuOpenCallback
  }), [projects, services, settings, user, isAdmin, loading, isAdminOpen, isMobileMenuOpen, setIsAdminOpenCallback, setIsMobileMenuOpenCallback]);

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
