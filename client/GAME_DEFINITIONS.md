# Game Definitions & Assets

This document defines the key entities, assets, and terminology used in the Typosaur game.

## Characters

### Hero (The Player)
- **Concept**: A running pixel-art character (currently a Cat).
- **Behavior**: Runs continuously, jumps over obstacles/villains, and "eats" text.
- **Visuals**:
    - **Idle/Run**: Standard running animation.
    - **Jump**: Triggered by spacebar/events.
    - **Eat**: Triggered when a word is successfully typed.
- **Future Options**: Dog, Turtle (can be toggled or selected).

### Villain (The Obstacle)
- **Concept**: The antagonist chasing or blocking the hero.
- **Current Asset**: A giant "Villain" sprite in the background.
- **Behavior**: Currently static or subtle background animation. Can flash when words are completed.

## Environment

### background-image
- **Concept**: The scrolling backdrop setting the scene (e.g., city, forest, space).

### The Road
- **Concept**: The ground platform the hero runs on.
- **Behavior**: Scrolls horizontally to simulate movement speed.

## Gameplay Elements

### Text-Word ("The Target")
- **Concept**: The current word the player must type.
- **Visuals**: Displayed prominently in the center.
- **States**:
    - **Normal**: Untyped characters (Gradient Blue).
    - **Typed**: Characters correctly typed by the player (Green).
    - **Exploding**: Upon completion, the word breaks apart.

### Text-Characters ("Particles")
- **Concept**: Individual letters of the word.
- **Behavior**:
    - **Typing**: Change color as typed.
    - **Explosion**: When word finishes, they physics-scatter and fly towards the **Hero**.

## UI Elements
- **Timer Bar**: Indicates time remaining to type the current word.
- **Score Board**: Displays current score.
