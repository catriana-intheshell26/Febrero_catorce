
import React, { useEffect, useState, useRef } from 'react';
import { MILESTONES, AUDIO_URL, INTRO_GALLERY } from './constants';
import OceanWaves from './components/OceanWaves';
import HandwrittenNote from './components/HandwrittenNote';
import AnimatedLyrics from './components/AnimatedLyrics';
import EncounterMap from './components/EncounterMap';
import AudioController from './components/AudioController';
import SyncedLyrics from './components/SyncedLyrics';

const ButterflyIcon = ({ color, className, onClick }: { color: string, className?: string, onClick?: () => void }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={`w-12 h-12 md:w-28 md:h-28 fill-current cursor-pointer transition-all duration-500 hover:scale-110 active:scale-95 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] ${className}`} 
    style={{ color }}
    onClick={onClick}
  >
    <path d="M50 50 C50 50 10 10 10 30 C10 50 30 50 50 50 C50 50 90 10 90 30 C90 50 70 50 50 50 C50 50 10 90 10 70 C10 50 30 50 50 50 C50 50 90 90 90 70 C90 50 70 50 50 50" />
    <path d="M50 30 L50 70" stroke="currentColor" strokeWidth="1" />
    <circle cx="50" cy="50" r="2" fill="currentColor" />
  </svg>
);

