import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GamePrototype from './components/GamePrototype';
import GameOver from './components/GameOver';
import './styles/global.css';

function Game() {
  const [gameState, setGameState] = useState('PLAYING');
  const [lastScore, setLastScore] = useState(0);

  const handleGameOver = (score) => {
    setLastScore(score);
    setGameState('GAME_OVER');
  };

  const handleRestart = () => {
    setGameState('PLAYING');
  };

  return (
    <>
      {gameState === 'PLAYING' && (
        <GamePrototype onGameOver={handleGameOver} />
      )}
      {gameState === 'GAME_OVER' && (
        <GameOver score={lastScore} onRestart={handleRestart} />
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Game />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
