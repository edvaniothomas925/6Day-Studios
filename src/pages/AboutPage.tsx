import React from 'react';
import { ArrowRight, Star, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '../components/OptimizedImage';
import { useApp } from '../context/AppContext';

const AboutPage = () => {
  const { settings } = useApp();
  const reviews = [
    { name: 'Lucas Silva', role: 'Músico', text: 'A 6Day Studios elevou meu trabalho a outro nível. O videoclipe ficou impecável.', stars: 5 },
    { name: 'Mariana Costa', role: 'CEO TechFlow', text: 'Profissionalismo raro. O comercial superou todas as nossas expectativas de conversão.', stars: 5 },
    { name: 'Roberto Alencar', role: 'Noivo', text: 'Capturaram a essência do nosso casamento de forma mágica. Recomendo muito!', stars: 5 },
  ];

  return (
    <div className="pt-32 pb-24 bg-premium-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* About Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <OptimizedImage 
                src="https://fv5-4.files.fm/thumb_show.php?i=ugb6zf6a5e&view&v=1&PHPSESSID=c8bf56f3a50ed2af799d5cea4ebc76b8c932b9c0" 
                alt="6Day Studios AO"
                loading="lazy"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 glass-card p-8 hidden md:block">
              <div className="text-4xl font-bold text-gold mb-1">10+</div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/40">Anos de Experiência</div>
            </div>
          </div>
          
          <div>
            <span className="text-gold text-xs font-bold uppercase tracking-widest mb-4 block">Nossa História</span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">Criando o futuro do <br />som e da imagem.</h1>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              A 6Day Studios AO é uma Gravadora, Loja & Distribuidora e Produtora AudioVisual focada em Marketing Digital. Localizada em Luanda, Angola, somos arquitetos de experiências que conectam marcas e artistas ao seu público.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h4 className="font-bold mb-2">Missão</h4>
                <p className="text-sm text-white/40">Elevar o padrão visual e sonoro de cada projeto, unindo técnica cinematográfica e engenharia de som.</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Visão</h4>
                <p className="text-sm text-white/40">Ser a referência global em produções que transformam o comum em extraordinário, do frame ao beat.</p>
              </div>
            </div>
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-gold font-bold hover:gap-4 transition-all">
              Conheça nosso portfólio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tighter mb-4">O que dizem nossos clientes</h2>
            <div className="flex justify-center gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-gold text-gold" />)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass-card p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.stars)].map((_, i) => <Star key={i} className="w-3 h-3 fill-gold text-gold" />)}
                </div>
                <p className="text-white/70 italic mb-6 leading-relaxed">"{review.text}"</p>
                <div>
                  <h4 className="font-bold">{review.name}</h4>
                  <span className="text-xs text-white/40 uppercase tracking-widest">{review.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Location Section */}
        {settings.mapEmbedUrl && (
          <section className="py-24 border-t border-white/5">
            <div className="text-center mb-16">
              <span className="text-gold text-xs font-bold uppercase tracking-widest mb-4 block">Visite-nos</span>
              <h2 className="text-4xl font-bold tracking-tighter mb-4">Nossa Localização</h2>
              <div className="flex items-center justify-center gap-2 text-white/60">
                <MapPin className="w-4 h-4 text-gold" />
                <span>{settings.address}</span>
              </div>
            </div>

            <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <iframe 
                src={settings.mapEmbedUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização do Estúdio"
                className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              ></iframe>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AboutPage;
