import React from 'react';

function Controls({ onAttack, onSpecial, onHeal, onSuicide }) {
  return (
    <section id="controls">
      <button onClick={onAttack}>ATTACK</button>
      <button onClick={onSpecial}>SPECIAL !</button>
      <button onClick={onHeal}>HEAL</button>
      <button onClick={onSuicide}>KILL YOURSELF</button>
    </section>
  );
}

export default Controls;