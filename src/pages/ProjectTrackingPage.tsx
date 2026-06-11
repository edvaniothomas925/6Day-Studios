import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Loader2, Play, Download, ExternalLink, Calendar, 
  Clock, CheckCircle2, ChevronRight, Activity, AlertCircle,
  FolderDot, ArrowRight, User, HelpCircle, FileText, Plus
} from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, addDoc } from 'firebase/firestore';
import { useApp } from '../context/AppContext';
import { db, handleFirestoreError, OperationType, signInWithGoogle } from '../firebase';
import { ClientProject } from '../types';
import { toast } from 'sonner';
import { cn, getWhatsAppUrl } from '../lib/utils';

const STATUS_STEPS: ClientProject['status'][] = [
  'planeamento',
  'producao',
  'gravacao',
  'edicao',
  'revisao',
  'concluido'
];

const STATUS_LABELS: Record<ClientProject['status'], string> = {
  planeamento: 'Planeamento & Guião',
  producao: 'Pré-Produção & Recursos',
  gravacao: 'Captação & Gravação',
  edicao: 'Edição & Mistura',
  revisao: 'Fase de Revisão',
  concluido: 'Concluido'
};

const STATUS_COLORS: Record<ClientProject['status'], string> = {
  planeamento: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  producao: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  gravacao: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  edicao: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
  revisao: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  concluido: 'text-green-400 bg-green-400/10 border-green-400/20'
};

const STATUS_DESCRIPTIONS: Record<ClientProject['status'], string> = {
  planeamento: 'Roteirização, planeamento de planos e estrutura criativa do seu projeto.',
  producao: 'Organização de equipamentos, roteiros de locução, escolha de trilhas e cenários.',
  gravacao: 'Captação presencial de vídeo de alta fidelidade e/ou gravação em estúdio do áudio profissional.',
  edicao: 'Sincronização de áudio/vídeo, edição criativa, transições, gradação de cor e polimento sonoro.',
  revisao: 'Primeiro rascunho disponível para a sua apreciação. Faça o download ou visualize e envie o seu feedback.',
  concluido: 'Vídeo/áudio finalizado e masterizado! Todo o material final encontra-se disponível para download definitivo.'
};

