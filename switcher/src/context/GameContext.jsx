// src/contexts/GameContext.js
import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [username, setUsername] = useState(''); // nombre de usuario
  const [activeGameId, setActiveGameId] = useState(null); // id de la partida
  const [currentPlayerId, setCurrentPlayerId] = useState({}); // ID del jugador de turno
  const [players, setPlayers] = useState([
    { id: 0, name: "Jugador 1", isCurrent: true, cards: [] }, // jugador de turno},
    { id: 1, name: "Jugador 2", isCurrent: false, cards: [] },
    { id: 2, name: "Jugador 3", isCurrent: false, cards: [] },
    { id: 3, name: "Jugador 4", isCurrent: false, cards: [] },
  ]); // estado de los jugadores

    return (
    <GameContext.Provider value={{ username, setUsername, activeGameId, setActiveGameId, players, setPlayers, currentPlayerId, setCurrentPlayerId}}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
