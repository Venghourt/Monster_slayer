import React from 'react';

function GameOver({ onRestart, winner }) {
  return (
    <section className="container">
      <h2>Game Over!</h2>
      {winner === 'player' ? <h3>You won!</h3> : <h3>You lost!</h3>}
      <button onClick={onRestart}>Start New Game</button>
    </section>
  );
}

export default GameOver;