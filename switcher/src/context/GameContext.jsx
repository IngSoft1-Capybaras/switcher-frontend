import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [activeGameId, setActiveGameId] = useState(null);
  const [gameState, setGameState] = useState(null); // Agregar gameState al contexto

  return (
    <GameContext.Provider value={{ username, setUsername, activeGameId, setActiveGameId, gameState, setGameState }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
