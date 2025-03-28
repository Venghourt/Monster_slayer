import React, { useState } from 'react';
import './index.css';
import Header from './components/Header';
import Entity from './components/Entity';
import GameOver from './components/GameOver';
import Controls from './components/Controls';
import Log from './components/Log';

function App() {
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [round, setRound] = useState(0);
  const [logs, setLogs] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const MIN_DAMAGE = 5;
  const MAX_DAMAGE = 12;
  const HEAL_AMOUNT = 15;
  const MONSTER_MIN_DAMAGE = 8;
  const MONSTER_MAX_DAMAGE = 15;

  const addLog = (text, isPlayer, isDamage) => {
    setLogs(prev => [...prev, { text, isPlayer, isDamage }]);
  };

  const monsterAttack = () => {
    const damage = Math.floor(Math.random() * (MONSTER_MAX_DAMAGE - MONSTER_MIN_DAMAGE + 1)) + MONSTER_MIN_DAMAGE;
    setPlayerHealth(prev => Math.max(0, prev - damage));
    addLog(`attacks for ${damage} damage`, false, true);
  };

  const checkGameOver = () => {
    if (playerHealth <= 0 || monsterHealth <= 0) {
      setGameOver(true);
      setWinner(playerHealth <= 0 ? 'monster' : 'player');
    }
  };

  const handleAttack = () => {
    const damage = Math.floor(Math.random() * (MAX_DAMAGE - MIN_DAMAGE + 1)) + MIN_DAMAGE;
    setMonsterHealth(prev => Math.max(0, prev - damage));
    addLog(`attacks for ${damage} damage`, true, true);
    
    if (monsterHealth > damage) monsterAttack();
    setRound(prev => prev + 1);
    checkGameOver();
  };

  const handleSpecial = () => {
    const damage = Math.floor(Math.random() * (MAX_DAMAGE - MIN_DAMAGE + 1)) + MIN_DAMAGE * 2;
    setMonsterHealth(prev => Math.max(0, prev - damage));
    addLog(`uses SPECIAL for ${damage} damage!`, true, true);
    
    if (monsterHealth > damage) monsterAttack();
    setRound(0);
    checkGameOver();
  };

  const handleHeal = () => {
    const heal = Math.min(HEAL_AMOUNT, 100 - playerHealth);
    setPlayerHealth(prev => Math.min(100, prev + HEAL_AMOUNT));
    addLog(`heals for ${heal} HP`, true, false);
    monsterAttack();
    setRound(prev => prev + 1);
    checkGameOver();
  };

  const handleSuicide = () => {
    setPlayerHealth(0);
    addLog('commits suicide!', true, true);
    setGameOver(true);
    setWinner('monster');
  };

  const resetGame = () => {
    setMonsterHealth(100);
    setPlayerHealth(100);
    setRound(0);
    setLogs([]);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div>
      <Header />
      <Entity health={monsterHealth} name="Monster" />
      <Entity health={playerHealth} name="Your" />
      
      {gameOver ? (
        <GameOver onRestart={resetGame} winner={winner} />
      ) : (
        <Controls 
          onAttack={handleAttack}
          onSpecial={handleSpecial}
          onHeal={handleHeal}
          onSuicide={handleSuicide}
        />
      )}
      
      <Log logs={logs} />
    </div>
  );
}

export default App;