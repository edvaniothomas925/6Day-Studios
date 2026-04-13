import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogIn, LogOut, User as UserIcon, Shield, Instagram, Facebook, Youtube, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { auth, signInWithGoogle, logout } from '../firebase';
import { useApp } from '../context/AppContext';

const Navbar = React.memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { user, isAdmin, settings, setIsAdminOpen, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();
  const location = useLocation();

  useEffect(() => {
    setLogoError(false);
  }, [settings.logoUrl]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = React.useMemo(() => [
    { name: 'Home', href: '/' },
    { name: 'Portfólio', href: '/portfolio' },
    { name: 'Serviços', href: '/servicos' },
    { name: 'Sobre', href: '/sobre' },
  ], []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled || location.pathname !== '/' ? "bg-premium-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            {settings.logoUrl && !logoError ? (
              <img 
                src={settings.logoUrl} 
                alt="Logo" 
                className="h-14 md:h-16 w-auto object-contain" 
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
              />
            ) : (
              <>
                <div className="w-8 h-8 bg-gold rounded-sm flex items-center justify-center text-black font-black">6</div>
                <span>DAY STUDIOS</span>
              </>
            )}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive(link.href) ? "text-gold" : "text-white/70 hover:text-gold"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <button 
                    onClick={() => setIsAdminOpen(true)}
                    className="flex items-center gap-2 px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full text-xs font-bold hover:bg-gold/20 transition-all"
                  >
                    <Shield className="w-3 h-3" /> Painel Admin
                  </button>
                )}
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full" />
                  ) : (
                    <UserIcon className="w-4 h-4" />
                  )}
                  <span className="text-xs font-medium">{user.displayName?.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={logout}
                  className="text-white/50 hover:text-white transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : null}

            <a 
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-gold text-black text-sm font-bold rounded-full hover:scale-105 transition-transform"
            >
              Falar no WhatsApp
            </a>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#0A0A0A] border-l border-white/10 z-[70] p-8 flex flex-col md:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
                  {settings.logoUrl && !logoError ? (
                    <img 
                      src={settings.logoUrl} 
                      alt="Logo" 
                      className="h-10 w-auto object-contain" 
                      referrerPolicy="no-referrer"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-gold rounded-sm flex items-center justify-center text-black font-black text-sm">6</div>
                      <span className="text-sm tracking-widest">DAY STUDIOS</span>
                    </>
                  )}
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-8 mb-12">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                  >
                    <Link 
                      to={link.href} 
                      className={cn(
                        "text-4xl font-bold tracking-tighter transition-all flex items-center gap-4 group",
                        isActive(link.href) ? "text-gold" : "text-white/40 hover:text-gold"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-xs font-black italic opacity-20 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-auto space-y-8">
                {user ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || ''} className="w-12 h-12 rounded-full border-2 border-gold/20" />
                      ) : (
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                          <UserIcon className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-base">{user.displayName?.split(' ')[0]}</div>
                        <div className="text-xs text-white/40 truncate max-w-[150px]">{user.email}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {isAdmin && (
                        <button 
                          onClick={() => { setIsAdminOpen(true); setIsMobileMenuOpen(false); }}
                          className="py-3 bg-gold/10 text-gold text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 border border-gold/20"
                        >
                          <Shield className="w-3 h-3" /> Admin
                        </button>
                      )}
                      <button 
                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                        className="py-3 bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 border border-white/5"
                      >
                        <LogOut className="w-3 h-3" /> Sair
                      </button>
                    </div>
                  </motion.div>
                ) : null}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  <a 
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-5 bg-gold text-black text-center font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-gold/20 flex items-center justify-center gap-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Falar no WhatsApp <ArrowRight className="w-4 h-4" />
                  </a>
                  
                  <div className="flex items-center justify-center gap-6 pt-4">
                    {settings.instagram && (
                      <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-gold transition-colors">
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {settings.facebook && (
                      <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-gold transition-colors">
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {settings.youtube && (
                      <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-gold transition-colors">
                        <Youtube className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

export default Navbar;
