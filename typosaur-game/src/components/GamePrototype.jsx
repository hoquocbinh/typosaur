import React from 'react';
import PhaserGame from '../phaser/PhaserGame';
import GameHUD from './GameHUD/GameHUD';
import { useGameLogic } from '../hooks/useGameLogic';
import '../styles/global.css'; // Assuming we create this

const GamePrototype = ({ onGameOver }) => {
    const {
        currentWord,
        input,
        score,
        timeLeft,
        maxTime,
        wordHidden,
        targetPos,
        colorTheme
    } = useGameLogic(onGameOver);

    return (
        <div className="game-container">
            <PhaserGame />
            <GameHUD
                score={score}
                timeLeft={timeLeft}
                maxTime={maxTime}
                currentWord={currentWord}
                targetPos={targetPos}
                inputLength={input.length}
                wordHidden={wordHidden}
                colorTheme={colorTheme}
            />
        </div>
    );
};

export default GamePrototype;