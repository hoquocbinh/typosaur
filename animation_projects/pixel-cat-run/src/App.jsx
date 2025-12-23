import GameCanvas from './components/GameCanvas';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>Pixel Cat Runner</h1>
      <GameCanvas />
      <p className="instructions">Space to Jump | 'E' to Eat</p>
    </div>
  );
}

export default App;
