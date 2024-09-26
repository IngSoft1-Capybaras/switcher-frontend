import React, { useContext } from 'react';
import { useGameContext } from '../context/GameContext'; // Asegúrate de que esta ruta sea correcta
import CardsMoviment from '../components/ui/cardsMoviment';
import CardsFigure from '../components/ui/cardsFigure';

const ActiveGame = () => {
  const { gameId, playerId } = useGameContext(); // Obtener gameId y playerId del contexto

  return (
    <div>
      <h1>Juego Activo</h1>
      {/* Renderiza las cartas de movimiento del jugador actual */}
      <div className="flex space-x-4">
        <h2>Cartas de Movimiento</h2>
        <CardsMoviment gameId={gameId} playerId={playerId} />
      </div>
      {/* Renderiza las cartas de figura del jugador actual */}
      <div className="flex space-x-8">
        <h2>Cartas de Figura</h2>
        <CardsFigure gameId={gameId} playerId={playerId} />
      </div>
    </div>
  );
};

export default ActiveGame;
