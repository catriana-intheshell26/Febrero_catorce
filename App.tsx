import React, { useEffect, useState, useRef } from 'react';
import { MILESTONES, AUDIO_URL, INTRO_GALLERY, YOUTUBE_ID } from './constants';
import OceanWaves from './components/OceanWaves';
import HandwrittenNote from './components/HandwrittenNote';
import AnimatedLyrics from './components/AnimatedLyrics';
import EncounterMap from './components/EncounterMap';
import AudioController from './components/AudioController';
import SyncedLyrics from './components/SyncedLyrics';


// Selección específica de imágenes de la carpeta public (1, 3, 4, 12, 15)
const base = import.meta.env.BASE_URL;
const BOOK_GALLERY = [
  `1.jpeg`,
  `3.jpeg`,
  `4.jpeg`,
  `12.jpeg`,
  `15.jpeg`
];

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
  const [sectionImageIndex, setSectionImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // EFECTO 1: Manejo del Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const index = Math.round(containerRef.current.scrollTop / containerRef.current.clientHeight);
      if (index !== activeIndex) setActiveIndex(index);
    };
    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll, { passive: true });
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  // EFECTO 2: Carrusel Automático del Libro
  useEffect(() => {
    let interval: any;
    if (bookOpened) {
      interval = setInterval(() => {
        setGalleryIndex((prev) => (prev + 1) % BOOK_GALLERY.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [bookOpened]);

  // EFECTO 3: Control de tiempo Audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', updateTime);
    return () => audio.removeEventListener('timeupdate', updateTime);
  }, []);

  // EFECTO 4: Control del Array de 2 fotos
  useEffect(() => {
    const interval = setInterval(() => {
      setSectionImageIndex((prev) => (prev + 1) % 2); // El '2' es por las dos imágenes
    }, 3000); // Cambia cada 3 segundos
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100
    });
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleButterflyClick = () => {
    setBookOpened(!bookOpened);
    if (!isPlaying) setIsPlaying(true);
  };

  const nextGalleryPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryIndex((prev) => (prev + 1) % BOOK_GALLERY.length);
  };

  const scrollToSection = (index: number) => {
    containerRef.current?.scrollTo({
      top: index * containerRef.current.clientHeight,
      behavior: 'smooth'
    });
  };

  const currentTheme = MILESTONES[activeIndex]?.theme || MILESTONES[0].theme;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth transition-all duration-1000 perspective-container selection:bg-[#ae2012] selection:text-white relative"
      style={{ backgroundColor: currentTheme.bg, perspective: '2500px' }}
    >
      <audio ref={audioRef} src={AUDIO_URL} loop />

      <div className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 opacity-30 md:opacity-50"
        style={{ background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${currentTheme.accent}33 0%, transparent 70%)` }}
      />

      <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-6 items-center">
        {MILESTONES.map((m, idx) => (
          <button key={m.id} onClick={() => scrollToSection(idx)} className="group relative flex items-center justify-center">
            <div className={`w-3 h-3 rounded-full transition-all duration-500 border-2 ${activeIndex === idx ? 'scale-150 shadow-lg' : 'opacity-40 hover:opacity-100'}`}
              style={{ backgroundColor: activeIndex === idx ? currentTheme.accent : 'transparent', borderColor: activeIndex === idx ? currentTheme.accent : 'gray' }} />
          </button>
        ))}
      </nav>

      <AudioController isPlaying={isPlaying} togglePlay={togglePlay} accentColor={currentTheme.accent} />
      {isPlaying && <SyncedLyrics currentTime={currentTime} accentColor={currentTheme.accent} />}
      <OceanWaves color={currentTheme.wave} />

      {MILESTONES.map((m, idx) => {
        const isIntro = idx === 0;
        const isMap = idx === 1;
        const isFinal = idx === MILESTONES.length - 1;
        const theme = m.theme;

        return (
          <section key={m.id} className={`h-screen w-full snap-start flex items-center justify-center p-4 md:p-8 relative overflow-hidden page-transition ${activeIndex === idx ? 'page-active' : 'page-hidden'}`}>
            {isIntro ? (
              <div className="perspective-container w-full max-w-5xl h-[70vh] md:h-[80vh] z-20">
                <div className={`relative w-full h-full preserve-3d transition-all duration-[1800ms] ${bookOpened ? 'md:translate-x-[20%] scale-[0.8] md:scale-100' : ''}`}>

                  {/* TAPA DEL LIBRO QUE GIRA */}
                  <div className={`absolute inset-0 z-40 origin-left preserve-3d transition-transform duration-[1800ms] cursor-pointer ${bookOpened ? 'rotated-book' : ''}`} onClick={handleButterflyClick}>
                    <div className="absolute inset-0 bg-[#3d4b37] rounded-r-sm backface-hidden shadow-2xl">
                      <div className="absolute inset-0 border-[8px] md:border-[12px] border-[#34412f] rounded-r-sm shadow-inner" />
                      <div className="absolute inset-4 md:inset-6 border border-[#fdfaf1]/10 rounded-sm flex flex-col items-center justify-center text-center p-4 md:p-8">
                        <ButterflyIcon color="#fdfaf1" className="animate-butterfly-1 mb-4 md:mb-8" />
                        <h2 className="font-serif text-2xl md:text-[5rem] text-[#fdfaf1] italic leading-none select-none">Siempre habrá un sitio <br /> <span className="text-lg md:text-xl opacity-60 uppercase">donde</span> <br /> podrás encontrarnos...</h2>
                        <p className="text-[#fdfaf1]/40 text-[8px] md:text-[9px] uppercase tracking-[0.5em] mt-6 md:mt-8 animate-pulse font-bold">Toca para abrir</p>
                      </div>
                    </div>
                    {/* Reverso de la Tapa */}
                    <div className="absolute inset-0 bg-[#f4f1ea] rotate-y-180 backface-hidden flex items-center justify-center p-6 md:p-12 text-center rounded-l-sm border-r border-black/10 shadow-[inset_0_0_100px_rgba(0,0,0,0.05)]">
                      <p className="font-serif text-xl md:text-2xl text-gray-600 italic">"Te amo"</p>
                    </div>
                  </div>

                  {/* PÁGINAS INTERIORES */}
                  <div className="absolute inset-0 bg-[#fcf8f0] shadow-2xl rounded-sm flex flex-col md:flex-row overflow-y-auto md:overflow-hidden border border-[#dcd0bc] z-30">
                    <div className="w-full md:w-1/2 p-4 md:p-6 border-b md:border-b-0 md:border-r border-[#dcd0bc] flex items-center justify-center bg-[#fdfaf1]/60" onClick={nextGalleryPhoto}>
                      <div className="relative w-full max-w-[280px] md:max-w-none aspect-[4/5] bg-white p-2 md:p-4 shadow-xl rotate-[-1.5deg]">
                        <img key={galleryIndex} src={BOOK_GALLERY[galleryIndex]} className="w-full h-full object-cover rounded-sm animate-photo-reveal" alt="Galería" />
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                          {BOOK_GALLERY.map((_, i) => (
                            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${galleryIndex === i ? 'w-4 bg-black/40' : 'w-1 bg-black/10'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center text-center md:text-left space-y-4 md:space-y-6">
                      <h1 className="font-serif text-3xl md:text-7xl leading-tight">Nuestro <br /> <span style={{ color: theme.accent }}>Destino</span></h1>
                      <p className="font-handwriting text-xl md:text-3xl text-gray-600 italic leading-snug">{m.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : isMap ? (
              <div className="max-w-6xl w-full flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center z-10 page-content px-4">
                <div className="space-y-4 md:space-y-8 text-center md:text-left">
                  <h2 className="font-serif text-4xl md:text-7xl">{m.title}</h2>
                  <p className="text-lg md:text-xl italic bg-white/50 p-4 md:p-6 rounded-lg border border-white/40 transition-all hover:bg-white/70">"{m.description}"</p>
                </div>
                <div className="w-full scale-90 md:scale-100">
                  <EncounterMap isActive={activeIndex === 1} 
                  photoUrl={Array.isArray(m.imageUrl) ? m.imageUrl[0] : m.imageUrl} />
                </div>
              </div>
            ) : isFinal ? (
              <div className="max-w-4xl space-y-8 md:space-y-12 z-10 text-center page-content flex flex-col items-center px-4">
                <h2 className="font-serif text-5xl md:text-[10rem] italic leading-tight" style={{ color: theme.text }}>
                  Eres mi <span style={{ color: theme.accent }}>Vida</span>
                </h2>
                <p className="font-handwriting text-2xl md:text-5xl" style={{ color: theme.text }}>{m.description}</p>

                {/* VIDEO DE YOUTUBE FINAL */}
                <div className={`mt-6 md:mt-12 transition-all duration-1000 ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} w-full max-w-2xl aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-2xl`}>
                  <iframe
                    width="100%" height="100%"
                    src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&controls=1`}
                    frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                  />
                </div>
                <button onClick={() => scrollToSection(0)} className="mt-4 md:mt-8 px-8 md:px-12 py-3 md:py-4 rounded-full border-2 transition-all hover:bg-white/10 font-bold text-sm md:text-base" style={{ borderColor: theme.accent, color: theme.accent }}>
                  VOLVER AL INICIO
                </button>
              </div>
            ) : (
              <div className={`max-w-6xl w-full flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-16 items-center z-10 page-content px-4`}>
                <div className="w-full md:w-1/2 relative group">
                  <div className="bg-white p-3 md:p-5 shadow-2xl rounded-sm rotate-1 transition-transform hover:rotate-0">
                    <img
                      src={Array.isArray(m.imageUrl) ? m.imageUrl[sectionImageIndex] : m.imageUrl}
                      key={Array.isArray(m.imageUrl) ? sectionImageIndex : 'static'}
                      className="w-full h-[250px] md:h-[480px] object-cover rounded-sm animate-photo-reveal"
                      alt={m.title}
                    />
                    {Array.isArray(m.imageUrl) && m.imageUrl.length > 1 && (
                      <div className="flex justify-center gap-2 mt-4">
                        {m.imageUrl.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-500 ${sectionImageIndex === i ? 'w-6 bg-gray-400' : 'w-2 bg-gray-200'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full md:w-1/2 space-y-3 md:space-y-6 p-4 md:p-10 border-l-4 text-center md:text-left" style={{ borderLeftColor: theme.accent }}>
                  <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl" style={{ color: theme.text }}>{m.title}</h2>
                  <p className="font-handwriting text-xl md:text-3xl text-gray-700 opacity-90 leading-tight md:leading-normal">{m.description}</p>
                  {!isPlaying && <div className="pt-2 md:pt-10"><AnimatedLyrics text={m.phrase} color={theme.accent} /></div>}
                </div>
              </div>
            )}
          </section>
        );
      })}

      <style>{`
        ::-webkit-scrollbar { display: none; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-0 { transform: rotateY(0deg); }
        .rotate-y-180 { transform: rotateY(180deg); }
        .perspective-container { perspective: 2500px; }
        .origin-left { transform-origin: left; }
        .rotated-book { transform: rotateY(-110deg) scale(0.9); }
        @media (min-width: 768px) {
          .rotated-book { transform: rotateY(-145deg) scale(1); }
        }
        .page-transition { transition: transform 1.2s cubic-bezier(0.645, 0.045, 0.355, 1); }
        .page-hidden { pointer-events: none; opacity: 0; transform: translateY(20px); }
        .page-active { opacity: 1; transform: translateY(0); }
        @keyframes photo-reveal { from { opacity: 0; transform: scale(1.1) filter(blur(10px)); } to { opacity: 1; transform: scale(1) filter(blur(0)); } }
        .animate-photo-reveal { animation: photo-reveal 1s ease-out forwards; }
        @keyframes butterfly-1 { 0%, 100% { transform: rotate(-15deg); } 50% { transform: rotate(-30deg) scale(1.1); } }
        .animate-butterfly-1 { animation: butterfly-1 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default App;