const App: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [bookOpened, setBookOpened] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollPos = containerRef.current.scrollTop;
      const height = containerRef.current.clientHeight;
      const index = Math.round(scrollPos / height);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) * 100;
    const y = (clientY / window.innerHeight) * 100;
    setMousePos({ x, y });
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.error("Audio playback blocked", e);
        // Intentamos forzar el estado para que la UI responda
        setIsPlaying(true);
      });
    }
  };

  const handleButterflyClick = () => {
    setBookOpened(true);
    if (!isPlaying) togglePlay();
  };

  const nextGalleryPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryIndex((prev) => (prev + 1) % INTRO_GALLERY.length);
  };

  const scrollToSection = (index: number) => {
    if (!containerRef.current) return;
    const height = containerRef.current.clientHeight;
    containerRef.current.scrollTo({
      top: index * height,
      behavior: 'smooth'
    });
  };

  const currentTheme = MILESTONES[activeIndex]?.theme || MILESTONES[0].theme;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth transition-all duration-1000 perspective-container selection:bg-[#ae2012] selection:text-white relative"
      style={{ backgroundColor: currentTheme.bg, perspective: '2000px' }}
    >
      <audio ref={audioRef} src={AUDIO_URL} loop />
      
      {/* CAPA DE EFECTO MOUSEOVER ESTACIONAL */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 opacity-30 md:opacity-50"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${currentTheme.accent}33 0%, transparent 70%)`,
        }}
      />

      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[1] bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]"></div>

      <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-6 items-center">
        <div className="w-px h-20 bg-gray-400 opacity-20"></div>
        {MILESTONES.map((m, idx) => (
          <button
            key={m.id}
            onClick={() => scrollToSection(idx)}
            className="group relative flex items-center justify-center"
          >
            <div className={`w-3 h-3 rounded-full transition-all duration-500 border-2 ${activeIndex === idx ? 'scale-150 shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                 style={{ 
                   backgroundColor: activeIndex === idx ? currentTheme.accent : 'transparent',
                   borderColor: activeIndex === idx ? currentTheme.accent : 'gray'
                 }}>
            </div>
            <span className={`absolute left-8 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-500 origin-left ${activeIndex === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
                  style={{ color: currentTheme.accent }}>
              {m.stage}
            </span>
          </button>
        ))}
        <div className="w-px h-20 bg-gray-400 opacity-20"></div>
      </nav>

      <AudioController 
        isPlaying={isPlaying} 
        togglePlay={togglePlay} 
        accentColor={currentTheme.accent} 
      />

      {isPlaying && (
        <SyncedLyrics 
          currentTime={currentTime} 
          accentColor={currentTheme.accent} 
        />
      )}

      <OceanWaves color={currentTheme.wave} />

      {MILESTONES.map((m, idx) => {
        const isIntro = idx === 0;
        const isMap = idx === 1;
        const isFinal = idx === MILESTONES.length - 1;
        const theme = m.theme;

        return (
          <section 
            key={m.id}
            className={`h-screen w-full snap-start flex items-center justify-center p-4 md:p-8 relative overflow-hidden page-transition group/section ${activeIndex === idx ? 'page-active' : 'page-hidden'}`}
          >
            <div className="absolute inset-0 transition-all duration-1000 group-hover/section:bg-black/[0.01] pointer-events-none"></div>

            {isIntro ? (
              <div className="perspective-[2500px] w-full max-w-5xl h-[70vh] md:h-[80vh] z-20">
                <div className={`relative w-full h-full preserve-3d transition-all duration-[1800ms] cubic-bezier(0.645, 0.045, 0.355, 1) ${bookOpened ? 'md:translate-x-[20%]' : 'translate-x-0'}`}>
                  
                  {/* PORTADA (CUBIERTA DEL LIBRO) */}
                  <div 
                    className={`absolute inset-0 bg-[#3d4b37] shadow-[20px_0_50px_rgba(0,0,0,0.6)] rounded-r-sm z-40 transition-all duration-[1800ms] cubic-bezier(0.645, 0.045, 0.355, 1) origin-left preserve-3d ${bookOpened ? '-rotate-y-[125deg]' : 'rotate-y-0'}`}
                  >
                    {/* Lomo y bordes dorados suaves */}
                    <div className="absolute inset-0 border-[12px] border-[#34412f] rounded-r-sm shadow-inner pointer-events-none"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent"></div>
                    
                    <div className="absolute inset-6 border border-[#fdfaf1]/10 rounded-sm flex flex-col items-center justify-center text-center p-8 backface-hidden">
                       <p className="text-[#fdfaf1]/40 text-[9px] uppercase tracking-[0.5em] mb-6 font-bold animate-pulse">Toca la mariposa para descubrir</p>
                       
                       <div className="flex gap-6 md:gap-12 mb-16 relative">
                          <ButterflyIcon 
                            color="#fdfaf1" 
                            className="animate-butterfly-1" 
                            onClick={handleButterflyClick}
                          />
                          <ButterflyIcon 
                            color="#fdfaf1" 
                            className="animate-butterfly-2" 
                            onClick={handleButterflyClick}
                          />
                          
                          {/* Efecto de luz central detrás de las mariposas */}
                          <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full -z-10 animate-pulse"></div>
                       </div>
                       
                       <h2 className="font-serif text-5xl md:text-[6rem] text-[#fdfaf1] italic mb-8 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-none select-none">
                         Our love <br/> 
                         <span className="text-3xl md:text-5xl opacity-60 tracking-widest block mt-4 font-light uppercase">to</span>
                         <span className="block mt-4 text-[#fdfaf1]/90">Admire</span>
                       </h2>
                       
                       <div className="w-40 h-[1px] bg-[#fdfaf1]/20 mb-8"></div>
                       <p className="text-[11px] uppercase tracking-[1em] text-[#fdfaf1]/40 font-black">M M X X I V</p>
                    </div>

                    {/* Reverso de la portada (hoja de cortesía) */}
                    <div className="absolute inset-0 bg-[#f4f1ea] rotate-y-180 backface-hidden flex items-center justify-center p-12 text-center shadow-[inset_0_0_100px_rgba(0,0,0,0.05)] rounded-l-sm">
                        <div className="max-w-xs space-y-6">
                          <div className="w-12 h-12 mx-auto border border-black/10 rounded-full flex items-center justify-center text-black/20 text-xl font-serif">A</div>
                          <p className="font-handwriting text-3xl text-gray-400 italic leading-snug">
                            "Para el mundo puedes ser una persona, <br/> pero para una persona eres el mundo."
                          </p>
                          <div className="w-10 h-px bg-black/10 mx-auto"></div>
                        </div>
                    </div>
                  </div>

                  {/* PÁGINA INTERIOR (CONTENIDO REVELADO) */}
                  <div className="absolute inset-0 bg-[#fcf8f0] shadow-2xl rounded-sm flex flex-col md:flex-row overflow-hidden border border-[#dcd0bc] z-30">
                    {/* GALERÍA DE FOTOS INTERACTIVA */}
                    <div 
                      className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-[#dcd0bc] flex items-center justify-center bg-[#fdfaf1]/60 cursor-pointer group/photo relative overflow-hidden"
                      onClick={nextGalleryPhoto}
                    >
                       <div className="relative w-full h-full max-h-[450px] aspect-[4/5] flex items-center justify-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-4 rotate-[-1.5deg] transition-all duration-700 group-hover/photo:rotate-0 group-hover/photo:scale-[1.03] bg-white border border-black/5">
                         <img 
                           key={galleryIndex}
                           src={INTRO_GALLERY[galleryIndex]} 
                           className="w-full h-full object-cover rounded-sm animate-photo-reveal" 
                           alt="Nuestra Historia" 
                         />
                         <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/20 pointer-events-none"></div>
                         
                         {/* Banner de interacción */}
                         <div className="absolute bottom-10 inset-x-0 flex justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover/photo:translate-y-0">
                           <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-[10px] text-white uppercase tracking-widest flex items-center gap-3">
                             <span>Toca para ver otra foto</span>
                             <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></div>
                           </div>
                         </div>
                       </div>
                       
                       {/* Decoración: Cinta adhesiva vintage */}
                       <div className="absolute top-8 left-1/2 -translate-x-1/2 w-28 h-10 bg-white/50 backdrop-blur-sm -rotate-3 z-10 border border-black/5 shadow-sm opacity-80 pointer-events-none"></div>
                       <div className="absolute bottom-10 right-10 w-20 h-20 border-r border-b border-black/5 rounded-br-3xl pointer-events-none"></div>
                    </div>
                    
                    {/* TEXTO DE INTRODUCCIÓN */}
                    <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center text-center md:text-left space-y-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 justify-center md:justify-start">
                          <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-gray-400">Capítulo I</span>
                          <div className="h-px w-10 bg-gray-200"></div>
                        </div>
                        <h1 className="font-serif text-5xl md:text-8xl text-[#1a1c1e] leading-none">
                          Nuestro <br/>
                          <span className="italic font-light" style={{ color: theme.accent }}>Destino</span>
                        </h1>
                      </div>
                      
                      <p className="font-handwriting text-3xl md:text-4xl text-gray-600 leading-relaxed italic relative">
                        <span className="absolute -left-6 top-0 text-6xl text-gray-200 font-serif">"</span>
                        {m.description}
                      </p>

                      <div className="pt-8 space-y-10">
                        <div className="flex flex-col gap-4 items-center md:items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.accent }}></div>
                            <span className="text-[11px] uppercase tracking-[0.4em] font-black text-gray-400">Bitácora de Vuelo</span>
                          </div>
                          <p className="text-xs text-gray-400 font-light max-w-xs italic">
                            Desliza hacia abajo para navegar por las estaciones de nuestro viaje.
                          </p>
                        </div>
                        
                        <div className="animate-bounce-slow flex justify-center md:justify-start">
                          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Sombra del lomo central */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              </div>
            ) : isMap ? (
              <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center page-content z-10">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <span className="font-bold uppercase tracking-[0.5em] text-xs opacity-60" style={{ color: theme.accent }}>Etapa II: {m.stage}</span>
                    <h2 className="font-serif text-5xl md:text-7xl">{m.title.split(' ')[0]} <span style={{ color: theme.accent }}>{m.title.split(' ').slice(1).join(' ')}</span></h2>
                  </div>
                  <p className="text-xl text-gray-700 leading-relaxed font-light italic bg-white/50 backdrop-blur-md p-6 rounded-lg shadow-sm border border-white/40 transition-all hover:bg-white/70">
                    "{m.description}"
                  </p>
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-[1px]" style={{ backgroundColor: theme.accent }}></div>
                     <p className="font-handwriting text-3xl" style={{ color: theme.accent }}>El viaje floreció aquí</p>
                  </div>
                </div>
                <EncounterMap isActive={activeIndex === 1} photoUrl={m.imageUrl} />
                <div className="page-shadow"></div>
              </div>
            ) : isFinal ? (
              <div className="max-w-4xl space-y-12 z-10 page-content text-center">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.6em] opacity-60" style={{ color: theme.accent }}>El océano que nunca termina</span>
                  <h2 className="font-serif text-7xl md:text-[10rem] italic" style={{ color: theme.text }}>
                    Eres mi <span style={{ color: theme.accent }}>Mar</span>
                  </h2>
                </div>
                <p className="font-handwriting text-4xl md:text-5xl leading-relaxed max-w-3xl mx-auto" style={{ color: theme.text }}>
                  {m.description}
                </p>
                <div className="relative py-12">
                   <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <span className="text-[15rem] font-serif" style={{ color: theme.accent }}>♥</span>
                   </div>
                   {!isPlaying && <AnimatedLyrics text={m.phrase} color={theme.accent} />}
                </div>
                <button 
                  onClick={() => scrollToSection(0)}
                  className="group relative px-16 py-6 overflow-hidden rounded-full border transition-all shadow-2xl active:scale-95"
                  style={{ borderColor: theme.accent }}
                >
                  <span className="relative z-10 transition-colors uppercase text-xs tracking-[0.4em] font-black group-hover:text-white" style={{ color: theme.accent }}>Volver al Primer Puerto</span>
                  <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-700" style={{ backgroundColor: theme.accent }}></div>
                </button>
                <div className="page-shadow"></div>
              </div>
            ) : (
              <div className={`max-w-6xl w-full flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 items-center page-content z-10`}>
                <div className="w-full md:w-1/2 relative group">
                   <div className="bg-white p-5 shadow-2xl rotate-1 transform group-hover:rotate-0 transition-transform duration-700 rounded-sm hover:scale-[1.03]">
                     <img src={m.imageUrl} className="w-full h-[350px] md:h-[480px] object-cover rounded-sm" alt={m.title} />
                     <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-48 h-12 bg-white/70 backdrop-blur-md rotate-[-1deg] border border-black/5 flex items-center justify-center shadow-sm">
                        <span className="text-[9px] uppercase tracking-widest font-black opacity-40">Memorias de {m.date}</span>
                     </div>
                   </div>
                </div>
                <div className="w-full md:w-1/2 space-y-6 p-10 border-l-4 bg-white/20 backdrop-blur-sm shadow-sm rounded-r-xl transition-all hover:bg-white/30" style={{ borderLeftColor: theme.accent }}>
                   <div className="flex items-center gap-4">
                     <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-70" style={{ color: theme.accent }}>Etapa {idx + 1}: {m.stage}</span>
                     <div className="flex-1 h-px bg-black/5"></div>
                   </div>
                   <h2 className="font-serif text-5xl md:text-6xl" style={{ color: theme.text }}>{m.title}</h2>
                   <p className="font-handwriting text-3xl leading-snug text-gray-700 opacity-90">
                     {m.description}
                   </p>
                   {!isPlaying && (
                     <div className="pt-10">
                        <AnimatedLyrics text={m.phrase} color={theme.accent} />
                     </div>
                   )}
                </div>
                <div className="page-shadow"></div>
              </div>
            )}
          </section>
        )
      })}

      <style>{`
        ::-webkit-scrollbar { display: none; }
        .h-screen { 
          scroll-behavior: smooth;
          scroll-snap-stop: always;
        }
        
        .page-transition {
          transform-style: preserve-3d;
          transition: transform 1.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          transform-origin: center top;
        }

        .page-content {
          transition: transform 1.2s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 1s ease;
          transform-style: preserve-3d;
        }

        .page-hidden { pointer-events: none; }

        .page-hidden .page-content {
          transform: rotateX(-10deg) translateY(30px) scale(0.96);
          opacity: 0;
        }

        .page-active .page-content {
          transform: rotateX(0deg) translateY(0) scale(1);
          opacity: 1;
        }

        .preserve-3d { transform-style: preserve-3d; }
        .rotate-y-0 { transform: rotateY(0deg); }
        .-rotate-y-[125deg] { transform: rotateY(-125deg); }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; }

        @keyframes photo-reveal {
          from { opacity: 0; transform: scale(1.1) rotate(2deg); filter: sepia(1); }
          to { opacity: 1; transform: scale(1) rotate(0); filter: sepia(0); }
        }
        .animate-photo-reveal { animation: photo-reveal 1s cubic-bezier(0.23, 1, 0.32, 1) forwards; }

        @keyframes butterfly-1 {
          0% { transform: rotate(-15deg) scale(1); }
          50% { transform: rotate(-30deg) scale(1.15); filter: brightness(1.2); }
          100% { transform: rotate(-15deg) scale(1); }
        }
        @keyframes butterfly-2 {
          0% { transform: rotate(15deg) scale(1); }
          50% { transform: rotate(30deg) scale(1.25); filter: brightness(1.2); }
          100% { transform: rotate(15deg) scale(1); }
        }
        .animate-butterfly-1 { animation: butterfly-1 3s ease-in-out infinite; }
        .animate-butterfly-2 { animation: butterfly-2 3.5s ease-in-out infinite; }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }

        .page-shadow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.05), transparent);
          pointer-events: none;
          opacity: 0;
          transition: opacity 1.2s ease;
        }

        .page-active .page-shadow { opacity: 1; }

        .perspective-container { perspective: 2500px; }

        /* Custom ease for the book opening */
        .cubic-bezier(0.645, 0.045, 0.355, 1) {
          transition-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1);
        }
      `}</style>
    </div>
  );
};

export default App;
