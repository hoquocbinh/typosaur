import React from 'react';
import './TimerBar.css';
import { GAME_CONFIG } from '../../constants/settings';

const TimerBar = ({ timeLeft, maxTime }) => {
    const isCritical = timeLeft < 1500;
    const widthPercentage = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));

    return (
        <div className="timer-bar-container">
            <div
                className="timer-bar"
                style={{
                    width: `${widthPercentage}%`,
                    backgroundColor: isCritical ? '#ff4d4d' : '#fff'
                }}
            />
        </div>
    );
};

export default TimerBar;
