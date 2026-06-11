import React from 'react';
import { Instagram, Youtube, Globe, Shield, Lock, Facebook, Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
import { signInWithGoogle, db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const Footer = React.memo(() => {
  const { user, isAdmin, settings, setIsAdminOpen } = useApp();
  const [logoError, setLogoError] = React.useState(false);

  // Newsletter State
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(() => {
    return localStorage.getItem('newsletter_subscribed') === 'true';
  });

  React.useEffect(() => {
    setLogoError(false);
  }, [settings.logoUrl]);

  const handleAdminLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (result) {
        toast.success('Login realizado com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao realizar login.');
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error('Por favor, introduza um endereço de e-mail válido.');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email: trimmedEmail,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('newsletter_subscribed', 'true');
      setIsSubscribed(true);
      setEmail('');
      toast.success('Inscrição confirmada!', {
        description: 'Obrigado por se subscrever! Enviamos novidades em breve.',
        duration: 5000,
      });
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      try {
        handleFirestoreError(error, OperationType.CREATE, 'newsletter_subscribers');
      } catch (err) {
        toast.error('Erro ao subscrever a newsletter. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="py-20 px-6 bg-premium-black border-t border-white/5" id="footer-section">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Pitch & Lead Capture Row */}
        <div className="pb-12 mb-12 border-b border-white/5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8" id="newsletter-container">
          <div className="max-w-md">
            <h3 className="text-lg font-bold tracking-tight text-white mb-2 flex items-center gap-2" id="newsletter-title">
              <Mail className="w-4 h-4 text-gold animate-pulse" /> Subscreva a nossa Newsletter
            </h3>
            <p className="text-xs text-white/50 leading-relaxed" id="newsletter-description">
              Seja o primeiro a receber novidades de áudio, lançamentos de produções de vídeo do estúdio, campanhas publicitárias e promoções exclusivas da 6Day Studios.
            </p>
          </div>

          {isSubscribed ? (
            <div className="flex items-center gap-3 bg-gold/5 border border-gold/15 p-4 rounded-xl max-w-sm w-full animate-fade-in" id="newsletter-success-box">
              <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Subscrição Ativa</p>
                <p className="text-[10px] text-white/50 leading-relaxed">Você agora faz parte da nossa comunidade VIP. Fique atento à sua caixa de entrada!</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md w-full" id="newsletter-subscribe-form">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="email"
                    required
                    placeholder="Introduza o seu melhor e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full bg-white/5 hover:bg-white/[0.08] focus:bg-[#0E0E0E] text-white border border-white/10 focus:border-gold/50 rounded-xl px-4 py-3 text-xs focus:outline-none transition-all pl-10 h-11"
                    id="newsletter-email-input"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gold hover:bg-gold-dark text-black font-black text-xs uppercase tracking-wider px-6 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed h-11"
                  id="newsletter-submit-btn"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Subscrever <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-white/30 mt-2">
                * Respeitamos a sua privacidade. Cancele a sua subscrição a qualquer momento.
              </p>
            </form>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2 mb-6">
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
            <p className="text-white/40 max-w-sm mb-8">
              Gravadora, Loja & Distribuidora. Produtora AudioVisual e Marketing Digital em Luanda, Angola.
            </p>
            <div className="flex gap-4">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-black transition-all" title="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-black transition-all" title="YouTube">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-black transition-all" title="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings.tiktok && (
                <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-black transition-all" title="TikTok">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.31-.75.42-1.24 1.25-1.33 2.1-.1.7.1 1.41.53 1.98.5.73 1.36 1.19 2.26 1.2 1.02.06 2.09-.44 2.63-1.32.36-.58.44-1.29.42-1.97-.03-4.68-.01-9.37-.02-14.05z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-white/40">Partilhar</h4>
            <div className="space-y-3">
              <a 
                href={`https://wa.me/?text=${encodeURIComponent('Confira o Portfólio da 6Day Studios: ' + window.location.origin + '/portfolio')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all group"
              >
                Portfólio
              </a>
              <a 
                href={`https://wa.me/?text=${encodeURIComponent('Confira os Serviços da 6Day Studios: ' + window.location.origin + '/servicos')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all group"
              >
                Serviços
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-white/40">Links Úteis</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
              <li><Link to="/portfolio" className="hover:text-gold transition-colors">Portfólio</Link></li>
              <li><Link to="/servicos" className="hover:text-gold transition-colors">Serviços</Link></li>
              <li><Link to="/sobre" className="hover:text-gold transition-colors">Sobre</Link></li>
              {isAdmin && (
                <li>
                  <button onClick={() => setIsAdminOpen(true)} className="text-gold font-bold hover:underline flex items-center gap-2">
                    <Shield className="w-3 h-3" /> Painel Admin
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-white/40">Contato</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li>{settings.email}</li>
              <li>{settings.whatsapp}</li>
              <li>
                {settings.address}
                {settings.mapEmbedUrl && (
                  <Link to="/sobre" className="block text-gold text-xs mt-1 hover:underline">
                    Ver no Mapa
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20">© 2024 6Day Studios. Todos os direitos reservados.</p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-white/20">
            <Link to="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            <Link to="/termos" className="hover:text-white transition-colors">Termos</Link>
            {!user ? (
              <button 
                onClick={handleAdminLogin}
                className="hover:text-gold transition-colors"
              >
                Entrar
              </button>
            ) : (
              <span className="text-gold/40 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Sessão Ativa
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
