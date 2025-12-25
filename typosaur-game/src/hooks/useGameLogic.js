import { useState, useEffect, useRef } from 'react';
import { WORD_LIST } from '../constants/words';
import { GAME_CONFIG, COLOR_THEMES } from '../constants/settings';

export const useGameLogic = (onGameOver) => {
    const [currentWord, setCurrentWord] = useState('');
    const [input, setInput] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.INITIAL_TIME);
    const [maxTime, setMaxTime] = useState(GAME_CONFIG.INITIAL_TIME);
    const [wordHidden, setWordHidden] = useState(false);
    const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });

    const timerRef = useRef(null);

    // Calculate Target Position (Cat)
    useEffect(() => {
        const updateTargetPos = () => {
            setTargetPos({
                x: window.innerWidth * 0.15,
                y: window.innerHeight - 100
            });
        };

        updateTargetPos();
        window.addEventListener('resize', updateTargetPos);
        return () => window.removeEventListener('resize', updateTargetPos);
    }, []);

    // Game Loop / Timer
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
                    return 0; // Game Over state handling needed
                }
                return prev - GAME_CONFIG.TIMER_DECREMENT;
            });
        }, GAME_CONFIG.TIMER_DECREMENT);
        return () => clearInterval(timerRef.current);
    }, [currentWord, score]);

    useEffect(() => {
        if (timeLeft === 0) {
            if (onGameOver) onGameOver(score);
        }
    }, [timeLeft]);

    // Input Handling
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
                        handleWordComplete();
                        return next;
                    }
                    return next;
                } else {
                    setTimeLeft(t => Math.max(0, t - GAME_CONFIG.PENALTY_TIME));
                    return prev;
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentWord]);

    const handleWordComplete = () => {
        setWordHidden(true);
        triggerPhaserAction();

        setTimeout(() => {
            setScore(s => s + 1);
            spawnNewWord();
            setInput('');
            setWordHidden(false);
        }, 200); // Visual delay
    };

    const triggerPhaserAction = () => {
        if (window.triggerPhaser) {
            setTimeout(() => {
                const charSpans = document.querySelectorAll('.target-char');
                const charPositions = Array.from(charSpans).map((span) => {
                    const rect = span.getBoundingClientRect();
                    return {
                        char: span.textContent,
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2
                    };
                });

                window.triggerPhaser(GAME_CONFIG.EVENTS.TRIGGER_EAT, {
                    word: currentWord,
                    charPositions: charPositions
                });
            }, 10);
        }
    };

    const spawnNewWord = () => {
        const randWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
        setCurrentWord(randWord);
        setInput('');
        setWordHidden(false);
        const newMaxTime = Math.max(GAME_CONFIG.MIN_TIME_LIMIT, GAME_CONFIG.INITIAL_TIME - (score * GAME_CONFIG.SCORE_MULTIPLIER));
        setMaxTime(newMaxTime);
        setTimeLeft(newMaxTime);
    };

    const getColorTheme = () => {
        if (score >= 20) return COLOR_THEMES.LEVEL_3;
        if (score >= 10) return COLOR_THEMES.LEVEL_2;
        if (score >= 5) return COLOR_THEMES.LEVEL_1;
        return COLOR_THEMES.DEFAULT;
    };

    return {
        currentWord,
        input,
        score,
        timeLeft,
        maxTime,
        wordHidden,
        targetPos,
        colorTheme: getColorTheme()
    };
};
