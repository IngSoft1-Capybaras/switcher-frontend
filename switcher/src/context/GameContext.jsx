import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [username, setUsername] = useState(''); // nombre de usuario
  const [activeGameId, setActiveGameId] = useState(null); // id de la partida
  const [playerId, setPlayerId] = useState(null); // id del jugador
  const [players, setPlayers] = useState([]);
  
  return (
    <GameContext.Provider value={{ username, setUsername, activeGameId, setActiveGameId, playerId, setPlayerId, players, setPlayers }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
