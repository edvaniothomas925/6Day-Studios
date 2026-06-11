import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Calendar, Tag, ChevronRight, Newspaper, Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface NewsPost {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
}

const CATEGORIES = ['Todos', 'Lançamento', 'Estúdio', 'Promoção', 'Novidades'];

const NewsPage = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsList: NewsPost[] = [];
      snapshot.forEach((doc) => {
        newsList.push({ id: doc.id, ...doc.data() } as NewsPost);
      });
      setPosts(newsList);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao obter novidades:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredPosts = selectedCategory === 'Todos'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('pt-PT', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-premium-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.035)_0%,transparent_65%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold text-xs font-black uppercase tracking-[0.3em] mb-3 block">Mural da Produtora</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-4">Novidades da Prod</h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Acompanhe em primeira mão os novos lançamentos, bastidores de estúdio, promoções exclusivas e atualizações sobre a nossa infraestrutura.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setExpandedPostId(null);
              }}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border",
                selectedCategory === cat
                  ? "bg-gold border-gold text-black shadow-lg shadow-gold/10 scale-105"
                  : "bg-white/5 border-white/5 text-white/50 hover:text-white hover:bg-white/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Feed / Content grid */}
        {loading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
            <p className="text-white/40 text-xs font-bold tracking-widest uppercase font-mono">Carregando feed de notícias...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="max-w-md mx-auto py-16 text-center glass-card border-white/10 rounded-2xl flex flex-col items-center gap-4">
            <Newspaper className="w-12 h-12 text-white/20" />
            <div>
              <h3 className="font-bold text-white text-lg">Nenhuma novidade publicada</h3>
              <p className="text-white/40 text-xs mt-1">Brevemente teremos novos relatórios de produção, lançamentos e dicas aqui.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => {
                const isExpanded = expandedPostId === post.id;
                
                return (
                  <motion.article
                    key={post.id}
                    layout="position"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "glass-card rounded-3xl border border-white/10 overflow-hidden transition-all duration-300 flex flex-col relative",
                      isExpanded ? "md:col-span-2 shadow-2xl shadow-gold/5 bg-white/[0.03]" : "hover:border-white/20 hover:bg-white/[0.01]"
                    )}
                  >
                    {/* Header Image if available */}
                    {post.imageUrl && (
                      <div className={cn(
                        "w-full relative overflow-hidden bg-white/5",
                        isExpanded ? "h-64 md:h-80" : "h-48"
                      )}>
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-premium-black to-transparent opacity-60" />
                      </div>
                    )}

                    {/* Meta information row */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono font-bold text-gold uppercase tracking-wider">
                            <Tag className="w-3 h-3" /> {post.category}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white/40 font-mono">
                            <Calendar className="w-3.5 h-3.5" /> {formatDate(post.createdAt)}
                          </span>
                        </div>

                        <h2 className={cn(
                          "font-bold text-white tracking-tight leading-snug",
                          isExpanded ? "text-2xl md:text-3xl" : "text-xl line-clamp-2"
                        )}>
                          {post.title}
                        </h2>

                        <p className={cn(
                          "text-white/60 text-sm leading-relaxed whitespace-pre-wrap font-light",
                          isExpanded ? "" : "line-clamp-3"
                        )}>
                          {post.content}
                        </p>
                      </div>

                      {/* Footer Trigger Button */}
                      <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center">
                        {isExpanded ? (
                          <button
                            onClick={() => setExpandedPostId(null)}
                            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gold hover:text-white transition-colors cursor-pointer"
                          >
                            <ArrowLeft className="w-4 h-4" /> Minimizar Leitura
                          </button>
                        ) : (
                          <button
                            onClick={() => setExpandedPostId(post.id)}
                            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gold hover:text-white transition-colors cursor-pointer"
                          >
                            Ler Mais Completamente <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                        
                        {isExpanded && (
                          <span className="text-[10px] font-black uppercase font-mono tracking-widest text-white/20">Expandido por completo</span>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
