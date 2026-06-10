import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowRight, Sparkles, SlidersHorizontal, Search, MessageSquareCode } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn, getWhatsAppUrl } from '../lib/utils';
import { OptimizedImage } from '../components/OptimizedImage';

const ProductsPage = () => {
  const { products, settings } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.category))).sort();
    return ['all', ...list];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = filter === 'all' || product.category === filter;
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [filter, products, searchQuery]);

  return (
    <div className="pt-32 pb-24 px-6 bg-premium-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col mb-12 gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 md:w-12 md:h-12 text-gold" /> Loja & Digital Assets
              </h1>
              <p className="text-white/50 max-w-lg">
                Eleve o nível das suas produções com nossos LUTs de cor premium, transições cinematográficas, templates profissionais e efeitos exclusivos.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Pesquisar produto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-premium-gray/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-gold text-sm text-white/90 placeholder-white/30 transition-colors"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-white/30" />
            </div>
          </div>

          {/* Filtering Tabs */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 pb-4 border-b border-white/5 overflow-x-auto no-scrollbar">
              <span className="text-xs font-bold uppercase tracking-widest text-white/30 self-center mr-2 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filtrar:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-5 py-2 rounded-full text-xs font-bold transition-all uppercase tracking-widest",
                    filter === cat ? "bg-gold text-black border-gold" : "bg-premium-gray/60 text-white/50 border border-white/5 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {cat === 'all' ? 'Todos' : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={product.id} 
                className="glass-card flex flex-col group overflow-hidden border border-white/10 hover:border-gold/40 transition-colors relative"
              >
                {/* Product Badge */}
                {product.type && (
                  <span className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-gold text-[9px] font-black uppercase tracking-widest border border-gold/20">
                    {product.type === 'digital' ? 'Download Digital' : 'Produto Físico'}
                  </span>
                )}

                {/* Product Image */}
                <div className="aspect-[4/3] bg-premium-gray overflow-hidden relative">
                  <OptimizedImage
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-premium-black to-transparent opacity-60 pointer-events-none" />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1.5">{product.category}</span>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-gold transition-colors line-clamp-1">{product.title}</h3>
                  <p className="text-white/50 text-xs mb-6 line-clamp-3 leading-relaxed flex-grow">{product.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <div>
                      <span className="text-[10px] text-white/30 uppercase tracking-widest block">Preço</span>
                      <span className="text-xl font-black text-white">Kz {product.price.toLocaleString()}</span>
                    </div>

                    <a
                      href={product.externalUrl ? product.externalUrl : getWhatsAppUrl(settings.whatsapp, `Olá! Estou interessado no produto "${product.title}" que vi no vosso site. Como posso prosseguir com a compra?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-gold text-black rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-white hover:text-black transition-all"
                    >
                      {product.externalUrl ? 'Comprar' : 'Pedir'} <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredProducts.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/30 border border-white/10">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-white/40 font-bold uppercase tracking-widest text-sm mb-1">Nenhum produto encontrado</p>
              <p className="text-xs text-white/20">Tente buscar por um termo diferente ou mude o filtro.</p>
            </div>
          )}
        </div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-premium-gray/20 p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-gold/20">
                <Sparkles className="w-3 h-3" /> Suporte & Ajuda
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Dúvidas sobre os nossos produtos?</h2>
              <p className="text-white/50 text-sm leading-relaxed">
                Nossos produtos de download digital são enviados imediatamente após a confirmação do pagamento. Oferecemos suporte completo para instalação de LUTs e utilização de templates.
              </p>
            </div>
            <a
              href={getWhatsAppUrl(settings.whatsapp, 'Olá! Tenho algumas dúvidas sobre os produtos e recursos digitais da 6Day Studios.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gold hover:text-black hover:border-gold transition-all shrink-0 uppercase tracking-wider text-xs"
            >
              <MessageSquareCode className="w-4 h-4" /> Falar com o Suporte
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ProductsPage;
