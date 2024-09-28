import React, { useContext, useEffect } from 'react';
import { useGameContext } from '../context/GameContext'; 
import CardsMovement from '../components/ui/CardsMovement';
import CardsFigure from '../components/ui/cardsFigure';
import EndTurnButton from '../components/ui/endShiftButton';
import { useNavigate } from 'react-router-dom';

const ActiveGame = () => {
  const { gameId, playerId, gameState } = useGameContext(); // Obtener gameId y playerId del contexto
  const navigate = useNavigate(); // Para redirección

  // Redirigir si el estado del juego es "FINISHED"
  useEffect(() => {
    if (gameState === 'FINISHED') {
      navigate('/winner'); // Redirige a la página del ganador
    }
  }, [gameState, navigate]);

  return (
    <div>
      <h1>Juego Activo</h1>
      {/* Renderiza las cartas de movimiento del jugador actual */}
      <div className="flex space-x-4">
        <h2>Cartas de Movimiento</h2>
        <CardsMovement gameId={gameId} playerId={playerId} />
      </div>
      {/* Renderiza las cartas de figura del jugador actual */}
      <div className="flex space-x-8">
        <h2>Cartas de Figura</h2>
        <CardsFigure gameId={gameId} playerId={playerId} />
      </div>

      {/* Agrega el botón de terminar turno */}
      <div className="mt-4">
        <EndTurnButton />
      </div>
    </div>
  );
};

export default ActiveGame;
