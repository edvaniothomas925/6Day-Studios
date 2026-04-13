import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play, Music, Mic, Video, Camera, Star, Users, Award, Clock, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { OptimizedImage } from '../components/OptimizedImage';

const Home = () => {
  const { settings } = useApp();

  const stats = useMemo(() => [
    { label: 'Projetos Entregues', value: '500+', icon: <Award className="w-5 h-5" /> },
    { label: 'Clientes Satisfeitos', value: '200+', icon: <Users className="w-5 h-5" /> },
    { label: 'Anos de Mercado', value: '10+', icon: <Clock className="w-5 h-5" /> },
  ], []);

  const processSteps = useMemo(() => [
    { 
      title: 'Brainstorming', 
      desc: 'Entendemos sua visão e transformamos em um conceito sólido.',
      number: '01'
    },
    { 
      title: 'Produção', 
      desc: 'Captação de áudio e vídeo com equipamentos de última geração.',
      number: '02'
    },
    { 
      title: 'Pós-Produção', 
      desc: 'Edição, mixagem e masterização com olhar artístico.',
      number: '03'
    },
    { 
      title: 'Entrega', 
      desc: 'Seu projeto pronto para impactar o mundo.',
      number: '04'
    }
  ], []);

  return (
    <div className="pt-20 bg-premium-black overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Hero Section */}
      <section className="relative h-[calc(100vh-80px)] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full"
          >
            <OptimizedImage 
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1920" 
              alt="Showreel Background"
              containerClassName="w-full h-full"
              className="w-full h-full object-cover opacity-30 grayscale-[0.5]"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-premium-black/40 via-transparent to-premium-black" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-[10px] font-black tracking-[0.2em] uppercase mb-8 text-gold"
            >
              <Star className="w-3 h-3 fill-gold" /> Excelência Audiovisual & Sonora
            </motion.span>
            
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-tighter mb-8 leading-[0.9] uppercase">
              Onde a <span className="text-gold-gradient italic">arte</span> <br />
              encontra a <span className="text-white">técnica</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-white/50 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Elevamos o padrão da sua marca com produções cinematográficas e engenharia de som de alta fidelidade.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/portfolio" className="w-full sm:w-auto px-10 py-5 bg-gold text-black font-black text-sm uppercase tracking-widest rounded-full flex items-center justify-center gap-3 hover:bg-white transition-all group shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                Explorar Portfólio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest rounded-full hover:bg-white/10 transition-all backdrop-blur-md">
                Iniciar Projeto
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="w-4 h-4 text-gold" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-y border-white/5 bg-premium-black/50 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-4 text-gold group-hover:bg-gold group-hover:text-black transition-all duration-500">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold tracking-tighter mb-1">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-gold text-[10px] font-black tracking-[0.3em] uppercase mb-4 block">Nossos Domínios</span>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-none">Especialistas em <br /><span className="text-gold">Impacto Sensorial</span></h2>
              <p className="text-white/40 text-lg font-light">Combinamos criatividade e tecnologia para entregar resultados que não apenas são vistos, mas sentidos.</p>
            </div>
            <Link to="/servicos" className="px-8 py-4 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gold hover:text-black transition-all flex items-center gap-3">
              Ver Todos os Serviços <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Produção de Vídeo', 
                desc: 'Comerciais, videoclipes e cobertura de eventos com estética cinematográfica e narrativa envolvente.', 
                icon: <Video className="w-8 h-8" />,
                tag: 'Visual'
              },
              { 
                title: 'Engenharia de Som', 
                desc: 'Produção musical, mixagem e masterização de alto nível para artistas e marcas exigentes.', 
                icon: <Mic className="w-8 h-8" />,
                tag: 'Sonoro'
              },
              { 
                title: 'Fotografia Premium', 
                desc: 'Ensaios, produtos e eventos capturados com iluminação técnica e pós-processamento artístico.', 
                icon: <Camera className="w-8 h-8" />,
                tag: 'Estático'
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-card p-10 group hover:border-gold/40 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <div className="text-8xl font-black italic">{i + 1}</div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-gold group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gold/50 mb-2 block">{item.tag}</span>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-gold transition-colors">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 px-6 bg-premium-gray relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-gold text-[10px] font-black tracking-[0.3em] uppercase mb-4 block">Workflow</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Como Criamos <span className="italic">Magia</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto font-light">Um processo estruturado para garantir que cada detalhe da sua visão seja executado com perfeição.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2 z-0" />
            
            {processSteps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-premium-black border border-white/10 flex items-center justify-center mx-auto mb-8 text-gold font-black text-xl shadow-xl group hover:border-gold transition-colors">
                  {step.number}
                </div>
                <h4 className="text-xl font-bold mb-4">{step.title}</h4>
                <p className="text-white/40 text-sm leading-relaxed font-light">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-12 px-6 border-t border-white/5 bg-premium-black/30">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 md:gap-16">
          <Link to="/portfolio" className="group flex items-center gap-4 text-white/40 hover:text-gold transition-all">
            <span className="text-3xl font-black italic group-hover:text-gold transition-colors">01</span>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest">Explorar</div>
              <div className="text-lg font-bold">Portfólio</div>
            </div>
          </Link>
          <Link to="/servicos" className="group flex items-center gap-4 text-white/40 hover:text-gold transition-all">
            <span className="text-3xl font-black italic group-hover:text-gold transition-colors">02</span>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest">Conhecer</div>
              <div className="text-lg font-bold">Serviços</div>
            </div>
          </Link>
          <Link to="/sobre" className="group flex items-center gap-4 text-white/40 hover:text-gold transition-all">
            <span className="text-3xl font-black italic group-hover:text-gold transition-colors">03</span>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest">Nossa</div>
              <div className="text-lg font-bold">História</div>
            </div>
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gold/5 blur-[150px] rounded-full scale-150 opacity-20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-9xl font-bold tracking-tighter mb-12 leading-[0.8] uppercase">
              Vamos dar <span className="text-gold italic">vida</span> <br />
              ao seu <span className="text-gold-gradient">projeto?</span>
            </h2>
            <p className="text-white/50 text-xl md:text-2xl mb-16 font-light max-w-2xl mx-auto">
              Seja um videoclipe, um comercial ou uma produção musical, estamos prontos para superar suas expectativas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <a 
                href={`https://wa.me/${settings.whatsapp}`}
                className="w-full sm:w-auto px-12 py-6 bg-gold text-black font-black text-xl uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-[0_20px_50px_rgba(212,175,55,0.3)]"
              >
                Falar no WhatsApp
              </a>
              <Link to="/portfolio" className="group flex items-center gap-3 text-white font-bold uppercase tracking-widest text-sm hover:text-gold transition-colors">
                Ver Portfólio <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
