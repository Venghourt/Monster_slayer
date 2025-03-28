// src/components/Game.jsx
import React, { useState } from 'react';
import Entity from './Entity';
import Controls from './Controls';
import GameOver from './GameOver';
import Log from './Log';

function Game() {
  // Game constants
  const MIN_DAMAGE = 5;
  const MAX_DAMAGE = 12;
  const HEAL_AMOUNT = 15;
  const MONSTER_DAMAGE = 8;
  const SPECIAL_ATTACK_INTERVAL = 3;

  // Game state
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [round, setRound] = useState(0);
  const [logs, setLogs] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // Helper functions
  const getRandomValue = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const addLog = (text, isPlayer, isDamage) => {
    setLogs(prev => [...prev, { text, isPlayer, isDamage }]);
  };

  const monsterAttack = () => {
    const damage = getRandomValue(MONSTER_DAMAGE - 2, MONSTER_DAMAGE + 2);
    setPlayerHealth(prev => Math.max(0, prev - damage));
    addLog(`attacks for ${damage} damage`, false, true);
  };

  const checkGameOver = () => {
    if (playerHealth <= 0 || monsterHealth <= 0) {
      setGameOver(true);
      setWinner(playerHealth <= 0 ? 'monster' : 'player');
    }
  };

  // Player actions
  const handleAttack = () => {
    const damage = getRandomValue(MIN_DAMAGE, MAX_DAMAGE);
    setMonsterHealth(prev => Math.max(0, prev - damage));
    addLog(`attacks for ${damage} damage`, true, true);
    
    if (monsterHealth > damage) monsterAttack();
    setRound(prev => prev + 1);
    checkGameOver();
  };

  const handleSpecialAttack = () => {
    const damage = getRandomValue(MIN_DAMAGE, MAX_DAMAGE) * 2;
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
      <Entity health={monsterHealth} name="Monster" />
      <Entity health={playerHealth} name="Player" />

      {gameOver ? (
        <GameOver 
          title={winner === 'player' ? 'You Won!' : 'You Lost!'} 
          onRestart={resetGame} 
        />
      ) : (
        <Controls 
          onAttack={handleAttack}
          onSpecialAttack={handleSpecialAttack}
          onHeal={handleHeal}
          onSuicide={handleSuicide}
          canSpecial={round >= SPECIAL_ATTACK_INTERVAL - 1}
          roundsLeft={SPECIAL_ATTACK_INTERVAL - round - 1}
        />
      )}

      <Log logs={logs} />
    </div>
  );
}

export default Game;