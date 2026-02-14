
import React, { useState, useEffect, useMemo } from 'react';
import { LYRICS } from '../constants';

interface Props {
  currentTime: number;
  accentColor: string;
}

const SyncedLyrics: React.FC<Props> = ({ currentTime, accentColor }) => {
  const [visibleText, setVisibleText] = useState('');
  
  // Memoize the current line index to avoid searching every frame
  const currentIndex = useMemo(() => {
    let index = -1;
    for (let i = 0; i < LYRICS.length; i++) {
      if (LYRICS[i].timestamp <= currentTime) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [currentTime]);

  const currentLine = currentIndex >= 0 ? LYRICS[currentIndex] : null;

  useEffect(() => {
    if (!currentLine) {
      setVisibleText('');
      return;
    }

    const text = currentLine.text;
    const startTime = currentLine.timestamp;
    const nextTime = LYRICS[currentIndex + 1]?.timestamp || startTime + 5;
    const duration = nextTime - startTime;
    
    // Typing effect logic: 
    // We want to type out the characters relative to how much time has passed in the line
    const progress = Math.min((currentTime - startTime) / (duration * 0.8), 1); // Aim to finish typing 80% through the line's duration
    const charCount = Math.floor(text.length * progress);
    
    setVisibleText(text.substring(0, charCount));
  }, [currentTime, currentLine, currentIndex]);

  if (!currentLine) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-6 pointer-events-none">
      <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-2xl transform rotate-[-0.5deg] transition-all duration-1000">
        <div className="flex items-center justify-center gap-3 mb-3 opacity-60">
           <div className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: accentColor }}></div>
           <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500">Bitácora Sentimental</span>
        </div>
        <p 
          className="font-handwriting text-2xl md:text-4xl text-center leading-snug transition-colors duration-1000 min-h-[3rem]"
          style={{ color: accentColor }}
        >
          {visibleText}
          <span className="animate-pulse inline-block w-0.5 h-8 bg-current ml-1 align-middle"></span>
        </p>
      </div>
      
      {/* Decorative notebook binding rings on the side */}
      <div className="absolute top-1/2 -left-2 -translate-y-1/2 flex flex-col gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-4 h-4 rounded-full bg-gray-300 shadow-inner border border-gray-400"></div>
        ))}
      </div>
    </div>
  );
};

export default SyncedLyrics;
