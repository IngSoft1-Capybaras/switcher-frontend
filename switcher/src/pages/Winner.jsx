import React, { useContext } from 'react';
import { useGameContext } from '../context/GameContext'; 
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const Winner = () => {
  const { activeGameId, playerId } = useGameContext(); // Obtener gameId y playerId del contexto
  const navigate = useNavigate();

  const handleGoToGames = () => {
    navigate('/games');
  };

  return (
    <div>
      <h1>Winner</h1>
      {/* Aquí puedes agregar lógica adicional para mostrar el ganador */}
      <div className="flex space-x-4">
        {/* Muestra los IDs para comprobar que los estás recibiendo */}
        <h2>Game ID: {activeGameId}</h2>
        <h2>Player ID: {playerId}</h2>
        {/* Botón de ejemplo, si lo necesitas */}
        <Button onClick={handleGoToGames}>Volver al inicio</Button>
      </div>
    </div>
  );
};

export default Winner;
