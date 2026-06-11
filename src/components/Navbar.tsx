import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogIn, LogOut, User as UserIcon, Shield, Instagram, Facebook, Youtube, ArrowRight, Bell, Smartphone, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { cn, getWhatsAppUrl } from '../lib/utils';
import { auth, signInWithGoogle, logout } from '../firebase';
import { useApp } from '../context/AppContext';

const Navbar = React.memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { 
    user, 
    isAdmin, 
    settings, 
    setIsAdminOpen, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    showInstallButton,
    triggerInstall
  } = useApp();
  const location = useLocation();

  useEffect(() => {
    setLogoError(false);
  }, [settings.logoUrl]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = React.useMemo(() => {
    const list = [
      { name: 'Home', href: '/' },
      { name: 'Portfólio', href: '/portfolio' },
      { name: 'Serviços', href: '/servicos' },
      { name: 'Agendar', href: '/agendar' },
      { name: 'Produtos', href: '/produtos' },
      { name: 'Novidades', href: '/novidades' },
    ];
    if (user) {
      list.push({ name: 'Acompanhar', href: '/acompanhar' });
    }
    list.push({ name: 'Sobre', href: '/sobre' });
    return list;
  }, [user]);

  const isActive = (path: string) => {
    if (path.includes('#')) {
      return (location.pathname + location.hash) === path;
    }
    return location.pathname === path && !location.hash;
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (result) {
        toast.success('Bem-vindo(a)!');
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao tentar entrar.');
    }
  };

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
            
            {showInstallButton && (
              <button 
                onClick={triggerInstall}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-gold/10 hover:bg-gold hover:text-black text-gold hover:scale-105 border border-gold/20 hover:border-transparent rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                title="Instalar Aplicativo (PWA)"
              >
                <Smartphone className="w-3.5 h-3.5" /> Instalar App
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-4 relative">
                {/* Notifications Bell */}
                <div className="relative">
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className={cn(
                      "p-2 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 transition-all relative",
                      isNotificationsOpen && "text-gold border-gold/30 bg-white/10"
                    )}
                    title="Notificações"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-red-650 text-white font-black text-[9px] rounded-full flex items-center justify-center animate-pulse">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0E0E0E] border border-white/10 rounded-2xl shadow-2xl z-50 p-4"
                          style={{ top: '100%' }}
                        >
                          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                            <div className="flex items-center gap-2">
                              <Bell className="w-4 h-4 text-gold" />
                              <span className="font-bold text-sm tracking-tight">Notificações</span>
                            </div>
                            <div className="flex gap-2">
                              {unreadNotificationsCount > 0 && (
                                <button 
                                  onClick={() => { markAllNotificationsAsRead(); toast.success('Todas marcadas como lidas'); }}
                                  className="text-[10px] font-black uppercase text-gold hover:underline"
                                >
                                  Lidas
                                </button>
                              )}
                              {notifications.length > 0 && (
                                <button 
                                  onClick={() => { clearNotifications(); toast.info('Histórico apagado.'); }}
                                  className="text-[10px] font-black uppercase text-white/40 hover:text-white"
                                >
                                  Limpar Tudo
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
                            {notifications.length === 0 ? (
                              <div className="py-8 text-center text-white/30 space-y-1">
                                <p className="text-xs font-bold uppercase tracking-wider">Acompanhar Projeto</p>
                                <p className="text-[10px] text-white/40 leading-relaxed">Você será alertado em tempo real aqui quando o status do seu projeto for atualizado.</p>
                              </div>
                            ) : (
                              notifications.map((n) => (
                                <div 
                                  key={n.id} 
                                  onClick={() => markNotificationAsRead(n.id)}
                                  className={cn(
                                    "p-3 rounded-xl border text-left hover:bg-white/[0.02] transition-colors relative cursor-pointer",
                                    n.read ? "bg-white/[0.01] border-white/5" : "bg-gold/5 border-gold/20"
                                  )}
                                >
                                  {!n.read && (
                                    <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-gold" />
                                  )}
                                  
                                  <h5 className="font-bold text-xs text-white max-w-[85%] truncate">{n.projectTitle}</h5>
                                  
                                  <p className="text-[11px] text-white/60 mt-1 leading-relaxed">
                                    O progresso agora é de <strong className="text-white">{n.newProgress}%</strong>. 
                                    {n.oldStatus !== n.newStatus && (
                                      <span> Mudou de Status para <strong className="text-gold uppercase text-[9px] font-bold">{n.newStatus}</strong></span>
                                    )}
                                  </p>

                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.03] text-[9px] text-white/30 font-medium">
                                    <span className="flex items-center gap-1 font-mono">
                                      <Clock className="w-2.5 h-2.5" />
                                      {new Date(n.timestamp).toLocaleDateString()}
                                    </span>
                                    
                                    {!n.read && (
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); markNotificationAsRead(n.id); }}
                                        className="text-[9px] text-gold font-bold hover:underline"
                                      >
                                        Marcar como lida
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                          
                          <div className="pt-3 border-t border-white/10 mt-3 text-center">
                            <Link 
                              to="/acompanhar" 
                              onClick={() => setIsNotificationsOpen(false)}
                              className="text-[10px] text-gold font-black uppercase tracking-widest hover:underline flex items-center justify-center gap-1.5"
                            >
                              Ver Painel de Acompanhamento <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

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
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-gold transition-colors text-sm font-bold uppercase tracking-widest"
              >
                <LogIn className="w-4 h-4" /> Entrar
              </button>
            )}

            <a 
              href={getWhatsAppUrl(settings.whatsapp)}
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

                    {/* Collapsible Mobile Notifications Accordion */}
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                      <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-2">
                        <span className="text-xs font-black uppercase tracking-widest text-white/50 flex items-center gap-1.5">
                          <Bell className="w-3.5 h-3.5 text-gold" /> Notificações ({unreadNotificationsCount})
                        </span>
                        {notifications.length > 0 && (
                          <button 
                            onClick={() => { clearNotifications(); toast.info('Histórico apagado.'); }}
                            className="text-[10px] text-white/40 hover:text-white uppercase font-bold"
                          >
                            Apagar
                          </button>
                        )}
                      </div>

                      <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {notifications.length === 0 ? (
                          <div className="text-center py-4 text-[10px] text-white/30 italic">
                            Nenhuma notificação nova
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id}
                              onClick={() => markNotificationAsRead(n.id)}
                              className={cn(
                                "p-2.5 rounded-xl border text-left text-xs relative transition-all cursor-pointer",
                                n.read ? "bg-white/[0.01] border-white/5" : "bg-gold/10 border-gold/20"
                              )}
                            >
                              {!n.read && (
                                <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-gold" />
                              )}
                              <div className="font-bold tracking-tight text-white line-clamp-1">{n.projectTitle}</div>
                              <div className="text-[10px] text-white/50 mt-0.5">
                                Progresso: {n.newProgress}%. Fase: {n.newStatus}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {isAdmin && (
                        <button 
                          onClick={() => { setIsAdminOpen(true); setIsMobileMenuOpen(false); }}
                          className="py-3 bg-gold/10 text-gold text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 border border-gold/20 cursor-pointer"
                        >
                          <Shield className="w-3 h-3" /> Admin
                        </button>
                      )}
                      <button 
                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                        className="py-3 bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 border border-white/5 cursor-pointer"
                      >
                        <LogOut className="w-3 h-3" /> Sair
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => { handleLogin(); setIsMobileMenuOpen(false); }}
                    className="w-full py-5 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" /> Fazer Login
                  </motion.button>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  {showInstallButton && (
                    <button 
                      onClick={() => { triggerInstall(); setIsMobileMenuOpen(false); }}
                      className="w-full py-5 bg-gold/10 hover:bg-gold/20 text-gold text-center font-black text-xs uppercase tracking-[0.2em] rounded-2xl border border-gold/20 flex items-center justify-center gap-3 transition-all cursor-pointer"
                    >
                      <Smartphone className="w-4 h-4 animate-bounce" /> Instalar Aplicativo
                    </button>
                  )}

                  <a 
                    href={getWhatsAppUrl(settings.whatsapp)}
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
