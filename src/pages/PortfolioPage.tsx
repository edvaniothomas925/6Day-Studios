import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Music, Play, Headphones, X, ArrowRight, Plus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { Project } from '../types';
import { OptimizedImage } from '../components/OptimizedImage';
import { Skeleton } from '../components/Skeleton';

const PortfolioPage = () => {
  const { projects, settings } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [subFilter, setSubFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const mainCategories = useMemo(() => ['all', 'video', 'audio'], []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const portfolioParam = params.get('portfolio');
    if (portfolioParam && mainCategories.includes(portfolioParam)) {
      setFilter(portfolioParam);
    }
  }, []);

  const subCategories = useMemo(() => {
    if (filter === 'all') return [];
    const relevantProjects = projects.filter(p => p.type === filter);
    const cats = Array.from(new Set(relevantProjects.map(p => p.category)));
    return ['all', ...cats];
  }, [filter, projects]);

  useEffect(() => {
    setSubFilter('all');
    setVisibleCount(6);
  }, [filter]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesMain = filter === 'all' || p.type === filter;
      const matchesSub = subFilter === 'all' || p.category === subFilter;
      return matchesMain && matchesSub;
    });
  }, [projects, filter, subFilter]);

  const paginatedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const navigateProject = (direction: 'next' | 'prev') => {
    if (!selectedProject) return;
    const currentIndex = filteredProjects.findIndex(p => p.id === selectedProject.id);
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % filteredProjects.length;
    } else {
      nextIndex = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
    }
    setSelectedProject(filteredProjects[nextIndex]);
    setIsVideoLoading(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === 'ArrowRight') navigateProject('next');
      if (e.key === 'ArrowLeft') navigateProject('prev');
      if (e.key === 'Escape') setSelectedProject(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, filteredProjects]);

  return (
    <div className="pt-32 pb-24 px-6 bg-premium-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-16 gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Portfólio</h1>
              <p className="text-white/50 max-w-md">Uma seleção dos nossos trabalhos mais impactantes e criativos.</p>
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
                  {cat === 'all' ? 'Todos' : cat === 'video' ? 'Vídeos' : 'Áudio'}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {paginatedProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-video overflow-hidden rounded-2xl cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <OptimizedImage 
                  src={project.thumbnail} 
                  alt={project.title}
                  loading="lazy"
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <div className="flex items-center gap-2 mb-2">
                    {project.type === 'video' ? <Video className="w-4 h-4 text-gold" /> : <Music className="w-4 h-4 text-gold" />}
                    <span className="text-gold text-xs font-bold uppercase tracking-widest">{project.category}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    {project.type === 'video' ? (
                      <>Assistir Vídeo <Play className="w-4 h-4 fill-white" /></>
                    ) : (
                      <>Ouvir Música <Headphones className="w-4 h-4" /></>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {hasMore && (
          <div className="mt-16 text-center">
            <button 
              onClick={() => setVisibleCount(prev => prev + 4)}
              className="px-10 py-4 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all flex items-center gap-2 mx-auto"
            >
              Carregar Mais Projetos <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl"
            onClick={() => {
              setSelectedProject(null);
              setIsVideoLoading(true);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-5xl w-full glass-card overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="aspect-video bg-black relative flex items-center justify-center">
                {selectedProject.type === 'video' ? (
                  <>
                    {isVideoLoading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-premium-gray">
                        <Skeleton className="absolute inset-0" />
                        <Loader2 className="w-10 h-10 text-gold animate-spin relative z-20" />
                      </div>
                    )}
                    <iframe
                      className={cn(
                        "w-full h-full transition-opacity duration-500",
                        isVideoLoading ? "opacity-0" : "opacity-100"
                      )}
                      src={selectedProject.videoUrl}
                      title={selectedProject.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      onLoad={() => setIsVideoLoading(false)}
                    ></iframe>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-gradient-to-br from-premium-gray to-black">
                    <div className="w-32 h-32 bg-gold/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
                      <Music className="w-16 h-16 text-gold" />
                    </div>
                    <audio 
                      controls 
                      autoPlay
                      preload="metadata"
                      className="w-full max-w-md custom-audio-player"
                      src={selectedProject.audioUrl}
                    >
                      Seu navegador não suporta o elemento de áudio.
                    </audio>
                  </div>
                )}
                <button 
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-gold transition-colors z-20"
                  onClick={() => {
                    setSelectedProject(null);
                    setIsVideoLoading(true);
                  }}
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Navigation Arrows */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigateProject('prev'); }}
                    className="p-3 bg-black/50 rounded-full hover:bg-gold transition-all pointer-events-auto transform hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigateProject('next'); }}
                    className="p-3 bg-black/50 rounded-full hover:bg-gold transition-all pointer-events-auto transform hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gold text-xs font-bold uppercase tracking-widest">{selectedProject.category}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{selectedProject.title}</h3>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl">
                    {selectedProject.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <a 
                    href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Olá! Vi o projeto "${selectedProject.title}" no seu portfólio e gostaria de saber mais.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto px-8 py-4 bg-gold text-black font-bold rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                    onClick={() => {
                      setSelectedProject(null);
                      setIsVideoLoading(true);
                    }}
                  >
                    Quero algo assim <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioPage;
