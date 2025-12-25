import React, { useEffect, useState } from 'react';

const RESTART_PHRASES = ["im noob", "rip", "try again"];

const GameOver = ({ score, onRestart }) => {
    const [input, setInput] = useState('');

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Backspace') {
                setInput(prev => prev.slice(0, -1));
                return;
            }

            if (e.key.length === 1 && /^[a-zA-Z ]$/.test(e.key)) {
                setInput(prev => {
                    const next = prev + e.key.toLowerCase();

                    const matched = RESTART_PHRASES.find(phrase => phrase === next);
                    if (matched) {
                        onRestart();
                        return '';
                    }

                    const isPrefix = RESTART_PHRASES.some(phrase => phrase.startsWith(next));
                    if (isPrefix) {
                        return next;
                    } else {
                        return '';
                    }
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="game-over-container">
            <h1 style={{ fontSize: '4rem', color: '#ff4d4d' }}>GAME OVER</h1>
            <h2>Score: {score}</h2>
            <div className="restart-prompt">
                <p>Type one of the following to restart:</p>
                <ul className="phrases-list">
                    {RESTART_PHRASES.map(p => (
                        <li key={p} className={input && p.startsWith(input) ? "highlight" : ""}>
                            {p}
                        </li>
                    ))}
                </ul>
                <div className="current-input">
                    &gt; {input}<span className="cursor">_</span>
                </div>
            </div>
        </div>
    );
};

export default GameOver;
