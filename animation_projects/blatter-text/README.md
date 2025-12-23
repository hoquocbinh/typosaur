# Flying Text Animation

A React-based interactive animation project where text explodes into particles and flies to the cursor location upon user interaction. Built with **React** (Vite) and **Framer Motion**.

## Features

*   **Interactive Explosion Effect**: Click anywhere to activate the text explosion effect.
*   **Physics-Based Scattering Effect**: Characters are fired in a circular pattern with random physics.
*   **Flying Characters**: After explosion, characters fly towards the cursor's current position while fading out.
*   **Seamless Transitions**: New text appears immediately while the previous phrase explodes.
*   **Customizable**: Adjust timing, physics, and phrases via a simple config file.

## Getting Started

### Prerequisites

*   Node.js installed.

### Installation

1.  Navigate to the project directory:
    ```bash
    cd animation_projects/blatter-text
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App

Start the development server:

```bash
npm run dev
```

## Configuration

Customize the animation behavior in `src/config.js`:

```javascript
export const CONFIG = {
  // Animation timing (seconds)
  EXPLOSION_DURATION: 0.8,
  FLIGHT_DURATION: 1.2,
  STAGGER_MAX_DELAY: 0.0, // Set to 0 for immediate appearance

  // Visual Physics
  MIN_RADIUS: 300,
  MAX_RADIUS: 500,
  ROTATION_RANGE: 160,

  // Content
  PHRASES: [ ... ]
};
```

## Tech Stack

*   [React](https://reactjs.org/)
*   [Vite](https://vitejs.dev/)
*   [Framer Motion](https://www.framer.com/motion/)
