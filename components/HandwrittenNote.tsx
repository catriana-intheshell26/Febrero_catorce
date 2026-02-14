
import React from 'react';

interface Props {
  date: string;
  phrase: string;
  rotation?: string;
  accentColor?: string;
}

const HandwrittenNote: React.FC<Props> = ({ date, phrase, rotation = "rotate-2", accentColor = "#ae2012" }) => {
  return (
    <div 
      className={`bg-white/95 p-6 shadow-xl border-l-4 max-w-xs ${rotation} relative transition-all duration-1000`}
      style={{ borderLeftColor: accentColor }}
    >
      <div 
        className="absolute -top-3 -left-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-[12px] font-bold shadow-sm transition-colors duration-1000"
        style={{ backgroundColor: accentColor }}
      >
        ❤
      </div>
      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">{date}</p>
      <p className="font-handwriting text-2xl text-[#1a1c1e] leading-tight">
        "{phrase}"
      </p>
    </div>
  );
};

export default HandwrittenNote;
