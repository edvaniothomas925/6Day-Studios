import React from 'react';
import { AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import AdminPanel from './AdminPanel';
import { useApp } from '../context/AppContext';

const Layout = React.memo(({ children }: { children: React.ReactNode }) => {
  const { isAdminOpen, loading } = useApp();

  const loadingView = React.useMemo(() => (
    <div className="min-h-screen bg-premium-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  ), []);

  if (loading) {
    return loadingView;
  }

  return (
    <div className="min-h-screen selection:bg-gold selection:text-black bg-premium-black text-white">
      <Navbar />
      
      <AnimatePresence>
        {isAdminOpen && <AdminPanel />}
      </AnimatePresence>

      <main>{children}</main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

export default Layout;
