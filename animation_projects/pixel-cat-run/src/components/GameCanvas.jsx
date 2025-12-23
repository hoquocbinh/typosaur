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
        backgroundColorRef,
        eat
    } = useGameLogic(canvasRef);

    const [imagesLoaded, setImagesLoaded] = useState(false);
    const spriteSheetRef = useRef(null);
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

            // Detect White (new cat) OR Checkerboard Greys OR Green Screen
            // "Grey" is when R, G, B are similar.
            // But we must NOT remove Black (0,0,0) or very dark outlines.
            // Let's protect anything where R < 30 (Dark).

            const isGrey = Math.abs(r - g) < 30 && Math.abs(r - b) < 30 && r > 40;
            const isWhite = r > 200 && g > 200 && b > 200;
            const isGreenScreen = g > r + 40 && g > b + 40;

            if (isWhite || isGrey || isGreenScreen) {
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
        const sheetImg = new Image();
        sheetImg.src = '/assets/cat_spritesheet.png';

        const obsImg = new Image();
        obsImg.src = '/assets/obstacle.png';

        let loadedCount = 0;
        const totalImages = 2;
        const checkLoad = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                // Process images to remove background
                spriteSheetRef.current = getTransparentImage(sheetImg);
                obstacleImageRef.current = getTransparentImage(obsImg);
                setImagesLoaded(true);
            }
        };

        sheetImg.onload = checkLoad;
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
            } else if ((e.code === 'ArrowDown' || e.code === 'KeyE') && gameState === 'PLAYING') {
                eat();
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
            if (spriteSheetRef.current) {
                // Sprite Sheet Logic
                // 5 Columns, 3 Rows (Run, Jump, Eat)
                const totalCols = 5;
                const totalRows = 3;
                const spriteW = spriteSheetRef.current.width / totalCols;
                const spriteH = spriteSheetRef.current.height / totalRows;

                let row = 0; // Default Run
                if (cat.isEating) {
                    row = 2; // Eat (Row 3, index 2)
                } else if (cat.isJumping) {
                    row = 1; // Jump (Row 2, index 1)
                }

                // Animation tick
                frameRef.current++;
                const frameSpeed = 8; // Adjust for smoothness
                const col = Math.floor(frameRef.current / frameSpeed) % totalCols;

                // Source Y based on Row
                const sy = row * spriteH;

                ctx.drawImage(
                    spriteSheetRef.current,
                    col * spriteW, sy, spriteW, spriteH, // Source (x, y, w, h)
                    cat.x, cat.y, cat.width, cat.height // Dest (x, y, w, h)
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
