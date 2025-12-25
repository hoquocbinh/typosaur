import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainScene from './MainScene';
import { GAME_CONFIG } from '../constants/settings';

const PhaserGame = () => {
    const gameContainerRef = useRef(null);
    const gameInstanceRef = useRef(null);

    useEffect(() => {
        if (gameInstanceRef.current) return;

        const config = {
            type: Phaser.AUTO,
            parent: gameContainerRef.current,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: '#f0f0f0',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: false
                }
            },
            scene: [MainScene],
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        };

        gameInstanceRef.current = new Phaser.Game(config);

        // Global Event Bridge
        window.triggerPhaser = (event, data) => {
            if (gameInstanceRef.current) {
                gameInstanceRef.current.events.emit(event, data);
            }
        };

        return () => {
            if (gameInstanceRef.current) {
                gameInstanceRef.current.destroy(true);
                gameInstanceRef.current = null;
            }
        };
    }, []);

    return <div ref={gameContainerRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }} />;
};

export default PhaserGame;
