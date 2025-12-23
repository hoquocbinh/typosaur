import React, { useState, useEffect, useRef } from 'react';
import PhaserGame from './PhaserGame';

const WORD_LIST = ["react", "phaser", "gaming", "pixel", "retro", "logic", "coding", "javascript", "developer", "browser", "engine", "sprite", "physics", "canvas", "webgl"];

const INITIAL_TIME = 5000;

const GamePrototype = ({ onGameOver }) => {
    const [currentWord, setCurrentWord] = useState('');
    const [input, setInput] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [maxTime, setMaxTime] = useState(INITIAL_TIME);
    const [wordHidden, setWordHidden] = useState(false);

    const timerRef = useRef(null);

    useEffect(() => {
        spawnNewWord();
        return () => clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 10) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 100;
            });
        }, 100);
        return () => clearInterval(timerRef.current);
    }, [currentWord, score]);

    useEffect(() => {
        if (timeLeft === 0) {
            spawnNewWord();
        }
    }, [timeLeft]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Backspace') {
                setInput(prev => prev.slice(0, -1));
                return;
            }

            if (e.key.length !== 1 || !/^[a-zA-Z ]$/.test(e.key)) return;

            const char = e.key.toLowerCase();

            setInput(prev => {
                const next = prev + char;
                if (currentWord.startsWith(next)) {
                    if (next === currentWord) {
                        // HIDE the word immediately before animation
                        setWordHidden(true);

                        // Trigger Phaser Animation
                        if (window.triggerPhaser) {
                            // Small delay to ensure DOM updates before reading positions
                            setTimeout(() => {
                                const charSpans = document.querySelectorAll('.word-display .char');
                                const charPositions = Array.from(charSpans).map((span) => {
                                    const rect = span.getBoundingClientRect();
                                    return {
                                        char: span.textContent,
                                        x: rect.left + rect.width / 2,
                                        y: rect.top + rect.height / 2
                                    };
                                });

                                window.triggerPhaser('TRIGGER_EAT', {
                                    word: currentWord,
                                    charPositions: charPositions
                                });
                            }, 10);
                        }

                        setTimeout(() => {
                            setScore(s => s + 1);
                            spawnNewWord();
                            setInput('');
                            setWordHidden(false); // Show word again
                        }, 200);
                        return next;
                    }
                    return next;
                } else {
                    setTimeLeft(t => Math.max(0, t - 500));
                    return prev;
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentWord]);

    const spawnNewWord = () => {
        const randWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
        setCurrentWord(randWord);
        setInput('');
        setWordHidden(false);
        const newMaxTime = Math.max(10000, INITIAL_TIME - (score * 100));
        setMaxTime(newMaxTime);
        setTimeLeft(newMaxTime);
    };

    return (
        <div className="game-container">
            <PhaserGame />

            <div className="score-board">SCORE: {score}</div>

            <div className="word-area">
                <div
                    className="word-display"
                    style={{
                        background: "none",
                        opacity: wordHidden ? 0 : 1,
                        transition: 'opacity 0.1s'
                    }}
                >
                    {currentWord.split('').map((char, index) => (
                        <span key={index} className={`char ${index < input.length ? 'typed' : ''}`}>
                            {char}
                        </span>
                    ))}
                </div>

                <div className="timer-bar-container">
                    <div
                        className="timer-bar"
                        style={{
                            width: `${(timeLeft / maxTime) * 100}%`,
                            backgroundColor: timeLeft < 1500 ? '#ff4d4d' : '#fff'
                        }}
                    />
                </div>
            </div>

            <div className="hotkeys-hint">TYPE THE WORD TO EAT!</div>
        </div>
    );
};

export default GamePrototype;