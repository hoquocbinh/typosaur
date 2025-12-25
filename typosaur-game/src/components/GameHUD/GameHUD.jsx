import React from 'react';
import ScoreBoard from '../ScoreBoard/ScoreBoard';
import TimerBar from '../TimerBar/TimerBar';
import TargetWord from '../TargetWord/TargetWord';
import { AnimatePresence } from 'framer-motion';
import './GameHUD.css';

const GameHUD = ({
    score,
    timeLeft,
    maxTime,
    currentWord,
    targetPos,
    inputLength,
    wordHidden,
    colorTheme
}) => {
    return (
        <div className="game-hud">
            <ScoreBoard score={score} />

            <div className="word-area">
                <AnimatePresence mode='wait'>
                    {!wordHidden && (
                        <TargetWord
                            key={currentWord}
                            text={currentWord}
                            targetPos={targetPos}
                            typedLength={inputLength}
                            colorTheme={colorTheme}
                        />
                    )}
                </AnimatePresence>

                <TimerBar timeLeft={timeLeft} maxTime={maxTime} />
            </div>

            <div className="hotkeys-hint">TYPE THE WORD TO EAT!</div>
        </div>
    );
};

export default GameHUD;
