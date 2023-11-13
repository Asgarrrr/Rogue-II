import { useEffect } from 'react';
import { Game } from './game';

function App() {

  useEffect(() => {
    const game = new Game();
    game.init();
  }, []);

}

export default App
