// src/contexts/GameContext.js
import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [username, setUsername] = useState(''); // nombre de usuario
  const [activeGameId, setActiveGameId] = useState(null); // id de la partida

  return (
    <GameContext.Provider value={{ username, setUsername, activeGameId, setActiveGameId }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);