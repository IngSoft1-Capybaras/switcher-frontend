import React from 'react';
import CardsFigure from './cardsFigure';

/* Funcion que representa la informacion de un jugador en el juego,
  mostrando su nombre y las cartas que posee */
const PlayerPanel = ({ playerName, cartas }) => {
    return (
      <div className="flex flex-col items-center">
        <h2>{playerName}</h2>
        <div className="flex space-x-2">
          {cartas.map((carta, index) => (
            <CardsFigure 
              key={index} 
              type={carta.type} 
              show={carta.show} 
              difficulty={carta.difficulty} />
          ))}
        </div>
      </div>
    );
  };
  
  export default PlayerPanel;
  