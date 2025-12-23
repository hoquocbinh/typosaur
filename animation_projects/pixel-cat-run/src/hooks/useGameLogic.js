import { useState, useEffect, useRef, useCallback } from 'react';

const GRAVITY = 0.6;
const JUMP_STRENGTH = -12;
const GAME_SPEED_START = 5;
const SPAWN_RATE = 1500; // ms

const getRandomLightColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 90%)`; // Pastel colors
};

export const useGameLogic = (canvasRef) => {
    const [gameState, setGameState] = useState('START'); // START, PLAYING, GAME_OVER
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    // Game state refs for performance in loop
    const catRef = useRef({
        x: 50,
        y: 0, // Will be set based on canvas height
        width: 100, // INCREASED SIZE
        height: 200, // INCREASED SIZE
        velocity: 0,
        isJumping: false,
        groundY: 0,
    });

    const obstaclesRef = useRef([]);
    const requestRef = useRef();
    const speedRef = useRef(GAME_SPEED_START);
    const lastSpawnTimeRef = useRef(0);
    const scoreRef = useRef(0);
    const backgroundColorRef = useRef('#f0f0f0');

    const spawnObstacle = useCallback((canvasWidth) => {
        // Simple obstacle generation
        const type = Math.random() > 0.5 ? 'CACTUS' : 'ROCK';
        obstaclesRef.current.push({
            x: canvasWidth,
            y: catRef.current.groundY - (type === 'CACTUS' ? 100 : 100),
            width: type === 'CACTUS' ? 100 : 100,
            height: type === 'CACTUS' ? 100 : 100,
            type,
        });
    }, []);

    const resetGame = useCallback(() => {
        setGameState('PLAYING');
        setScore(0);
        scoreRef.current = 0;
        speedRef.current = GAME_SPEED_START;
        obstaclesRef.current = [];
        catRef.current.y = catRef.current.groundY - catRef.current.height;
        catRef.current.velocity = 0;
        lastSpawnTimeRef.current = performance.now();
    }, []);

    const jump = useCallback(() => {
        if (catRef.current.y >= catRef.current.groundY - catRef.current.height - 5) { // Allow tolerance
            catRef.current.velocity = JUMP_STRENGTH;
            catRef.current.isJumping = true;
            backgroundColorRef.current = getRandomLightColor();
        }
    }, []);

    const update = useCallback((time) => {
        if (gameState !== 'PLAYING') return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // 1. Physics (Cat)
        catRef.current.velocity += GRAVITY;
        catRef.current.y += catRef.current.velocity;

        // Ground collision
        const groundLevel = catRef.current.groundY - catRef.current.height;
        if (catRef.current.y > groundLevel) {
            catRef.current.y = groundLevel;
            catRef.current.velocity = 0;
            catRef.current.isJumping = false;
        }

        // 2. Obstacles
        // Move obstacles
        obstaclesRef.current.forEach(obs => {
            obs.x -= speedRef.current;
        });

        // Remove off-screen obstacles
        obstaclesRef.current = obstaclesRef.current.filter(obs => obs.x + obs.width > 0);

        // Spawn new obstacles
        if (time - lastSpawnTimeRef.current > SPAWN_RATE / (speedRef.current / GAME_SPEED_START)) {
            spawnObstacle(canvas.width);
            lastSpawnTimeRef.current = time;
            // Increase speed slightly
            speedRef.current += 0.05;
        }

        // 3. Collision Detection
        const cat = catRef.current;
        // Simple AABB collision
        const collision = obstaclesRef.current.some(obs => {
            const padding = 20; // Hitbox padding (increased for bigger cat)
            return (
                cat.x < obs.x + obs.width - padding &&
                cat.x + cat.width > obs.x + padding &&
                cat.y < obs.y + obs.height - padding &&
                cat.y + cat.height > obs.y + padding
            );
        });

        if (collision) {
            setGameState('GAME_OVER');
            if (scoreRef.current > highScore) {
                setHighScore(Math.floor(scoreRef.current));
            }
        }

        // 4. Score
        scoreRef.current += 0.1 * (speedRef.current / GAME_SPEED_START);
        setScore(Math.floor(scoreRef.current));

        requestRef.current = requestAnimationFrame((t) => update(t));
    }, [gameState, highScore, spawnObstacle, canvasRef]);


    useEffect(() => {
        if (gameState === 'PLAYING') {
            requestRef.current = requestAnimationFrame((t) => update(t));
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState, update]);

    // Initial setup for ground level
    useEffect(() => {
        if (canvasRef.current) {
            const paddingBottom = 20;
            catRef.current.groundY = canvasRef.current.height - paddingBottom;
            if (gameState === 'START') {
                catRef.current.y = catRef.current.groundY - catRef.current.height;
            }
        }
    }, [canvasRef, gameState]);


    return {
        gameState,
        score,
        highScore,
        resetGame,
        jump,
        catRef,
        obstaclesRef,
        speedRef,
        backgroundColorRef
    };
};
