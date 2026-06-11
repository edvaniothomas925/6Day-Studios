import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, query, where, getDocs, Timestamp, setDoc, doc } from 'firebase/firestore';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, Check, Sparkles, Loader2, Video, Music, Sliders, ArrowRight, LogIn } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType, signInWithGoogle } from '../firebase';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

interface TimeSlot {
  time: string;
  label: string;
}

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { time: "09:00", label: "09:00h - Manhã" },
  { time: "10:30", label: "10:30h - Manhã" },
  { time: "14:00", label: "14:00h - Tarde" },
  { time: "15:30", label: "15:30h - Tarde" },
  { time: "17:00", label: "17:00h - Fim de Tarde" }
];

const CONSULTING_TOPICS = [
  { id: '1', title: 'Consultoria Geral de Produção', type: 'general', description: 'Sobre prazos, metodologias de faturamento ou análise geral de viabilidade.' },
  { id: '2', title: 'Pré-Produção e Cinema (Vídeo)', type: 'video', description: 'Roteirização, direção cinematográfica, cenografia e locações.' },
  { id: '3', title: 'Estúdio, Gravação e Mix (Áudio)', type: 'audio', description: 'Beats exclusivos, estrutura de mixagem, captação de voz ou master.' },
  { id: '4', title: 'Marketing, Distribuição e Lançamento', type: 'general', description: 'Estratégia digital de divulgação, gestão de lançamentos ou identidade visual.' }
];

