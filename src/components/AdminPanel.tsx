import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Edit2, Save, Settings as SettingsIcon, Globe, Mail, Phone, MapPin as MapPinIcon, Headphones, ExternalLink, Layout, Edit, Music, Video, Image as ImageIcon } from 'lucide-react';
import { collection, addDoc, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { cn, getDirectLink } from '../lib/utils';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Project, Service, Settings } from '../types';
import { useApp } from '../context/AppContext';

const AdminPanel = () => {
  const { projects, services, settings, setIsAdminOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'services' | 'settings'>('portfolio');

  // Form states
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingSettings, setEditingSettings] = useState<Settings>(settings);

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      if (editingProject.id) {
        const { id, ...data } = editingProject;
        await updateDoc(doc(db, 'projects', id), {
          ...data,
          type: data.type || 'video'
        });
        toast.success('Projeto atualizado com sucesso!');
      } else {
        await addDoc(collection(db, 'projects'), {
          ...editingProject,
          type: editingProject.type || 'video'
        });
        toast.success('Novo projeto adicionado!');
      }
      setEditingProject(null);
    } catch (error) {
      toast.error('Erro ao salvar projeto. Verifique as permissões.');
      handleFirestoreError(error, OperationType.WRITE, 'projects');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      toast.success('Projeto excluído com sucesso.');
    } catch (error) {
      toast.error('Erro ao excluir projeto.');
      handleFirestoreError(error, OperationType.DELETE, 'projects');
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      if (editingService.id) {
        const { id, ...data } = editingService;
        await updateDoc(doc(db, 'services', id), {
          ...data,
          type: data.type || 'video'
        });
        toast.success('Serviço atualizado!');
      } else {
        await addDoc(collection(db, 'services'), {
          ...editingService,
          type: editingService.type || 'video'
        });
        toast.success('Novo serviço adicionado!');
      }
      setEditingService(null);
    } catch (error) {
      toast.error('Erro ao salvar serviço.');
      handleFirestoreError(error, OperationType.WRITE, 'services');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
    try {
      await deleteDoc(doc(db, 'services', id));
      toast.success('Serviço excluído.');
    } catch (error) {
      toast.error('Erro ao excluir serviço.');
      handleFirestoreError(error, OperationType.DELETE, 'services');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'main'), editingSettings);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações.');
      handleFirestoreError(error, OperationType.WRITE, 'settings');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info('Link copiado para a área de transferência!');
  };

  const appUrl = window.location.origin;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col"
    >
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between bg-premium-black">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gold rounded-lg flex items-center justify-center text-black font-black text-sm md:text-base">6</div>
          <div>
            <h2 className="text-lg md:text-xl font-bold leading-tight">Painel de Controle</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Gerenciamento</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdminOpen(false)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-premium-black/50 overflow-x-auto no-scrollbar sticky top-0 z-20">
        <button 
          onClick={() => setActiveTab('portfolio')}
          className={cn(
            "px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm font-bold transition-all border-b-2 whitespace-nowrap",
            activeTab === 'portfolio' ? "border-gold text-gold" : "border-transparent text-white/40 hover:text-white"
          )}
        >
          Portfólio
        </button>
        <button 
          onClick={() => setActiveTab('services')}
          className={cn(
            "px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm font-bold transition-all border-b-2 whitespace-nowrap",
            activeTab === 'services' ? "border-gold text-gold" : "border-transparent text-white/40 hover:text-white"
          )}
        >
          Serviços
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={cn(
            "px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm font-bold transition-all border-b-2 whitespace-nowrap",
            activeTab === 'settings' ? "border-gold text-gold" : "border-transparent text-white/40 hover:text-white"
          )}
        >
          Definições
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'portfolio' && (
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xl md:text-2xl font-bold">Gerenciar Projetos</h3>
                <button 
                  onClick={() => setEditingProject({ type: 'video', category: 'Comercial', features: [] } as any)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gold text-black rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Novo Projeto
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                {projects.map(project => (
                  <div key={project.id} className="bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 flex items-center gap-3 md:gap-4 group">
                    <img src={project.thumbnail} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0" alt="" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate text-sm md:text-base">{project.title}</h4>
                      <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest truncate">{project.type} • {project.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingProject(project)}
                        className="p-2 bg-white/5 hover:bg-gold hover:text-black rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 bg-white/5 hover:bg-red-500 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xl md:text-2xl font-bold">Gerenciar Serviços</h3>
                <button 
                  onClick={() => setEditingService({ features: [], category: 'Vídeo' })}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gold text-black rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Novo Serviço
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {services.map(service => (
                  <div key={service.id} className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 group">
                    <div className="flex items-start justify-between mb-4 gap-4">
                      <div className="min-w-0">
                        <h4 className="font-bold text-base md:text-lg truncate">{service.title}</h4>
                        <p className="text-[10px] md:text-xs text-gold font-bold uppercase tracking-widest">{service.category}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingService(service)}
                          className="p-2 bg-white/5 hover:bg-gold hover:text-black rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteService(service.id)}
                          className="p-2 bg-white/5 hover:bg-red-500 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-white/40 mb-4 line-clamp-2">{service.description}</p>
                    <div className="text-xl font-bold">Kz {service.basePrice.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 md:space-y-8">
              <h3 className="text-xl md:text-2xl font-bold">Configurações Gerais</h3>
              
              <form onSubmit={handleSaveSettings} className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <ImageIcon className="w-3 h-3" /> URL do Logotipo
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={editingSettings.logoUrl || ''}
                        onChange={e => setEditingSettings({...editingSettings, logoUrl: e.target.value})}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
                        placeholder="URL da imagem do logotipo"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingSettings({...editingSettings, logoUrl: '/Logo.png'})}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-gold hover:text-black transition-all text-xs font-bold uppercase tracking-widest"
                      >
                        Usar Logo.png
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> WhatsApp (com DDI)
                    </label>
                    <input 
                      type="text" 
                      value={editingSettings.whatsapp}
                      onChange={e => setEditingSettings({...editingSettings, whatsapp: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
                      placeholder="Ex: 244925000000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Email de Contato
                    </label>
                    <input 
                      type="email" 
                      value={editingSettings.email}
                      onChange={e => setEditingSettings({...editingSettings, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <MapPinIcon className="w-3 h-3" /> URL do Mapa (Embed do Google Maps)
                    </label>
                    <input 
                      type="text" 
                      value={editingSettings.mapEmbedUrl || ''}
                      onChange={e => setEditingSettings({...editingSettings, mapEmbedUrl: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
                      placeholder="Cole aqui o src do iframe do Google Maps"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <MapPinIcon className="w-3 h-3" /> Endereço Físico
                    </label>
                    <input 
                      type="text" 
                      value={editingSettings.address}
                      onChange={e => setEditingSettings({...editingSettings, address: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <Globe className="w-3 h-3" /> Instagram URL
                    </label>
                    <input 
                      type="url" 
                      value={editingSettings.instagram}
                      onChange={e => setEditingSettings({...editingSettings, instagram: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <Globe className="w-3 h-3" /> YouTube URL
                    </label>
                    <input 
                      type="url" 
                      value={editingSettings.youtube}
                      onChange={e => setEditingSettings({...editingSettings, youtube: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <Globe className="w-3 h-3" /> Facebook URL
                    </label>
                    <input 
                      type="url" 
                      value={editingSettings.facebook}
                      onChange={e => setEditingSettings({...editingSettings, facebook: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <Globe className="w-3 h-3" /> TikTok URL
                    </label>
                    <input 
                      type="url" 
                      value={editingSettings.tiktok || ''}
                      onChange={e => setEditingSettings({...editingSettings, tiktok: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-gold text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  <Save className="w-5 h-5" /> Salvar Configurações
                </button>
              </form>

              {/* Quick Links for Clients */}
              <div className="bg-gold/5 border border-gold/20 rounded-2xl p-5 md:p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <ExternalLink className="w-5 h-5 text-gold" />
                  <h4 className="text-base md:text-lg font-bold">Links Rápidos para Clientes</h4>
                </div>
                <p className="text-xs md:text-sm text-white/60 mb-6">
                  Use estes links para enviar diretamente aos clientes o que eles procuram.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold">
                      <Music className="w-3 h-3" /> Portfólio de Áudio
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        readOnly 
                        value={`${appUrl}/?portfolio=audio#portfolio`}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/40 outline-none"
                      />
                      <button 
                        onClick={() => copyToClipboard(`${appUrl}/?portfolio=audio#portfolio`)}
                        className="p-2 bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold">
                      <Video className="w-3 h-3" /> Portfólio de Vídeo
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        readOnly 
                        value={`${appUrl}/?portfolio=video#portfolio`}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/40 outline-none"
                      />
                      <button 
                        onClick={() => copyToClipboard(`${appUrl}/?portfolio=video#portfolio`)}
                        className="p-2 bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold">
                      <Layout className="w-3 h-3" /> Preços de Áudio
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        readOnly 
                        value={`${appUrl}/?services=audio#servicos`}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/40 outline-none"
                      />
                      <button 
                        onClick={() => copyToClipboard(`${appUrl}/?services=audio#servicos`)}
                        className="p-2 bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold">
                      <Layout className="w-3 h-3" /> Preços de Vídeo
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        readOnly 
                        value={`${appUrl}/?services=video#servicos`}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/40 outline-none"
                      />
                      <button 
                        onClick={() => copyToClipboard(`${appUrl}/?services=video#servicos`)}
                        className="p-2 bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals for Editing */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="bg-premium-gray border-t md:border border-white/10 rounded-t-2xl md:rounded-2xl w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto p-5 md:p-8"
            >
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold">{editingProject.id ? 'Editar Projeto' : 'Novo Projeto'}</h3>
                <button onClick={() => setEditingProject(null)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-5 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Título</label>
                    <input 
                      required
                      type="text" 
                      value={editingProject.title || ''}
                      onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Tipo</label>
                    <select 
                      value={editingProject.type || 'video'}
                      onChange={e => setEditingProject({...editingProject, type: e.target.value as any})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
                    >
                      <option value="video">Vídeo</option>
                      <option value="audio">Áudio</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Categoria/Estilo</label>
                    <input 
                      required
                      type="text" 
                      value={editingProject.category || ''}
                      onChange={e => setEditingProject({...editingProject, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
                      placeholder="Ex: Comercial, Podcast, Trap..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Thumbnail (Capa)</label>
                    <input 
                      type="text" 
                      value={editingProject.thumbnail || ''}
                      onChange={e => setEditingProject({...editingProject, thumbnail: getDirectLink(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all text-sm"
                      placeholder="URL da imagem (Google Drive, etc)"
                    />
                  </div>

                  {editingProject.type === 'video' ? (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40">URL do Vídeo (YouTube ou Link Direto)</label>
                      <input 
                        required
                        type="text" 
                        value={editingProject.videoUrl || ''}
                        onChange={e => setEditingProject({...editingProject, videoUrl: getDirectLink(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all text-sm"
                        placeholder="https://www.youtube.com/watch?v=... ou Link Direto"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40">Arquivo de Áudio (URL Direta)</label>
                      <input 
                        required
                        type="text" 
                        value={editingProject.audioUrl || ''}
                        onChange={e => setEditingProject({...editingProject, audioUrl: getDirectLink(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all text-sm"
                        placeholder="URL do arquivo .mp3 (Google Drive, etc)"
                      />
                    </div>
                  )}

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Descrição</label>
                    <textarea 
                      required
                      value={editingProject.description || ''}
                      onChange={e => setEditingProject({...editingProject, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all h-32 resize-none"
                    />
                  </div>
                </div>

                {/* Dica de Links Externos */}
                <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-widest">
                    <Globe className="w-3 h-3" /> Dica: Usar links externos (Google Drive / YouTube)
                  </div>
                  <p className="text-[10px] md:text-xs text-white/60 leading-relaxed">
                    Se o Storage do Firebase pedir upgrade, você pode usar links do <strong>Google Drive</strong> ou <strong>YouTube</strong>. 
                    Basta colar o link de compartilhamento ("Qualquer pessoa com o link") e o sistema converterá automaticamente para o formato correto.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="flex-1 py-4 bg-white/5 rounded-xl font-bold hover:bg-white/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-gold text-black rounded-xl font-bold hover:scale-105 transition-transform"
                  >
                    Salvar Projeto
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {editingService && (
          <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="bg-premium-gray border-t md:border border-white/10 rounded-t-2xl md:rounded-2xl w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto p-5 md:p-8"
            >
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold">{editingService.id ? 'Editar Serviço' : 'Novo Serviço'}</h3>
                <button onClick={() => setEditingService(null)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
              </div>

              <form onSubmit={handleSaveService} className="space-y-5 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Título do Plano</label>
                    <input 
                      required
                      type="text" 
                      value={editingService.title || ''}
                      onChange={e => setEditingService({...editingService, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Tipo de Projeto</label>
                    <select 
                      required
                      value={editingService.type || 'video'}
                      onChange={e => setEditingService({...editingService, type: e.target.value as any})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
                    >
                      <option value="video">Vídeo</option>
                      <option value="audio">Áudio</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Categoria / Estilo</label>
                    <input 
                      required
                      type="text" 
                      value={editingService.category || ''}
                      onChange={e => setEditingService({...editingService, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
                      placeholder="Ex: Rap, Kuduro, Kizomba, Comercial..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Preço Base (Kz)</label>
                    <input 
                      required
                      type="number" 
                      value={editingService.basePrice || ''}
                      onChange={e => setEditingService({...editingService, basePrice: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Descrição Curta</label>
                    <input 
                      required
                      type="text" 
                      value={editingService.description || ''}
                      onChange={e => setEditingService({...editingService, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Recursos (um por linha)</label>
                    <textarea 
                      required
                      value={editingService.features?.join('\n') || ''}
                      onChange={e => setEditingService({...editingService, features: e.target.value.split('\n').filter(f => f.trim())})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-all h-32 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="flex-1 py-4 bg-white/5 rounded-xl font-bold hover:bg-white/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-gold text-black rounded-xl font-bold hover:scale-105 transition-transform"
                  >
                    Salvar Serviço
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminPanel;
