
import React from 'react';

interface Props {
  isPlaying: boolean;
  togglePlay: () => void;
  accentColor: string;
}

const AudioController: React.FC<Props> = ({ isPlaying, togglePlay, accentColor }) => {
  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-4 bg-white/90 backdrop-blur-md p-2 pl-4 rounded-full shadow-2xl border border-white/40 transition-all hover:scale-105 group">
      <div className="flex flex-col items-end pr-1 hidden md:flex">
        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">Alejandro Fernandez</span>
        <span className="text-xs font-serif italic text-gray-800">Celebración de Amor</span>
      </div>
      
      <div className="relative">
        <div 
          className={`absolute inset-0 rounded-full border border-black/5 transition-transform duration-[3000ms] linear infinite ${isPlaying ? 'animate-spin' : ''}`}
          style={{ 
            animationDuration: '3s',
            background: 'conic-gradient(from 0deg, transparent, rgba(0,0,0,0.05), transparent)' 
          }}
        ></div>
        
        <button 
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center rounded-full text-white transition-all shadow-lg active:scale-90 relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(0,0,0,0.1)]"
          style={{ backgroundColor: accentColor }}
          aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
          
          {isPlaying && (
            <div className="absolute bottom-1 flex gap-0.5 justify-center w-full">
              <div className="w-0.5 h-2 bg-white/40 animate-[bounce_1s_infinite]"></div>
              <div className="w-0.5 h-3 bg-white/40 animate-[bounce_0.8s_infinite]"></div>
              <div className="w-0.5 h-2 bg-white/40 animate-[bounce_1.2s_infinite]"></div>
            </div>
          )}
        </button>
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AudioController;
