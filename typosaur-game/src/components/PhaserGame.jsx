import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainScene from '../game/MainScene';

const PhaserGame = ({ onEvent }) => {
    const gameContainerRef = useRef(null);
    const gameRef = useRef(null);

    useEffect(() => {
        if (!gameContainerRef.current) return;

        const config = {
            type: Phaser.AUTO,
            parent: gameContainerRef.current,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: '#000000',
            pixelArt: true,
            scene: MainScene,
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        };

        const game = new Phaser.Game(config);
        gameRef.current = game;

        // Expose trigger methods to parent via a ref or global event bus
        window.triggerPhaser = (event, data) => {
            game.events.emit(event, data);
        };

        return () => {
            game.destroy(true);
            window.triggerPhaser = null;
        };
    }, []);

    return (
        <div
            ref={gameContainerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0
            }}
        />
    );
};

export default PhaserGame;
