import React from 'react';
import CardsFigure from './cardsFigure';

/* Funcion que representa la informacion de un jugador en el juego,
  mostrando su nombre y las cartas que posee */
const PlayerPanel = ({ game, player }) => {
    return (
      <div className="flex flex-col items-center">
        <h2>{player}</h2>
        {/* muestra el nombre del jugador */}
        <div className="flex space-x-2">
          <CardsFigure gameId={game} playerId={player} />
        </div>
      </div>
    );
  };
  
  export default PlayerPanel;
  