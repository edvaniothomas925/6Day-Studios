import React from 'react';
import { Instagram, Youtube, Globe, Shield, Lock, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
import { signInWithGoogle } from '../firebase';

const Footer = React.memo(() => {
  const { user, isAdmin, settings, setIsAdminOpen } = useApp();
  const [logoError, setLogoError] = React.useState(false);

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

  return (
    <footer className="py-20 px-6 bg-premium-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
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
