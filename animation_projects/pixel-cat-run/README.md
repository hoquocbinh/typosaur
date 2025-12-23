# Pixel Cat Run

A React + Vite based endless runner game using HTML5 Canvas.

## Project Overview
This project is an endless runner game where a pixel art cat runs, jumps over obstacles, and accumulates a score. The game logic is decoupled from the rendering loop for better performance and separation of concerns.

## Technical Stack
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: JavaScript (JSX)
- **Styling**: CSS (Vanilla)
- **Rendering**: HTML5 Canvas API

## Directory Structure
```
src/
├── components/
│   └── GameCanvas.jsx    # Main component handling the Canvas rendering loop and input
├── hooks/
│   └── useGameLogic.js   # Custom hook containing all game physics, state management, and collision logic
├── App.jsx               # Root component
└── main.jsx             # Entry point
```

## Core Components & Logic

### `src/components/GameCanvas.jsx`
- **Responsibility**: Handles the visual layer.
- **Key Features**:
    - **Render Loop**: Uses `requestAnimationFrame` to draw the game state (Cat, Obstacles, Background) onto the `<canvas>`.
    - **Asset Loading**: Loads images (`cat.png`, `obstacle.png`) and processes them (e.g., removing backgrounds) before the game starts.
    - **Input Handling**: Listens for 'Space' or 'ArrowUp' to trigger jump actions.
    - **Responsive Design**: Auto-resizes the canvas to full screen on window resize.

### `src/hooks/useGameLogic.js`
- **Responsibility**: Handles the "Business Logic" / Physics.
- **Key State/Refs**:
    - `gameState`: 'START', 'PLAYING', 'GAME_OVER'.
    - `catRef`: Stores the cat's position (`x`, `y`), velocity, and dimensions.
    - `obstaclesRef`: Array of current obstacle objects.
    - `speedRef`: Current game speed (increases over time).
    - `scoreRef`: Current score (based on distance/time).
- **Key Functions**:
    - `update(time)`: The main game tick. Updates physics (gravity), moves obstacles, spawns new ones, and checks collisions.
    - `jump()`: Applies negative vertical velocity to the cat.
    - `resetGame()`: Resets all refs and state to initial values.

## Game Mechanics
1.  **Gravity**: Constant downward force applied to the cat's `velocity`.
2.  **Jumping**: Instant upward velocity change when on the ground.
3.  **Spawning**: Obstacles spawn at the right edge of the screen at intervals determined by current speed.
4.  **Collision**: AABB (Axis-Aligned Bounding Box) collision detection between the Cat and Obstacles with a small padding allowance.

## running Locally
1.  Install dependencies: `npm install`
2.  Start dev server: `npm run dev`
