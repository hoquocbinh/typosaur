import React from 'react';
import './ScoreBoard.css';

const ScoreBoard = ({ score }) => {
    return (
        <div className="score-board">
            SCORE: {score}
        </div>
    );
};

export default ScoreBoard;
