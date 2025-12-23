import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ExplodingText from './components/ExplodingText';
import { CONFIG } from './config';

function App() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // specific listener for mouse move to ensure we have latest coordinates
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleClick = () => {
    setPhraseIndex((prev) => (prev + 1) % CONFIG.PHRASES.length);
  };

  return (
    <div
      className="app-container"
      onClick={handleClick}
    >
      <div className="content-wrapper">
        <AnimatePresence>
          <ExplodingText
            key={phraseIndex}
            text={CONFIG.PHRASES[phraseIndex]}
            mousePos={mousePos}
          />
        </AnimatePresence>

        <div className="instruction-text">
          Click anywhere to explode
        </div>
      </div>
    </div>
  );
}

export default App;
