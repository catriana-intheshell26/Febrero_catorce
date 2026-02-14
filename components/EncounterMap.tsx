
import React from 'react';

interface Props {
  isActive: boolean;
  photoUrl: string;
}

const EncounterMap: React.FC<Props> = ({ isActive, photoUrl }) => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl bg-black">
      {/* Zoom Layers */}
      <div className={`absolute inset-0 transition-all duration-[4000ms] ease-in-out transform ${isActive ? 'scale-[10] opacity-0' : 'scale-1 opacity-100'}`}>
        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Space" />
      </div>
      
      <div className={`absolute inset-0 transition-all duration-[3000ms] delay-[1000ms] ease-in-out transform ${isActive ? 'scale-[5] opacity-0' : 'scale-0 opacity-0'} ${isActive && 'opacity-100'}`}>
        <img src="https://images.unsplash.com/photo-1569336415962-a4bd9f6dfc0f?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Mexico" />
      </div>

      <div className={`absolute inset-0 transition-all duration-[2000ms] delay-[2500ms] ease-in-out transform ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        <img src={photoUrl} className="w-full h-full object-cover" alt="CDMX Meeting" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <p className="font-handwriting text-3xl">Aquí nació todo...</p>
        </div>
      </div>

      {/* Crosshair Overlay */}
      <div className="absolute inset-0 border border-white/20 pointer-events-none flex items-center justify-center">
        <div className="w-8 h-8 border border-white/40 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default EncounterMap;
