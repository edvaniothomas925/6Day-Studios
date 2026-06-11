import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, DollarSign, Clock, Sparkles, MessageSquare } from 'lucide-react';
import { getWhatsAppUrl } from '../lib/utils';
import { useApp } from '../context/AppContext';

interface FAQItem {
  question: string;
  answer: string;
  category: 'timeline' | 'pricing' | 'general';
  icon: React.ReactNode;
}

export const FAQSection: React.FC = () => {
  const { settings } = useApp();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      question: "Qual é o preço médio para a produção de um videoclipe ou comercial?",
      answer: "O investimento varia de acordo com a complexidade do projeto, número de locações, elenco e pós-produção (VFX). No entanto, criamos uma Calculadora de Orçamento inteligente no nosso site! Ao clicar no ícone de calculadora/carrinho no canto inferior direito, você pode combinar serviços como Beatmaking, Captação de Vídeo e Edição para estimar o seu orçamento oficial instantaneamente.",
      category: "pricing",
      icon: <DollarSign className="w-4 h-4 text-gold" />
    },
    {
      question: "Quanto tempo demora para finalizar uma produção de vídeo completa?",
      answer: "O fluxo de trabalho cinematográfico divide-se em pré-produção, captação e pós-produção. Um videoclipe ou comercial institucional padrão costuma demorar de 10 a 20 dias úteis para a entrega da versão master, permitindo até duas rodadas de revisões finas sem custos adicionais.",
      category: "timeline",
      icon: <Clock className="w-4 h-4 text-gold" />
    },
    {
      question: "Qual é o prazo médio de entrega para serviços de áudio (produção e mixagem)?",
      answer: "Para produções de áudio direto no estúdio, como gravação de voz, beats exclusivos, mixagem ou masterização, o prazo padrão de entrega é de 3 a 7 dias úteis após a captação. Projetos maiores, como EPs ou Álbuns completos, são calendarizados em etapas personalizadas com o artista.",
      category: "timeline",
      icon: <Clock className="w-4 h-4 text-gold" />
    },
    {
      question: "Quais são as condições e formas de pagamento aceites?",
      answer: "Trabalhamos tipicamente com uma entrada de 50% para agendamento e início de produção ou captação, e os restantes 50% após aprovação prévia das masters e antes da entrega oficial dos ficheiros finais. Aceitamos transferências bancárias, pagamentos via multicaixa express e dinheiro físico.",
      category: "pricing",
      icon: <DollarSign className="w-4 h-4 text-gold" />
    },
    {
      question: "Os materiais físicos e produtos digitais da loja têm envio imediato?",
      answer: "Sim! Os nossos recursos digitais cinematográficos (LUTs, presets e beats digitais) são entregues por e-mail e disponibilizados para download imediatamente após a aprovação do pagamento. O envio de materiais de estúdio físicos ou acessórios para artistas é processado em até 48 horas úteis.",
      category: "general",
      icon: <Sparkles className="w-4 h-4 text-gold" />
    }
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-32 px-6 relative z-10 border-t border-white/5 bg-premium-black/25" id="faq-section">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-gold/20">
            <HelpCircle className="w-3.5 h-3.5" /> Perguntas Frequentes
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white uppercase">
            Dúvidas <span className="text-gold-gradient italic">Frequentes</span>
          </h2>
          <p className="text-white/50 text-sm max-w-xl mx-auto font-light leading-relaxed">
            Respostas transparentes sobre os nossos prazos de produção de elite, faturamento ajustável e distribuição de materiais.
          </p>
        </div>

        {/* Accordion Questions */}
        <div className="space-y-4 mb-16">
          {faqData.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className={`glass-card transition-all duration-300 border ${
                  isOpen ? 'border-gold bg-premium-gray/50 shadow-[0_0_20px_rgba(212,175,55,0.05)]' : 'border-white/10 hover:border-white/20'
                }`}
                id={`faq-item-${index}`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-6 text-left outline-none cursor-pointer"
                  id={`faq-button-${index}`}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 pr-4">
                    <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-gold/20 text-gold' : 'bg-white/5 text-white/40'}`}>
                      {faq.icon}
                    </div>
                    <span className="text-sm md:text-base font-bold text-white transition-colors group-hover:text-gold block">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 text-white/35 group-hover:text-white"
                  >
                    <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-gold' : ''}`} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-xs md:text-sm text-white/50 leading-relaxed pl-16 border-t border-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Custom Support Banner */}
        <div className="text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-4">
            Ainda tem alguma dúvida específica?
          </p>
          <a
            href={getWhatsAppUrl(settings.whatsapp, 'Olá! Tenho algumas dúvidas adicionais sobre os prazos de entrega e orçamentos de projetos.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-gold hover:text-black hover:border-gold rounded-full text-xs font-bold uppercase tracking-widest transition-all text-white"
            id="faq-whatsapp-support-btn"
          >
            <MessageSquare className="w-4 h-4" /> Esclarecer por WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
};
