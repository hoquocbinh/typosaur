import { useRef, useEffect, useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import './GameCanvas.css';

const GameCanvas = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const {
        gameState,
        score,
        highScore,
        resetGame,
        jump,
        catRef,
        obstaclesRef,
        speedRef,
        backgroundColorRef
    } = useGameLogic(canvasRef);

    const [imagesLoaded, setImagesLoaded] = useState(false);
    const catImageRef = useRef(null);
    const obstacleImageRef = useRef(null);
    const frameRef = useRef(0);

    // Initial Resize to Fullscreen
    useEffect(() => {
        const resize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;

                if (catRef.current) {
                    // CENTER THE GAME
                    const newGround = window.innerHeight / 2 + 50;
                    catRef.current.groundY = newGround;
                    // If cat is on ground, snap it
                    if (!catRef.current.isJumping && gameState === 'START') {
                        catRef.current.y = newGround - catRef.current.height;
                    }
                }
            }
        };
        window.addEventListener('resize', resize);
        resize(); // Call once
        return () => window.removeEventListener('resize', resize);
    }, [catRef, gameState]);

    // Helper to remove background color (simple chroma key)
    const getTransparentImage = (image) => {
        const c = document.createElement('canvas');
        c.width = image.width;
        c.height = image.height;
        const cx = c.getContext('2d');
        cx.drawImage(image, 0, 0);
        const imgData = cx.getImageData(0, 0, c.width, c.height);
        const data = imgData.data;

        // Simple heuristic: if pixel is close to white or grid grey
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Detect White (new cat) OR Checkerboard Greys
            if ((r > 200 && g > 200 && b > 200) ||
                (Math.abs(r - g) < 20 && Math.abs(r - b) < 20 && r > 100)) {
                data[i + 3] = 0;
            }
        }
        cx.putImageData(imgData, 0, 0);
        const newImg = new Image();
        newImg.src = c.toDataURL();
        return newImg;
    };

    // Load Assets
    useEffect(() => {
        const catImg = new Image();
        catImg.src = '/assets/cat.png';

        const obsImg = new Image();
        obsImg.src = '/assets/obstacle.png';

        let loadedCount = 0;
        const checkLoad = () => {
            loadedCount++;
            if (loadedCount === 2) {
                // Process images to remove background
                catImageRef.current = getTransparentImage(catImg);
                obstacleImageRef.current = getTransparentImage(obsImg);
                setImagesLoaded(true);
            }
        };

        catImg.onload = checkLoad;
        obsImg.onload = checkLoad;
    }, []);

    // Input Handling
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                if (gameState === 'PLAYING') {
                    jump();
                } else if (gameState !== 'PLAYING') {
                    resetGame();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, jump, resetGame]);

    // Render Loop
    useEffect(() => {
        if (!imagesLoaded || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const render = () => {
            // Clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Background/Ground
            ctx.fillStyle = backgroundColorRef.current;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Ground Line
            ctx.strokeStyle = '#535353';
            ctx.lineWidth = 2;
            ctx.beginPath();
            const groundY = canvas.height / 2 + 50;
            ctx.moveTo(0, groundY);
            ctx.lineTo(canvas.width, groundY);
            ctx.stroke();

            // Draw Obstacles
            obstaclesRef.current.forEach(obs => {
                if (obstacleImageRef.current) {
                    ctx.drawImage(obstacleImageRef.current, obs.x, obs.y, obs.width, obs.height);
                } else {
                    ctx.fillStyle = '#555';
                    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                }
            });

            // Draw Cat
            const cat = catRef.current;
            if (catImageRef.current) {
                const spriteW = catImageRef.current.width / 3;
                const spriteH = catImageRef.current.height;

                let col = 0;

                // Animation tick - FASTER ANIMATION (Divisor 12)
                frameRef.current++;
                const slowFrame = Math.floor(frameRef.current / 12) % 3;

                if (gameState === 'PLAYING') {
                    // Running
                    col = slowFrame;
                    // If jumping, freeze on frame 1 (or 2)
                    if (cat.isJumping) col = 1;
                } else {
                    // IDLE
                    col = 0;
                }

                ctx.drawImage(
                    catImageRef.current,
                    col * spriteW, 0, spriteW, spriteH, // Source
                    cat.x, cat.y, cat.width, cat.height // Dest
                );

            } else {
                ctx.fillStyle = '#ff9900';
                ctx.fillRect(cat.x, cat.y, cat.width, cat.height);
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [imagesLoaded, gameState, catRef, obstaclesRef]);

    return (
        <div className="game-container" ref={containerRef} onClick={() => gameState === 'PLAYING' ? jump() : resetGame()}>
            <canvas
                ref={canvasRef}
                // Initial dimensions will be overwritten by resize effect
                width={window.innerWidth}
                height={window.innerHeight}
                className="game-canvas"
            />

            <div className="ui-layer">
                <div className="score-board">
                    <span>HI {highScore.toString().padStart(5, '0')}</span>
                    <span>{score.toString().padStart(5, '0')}</span>
                </div>

                {gameState === 'START' && (
                    <div className="center-msg">
                        <p>PRESS SPACE TO START</p>
                    </div>
                )}

                {gameState === 'GAME_OVER' && (
                    <div className="center-msg">
                        <p>GAME OVER</p>
                        <p className="sub-text">PRESS SPACE TO RESTART</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameCanvas;
