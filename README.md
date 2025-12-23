# Typosaur

Typosaur is a typing game application where players control a running pixel-art dinosaur/cat by typing words correctly and quickly.

## Project Structure

*   **/client**: The frontend application built with React, Vite, and Phaser.
*   **/TypingGame.Api**: The backend API Service (ASP.NET Core).
*   **/animation_projects**: Prototypes and animation experiments.
*   **/docs**: Project documentation (or root `*.md` files).

## Getting Started

### Client (Frontend)

The client is a React application that uses Phaser for the game rendering (character jump, run, background dynamics).

**Prerequisites:** Node.js (v16+)

1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    The app will start at `http://localhost:5173`.

### Backend (API)

*See [api_guide.md](./api_guide.md) for endpoint details.*

The backend handles session management, word validation, and leaderboards.

1.  Navigate to `TypingGame.Api`.
2.  Run the .NET project (requires .NET SDK).

## Documentation

*   [API Guide](./api_guide.md): Details of the backend endpoints.
*   [Project Requirements](./project_requirements_wbs.md): Feature breakdown and WBS.
*   [Backend Implementation](./backend_implementation.md): Implementation details for the server.

## Features

*   **Pixel Art Graphics**: Retro-style running character.
*   **Dynamic Backgrounds**: Background color changes on jump actions.
*   **Typing Mechanics**: Type words to "eat" them and jump over obstacles.
