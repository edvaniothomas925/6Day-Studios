import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  SlidersHorizontal, 
  Search, 
  MessageSquareCode, 
  Share2, 
  X, 
  Eye, 
  Check, 
  Info 
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
import { cn, getWhatsAppUrl } from '../lib/utils';
import { OptimizedImage } from '../components/OptimizedImage';
import { Skeleton } from '../components/Skeleton';

const ProductsPage = () => {
  const { products, settings } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);

  // Deep linking: automatically open the product details modal if `id` is present in search parameters
  useEffect(() => {
    const prodId = searchParams.get('id');
    if (prodId && products.length > 0) {
      const found = products.find(p => p.id === prodId);
      if (found) {
        setIsModalLoading(true);
        setSelectedProduct(found);
        const timer = setTimeout(() => {
          setIsModalLoading(false);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [searchParams, products]);

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

  const handleOpenDetails = (product: any) => {
    setIsModalLoading(true);
    setSelectedProduct(product);
    setSearchParams({ id: product.id });
    
    const timer = setTimeout(() => {
      setIsModalLoading(false);
    }, 500);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('id');
    setSearchParams(newParams);
  };

  const handleShare = (product: any, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Avoid triggering card details when clicking share from card list
    }
    const shareUrl = `${window.location.origin}/produtos?id=${product.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: shareUrl,
      })
      .catch((err) => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success('Link do produto copiado!', {
          description: `O link para "${product.title}" foi copiado para a área de transferência.`,
        });
      }).catch(() => {
        toast.error('Não foi possível copiar o link de partilha.');
      });
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-premium-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col mb-12 gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 flex items-center gap-3 text-white">
                <ShoppingBag className="w-8 h-8 md:w-12 md:h-12 text-gold" /> Loja & Artistas
              </h1>
              <p className="text-white/50 max-w-lg">
                Eleve o nível das suas criações: explore materiais de estúdio premium, acessórios para artistas e ativos digitais cinematográficos exclusivos.
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
                id="search-input"
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
                  id={`filter-tab-${cat}`}
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
                id={`product-card-${product.id}`}
              >
                {/* Product Badge */}
                {product.type && (
                  <span className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-gold text-[9px] font-black uppercase tracking-widest border border-gold/20">
                    {product.type === 'digital' ? 'Download Digital' : 'Produto Físico'}
                  </span>
                )}

                {/* Circular Share Action */}
                <button
                  onClick={(e) => handleShare(product, e)}
                  title="Partilhar Produto"
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-gold hover:text-black hover:scale-110 text-white/80 transition-all border border-white/10 cursor-pointer"
                  id={`share-btn-${product.id}`}
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {/* Product Image Clickable to Open Details */}
                <div 
                  onClick={() => handleOpenDetails(product)}
                  className="aspect-[4/3] bg-premium-gray overflow-hidden relative cursor-pointer"
                >
                  <OptimizedImage
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="bg-gold text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-4 h-4" /> Ver Detalhes
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-premium-black to-transparent opacity-60 pointer-events-none" />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1.5">{product.category}</span>
                  <h3 
                    onClick={() => handleOpenDetails(product)}
                    className="text-xl font-bold mb-2 group-hover:text-gold cursor-pointer transition-colors line-clamp-1 text-white"
                  >
                    {product.title}
                  </h3>
                  <p className="text-white/50 text-xs mb-3 line-clamp-3 leading-relaxed flex-grow">
                    {product.description}
                  </p>
                  
                  {/* Clickable text details action */}
                  <button 
                    onClick={() => handleOpenDetails(product)}
                    className="text-gold hover:text-white text-[11px] font-bold uppercase tracking-wider mb-5 flex items-center gap-1.5 text-left self-start transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" /> Mais Detalhes
                  </button>
                  
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
                      id={`buy-link-${product.id}`}
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

        {/* Product Details Immersive Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseDetails}
                className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
                id="modal-backdrop"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 30 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-premium-gray border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] md:h-[550px] flex flex-col md:flex-row overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 relative"
                id="modal-product-details"
              >
                {/* Close Button Inside Modal */}
                <button
                  onClick={handleCloseDetails}
                  className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/65 hover:bg-gold hover:text-black text-white transition-all border border-white/10 cursor-pointer animate-none"
                  title="Fechar"
                  id="close-modal-btn"
                >
                  <X className="w-5 h-5" />
                </button>

                {isModalLoading ? (
                  <>
                    {/* Left side: Premium Image Loading Placeholder */}
                    <div className="relative h-44 sm:h-56 md:h-auto md:w-1/2 flex-shrink-0 bg-black overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
                      <Skeleton className="w-full h-full rounded-none absolute inset-0" />
                    </div>

                    {/* Right side: Detailed Information & Actions Loading Placeholder */}
                    <div className="p-5 md:p-8 flex flex-col justify-between flex-1">
                      <div className="space-y-4">
                        <div>
                          {/* Category Tag Skeleton */}
                          <Skeleton className="h-3 w-16 mb-2" />
                          {/* Title Skeleton */}
                          <Skeleton className="h-7 w-3/4" />
                        </div>
                        
                        <div className="h-px bg-white/10" />
                        
                        <div>
                          {/* Subtitle skeleton */}
                          <Skeleton className="h-3 w-28 mb-3" />
                          {/* Paragraph line skeletons */}
                          <div className="space-y-2">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-[95%]" />
                            <Skeleton className="h-3 w-[90%]" />
                            <Skeleton className="h-3 w-2/3" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="h-px bg-white/10" />
                        
                        <div className="mb-2">
                          <Skeleton className="h-2.5 w-24 mb-1.5" />
                          <Skeleton className="h-6 w-36" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Skeleton className="h-10 rounded-xl" />
                          <Skeleton className="h-10 rounded-xl" />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Left side: Premium Image Display */}
                    <div className="relative h-44 sm:h-56 md:h-auto md:w-1/2 flex-shrink-0 bg-black overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
                      <OptimizedImage
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Badge */}
                      {selectedProduct.type && (
                        <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded bg-black/80 backdrop-blur-md text-gold text-[10px] font-black uppercase tracking-widest border border-gold/20">
                          {selectedProduct.type === 'digital' ? 'Download Digital' : 'Produto Físico'}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
                    </div>

                    {/* Right side: Detailed Information & Actions */}
                    <div className="p-5 md:p-8 flex flex-col justify-between flex-1 overflow-y-auto">
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] text-gold font-bold uppercase tracking-widest mb-1.5 block">{selectedProduct.category}</span>
                          <h2 className="text-xl md:text-2xl font-black tracking-tighter text-white leading-tight">{selectedProduct.title}</h2>
                        </div>
                        
                        <div className="h-px bg-white/10" />
                        
                        <div>
                          <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-gold" /> Detalhes do Produto
                          </h4>
                          <p className="text-white/70 text-xs md:text-sm leading-relaxed whitespace-pre-line max-h-40 md:max-h-56 overflow-y-auto pr-1">
                            {selectedProduct.description}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="h-px bg-white/10 my-4" />
                        
                        <div className="flex items-baseline justify-between mb-4">
                          <div>
                            <span className="text-[9px] text-white/40 uppercase tracking-widest block font-bold">Preço do recurso</span>
                            <span className="text-xl md:text-2xl font-black text-gold">Kz {selectedProduct.price.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {/* Share Button Inside Modal */}
                          <button
                            onClick={() => handleShare(selectedProduct)}
                            className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold flex items-center justify-center gap-2 uppercase tracking-wider text-white transition-all cursor-pointer"
                            id="modal-share-btn"
                          >
                            <Share2 className="w-4 h-4 text-gold" /> Partilhar
                          </button>

                          {/* Call-to-action Buy Button */}
                          <a
                            href={selectedProduct.externalUrl ? selectedProduct.externalUrl : getWhatsAppUrl(settings.whatsapp, `Olá! Estou interessado no produto "${selectedProduct.title}" que vi no vosso site. Como posso prosseguir com a compra?`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-3 bg-gold hover:bg-white text-black font-black rounded-xl text-xs flex items-center justify-center gap-2 uppercase tracking-wider transition-all shadow-lg hover:shadow-gold/20"
                            id="modal-buy-link"
                          >
                            {selectedProduct.externalUrl ? 'Comprar' : 'Pedir'} <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-white">Dúvidas sobre os nossos produtos?</h2>
              <p className="text-white/50 text-sm leading-relaxed">
                Nossos produtos de download digital são enviados imediatamente após a confirmação do pagamento. Oferecemos suporte completo para instalação de LUTs e utilização de templates.
              </p>
            </div>
            <a
              href={getWhatsAppUrl(settings.whatsapp, 'Olá! Tenho algumas dúvidas sobre os produtos e recursos digitais da 6Day Studios.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gold hover:text-black hover:border-gold transition-all shrink-0 uppercase tracking-wider text-xs"
              id="support-whatsapp-btn"
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
