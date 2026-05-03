import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Video, Music, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

const ServicesPage = () => {
  const { services, settings } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [subFilter, setSubFilter] = useState<string>('all');

  const mainCategories = useMemo(() => ['all', 'video', 'audio'], []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('services');
    if (serviceParam && mainCategories.includes(serviceParam)) {
      setFilter(serviceParam);
    }
  }, []);

  const subCategories = useMemo(() => {
    if (filter === 'all') return [];
    const relevantServices = services.filter(s => s.type === filter);
    const cats = Array.from(new Set(relevantServices.map(s => s.category))).sort();
    return ['all', ...cats];
  }, [filter, services]);

  useEffect(() => {
    setSubFilter('all');
  }, [filter]);

  const filteredServices = services.filter(s => {
    const matchesMain = filter === 'all' || s.type === filter;
    const matchesSub = subFilter === 'all' || s.category === subFilter;
    return matchesMain && matchesSub;
  });

  return (
    <div className="pt-32 pb-24 px-6 bg-premium-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-16 gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Serviços & Planos</h1>
              <p className="text-white/50 max-w-md">Soluções completas para cada necessidade, com transparência e qualidade premium.</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {mainCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-bold transition-all uppercase tracking-widest",
                    filter === cat ? "bg-gold text-black" : "bg-premium-gray text-white/60 hover:bg-white/10"
                  )}
                >
                  {cat === 'all' ? 'Todos' : cat === 'video' ? 'Vídeos' : 'Áudios'}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {subCategories.length > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-wrap gap-2 pb-4 border-b border-white/5 overflow-x-auto no-scrollbar"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-white/30 self-center mr-2">Estilo:</span>
                {subCategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSubFilter(sub)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest",
                      subFilter === sub ? "bg-white/20 text-white" : "bg-white/5 text-white/40 hover:bg-white/10"
                    )}
                  >
                    {sub === 'all' ? 'Todos os Estilos' : sub}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={service.id} 
                className="glass-card p-6 md:p-8 flex flex-col hover:border-gold/50 transition-colors group"
              >
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                      service.type === 'video' ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                    )}>
                      {service.type === 'video' ? 'Vídeo' : 'Áudio'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest">
                      {service.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                  <p className="text-white/50 text-sm">{service.description}</p>
                </div>
                
                <div className="mb-8">
                  <span className="text-sm text-white/40">A partir de</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">Kz {service.basePrice.toLocaleString()}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {service.features.map((feature, idx) => (
                    <li key={`${service.id}-feature-${idx}`} className="flex items-center gap-3 text-sm text-white/70">
                      <Check className="w-4 h-4 text-gold" /> {feature}
                    </li>
                  ))}
                </ul>

                <a 
                  href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse no serviço de ${service.title}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-white/10 border border-white/20 text-white text-center font-bold rounded-xl hover:bg-gold hover:text-black transition-all"
                >
                  Contratar agora
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Budget Calculator CTA */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="relative overflow-hidden rounded-3xl bg-gold p-8 md:p-12 text-black"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 uppercase">Precisa de um pacote sob medida?</h2>
              <p className="text-black/70 font-medium">Use nossa Calculadora Inteligente para combinar serviços e obter uma estimativa instantânea do seu projeto.</p>
            </div>
            <div className="flex shrink-0">
               <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center animate-bounce shadow-2xl">
                  <ArrowRight className="w-8 h-8 text-gold rotate-45" />
               </div>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesPage;
