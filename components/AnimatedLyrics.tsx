
import React, { useState, useEffect } from 'react';

interface Props {
  text: string;
  color: string;
}

const AnimatedLyrics: React.FC<Props> = ({ text, color }) => {
  const [visibleText, setVisibleText] = useState('');

  useEffect(() => {
    let i = 0;
    setVisibleText('');
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setVisibleText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 60);

    return () => clearInterval(typingInterval);
  }, [text]);

  return (
    <div className="min-h-[80px] flex items-center justify-center">
      <p 
        className="font-handwriting text-4xl md:text-4xl text-center leading-snug px-4 transition-colors duration-1000"
        style={{ color: color }}
      >
        {visibleText}
        <span className="animate-pulse ml-1">|</span>
      </p>
    </div>
  );
};

export default AnimatedLyrics;