const ProjectTrackingPage = () => {
  const { user, settings } = useApp();
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Briefing submission state
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState<boolean>(false);
  const [briefingTitle, setBriefingTitle] = useState<string>('');
  const [briefingDescription, setBriefingDescription] = useState<string>('');
  const [submittingBriefing, setSubmittingBriefing] = useState<boolean>(false);

  const handleSubmitBriefing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || !briefingTitle.trim() || !briefingDescription.trim()) return;

    setSubmittingBriefing(true);
    try {
      const newBriefing = {
        title: briefingTitle.trim(),
        description: briefingDescription.trim(),
        clientEmail: user.email,
        clientName: user.displayName || 'Cliente Anonimizado',
        status: 'planeamento',
        progress: 0,
        notes: 'Briefing inicial submetido pelo cliente. Pronto para triagem e planeamento técnica.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'client_projects'), newBriefing);
      toast.success('Dados submetidos com sucesso! Receberá novidades do andamento brevemente.');
      
      // Reset form variables
      setBriefingTitle('');
      setBriefingDescription('');
      setIsBriefingModalOpen(false);
    } catch (error) {
      toast.error('Sem permissão ou erro ao salvar o projeto.');
      handleFirestoreError(error, OperationType.WRITE, 'client_projects');
    } finally {
      setSubmittingBriefing(false);
    }
  };

  useEffect(() => {
    if (!user?.email) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'client_projects'),
      where('clientEmail', '==', user.email),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsList: ClientProject[] = [];
      snapshot.forEach((doc) => {
        projectsList.push({ id: doc.id, ...doc.data() } as ClientProject);
      });
      setProjects(projectsList);
      if (projectsList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projectsList[0].id);
      }
      setLoading(false);
    }, (error) => {
      toast.error('Erro ao sintonizar atualizações do projeto.');
      handleFirestoreError(error, OperationType.GET, 'client_projects');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, selectedProjectId]);

  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (result) {
        toast.success('Entrou com sucesso para acompanhar os seus projetos!');
      }
    } catch {
      toast.error('Erro ao realizar autenticação de utilizador.');
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Formatting utility
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('pt-PT', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  if (!user) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-premium-black flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)] pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center bg-white/[0.02] border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
          
          <div className="w-16 h-16 bg-gold/15 border border-gold/30 text-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderDot className="w-8 h-8 animate-pulse" />
          </div>

          <span className="text-gold text-[10px] uppercase font-black tracking-[0.3em] mb-3 block">Estação do Cliente</span>
          <h1 className="text-3xl font-bold tracking-tighter text-white mb-4">Acompanhar Projeto</h1>
          
          <p className="text-white/60 text-sm mb-8 leading-relaxed">
            Faça login com a mesma conta de e-mail cedida à nossa equipa técnica para monitorizar o progresso da sua produção e aceder a downloads exclusivos e revisões em tempo real.
          </p>

          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-gold hover:bg-white text-black font-black uppercase tracking-widest text-xs rounded-full transition-all shadow-[0_15px_30px_rgba(212,175,55,0.2)] flex items-center justify-center gap-3 cursor-pointer select-none"
          >
            <User className="w-4 h-4 text-black bg-black/10 rounded-full p-0.5" /> Entrar com o Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen bg-premium-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.04)_0%,transparent_60%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-gold text-xs font-black uppercase tracking-[0.3em] mb-2 block">Área de Produção</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Monitor de Projetos</h1>
            <p className="text-white/40 text-sm mt-1">Status e downloads das suas produções cinematográficas e áudio</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl shrink-0 self-start md:self-auto">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'Cliente'} className="w-9 h-9 rounded-full border border-gold/20" />
            ) : (
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-gold font-bold">
                {user.displayName?.[0] || 'C'}
              </div>
            )}
            <div className="text-left">
              <div className="text-xs font-bold text-white leading-none mb-0.5">{user.displayName}</div>
              <div className="text-[10px] text-white/40 truncate max-w-[180px]">{user.email}</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-gold" />
            <p className="text-white/40 text-sm font-bold tracking-widest uppercase">Sintonizando com o estúdio...</p>
          </div>
        ) : projects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-16 text-center max-w-2xl mx-auto relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-radial-gradient from-white/[0.01] to-transparent pointer-events-none" />
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <Activity className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhum projeto registado</h3>
            <p className="text-white/50 text-sm mb-8 leading-relaxed">
              De momento, não identificamos nenhum projeto de estúdio associado ao e-mail <strong className="text-gold">{user.email}</strong>. 
              <br />
              Se efetuou um agendamento e acertou os detalhes de produção, a nossa equipa criará o seu painel de acompanhamento nas próximas horas.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setIsBriefingModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 bg-gold hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-full transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Cadastrar Meu Projecto
              </button>
              <a 
                href={getWhatsAppUrl(settings.whatsapp)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-full transition-all text-center cursor-pointer"
              >
                Falar com Produtor
              </a>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar List - Projects */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Meus Projetos ({projects.length})</h3>
                <button
                  onClick={() => setIsBriefingModalOpen(true)}
                  className="inline-flex items-center gap-1 text-[10px] text-gold hover:text-white uppercase font-black tracking-wider transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Enviar Briefing
                </button>
              </div>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {projects.map((proj) => {
                  const isActive = proj.id === selectedProjectId;
                  return (
                    <button
                      key={proj.id}
                      onClick={() => setSelectedProjectId(proj.id)}
                      className={cn(
                        "w-full text-left p-5 rounded-2xl transition-all border outline-none group flex flex-col relative overflow-hidden",
                        isActive 
                          ? "bg-white/[0.04] border-gold text-white shadow-xl shadow-gold/5" 
                          : "bg-white/[0.01] border-white/5 text-white/60 hover:text-white hover:bg-white/[0.02] hover:border-white/10"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gold" />
                      )}
                      
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border",
                          STATUS_COLORS[proj.status]
                        )}>
                          {STATUS_LABELS[proj.status]}
                        </span>
                        
                        <span className="text-[10px] font-mono font-bold text-white/30">
                          {proj.progress}%
                        </span>
                      </div>

                      <h4 className={cn(
                        "text-base font-bold tracking-tight line-clamp-1 transition-all",
                        isActive ? "text-white" : "text-white/80 group-hover:text-white"
                      )}>
                        {proj.title}
                      </h4>

                      <p className="text-xs text-white/40 line-clamp-1 mt-1.5 font-medium">
                        {proj.description}
                      </p>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.03] text-[10px] text-white/30 font-semibold uppercase tracking-widest">
                        <span>Atualizado</span>
                        <span>{new Date(proj.updatedAt).toLocaleDateString('pt-PT')}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Project Details Panel */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {selectedProject ? (
                  <motion.div
                    key={selectedProject.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden"
                  >
                    
                    {/* Top Status Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5 mb-2">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            STATUS_COLORS[selectedProject.status]
                          )}>
                            {STATUS_LABELS[selectedProject.status]}
                          </span>
                          
                          <div className="flex items-center gap-1.5 text-xs text-white/40 font-medium font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{new Date(selectedProject.updatedAt).toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        </div>
                        
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">{selectedProject.title}</h2>
                        <p className="text-white/60 text-sm mt-1 mb-2 leading-relaxed">{selectedProject.description}</p>
                      </div>

                      {/* Giant Circular Progress */}
                      <div className="flex sm:flex-col items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-4 self-start sm:self-auto shrink-0">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <svg className="absolute transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
                            <path
                              className="text-white/5"
                              strokeWidth="3.5"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="text-gold"
                              strokeDasharray={`${selectedProject.progress}, 100`}
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <span className="text-sm font-mono font-black text-white">{selectedProject.progress}%</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Produção</span>
                      </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="mb-10">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-6 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gold/60" /> Cronograma de Desenvolvimento
                      </h4>
                      
                      <div className="relative pt-2">
                        {/* Connecting Line (Horizontal on Desktop, Vertical on Mobile) */}
                        <div className="hidden md:block absolute top-[18px] left-[5%] right-[5%] h-0.5 bg-white/5" />
                        <div className="hidden md:block absolute top-[18px] left-[5%] h-0.5 bg-gold transition-all duration-500" 
                          style={{ 
                            width: `${Math.max(0, (STATUS_STEPS.indexOf(selectedProject.status) / (STATUS_STEPS.length - 1)) * 90)}%` 
                          }} 
                        />

                        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-2 relative">
                          {STATUS_STEPS.map((step, index) => {
                            const stepIndex = STATUS_STEPS.indexOf(step);
                            const activeIndex = STATUS_STEPS.indexOf(selectedProject.status);
                            const isCompleted = stepIndex < activeIndex;
                            const isCurrent = stepIndex === activeIndex;
                            const isFuture = stepIndex > activeIndex;

                            return (
                              <div key={step} className="flex md:flex-col items-center md:text-center group gap-4 md:gap-2">
                                {/* Visual Circle indicator */}
                                <div className={cn(
                                  "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 z-10 border",
                                  isCompleted ? "bg-gold border-gold text-black shadow-lg shadow-gold/10" :
                                  isCurrent ? "bg-[#121214] border-gold text-gold ring-4 ring-gold/10 animate-pulse" :
                                  "bg-[#0A0A0A] border-white/10 text-white/30"
                                )}>
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-black" strokeWidth={2.5} />
                                  ) : (
                                    <span>{index + 1}</span>
                                  )}
                                </div>

                                {/* Label and Status details */}
                                <div className="text-left md:text-center">
                                  <div className={cn(
                                    "text-xs font-black uppercase tracking-wider",
                                    isCurrent ? "text-gold" : isCompleted ? "text-white" : "text-white/30"
                                  )}>
                                    {STATUS_LABELS[step]}
                                  </div>
                                  <span className="md:hidden text-[10px] text-white/40 block mt-0.5">
                                    {isCompleted ? 'Etapa Concluída' : isCurrent ? 'Fase Ativa' : 'Próxima Etapa'}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Active State Details Card */}
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 mb-8 relative">
                      <div className="absolute top-4 right-4 text-white/5 pointer-events-none">
                        <HelpCircle className="w-12 h-12" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-1">Status Atual</span>
                      <h4 className="text-base font-bold text-white mb-2">{STATUS_LABELS[selectedProject.status]}</h4>
                      <p className="text-sm text-white/60 leading-relaxed mb-4">
                        {STATUS_DESCRIPTIONS[selectedProject.status]}
                      </p>

                      {selectedProject.notes && (
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gold block mb-1.5">Nota do Diretor de Produção</span>
                          <div className="text-xs text-white/70 bg-white/[0.02] border border-white/5 p-4 rounded-xl leading-relaxed italic">
                            "{selectedProject.notes}"
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Resources & Deliverables Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                      
                      {/* Revision Draft Box */}
                      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-1">Versão de Revisão</span>
                          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-teal-400" /> Rascunho / Demo Ativa
                          </h4>
                          <p className="text-xs text-white/50 leading-relaxed mb-4">
                            Disponibilizado durante as fases de edição e revisão para validação de roteiro, ritmo, sonorização ou cor.
                          </p>
                        </div>
                        {selectedProject.previewUrl ? (
                          <a
                            href={selectedProject.previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                          >
                            <Play className="w-3.5 h-3.5" /> Visualizar Demo <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <button
                            disabled
                            className="bg-white/[0.02] text-white/20 border border-white/5 font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                          >
                            Demo indisponível nesta etapa
                          </button>
                        )}
                      </div>

                      {/* Final Delivery Box */}
                      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-1">Entrega Final</span>
                          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400" /> Master Finalizado (HQ)
                          </h4>
                          <p className="text-xs text-white/50 leading-relaxed mb-4">
                            Subido exclusivamente em alta definição (HQ) ou áudio WAV sem compressão assim que o projeto entra em fase concluída.
                          </p>
                        </div>
                        {selectedProject.status === 'concluido' && selectedProject.deliveryUrl ? (
                          <a
                            href={selectedProject.deliveryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gold hover:bg-white text-black font-black text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-gold/10"
                          >
                            <Download className="w-3.5 h-3.5" /> Descarregar Master <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <button
                            disabled
                            className="bg-white/[0.02] text-white/20 border border-white/5 font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                          >
                            Disponível na conclusão
                          </button>
                        )}
                      </div>

                    </div>

                    {/* Bottom Metadata */}
                    <div className="mt-8 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-[10px] text-white/30 font-semibold uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Início da Produção: {formatDate(selectedProject.createdAt)}</span>
                      </div>
                      <div>
                        <span>ID do Projeto: #{selectedProject.id.slice(0, 8)}</span>
                      </div>
                    </div>

                  </motion.div>
                ) : (
                  <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
                    <p className="text-white/40 text-sm font-bold uppercase tracking-widest">A carregar detalhes do projeto...</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>
        )}

      </div>

      {/* Briefing Request Modal */}
      <AnimatePresence>
        {isBriefingModalOpen && (
          <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="bg-[#121214] border-t md:border border-white/10 rounded-t-3xl md:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 text-left"
            >
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div>
                  <span className="text-gold text-[10px] uppercase font-black tracking-widest">Estação Cliente</span>
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-1">Briefing de Novo Projeto</h3>
                </div>
                <button 
                  onClick={() => setIsBriefingModalOpen(false)} 
                  className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleSubmitBriefing} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40">Seu Nome / Empresa</label>
                      <input 
                        type="text" 
                        disabled
                        value={user?.displayName || ''}
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white/40 outline-none text-sm cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40">Seu E-mail (Acompanhamento)</label>
                      <input 
                        type="email" 
                        disabled
                        value={user?.email || ''}
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white/40 outline-none text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Título do Projeto</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ex: Videoclipe Oficial - Música Novo Amanhã"
                      value={briefingTitle}
                      onChange={e => setBriefingTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">O que vamos produzir? (Descrição Básica e Objetivos)</label>
                    <textarea 
                      required
                      placeholder="Descreva a sua ideia, estilo musical ou vídeo pretendido, referências visuais ou sonoras e o que espera da nossa produção..."
                      value={briefingDescription}
                      onChange={e => setBriefingDescription(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none transition-all h-36 resize-none text-sm leading-relaxed"
                    />
                  </div>

                  <div className="p-4 bg-gold/5 border border-gold/15 rounded-xl text-xs text-white/60 leading-relaxed">
                    💡 <strong>O que acontece a seguir?</strong> O seu projeto será gravado no nosso estúdio com o status inicial de <strong>Planeamento</strong>. O nosso produtor principal receberá os detalhes recebidos para o planeamento criativo.
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button 
                    type="button"
                    disabled={submittingBriefing}
                    onClick={() => setIsBriefingModalOpen(false)}
                    className="flex-1 py-4 bg-white/5 text-white/70 hover:text-white rounded-xl font-bold hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={submittingBriefing}
                    className="flex-1 py-4 bg-gold text-black rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submittingBriefing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> A Enviar...
                      </>
                    ) : (
                      'Enviar Briefing'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectTrackingPage;