export const MeetingScheduler: React.FC = () => {
  const { user, settings } = useApp();
  
  // Date states
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedTopic, setSelectedTopic] = useState<string>('Consultoria Geral de Produção');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  
  // Client details
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // App status states
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [createdBookingId, setCreatedBookingId] = useState<string>('');

  // Auto-prefill name when user is logged in
  useEffect(() => {
    if (user) {
      setClientName(user.displayName || '');
    }
  }, [user]);

  // Fetch booked slots for the selected date to prevent duplicates
  useEffect(() => {
    if (!selectedDate) return;

    const fetchBookedSlots = async () => {
      setIsCheckingSlots(true);
      try {
        const bookingsRef = collection(db, 'bookings_public');
        const q = query(
          bookingsRef, 
          where('date', '==', selectedDate)
        );
        const snapshot = await getDocs(q);
        const slots = snapshot.docs
          .map(doc => doc.data())
          .filter(data => ['pendente', 'confirmado'].includes(data.status))
          .map(data => data.timeSlot);
        
        setBookedSlots(slots);
        
        // Reset slot selection if it was already booked
        if (slots.includes(selectedTimeSlot)) {
          setSelectedTimeSlot('');
        }
      } catch (error) {
        console.error("Erro ao verificar horários disponíveis:", error);
      } finally {
        setIsCheckingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [selectedDate]);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Você precisa estar autenticado para realizar um agendamento.");
      return;
    }

    const clientEmail = user.email;
    if (!selectedDate || !selectedTimeSlot || !clientName || !clientEmail || !clientPhone) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        clientName,
        clientEmail,
        clientPhone,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        serviceType: selectedTopic,
        notes: notes.trim(),
        status: 'pendente' as const,
        userId: user.uid,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'bookings'), payload);

      // Save public version for calendar slots verification (preserves privacy, no PII)
      await setDoc(doc(db, 'bookings_public', docRef.id), {
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        status: 'pendente'
      });

      setCreatedBookingId(docRef.id);
      setBookingSuccess(true);
      toast.success("Consultoria reservada com sucesso!");
    } catch (error) {
      toast.error("Erro ao agendar reunião. Tente novamente.");
      handleFirestoreError(error, OperationType.WRITE, 'bookings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSelectedTimeSlot('');
    setNotes('');
    setBookingSuccess(false);
    setCreatedBookingId('');
  };

  const getDayFormatted = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Pre-fill WhatsApp URL for redirect fallback on success
  const getWhatsAppBookingUrl = () => {
    const message = `Olá 6Day Studios! Agendei uma reunião de consultoria diretamente pelo site.
📅 Data: ${getDayFormatted(selectedDate)}
⏰ Horário: ${selectedTimeSlot}h
📁 Assunto: ${selectedTopic}
🧑 Nome: ${clientName}
📧 Email: ${user?.email || ''}
📱 Telefone: ${clientPhone}
ID do Agendamento: ${createdBookingId}

Como posso proceder para a confirmação inicial?`;
    
    const cleanNumber = settings.whatsapp || '+244 945 986 037';
    return `https://wa.me/${cleanNumber.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(message)}`;
  };

  // Safe login action
  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithGoogle();
      if (res) {
        toast.success("Autenticado com sucesso!");
      }
    } catch (err) {
      toast.error("Erro ao conectar conta Google.");
    }
  };

  // Check authentication gate first
  if (!user) {
    return (
      <section className="py-16 md:py-24 px-6 border-t border-white/5 bg-premium-black relative z-10" id="scheduler-section">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-gold/20 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> AGENDAMENTO EXCLUSIVO 6DAY
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 text-white uppercase leading-none">
              Reserve Sua <span className="text-gold-gradient italic">Consultoria</span>
            </h2>
            <p className="text-white/50 text-sm max-w-xl mx-auto font-light leading-relaxed">
              Deseja agendar uma reunião de viabilidade ou direção com o nosso time? Por favor, faça login com sua conta Google para prosseguir.
            </p>
          </div>

          <div className="glass-card max-w-lg mx-auto p-8 md:p-12 text-center rounded-2xl md:rounded-3xl border border-white/10 space-y-6 md:space-y-8 shadow-2xl relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
            <div className="w-16 h-16 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center text-gold animate-pulse">
              <User className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-bold text-white">Autenticação Obrigatória</h3>
              <p className="text-white/40 text-xs md:text-sm leading-relaxed">
                Para evitar spam e manter nossa agenda organizada, solicitamos que se identifique usando sua conta Google.
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full py-4.5 bg-gold hover:bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-gold/20 flex items-center justify-center gap-2 cursor-pointer max-w-xs"
            >
              <LogIn className="w-4 h-4" /> Entrar com Google
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-6 border-t border-white/5 bg-premium-black relative z-10" id="scheduler-section">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-gold/20 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> AGENDAMENTO DE ELITE
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white uppercase leading-none">
            Reserve Sua <span className="text-gold-gradient italic">Consultoria</span>
          </h2>
          <p className="text-white/50 text-sm max-w-xl mx-auto font-light leading-relaxed">
            Selecione um horário, preencha os seus detalhes e obtenha uma reunião de viabilidade/direção oficial com a nossa equipe de produção em Angola.
          </p>
        </div>

        <div className="glass-card overflow-hidden border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl relative">
          
          <AnimatePresence mode="wait">
            {!bookingSuccess ? (
              <motion.form
                key="booking-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                onSubmit={handleSubmitBooking}
                className="grid grid-cols-1 lg:grid-cols-12"
              >
                
                {/* Left Panel: Inputs and Topics Selection */}
                <div className="p-6 md:p-10 lg:col-span-7 space-y-6 md:space-y-8 border-b lg:border-b-0 lg:border-r border-white/10">
                  
                  {/* Step 1: Topic Selection */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gold flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5" /> 1. Escolha o Assunto da Reunião
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {CONS_TOPICS_MAPPED.map((topic) => {
                        const isSelected = selectedTopic === topic.title;
                        return (
                          <button
                            key={topic.id}
                            type="button"
                            onClick={() => setSelectedTopic(topic.title)}
                            className={cn(
                              "text-left p-4 rounded-xl border text-xs transition-all flex flex-col justify-between h-28 cursor-pointer relative overflow-hidden group/item",
                              isSelected 
                                ? "bg-gold/10 border-gold/40 text-white" 
                                : "bg-white/5 border-white/5 hover:border-white/10 text-white/60"
                            )}
                          >
                            <div className="flex justify-between items-start w-full">
                              <span className={cn("p-1.5 rounded-md", isSelected ? "bg-gold text-black" : "bg-white/5 text-white/40")}>
                                {topic.id === '2' ? <Video className="w-3.5 h-3.5" /> : topic.id === '3' ? <Music className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                              </span>
                              {isSelected && (
                                <span className="w-2.5 h-2.5 bg-gold rounded-full shadow-[0_0_10px_rgb(212,175,55)] border border-black animate-pulse" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-white mb-0.5 truncate">{topic.title}</p>
                              <p className="text-[9px] text-white/40 line-clamp-1 group-hover/item:text-white/60 transition-colors">{topic.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Date & Slot Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gold flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" /> 2. data Pretendida
                      </label>
                      <input
                        required
                        type="date"
                        min={getTodayString()}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none transition-all text-white placeholder-white/20 select-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gold flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" /> 3. Horários Disponíveis
                      </label>
                      <div className="relative">
                        {isCheckingSlots ? (
                          <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white/40 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-gold" /> Carregando vagas...
                          </div>
                        ) : (
                           <select
                            required
                            value={selectedTimeSlot}
                            onChange={(e) => setSelectedTimeSlot(e.target.value)}
                            className="w-full bg-[#121214] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none transition-all text-white cursor-pointer [&_option]:bg-[#121214] [&_option]:text-white"
                          >
                            <option value="" className="text-white/40 bg-[#121214]">Selecione um horário</option>
                            {DEFAULT_TIME_SLOTS.map((slot) => {
                              const isBooked = bookedSlots.includes(slot.time);
                              return (
                                <option 
                                  key={slot.time} 
                                  value={slot.time} 
                                  disabled={isBooked}
                                  className={cn(isBooked ? "text-white/25 bg-[#121214]" : "text-white bg-[#121214]")}
                                >
                                  {slot.label} {isBooked ? ' (Indisponível)' : ''}
                                </option>
                              );
                            })}
                          </select>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Optional Notes */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gold flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5" /> Observações do Projeto (Opcional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Indique brevemente do que se trata o seu projeto..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none transition-all h-24 resize-none placeholder-white/20 text-white"
                    />
                  </div>

                </div>

                {/* Right Panel: Client Details & Submission */}
                <div className="p-6 md:p-10 lg:col-span-5 bg-premium-gray/30 flex flex-col justify-between gap-8">
                  
                  <div className="space-y-6">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="text-lg font-bold text-white mb-1">Seus Detalhes</h3>
                      <p className="text-[10px] text-white/40">
                        Agendando com o email <strong className="text-gold font-bold">{user.email}</strong>
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                          <User className="w-3 h-3 text-gold" /> Nome Completo
                        </label>
                        <input
                          required
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Como gostaria de ser chamado(a)"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none transition-all text-white placeholder-white/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                          <Phone className="w-3 h-3 text-gold" /> WhatsApp / Telemóvel
                        </label>
                        <input
                          required
                          type="text"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="Ex: +244 945 986 037"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none transition-all text-white placeholder-white/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6">
                    <div className="p-4 rounded-xl bg-gold/5 border border-gold/10 text-[10px] md:text-xs text-white/40 leading-relaxed font-light">
                      * Ao clicar em reservar, o seu agendamento será registado internamente de forma segura no nosso sistema e um representante entrará em contacto para conformidade em até 24h.
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting || !selectedTimeSlot || isCheckingSlots}
                      className={cn(
                        "w-full py-4.5 bg-gold hover:bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg hover:scale-[1.01] hover:shadow-gold/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed",
                        isSubmitting ? "bg-white" : ""
                      )}
                      id="booking-submit-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Processando...
                        </>
                      ) : (
                        <>
                          Reservar Horário <Check className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </motion.form>
            ) : (
              <motion.div
                key="booking-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8 md:p-16 text-center max-w-3xl mx-auto space-y-8"
              >
                
                {/* Success Indicator */}
                <div className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto text-gold animate-bounce shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                  <Check className="w-10 h-10 stroke-[3]" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white">Consultoria Agendada!</h3>
                  <p className="text-white/50 text-xs tracking-widest uppercase font-bold">
                    Código de Confirmação: <span className="font-mono text-gold font-black">{createdBookingId}</span>
                  </p>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl max-w-lg mx-auto text-left space-y-4">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                    <Calendar className="w-4 h-4 text-gold" />
                    <div>
                      <span className="text-[10px] text-white/30 uppercase tracking-widest block font-bold">Dia & hora</span>
                      <span className="text-xs md:text-sm text-white font-bold">{getDayFormatted(selectedDate)} às {selectedTimeSlot}h</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <div>
                      <span className="text-[10px] text-white/30 uppercase tracking-widest block font-bold">Assunto do Encontro</span>
                      <span className="text-xs md:text-sm text-white font-bold">{selectedTopic}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
                  Para agilizar a triagem e confirmar o seu horário instantaneamente com a produção, envie os dados do agendamento diretamente no nosso canal de WhatsApp.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <button
                    onClick={handleResetForm}
                    className="flex-1 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors"
                  >
                    Agendar Outro
                  </button>
                  <a
                    href={getWhatsAppBookingUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-4 bg-gold hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-gold/20 flex items-center justify-center gap-2"
                  >
                    Confirmar no WhatsApp <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
          
        </div>

      </div>
    </section>
  );
};

const CONS_TOPICS_MAPPED = CONSULTING_TOPICS;
