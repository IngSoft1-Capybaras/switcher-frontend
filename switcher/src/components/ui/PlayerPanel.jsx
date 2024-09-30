import React from 'react';
import CardsFigure from './CardsFigure';

/* Funcion que representa la informacion de un jugador en el juego,
  mostrando su nombre y las cartas que posee */
const PlayerPanel = ({ game, player, name }) => {
    return (
      <div className="flex flex-col items-center">
        <h2>{name}</h2>
        {/* muestra el nombre del jugador */}
        <div className="flex space-x-2">
          <CardsFigure gameId={game} playerId={player} />
        </div>
      </div>
    );
  };
  
  export default PlayerPanel;
  