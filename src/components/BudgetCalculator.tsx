import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Check, Plus, MessageCircle, X, Sparkles, Receipt, ArrowRight, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Service } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export const BudgetCalculator = () => {
  const { services, settings, user } = useApp();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const isVerified = user?.emailVerified;

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id) 
        : [...prev, id]
    );
  };

  const totalPrice = useMemo(() => {
    return services
      .filter(s => selectedServices.includes(s.id))
      .reduce((acc, s) => acc + s.basePrice, 0);
  }, [services, selectedServices]);

  const selectedItems = useMemo(() => {
    return services.filter(s => selectedServices.includes(s.id));
  }, [services, selectedServices]);

  const handleWhatsAppRequest = () => {
    if (!user) {
      toast.error('Por favor, faça login para obter o seu orçamento.');
      return;
    }
    if (!user.emailVerified) {
      toast.error('Por favor, verifique o seu e-mail antes de solicitar propostas.');
      return;
    }
    const itemsList = selectedItems.map(s => `- ${s.title}: ${new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(s.basePrice)}`).join('%0A');
    const totalFormatted = new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(totalPrice);
    const message = `Olá! Estive a usar a Calculadora de Orçamento no site da 6Day Studios e gostaria de mais informações sobre estes serviços:%0A%0A${itemsList}%0A%0A*Total Estimado: ${totalFormatted}*%0A%0AComo podemos prosseguir?`;
    window.open(`https://wa.me/${settings.whatsapp}?text=${message}`, '_blank');
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={handleOpen}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          y: [0, -10, 0] 
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          },
          scale: { duration: 0.3 }
        }}
        whileHover={{ scale: 1.1, y: 0 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-28 right-8 z-40 w-16 h-16 rounded-full shadow-[0_10px_40px_rgba(212,175,55,0.4)] flex items-center justify-center group bg-gold text-black"
      >
        <Calculator className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        
        {selectedServices.length > 0 && (
          <div className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-gold">
            {selectedServices.length}
          </div>
        )}
        
        {/* Label on Hover */}
        <div className="absolute right-20 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Calculadora de Orçamento
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            />

            {/* Calculator Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-premium-black border-l border-white/10 z-[60] flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gold text-black">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black/10 flex items-center justify-center">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-widest">Orçamento Inteligente</h2>
                    <p className="text-[10px] font-bold uppercase opacity-60">Personalize o seu pacote 6Day</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                {/* Intro */}
                <div className="glass-card p-6 border-gold/20">
                  <div className="flex items-start gap-4">
                    <Sparkles className="w-6 h-6 text-gold shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-white/70 leading-relaxed">
                        Selecione os serviços que deseja combinar. O sistema calcula automaticamente o investimento projetado para a sua visão.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Categories */}
                {['audio', 'video'].map((type) => (
                  <div key={type} className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gold opacity-50 flex items-center gap-2">
                       <div className="w-1 h-3 bg-gold" />
                       {type === 'audio' ? 'Engenharia de Som' : 'Produção Visual'}
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {services.filter(s => s.type === type).map((service) => (
                        <button
                          key={service.id}
                          onClick={() => toggleService(service.id)}
                          className={cn(
                            "w-full text-left p-4 rounded-xl border transition-all duration-300 group",
                            selectedServices.includes(service.id)
                              ? "bg-gold/10 border-gold shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                              : "bg-white/5 border-white/10 hover:border-white/20"
                          )}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-sm">{service.title}</h4>
                                {selectedServices.includes(service.id) && (
                                  <Check className="w-3 h-3 text-gold" />
                                )}
                              </div>
                              <p className="text-[10px] text-white/40 line-clamp-1">{service.description}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-black text-gold">
                                {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(service.basePrice)}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Footer */}
              <div className="p-8 bg-premium-gray border-t border-white/10">
                <div className="mb-6 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white/40 uppercase tracking-widest">
                    <span>Itens Selecionados</span>
                    <span>{selectedServices.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/60">
                      <Receipt className="w-4 h-4" />
                      <span className="text-sm font-medium">Total Estimado</span>
                    </div>
                    <span className="text-3xl font-black text-white tracking-tighter">
                      {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(totalPrice)}
                    </span>
                  </div>
                </div>

                <button
                  disabled={selectedServices.length === 0}
                  onClick={handleWhatsAppRequest}
                  className={cn(
                    "w-full py-5 rounded-full flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em] transition-all",
                    selectedServices.length > 0
                      ? "bg-gold text-black hover:scale-[1.02] shadow-[0_15px_30px_rgba(212,175,55,0.2)] active:scale-95"
                      : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                  )}
                >
                  <MessageCircle className="w-5 h-5" />
                  Solicitar Proposta <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[9px] text-center text-white/20 mt-4 uppercase tracking-widest font-bold">
                  Valores base. O orçamento final pode variar após análise técnica.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
